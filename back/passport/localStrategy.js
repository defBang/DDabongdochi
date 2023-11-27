const passport = require('passport');
const { selectUserByEmail } = require('../models/user');
const { Strategy: LocalStrategy } = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// 이메일 로그인 처리
module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email', // req.body.email
        passwordField: 'password', // req.body.password
        passReqToCallback: false
    }, async (email, password, done) => { // done(서버 실패, 성공 유저, 로직 실패)
        try {
            const existUser = await selectUserByEmail(email);
            if (existUser) {
                const isPasswordMatch = await bcrypt.compare(password, existUser.hashed_password);
                if (isPasswordMatch === true) {
                    done(null, existUser); // 성공 유저
                } else {
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.' }); // 로직 실패
                }
            } else {
                done(null, false, { message: '가입되지 않은 회원입니다.' });
            }
        } catch (error) {
            console.error(error);
            done(error); // 서버 실패
        }
    }));
}; // done이 호출되면 controllers/user.js로 넘어감