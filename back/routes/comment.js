const express = require('express');
const router = express.Router();

const { writeComment, editComment, deleteComment } = require('../controllers/comment');
const { isLoggedIn } = require('../middlewares/checkLogin');

// 게시글 댓글 작성 POST
// POST /comment/:postId/?board={lecture or channel or freeboard}
router.post('/:postId', isLoggedIn, writeComment);

// 게시글 댓글 수정 PUT
// PUT /comment/:postId/:commentId/
router.put('/:postId/:commentId', isLoggedIn, editComment);

// 게시글 댓글 삭제 DELETE
// DELETE /comment/:postId/:commentId/?board={lecture or channel or freeboard}
router.delete('/:postId/:commentId', isLoggedIn, deleteComment);

module.exports = router;