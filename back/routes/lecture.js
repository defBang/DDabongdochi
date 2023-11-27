const express = require('express');
const router = express.Router();

const { list, search, page,
    writeLecture, editLecturePage, editLecture, deleteLecture
} = require('../controllers/lecture');
const { isLoggedIn } = require('../middlewares/checkLogin');

// 강의 게시글 목록
// GET /lecture/?mode=best
router.get('/', list);

// 강의 게시글 검색
// GET /lecture/search/?queryString
router.get('/search', search);

// 강의 게시글 페이지
// GET /lecture/:id
router.get('/:id', page);

// 강의 게시글 작성
// POST /lecture/write
router.post('/write', isLoggedIn, writeLecture);

// 강의 게시글 수정 페이지
// GET /lecture/:id/edit
router.get('/:id/edit', isLoggedIn, editLecturePage);

// 강의 게시글 수정
// PUT /lecture/:id/edit
router.put('/:id/edit', isLoggedIn, editLecture);

// 강의 게시글 삭제
// DELETE /lecture/:id/delete
router.delete('/:id/delete', isLoggedIn, deleteLecture);

module.exports = router;