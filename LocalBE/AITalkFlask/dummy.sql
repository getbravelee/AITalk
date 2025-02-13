-- 치료사 샘플 데이터 추가
USE aitalk;

INSERT INTO speech_therapist (therapist_id, therapist_name,id, password)
VALUES (1, '박수민','ssafy123', 'dda69783f28fdf6f1c5a83e8400f2472e9300887d1dffffe12a07b92a3d0aa25');

-- 치료 아동 샘플 데이터 추가
INSERT INTO care_children (child_id,therapist_id, child_name, profile_image, disability_type, age)
VALUES
(10001,1, '민준', NULL, '언어 지연', 5),
(10002,1, '서연', NULL, '발음 문제', 6),
(10003,1, '지후', NULL, '언어 장애', 4),
(10004,1, '하은', NULL, '청각 장애', 7),
(10005,1, '준서', NULL, '언어 발달 지연', 5);

INSERT INTO card (card_id, name, image)
VALUES
    (1001, '과일', 'fruit'),
    (1002, '동물', 'animal'),
    (2001, '먹다', 'eat'),
    (2002, '잡다', 'catch'),
    (2003, '담다', 'contain'),
    (3001, '빵', 'bread'),
    (3002, '자동차', 'car'),
    (3003, '공', 'ball'),
    (3004, '꽃', 'flower')