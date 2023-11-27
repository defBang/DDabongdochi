// db models : recommender model
const { recommendedChannelList,
    recommendedLectureList,
    recommendedQuestionList,
    recommendedAnswerList,
    recommendedFreeBoardList,
    myQuestionList,
    myAnswerList,
    myCommentList,
    myFreeBoardList,
    getRecommendedChannelCount,
    getRecommendedLectureCount,
    getRecommendedQuestionCount,
    getRecommendedAnswerCount,
    getRecommendedFreeBoardCount,
    getMyQuestionCount,
    getMyAnswerCount,
    getMyCommentCount,
    getMyFreeBoardCount } = require('../models/myPage');

const { getPaginationData, getOffset, getCurrentPage } = require('../paging');
const { updateDateOnList } = require('../timeSet');

// 목록 쿼리에 대입할 변수
const LIMIT = '20'; // 한 번에 검색할 게시글 개수

// 페이징에 필요한 변수
const POSTS_PER_PAGE = 20; // 한 페이지 당 표시할 게시글 개수
const DISPLAY_PAGE_NUM = 10; // 한 번에 표시할 페이지 개수
const PAGING_FLAG = 5; // 페이징 기준

/** 추천한 게시글(강의, 채널, 질문, 답변, 자유게시판) 목록 */
exports.recommendedPosts = async (req, res, next) => {
    const userId = req.user.id;
    const offset = getOffset(req.query.p); // offset 반환
    const currentPage = getCurrentPage(req.query.p); // 현재 페이지 검증 후 반환
    const board = req.query.board;

    const myInfo = res.locals.myInfo;

    if (!board) {
        res.status(400).json({ "message": "게시판이 없습니다." });
    }
    else if (!["lecture", "channel", "question", "answer", "freeboard"].includes(board)) {
        res.status(400).json({ "message": "존재하지 않는 게시판입니다." });
    }
    else {
        try {
            // 로그인한 유저가 추천한 채널
            if (board === "channel") {
                const row = await getRecommendedChannelCount(userId);
                const paginationData = getPaginationData(PAGING_FLAG, currentPage, POSTS_PER_PAGE, row.total_posts, DISPLAY_PAGE_NUM);
                let result = await recommendedChannelList(userId, LIMIT, offset);
                result = updateDateOnList(result);
                res.status(200).json([paginationData, myInfo, result]);
            }
            // 로그인한 유저가 추천한 강의
            else if (board === "lecture") {
                const row = await getRecommendedLectureCount(userId);
                const paginationData = getPaginationData(PAGING_FLAG, currentPage, POSTS_PER_PAGE, row.total_posts, DISPLAY_PAGE_NUM);
                let result = await recommendedLectureList(userId, LIMIT, offset);
                result = updateDateOnList(result);
                res.status(200).json([paginationData, myInfo, result]);
            }
            // 로그인한 유저가 추천한 질문
            else if (board === "question") {
                const row = await getRecommendedQuestionCount(userId);
                const paginationData = getPaginationData(PAGING_FLAG, currentPage, POSTS_PER_PAGE, row.total_posts, DISPLAY_PAGE_NUM);
                let result = await recommendedQuestionList(userId, LIMIT, offset);
                result = updateDateOnList(result);
                res.status(200).json([paginationData, myInfo, result]);
            }
            // 로그인한 유저가 추천한 답변
            else if (board === "answer") {
                const row = await getRecommendedAnswerCount(userId);
                const paginationData = getPaginationData(PAGING_FLAG, currentPage, POSTS_PER_PAGE, row.total_posts, DISPLAY_PAGE_NUM);
                let result = await recommendedAnswerList(userId, LIMIT, offset);
                result = updateDateOnList(result);
                res.status(200).json([paginationData, myInfo, result]);
            }
            // 로그인한 유저가 추천한 자유게시판
            else if (board === "freeboard") {
                const row = await getRecommendedFreeBoardCount(userId);
                const paginationData = getPaginationData(PAGING_FLAG, currentPage, POSTS_PER_PAGE, row.total_posts, DISPLAY_PAGE_NUM);
                let result = await recommendedFreeBoardList(userId, LIMIT, offset);
                result = updateDateOnList(result);
                res.status(200).json([paginationData, myInfo, result]);
            }
        } catch (error) {
            console.error(error);
            next(error);
        }
    }
};

/** 유저가 작성한 질문, 답변, 댓글 목록 */
exports.writtenPosts = async (req, res, next) => {
    const userId = req.user.id;
    const offset = getOffset(req.query.p); // offset 반환
    const currentPage = getCurrentPage(req.query.p); // 현재 페이지 검증 후 반환
    const category = req.query.category;

    const myInfo = res.locals.myInfo;

    if (!category) {
        res.status(400).json({ "message": "카테고리가 없습니다." });
    }
    else if (!["question", "answer", "comment", "freeboard"].includes(category)) {
        res.status(400).json({ "message": "존재하지 않는 카테고리입니다." });
    }
    else {
        try {
            // 로그인한 유저가 작성한 질문 게시글
            if (category === "question") {
                const row = await getMyQuestionCount(userId);
                const paginationData = getPaginationData(PAGING_FLAG, currentPage, POSTS_PER_PAGE, row.total_posts, DISPLAY_PAGE_NUM);
                let result = await myQuestionList(userId, LIMIT, offset);
                result = updateDateOnList(result);
                res.status(200).json([paginationData, myInfo, result]);
            }
            // 로그인한 유저가 작성한 답변
            else if (category === "answer") {
                const row = await getMyAnswerCount(userId);
                const paginationData = getPaginationData(PAGING_FLAG, currentPage, POSTS_PER_PAGE, row.total_posts, DISPLAY_PAGE_NUM);
                let result = await myAnswerList(userId, LIMIT, offset);
                result = updateDateOnList(result);
                res.status(200).json([paginationData, myInfo, result]);
            }
            // 로그인한 유저가 작성한 댓글
            else if (category === "comment") {
                const row = await getMyCommentCount(userId);
                const paginationData = getPaginationData(PAGING_FLAG, currentPage, POSTS_PER_PAGE, row.total_posts, DISPLAY_PAGE_NUM);
                let result = await myCommentList(userId, LIMIT, offset);
                result = updateDateOnList(result);
                res.status(200).json([paginationData, myInfo, result]);  
            }
            // 로그인한 유저가 작성한 자유게시판
            else if (category === "freeboard") {
                const row = await getMyFreeBoardCount(userId);
                const paginationData = getPaginationData(PAGING_FLAG, currentPage, POSTS_PER_PAGE, row.total_posts, DISPLAY_PAGE_NUM);
                let result = await myFreeBoardList(userId, LIMIT, offset);
                result = updateDateOnList(result);
                res.status(200).json([paginationData, myInfo, result]);  
            }
        } catch (error) {
            console.error(error);
            next(error);
        }
    }
};