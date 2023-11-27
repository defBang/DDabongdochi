const express = require('express');
const router = express.Router();

const { recommendedPosts, writtenPosts } = require('../controllers/myPage');
const { isLoggedIn } = require('../middlewares/checkLogin');

const { setMyPageInfo } = require('../middlewares/getMyPageInfo');

// 추천한 게시글(강의, 채널, 질문, 답변) 목록
// GET /mypage/recommended + /?board={ lecture, channel, question, answer, freeboard }
router.get('/recommended', isLoggedIn, setMyPageInfo, recommendedPosts);

// 유저가 작성한 질문, 답변, 댓글 목록
// GET /mypage/written + /?category={ question, answer, comment, freeboard }
router.get('/written', isLoggedIn, setMyPageInfo, writtenPosts);

module.exports = router;