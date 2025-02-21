-- 기존 스키마 삭제 후 새로 생성
DROP SCHEMA IF EXISTS aitalk_web;
CREATE SCHEMA aitalk_web;

-- 웹용 DB 사용
USE aitalk_web;

-- 언어치료사 테이블 생성
CREATE TABLE speech_therapist (
    therapist_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id VARCHAR(20) UNIQUE,
    password VARCHAR(255),
    email VARCHAR(50),
    therapist_name VARCHAR(20),
    phone_number VARCHAR(20)
);

-- 치료센터 테이블 생성
CREATE TABLE care_center (
    center_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    center_name VARCHAR(20),
    center_number VARCHAR(20),
    center_address VARCHAR(50)
);

-- 치료아동 테이블 생성 (therapist_id, center_id에 CASCADE 적용)
CREATE TABLE care_children (
    child_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    therapist_id INT UNSIGNED,
    center_id INT UNSIGNED,
    child_name VARCHAR(20) NOT NULL,
    protector_number VARCHAR(20),
    disability_type VARCHAR(20),
    age INT,
    FOREIGN KEY (therapist_id) REFERENCES speech_therapist(therapist_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (center_id) REFERENCES care_center(center_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) AUTO_INCREMENT = 10001;

-- 치료 테이블 생성 (therapist_id, child_id에 CASCADE 적용)
CREATE TABLE treatment (
    treatment_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    therapist_id INT UNSIGNED NOT NULL,
    child_id INT UNSIGNED,
    treatment_date DATE,
    start_time TIME,
    end_time TIME,
    words JSON,
    sentence JSON,
    conversation VARCHAR(100),
    FOREIGN KEY (therapist_id) REFERENCES speech_therapist(therapist_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (child_id) REFERENCES care_children(child_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
