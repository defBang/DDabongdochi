// db models : freeBoard model
const { freeList,
    bestFreeList,
    searchFreeWriter,
    searchFreeTag,
    searchFreeTitle,
    selectFree,
    selectFreeTagListById,
    selectFreeComment,
    insertFree,
    insertFreeTagList,
    selectFreeUpdatePage,
    updateFree,
    deleteFreeTagList,
    deleteFree,
    getFreeCount,
    getBestFreeCount,
    getFreeCountByWriter,
    getFreeCountByTag,
    getFreeCountByTitle,
    selectFreeWriterByPostId } = require('../models/freeBoard');

const { insertTagList } = require('../models/tag');

const { getPaginationData, getOffset, getCurrentPage, isInvalidPage } = require('../paging');
const { updateKorDateOnPage, updateDateOnList, updateDateOnListInPage } = require('../timeSet');

// 목록 쿼리에 대입할 변수
const LIMIT = '20'; // 한 번에 검색할 게시글 개수
const RATE = 20; // 추천글 조건 추천수

// 페이징에 필요한 변수
const POSTS_PER_PAGE = 20; // 한 페이지 당 표시할 게시글 개수
const DISPLAY_PAGE_NUM = 10; // 한 번에 표시할 페이지 개수
const PAGING_FLAG = 5; // 페이징 기준

