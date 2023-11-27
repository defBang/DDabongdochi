// db 연결
const promisePool = require('../db');

/** 강의 게시글 추천수 +1 */
const updateIncreaseLectureRateUp = async function (postId) {
    try {
        await promisePool.execute(
            `UPDATE lecture SET rate_up = rate_up+1  WHERE lecture_post_id = ?;`,
            [postId]);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 강의 게시글 추천수 -1 */
const updateDecreaseLectureRateUp = async function (postId) {
    try {
        await promisePool.execute(
            `UPDATE lecture SET rate_up = rate_up-1  WHERE lecture_post_id = ?;`,
            [postId]);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 강의 게시글 비추천수 -1 */
const updateDecreaseLectureRateDown = async function (postId) {
    try {
        await promisePool.execute(
            `UPDATE lecture SET rate_down = rate_down-1  WHERE lecture_post_id = ?;`,
            [postId]);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 강의 게시글 비추천수 +1 */
const updateIncreaseLectureRateDown = async function (postId) {
    try {
        await promisePool.execute(
            `UPDATE lecture SET rate_down = rate_down+1  WHERE lecture_post_id = ?;`,
            [postId]);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 채널 게시글 추천수 +1 */
const updateIncreaseChannelRateUp = async function (postId) {
    try {
        await promisePool.execute(
            `UPDATE youtube_channel SET rate_up = rate_up+1  WHERE channel_post_id = ?;`,
            [postId]);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 채널 게시글 추천수 -1 */
const updateDecreaseChannelRateUp = async function (postId) {
    try {
        await promisePool.execute(
            `UPDATE youtube_channel SET rate_up = rate_up-1  WHERE channel_post_id = ?;`,
            [postId]);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 채널 게시글 비추천수 -1 */
const updateDecreaseChannelRateDown = async function (postId) {
    try {
        await promisePool.execute(
            `UPDATE youtube_channel SET rate_down = rate_down-1  WHERE channel_post_id = ?;`,
            [postId]);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 채널 게시글 비추천수 +1 */
const updateIncreaseChannelRateDown = async function (postId) {
    try {
        await promisePool.execute(
            `UPDATE youtube_channel SET rate_down = rate_down+1  WHERE channel_post_id = ?;`,
            [postId]);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 질문 게시글 추천수 +1 */
const updateIncreaseQuestionRateUp = async function (postId) {
    try {
        await promisePool.execute(
            `UPDATE question SET rate_up = rate_up+1  WHERE question_post_id = ?;`,
            [postId]);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 질문 게시글 추천수 -1 */
const updateDecreaseQuestionRateUp = async function (postId) {
    try {
        await promisePool.execute(
            `UPDATE question SET rate_up = rate_up-1  WHERE question_post_id = ?;`,
            [postId]);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 질문 게시글 비추천수 -1 */
const updateDecreaseQuestionRateDown = async function (postId) {
    try {
        await promisePool.execute(
            `UPDATE question SET rate_down = rate_down-1  WHERE question_post_id = ?;`,
            [postId]);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 질문 게시글 비추천수 +1 */
const updateIncreaseQuestionRateDown = async function (postId) {
    try {
        await promisePool.execute(
            `UPDATE question SET rate_down = rate_down+1  WHERE question_post_id = ?;`,
            [postId]);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 답변 추천수 +1 */
const updateIncreaseAnswerRateUp = async function (postId) {
    try {
        await promisePool.execute(
            `UPDATE answer SET rate_up = rate_up+1  WHERE answer_post_id = ?;`,
            [postId]);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 답변 추천수 -1 */
const updateDecreaseAnswerRateUp = async function (postId) {
    try {
        await promisePool.execute(
            `UPDATE answer SET rate_up = rate_up-1  WHERE answer_post_id = ?;`,
            [postId]);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 답변 비추천수 -1 */
const updateDecreaseAnswerRateDown = async function (postId) {
    try {
        await promisePool.execute(
            `UPDATE answer SET rate_down = rate_down-1  WHERE answer_post_id = ?;`,
            [postId]);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 답변 비추천수 +1 */
const updateIncreaseAnswerRateDown = async function (postId) {
    try {
        await promisePool.execute(
            `UPDATE answer SET rate_down = rate_down+1  WHERE answer_post_id = ?;`,
            [postId]);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 자유게시판 게시글 추천수 +1 */
const updateIncreaseFreeBoardRateUp = async function (postId) {
    try {
        await promisePool.execute(
            `UPDATE free_board SET rate_up = rate_up+1  WHERE free_post_id = ?;`,
            [postId]);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 자유게시판 게시글 추천수 -1 */
const updateDecreaseFreeBoardRateUp = async function (postId) {
    try {
        await promisePool.execute(
            `UPDATE free_board SET rate_up = rate_up-1  WHERE free_post_id = ?;`,
            [postId]);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 자유게시판 게시글 비추천수 -1 */
const updateDecreaseFreeBoardRateDown = async function (postId) {
    try {
        await promisePool.execute(
            `UPDATE free_board SET rate_down = rate_down-1  WHERE free_post_id = ?;`,
            [postId]);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 자유게시판 게시글 비추천수 +1 */
const updateIncreaseFreeBoardRateDown = async function (postId) {
    try {
        await promisePool.execute(
            `UPDATE free_board SET rate_down = rate_down+1  WHERE free_post_id = ?;`,
            [postId]);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 게시글을 추천/비추천한 사용자 데이터 삽입 */
const insertRecommendedUser = async function (postId, userId, board, rate) {
    try {
        await promisePool.execute(
            `INSERT INTO recommended_user(post_id, user_id, board, rate) VALUES(?, ?, ?, ?);`,
            [postId, userId, board, rate]);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 게시글을 추천/비추천한 사용자 데이터 삭제 */
const deleteRecommendedUser = async function (postId, userId, board) {
    try {
        await promisePool.execute(
            `DELETE FROM recommended_user WHERE post_id = ? AND user_id = ? AND board = ?;`,
            [postId, userId, board]);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 게시글을 추천/비추천한 사용자 데이터 추천수(rate) 변경 */
const updateRecommendedUser = async function (postId, userId, board, rate) {
    try {
        await promisePool.execute(
            `UPDATE recommended_user SET rate = ? WHERE post_id = ? AND user_id = ? AND board = ?;`,
            [rate, postId, userId, board]);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 게시글을 추천/비추천한 사용자 검색 */
const selectRecommendedUser = async function (postId, userId, board) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT user_id, rate FROM recommended_user WHERE post_id = ? AND user_id = ? AND board = ?;`,
            [postId, userId, board]);
            return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 강의 게시글 추천수 반환 */
const getLectureRate = async function (postId) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT rate_up, rate_down FROM lecture WHERE lecture_post_id = ?;`,
            [ postId ]);
            return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 채널 게시글 추천수 반환 */
const getChannelRate = async function (postId) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT rate_up, rate_down FROM youtube_channel WHERE channel_post_id = ?;`,
            [ postId ]);
            return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 질문 게시글을 추천수 반환 */
const getQuestionRate = async function (postId) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT rate_up, rate_down FROM question WHERE question_post_id = ?;`,
            [ postId ]);
            return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 답변 추천수 반환 */
const getAnswerRate = async function (postId) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT rate_up, rate_down FROM answer WHERE answer_post_id = ?;`,
            [ postId ]);
            return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 자유게시판 추천수 반환 */
const getFreeBoardRate = async function (postId) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT rate_up, rate_down FROM free_board WHERE free_post_id = ?;`,
            [ postId ]);
            return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports = {
    updateIncreaseLectureRateUp,
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
    getFreeBoardRate
}