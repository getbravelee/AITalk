-- 치료사 샘플 데이터 추가
USE aitalk;

INSERT INTO card (card_id, name, image, categories)
VALUES
    (1001, '과일', 'fruit', '["apple", "banana", "orange"]'),
    (1002, '동물', 'animal', '["car", "bike", "bus"]');

INSERT INTO card (card_id, name, image)
VALUES
    (2001, '먹다', 'eat'),
    (2002, '잡다', 'catch'),
    (2003, '담다', 'contain'),
    (3001, '빵', 'bread'),
    (3002, '자동차', 'car'),
    (3003, '공', 'ball'),
    (3004, '꽃', 'flower');