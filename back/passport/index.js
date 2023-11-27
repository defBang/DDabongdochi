const passport = require('passport');
const local = require('./localStrategy'); // 이메일 로그인
const { selectUserById } = require('../models/user'); // user모델
  
module.exports = () => { 
    passport.serializeUser((user, done) => { // user === exUser
        done(null, user.id); // user id만 추출
    });
    // 세션 {세션쿠키: 유저아이디} -> 메모리에 저장됨

    passport.deserializeUser((id, done) => { // id로부터 user정보를 복원함
        selectUserById(id)
        .then((user) => done(null, user[0])) // req.user
        .catch(err => done(err));
    });

    local();
}