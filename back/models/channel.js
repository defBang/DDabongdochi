// db연결
const promisePool = require('../db');

/** 유튜브 채널 게시글 목록  */
/** | 행 번호 | 게시글 페이지 이동용 게시글ID | 대표태그 | 채널 이름 | 댓글개수 | 작성일 | 추천수 | */
const channelList = async function (limit, offset) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT *
            FROM (SELECT @rownum := @rownum+1 AS no,
                    channel_post_id, channel_main_tag, channel_name,
                    comment_count, date, (rate_up + rate_down)AS rate
                    FROM youtube_channel, (SELECT @rownum := 0) rownum_tb
                    ORDER BY date ASC) youtube_channel_sub
            ORDER BY no DESC
            LIMIT ? OFFSET ?;`,
            [ limit, offset ]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
};

/** 유튜브 채널 추천글 목록 */
const bestChannelList = async function (rate, limit, offset) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT *
            FROM (SELECT @rownum := @rownum+1 AS no,
                    channel_post_id, channel_main_tag, channel_name,
                    comment_count, date, (rate_up + rate_down)AS rate
                    FROM youtube_channel, (SELECT @rownum := 0) rownum_tb
                    WHERE (rate_up + rate_down) >= ?
                    ORDER BY date ASC) youtube_channel_sub
            ORDER BY no DESC
            LIMIT ? OFFSET ?;`,
            [ rate, limit, offset ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
};

/** 유튜브 채널 태그 검색 */
const searchChannelTag = async function (tagName, limit, offset) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT *
            FROM (SELECT @rownum := @rownum+1 AS no,
                    channel_post_id, channel_main_tag, channel_name,
                    comment_count, date, (rate_up + rate_down)AS rate
                    FROM youtube_channel, (SELECT @rownum := 0) rownum_tb
                    WHERE channel_post_id IN (SELECT channel_post_id FROM youtube_channel_tag_list WHERE tag_name = ?)
                    ORDER BY date ASC) youtube_channel_sub
            ORDER BY no DESC
            LIMIT ? OFFSET ?;`,
            [ tagName, limit, offset ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
};

/** 유튜브 채널 제목 검색 */
const searchChannelTitle = async function (channelName, limit, offset) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT *
            FROM (SELECT @rownum := @rownum+1 AS no,
                    channel_post_id, channel_main_tag, channel_name,
                    comment_count, date, (rate_up + rate_down)AS rate
                    FROM youtube_channel, (SELECT @rownum := 0) rownum_tb
                    WHERE MATCH(channel_name) AGAINST(? in boolean mode)
                    ORDER BY date ASC) youtube_channel_sub
            ORDER BY no DESC
            LIMIT ? OFFSET ?;`,
            [ channelName, limit, offset ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
};

/** 유튜브 채널 게시글 내용 */
const selectChannel = async function (channelPostId) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT * FROM youtube_channel WHERE channel_post_id = ?;`,
            [ channelPostId ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
};

/** 유튜브 채널 게시글 태그 목록 */
const selectChannelTagListById = async function (channelPostId) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT tag_name FROM youtube_channel_tag_list WHERE channel_post_id = ?;`,
            [ channelPostId ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
};

/** 유튜브 채널 게시글 댓글들 */
const selectChannelComment = async function (channelPostId) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT * FROM comment WHERE channel_post_id = ?;`,
            [ channelPostId ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
};

/** 유튜브 채널 게시글 작성 */ // 1125 수정
const insertChannel = async function (name, link, profileImgUrl, mainVideoUrl, mainTag, channelId, description, subscriberCount, videoCount, viewCount, publishedAt, country) {
    try {
        const [rows] = await promisePool.execute(
            `INSERT INTO youtube_channel 
            (channel_name, channel_link, channel_profile_img_link, channel_main_video_link, channel_main_tag, 
                channel_id, description, subscriber_count, video_count, view_count, published_at, country) 
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [ name, link, profileImgUrl, mainVideoUrl, mainTag, channelId, description, subscriberCount, videoCount, viewCount, publishedAt, country ]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
};

