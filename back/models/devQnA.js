// db연결
const promisePool = require('../db');

/** 질문 게시글 목록  */
const questionList = async function (limit, offset) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT *
            FROM (SELECT @rownum := @rownum+1 AS no,
                    question_post_id, question_main_tag, question_title, answer_count, question_writer_nickname, date, (rate_up + rate_down)AS rate
                    FROM question, (SELECT @rownum := 0) rownum_tb
                    ORDER BY date ASC) question_sub
            ORDER BY no DESC
            LIMIT ? OFFSET ?;`,
            [limit, offset]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 질문 추천글 목록 */
const bestQuestionList = async function (rate, limit, offset) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT *
            FROM (SELECT @rownum := @rownum+1 AS no,
                    question_post_id, question_main_tag, question_title, answer_count, question_writer_nickname, date, (rate_up + rate_down)AS rate
                    FROM question, (SELECT @rownum := 0) rownum_tb
                    WHERE (rate_up + rate_down) >= ?
                    ORDER BY date ASC) question_sub
            ORDER BY no DESC
            LIMIT ? OFFSET ?;`,
            [rate, limit, offset]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 질문 작성자 검색 */
const searchQuestionWriter = async function (questionWriter, limit, offset) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT *
            FROM (SELECT @rownum := @rownum+1 AS no,
                    question_post_id, question_main_tag, question_title,
                    answer_count, question_writer_nickname, date, (rate_up + rate_down)AS rate
                    FROM question, (SELECT @rownum := 0) rownum_tb
                    WHERE MATCH(question_writer_nickname) AGAINST(? in natural language mode)
                    ORDER BY date ASC) question_sub
            ORDER BY no DESC
            LIMIT ? OFFSET ?;`,
            [questionWriter, limit, offset]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 질문 태그 검색 */
const searchQuestionTag = async function (tagName, limit, offset) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT *
            FROM (SELECT @rownum := @rownum+1 AS no,
                    question_post_id, question_main_tag, question_title, answer_count, question_writer_nickname, date, (rate_up + rate_down)AS rate
                    FROM question, (SELECT @rownum := 0) rownum_tb
                    WHERE question_post_id IN (SELECT question_post_id FROM question_tag_list WHERE tag_name = ?)
                    ORDER BY date ASC) question_sub
            ORDER BY no DESC
            LIMIT ? OFFSET ?;`,
            [tagName, limit, offset]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 질문 제목 검색 */
const searchQuestionTitle = async function (questionTitle, limit, offset) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT *
            FROM (SELECT @rownum := @rownum+1 AS no,
                    question_post_id, question_main_tag, question_title, 
                    answer_count, question_writer_nickname, date, (rate_up + rate_down)AS rate
                    FROM question, (SELECT @rownum := 0) rownum_tb
                    WHERE MATCH(question_title) AGAINST(? in boolean mode)
                    ORDER BY date ASC) question_sub
            ORDER BY no DESC
            LIMIT ? OFFSET ?;`,
            [questionTitle, limit, offset]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 질문 게시글 내용 */
const selectQuestion = async function (questionPostId) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT * FROM question WHERE question_post_id = ?;`,
            [questionPostId]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 질문 게시글 태그 목록 */
const selectQuestionTagListById = async function (questionPostId) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT tag_name FROM question_tag_list WHERE question_post_id = ?;`,
            [questionPostId]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 질문 게시글 답변들 */
const selectAnswer = async function (questionPostId) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT * FROM answer WHERE question_post_id = ?;`,
            [questionPostId]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


