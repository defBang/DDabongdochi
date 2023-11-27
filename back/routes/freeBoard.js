const express = require('express');
const router = express.Router();

const { list, search, page, writeFreeBoard, editFreeBoardPage, 
editFreeBoard, deleteFreeBoard } = require('../controllers/freeBoard');
const { isLoggedIn } = require('../middlewares/checkLogin');

// 자유게시판 게시글 목록
// GET /freeBoard/?mode=best
router.get('/', list);

// 자유게시판 게시글 검색
// GET /freeBoard/search/?queryString
router.get('/search', search);

// 자유게시판 게시글 작성
// POST /freeBoard/write
router.post('/write', isLoggedIn, writeFreeBoard);

// 자유게시판 게시글 페이지
// GET /freeBoard/:id
router.get('/:id', page);

// 자유게시판 게시글 수정 페이지
// GET /freeBoard/:id/edit
router.get('/:id/edit', isLoggedIn, editFreeBoardPage);

// 자유게시판 게시글 수정
// PUT /freeBoard/:id/edit
router.put('/:id/edit', isLoggedIn, editFreeBoard);

// 자유게시판 게시글 삭제
// DELETE /freeBoard/:id/delete
router.delete('/:id/delete', isLoggedIn, deleteFreeBoard);

module.exports = router;