/** 유튜브 채널 게시글 태그 리스트 삽입 */
const insertChannelTagList = async function (channelPostId, tagName) {
    try {
        const [rows] = await promisePool.execute(
            `INSERT INTO youtube_channel_tag_list (channel_post_id, tag_name) VALUES (?, ?);`,
            [ channelPostId, tagName ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
};

/** 유튜브 채널 게시글 수정 페이지에 삽입될 데이터 */ // 1125 수정
const selectChannelUpdatePage = async function (channelPostId) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT channel_name, channel_main_video_link, channel_main_tag
            FROM youtube_channel
            WHERE channel_post_id = ?;`,
            [ channelPostId ]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
};

/** 유튜브 채널 게시글 수정 */ // 1125 수정
const updateChannel = async function (name, link, profileImgUrl, mainVideoUrl, mainTag, channelId, description, subscriberCount, videoCount, viewCount, country, postId) {
    try {
        const [rows] = await promisePool.execute(
            `UPDATE youtube_channel 
            SET channel_name = ?, channel_link = ?, channel_profile_img_link = ?, channel_main_video_link = ?, channel_main_tag = ?, recent_update_date = now(), 
            channel_id = ?, description = ?, subscriber_count = ?, video_count = ?, view_count = ?, country = ? 
            WHERE channel_post_id = ?;`,
            [ name, link, profileImgUrl, mainVideoUrl, mainTag, channelId, description, subscriberCount, videoCount, viewCount, country, postId ]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
};

/** 유튜브 채널 게시글 태그 리스트 삭제 */
const deleteChannelTagList = async function (channelPostId) {
    try {
        const [rows] = await promisePool.execute(
            `DELETE FROM youtube_channel_tag_list WHERE channel_post_id = ?;`,
            [ channelPostId ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
};

/** 유튜브 채널 게시글 삭제 */
const deleteChannel = async function (channelPostId) {
    try {
        const [rows] = await promisePool.execute(
            `DELETE FROM youtube_channel WHERE channel_post_id = ?;`,
            [ channelPostId ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
};

/** 유튜브 채널 게시글 총 개수 */
const getChannelCount = async function () {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT COUNT(*) AS total_posts FROM youtube_channel;`
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
};

/** 유튜브 채널 추천글 총 개수 */
const getBestChannelCount = async function (rate) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT COUNT(*) AS total_posts FROM youtube_channel WHERE (rate_up + rate_down) >= ?;`,
            [ rate ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
};

/** 태그로 검색한 유튜브 채널 게시글 결과 개수 */
const getChannelCountByTag = async function (tagName) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT COUNT(*) AS total_posts FROM youtube_channel WHERE channel_post_id IN (SELECT channel_post_id FROM youtube_channel_tag_list WHERE tag_name = ?);`,
            [ tagName ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
};

/** 제목으로 검색한 유튜브 채널 게시글 총 개수 */
const getChannelCountByTitle = async function (channelName) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT COUNT(*) AS total_posts FROM youtube_channel WHERE MATCH(channel_name) AGAINST(? in boolean mode);`,
            [ channelName ]
        );  
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
};

const getChannelIdByPostId = async function(postId) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT channel_id FROM youtube_channel WHERE channel_post_id = ?;`,
            [ postId ]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw(error);
    }
};

module.exports = {
    channelList,
    bestChannelList,
    searchChannelTag,
    searchChannelTitle,
    selectChannel,
    selectChannelTagListById,
    selectChannelComment,
    insertChannel,
    insertChannelTagList,
    selectChannelUpdatePage,
    updateChannel,
    deleteChannelTagList,
    deleteChannel,
    getChannelCount,
    getBestChannelCount,
    getChannelCountByTag,
    getChannelCountByTitle,
    getChannelIdByPostId
}