// db연결
const promisePool = require('../db');

/** 강의 댓글 작성 */
const insertLectureComment = async function (lecturePostId, commentWriter, commentWriterNickname, commentContent) {
    try {
        const [rows] = await promisePool.execute(
            `INSERT INTO comment (lecture_post_id, comment_writer, comment_writer_nickname, comment_content) VALUES(?, ?, ?, ?);`,
            [ lecturePostId, commentWriter, commentWriterNickname, commentContent ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 강의 댓글 작성 후 강의 게시글 답변 개수 +1 */
const updateLectureCommentCountUp = async function (lecturePostId) {
    try {
        const [rows] = await promisePool.execute(
            `UPDATE lecture SET comment_count = comment_count+1 WHERE lecture_post_id = ?;`,
            [ lecturePostId ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 강의 댓글 삭제 후 강의 게시글 답변 개수 -1 */
const updateLectureCommentCountDown = async function (lecturePostId) {
    try {
        const [rows] = await promisePool.execute(
            `UPDATE lecture SET comment_count = comment_count-1 WHERE lecture_post_id = ?;`,
            [ lecturePostId ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 유튜브 채널 댓글 작성 */
const insertChannelComment = async function (channelPostId, commentWriter, commentWriterNickname, commentContent) {
    try {
        const [rows] = await promisePool.execute(
            `INSERT INTO comment (channel_post_id, comment_writer, comment_writer_nickname, comment_content) VALUES(?, ?, ?, ?);`,
            [ channelPostId, commentWriter, commentWriterNickname, commentContent ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 유튜브 채널 댓글 작성 후 유튜브 채널 게시글 답변 개수 +1 */
const updateChannelCommentCountUp = async function (channelPostId) {
    try {
        const [rows] = await promisePool.execute(
            `UPDATE youtube_channel SET comment_count = comment_count+1 WHERE channel_post_id = ?;`,
            [ channelPostId ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 유튜브 채널 댓글 삭제 후 유튜브 채널 게시글 답변 개수 -1 */
const updateChannelCommentCountDown = async function (channelPostId) {
    try {
        const [rows] = await promisePool.execute(
            `UPDATE youtube_channel SET comment_count = comment_count-1 WHERE channel_post_id = ?;`,
            [ channelPostId ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 자유게시판 댓글 작성 */
const insertFreeBoardComment = async function (freePostId, commentWriter, commentWriterNickname, commentContent) {
    try {
        const [rows] = await promisePool.execute(
            `INSERT INTO comment (free_post_id, comment_writer, comment_writer_nickname, comment_content) VALUES(?, ?, ?, ?);`,
            [ freePostId, commentWriter, commentWriterNickname, commentContent ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 자유게시판 댓글 작성 후 자유게시판 게시글 답변 개수 +1 */
const updateFreeBoardCommentCountUp = async function (freePostId) {
    try {
        const [rows] = await promisePool.execute(
            `UPDATE free_board SET comment_count = comment_count+1 WHERE free_post_id = ?;`,
            [ freePostId ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 자유게시판 댓글 삭제 후 자유게시판 게시글 답변 개수 -1 */
const updateFreeBoardCommentCountDown = async function (freePostId) {
    try {
        const [rows] = await promisePool.execute(
            `UPDATE free_board SET comment_count = comment_count-1 WHERE free_post_id = ?;`,
            [ freePostId ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 강의게시판과 채널게시판, 자유게시판 공동 사용 쿼리문 */
/** 댓글 수정 */
const updateComment = async function (commentContent, commentId) {
    try {
        const [rows] = await promisePool.execute(
            `UPDATE comment SET comment_content = ?, recent_update_date = now() WHERE comment_id = ?;`,
            [ commentContent, commentId ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 댓글 삭제 */
const deleteComment = async function (commentId) {
    try {
        const [rows] = await promisePool.execute(
            `DELETE FROM comment WHERE comment_id = ?;`,
            [ commentId ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 답변 작성자, 게시글 id 검색 */
const selectCommentWriterByPostId = async function (commentId) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT comment_writer, comment_id FROM comment WHERE comment_id = ?;`,
            [commentId]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    insertLectureComment,
    updateLectureCommentCountUp,
    updateLectureCommentCountDown,
    insertChannelComment,
    updateChannelCommentCountUp,
    updateChannelCommentCountDown,
    insertFreeBoardComment,
    updateFreeBoardCommentCountUp,
    updateFreeBoardCommentCountDown,
    updateComment,
    deleteComment,
    selectCommentWriterByPostId
}