/** 질문 게시글 작성 */
const insertQuestion = async function (questionWriter, questionWriterNickname, questionTitle, questionContent, questionMainTag) {
    try {
        const [rows] = await promisePool.execute(
            `INSERT INTO question (question_writer, question_writer_nickname, question_title, question_content, question_main_tag) VALUES(?, ?, ?, ?, ?);`,
            [questionWriter, questionWriterNickname, questionTitle, questionContent, questionMainTag]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 질문 게시글 태그 리스트 삽입 */
const insertQuestionTagList = async function (questionPostId, tagName) {
    try {
        const [rows] = await promisePool.execute(
            `INSERT INTO question_tag_list (question_post_id, tag_name) 
            VALUES (?, ?);`,
            [questionPostId, tagName]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 질문 게시글 수정 페이지에 삽입될 데이터 */
const selectQuestionUpdatePage = async function (questionPostId) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT question_writer, question_title, question_content, question_main_tag
            FROM question
            WHERE question_post_id = ?;`,
            [questionPostId]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 질문 게시글 수정 */
const updateQuestion = async function (questionTitle, questionContent, questionMainTag, questionPostId) {
    try {
        const [rows] = await promisePool.execute(
            `UPDATE question  
            SET question_title = ?, question_content = ?, question_main_tag = ?, recent_update_date = now()
            WHERE question_post_id = ?;`,
            [questionTitle, questionContent, questionMainTag, questionPostId]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 질문 게시글 태그 리스트 삭제 */
const deleteQuestionTagList = async function (questionPostId) {
    try {
        const [rows] = await promisePool.execute(
            `DELETE FROM question_tag_list WHERE question_post_id = ?;`,
            [questionPostId]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 질문 게시글 삭제 */
const deleteQuestion = async function (questionPostId) {
    try {
        const [rows] = await promisePool.execute(
            `DELETE FROM question WHERE question_post_id = ?;`,
            [questionPostId]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 답변 작성 */
const insertAnswer = async function (answerWriter, answerWriterNickname, questionPostId, answerContent) {
    try {
        const [rows] = await promisePool.execute(
            `INSERT INTO answer(answer_writer, answer_writer_nickname, question_post_id, answer_content) VALUES(?, ?, ?, ?);`,
            [answerWriter, answerWriterNickname, questionPostId, answerContent]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 답변 작성 후 질문 게시글 답변 개수 +1 */
const updateAnswerCountUp = async function (questionPostId) {
    try {
        const [rows] = await promisePool.execute(
            `UPDATE question SET answer_count = answer_count+1 WHERE question_post_id = ?;`,
            [questionPostId]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 답변 수정 */
const updateAnswer = async function (answerContent, answerPostId) {
    try {
        const [rows] = await promisePool.execute(
            `UPDATE answer SET answer_content = ?, recent_update_date = now() WHERE answer_post_id = ?;`,
            [answerContent, answerPostId]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 답변 삭제 */
const deleteAnswer = async function (answerPostId) {
    try {
        const [rows] = await promisePool.execute(
            `DELETE FROM answer WHERE answer_post_id = ?;`,
            [answerPostId]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 답변 삭제 후 질문 게시글 답변 개수 -1 */
const updateAnswerCountDown = async function (questionPostId) {
    try {
        const [rows] = await promisePool.execute(
            `UPDATE question SET answer_count = answer_count-1 WHERE question_post_id = ?;`,
            [questionPostId]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 질문 게시글 총 개수 */
const getQuestionCount = async function () {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT COUNT(*) AS total_posts FROM question;`
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 질문 추천글 총 개수 */
const getBestQuestionCount = async function (rate) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT COUNT(*) AS total_posts FROM question WHERE (rate_up + rate_down) >= ?;`,
            [rate]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 작성자(닉네임)로 검색한 질문 게시글 결과 개수 */
const getQuestionCountByWriter = async function (questionWriter) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT COUNT(*) AS total_posts FROM question 
            WHERE MATCH(question_writer_nickname) AGAINST(? in natural language mode);`,
            [questionWriter]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 태그로 검색한 질문 게시글 결과 개수 */
const getQuestionCountByTag = async function (tagName) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT COUNT(*) AS total_posts FROM question WHERE question_post_id IN (SELECT question_post_id FROM question_tag_list WHERE tag_name = ?)`,
            [tagName]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 제목으로 검색한 질문 게시글 총 개수 */
const getQuestionCountByTitle = async function (questionTitle) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT COUNT(*) AS total_posts FROM question WHERE MATCH(question_title) AGAINST(? in boolean mode);`,
            [questionTitle]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 질문 게시글 작성자, 게시글 id 검색 */
const selectQuestionWriterByPostId = async function (questionPostId) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT question_writer FROM question WHERE question_post_id = ?;`,
            [questionPostId]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 답변 작성자, 게시글 id 검색 */
const selectAnswerWriterByPostId = async function (answerPostId) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT answer_writer FROM answer WHERE answer_post_id = ?;`,
            [answerPostId]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    questionList,
    bestQuestionList,
    searchQuestionWriter,
    searchQuestionTag,
    searchQuestionTitle,
    selectQuestion,
    selectQuestionTagListById,
    selectAnswer,
    insertQuestion,
    insertQuestionTagList,
    selectQuestionUpdatePage,
    updateQuestion,
    deleteQuestionTagList,
    deleteQuestion,
    insertAnswer,
    updateAnswerCountUp,
    updateAnswer,
    deleteAnswer,
    updateAnswerCountDown,
    getQuestionCount,
    getBestQuestionCount,
    getQuestionCountByWriter,
    getQuestionCountByTag,
    getQuestionCountByTitle,
    selectQuestionWriterByPostId,
    selectAnswerWriterByPostId
}