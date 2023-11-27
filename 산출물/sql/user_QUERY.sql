-- 이메일 중복 체크 checkDuplicateEmail
SELECT id FROM user WHERE email = ?;

-- 닉네임 중복 체크 checkDuplicateNickname
SELECT id FROM user WHERE nickname = ?;

-- 회원가입 insertUser
INSERT INTO user(hashed_password, email, nickname) VALUES(?, ?, ?);

-- email로 특정 사용자 정보 검색 selectUserByEmail
SELECT * FROM user WHERE email = ?;

-- id로 특정 사용자 정보 검색 selectUserById
SELECT * FROM user WHERE id = ?;

-- 비밀번호 변경 changeUserPasswordById
UPDATE user SET hashed_password = ? WHERE id = ?;