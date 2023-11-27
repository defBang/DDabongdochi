-- 유튜브 채널 게시글 목록 channelList
-- | 행 번호 | 게시글 페이지 이동용 게시글ID | 대표태그 | 채널 이름 | 댓글개수 | 작성일 | 추천수 |
SELECT *
FROM (SELECT @rownum := @rownum+1 AS no,
        channel_post_id, channel_main_tag, channel_name,
        comment_count, date, (rate_up + rate_down)AS rate
        FROM youtube_channel, (SELECT @rownum := 0) rownum_tb
        ORDER BY date ASC) youtube_channel_sub
ORDER BY no DESC
LIMIT ? OFFSET ?;

-- 유튜브 채널 추천글 목록 bestChannelList
SELECT *
FROM (SELECT @rownum := @rownum+1 AS no,
        channel_post_id, channel_main_tag, channel_name, comment_count, date, (rate_up + rate_down)AS rate
        FROM youtube_channel, (SELECT @rownum := 0) rownum_tb
        WHERE (rate_up + rate_down) >= ?
        ORDER BY date ASC) youtube_channel_sub
ORDER BY no DESC
LIMIT ? OFFSET ?;

-- 유튜브 채널 태그 검색 searchChannelTag
SELECT *
FROM (SELECT @rownum := @rownum+1 AS no,
        channel_post_id, channel_main_tag, channel_name,
        comment_count, date, (rate_up + rate_down)AS rate
        FROM youtube_channel, (SELECT @rownum := 0) rownum_tb
        WHERE channel_post_id IN (SELECT channel_post_id FROM youtube_channel_tag_list WHERE tag_name = ?)
        ORDER BY date ASC) youtube_channel_sub
ORDER BY no DESC
LIMIT ? OFFSET ?;

-- 유튜브 채널 제목 검색 searchChannelTitle
SELECT *
FROM (SELECT @rownum := @rownum+1 AS no,
        channel_post_id, channel_main_tag, channel_name,
        comment_count, date, (rate_up + rate_down)AS rate
        FROM youtube_channel, (SELECT @rownum := 0) rownum_tb
        WHERE MATCH(channel_name) AGAINST(? in boolean mode)
        ORDER BY date ASC) youtube_channel_sub
ORDER BY no DESC
LIMIT ? OFFSET ?;

-- 유튜브 채널 게시글 내용 selectChannel
SELECT * FROM youtube_channel WHERE channel_post_id = ?;

-- 유튜브 채널 게시글 태그 목록 selectChannelTagListById
SELECT tag_name FROM youtube_channel_tag_list WHERE channel_post_id = ?;

-- 유튜브 채널 게시글 댓글들 selectChannelComment
SELECT * FROM comment WHERE channel_post_id = ?;

-- 유튜브 채널 게시글 작성 insertChannel
INSERT INTO youtube_channel 
    (channel_name, channel_link, channel_profile_img_link, channel_main_video_link, channel_main_tag, channel_id, description, subscriber_count, video_count, view_count, published_at, country) 
VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

-- 유튜브 채널 게시글 태그 리스트 삽입 insertChannelTagList
INSERT INTO youtube_channel_tag_list (channel_post_id, tag_name) VALUES (?, ?);

-- 유튜브 채널 게시글 수정 페이지에 삽입될 데이터 selectChannelUpdatePage
SELECT channel_name, channel_main_video_link, channel_main_tag
FROM youtube_channel
WHERE channel_post_id = ?;

-- 유튜브 채널 게시글 수정 updateChannel
UPDATE youtube_channel 
SET channel_name = ?, channel_link = ?, channel_profile_img_link = ?, channel_main_video_link = ?, channel_main_tag = ?, recent_update_date = now(), 
    channel_id = ?, description = ?, subscriber_count = ?, video_count = ?, view_count = ?, country = ?
WHERE channel_post_id = ?;

-- 유튜브 채널 게시글 태그 리스트 삭제 deleteChannelTagList
DELETE FROM youtube_channel_tag_list WHERE channel_post_id = ?;

-- 유튜브 채널 게시글 삭제 deleteChannel
DELETE FROM youtube_channel WHERE channel_post_id = ?;

-- 유튜브 채널 게시글 총 개수 getChannelCount
SELECT COUNT(*) AS total_posts FROM youtube_channel;

-- 유튜브 채널 추천글 총 개수 getBestChannelCount
SELECT COUNT(*) AS total_posts FROM youtube_channel WHERE (rate_up + rate_down) >= ?;

-- 태그로 검색한 유튜브 채널 게시글 결과 개수 getChannelCountByTag
SELECT COUNT(*) AS total_posts FROM youtube_channel WHERE channel_post_id IN (SELECT channel_post_id FROM youtube_channel_tag_list WHERE tag_name = ?);

-- 제목으로 검색한 유튜브 채널 게시글 총 개수 getChannelCountByTitle
SELECT COUNT(*) AS total_posts FROM youtube_channel WHERE MATCH(channel_name) AGAINST(? in boolean mode);

-- 게시글ID로 채널ID 검색 getChannelIdByPostId
SELECT channel_id FROM youtube_channel WHERE channel_post_id = ?;