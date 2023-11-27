// db 연결
const promisePool = require('../db');

/** 추천한 채널 게시글 목록  */
const recommendedChannelList = async function (userId, limit, offset) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT *
            FROM (SELECT @rownum := @rownum+1 AS no,
                    channel_post_id, channel_main_tag, channel_name,
                    comment_count, date, (rate_up + rate_down)AS rate
                    FROM youtube_channel, (SELECT @rownum := 0) rownum_tb
                    WHERE channel_post_id IN (SELECT post_id FROM recommended_user WHERE board = "channel" AND user_id = ?)
                    ORDER BY date ASC) youtube_channel_sub
            ORDER BY no DESC
            LIMIT ? OFFSET ?;`,
            [ userId, limit, offset ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 추천한 강의 게시글 목록  */
const recommendedLectureList = async function (userId, limit, offset) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT *
            FROM (SELECT @rownum := @rownum+1 AS no,
                    lecture_post_id, lecture_main_tag, lecture_profil_img_link, lecture_platform,
                    lecture_name, comment_count, lecturer, date, (rate_up + rate_down)AS rate
                    FROM lecture, (SELECT @rownum := 0) rownum_tb
                    WHERE lecture_post_id IN (SELECT post_id FROM recommended_user WHERE board = "lecture" AND user_id = ?)
                    ORDER BY date ASC) lecture_sub
            ORDER BY no DESC
            LIMIT ? OFFSET ?;`,
            [ userId, limit, offset ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 추천한 질문 게시글 목록  */
const recommendedQuestionList = async function (userId, limit, offset) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT *
            FROM (SELECT @rownum := @rownum+1 AS no,
                    question_post_id, question_main_tag, question_title, answer_count, question_writer_nickname, date, (rate_up + rate_down)AS rate
                    FROM question, (SELECT @rownum := 0) rownum_tb
                    WHERE question_post_id IN (SELECT post_id FROM recommended_user WHERE board = "question" AND user_id = ?)
                    ORDER BY date ASC) question_sub
            ORDER BY no DESC
            LIMIT ? OFFSET ?;`,
            [ userId, limit, offset ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 추천한 답변 목록 */
const recommendedAnswerList = async function (userId, limit, offset) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT *
            FROM (SELECT @rownum := @rownum+1 AS no,
                    answer_post_id, answer_writer, answer_writer_nickname, question_post_id, answer_content, date, (rate_up + rate_down)AS rate
                    FROM answer, (SELECT @rownum := 0) rownum_tb
                    WHERE answer_post_id IN (SELECT post_id FROM recommended_user WHERE board = "answer" AND user_id = ?)
                    ORDER BY date ASC) answer_sub
            ORDER BY no DESC
            LIMIT ? OFFSET ?;`,
            [ userId, limit, offset ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 추천한 자유게시판 목록 */
const recommendedFreeBoardList = async function (userId, limit, offset) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT *
            FROM (SELECT @rownum := @rownum+1 AS no,
                    free_post_id, free_main_tag, free_title, comment_count, free_writer_nickname, date, (rate_up + rate_down)AS rate
                    FROM free_board, (SELECT @rownum := 0) rownum_tb
                    WHERE free_post_id IN (SELECT post_id FROM recommended_user WHERE board = "freeboard" AND user_id = ?)
                    ORDER BY date ASC) free_board_sub
            ORDER BY no DESC
            LIMIT ? OFFSET ?;`,
            [ userId, limit, offset ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 작성한 질문 게시글 목록  */
const myQuestionList = async function (userId, limit, offset) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT *
            FROM (SELECT @rownum := @rownum+1 AS no,
                    question_post_id, question_main_tag, question_title, answer_count, question_writer_nickname, date, (rate_up + rate_down)AS rate
                    FROM question, (SELECT @rownum := 0) rownum_tb
                    WHERE question_writer IN (SELECT id FROM user WHERE id = ?)
                    ORDER BY date ASC) question_sub
            ORDER BY no DESC
            LIMIT ? OFFSET ?;`,
            [ userId, limit, offset ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 작성한 답변 목록 */
const myAnswerList = async function (userId, limit, offset) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT *
            FROM (SELECT @rownum := @rownum+1 AS no,
                    answer_post_id, answer_writer, answer_writer_nickname, question_post_id, answer_content, date, (rate_up + rate_down)AS rate
                    FROM answer, (SELECT @rownum := 0) rownum_tb
                    WHERE answer_writer IN (SELECT id FROM user WHERE id = ?)
                    ORDER BY date ASC) answer_sub
            ORDER BY no DESC
            LIMIT ? OFFSET ?;`,
            [ userId, limit, offset ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 작성한 댓글 목록 */
const myCommentList = async function (userId, limit, offset) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT *
            FROM (SELECT @rownum := @rownum+1 AS no,
                    comment_id, lecture_post_id, channel_post_id, free_post_id, comment_writer, comment_writer_nickname, comment_content, date
                    FROM comment, (SELECT @rownum := 0) rownum_tb
                    WHERE comment_writer IN (SELECT id FROM user WHERE id = ?)
                    ORDER BY date ASC) comment_sub
            ORDER BY no DESC
            LIMIT ? OFFSET ?;`,
            [ userId, limit, offset ]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 작성한 자유게시판 목록 */
const myFreeBoardList = async function (userId, limit, offset) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT *
            FROM (SELECT @rownum := @rownum+1 AS no,
                    free_post_id, free_main_tag, free_title, comment_count, free_writer_nickname, date, (rate_up + rate_down)AS rate
                    FROM free_board, (SELECT @rownum := 0) rownum_tb
                    WHERE free_writer IN (SELECT id FROM user WHERE id = ?)
                    ORDER BY date ASC) free_board_sub
            ORDER BY no DESC
            LIMIT ? OFFSET ?;`,
            [ userId, limit, offset ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}


//                         ### 게시글 개수 쿼리문 ### 
/** 추천 채널 총 개수 */
const getRecommendedChannelCount = async function (userId) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT COUNT(*) AS total_posts FROM youtube_channel 
            WHERE channel_post_id IN (SELECT post_id FROM recommended_user WHERE board = "channel" AND user_id = ?);`,
            [ userId ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 추천 강의 총 개수 */
const getRecommendedLectureCount = async function (userId) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT COUNT(*) AS total_posts FROM lecture 
            WHERE lecture_post_id IN (SELECT post_id FROM recommended_user WHERE board = "lecture" AND user_id = ?);`,
            [ userId ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 추천 질문 총 개수 */
const getRecommendedQuestionCount = async function (userId) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT COUNT(*) AS total_posts FROM question 
            WHERE question_post_id IN (SELECT post_id FROM recommended_user WHERE board = "question" AND user_id = ?);`,
            [ userId ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 추천 답변 총 개수 */
const getRecommendedAnswerCount = async function (userId) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT COUNT(*) AS total_posts FROM answer 
            WHERE answer_post_id IN (SELECT post_id FROM recommended_user WHERE board = "answer" AND user_id = ?);`,
            [ userId ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 추천 자유게시판 총 개수 */
const getRecommendedFreeBoardCount = async function (userId) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT COUNT(*) AS total_posts FROM free_board 
            WHERE free_post_id IN (SELECT post_id FROM recommended_user WHERE board = "freeboard" AND user_id = ?);`,
            [ userId ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 작성한 질문 총 개수 */
const getMyQuestionCount = async function (userId) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT COUNT(*) AS total_posts FROM question 
            WHERE question_writer IN (SELECT id FROM user WHERE id = ?);`,
            [ userId ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 작성한 답변 총 개수 */
const getMyAnswerCount = async function (userId) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT COUNT(*) AS total_posts FROM answer 
            WHERE answer_writer IN (SELECT id FROM user WHERE id = ?);`,
            [ userId ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 작성한 댓글 총 개수 */
const getMyCommentCount = async function (userId) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT COUNT(*) AS total_posts FROM comment 
            WHERE comment_writer IN (SELECT id FROM user WHERE id = ?);`,
            [ userId ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 작성한 자유게시판 총 개수 */
const getMyFreeBoardCount = async function (userId) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT COUNT(*) AS total_posts FROM free_board 
            WHERE free_writer IN (SELECT id FROM user WHERE id = ?);`,
            [ userId ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

module.exports = {
    recommendedChannelList,
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
    getMyFreeBoardCount
}