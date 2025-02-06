drop schema aitalk_web;
create schema aitalk_web;

-- 웹용 db
USE aitalk_web;

-- 언어치료사 테이블 생성
-- therapist_id, face
CREATE TABLE speech_therapist (
                                  therapist_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                  id VARCHAR(20) UNIQUE,
                                  password VARCHAR(20),
                                  email VARCHAR(50),
                                  therapist_name VARCHAR(20),
                                  phone_number VARCHAR(20)
);

-- 치료센터 테이블 생성
CREATE TABLE care_center (
                             center_id INT UNSIGNED PRIMARY KEY,
                             center_name VARCHAR(20),
                             center_number VARCHAR(20),
                             center_address VARCHAR(50)
);

-- 치료아동 테이블 생성
CREATE TABLE care_children (
                               child_id INT UNSIGNED PRIMARY KEY,
                               therapist_id INT UNSIGNED,
                               center_id INT UNSIGNED,
                               child_name VARCHAR(20) NOT NULL,
                               profile_image BLOB,
                               disability_type VARCHAR(20),
                               age INT,
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
