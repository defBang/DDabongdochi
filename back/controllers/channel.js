// db models : channel model
const { channelList,
    bestChannelList,
    searchChannelTag,
    searchChannelTitle,
    selectChannel,
    selectChannelTagListById,
    selectChannelComment,
    insertChannel,
    insertChannelTagList,
    selectChannelUpdatePage,
    updateChannel,
    deleteChannelTagList,
    deleteChannel,
    getChannelCount,
    getBestChannelCount,
    getChannelCountByTag,
    getChannelCountByTitle,
    getChannelIdByPostId } = require('../models/channel');

const { insertTagList } = require('../models/tag');
const { getChannelId, getYoutubeVideoId, getCannelInfo } = require('../youtubeCannelInfo');

const { getPaginationData, getOffset, getCurrentPage, isInvalidPage } = require('../paging');
const { updateKorDateOnPage, updateDateOnList, updateDateOnListInPage } = require('../timeSet');

// 목록 쿼리에 대입할 변수
const LIMIT = '20'; // 한 번에 검색할 게시글 개수
const RATE = 20; // 추천글 조건 추천수

// 페이징에 필요한 변수
const POSTS_PER_PAGE = 20; // 한 페이지 당 표시할 게시글 개수
const DISPLAY_PAGE_NUM = 10; // 한 번에 표시할 페이지 개수
const PAGING_FLAG = 5; // 페이징 기준

