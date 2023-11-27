// db models : recommender model
const { updateIncreaseLectureRateUp,
    updateDecreaseLectureRateUp,
    updateDecreaseLectureRateDown,
    updateIncreaseLectureRateDown,
    updateIncreaseChannelRateUp,
    updateDecreaseChannelRateUp,
    updateDecreaseChannelRateDown,
    updateIncreaseChannelRateDown,
    updateIncreaseQuestionRateUp,
    updateDecreaseQuestionRateUp,
    updateDecreaseQuestionRateDown,
    updateIncreaseQuestionRateDown,
    updateIncreaseAnswerRateUp,
    updateDecreaseAnswerRateUp,
    updateDecreaseAnswerRateDown,
    updateIncreaseAnswerRateDown,
    updateIncreaseFreeBoardRateUp,
    updateDecreaseFreeBoardRateUp,
    updateDecreaseFreeBoardRateDown,
    updateIncreaseFreeBoardRateDown,
    insertRecommendedUser,
    deleteRecommendedUser,
    updateRecommendedUser,
    selectRecommendedUser,
    getLectureRate,
    getChannelRate,
    getQuestionRate,
    getAnswerRate,
    getFreeBoardRate } = require('../models/recommender');

/** 추천수 +1 */
const updateIncreaseRateUp = async (board, postId) => {
    try {
        if (board === "lecture") { await updateIncreaseLectureRateUp(postId); }
        else if (board === "channel") { await updateIncreaseChannelRateUp(postId); }
        else if (board === "question") { await updateIncreaseQuestionRateUp(postId); }
        else if (board === "answer") { await updateIncreaseAnswerRateUp(postId); }
        else if (board === "freeboard") { await updateIncreaseFreeBoardRateUp(postId); }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 추천수 -1 */
const updateDecreaseRateUp = async (board, postId) => {
    try {
        if (board === "lecture") { await updateDecreaseLectureRateUp(postId); }
        else if (board === "channel") { await updateDecreaseChannelRateUp(postId); }
        else if (board === "question") { await updateDecreaseQuestionRateUp(postId); }
        else if (board === "answer") { await updateDecreaseAnswerRateUp(postId); }
        else if (board === "freeboard") { await updateDecreaseFreeBoardRateUp(postId); }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 비추천수 -1 */
const updateDecreaseRateDown = async (board, postId) => {
    try {
        if (board === "lecture") { await updateDecreaseLectureRateDown(postId); }
        else if (board === "channel") { await updateDecreaseChannelRateDown(postId); }
        else if (board === "question") { await updateDecreaseQuestionRateDown(postId); }
        else if (board === "answer") { await updateDecreaseAnswerRateDown(postId); }
        else if (board === "freeboard") { await updateDecreaseFreeBoardRateDown(postId); }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 비추천수 +1 */
const updateIncreaseRateDown = async (board, postId) => {
    try {
        if (board === "lecture") { await updateIncreaseLectureRateDown(postId); }
        else if (board === "channel") { await updateIncreaseChannelRateDown(postId); }
        else if (board === "question") { await updateIncreaseQuestionRateDown(postId); }
        else if (board === "answer") { await updateIncreaseAnswerRateDown(postId); }
        else if (board === "freeboard") { await updateIncreaseFreeBoardRateDown(postId); }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 추천수 리턴 */
const getRate = async (board, postId) => {
    try {
        if (board === "lecture") {
            const result = await getLectureRate(postId);
            return { rateUp: result.rate_up, rateDown: result.rate_down };
        }
        else if (board === "channel") {
            const result = await getChannelRate(postId);
            return { rateUp: result.rate_up, rateDown: result.rate_down };
        }
        else if (board === "question") {
            const result = await getQuestionRate(postId);
            return { rateUp: result.rate_up, rateDown: result.rate_down };
        }
        else if (board === "answer") {
            const result = await getAnswerRate(postId);
            return { rateUp: result.rate_up, rateDown: result.rate_down };
        }
        else if (board === "freeboard") {
            const result = await getFreeBoardRate(postId);
            return { rateUp: result.rate_up, rateDown: result.rate_down };
        }
    } catch (error) {
        console.error(error);
        throw error; 
    }
}

/** 추천 버튼 눌렀을 때 */
exports.rateUp = async (req, res, next) => {
    const userId = req.user.id;
    const { postId, board } = req.body;

    if (!postId) {
        res.status(400).json({ "message": "게시글 ID가 없습니다." });
    }
    else if (!board) {
        res.status(400).json({ "message": "게시판이 없습니다." });
    }
    else if (!["lecture", "channel", "question", "answer", "freeboard"].includes(board)) {
        res.status(400).json({ "message": "존재하지 않는 게시판입니다." });
    }
    else {
        try {
            const search = await selectRecommendedUser(postId, userId, board);

            if (!search) { // 추천하지 않았다면
                await insertRecommendedUser(postId, userId, board, 1); // 게시글 추천한 유저 추가
                await updateIncreaseRateUp(board, postId);
            } else if (search.rate === 1) { // 추천했다면 추천 취소
                await deleteRecommendedUser(postId, userId, board);
                await updateDecreaseRateUp(board, postId);
            } else if (search.rate === -1) { // 비추천했다면 추천으로 변경
                await updateRecommendedUser(postId, userId, board, 1);
                await updateIncreaseRateUp(board, postId);
                await updateIncreaseRateDown(board, postId);
            }
            const rate = await getRate(board, postId);
            res.status(200).send(rate);
        } catch (error) {
            console.error(error);
            next(error);
        }
    }
};

/** 비추천 버튼 눌렀을 때 */
exports.rateDown = async (req, res, next) => {
    const userId = req.user.id;
    const { postId, board } = req.body;

    if (!postId) { // postId === undefined
        res.status(400).json({ "message": "게시글 ID가 없습니다." });
    }
    else if (!board) {
        res.status(400).json({ "message": "게시판이 없습니다." });
    }
    else if (!["lecture", "channel", "question", "answer", "freeboard"].includes(board)) {
        res.status(400).json({ "message": "존재하지 않는 게시판입니다." });
    }
    else {
        try {
            const search = await selectRecommendedUser(postId, userId, board);

            if (!search) { // 비추천하지 않았다면
                await insertRecommendedUser(postId, userId, board, -1); // 게시글 비추천한 유저 추가
                await updateDecreaseRateDown(board, postId);
            } else if (search.rate === -1) { // 비추천했다면 비추천 취소
                await deleteRecommendedUser(postId, userId, board);
                await updateIncreaseRateDown(board, postId);
            } else if (search.rate === 1) { // 추천했다면 비추천으로 변경
                await updateRecommendedUser(postId, userId, board, -1);
                await updateDecreaseRateUp(board, postId);
                await updateDecreaseRateDown(board, postId);
            }
            const rate = await getRate(board, postId)
            res.status(200).send(rate);
        } catch (error) {
            console.error(error);
            next(error);
        }
    }
};