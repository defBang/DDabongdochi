// db models : user model
const { checkDuplicateEmail,
    checkDuplicateNickname,
    insertUser,
    selectUserByEmail,
    changeUserPasswordById } = require('../models/user');
const { sendEmail, generateRandomPassword} = require('../email');

const passport = require('passport');
const bcrypt = require('bcrypt');

/** 이메일 중복 확인 */
exports.checkDuplicateEmail = async (req, res, next) => {
    const encodedEmail = req.params.email;
    const email = decodeURIComponent(encodedEmail);

    try {
        const isEmailDuplicate = await checkDuplicateEmail(email);

        if (!isEmailDuplicate) {
            res.json({ "isEmailDuplicate": false }); // 중복 아님
        } else {
            res.json({ "isEmailDuplicate": true }); // 중복
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}

/** 닉네임 중복 확인 */
exports.checkDuplicateNickname = async (req, res, next) => {
    const encodedNickname = req.params.nickname;
    const nickname = decodeURIComponent(encodedNickname);

    try {
        const isNicknameDuplicate = await checkDuplicateNickname(nickname);

        if (!isNicknameDuplicate) {
            res.json({ "isNicknameDuplicate": false }); // 중복 아님
        } else {
            res.json({ "isNicknameDuplicate": true }); // 중복
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}

/** 회원가입 */
exports.signUp = async (req, res, next) => {
    const { email, nickname, password } = req.body;
    try {
        // 해당 이메일로 가입한 유저가 있는지 확인
        const isEmailAvailable = await checkDuplicateEmail(email);
        if (isEmailAvailable) {
            return res.status(403).json({
                "message": "해당 이메일로 가입한 유저가 존재합니다."
            });
        }

        // password 암호화
        const hashedPassword = await bcrypt.hash(password, 12);

        // DB에 신규 유저 정보 INSERT
        await insertUser(email, nickname, hashedPassword);

        res.sendStatus(200); // 회원가입 완료
    } catch (error) {
        console.error(error);
        next(error);
    }
};

/** 로그인 */
exports.signIn = async (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => { // 서버실패, 성공유저, 로직실패
        if (authError) { // 서버 실패
            console.log(authError);
            return next(authError); // 에러 처리 미들웨어로 넘김
        }
        if (!user) { // 유저가 없음 -> 비밀번호가 일치하지 않음 -> 로직 실패
            return res.status(400).json(info);
        }
        return req.login(user, (loginError) => { // 로그인 성공
            if (loginError) { // 로그인 에러 발생
                console.log(loginError);
                return next(loginError);
            }

            const loginUserInfo = {
                userId: user.id,
                nickname: user.nickname,
                email: user.email
            };
            return res.status(200).json(loginUserInfo);
        });
    })(req, res, next);
};

/** 로그아웃 */
exports.signOut = (req, res, next) => { // 세션 쿠키를 없애서 로그아웃
    req.logout(function(err) {
        if (err) { return next(err); }
        req.session.destroy();
        res.sendStatus(200); 
    });
};

/** 비밀번호 찾기 */
exports.findPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        // 해당 이메일로 가입한 유저가 있는지 확인
        const isEmailCheck = await selectUserByEmail(email);
        if (!isEmailCheck) {
            return res.status(403).json({
                "message": "해당 이메일로 가입한 유저가 없습니다."
            });
        }
        
        const randomPassword = await generateRandomPassword();
        const userId = isEmailCheck.id;

        const title = "따봉도치 비밀번호 변경";
        const message = `변경된 비밀번호 : ${randomPassword}`+"\n변경된 비밀번호로 로그인후 비밀번호 변경을 권장 합니다.";

        await sendEmail(email, title, message);

        // password 암호화
        const hashedPassword = await bcrypt.hash(randomPassword, 12);

        // 패스워드 변경
        await changeUserPasswordById(hashedPassword, userId);

        res.sendStatus(200); //변경 완료
    } catch (error) {
        console.error(error);
        next(error);
    }
};

/** 비밀번호 확인 */
exports.passwordCheck = async (req, res, next) => {
    const userEmail = req.user.email;
    const { password } = req.body;

    try {
        const existUser = await selectUserByEmail(userEmail);
        const isPasswordMatch = await bcrypt.compare(password, existUser.hashed_password);

        if(!isPasswordMatch) {
            return res.status(400).json({ "message": "비밀번호가 일치하지 않습니다." });
        }

        res.sendStatus(200); //비밀번호 확인
    } catch (error) {
        console.error(error);
        next(error);
    }
};

/** 비밀번호 변경 */
exports.changePassword = async (req, res, next) => {
    const writer = req.user.id;
    const { newPassword, passwordCheck } = req.body;

    try {
        if(newPassword !== passwordCheck) {
            return res.status(400).json({ "message": "비밀번호가 일치하지 않습니다." });
        }
        // password 암호화
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // 패스워드 변경
        await changeUserPasswordById(hashedPassword, writer);

        res.sendStatus(200); //비밀번호 변경 완료
    } catch (error) {
        console.error(error);
        next(error);
    }
};