// 로그인 여부 검사
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) { // passport 통해서 로그인 했는지
        next();
    } else {
        res.status(403).json({
            "message":"로그인이 필요합니다."
        }); // 로그인 필요
    }
};

// 비로그인 여부 검사
exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) { // passport 통해서 로그인 안했는지
        next();
    } else {
        res.status(403).json({
            "message":"로그인 상태입니다." 
        }); // 이미 로그인되어있음
    }
};