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

INSERT INTO card (card_id, name, image)
VALUES
    (1001, '과일', 'fruit'),
    (2001, '먹다', 'eat'),
    (3001, '빵', 'bread'),
    (4001, '빵을 먹다', 'eatBread');