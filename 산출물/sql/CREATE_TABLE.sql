-- 유저 테이블
CREATE TABLE user (
    id INT NOT NULL AUTO_INCREMENT,
    hashed_password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    nickname VARCHAR(20) NOT NULL,
    is_admin TINYINT DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT now(),

    PRIMARY KEY(id),
    UNIQUE INDEX nickname_UNIQUE (nickname ASC)
) COMMENT '회원' ENGINE = InnoDB;

-- 태그 테이블
CREATE TABLE tag (
    tag_name VARCHAR(20) NOT NULL,

    PRIMARY KEY(tag_name)
) COMMENT '태그' ENGINE = InnoDB;

-- 강의 테이블
CREATE TABLE lecture (
    lecture_post_id INT NOT NULL AUTO_INCREMENT,
    lecture_name VARCHAR(100) NOT NULL,
    lecture_platform VARCHAR(20),
    lecture_platform_url TEXT,
    lecturer VARCHAR(20) DEFAULT '알 수 없음' NOT NULL, 
    lecture_link text NOT NULL,
    lecture_profil_img_link TEXT NOT NULL,
    lecture_main_tag VARCHAR(20),

    comment_count INT UNSIGNED DEFAULT 0 NOT NULL,
    rate_up INT DEFAULT 0 NOT NULL,
    rate_down INT DEFAULT 0 NOT NULL,
    date DATETIME NOT NULL DEFAULT now(),
    recent_update_date DATETIME,

    FULLTEXT INDEX idx_ft_lecturer(lecturer) WITH PARSER `ngram`,
    FULLTEXT INDEX idx_ft_lecture_name(lecture_name) WITH PARSER `ngram`,

    PRIMARY KEY(lecture_post_id)
) COMMENT '강의 정보 게시글' ENGINE = InnoDB;

-- 채널 테이블
CREATE TABLE youtube_channel (
    channel_post_id INT NOT NULL AUTO_INCREMENT,
    channel_name VARCHAR(20) NOT NULL, -- 채널 이름
    channel_link TEXT NOT NULL, -- 채널 링크
    channel_profile_img_link TEXT NOT NULL, -- 프로필 이미지 240*240
    channel_main_video_link TEXT NOT NULL, -- 새로 추가 <- 입력받음
    channel_main_tag VARCHAR(20), -- <- 입력받음

    channel_id VARCHAR(30), -- 채널 ID
    description TEXT, -- 설명
    subscriber_count INT, -- 구독자수
    video_count INT, -- 동영상 개수
    view_count INT, -- 조회수
    published_at VARCHAR(10), -- 가입일
    country VARCHAR(20), -- 국가

    comment_count INT UNSIGNED DEFAULT 0 NOT NULL,
    rate_up INT DEFAULT 0 NOT NULL,
    rate_down INT DEFAULT 0 NOT NULL,
    date DATETIME NOT NULL DEFAULT now(),
    recent_update_date DATETIME,

    FULLTEXT INDEX idx_ft_channel_name(channel_name) WITH PARSER `ngram`,

    PRIMARY KEY(channel_post_id)
) COMMENT '유튜브 채널 게시글' ENGINE = InnoDB;