/** 채널 게시글 & 채널 추천글 목록 */
exports.list = async (req, res, next) => {
    const mode = req.query.mode; // if mode===best 추천글 목록
    const offset = getOffset(req.query.p); // offset 반환
    const currentPage = getCurrentPage(req.query.p); // 현재 페이지 검증 후 반환

    try {
        if (mode === "best") {
            const row = await getBestChannelCount(RATE);
            const paginationData = getPaginationData(PAGING_FLAG, currentPage, POSTS_PER_PAGE, row.total_posts, DISPLAY_PAGE_NUM);
            let result = await bestChannelList(RATE, LIMIT, offset);
            result = updateDateOnList(result);
            res.status(200).json([paginationData, result]);
        } else if (mode === undefined) {
            const row = await getChannelCount();
            const paginationData = getPaginationData(PAGING_FLAG, currentPage, POSTS_PER_PAGE, row.total_posts, DISPLAY_PAGE_NUM);
            let result = await channelList(LIMIT, offset);
            result = updateDateOnList(result);
            res.status(200).json([paginationData, result]);
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};

/** 채널 게시글 검색 결과 목록 */
exports.search = async (req, res, next) => {
    const offset = getOffset(req.query.p); // offset 반환
    const currentPage = getCurrentPage(req.query.p); // 현재 페이지 검증 후 반환

    try {
        if (req.query.title !== undefined) {
            const row = await getChannelCountByTitle(req.query.title);
            const paginationData = getPaginationData(PAGING_FLAG, currentPage, POSTS_PER_PAGE, row.total_posts, DISPLAY_PAGE_NUM);
            let result = await searchChannelTitle(req.query.title, LIMIT, offset);
            result = updateDateOnList(result);
            res.status(200).json([paginationData, result]);
        }
        else if (req.query.tag !== undefined) {
            const row = await getChannelCountByTag(req.query.tag);
            const paginationData = getPaginationData(PAGING_FLAG, currentPage, POSTS_PER_PAGE, row.total_posts, DISPLAY_PAGE_NUM);
            let result = await searchChannelTag(req.query.tag, LIMIT, offset);
            result = updateDateOnList(result);
            res.status(200).json([paginationData, result]);
        }
    } catch (error) {
        console.error(error);
        res.next(error);
    }
};

/** 채널 게시글 페이지 */
exports.page = async (req, res, next) => {
    if(!isInvalidPage(req.params.id)) {
        return res.status(404).json({ "message": "잘못된 게시글 ID입니다." });
    }

    const id = parseInt(req.params.id);
    const isAdmin = (req.isAuthenticated()) ? req.user.is_admin : 0;

    try {
        const channel = await selectChannel(id);

        if (!channel) {
            return res.status(404).json({ "message": "존재하지 않는 글입니다." });
        }

        channel.date = updateKorDateOnPage(channel.date);
        channel.recent_update_date = updateKorDateOnPage(channel.recent_update_date);

        const tagList = await selectChannelTagListById(id);
        let comment = await selectChannelComment(id);

        if (comment.length > 0) {
            comment = updateDateOnListInPage(comment, 'date');
            comment = updateDateOnListInPage(comment, 'recent_update_date');
        }
        
        res.status(200).json([{ isAdmin: isAdmin }, channel, tagList, comment]);
    } catch (error) {
        console.error(error);
        next(error);
    };
};


/** 채널 게시글 작성 */ // 1126 수정
exports.writeChannel = async (req, res, next) => {
    const { videoLink, mainTag, tags } = req.body;

    const videoId = getYoutubeVideoId(videoLink);

    if (!videoId) {
        return res.status(400).json({ "message": "잘못된 유튜브 url입니다." });
    }

    try {
        const channel = await getCannelInfo(videoId);
        channel.publishedAt = channel.publishedAt.slice(0, 10);
        const insertResult = await insertChannel(channel.name, channel.link, channel.profileImgUrl, videoLink, mainTag, channel.id, channel.description, channel.subscriberCount, channel.videoCount, channel.viewCount, channel.publishedAt, channel.country);
        const channelPostId = insertResult.insertId;

        await Promise.all(tags.map(async (tag) => {
            await insertTagList(tag);
            await insertChannelTagList(channelPostId, tag);
        }));

        res.status(200).json({"channel_post_id": channelPostId});
    } catch (error) {
        console.error(error);
        next(error);
    };
};

/** 채널 게시글 수정 페이지 */ 
exports.editChannelPage = async (req, res, next) => {
    if(!isInvalidPage(req.params.id)) {
        return res.status(404).json({ "message": "잘못된 게시글 ID입니다." });
    }
    
    const postId = parseInt(req.params.id);

    try {
        const channelCheck = await selectChannel(postId);

        if (!channelCheck) {
            return res.status(404).json({ "message": "존재하지 않는 글입니다." });
        }

        const channel = await selectChannelUpdatePage(postId);
        const tagList = await selectChannelTagListById(postId);

        res.status(200).json([ channel, tagList ]);
    } catch (error) {
        console.error(error);
        next(error);
    };
};

/** 채널 게시글 수정 */ // 1126 수정
exports.editChannel = async(req, res, next) =>{
    if(!isInvalidPage(req.params.id)) {
        return res.status(404).json({ "message": "잘못된 게시글 ID입니다." });
    }

    const postId = parseInt(req.params.id);
    const { videoLink, mainTag, tags } = req.body;

    const videoId = getYoutubeVideoId(videoLink);

    if (!videoId) {
        return res.status(400).json({ "message": "잘못된 유튜브 url입니다." });
    }

    try {
        // DB에서 유튜브 채널 ID를 가져옴
        const channelId = await getChannelIdByPostId(postId);

        // 해당 유튜브 채널이 존재하지 않으면 오류 메시지 출력
        if (!channelId) {
            return res.status(404).json({ "message": "존재하지 않는 글입니다." });
        }

        // 수정한 메인 비디오의 채널 ID를 가져옴
        const inputChannelId = await getChannelId(videoId);

        // 수정한 메인 비디오의 채널 ID와 DB의 채널 ID가 다르면 오류 메시지 출력
        if (inputChannelId !== channelId.channel_id) {
            return res.status(400).json({ "message": "해당 유튜브 채널의 동영상이 아닙니다." });
        }

        // 해당 채널 정보를 가져옴 (업데이트)
        const channel = await getCannelInfo(videoId);

        await updateChannel(channel.name, channel.link, channel.profileImgUrl, videoLink, mainTag, channel.id, channel.description, channel.subscriberCount, channel.videoCount, channel.viewCount, channel.country, postId);
        await deleteChannelTagList(postId);

        await Promise.all(tags.map(async (tag) => {
            await insertTagList(tag);
            await insertChannelTagList(postId, tag);
        }));

        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        next(error);
    };
}

/** 채널 게시글 삭제 */
exports.deleteChannel = async (req, res, next) => {
    if(!isInvalidPage(req.params.id)) {
        return res.status(404).json({ "message": "잘못된 게시글 ID입니다." });
    }
    
    const postId = parseInt(req.params.id);
    const isAdmin = (req.isAuthenticated()) ? req.user.is_admin : 0; // 특정 사용자만 강의 게시글을 삭제할 수 있게 해주기 위한 상수 (기능 작성 x)
    
    try {
        const channelCheck = await selectChannel(postId);

        if (!channelCheck) {
            return res.status(404).json({ "message": "존재하지 않는 글입니다." });
        }
        else if(isAdmin === 0) {
            return res.status(403).json({ "message": "접근 권한이 없습니다." });
        }

        await deleteChannel(postId);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        next(error);
    };
};

// 라우터 -> 컨트롤러 -> 서비스(요청, 응답)