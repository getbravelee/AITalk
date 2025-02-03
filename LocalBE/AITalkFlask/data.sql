-- create schema aitalk;

USE aitalk;

-- 언어치료사 테이블 생성
-- therapist_id, face
-- 치료사 테이블 생성 (AUTO_INCREMENT 추가)
CREATE TABLE speech_therapist (
    therapist_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY
);

-- 치료 아동 테이블 생성 (AUTO_INCREMENT 추가)
CREATE TABLE care_children (
    child_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    therapist_id INT UNSIGNED,
    child_name VARCHAR(20) NOT NULL,
    profile_image BLOB,
    disability_type VARCHAR(20),
    age INT,
    FOREIGN KEY (therapist_id) REFERENCES speech_therapist(therapist_id)
);


-- 치료 테이블 생성
CREATE TABLE treatment (
    treatment_id INT UNSIGNED PRIMARY KEY,
    therapist_id INT UNSIGNED NOT NULL,
    child_id INT UNSIGNED,
    treatment_date DATE,
    start_time TIME,
    end_time TIME,
    words VARCHAR(100),
    sentence VARCHAR(100),
    conversation VARCHAR(100),
    FOREIGN KEY (therapist_id) REFERENCES speech_therapist(therapist_id),
    FOREIGN KEY (child_id) REFERENCES care_children(child_id)
);

-- 카드 테이블 생성
CREATE TABLE card (
    card_id INT UNSIGNED PRIMARY KEY,
    name VARCHAR(20),
    image BLOB
);

-- 치료사 샘플 데이터 추가
INSERT INTO speech_therapist ()
VALUES ();

-- 치료 아동 샘플 데이터 추가
INSERT INTO care_children (therapist_id, child_name, profile_image, disability_type, age)
VALUES
(1, '민준', NULL, '언어 지연', 5),
(1, '서연', NULL, '발음 문제', 6),
(1, '지후', NULL, '언어 장애', 4),
(1, '하은', NULL, '청각 장애', 7),
(1, '준서', NULL, '언어 발달 지연', 5);