-- 자유게시판 테이블
CREATE TABLE free_board(
    free_post_id INT NOT NULL AUTO_INCREMENT,
    free_writer INT,
    free_writer_nickname VARCHAR(20),
    free_title VARCHAR(100) NOT NULL,
    free_content TEXT NOT NULL,
    free_main_tag VARCHAR(20),

    comment_count INT UNSIGNED DEFAULT 0 NOT NULL,
    rate_up INT DEFAULT 0 NOT NULL,
    rate_down INT DEFAULT 0 NOT NULL,
    date DATETIME NOT NULL DEFAULT now(),
    recent_update_date DATETIME,

    FULLTEXT INDEX idx_ft_free_writer_nickname(free_writer_nickname) WITH PARSER `ngram`,
    FULLTEXT INDEX idx_ft_free_title(free_title) WITH PARSER `ngram`,

    PRIMARY KEY(free_post_id),
    FOREIGN KEY(free_writer) REFERENCES user(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY(free_writer_nickname) REFERENCES user(nickname)
    ON DELETE SET NULL ON UPDATE CASCADE
) COMMENT '자유 게시판' ENGINE = InnoDB;

-- 질문 테이블
CREATE TABLE question (
    question_post_id INT NOT NULL AUTO_INCREMENT,
    question_writer INT,
    question_writer_nickname VARCHAR(20),
    question_title VARCHAR(100) NOT NULL,
    question_content TEXT NOT NULL,
    question_main_tag VARCHAR(20),
    answer_count INT UNSIGNED DEFAULT 0 NOT NULL,

    rate_up INT DEFAULT 0 NOT NULL,
    rate_down INT DEFAULT 0 NOT NULL,
    date DATETIME NOT NULL DEFAULT now(),
    recent_update_date DATETIME,

    FULLTEXT INDEX idx_ft_question_writer_nickname(question_writer_nickname) WITH PARSER `ngram`,
    FULLTEXT INDEX idx_ft_question_title(question_title) WITH PARSER `ngram`,

    PRIMARY KEY(question_post_id),
    FOREIGN KEY (question_writer) REFERENCES user (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (question_writer_nickname) REFERENCES user (nickname)
    ON DELETE SET NULL ON UPDATE CASCADE
) COMMENT '질문 게시글' ENGINE = InnoDB;

-- 답변 테이블
CREATE TABLE answer (
    answer_post_id INT NOT NULL AUTO_INCREMENT,
    answer_writer INT,
    answer_writer_nickname VARCHAR(20),
    question_post_id INT NOT NULL,
    answer_content TEXT NOT NULL,

    rate_up INT DEFAULT 0 NOT NULL,
    rate_down INT DEFAULT 0 NOT NULL,
    date DATETIME NOT NULL DEFAULT now(),
    recent_update_date DATETIME,

    PRIMARY KEY(answer_post_id),
    FOREIGN KEY (answer_writer) REFERENCES user (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (answer_writer_nickname) REFERENCES user (nickname)
    ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (question_post_id) REFERENCES question (question_post_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) COMMENT '답변 게시글' ENGINE = InnoDB;

-- 댓글 테이블
CREATE TABLE comment (
    comment_id INT NOT NULL AUTO_INCREMENT,
    lecture_post_id INT,
    channel_post_id INT,
    free_post_id INT,
    comment_writer INT,
    comment_writer_nickname VARCHAR(20),
    comment_content TEXT NOT NULL,
    date DATETIME NOT NULL DEFAULT now(),
    recent_update_date DATETIME,

    PRIMARY KEY(comment_id),
    FOREIGN KEY (comment_writer) REFERENCES user (id)
    ON DELETE SET NULL ON UPDATE CASCADE,

    FOREIGN KEY (comment_writer_nickname) REFERENCES user (nickname)
    ON DELETE SET NULL ON UPDATE CASCADE,

    FOREIGN KEY (lecture_post_id) REFERENCES lecture (lecture_post_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (channel_post_id) REFERENCES youtube_channel (channel_post_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (free_post_id) REFERENCES free_board (free_post_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) COMMENT '댓글' ENGINE = InnoDB;

-- 강의 태그 리스트
CREATE TABLE lecture_tag_list (
    lecture_post_id INT NOT NULL,
    tag_name VARCHAR(20) NOT NULL,

    PRIMARY KEY(lecture_post_id, tag_name),
    FOREIGN KEY(lecture_post_id) REFERENCES lecture (lecture_post_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(tag_name) REFERENCES tag (tag_name)
    ON DELETE CASCADE ON UPDATE CASCADE
) COMMENT '강의 게시글 태그 목록' ENGINE = InnoDB;

-- 채널 태그 리스트
CREATE TABLE youtube_channel_tag_list (
    channel_post_id INT NOT NULL,
    tag_name VARCHAR(20) NOT NULL,

    PRIMARY KEY(channel_post_id, tag_name),
    FOREIGN KEY(channel_post_id) REFERENCES youtube_channel (channel_post_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(tag_name) REFERENCES tag (tag_name)
    ON DELETE CASCADE ON UPDATE CASCADE
) COMMENT '유튜브 채널 게시글 태그 목록' ENGINE = InnoDB;

-- 질문 태그 리스트
CREATE TABLE question_tag_list (
    question_post_id INT NOT NULL,
    tag_name VARCHAR(20) NOT NULL,

    PRIMARY KEY(question_post_id, tag_name),
    FOREIGN KEY(question_post_id) REFERENCES question (question_post_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(tag_name) REFERENCES tag (tag_name)
    ON DELETE CASCADE ON UPDATE CASCADE
) COMMENT '질문 게시글 태그 목록' ENGINE = InnoDB;

-- 자유게시판 태그 리스트
CREATE TABLE free_board_tag_list (
    free_post_id INT NOT NULL,
    tag_name VARCHAR(20) NOT NULL,

    PRIMARY KEY(free_post_id, tag_name),
    FOREIGN KEY(free_post_id) REFERENCES free_board (free_post_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(tag_name) REFERENCES tag (tag_name)
    ON DELETE CASCADE ON UPDATE CASCADE
) COMMENT '자유 게시판 태그 목록' ENGINE = InnoDB;

-- 게시글에 추천한 사용자 목록
CREATE TABLE recommended_user (
	post_id INT NOT NULL,
    user_id INT NOT NULL,
    board VARCHAR(20) NOT NULL,
    rate TINYINT NOT NULL,

    FOREIGN KEY(user_id) REFERENCES user(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) COMMENT '게시글에 추천한 사용자 목록' ENGINE = InnoDB;