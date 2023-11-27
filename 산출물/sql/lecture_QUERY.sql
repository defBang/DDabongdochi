-- 강의 게시글 목록 조회
SELECT *
FROM (SELECT @rownum := @rownum+1 AS no,
        lecture_post_id, lecture_main_tag, lecture_profil_img_link, lecture_platform, 
        lecture_name, comment_count, lecturer, date, (rate_up + rate_down) AS rate
        FROM lecture, (SELECT @rownum := 0) rownum_tb
        ORDER BY date ASC) lecture_sub
ORDER BY no DESC
LIMIT ? OFFSET ?;

-- 강의 추천글 목록 조회
SELECT *
FROM (SELECT @rownum := @rownum+1 AS no,
        lecture_post_id, lecture_main_tag, lecture_profil_img_link, lecture_platform,
        lecture_name, comment_count, lecturer, date, (rate_up + rate_down) AS rate
        FROM lecture, (SELECT @rownum := 0) rownum_tb
        WHERE (rate_up + rate_down) >= ?
        ORDER BY date ASC) lecture_sub
ORDER BY no DESC
LIMIT ? OFFSET ?;

-- 강사 검색
SELECT *
FROM (SELECT @rownum := @rownum+1 AS no,
        lecture_post_id, lecture_main_tag, lecture_profil_img_link, lecture_platform, 
        lecture_name, comment_count, lecturer, date, (rate_up + rate_down) AS rate
        FROM lecture, (SELECT @rownum := 0) rownum_tb
        WHERE MATCH(lecturer) AGAINST(? IN NATURAL LANGUAGE MODE)
        ORDER BY date ASC) lecture_sub
ORDER BY no DESC
LIMIT ? OFFSET ?;

-- 강의 태그 검색
SELECT *
FROM (SELECT @rownum := @rownum+1 AS no,
        lecture_post_id, lecture_main_tag, lecture_profil_img_link, lecture_platform, 
        lecture_name, comment_count, lecturer, date, (rate_up + rate_down) AS rate
        FROM lecture, (SELECT @rownum := 0) rownum_tb
        WHERE lecture_post_id IN (SELECT lecture_post_id FROM lecture_tag_list WHERE tag_name = ?)
        ORDER BY date ASC) lecture_sub
ORDER BY no DESC
LIMIT ? OFFSET ?;

-- 강의 제목 검색
SELECT *
FROM (SELECT @rownum := @rownum+1 AS no,
        lecture_post_id, lecture_main_tag, lecture_profil_img_link, lecture_platform, 
        lecture_name, comment_count, lecturer, date, (rate_up + rate_down) AS rate
        FROM lecture, (SELECT @rownum := 0) rownum_tb
        WHERE MATCH(lecture_name) AGAINST(? IN BOOLEAN MODE)
        ORDER BY date ASC) lecture_sub
ORDER BY no DESC
LIMIT ? OFFSET ?;

-- 강의 게시글 내용 조회
SELECT * FROM lecture WHERE lecture_post_id = ?;

-- 강의 게시글 태그 목록 조회
SELECT tag_name FROM lecture_tag_list WHERE lecture_post_id = ?;

-- 강의 게시글 댓글 조회
SELECT * FROM comment WHERE lecture_post_id = ?;

-- 강의 게시글 작성
INSERT INTO lecture (lecture_name, lecture_platform, lecture_platform_url, lecturer, lecture_link, lecture_profil_img_link, lecture_main_tag) VALUES (?, ?, ?, ?, ?, ?, ?);

-- 강의 게시글 태그 리스트 삽입
INSERT INTO lecture_tag_list (lecture_post_id, tag_name) VALUES (?, ?);

-- 강의 게시글 수정 페이지 데이터 조회
SELECT lecture_name, lecture_platform, lecture_platform_url, lecturer, lecture_link, lecture_profil_img_link, lecture_main_tag
FROM lecture
WHERE lecture_post_id = ?;

-- 강의 게시글 수정
UPDATE lecture
SET lecture_name = ?, lecture_platform = ?, lecture_platform_url = ?, lecturer = ?, lecture_link = ?, lecture_profil_img_link = ?,
    lecture_main_tag = ?, recent_update_date = NOW()
WHERE lecture_post_id = ?;

-- 강의 게시글 태그 리스트 삭제
DELETE FROM lecture_tag_list WHERE lecture_post_id = ?;

-- 강의 게시글 삭제
DELETE FROM lecture WHERE lecture_post_id = ?;

-- 강의 게시글 총 개수 조회
SELECT COUNT(*) AS total_posts FROM lecture;

-- 추천글 총 개수 조회
SELECT COUNT(*) AS total_posts FROM lecture WHERE (rate_up + rate_down) >= ?;

-- 강사로 검색한 강의 게시글 결과 개수 조회
SELECT COUNT(*) AS total_posts FROM lecture 
WHERE MATCH(lecturer) AGAINST(? IN NATURAL LANGUAGE MODE);

-- 태그로 검색한 강의 게시글 결과 개수 조회
SELECT COUNT(*) AS total_posts FROM lecture WHERE lecture_post_id IN (SELECT lecture_post_id FROM lecture_tag_list WHERE tag_name = ?);

-- 제목으로 검색한 강의 게시글 총 개수 조회
SELECT COUNT(*) AS total_posts FROM lecture WHERE MATCH(lecture_name) AGAINST(? IN BOOLEAN MODE);