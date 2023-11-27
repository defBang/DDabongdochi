// db연결
const promisePool = require('../db');

/** 강의 게시글 목록  */
/** | 행 번호 | 게시글 페이지 이동용 게시글ID | 대표태그 | 강의 프로필 이미지 주소 | 강의 플랫폼 | 강의 제목 | 댓글개수 | 강사 | 작성일 | 추천수 | */
const lectureList = async function (limit, offset) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT *
            FROM (SELECT @rownum := @rownum+1 AS no,
                    lecture_post_id, lecture_main_tag, lecture_profil_img_link, lecture_platform, 
                    lecture_name, comment_count, lecturer, date, (rate_up + rate_down)AS rate
                    FROM lecture, (SELECT @rownum := 0) rownum_tb
                    ORDER BY date ASC) lecture_sub
            ORDER BY no DESC
            LIMIT ? OFFSET ?;`,
            [ limit, offset ]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 강의 추천글 목록 */
const bestLectureList = async function (rate, limit, offset) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT *
            FROM (SELECT @rownum := @rownum+1 AS no,
                    lecture_post_id, lecture_main_tag, lecture_profil_img_link, lecture_platform,
                    lecture_name, comment_count, lecturer, date, (rate_up + rate_down)AS rate
                    FROM lecture, (SELECT @rownum := 0) rownum_tb
                    WHERE (rate_up + rate_down) >= ?
                    ORDER BY date ASC) lecture_sub
            ORDER BY no DESC
            LIMIT ? OFFSET ?;`,
            [ rate, limit, offset ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 강사 검색 */
const searchLectureLecturer = async function (lecturer, limit, offset) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT *
            FROM (SELECT @rownum := @rownum+1 AS no,
                    lecture_post_id, lecture_main_tag, lecture_profil_img_link, lecture_platform, 
                    lecture_name, comment_count, lecturer, date, (rate_up + rate_down)AS rate
                    FROM lecture, (SELECT @rownum := 0) rownum_tb
                    WHERE MATCH(lecturer) AGAINST(? in natural language mode)
                    ORDER BY date ASC) lecture_sub
            ORDER BY no DESC
            LIMIT ? OFFSET ?;`,
            [ lecturer, limit, offset ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 강의 태그 검색 */
const searchLectureTag = async function (tagName, limit, offset) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT *
            FROM (SELECT @rownum := @rownum+1 AS no,
                    lecture_post_id, lecture_main_tag, lecture_profil_img_link, lecture_platform, 
                    lecture_name, comment_count, lecturer, date, (rate_up + rate_down)AS rate
                    FROM lecture, (SELECT @rownum := 0) rownum_tb
                    WHERE lecture_post_id IN (SELECT lecture_post_id FROM lecture_tag_list WHERE tag_name = ?)
                    ORDER BY date ASC) lecture_sub
            ORDER BY no DESC
            LIMIT ? OFFSET ?;`,
            [ tagName, limit, offset ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 강의 제목 검색 */
const searchLectureTitle = async function (lectureName, limit, offset) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT *
            FROM (SELECT @rownum := @rownum+1 AS no,
                    lecture_post_id, lecture_main_tag, lecture_profil_img_link, lecture_platform, 
                    lecture_name, comment_count, lecturer, date, (rate_up + rate_down)AS rate
                    FROM lecture, (SELECT @rownum := 0) rownum_tb
                    WHERE MATCH(lecture_name) AGAINST(? in boolean mode)
                    ORDER BY date ASC) lecture_sub
            ORDER BY no DESC
            LIMIT ? OFFSET ?;`,
            [ lectureName, limit, offset ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 강의 게시글 내용 */
const selectLecture = async function (lecturePostId) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT * FROM lecture WHERE lecture_post_id = ?;`,
            [ lecturePostId ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 강의 게시글 태그 목록 */
const selectLectureTagListById = async function (lecturePostId) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT tag_name FROM lecture_tag_list WHERE lecture_post_id = ?;`,
            [ lecturePostId ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 강의 게시글 댓글들 */
const selectLectureComment = async function (lecturePostId) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT * FROM comment WHERE lecture_post_id = ?;`,
            [ lecturePostId ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 강의 게시글 작성 */
const insertLecture = async function (lectureName, lecturePlatform, lecturePlatformUrl, lecturer, lectureLink, lectureProfileImgLink, lectureMainTag) {
    try {
        const [rows] = await promisePool.execute(
            `INSERT INTO lecture (lecture_name, lecture_platform, lecture_platform_url, lecturer, lecture_link, lecture_profil_img_link, lecture_main_tag) VALUES(?, ?, ?, ?, ?, ?, ?);`,
            [ lectureName, lecturePlatform, lecturePlatformUrl, lecturer, lectureLink, lectureProfileImgLink, lectureMainTag ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 강의 게시글 태그 리스트 삽입 */
const insertLectureTagList = async function (lecturePostId, tagName) {
    try {
        const [rows] = await promisePool.execute(
            `INSERT INTO lecture_tag_list (lecture_post_id, tag_name) VALUES (?, ?);`,
            [ lecturePostId, tagName ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 강의 게시글 수정 페이지에 삽입될 데이터 */
const selectLectureUpdatePage = async function (lecturePostId) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT lecture_name, lecture_platform, lecture_platform_url, lecturer, lecture_link, lecture_profil_img_link, lecture_main_tag
            FROM lecture
            WHERE lecture_post_id = ?;`,
            [ lecturePostId ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 강의 게시글 수정 */
const updateLecture = async function (lectureName, lecturePlatform, lecturePlatformUrl, lecturer, lectureLink, lectureProfileImgLink, lectureMainTag , lecturePostId) {
    try {
        const [rows] = await promisePool.execute(
            `UPDATE lecture
            SET lecture_name = ?, lecture_platform = ?, lecture_platform_url = ?, lecturer = ?, lecture_link = ?, lecture_profil_img_link = ?,
                lecture_main_tag = ?, recent_update_date = now()
            WHERE lecture_post_id = ?;`,
            [ lectureName, lecturePlatform, lecturePlatformUrl, lecturer, lectureLink, lectureProfileImgLink, lectureMainTag , lecturePostId ]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 강의 게시글 태그 리스트 삭제 */
const deleteLectureTagList = async function (lecturePostId) {
    try {
        const [rows] = await promisePool.execute(
            `DELETE FROM lecture_tag_list WHERE lecture_post_id = ?;`,
            [ lecturePostId ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 강의 게시글 삭제 */
const deleteLecture = async function (lecturePostId) {
    try {
        const [rows] = await promisePool.execute(
            `DELETE FROM lecture WHERE lecture_post_id =?;`,
            [ lecturePostId ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 강의 게시글 총 개수 */
const getLectureCount = async function () {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT COUNT(*) AS total_posts FROM lecture;`
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 강의 추천글 총 개수 */
const getBestLectureCount = async function (rate) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT COUNT(*) AS total_posts FROM lecture WHERE (rate_up + rate_down) >= ?;`,
            [ rate ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 강사로 검색한 강의 게시글 결과 개수 */
const getLectureCountLecturer = async function (lecturer) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT COUNT(*) AS total_posts FROM lecture 
            WHERE MATCH(lecturer) AGAINST(? in natural language mode);`,
            [ lecturer ]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 태그로 검색한 강의 게시글 결과 개수 */
const getLectureCountByTag = async function (tagName) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT COUNT(*) AS total_posts FROM lecture WHERE lecture_post_id IN (SELECT lecture_post_id FROM lecture_tag_list WHERE tag_name = ?)`,
            [ tagName ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

/** 제목으로 검색한 강의 게시글 총 개수 */
const getLectureCountByTitle = async function (lectureName) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT COUNT(*) AS total_posts FROM lecture WHERE MATCH(lecture_name) AGAINST(? in boolean mode);`,
            [ lectureName ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
}


module.exports = {
    lectureList,
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
    getLectureCountByTitle
}