// db 연결
const promisePool = require('../db');

/** 태그 리스트 추가 */
const insertTagList = async function (tagName) {
    try {
        await promisePool.execute(
            `INSERT IGNORE INTO tag  VALUES (?);`,
            [tagName]);
    } catch (error) {
        console.error(error);
        throw(error);
    }
}

module.exports = {
    insertTagList
}