const express = require('express');
const router = express.Router();

const { list, search, page,
    writeChannel, editChannelPage, editChannel, deleteChannel } = require('../controllers/channel');
const { isLoggedIn } = require('../middlewares/checkLogin');

// 채널 게시글 목록
// GET /channel/?mode=best
router.get('/', list);

// 채널 게시글 검색
// GET /channel/search/?queryString
router.get('/search', search);

// 채널 게시글 페이지
// GET /channel/:id
router.get('/:id', page);

// 채널 게시글 작성
// POST /lecture/write
router.post('/write', isLoggedIn, writeChannel);

//강의 게시글 수정 페이지
// GET /channel/:id/edit
router.get('/:id/edit', isLoggedIn, editChannelPage)

// 채널 게시글 수정
// PUT /channel/:id/edit
router.put('/:id/edit', isLoggedIn, editChannel);

// 채널 게시글 삭제
// DELETE /channel/:id/delete
router.delete('/:id/delete', isLoggedIn, deleteChannel);

module.exports = router;