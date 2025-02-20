-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: aitalk
-- ------------------------------------------------------
-- Server version	8.0.39

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
-- Table structure for table `card`
--

DROP TABLE IF EXISTS `card`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `card` (
  `card_id` int unsigned NOT NULL,
  `name` varchar(20) DEFAULT NULL,
  `image` varchar(20) DEFAULT NULL,
  `categories` json DEFAULT NULL,
  PRIMARY KEY (`card_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `card`
--

LOCK TABLES `card` WRITE;
/*!40000 ALTER TABLE `card` DISABLE KEYS */;
INSERT INTO `card` VALUES (1001,'과일','fruit','[\"apple\", \"banana\", \"orange\"]'),(1002,'동물','animal','[\"car\", \"bike\", \"bus\"]'),(2001,'먹다','eat',NULL),(2002,'잡다','catch',NULL),(2003,'담다','contain',NULL),(3001,'빵','bread',NULL),(3002,'자동차','car',NULL),(3003,'공','ball',NULL),(3004,'꽃','flower',NULL);
/*!40000 ALTER TABLE `card` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `care_children`
--

DROP TABLE IF EXISTS `care_children`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `care_children` (
  `child_id` int unsigned NOT NULL,
  `therapist_id` int unsigned DEFAULT NULL,
  `child_name` varchar(20) NOT NULL,
  `disability_type` varchar(20) DEFAULT NULL,
  `age` int DEFAULT NULL,
  PRIMARY KEY (`child_id`),
  KEY `therapist_id` (`therapist_id`),
  CONSTRAINT `care_children_ibfk_1` FOREIGN KEY (`therapist_id`) REFERENCES `speech_therapist` (`therapist_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `care_children`
--

LOCK TABLES `care_children` WRITE;
/*!40000 ALTER TABLE `care_children` DISABLE KEYS */;
INSERT INTO `care_children` VALUES (10001,1,'서연','언어 장애',5),(10002,1,'서연','지적 장애',2),(10003,1,'유준','지적 장애',3),(10004,1,'서연','발달 지연',4),(10005,1,'수아','발달 지연',4),(10006,1,'서윤','언어 장애',6),(10007,1,'준서','청각 장애',5),(10008,1,'예은','자폐 스펙트럼',3),(10009,1,'도윤','지적 장애',2),(10010,1,'하은','언어 장애',4),(10011,1,'민준','발달 지연',6),(10012,1,'수아','자폐 스펙트럼',5),(10013,1,'유준','언어 장애',3),(10014,1,'서윤','청각 장애',2),(10015,1,'준서','발달 지연',4),(10016,1,'민준','언어 장애',5),(10017,1,'서연','지적 장애',3),(10018,1,'예은','청각 장애',6),(10019,1,'도윤','발달 지연',2),(10020,1,'하은','자폐 스펙트럼',4),(10021,1,'박응애','언어 장애',5);
/*!40000 ALTER TABLE `care_children` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `speech_therapist`
--

DROP TABLE IF EXISTS `speech_therapist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `speech_therapist` (
  `therapist_id` int unsigned NOT NULL,
  `therapist_name` varchar(20) DEFAULT NULL,
  `id` varchar(20) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`therapist_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `speech_therapist`
--

LOCK TABLES `speech_therapist` WRITE;
/*!40000 ALTER TABLE `speech_therapist` DISABLE KEYS */;
INSERT INTO `speech_therapist` VALUES (1,'박수민','dongsil12','$2a$10$NeK2Jl/1q5txK51r9EJlOOwdufrhDu1h0E4SxA6.SJFawZMzdrV4W');
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
  CONSTRAINT `treatment_ibfk_1` FOREIGN KEY (`therapist_id`) REFERENCES `speech_therapist` (`therapist_id`),
  CONSTRAINT `treatment_ibfk_2` FOREIGN KEY (`child_id`) REFERENCES `care_children` (`child_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treatment`
--

LOCK TABLES `treatment` WRITE;
/*!40000 ALTER TABLE `treatment` DISABLE KEYS */;
INSERT INTO `treatment` VALUES (11,1,10001,'2025-02-20','18:56:20',NULL,'[]','[]',''),(12,1,10001,'2025-02-20','19:01:09',NULL,'[\"핸드백\"]','[]','');
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

-- Dump completed on 2025-02-20 20:26:59
