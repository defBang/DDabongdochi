const { getMyQuestionCount,
    getMyAnswerCount,
    getMyCommentCount,
    getMyFreeBoardCount } = require('../models/myPage');

const { updateKorDateOnPage } = require('../timeSet');

exports.setMyPageInfo = async (req, res, next) => {
    const userId = req.user.id;

    const myQuestionCount = await getMyQuestionCount(userId);
    const myAnswerCount = await getMyAnswerCount(userId);
    const myCommentCount = await getMyCommentCount(userId);
    const myFreeBoardCount = await getMyFreeBoardCount(userId);

    const myInfo = {
        email: req.user.email,
        nickname: req.user.nickname,
        createAt: updateKorDateOnPage(req.user.created_at),
        questionCount: myQuestionCount.total_posts,
        freeBoardCount: myFreeBoardCount.total_posts,
        answerCount: myAnswerCount.total_posts,
        commentCount: myCommentCount.total_posts
    }
    res.locals.myInfo = myInfo;
    next();
}