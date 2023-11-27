const express = require('express');
const passport = require('passport');

const { isLoggedIn, isNotLoggedIn } = require('../middlewares/checkLogin');
const { signUp, signIn, signOut,
    checkDuplicateEmail, checkDuplicateNickname, 
    findPassword, changePassword, passwordCheck } = require('../controllers/user');

const router = express.Router();

// 회원가입
// POST /user/signUp
router.post('/signUp', isNotLoggedIn, signUp);

// 이메일이 중복인지 확인
// GET /user/signUp/checkEmail/:email
router.get('/signUp/checkEmail/:email', isNotLoggedIn, checkDuplicateEmail);

// 닉네임이 중복인지 확인
// GET /user/signUp/checkNickname/:nickname
router.get('/signUp/checkNickname/:nickname', isNotLoggedIn, checkDuplicateNickname);

// 로그인
// POST /user/signIn
router.post('/signIn', isNotLoggedIn, signIn);

// 로그아웃
// GET /user/signOut
router.get('/signOut', isLoggedIn, signOut);

//비밀번호 찾기
// PUT /user/findPassword
router.put('/findPassword', isNotLoggedIn, findPassword)

//비밀번호 확인
// POST /user/passwordCheck
router.post('/passwordCheck', isLoggedIn, passwordCheck)

//비밀번호 변경
// PUT /user/changePassword
router.put('/changePassword', isLoggedIn, changePassword)

module.exports = router;