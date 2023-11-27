-- 질문 게시글 목록 questionList
SELECT *
FROM (SELECT @rownum := @rownum+1 AS no,
        question_post_id, question_main_tag, question_title, answer_count, question_writer_nickname, date, (rate_up + rate_down)AS rate
        FROM question, (SELECT @rownum := 0) rownum_tb
        ORDER BY date ASC) question_sub
ORDER BY no DESC
LIMIT ? OFFSET ?;

-- 질문 추천글 목록 bestQuestionList
SELECT *
FROM (SELECT @rownum := @rownum+1 AS no,
        question_post_id, question_main_tag, question_title, answer_count, question_writer_nickname, date, (rate_up + rate_down)AS rate
        FROM question, (SELECT @rownum := 0) rownum_tb
        WHERE (rate_up + rate_down) >= ?
        ORDER BY date ASC) question_sub
ORDER BY no DESC
LIMIT ? OFFSET ?;

-- 질문 작성자 검색 searchQuestionWriter
SELECT *
FROM (SELECT @rownum := @rownum+1 AS no,
        question_post_id, question_main_tag, question_title,
        answer_count, question_writer_nickname, date, (rate_up + rate_down)AS rate
        FROM question, (SELECT @rownum := 0) rownum_tb
        WHERE MATCH(question_writer_nickname) AGAINST(? in natural language mode)
        ORDER BY date ASC) question_sub
ORDER BY no DESC
LIMIT ? OFFSET ?;

-- 질문 태그 검색 searchQuestionTag
SELECT *
FROM (SELECT @rownum := @rownum+1 AS no,
        question_post_id, question_main_tag, question_title, answer_count, question_writer_nickname, date, (rate_up + rate_down)AS rate
        FROM question, (SELECT @rownum := 0) rownum_tb
        WHERE question_post_id IN (SELECT question_post_id FROM question_tag_list WHERE tag_name = ?)
        ORDER BY date ASC) question_sub
ORDER BY no DESC
LIMIT ? OFFSET ?;

-- 질문 제목 검색 searchQuestionTitle
SELECT *
FROM (SELECT @rownum := @rownum+1 AS no,
        question_post_id, question_main_tag, question_title, 
        answer_count, question_writer_nickname, date, (rate_up + rate_down)AS rate
        FROM question, (SELECT @rownum := 0) rownum_tb
        WHERE MATCH(question_title) AGAINST(? in boolean mode)
        ORDER BY date ASC) question_sub
ORDER BY no DESC
LIMIT ? OFFSET ?;

-- 질문 게시글 내용 selectQuestion
SELECT * FROM question WHERE question_post_id = ?;

-- 질문 게시글 태그 목록 selectQuestionTagListById
SELECT tag_name FROM question_tag_list WHERE question_post_id = ?;

-- 질문 게시글 답변들 selectAnswer
SELECT * FROM answer WHERE question_post_id = ?;

-- 질문 게시글 작성 insertQuestion
INSERT INTO question (question_writer, question_writer_nickname, question_title, question_content, question_main_tag) VALUES(?, ?, ?, ?, ?);

-- 질문 게시글 태그 리스트 삽입 insertQuestionTagList
INSERT INTO question_tag_list (question_post_id, tag_name) 
VALUES (?, ?);

-- 질문 게시글 수정 페이지에 삽입될 데이터 selectQuestionUpdatePage
SELECT question_writer, question_title, question_content, question_main_tag
FROM question
WHERE question_post_id = ?;

-- 질문 게시글 수정 updateQuestion
UPDATE question  
SET question_title = ?, question_content = ?, question_main_tag = ?, recent_update_date = now()
WHERE question_post_id = ?;

-- 질문 게시글 태그 리스트 삭제 deleteQuestionTagList
DELETE FROM question_tag_list WHERE question_post_id = ?;

-- 질문 게시글 삭제 deleteQuestion
DELETE FROM question WHERE question_post_id = ?;

-- 답변 작성 insertAnswer
INSERT INTO answer(answer_writer, answer_writer_nickname, question_post_id, answer_content) VALUES(?, ?, ?, ?);

-- 답변 작성 후 질문 게시글 답변 개수 +1 updateAnswerCountUp
UPDATE question SET answer_count = answer_count+1 WHERE question_post_id = ?;

-- 답변 수정 updateAnswer
UPDATE answer SET answer_content = ?, recent_update_date = now() WHERE answer_post_id = ?;

-- 답변 삭제 deleteAnswer
DELETE FROM answer WHERE answer_post_id = ?;

-- 답변 삭제 후 질문 게시글 답변 개수 -1 updateAnswerCountDown
UPDATE question SET answer_count = answer_count-1 WHERE question_post_id = ?;

-- 질문 게시글 총 개수 getQuestionCount
SELECT COUNT(*) AS total_posts FROM question;

-- 질문 추천글 총 개수 getBestQuestionCount
SELECT COUNT(*) AS total_posts FROM question WHERE (rate_up + rate_down) >= ?;

-- 작성자(닉네임)로 검색한 질문 게시글 결과 개수 getQuestionCountByWriter
SELECT COUNT(*) AS total_posts FROM question 
WHERE MATCH(question_writer_nickname) AGAINST(? in natural language mode);

-- 태그로 검색한 질문 게시글 결과 개수 getQuestionCountByTag
SELECT COUNT(*) AS total_posts FROM question WHERE question_post_id IN (SELECT question_post_id FROM question_tag_list WHERE tag_name = ?);

-- 제목으로 검색한 질문 게시글 총 개수 getQuestionCountByTitle
SELECT COUNT(*) AS total_posts FROM question WHERE MATCH(question_title) AGAINST(? in boolean mode);

-- 질문 게시글 작성자, 게시글 id 검색 selectQuestionWriterByPostId
SELECT question_writer FROM question WHERE question_post_id = ?;

-- 답변 작성자, 게시글 id 검색 selectAnswerWriterByPostId
SELECT answer_writer FROM answer WHERE answer_post_id = ?;