-- 자유게시판 게시글 목록 조회 freeList
SELECT *
FROM (SELECT @rownum := @rownum+1 AS no,
        free_post_id, free_main_tag, free_title, comment_count, free_writer_nickname, date, (rate_up + rate_down) AS rate
        FROM free_board, (SELECT @rownum := 0) rownum_tb
        ORDER BY date ASC) free_board_sub
ORDER BY no DESC
LIMIT ? OFFSET ?;

-- 자유게시판 추천글 목록 조회 bestFreeList
SELECT *
FROM (SELECT @rownum := @rownum+1 AS no,
        free_post_id, free_main_tag, free_title, comment_count, free_writer_nickname, date, (rate_up + rate_down) AS rate
        FROM free_board, (SELECT @rownum := 0) rownum_tb
        WHERE (rate_up + rate_down) >= ?
        ORDER BY date ASC) free_board_sub
ORDER BY no DESC
LIMIT ? OFFSET ?;

-- 자유게시판 작성자 검색 searchFreeWriter
SELECT *
FROM (SELECT @rownum := @rownum+1 AS no,
        free_post_id, free_main_tag, free_title, comment_count, free_writer_nickname, date, (rate_up + rate_down) AS rate
        FROM free_board, (SELECT @rownum := 0) rownum_tb
        WHERE MATCH(free_writer_nickname) AGAINST(? IN NATURAL LANGUAGE MODE)
        ORDER BY date ASC) free_board_sub
ORDER BY no DESC
LIMIT ? OFFSET ?;

-- 자유게시판 태그 검색 searchFreeTag
SELECT *
FROM (SELECT @rownum := @rownum+1 AS no,
        free_post_id, free_main_tag, free_title, comment_count, free_writer_nickname, date, (rate_up + rate_down) AS rate
        FROM free_board, (SELECT @rownum := 0) rownum_tb
        WHERE free_post_id IN (SELECT free_post_id FROM free_board_tag_list WHERE tag_name = ?)
        ORDER BY date ASC) free_board_sub
ORDER BY no DESC
LIMIT ? OFFSET ?;

-- 자유게시판 제목 검색 searchFreeTitle
SELECT *
FROM (SELECT @rownum := @rownum+1 AS no,
        free_post_id, free_main_tag, free_title, comment_count, free_writer_nickname, date, (rate_up + rate_down) AS rate
        FROM free_board, (SELECT @rownum := 0) rownum_tb
        WHERE MATCH(free_title) AGAINST(? IN BOOLEAN MODE)
        ORDER BY date ASC) free_board_sub
ORDER BY no DESC
LIMIT ? OFFSET ?;

-- 자유게시판 게시글 내용 조회 selectFree
SELECT * FROM free_board WHERE free_post_id = ?;

-- 자유게시판 게시글 태그 목록 조회 selectFreeTagListById
SELECT tag_name FROM free_board_tag_list WHERE free_post_id = ?;

-- 자유게시판 게시글 답변 조회 selectFreeComment
SELECT * FROM comment WHERE free_post_id = ?;

-- 자유게시판 게시글 작성 insertFree
INSERT INTO free_board (free_writer, free_writer_nickname, free_title, free_content, free_main_tag) VALUES (?, ?, ?, ?, ?);

-- 자유게시판 게시글 태그 리스트 삽입 insertFreeTagList
INSERT INTO free_board_tag_list (free_post_id, tag_name) VALUES (?, ?);

-- 자유게시판 게시글 수정 페이지에 삽입될 데이터 조회 selectFreeUpdatePage
SELECT free_writer, free_title, free_content, free_main_tag
FROM free_board
WHERE free_post_id = ?;

-- 자유게시판 게시글 수정 updateFree
UPDATE free_board
SET free_title = ?, free_content = ?, free_main_tag = ?, recent_update_date = NOW()
WHERE free_post_id = ?;

-- 자유게시판 게시글 태그 리스트 삭제 deleteFreeTagList
DELETE FROM free_board_tag_list WHERE free_post_id = ?;

-- 자유게시판 게시글 삭제 deleteFree
DELETE FROM free_board WHERE free_post_id = ?;

-- 자유게시판 게시글 총 개수 조회 getFreeCount
SELECT COUNT(*) AS total_posts FROM free_board;

-- 자유게시판 추천글 총 개수 조회 getBestFreeCount
SELECT COUNT(*) AS total_posts FROM free_board WHERE (rate_up + rate_down) >= ?;

-- 작성자로 검색한 자유게시판 게시글 결과 개수 조회 getFreeCountByWriter
SELECT COUNT(*) AS total_posts FROM free_board WHERE MATCH(free_writer_nickname) AGAINST(? IN NATURAL LANGUAGE MODE);

-- 태그로 검색한 자유게시판 게시글 결과 개수 조회 getFreeCountByTag
SELECT COUNT(*) AS total_posts FROM free_board WHERE free_post_id IN (SELECT free_post_id FROM free_board_tag_list WHERE tag_name = ?);

-- 제목으로 검색한 자유게시판 게시글 총 개수 조회 getFreeCountByTitle
SELECT COUNT(*) AS total_posts FROM free_board WHERE MATCH(free_title) AGAINST(? IN BOOLEAN MODE);

-- 자유게시판 게시글 작성자, 게시글 id 검색 selectFreeWriterByPostId
SELECT free_writer FROM free_board WHERE free_post_id = ?;