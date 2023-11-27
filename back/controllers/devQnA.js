// db models : devQnA model
const { questionList,
    bestQuestionList,
    searchQuestionWriter,
    searchQuestionTag,
    searchQuestionTitle,
    selectQuestion,
    selectQuestionTagListById,
    selectAnswer,
    insertQuestion,
    insertQuestionTagList,
    selectQuestionUpdatePage,
    updateQuestion,
    deleteQuestionTagList,
    deleteQuestion,
    insertAnswer,
    updateAnswerCountUp,
    updateAnswer,
    deleteAnswer,
    updateAnswerCountDown,
    getQuestionCount,
    getBestQuestionCount,
    getQuestionCountByWriter,
    getQuestionCountByTag,
    getQuestionCountByTitle,
    selectQuestionWriterByPostId,
    selectAnswerWriterByPostId } = require('../models/devQnA');

const { insertTagList } = require('../models/tag');

const { getPaginationData, getOffset, getCurrentPage, isInvalidPage } = require('../paging');
const { updateKorDateOnPage, updateDateOnList, updateDateOnListInPage } = require('../timeSet');

const dotenv = require('dotenv');
dotenv.config();

const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.CHATGPT_API_KEY });

// chatgpt 답변 요청
async function getGPTanswer(question_content, questionPostId) {
    console.log(question_content, questionPostId);
    const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: "너는 프로그래밍 질문에 답변을 하는 선생님이야. 마크다운 형식으로 답변해줘." },
            { role: "user", content: question_content }
        ],
        model: "gpt-3.5-turbo-1106",
        //response_format: { type: "json_object" },
    });
    
    await insertAnswer('1234', '따봉도치봇', questionPostId, completion.choices[0].message.content);
    await updateAnswerCountUp(questionPostId);
    console.log(completion.choices[0].message.content);
    return;
};

// 목록 쿼리에 대입할 변수
const LIMIT = '20'; // 한 번에 검색할 게시글 개수
const RATE = 20; // 추천글 조건 추천수

// 페이징에 필요한 변수
const POSTS_PER_PAGE = 20; // 한 페이지 당 표시할 게시글 개수
const DISPLAY_PAGE_NUM = 10; // 한 번에 표시할 페이지 개수
const PAGING_FLAG = 5; // 페이징 기준