/** 자유게시판 게시글 & 추천글 목록 */
exports.list = async (req, res, next) => {
    const mode = req.query.mode; // mode=best 추천글 목록
    const offset = getOffset(req.query.p); // offset 반환
    const currentPage = getCurrentPage(req.query.p); // 현재 페이지 검증 후 반환

    try {
        if (mode === "best") {
            const row = await getBestFreeCount(RATE);
            const paginationData = getPaginationData(PAGING_FLAG, currentPage, POSTS_PER_PAGE, row.total_posts, DISPLAY_PAGE_NUM);
            let result = await bestFreeList(RATE, LIMIT, offset);
            result = updateDateOnList(result);
            res.status(200).json([paginationData, result]);
        }
        else {
            const row = await getFreeCount();
            const paginationData = getPaginationData(PAGING_FLAG, currentPage, POSTS_PER_PAGE, row.total_posts, DISPLAY_PAGE_NUM);
            let result = await freeList(LIMIT, offset);
            result = updateDateOnList(result);
            res.status(200).json([paginationData, result]);
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};

/** 자유게시판 게시글 검색 결과 목록 */
exports.search = async (req, res, next) => {
    const offset = getOffset(req.query.p); // offset 반환
    const currentPage = getCurrentPage(req.query.p); // 현재 페이지 검증 후 반환

    try {
        if (req.query.writer !== undefined) {
            const row = await getFreeCountByWriter(req.query.writer);
            const paginationData = getPaginationData(PAGING_FLAG, currentPage, POSTS_PER_PAGE, row.total_posts, DISPLAY_PAGE_NUM);
            let result = await searchFreeWriter(req.query.writer, LIMIT, offset);
            result = updateDateOnList(result);
            res.status(200).json([paginationData, result]);
        }
        else if (req.query.title !== undefined) {
            const row = await getFreeCountByTitle(req.query.title);
            const paginationData = getPaginationData(PAGING_FLAG, currentPage, POSTS_PER_PAGE, row.total_posts, DISPLAY_PAGE_NUM);
            let result = await searchFreeTitle(req.query.title, LIMIT, offset);
            result = updateDateOnList(result);
            res.status(200).json([paginationData, result]);
        }
        else if (req.query.tag !== undefined) {
            const row = await getFreeCountByTag(req.query.tag);
            const paginationData = getPaginationData(PAGING_FLAG, currentPage, POSTS_PER_PAGE, row.total_posts, DISPLAY_PAGE_NUM);
            let result = await searchFreeTag(req.query.tag, LIMIT, offset);
            result = updateDateOnList(result);
            res.status(200).json([paginationData, result]);
        }
    } catch (error) {
        console.error(error);
        res.next(error);
    }
};

/** 자유게시판 게시글 페이지 */
exports.page = async (req, res, next) => {
    if(!isInvalidPage(req.params.id)) {
        return res.status(404).json({ "message": "잘못된 게시글 ID입니다." });
    }

    const id = parseInt(req.params.id);
    const isAdmin = (req.isAuthenticated()) ? req.user.is_admin : 0;
    
    try {
        const freeBoard = await selectFree(id);

        if (!freeBoard) {
            return res.status(404).json({ "message": "존재하지 않는 글입니다." });
        }

        freeBoard.date = updateKorDateOnPage(freeBoard.date);
        freeBoard.recent_update_date = updateKorDateOnPage(freeBoard.recent_update_date);

        const tagList = await selectFreeTagListById(id);
        let comment = await selectFreeComment(id);

        //console.log(comment.length);

        if (comment.length > 0) {
            comment = updateDateOnListInPage(comment, 'date');
            comment = updateDateOnListInPage(comment, 'recent_update_date');
        }

        res.status(200).json([{ isAdmin: isAdmin }, freeBoard, tagList, comment]);
    } catch (error) {
        console.error(error);
        next(error);
    };
};

/** 자유게시판 게시글 작성 */
exports.writeFreeBoard = async (req, res, next) => {
    const writer = req.user.id;
    const nickname = req.user.nickname;
    const { title, content, mainTag, tags } = req.body;

    try {
        const insertResult = await insertFree(writer, nickname, title, content, mainTag);
        const freeBoardPostId = insertResult.insertId;

        await Promise.all(tags.map(async (tag) => {
            await insertTagList(tag);
            await insertFreeTagList(freeBoardPostId, tag);
        }));

        res.status(200).json({ "freeBoardPostId": freeBoardPostId });
    } catch (error) {
        console.error(error);
        next(error);
    };
};

/** 자유게시판 게시글 수정 페이지 */
exports.editFreeBoardPage = async (req, res, next) => {
    if(!isInvalidPage(req.params.id)) {
        return res.status(404).json({ "message": "잘못된 게시글 ID입니다." });
    }
    
    const postId = parseInt(req.params.id);
    const userId = req.user.id;

    try {
        const freeBoard = await selectFreeUpdatePage(postId);

        if (!freeBoard) { // 해당 게시글이 존재하지 않으면
            return res.status(404).json({ "message": "존재하지 않는 글입니다." });
        }

        if (userId !== freeBoard.free_writer) { // 해당 게시글을 작성한 유저가 아니라면
            return res.status(403).json({ "message": "접근 권한이 없습니다." });
        }

        const tagList = await selectFreeTagListById(postId);

        res.status(200).json([freeBoard, tagList]);
    } catch (error) {
        console.error(error);
        next(error);
    };
};

/** 자유게시판 게시글 수정 */
exports.editFreeBoard = async (req, res, next) => {
    const postId = parseInt(req.params.id);
    const userId = req.user.id;
    const { title, content, mainTag, tags } = req.body;

    try {
        const FreeBoardWriter = await selectFreeWriterByPostId(postId);

        if (!FreeBoardWriter) {
            return res.status(404).json({ "message": "존재하지 않는 글입니다." });
        }

        if (userId !== FreeBoardWriter.free_writer) { // 해당 게시글을 작성한 유저가 아니라면
            return res.status(403).json({ "message": "접근 권한이 없습니다." });
        }

        await updateFree(title, content, mainTag, postId);
        await deleteFreeTagList(postId);
        await Promise.all(tags.map(async (tag) => {
            await insertTagList(tag);
            await insertFreeTagList(postId, tag);
        }));

        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        next(error);
    };
};

/** 자유게시판 게시글 삭제 */
exports.deleteFreeBoard = async (req, res, next) => {
    const postId = parseInt(req.params.id);
    const userId = req.user.id;
    const isAdmin = (req.isAuthenticated()) ? req.user.is_admin : 0; // 특정 사용자만 강의 게시글을 삭제할 수 있게 해주기 위한 상수 (기능 작성 x)

    try {
        const FreeBoardWriter = await selectFreeWriterByPostId(postId);

        if (!FreeBoardWriter) {
            return res.status(404).json({ "message": "존재하지 않는 글입니다." });
        }

        if (isAdmin === 0 && userId !== FreeBoardWriter.free_writer) { // 해당 게시글을 작성한 유저가 아니라면
            return res.status(403).json({ "message": "접근 권한이 없습니다." });
        }

        await deleteFree(postId);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        next(error);
    };
};