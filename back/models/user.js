// db연결
const promisePool = require('../db');

/** 이메일 중복 체크 */
const checkDuplicateEmail = async function (email) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT id FROM user WHERE email = ?;`,
            [ email ]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    } 
};

/** 닉네임 중복 체크 */
const checkDuplicateNickname = async function (nickname) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT id FROM user WHERE nickname = ?;`,
            [ nickname ]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 회원가입 */
const insertUser = async function (email, nickname, hashedPassword) {
    try {
        const [rows] = await promisePool.execute(
            `INSERT INTO user(hashed_password, email, nickname) VALUES(?, ?, ?);`,
            [ hashedPassword, email, nickname ]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** email로 특정 사용자 정보 검색 */
const selectUserByEmail = async function (email) {
    try {
        const [[rows]] = await promisePool.execute(
            `SELECT * FROM user WHERE email = ?;`,
            [ email ]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** id로 특정 사용자 정보 검색 */
const selectUserById = async function (id) {
    try {
        const [rows] = await promisePool.execute(
            `SELECT * FROM user WHERE id = ?;`,
            [ id ]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/** 비밀번호 변경 */
const changeUserPasswordById = async function (hashedPassword, id) {
    try {
        const [rows] = await promisePool.execute(
            `UPDATE user SET hashed_password = ? WHERE id = ?;`,
            [ hashedPassword, id ]
        );
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports = {
    checkDuplicateEmail,
    checkDuplicateNickname,
    insertUser,
    selectUserByEmail,
    selectUserById,
    changeUserPasswordById
};