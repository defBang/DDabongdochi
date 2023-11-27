const getKorDateOnList = (date) => {
    const gmtDate = new Date(date);
    const koreaTime = new Date(gmtDate.getTime() + 9 * 60 * 60 * 1000);
    const koreaDate = new Date(Date.now() + 9 * 60 * 60 * 1000);
    const timeDifference = koreaDate.getTime() - koreaTime.getTime();

    if (timeDifference <= 24 * 60 * 60 * 1000) {
        const formattedTime = koreaTime.toISOString().slice(0, 19).replace("T", " ").substring(11, 16); // 11,16
        return formattedTime;
    } else {
        const formattedDate = koreaTime.toISOString().slice(0, 19).replace("T", " ").substring(5, 10);
        return formattedDate;
    }
};

const getKorDateOnPage = (date) => {
    if (date === null) {
        return null;
    }

    const gmtDate = new Date(date);
    const koreaTime = new Date(gmtDate.getTime() + 9 * 60 * 60 * 1000);
    const formattedDate = koreaTime.toISOString().slice(0, 19).replace("T", " ");

    return formattedDate;
}

/** 게시글 페이지 내 작성일 가공 */
exports.updateKorDateOnPage = (date) => {
    return getKorDateOnPage(date);
};

/** 게시글 목록 작성일 가공 */
exports.updateDateOnList = (jsonArray) => {
    return jsonArray.map(item => {
        if (item.hasOwnProperty('date')) {
            return { ...item, ['date']: getKorDateOnList(item['date']) }
        }
        return item;
    });
};

/** 게시글 페이지 내 댓글/답변 목록 작성일, 수정일 가공 */
exports.updateDateOnListInPage = (jsonArray, key) => {
    return jsonArray.map(item => {
        if (item.hasOwnProperty(key)) {
            return { ...item, [key]: getKorDateOnPage(item[key]) }
        }
        return item;
    });
};