/** 질문 게시글 & 질문 추천글 목록 */
exports.list = async (req, res, next) => {
    const mode = req.query.mode; // mode=best 추천글 목록
    const offset = getOffset(req.query.p); // offset 반환
    const currentPage = getCurrentPage(req.query.p); // 현재 페이지 검증 후 반환

    try {
        if (mode === "best") {
            const row = await getBestQuestionCount(RATE);
            const paginationData = getPaginationData(PAGING_FLAG, currentPage, POSTS_PER_PAGE, row.total_posts, DISPLAY_PAGE_NUM);
            let result = await bestQuestionList(RATE, LIMIT, offset);
            result = updateDateOnList(result);
            res.status(200).json([paginationData, result]);
        }
        else {
            const row = await getQuestionCount();
            const paginationData = getPaginationData(PAGING_FLAG, currentPage, POSTS_PER_PAGE, row.total_posts, DISPLAY_PAGE_NUM);
            let result = await questionList(LIMIT, offset);
            result = updateDateOnList(result);
            res.status(200).json([paginationData, result]);
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};

/** 질문 게시글 검색 결과 목록 */
exports.search = async (req, res, next) => {
    const offset = getOffset(req.query.p); // offset 반환
    const currentPage = getCurrentPage(req.query.p); // 현재 페이지 검증 후 반환

    try {
        if (req.query.writer) {
            const row = await getQuestionCountByWriter(req.query.writer);
            const paginationData = getPaginationData(PAGING_FLAG, currentPage, POSTS_PER_PAGE, row.total_posts, DISPLAY_PAGE_NUM);
            let result = await searchQuestionWriter(req.query.writer, LIMIT, offset);
            result = updateDateOnList(result);
            res.status(200).json([paginationData, result]);
        }
        else if (req.query.title) {
            const row = await getQuestionCountByTitle(req.query.title);
            const paginationData = getPaginationData(PAGING_FLAG, currentPage, POSTS_PER_PAGE, row.total_posts, DISPLAY_PAGE_NUM);
            let result = await searchQuestionTitle(req.query.title, LIMIT, offset);
            result = updateDateOnList(result);
            res.status(200).json([paginationData, result]);
        }
        else if (req.query.tag) {
            const row = await getQuestionCountByTag(req.query.tag);
            const paginationData = getPaginationData(PAGING_FLAG, currentPage, POSTS_PER_PAGE, row.total_posts, DISPLAY_PAGE_NUM);
            let result = await searchQuestionTag(req.query.tag, LIMIT, offset);
            result = updateDateOnList(result);
            res.status(200).json([paginationData, result]);
        }
    } catch (error) {
        console.error(error);
        res.next(error);
    }
};

/** 질문 게시글 페이지 */
exports.page = async (req, res, next) => {
    if (!isInvalidPage(req.params.id)) {
        return res.status(404).json({ "message": "잘못된 게시글 ID입니다." });
    }

    const id = parseInt(req.params.id);
    const isAdmin = (req.isAuthenticated()) ? req.user.is_admin : 0;

    try {
        const question = await selectQuestion(id);

        if (!question) {
            return res.status(404).json({ "message": "존재하지 않는 글입니다." });
        }

        question.date = updateKorDateOnPage(question.date);
        question.recent_update_date = updateKorDateOnPage(question.recent_update_date);

        const tagList = await selectQuestionTagListById(id);
        let answer = await selectAnswer(id);

        if (answer.length > 0) {
            answer = updateDateOnListInPage(answer, 'date');
            answer = updateDateOnListInPage(answer, 'recent_update_date');
        }

        res.status(200).json([{ isAdmin: isAdmin }, question, tagList, answer]);
    } catch (error) {
        console.error(error);
        next(error);
    };
};

/** 질문 게시글 작성 */
exports.writeQuestion = async (req, res, next) => {
    const writer = req.user.id;
    const nickname = req.user.nickname;
    const { title, content, mainTag, tags, is_gpt } = req.body;

    try {
        const insertResult = await insertQuestion(writer, nickname, title, content, mainTag);
        const questionPostId = insertResult.insertId;

        await Promise.all(tags.map(async (tag) => {
            await insertTagList(tag);
            await insertQuestionTagList(questionPostId, tag);
        }));
        res.status(200).json({ "questionPostId": questionPostId });
        try {
            if (is_gpt === true) {
                await getGPTanswer(content, questionPostId);
            }
        } catch (error) {
            console.error(error);
        }
    } catch (error) {
        console.error(error);
        next(error);
    };
};

/** 질문 게시글 수정 페이지 */
exports.editQuestionPage = async (req, res, next) => {
    if (!isInvalidPage(req.params.id)) {
        return res.status(404).json({ "message": "잘못된 게시글 ID입니다." });
    }

    const postId = parseInt(req.params.id);
    const userId = req.user.id;

    try {
        const question = await selectQuestionUpdatePage(postId);

        if (!question) { // 해당 게시글이 존재하지 않으면
            return res.status(404).json({ "message": "존재하지 않는 글입니다." });
        }

        if (userId !== question.question_writer) { // 해당 게시글을 작성한 유저가 아니라면
            return res.status(403).json({ "message": "접근 권한이 없습니다." });
        }

        const tagList = await selectQuestionTagListById(postId);

        res.status(200).json([question, tagList]);
    } catch (error) {
        console.error(error);
        next(error);
    };
};

/** 질문 게시글 수정 */
exports.editQuestion = async (req, res, next) => {
    if(!isInvalidPage(req.params.id)) {
        return res.status(404).json({ "message": "잘못된 게시글 ID입니다." });
    }

    const postId = parseInt(req.params.id);
    const userId = req.user.id;
    const { title, content, mainTag, tags } = req.body;

    try {
        const questionWriter = await selectQuestionWriterByPostId(postId);

        if (!questionWriter) {
            return res.status(404).json({ "message": "존재하지 않는 글입니다." });
        }

        if (userId !== questionWriter.question_writer) { // 해당 게시글을 작성한 유저가 아니라면
            return res.status(403).json({ "message": "접근 권한이 없습니다." });
        }

        await updateQuestion(title, content, mainTag, postId);
        await deleteQuestionTagList(postId);
        await Promise.all(tags.map(async (tag) => {
            await insertTagList(tag);
            await insertQuestionTagList(postId, tag);
        }));

        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        next(error);
    };
};

/** 질문 게시글 삭제 */
exports.deleteQuestion = async (req, res, next) => {
    if(!isInvalidPage(req.params.id)) {
        return res.status(404).json({ "message": "잘못된 게시글 ID입니다." });
    }

    const postId = parseInt(req.params.id);
    const isAdmin = (req.isAuthenticated()) ? req.user.is_admin : 0; // 특정 사용자만 강의 게시글을 삭제할 수 있게 해주기 위한 상수 (기능 작성 x)
    const userId = req.user.id;

    try {
        const questionWriter = await selectQuestionWriterByPostId(postId);

        if (!questionWriter) {
            return res.status(404).json({ "message": "존재하지 않는 글입니다." });
        }

        if (isAdmin === 0 && userId !== questionWriter.question_writer) { // 해당 게시글을 작성한 유저가 아니라면
            return res.status(403).json({ "message": "접근 권한이 없습니다." });
        }

        await deleteQuestion(postId);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        next(error);
    };
};

/** 답변 작성 */
exports.writeAnswer = async (req, res, next) => {
    if(!isInvalidPage(req.params.id)) {
        return res.status(404).json({ "message": "잘못된 게시글 ID입니다." });
    }

    const writer = req.user.id;
    const nickname = req.user.nickname;
    const postId = parseInt(req.params.id);
    const { content } = req.body;

    if (!content || content === '') {
        res.status(400).json({ "message": "답변이 입력되지 않았습니다." });
    }

    try {
        await insertAnswer(writer, nickname, postId, content);
        await updateAnswerCountUp(postId);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        next(error);
    };
};

/** 답변 수정 */
exports.editAnswer = async (req, res, next) => {
    if(!isInvalidPage(req.params.answerId) || !isInvalidPage(req.params.id)) {
        return res.status(404).json({ "message": "잘못된 게시글 ID입니다." });
    }

    const userId = req.user.id;
    const answerId = parseInt(req.params.answerId);
    const { content } = req.body;

    if (!content || content === '') {
        res.status(400).json({ "message": "답변이 입력되지 않았습니다." });
    }

    try {
        const answerWriter = await selectAnswerWriterByPostId(answerId);

        if (!answerWriter) {
            return res.status(404).json({ "message": "존재하지 않는 답변입니다." });
        }

        if (userId !== answerWriter.answer_writer) { // 해당 답변을 작성한 유저가 아니라면
            return res.status(403).json({ "message": "접근 권한이 없습니다." });
        }

        await updateAnswer(content, answerId);

        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        next(error);
    };
};

/** 답변 삭제 */
exports.deleteAnswer = async (req, res, next) => {
    if(!isInvalidPage(req.params.answerId) || !isInvalidPage(req.params.id)) {
        return res.status(404).json({ "message": "잘못된 게시글 ID입니다." });
    }

    const userId = req.user.id;
    const answerId = parseInt(req.params.answerId);
    const postId = parseInt(req.params.id);

    try {
        const answerWriter = await selectAnswerWriterByPostId(answerId);

        if (!answerWriter) {
            return res.status(404).json({ "message": "존재하지 않는 답변입니다." });
        }

        if (userId !== answerWriter.answer_writer) { // 해당 답변을 작성한 유저가 아니라면
            return res.status(403).json({ "message": "접근 권한이 없습니다." });
        }

        await deleteAnswer(answerId);
        await updateAnswerCountDown(postId);

        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        next(error);
    };
};

// 라우터 -> 컨트롤러 -> 서비스(요청, 응답)
