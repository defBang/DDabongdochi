-- 강의 댓글 작성 insertLectureComment
INSERT INTO comment (lecture_post_id, comment_writer, comment_writer_nickname, comment_content) VALUES(?, ?, ?, ?);

-- 강의 댓글 작성 후 강의 게시글 답변 개수 +1 updateLectureCommentCountUp
UPDATE lecture SET comment_count = comment_count+1 WHERE lecture_post_id = ?;

-- 강의 댓글 삭제 후 강의 게시글 답변 개수 -1 updateLectureCommentCountDown
UPDATE lecture SET comment_count = comment_count-1 WHERE lecture_post_id = ?;

-- 유튜브 채널 댓글 작성 insertChannelComment
INSERT INTO comment (channel_post_id, comment_writer, comment_writer_nickname, comment_content) VALUES(?, ?, ?, ?);

-- 유튜브 채널 댓글 작성 후 유튜브 채널 게시글 답변 개수 +1 updateChannelCommentCountUp
UPDATE youtube_channel SET comment_count = comment_count+1 WHERE channel_post_id = ?;

-- 유튜브 채널 댓글 삭제 후 유튜브 채널 게시글 답변 개수 -1 updateChannelCommentCountDown
UPDATE youtube_channel SET comment_count = comment_count-1 WHERE channel_post_id = ?

-- 자유게시판 댓글 작성 insertFreeBoardComment
INSERT INTO comment (free_post_id, comment_writer, comment_writer_nickname, comment_content) VALUES(?, ?, ?, ?);

-- 자유게시판 댓글 작성 후 자유게시판 게시글 답변 개수 +1 updateFreeBoardCommentCountUp
UPDATE free_board SET comment_count = comment_count+1 WHERE free_post_id = ?;

-- 자유게시판 댓글 삭제 후 자유게시판 게시글 답변 개수 -1 updateFreeBoardCommentCountDown
UPDATE free_board SET comment_count = comment_count-1 WHERE free_post_id = ?;

-- 강의 게시판과 유튜브 채널 게시판과 자유게시판 공동 사용 쿼리문
-- 댓글 수정 updateComment
UPDATE comment SET comment_content = ?, recent_update_date = now() WHERE comment_id = ?;

-- 댓글 삭제 deleteComment
DELETE FROM comment WHERE comment_id = ?;

-- 답변 작성자, 게시글 id 검색 selectCommentWriterByPostId
SELECT comment_writer, comment_id FROM comment WHERE comment_id = ?;