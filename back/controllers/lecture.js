// db models : lecture model
const { lectureList,
    bestLectureList,
    searchLectureLecturer,
    searchLectureTag,
    searchLectureTitle,
    selectLecture,
    selectLectureTagListById,
    selectLectureComment,
    insertLecture,
    insertLectureTagList,
    selectLectureUpdatePage,
    updateLecture,
    deleteLectureTagList,
    deleteLecture,
    getLectureCount,
    getBestLectureCount,
    getLectureCountLecturer,
    getLectureCountByTag,
    getLectureCountByTitle } = require('../models/lecture');

const { insertTagList } = require('../models/tag');

const { lecturePlatform } = require('../lecturePlatform');
const { getPaginationData, getOffset, getCurrentPage, isInvalidPage } = require('../paging');
const { updateKorDateOnPage, updateDateOnList, updateDateOnListInPage } = require('../timeSet');

// 목록 쿼리에 대입할 변수
const LIMIT = '20'; // 한 번에 검색할 게시글 개수
const RATE = 20; // 추천글 조건 추천수

// 페이징에 필요한 변수
const POSTS_PER_PAGE = 20; // 한 페이지 당 표시할 게시글 개수
const DISPLAY_PAGE_NUM = 10; // 한 번에 표시할 페이지 개수
const PAGING_FLAG = 5; // 페이징 기준

