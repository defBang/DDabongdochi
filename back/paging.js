/*
totalPosts (모든 게시글 개수) -> 쿼리검색결과
currentPage (현재 페이지 번호) -> req.query.p
postsPerPage (한 페이지 당 표시할 게시글 개수) -> limit
displayPageNum(한 번에 표시할 페이지 개수) -> 10
pagingFlag 페이징 기준

totalPages (총 페이지 개수)
startPage (시작 페이지 번호)
endPage (끝 페이지 번호)
isPrev (이전 화살표 유무)
isNext (다음 화살표 유무)
*/

/** 페이징에 필요한 변수 생성*/
exports.getPaginationData = (pagingFlag, currentPage, postsPerPage, totalPosts, displayPageNum) => {
    let totalPages = parseInt(((totalPosts - 1) / postsPerPage) + 1);

    // 100 페이지까지 열람 가능
    if (totalPages > 100) { totalPages = 100; }

    let startPage = 1;
    let endPage = displayPageNum > totalPages ? totalPages : displayPageNum;

    let isPrev = false;
    let isNext = displayPageNum > totalPages ? false : true;
    
    if (currentPage > pagingFlag && currentPage < totalPages) {
        endPage = displayPageNum + (currentPage - pagingFlag);
        isPrev = true;

        if (endPage >= totalPages) {
            endPage = totalPages;
            startPage = totalPages - displayPageNum + 1;
            isNext = false;
        } else {
            startPage = currentPage - pagingFlag + 1;
            isNext = true;
        }
    }

    const paginationData = {
        'startPage': startPage,
        'endPage': endPage,
        'isPrev': isPrev,
        'isNext': isNext,
        'totalPages': totalPages
    };
    return paginationData;
}

/** offset 설정 */
exports.getOffset = (p) => {
    const page = Number(p);
    if(Number.isNaN(page)) {
        return '0';
    }
    // 1~100 페이지만 목록 열람 가능
    if (Number.isInteger(page) && page > 0 && page <= 100) {
        return String((page - 1) * 20);
    } else {
        return '0';
    }
}

/** req.query.p 유효성 검사 */
exports.getCurrentPage = (p) => {
    const page = Number(p);
    if(Number.isNaN(page) || !Number.isInteger(page)) {
        return 1;
    }

    if (Number.isInteger(page) && page > 0 && page <= 100) {
        return page;
    } else {
        return 1;
    }
}

/** req.query.id 유효성 검사 */
exports.isInvalidPage = (p) => {
    const page = Number(p);
    if(!Number.isNaN(page) && Number.isInteger(page)) {
        return true;
    } else {
        return false;
    }
}