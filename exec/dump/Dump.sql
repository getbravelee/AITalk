-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 3.38.106.51    Database: aitalk_web
-- ------------------------------------------------------
-- Server version	8.0.41-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `care_center`
--

DROP TABLE IF EXISTS `care_center`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `care_center` (
  `center_id` int unsigned NOT NULL AUTO_INCREMENT,
  `center_name` varchar(20) DEFAULT NULL,
  `center_number` varchar(20) DEFAULT NULL,
  `center_address` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`center_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `care_center`
--

LOCK TABLES `care_center` WRITE;
/*!40000 ALTER TABLE `care_center` DISABLE KEYS */;
INSERT INTO `care_center` VALUES (1,'연세본언어치료센터','0512714051','부산 강서구 명지국제8로 30 4층'),(2,'두빛나래언어발달센터','050714131314','부산 강서구 명지국제2로28번길 3 동건프라자 4층 403호'),(3,'도란도란언어발달상담센터','0519005253','부산 강서구 명지국제2로28번길 26 퍼스트삼융 4층 401호');
/*!40000 ALTER TABLE `care_center` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `care_children`
--

DROP TABLE IF EXISTS `care_children`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `care_children` (
  `child_id` int unsigned NOT NULL AUTO_INCREMENT,
  `therapist_id` int unsigned DEFAULT NULL,
  `center_id` int unsigned DEFAULT NULL,
  `child_name` varchar(20) NOT NULL,
  `protector_number` varchar(20) DEFAULT NULL,
  `disability_type` varchar(20) DEFAULT NULL,
  `age` int DEFAULT NULL,
  PRIMARY KEY (`child_id`),
  KEY `therapist_id` (`therapist_id`),
  KEY `center_id` (`center_id`),
  CONSTRAINT `care_children_ibfk_1` FOREIGN KEY (`therapist_id`) REFERENCES `speech_therapist` (`therapist_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `care_children_ibfk_2` FOREIGN KEY (`center_id`) REFERENCES `care_center` (`center_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10022 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `care_children`
--

LOCK TABLES `care_children` WRITE;
/*!40000 ALTER TABLE `care_children` DISABLE KEYS */;
INSERT INTO `care_children` VALUES (10001,1,3,'서연','010-1234-0001','언어 장애',5),(10002,1,1,'서연','010-1234-0002','지적 장애',2),(10003,1,3,'유준','010-1234-0003','지적 장애',3),(10004,1,3,'서연','010-1234-0004','발달 지연',4),(10005,1,2,'수아','010-1234-0005','발달 지연',4),(10006,1,1,'서윤','010-1234-0006','언어 장애',6),(10007,1,2,'준서','010-1234-0007','청각 장애',5),(10008,1,3,'예은','010-1234-0008','자폐 스펙트럼',3),(10009,1,2,'도윤','010-1234-0009','지적 장애',2),(10010,1,1,'하은','010-1234-0010','언어 장애',4),(10011,1,3,'민준','010-1234-0011','발달 지연',6),(10012,1,2,'수아','010-1234-0012','자폐 스펙트럼',5),(10013,1,1,'유준','010-1234-0013','언어 장애',3),(10014,1,3,'서윤','010-1234-0014','청각 장애',2),(10015,1,1,'준서','010-1234-0015','발달 지연',4),(10016,1,2,'민준','010-1234-0016','언어 장애',5),(10017,1,2,'서연','010-1234-0017','지적 장애',3),(10018,1,1,'예은','010-1234-0018','청각 장애',6),(10019,1,3,'도윤','010-1234-0019','발달 지연',2),(10020,1,2,'하은','010-1234-0020','자폐 스펙트럼',4),(10021,1,3,'박응애','010-1234-0021','언어 장애',5);
/*!40000 ALTER TABLE `care_children` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `speech_therapist`
--

DROP TABLE IF EXISTS `speech_therapist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `speech_therapist` (
  `therapist_id` int unsigned NOT NULL AUTO_INCREMENT,
  `id` varchar(20) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `therapist_name` varchar(20) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`therapist_id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `speech_therapist`
--

LOCK TABLES `speech_therapist` WRITE;
/*!40000 ALTER TABLE `speech_therapist` DISABLE KEYS */;
INSERT INTO `speech_therapist` VALUES (1,'dongsil12','$2a$10$NeK2Jl/1q5txK51r9EJlOOwdufrhDu1h0E4SxA6.SJFawZMzdrV4W','psm5927@naver.com','박수민','010-1234-1234');
/*!40000 ALTER TABLE `speech_therapist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `treatment`
--

DROP TABLE IF EXISTS `treatment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `treatment` (
  `treatment_id` int unsigned NOT NULL AUTO_INCREMENT,
  `therapist_id` int unsigned NOT NULL,
  `child_id` int unsigned DEFAULT NULL,
  `treatment_date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `words` json DEFAULT NULL,
  `sentence` json DEFAULT NULL,
  `conversation` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`treatment_id`),
  KEY `therapist_id` (`therapist_id`),
  KEY `child_id` (`child_id`),
  CONSTRAINT `treatment_ibfk_1` FOREIGN KEY (`therapist_id`) REFERENCES `speech_therapist` (`therapist_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `treatment_ibfk_2` FOREIGN KEY (`child_id`) REFERENCES `care_children` (`child_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treatment`
--

LOCK TABLES `treatment` WRITE;
/*!40000 ALTER TABLE `treatment` DISABLE KEYS */;
INSERT INTO `treatment` VALUES (1,1,10001,'2025-01-22','12:27:00','13:49:00','[\"사과\"]','[\"강아지가 귀여워요.\"]','오늘 기분이 어때?'),(2,1,10002,'2025-01-17','12:29:00','13:12:00','[\"의자\"]','[\"나는 사과를 좋아해요.\"]','오늘 기분이 어때?'),(3,1,10005,'2025-02-22','11:54:00','12:27:00','[\"바나나\"]','[\"나는 사과를 좋아해요.\"]','어제 뭐 했어요?'),(4,1,10004,'2025-01-19','11:11:00','11:51:00','[\"사과\"]','[\"학교에 가고 싶어요.\"]','어제 뭐 했어요?'),(5,1,10001,'2025-01-28','11:27:00','12:03:00','[\"사과\"]','[\"바나나가 맛있어요.\"]','오늘 기분이 어때?'),(6,1,10003,'2025-02-07','10:45:00','12:15:00','[\"강아지\"]','[\"나는 사과를 좋아해요.\"]','친구랑 놀았어요?'),(7,1,10002,'2025-02-14','13:30:00','14:20:00','[\"책상\"]','[\"강아지가 귀여워요.\"]','어제 뭐 했어요?'),(8,1,10005,'2025-02-03','09:15:00','10:00:00','[\"의자\"]','[\"바나나가 맛있어요.\"]','오늘 기분이 어때?'),(9,1,10004,'2025-01-30','12:10:00','13:00:00','[\"바나나\"]','[\"나는 사과를 좋아해요.\"]','가장 좋아하는 과일은?'),(10,1,10001,'2025-02-25','11:05:00','12:00:00','[\"강아지\"]','[\"강아지가 귀여워요.\"]','어제 뭐 했어요?'),(11,1,10003,'2025-02-08','10:40:00','11:35:00','[\"사과\"]','[\"나는 사과를 좋아해요.\"]','친구랑 놀았어요?'),(12,1,10002,'2025-01-14','09:55:00','10:45:00','[\"학교\"]','[\"바나나가 맛있어요.\"]','오늘 기분이 어때?'),(13,1,10005,'2025-02-01','12:20:00','13:10:00','[\"의자\"]','[\"학교에 가고 싶어요.\"]','어제 뭐 했어요?'),(14,1,10004,'2025-02-18','11:15:00','12:00:00','[\"바나나\"]','[\"나는 사과를 좋아해요.\"]','가장 좋아하는 과일은?'),(15,1,10001,'2025-01-29','10:50:00','11:40:00','[\"강아지\"]','[\"강아지가 귀여워요.\"]','오늘 기분이 어때?'),(16,1,10003,'2025-02-04','09:20:00','10:00:00','[\"책상\"]','[\"나는 사과를 좋아해요.\"]','친구랑 놀았어요?'),(17,1,10002,'2025-01-12','13:05:00','14:00:00','[\"의자\"]','[\"학교에 가고 싶어요.\"]','어제 뭐 했어요?'),(18,1,10005,'2025-02-05','12:45:00','13:30:00','[\"사과\"]','[\"바나나가 맛있어요.\"]','오늘 기분이 어때?'),(19,1,10004,'2025-02-10','10:35:00','11:25:00','[\"강아지\"]','[\"나는 사과를 좋아해요.\"]','친구랑 놀았어요?'),(20,1,10001,'2025-01-20','09:30:00','10:20:00','[\"바나나\"]','[\"강아지가 귀여워요.\"]','어제 뭐 했어요?'),(21,1,10002,'2025-02-20','17:21:14','17:21:28','[]','[]',''),(22,1,10002,'2025-02-20','17:21:57','17:37:24','[]','[]',''),(23,1,10001,'2025-02-20','17:41:48','17:43:14','[\"사과\"]','[\"사과가 떨어진다\"]',''),(24,1,10001,'2025-02-20','19:30:08','19:32:18','[]','[]',''),(25,1,10001,'2025-02-20','19:35:20','19:37:57','[\"핸드백\"]','[]','');
/*!40000 ALTER TABLE `treatment` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-20 20:21:22
