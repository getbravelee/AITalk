-- create schema aitalk;

USE aitalk;

-- 언어치료사 테이블 생성
CREATE TABLE speech_therapist (
    therapist_id INT UNSIGNED NOT NULL PRIMARY KEY,
    id VARCHAR(20) NOT NULL,
    password VARCHAR(20) NOT NULL,
    email VARCHAR(50) NOT NULL,
    user_name VARCHAR(20) NOT NULL,
    phone_number VARCHAR(20) NOT NULL
);

-- 치료센터 테이블 생성
CREATE TABLE care_center (
    center_id INT UNSIGNED PRIMARY KEY,
    center_name VARCHAR(20),
    center_number VARCHAR(20),
    center_address varchar(50)
);

-- 치료아동 테이블 생성
CREATE TABLE care_children (
    child_id INT UNSIGNED PRIMARY KEY,
    therapist_id INT UNSIGNED,
    center_id INT UNSIGNED,
    child_name VARCHAR(20) NOT NULL,
    protector_number VARCHAR(20) NOT NULL,
    profile_image BLOB,
    disability_type VARCHAR(20),
    age INT,
    treatment_completed BOOLEAN,
    FOREIGN KEY (therapist_id) REFERENCES speech_therapist(therapist_id),
    FOREIGN KEY (center_id) REFERENCES care_center(center_id)
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
    nfc_id VARCHAR(100),
    name VARCHAR(20),
    category VARCHAR(10),
    image BLOB
);
