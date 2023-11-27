const express = require('express');
const router = express.Router();

const { list, search, page, writeQuestion, editQuestion, editQuestionPage, deleteQuestion,
writeAnswer, editAnswer, deleteAnswer } = require('../controllers/devQnA');
const { isLoggedIn } = require('../middlewares/checkLogin');

// 질문 게시글 목록
// GET /devQnA/?mode=best
router.get('/', list);

// 질문 게시글 검색
// GET /devQnA/search/?queryString
router.get('/search', search);

// 질문 게시글 작성
// POST /devQnA/write
router.post('/write', isLoggedIn, writeQuestion);

// 질문 게시글 페이지
// GET /devQnA/:id
router.get('/:id', page);

// 질문 게시글 수정 페이지
// GET /devQnA/:id/edit
router.get('/:id/edit', isLoggedIn, editQuestionPage);

// 질문 게시글 수정
// PUT /devQnA/:id/edit
router.put('/:id/edit', isLoggedIn, editQuestion);

// 질문 게시글 삭제
// DELETE /devQnA/:id/delete
router.delete('/:id/delete', isLoggedIn, deleteQuestion);

// 답변 작성
// POST /devQnA/:id/writeAnswer
router.post('/:id/writeAnswer', isLoggedIn, writeAnswer);

// 답변 수정
// PUT /devQnA/:id/:answerId/edit
router.put('/:id/:answerId/edit', isLoggedIn, editAnswer);

// 답변 삭제
// DELETE /devQnA/:answerId/delete
router.delete('/:id/:answerId/delete', isLoggedIn, deleteAnswer);
 
module.exports = router;