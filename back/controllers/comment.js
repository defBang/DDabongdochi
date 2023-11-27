// db models : comment model
const { insertLectureComment,
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
    selectCommentWriterByPostId } = require('../models/comment');

/** 댓글 작성 */
exports.writeComment = async (req, res, next) => {
    const writer = req.user.id;
    const nickname = req.user.nickname;
    const postId = parseInt(req.params.postId);
    const board = req.query.board;
    const { content } = req.body;

    if (!content || content === '') {
        res.status(400).json({ "message":"댓글이 입력되지 않았습니다." });
    }
    else if (!board) {
        res.status(400).json({ "message": "게시판이 없습니다." });
    }
    else if (!["lecture", "channel", "freeboard"].includes(board)) {
        res.status(400).json({ "message": "존재하지 않는 게시판입니다." });
    }
    else {
        try {
            if (board === "lecture") {
                await insertLectureComment(postId, writer, nickname, content);
                await updateLectureCommentCountUp(postId);
            }
            else if (board === "channel") {
                await insertChannelComment(postId, writer, nickname, content);
                await updateChannelCommentCountUp(postId);
            }
            else if (board === "freeboard") {
                await insertFreeBoardComment(postId, writer, nickname, content);
                await updateFreeBoardCommentCountUp(postId);
            }

            res.sendStatus(200);
        } catch (error) {
            console.error(error);
            next(error);
        };
    }   
};

/** 댓글 수정 */
exports.editComment = async (req, res, next) => {
    const userId = req.user.id;
    const commentId = parseInt(req.params.commentId);
    const { content } = req.body;

    if (!content || content === '') {
        res.status(400).json({ "message":"댓글이 입력되지 않았습니다." });
    }

    try {
        const commentInfo = await selectCommentWriterByPostId(commentId);

        if (userId !== commentInfo.comment_writer) { // 해당 답변을 작성한 유저가 아니라면
            return res.status(403).json({ "message": "접근 권한이 없습니다." });
        }

        await updateComment(content, commentId);

        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        next(error);
    };
};

/** 댓글 삭제 */
exports.deleteComment = async (req, res, next) => {
    const userId = req.user.id;
    const commentId = parseInt(req.params.commentId);
    const postId = parseInt(req.params.postId);
    const board = req.query.board;
    
    if (!board) {
        res.status(400).json({ "message": "게시판이 없습니다." });
    }
    else if (!["lecture", "channel", "freeboard"].includes(board)) {
        res.status(400).json({ "message": "존재하지 않는 게시판입니다." });
    }
    else {
        try {
            const commentInfo = await selectCommentWriterByPostId(commentId);

            if (userId !== commentInfo.comment_writer) { // 해당 답변을 작성한 유저가 아니라면
                return res.status(403).json({ "message": "접근 권한이 없습니다." });
            }

            if (board === "lecture") {
                await deleteComment(commentId);
                await updateLectureCommentCountDown(postId);
            }
            else if (board === "channel") {
                await deleteComment(commentId);
                await updateChannelCommentCountDown(postId);
            }
            else if (board === "freeboard") {
                await deleteComment(commentId);
                await updateFreeBoardCommentCountDown(postId);
            }
            
            res.sendStatus(200);
        } catch (error) {
            console.error(error);
            next(error);
        };
    }
};