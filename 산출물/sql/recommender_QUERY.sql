-- 강의 게시글 추천수 +1
UPDATE lecture SET rate_up = rate_up+1  WHERE lecture_post_id = ?;

-- 강의 게시글 추천수 -1
UPDATE lecture SET rate_up = rate_up-1  WHERE lecture_post_id = ?;

-- 강의 게시글 비추천수 -1
UPDATE lecture SET rate_down = rate_down-1  WHERE lecture_post_id = ?;

-- 강의 게시글 비추천수 +1
UPDATE lecture SET rate_down = rate_down+1  WHERE lecture_post_id = ?;

-- 채널 게시글 추천수 +1
UPDATE youtube_channel SET rate_up = rate_up+1  WHERE channel_post_id = ?;

-- 채널 게시글 추천수 -1
UPDATE youtube_channel SET rate_up = rate_up-1  WHERE channel_post_id = ?;

-- 채널 게시글 비추천수 -1
UPDATE youtube_channel SET rate_down = rate_down-1  WHERE channel_post_id = ?;

-- 채널 게시글 비추천수 +1
UPDATE youtube_channel SET rate_down = rate_down+1  WHERE channel_post_id = ?;

-- 질문 게시글 추천수 +1
UPDATE question SET rate_up = rate_up+1  WHERE question_post_id = ?;

-- 질문 게시글 추천수 -1
UPDATE question SET rate_up = rate_up-1  WHERE question_post_id = ?;

-- 질문 게시글 비추천수 -1
UPDATE question SET rate_down = rate_down-1  WHERE question_post_id = ?;

-- 질문 게시글 비추천수 +1
UPDATE question SET rate_down = rate_down+1  WHERE question_post_id = ?;

-- 답변 추천수 +1
UPDATE answer SET rate_up = rate_up+1  WHERE answer_post_id = ?;

-- 답변 추천수 -1
UPDATE answer SET rate_up = rate_up-1  WHERE answer_post_id = ?;

-- 답변 비추천수 -1
UPDATE answer SET rate_down = rate_down-1  WHERE answer_post_id = ?;

-- 답변 비추천수 +1
UPDATE answer SET rate_down = rate_down+1  WHERE answer_post_id = ?;

-- 자유게시판 게시글 추천수 +1
UPDATE free_board SET rate_up = rate_up+1  WHERE free_post_id = ?;

-- 자유게시판 게시글 추천수 -1
UPDATE free_board SET rate_up = rate_up-1  WHERE free_post_id = ?;

-- 자유게시판 게시글 비추천수 -1
UPDATE free_board SET rate_down = rate_down-1  WHERE free_post_id = ?;

-- 자유게시판 게시글 비추천수 +1
UPDATE free_board SET rate_down = rate_down+1  WHERE free_post_id = ?;

-- 게시글을 추천/비추천한 사용자 데이터 삽입
INSERT INTO recommended_user(post_id, user_id, board, rate) VALUES(?, ?, ?, ?);

-- 게시글을 추천/비추천한 사용자 데이터 삭제
DELETE FROM recommended_user WHERE post_id = ? AND user_id = ? AND board = ?;

-- 게시글을 추천/비추천한 사용자 데이터 추천수(rate) 변경
UPDATE recommended_user SET rate = ? WHERE post_id = ? AND user_id = ? AND board = ?;

-- 게시글을 추천/비추천한 사용자 검색
SELECT user_id, rate FROM recommended_user WHERE post_id = ? AND user_id = ? AND board = ?;

-- 강의 게시글 추천수 반환
SELECT rate_up, rate_down FROM lecture WHERE lecture_post_id = ?;

-- 채널 게시글 추천수 반환
SELECT rate_up, rate_down FROM youtube_channel WHERE channel_post_id = ?;

-- 질문 게시글을 추천수 반환
SELECT rate_up, rate_down FROM question WHERE question_post_id = ?;

-- 답변 추천수 반환
SELECT rate_up, rate_down FROM answer WHERE answer_post_id = ?;

-- 자유게시판 추천수 반환
SELECT rate_up, rate_down FROM free_board WHERE free_post_id = ?;