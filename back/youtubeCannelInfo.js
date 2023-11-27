const dotenv = require('dotenv');
const { google } = require('googleapis');

dotenv.config();

const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY,
});

const getYoutubeVideoId = (url) => {
    let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    if (url) {
        let matches = url.match(regExp);
        return matches ? matches[7] : false;
    }
};

const getChannelId = async function (videoId) {
    const res = await youtube.videos.list({
        part: "snippet",
        id: videoId,
    });

    return res.data.items[0].snippet.channelId;
};

const getCannelInfo = async function (videoId) {
    const res1 = await youtube.videos.list({
        part: "snippet",
        id: videoId,
    });

    const channelId = res1.data.items[0].snippet.channelId;

    const res2 = await youtube.channels.list({
        part: ["snippet", "statistics"],
        id: channelId,
    });

    const info = res2.data.items[0];

    return {
        id: info.id, // 채널 ID
        name: info.snippet.title, // 채널 이름
        link: 'https://www.youtube.com/' + info.snippet.customUrl, // 채널 링크
        profileImgUrl: info.snippet.thumbnails.medium.url, // 채널 프로필 이미지
        description: info.snippet.description, // 채널 설명
        subscriberCount: info.statistics.subscriberCount, // 구독자
        videoCount: info.statistics.videoCount, // 동영상 개수
        viewCount: info.statistics.viewCount, // 총 조회수
        publishedAt: info.snippet.publishedAt, // 가입일
        country: info.snippet.country, // 국가
    };
};

module.exports = {
    getChannelId,
    getYoutubeVideoId,
    getCannelInfo
}