/** 강의 게시글 & 강의 추천글 목록 */
exports.list = async (req, res, next) => {
    const mode = req.query.mode; // if mode===best 추천글 목록
    const offset = getOffset(req.query.p); // offset 반환
    const currentPage = getCurrentPage(req.query.p); // 현재 페이지 검증 후 반환
    
    try {
        if (mode === "best") {
            const row = await getBestLectureCount(RATE);
            const paginationData = getPaginationData(PAGING_FLAG, currentPage, POSTS_PER_PAGE, row.total_posts, DISPLAY_PAGE_NUM);
            let result = await bestLectureList(RATE, LIMIT, offset);
            result = updateDateOnList(result);

            res.status(200).json([paginationData, result]);
        } else if (mode === undefined) {
            const row = await getLectureCount();
            const paginationData = getPaginationData(PAGING_FLAG, currentPage, POSTS_PER_PAGE, row.total_posts, DISPLAY_PAGE_NUM);
            let result = await lectureList(LIMIT, offset);
            result = updateDateOnList(result);

            res.status(200).json([paginationData, result]);
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};

/** 강의 게시글 검색 결과 목록 */
exports.search = async (req, res, next) => {
    const offset = getOffset(req.query.p); // offset 반환
    const currentPage = getCurrentPage(req.query.p); // 현재 페이지 검증 후 반환

    try {
        if (req.query.lecturer !== undefined) {
            const row = await getLectureCountLecturer(req.query.lecturer);
            const paginationData = getPaginationData(PAGING_FLAG, currentPage, POSTS_PER_PAGE, row.total_posts, DISPLAY_PAGE_NUM);
            let result = await searchLectureLecturer(req.query.lecturer, LIMIT, offset);
            result = updateDateOnList(result);
            res.status(200).json([paginationData, result]);
        }
        else if (req.query.title !== undefined) {
            const row = await getLectureCountByTitle(req.query.title);
            const paginationData = getPaginationData(PAGING_FLAG, currentPage, POSTS_PER_PAGE, row.total_posts, DISPLAY_PAGE_NUM);
            let result = await searchLectureTitle(req.query.title, LIMIT, offset);
            result = updateDateOnList(result);
            res.status(200).json([paginationData, result]);
        }
        else if (req.query.tag !== undefined) {
            const row = await getLectureCountByTag(req.query.tag);
            const paginationData = getPaginationData(PAGING_FLAG, currentPage, POSTS_PER_PAGE, row.total_posts, DISPLAY_PAGE_NUM);
            let result = await searchLectureTag(req.query.tag, LIMIT, offset);
            result = updateDateOnList(result);
            res.status(200).json([paginationData, result]);
        }
    } catch (error) {
        console.error(error);
        res.next(error);
    }
};

/** 강의 게시글 페이지 */
exports.page = async (req, res, next) => {
    if(!isInvalidPage(req.params.id)) {
        return res.status(404).json({ "message": "잘못된 게시글 ID입니다." });
    }

    const id = parseInt(req.params.id);
    const isAdmin = (req.isAuthenticated()) ? req.user.is_admin : 0;
    
    try {
        const lecture = await selectLecture(id);

        if (!lecture) {
            return res.status(404).json({ "message": "존재하지 않는 글입니다." });
        }

        lecture.date = updateKorDateOnPage(lecture.date);
        lecture.recent_update_date = updateKorDateOnPage(lecture.recent_update_date);

        const tagList = await selectLectureTagListById(id);
        let comment = await selectLectureComment(id);

        if (comment.length > 0) {
            comment = updateDateOnListInPage(comment, 'date');
            comment = updateDateOnListInPage(comment, 'recent_update_date');
        }

        res.status(200).json([{ isAdmin: isAdmin }, lecture, tagList, comment]);
    } catch (error) {
        console.error(error);
        next(error);
    };
};

/** 강의 게시글 작성 */
exports.writeLecture = async (req, res, next) => {
    let { title, platform, platformUrl, lecturer, link, profilImgLink, mainTag, tags } = req.body;

    try {
        if (!Number.isNaN(Number(platformUrl)) && (Number(platformUrl) >= 0 && Number(platformUrl) <= 8)) {
            platformUrl = lecturePlatform[platformUrl].url;
        }

        const insertResult = await insertLecture(title, platform, platformUrl, lecturer, link, profilImgLink, mainTag);
        const lecturePostId = insertResult.insertId;

        await Promise.all(tags.map(async (tag) => {
            await insertTagList(tag);
            await insertLectureTagList(lecturePostId, tag);
        }));

        res.status(200).json({"lecture_post_id": lecturePostId});
    } catch (error) {
        console.error(error);
        next(error);
    };
};

/** 강의 게시글 수정 페이지 */
exports.editLecturePage = async (req, res, next) => {
    if(!isInvalidPage(req.params.id)) {
        return res.status(404).json({ "message": "잘못된 게시글 ID입니다." });
    }
    
    const postId = parseInt(req.params.id);

    try {
        const lectureCheck = await selectLecture(postId);

        if (!lectureCheck) {
            return res.status(404).json({ "message": "존재하지 않는 글입니다." });
        }

        let lecture = await selectLectureUpdatePage(postId);

        if (lecturePlatform.find(platform => platform.name === lecture.lecture_platform)) {
            lecture.lecture_platform = lecturePlatform.findIndex(platform => platform.name === lecture.lecture_platform);
            lecture.lecture_platform_url = null;
        }

        const tagList = await selectLectureTagListById(postId);

        res.status(200).json([lecture, tagList]);
    } catch (error) {
        console.error(error);
        next(error);
    };
}; 

/** 강의 게시글 수정 */ 
exports.editLecture = async (req, res, next) => {
    if(!isInvalidPage(req.params.id)) {
        return res.status(404).json({ "message": "잘못된 게시글 ID입니다." });
    }

    const postId = parseInt(req.params.id);
    let { title, platform, platformUrl, lecturer, link, profilImgLink, mainTag, tags } = req.body;

    console.log(req.body);

    try {
        if (!Number.isNaN(Number(platformUrl)) && (Number(platformUrl) >= 0 && Number(platformUrl) <= 8)) {
            platformUrl = lecturePlatform[platformUrl].url;
        }

        const lectureCheck = await selectLecture(postId);

        if (!lectureCheck) {
            return res.status(404).json({ "message": "존재하지 않는 글입니다." });
        }

        await updateLecture(title, platform, platformUrl, lecturer, link, profilImgLink, mainTag, postId);
        await deleteLectureTagList(postId);
        await Promise.all(tags.map(async (tag) => {
            await insertTagList(tag);
            await insertLectureTagList(postId, tag);
        }));

        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        next(error);
    };
};

/** 강의 게시글 삭제 */
exports.deleteLecture = async (req, res, next) => {
    if(!isInvalidPage(req.params.id)) {
        return res.status(404).json({ "message": "잘못된 게시글 ID입니다." });
    }
    
    const postId = parseInt(req.params.id);
    const isAdmin = (req.isAuthenticated()) ? req.user.is_admin : 0; // 특정 사용자만 강의 게시글을 삭제할 수 있게 해주기 위한 상수 (기능 작성 x)

    try {
        const lectureCheck = await selectLecture(postId);

        if (!lectureCheck) {
            return res.status(404).json({ "message": "존재하지 않는 글입니다." });
        }
        else if(isAdmin === 0) {
            return res.status(403).json({ "message": "접근 권한이 없습니다." });
        }

        await deleteLecture(postId);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        next(error);
    };
};

// 라우터 -> 컨트롤러 -> 서비스(요청, 응답)