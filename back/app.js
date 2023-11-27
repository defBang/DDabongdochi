const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport'); // 로그인 기능에 필요한 패키지
const cors = require('cors');
const helmet = require('helmet'); // 보안 관련 패키지
const hpp = require('hpp');
const redis = require('redis'); // redis 패키지
const RedisStore = require('connect-redis').default;

// .env 정보 불러오기
dotenv.config(); 

//reids와 연결
const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    password: process.env.REDIS_PASSWORD,
    legacyMode: false
});
redisClient.connect().catch(console.error);

// Router 설정
const userRouter = require('./routes/user');
const lectureRouter = require('./routes/lecture');
const channelRouter = require('./routes/channel');
const qnaRouter = require('./routes/devQnA');
const commentRouter = require('./routes/comment');
const recommenderRouter = require('./routes/recommender');
const myPageRouter = require('./routes/myPage');
const freeBoardRouter = require('./routes/freeBoard');
const passportConfig = require('./passport'); // passport 설정 가져오기

const app = express();
passportConfig(); // passport 설정
app.set('port', process.env.PORT || 80); // 포트 설정

// helmet, hpp 설정
if (process.env.NODE_ENV === 'production') { // 배포할 때 적용
    app.use(helmet({
        contentSecurityPolicy: false,
        corssOriginEmbedderPolicy: false,
        corssOriginResourcePolicy: false
    }));
    app.use(hpp());
    app.use(morgan('combined'));
} else { // 배포하지 않을 때 적용
    app.use(morgan('dev'));
}

app.use(express.json()); // 
app.use(express.urlencoded({ extended: true })); // form 파싱
app.use(cookieParser(process.env.COOKIE_SECRET)); // { connect.sid: 값 }
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true, // 자바스크립트 접근 금지
        secure: false, // https 적용 X
    },
    store: new RedisStore({ client: redisClient })
}));

// passport 미들웨어
app.use(passport.initialize()); // req.user, req.login, req.isAuthenticate, req.logout
app.use(passport.session()); // connect.sid라는 이름으로 세션 쿠키가 브라우저로 전송

// CORS 설정
app.use(cors({
    origin: "http://ddabongdochi.com", // http://localhost:8080
    credentials: true,
}));

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// 라우터 연결
app.use('/api/user', userRouter);
app.use('/api/lecture', lectureRouter);
app.use('/api/channel', channelRouter);
app.use('/api/devQnA', qnaRouter);
app.use('/api/comment', commentRouter);
app.use('/api/recommender', recommenderRouter);
app.use('/api/mypage', myPageRouter);
app.use('/api/freeboard', freeBoardRouter);

// 없는 라우터에 요청을 보냈을 때 404 발생
app.use('/api/*', (req, res, next) => { // 404 NOT FOUND
    const error = new Error(); // '${req.method} ${req.url} 라우터가 없습니다.'
    error.message = { "message": "NOT FOUND" };
    error.status = 404;
    next(error);
}); 

// vue 정적 파일 라우팅
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
    if (err.status === 404) {
        return res.status(err.status).json(err.message);
    } else {
        const error = process.env.NODE_ENV !== 'production' ? err : {}; // 배포 모드가 아닐 때 에러 발생
        const errorMessage = process.env.NODE_ENV !== 'production' ? error.message : { "message": "서버 오류!" };
        console.error(errorMessage);
        return res.status(err.status || 500).json(errorMessage);
    }
});

module.exports = app;