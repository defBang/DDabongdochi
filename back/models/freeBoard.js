// db연결
const promisePool = require('../db');

/** 자유게시판 게시글 목록  */
/** | 행 번호 | 게시글 페이지 이동용 게시글ID | 대표태그 | 제목 | 댓글개수 | 작성자 닉네임 | 작성일 | 추천수 | */
const freeList = async function (limit, offset) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT *
            FROM (SELECT @rownum := @rownum+1 AS no,
                    free_post_id, free_main_tag, free_title, comment_count, free_writer_nickname, date, (rate_up + rate_down)AS rate
                    FROM free_board, (SELECT @rownum := 0) rownum_tb
                    ORDER BY date ASC) free_board_sub
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

/** 자유게시판 추천글 목록 */
const bestFreeList = async function (rate, limit, offset) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT *
            FROM (SELECT @rownum := @rownum+1 AS no,
                    free_post_id, free_main_tag, free_title, comment_count, free_writer_nickname, date, (rate_up + rate_down)AS rate
                    FROM free_board, (SELECT @rownum := 0) rownum_tb
                    WHERE (rate_up + rate_down) >= ?
                    ORDER BY date ASC) free_board_sub
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

/** 자유게시판 작성자 검색 */
const searchFreeWriter = async function (freeWriterNickname, limit, offset) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT *
            FROM (SELECT @rownum := @rownum+1 AS no,
                    free_post_id, free_main_tag, free_title, comment_count, free_writer_nickname, date, (rate_up + rate_down)AS rate
                    FROM free_board, (SELECT @rownum := 0) rownum_tb
                    WHERE MATCH(free_writer_nickname) AGAINST(? in natural language mode)
                    ORDER BY date ASC) free_board_sub
            ORDER BY no DESC
            LIMIT ? OFFSET ?;`,
            [freeWriterNickname, limit, offset]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 자유게시판 태그 검색 */
const searchFreeTag = async function (tagName, limit, offset) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT *
            FROM (SELECT @rownum := @rownum+1 AS no,
                    free_post_id, free_main_tag, free_title, comment_count, free_writer_nickname, date, (rate_up + rate_down)AS rate
                    FROM free_board, (SELECT @rownum := 0) rownum_tb
                    WHERE free_post_id IN (SELECT free_post_id FROM free_board_tag_list WHERE tag_name = ?)
                    ORDER BY date ASC) free_board_sub
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

/** 자유게시판 제목 검색 */
const searchFreeTitle = async function (freeTitle, limit, offset) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT *
            FROM (SELECT @rownum := @rownum+1 AS no,
                    free_post_id, free_main_tag, free_title, comment_count, free_writer_nickname, date, (rate_up + rate_down)AS rate
                    FROM free_board, (SELECT @rownum := 0) rownum_tb
                    WHERE MATCH(free_title) AGAINST(? in boolean mode)
                    ORDER BY date ASC) free_board_sub
            ORDER BY no DESC
            LIMIT ? OFFSET ?;`,
            [freeTitle, limit, offset]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 자유게시판 게시글 내용 */
const selectFree = async function (freePostId) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT * FROM free_board WHERE free_post_id = ?;`,
            [freePostId]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 자유게시판 게시글 태그 목록 */
const selectFreeTagListById = async function (freePostId) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT tag_name FROM free_board_tag_list WHERE free_post_id = ?;`,
            [freePostId]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 자유게시판 게시글 답변들 */
const selectFreeComment = async function (freePostId) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT * FROM comment WHERE free_post_id = ?;`,
            [freePostId]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 자유게시판 게시글 작성 */
const insertFree = async function (freeWriter, freeWriterNickname, freeTitle, freeContent, freeMainTag) {
    try {
        const [rows] = await promisePool.execute(
            `INSERT INTO free_board (free_writer, free_writer_nickname, free_title, free_content, free_main_tag) VALUES(?, ?, ?, ?, ?);`,
            [freeWriter, freeWriterNickname, freeTitle, freeContent, freeMainTag]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 자유게시판 게시글 태그 리스트 삽입 */
const insertFreeTagList = async function (freePostId, tagName) {
    try {
        const [rows] = await promisePool.execute(
            `INSERT INTO free_board_tag_list (free_post_id, tag_name) 
            VALUES (?, ?);`,
            [freePostId, tagName]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 자유게시판 게시글 수정 페이지에 삽입될 데이터 */
const selectFreeUpdatePage = async function (freePostId) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT free_writer, free_title, free_content, free_main_tag
            FROM free_board
            WHERE free_post_id = ?;`,
            [freePostId]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 자유게시판 게시글 수정 */
const updateFree = async function (freeTitle, freeContent, freeMainTag, freePostId) {
    try {
        const [rows] = await promisePool.execute(
            `UPDATE free_board  
            SET free_title = ?, free_content = ?, free_main_tag = ?, recent_update_date = now()
            WHERE free_post_id = ?;`,
            [freeTitle, freeContent, freeMainTag, freePostId]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 자유게시판 게시글 태그 리스트 삭제 */
const deleteFreeTagList = async function (freePostId) {
    try {
        const [rows] = await promisePool.execute(
            `DELETE FROM free_board_tag_list WHERE free_post_id = ?;`,
            [freePostId]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 자유게시판 게시글 삭제 */
const deleteFree = async function (freePostId) {
    try {
        const [rows] = await promisePool.execute(
            `DELETE FROM free_board WHERE free_post_id = ?;`,
            [freePostId]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 자유게시판 게시글 총 개수 */
const getFreeCount = async function () {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT COUNT(*) AS total_posts FROM free_board;`
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 자유게시판 추천글 총 개수 */
const getBestFreeCount = async function (rate) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT COUNT(*) AS total_posts FROM free_board WHERE (rate_up + rate_down) >= ?;`,
            [rate]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 작성자로 검색한 자유게시판 게시글 결과 개수 */
const getFreeCountByWriter = async function (freeWriterNickname) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT COUNT(*) AS total_posts FROM free_board 
            WHERE MATCH(free_writer_nickname) AGAINST(? in natural language mode);`,
            [freeWriterNickname]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 태그로 검색한 자유게시판 게시글 결과 개수 */
const getFreeCountByTag = async function (tagName) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT COUNT(*) AS total_posts FROM free_board WHERE free_post_id IN (SELECT free_post_id FROM free_board_tag_list WHERE tag_name = ?)`,
            [tagName]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 제목으로 검색한 자유게시판 게시글 총 개수 */
const getFreeCountByTitle = async function (freeTitle) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT COUNT(*) AS total_posts FROM free_board WHERE MATCH(free_title) AGAINST(? in boolean mode);`,
            [freeTitle]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/** 자유게시판 게시글 작성자, 게시글 id 검색 */
const selectFreeWriterByPostId = async function (freePostId) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT free_writer FROM free_board WHERE free_post_id = ?;`,
            [freePostId]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    freeList,
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
    selectFreeWriterByPostId
}