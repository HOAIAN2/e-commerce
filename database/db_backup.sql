-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: e-commerce
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) NOT NULL,
  `description` text,
  `icon` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `UQ_category` (`category_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Laptop',NULL,NULL),(2,'Phone',NULL,NULL),(3,'Tablet',NULL,NULL);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `comment` varchar(255) NOT NULL,
  `comment_date` date NOT NULL,
  PRIMARY KEY (`comment_id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_details` (
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` int DEFAULT NULL,
  `discount` double DEFAULT NULL,
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `atleast_quantity` CHECK ((`quantity` > 0)),
  CONSTRAINT `order_details_discount_limit` CHECK (((`discount` > 0) and (`discount` < 1)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_details` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_order_detail_insert` BEFORE INSERT ON `order_details` FOR EACH ROW BEGIN
    IF ((SELECT paid FROM orders WHERE order_id = NEW.order_id) = 1) THEN
		SIGNAL sqlstate '45001' set message_text = "No way ! This order has paid !";
	END IF;
    UPDATE products
    SET unit_in_order = unit_in_order + NEW.quantity
    WHERE NEW.product_id = products.product_id;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_order_detail_update` BEFORE UPDATE ON `order_details` FOR EACH ROW BEGIN
    IF ((SELECT paid FROM orders WHERE order_id = NEW.order_id) = 1) THEN
		SIGNAL sqlstate '45001' set message_text = "No way ! This order has paid !";
	END IF;
      IF (NEW.quantity <> OLD.quantity) THEN
            UPDATE products
            SET unit_in_order = unit_in_order + (NEW.quantity - OLD.quantity)
            WHERE NEW.product_id = products.product_id AND NEW.quantity <> OLD.quantity;
      END IF;
    END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_order_detail_delete` BEFORE DELETE ON `order_details` FOR EACH ROW BEGIN
    IF ((SELECT paid FROM orders WHERE order_id = OLD.order_id) = 1) THEN
		SIGNAL sqlstate '45001' set message_text = "No way ! This order has paid !";
	END IF;
    UPDATE products
    SET unit_in_order = unit_in_order - OLD.quantity
    WHERE OLD.product_id = products.product_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `order_date` datetime DEFAULT NULL,
  `voucher_id` varchar(60) DEFAULT NULL,
  `paid_method_id` int DEFAULT NULL,
  `paid` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`order_id`),
  KEY `user_id` (`user_id`),
  KEY `voucher_id` (`voucher_id`),
  KEY `paid_method_id` (`paid_method_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`voucher_id`),
  CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`paid_method_id`) REFERENCES `payment_methods` (`method_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_orders_update` BEFORE UPDATE ON `orders` FOR EACH ROW BEGIN
      IF (NEW.paid = 1) THEN
            UPDATE products JOIN order_details ON products.product_id = order_details.product_id
			JOIN orders ON order_details.order_id = NEW.order_id
			SET products.quantity = products.quantity - order_details.quantity,
            products.sold_quantity = products.sold_quantity + order_details.quantity,
			unit_in_order = unit_in_order - order_details.quantity,
			order_details.price = products.price,
			order_details.discount = products.discount
			WHERE products.product_id = order_details.product_id;
      END IF;
    END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `payment_methods`
--

DROP TABLE IF EXISTS `payment_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_methods` (
  `method_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`method_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_methods`
--

LOCK TABLES `payment_methods` WRITE;
/*!40000 ALTER TABLE `payment_methods` DISABLE KEYS */;
INSERT INTO `payment_methods` VALUES (1,'Cash'),(2,'Electronic bank transfers');
/*!40000 ALTER TABLE `payment_methods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `product_name` varchar(255) NOT NULL,
  `supplier_id` int NOT NULL,
  `category_id` int NOT NULL,
  `price` int unsigned NOT NULL,
  `quantity` int unsigned NOT NULL DEFAULT '0',
  `sold_quantity` int unsigned NOT NULL DEFAULT '0',
  `unit_in_order` int unsigned NOT NULL DEFAULT '0',
  `discount` double DEFAULT NULL,
  `images` varchar(500) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `UQ_product` (`product_name`),
  KEY `supplier_id` (`supplier_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`supplier_id`),
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
  CONSTRAINT `discount_limit` CHECK (((`discount` > 0) and (`discount` < 1))),
  CONSTRAINT `order_limit` CHECK ((`unit_in_order` <= `quantity`))
) ENGINE=InnoDB AUTO_INCREMENT=340 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Asus TUF Gaming FX506LHB-HN188W i5 10300H',1,1,15490000,1000,0,0,NULL,'637787904727727554_asus-tuf-gaming-fx506lh-den-2022-dd.jpg',NULL),(2,'MSI Gaming GF63 Thin 11SC-664VN i5-11400H',2,1,15990000,1000,0,0,NULL,'638121568991277911_msi-gaming-gf63-thin-11-den-dd.jpg',NULL),(3,'Gigabyte Gaming G5 GD i5 11400H (51VN123SO)',3,1,17990000,1000,0,0,NULL,'638006467071200088_gigabyte-gaming-g5-dd-bh.jpg',NULL),(4,'Acer Nitro Gaming 5 AN515-58-52SP i5 12500H (NH.QFHSV.001)',4,1,22990000,1000,0,0,NULL,'638140612136202106_acer-nitro-gaming-an515-58-dd.jpg',NULL),(5,'Lenovo Gaming Legion 5 15IAH7H i5-12500H (82RB0048VN)',5,1,28990000,1000,0,0,NULL,'638151643297943497_lenovo-gaming-legion-5-15iah7h-xam-dam-dd.jpg',NULL),(6,'MSI Gaming Alpha 15 B5EEK-203VN R5 5600H',2,1,17990000,1000,0,0,NULL,'637679951533296877_msi-gaming-alpha-15-den-rgb-1-zone-dd.jpg',NULL),(7,'Acer Nitro Gaming AN515-57-54MV i5 11400H (NH.QENSV.003)',4,1,19990000,1000,0,0,NULL,'638140613270669684_acer-nitro-gaming-an515-57-den-rtx3050-dd.jpg',NULL),(8,'MSI Gaming Thin GF63 12VE-454VN i5-12450H',2,1,22490000,1000,0,0,NULL,'638137864184249502_msi-gaming-gf63-thin-11uc-den-dd.jpg',NULL),(9,'Asus TUF Gaming FX506HC-HN144W i5 11400H',1,1,19990000,1000,0,0,NULL,'638140621884222540_asus-tuf-gaming-fx506h-den-dd.jpg',NULL),(10,'Lenovo Ideapad Gaming 3 15ARH7 R7 6800H (82SB007KVN)',5,1,18990000,1000,0,0,NULL,'637961542143431053_lenovo-ideapad-gaming-3-15arh7-r7-xam-dd.jpg',NULL),(11,'Acer Aspire A315-59-321N i3-1215U',4,1,9990000,1000,0,0,NULL,'638176054475714902_acer-aspire-a315-59-321n-i3-1215u-bac-dd.jpg',NULL),(12,'MSI Modern 15 B7M-098VN R7 7730U',2,1,14490000,1000,0,0,NULL,'638152553406546360_msi-modern-15-b7m-den-dd-icon.jpg',NULL),(13,'HP 15s-fq2711TU i3-1115G4/7C0R6PA',6,1,10290000,1000,0,0,NULL,'638109603688014236_hp-15s-fq-vang-dd.jpg',NULL),(14,'Lenovo IdeaPad 1 15AMN7 R5 7520U (82VG0022VN)',5,1,9990000,1000,0,0,NULL,'638053327684236749_lenovo-ideapad-1-15amn7-xam-dd.jpg',NULL),(15,'MSI Modern 15 B7M-099VN R5 7530U',2,1,12490000,1000,0,0,NULL,'638152553406546360_msi-modern-15-b7m-den-dd-icon.jpg',NULL),(16,'Laptop Asus Vivobook E1404FA-NK186W R5-7520U',1,1,13490000,1000,0,0,NULL,'638175171985162982_asus-vivobook-e1404fa-nk186w-r5-7520u-den-dd-moi.jpg',NULL),(17,'HP 15s-fq2712TU i3-1115G4/7C0X2PA',6,1,10290000,1000,0,0,NULL,'637931467519964702_hp-15s-fq-bac-win11-dd.jpg',NULL),(18,'Asus Vivobook M513UA-EJ704W R7 5700U',1,1,14490000,1000,0,0,NULL,'638109316755419553_asus-vivobook-m513ua-ej704w-r7-5700u-bac-dd.jpg',NULL),(19,'HP 14s-em0080AU/R3-7320U (80R30PA)',6,1,10490000,1000,0,0,NULL,'638168318097684459_hp-14s-em0080au-r3-7320u-bac-dd.jpg',NULL),(20,'MSI Modern 14 C11M-011VN i3-1115G4',2,1,10990000,1000,0,0,NULL,'638137838701172397_msi-modern-14-c11m-den-dd.jpg',NULL),(21,'Asus Vivobook  A1503ZA-L1139W i5 12500H',1,1,16790000,1000,0,0,NULL,'638175171020071967_asus-vivobook-a1503-bac-dd-moi.jpg',NULL),(22,'Dell Vostro V3510 i5 1135G7 (P112F002BBL)',7,1,16790000,1000,0,0,NULL,'637673115503991603_dell-vostro-v3510-den-dd.jpg',NULL),(23,'HP 14s-em0078AU R5-7520U (80R28PA)',6,1,12790000,1000,0,0,NULL,'638168318097684459_hp-14s-em0080au-r3-7320u-bac-dd.jpg',NULL),(24,'Asus Vivobook M1503QA-L1026W R5 5600H',1,1,15490000,1000,0,0,NULL,'637971384442849961_asus-vivobook-m1503-bac-dd.jpg',NULL),(25,'MSI Modern 15 A11MU-1022VN i5 1155G7',2,1,13490000,1000,0,0,NULL,'637663479322536079_msi-modern-15-xam-dd.jpg',NULL),(26,'Acer Aspire 3 A315-58-54M5 i5 1135G7 (NX.ADDSV.00M)',4,1,12490000,1000,0,0,NULL,'637910630152852471_acer-aspire-3-a315-58-bac-dd.jpg',NULL),(27,'MSI Gaming GF63 Thin 11UC-1228VN i7-11800H',2,1,19990000,1000,0,0,NULL,'638121561917481306_msi-gaming-gf63-thin-11uc-1228vn-i7-11800h-dd.jpg',NULL),(28,'Laptop Asus TUF Gaming FX506HF-HN017W i5-11400H',1,1,19990000,1000,0,0,NULL,'638175165816785780_asus-tuf-gaming-fx506hf-den-dd-moi.jpg',NULL),(29,'Gigabyte Gaming G5 GE i5 12500H (51VN263SH)',3,1,19990000,1000,0,0,NULL,'638180152235601309_gigabyte-gaming-g5-ge-i5-12500h-rtx3050-dd-bh.jpg',NULL),(30,'MSI Gaming GF63 Thin 11UC-1230VN i5-11400H',2,1,17990000,1000,0,0,NULL,'638137864184249502_msi-gaming-gf63-thin-11uc-den-dd.jpg',NULL),(31,'Lenovo Gaming IdeaPad 3 15IHU6 i5 11320H (82K101HGVN)',5,1,15990000,1000,0,0,NULL,'638120517993710953_lenovo-gaming-ideapad-3-15ihu6-den-dd.jpg',NULL),(32,'Asus Zenbook UM5401QA-KN209W R5 5600H',1,1,18490000,1000,0,0,NULL,'637817445615604035_asus-zenbook-um5401-den-dd.jpg',NULL),(33,'Lenovo IdeaPad 3 14IAU7 i5-1235U/(82RJ001DVN)',5,1,13490000,1000,0,0,NULL,'638007503320711896_lenovo-ideapad-3-14iau7-xanh-dd.jpg',NULL),(34,'MSI Modern 14 C5M-030VN R5 5625U',2,1,11600000,1000,0,0,NULL,'638121594284039797_msi-modern-14-c5m-den-dd.jpg',NULL),(35,'MSI Modern 15 B5M-023VN R5 5625U',2,1,12100000,1000,0,0,NULL,'638121579945412680_msi-modern-15-b5m-den-dd.jpg',NULL),(36,'Laptop Asus Vivobook 15 OLED A1505VA-L1113W i5-13500H',1,1,19490000,1000,0,0,NULL,'638175167717566831_asus-vivobook-a1505va-l1113w-i5-13500h-bac-dd-moi.jpg',NULL),(37,'Asus Vivobook X415E-EK1387W i3 1115G4',1,1,9790000,1000,0,0,NULL,'637502173944633590_asus-vivobook-x415-print-bac-dd.jpg',NULL),(38,'Asus Vivobook X1502ZA-BQ126W i5 1240P',1,1,14990000,1000,0,0,NULL,'637892458532536827_asus-vivobook-x1502-bac-dd.jpg',NULL),(39,'HP Pavilion 14-dv2075TU i5-1235U/7C0W2PA',6,1,17690000,1000,0,0,NULL,'638109598049506720_hp-pavilion-14-dv-bac-2023-dd.jpg',NULL),(40,'HP Pavilion 15-eg2083TU i5-1240P',6,1,17790000,1000,0,0,NULL,'637947006257497678_hp-pavilion-15-eg-bac-2022-win11-dd.jpg',NULL),(41,'Lenovo ThinkBook 14 G3 ACL R7 5700U (21A200R8VN)',5,1,13990000,1000,0,0,NULL,'638155274560650577_lenovo-thinkbook-14-g3-alc-xam-dd.jpg',NULL),(42,'Laptop Asus Vivobook X515EA-EJ322W i3-1115G4',1,1,10390000,1000,0,0,NULL,'637502180353045335_asus-vivobook-x515-print-bac-dd.jpg',NULL),(43,'Asus Vivobook M1403QA-LY022W R5 5600H',1,1,14490000,1000,0,0,NULL,'637987718881809877_asus-vivobook-m1403-non-oled-bac-dd.jpg',NULL),(44,'Laptop Asus Vivobook Flip TN3402YA-LZ026W R5-7530U',1,1,17090000,1000,0,0,NULL,'638175174130082036_asus-vivobook-flip-tn3402y-bac-dd-moi.jpg',NULL),(45,'CHUWI LarkBook Celeron N4120 Touch Win 10',8,1,4990000,1000,0,0,NULL,'637786241649703917_chuwi-larkbook-n4120-den-dd-1.jpg',NULL),(46,'Masstel E116 Celeron N4020/4GB/128GB/11.6\"HD/Win 10',9,1,3990000,1000,0,0,NULL,'638151600474103309_masstel-e116-celeron-n4020-xam-dd.jpg',NULL),(47,'Masstel E140 Celeron N4120 Win 10',9,1,5490000,1000,0,0,NULL,'638151600474103309_masstel-e140-celeron-n4120-xam-dd.jpg',NULL),(48,'Lenovo IdeaPad 5 15ABA7 R5 5625U/(82SG007KVN)',5,1,12990000,1000,0,0,NULL,'638007562131373483_lenovo-ideapad-5-15aba7-xam-dd.jpg',NULL),(49,'Acer Aspire 3 A315-56-38B1 i3 1005G1 (NX.HS5SV.00G)',4,1,7990000,1000,0,0,NULL,'637820769687510806_acer-aspire-3-a315-54-56-den-dd.jpg',NULL),(50,'Lenovo Ideapad 3 15ITL6 i5 1155G7/82H80388VN',5,1,11490000,1000,0,0,NULL,'638168337649091937_lenovo-ideapad-3-15itl6-i5-1155g7-xam-dd.jpg',NULL),(51,'Laptop HP 15s-fq5144TU i7-1255U',6,1,20390000,1000,0,0,NULL,'637931467519964702_hp-15s-fq-bac-win11-dd.jpg',NULL),(52,'Laptop HP 240 G9 i5-1235U',6,1,16190000,1000,0,0,NULL,'638134647806744549_hp-240-g9-bac-dd.jpg',NULL),(53,'Asus TUF Gaming FX706HC-HX579W i5 11400H',1,1,19490000,1000,0,0,NULL,'637979643265464120_asus-tuf-gaming-fx706hc-hx579w-i5-11400h-xam-dd.jpg',NULL),(54,'HP Pavilion 14-dv2073TU i5-1235U (7C0P2PA)',6,1,18990000,1000,0,0,NULL,'638168307038066944_hp-pavilion-14-dv2073tu-i5-1235u-vang-dd.jpg',NULL),(55,'CHUWI GemiBook Pro Celeron N5100 Win 10',8,1,5990000,1000,0,0,NULL,'637786241650172882_chuwi-gemibook-pro-den-dd-1.jpg',NULL),(56,'Acer Nitro Gaming AN515-45-R86D R7 5800H',4,1,22490000,1000,0,0,NULL,'637961786361557520_acer-nitro-gaming-5-an515-45-den-dd.jpg',NULL),(57,'Lenovo IdeaPad 3 14IAU7 i3-1215U/(82RJ001CVN)',5,1,10490000,1000,0,0,NULL,'638007467167247482_lenovo-ideapad-3-14iau7-xanh-dd.jpg',NULL),(58,'Lenovo Ideapad 3 15IAU7 i5 1235U (82RK001LVN)',5,1,13490000,1000,0,0,NULL,'638120780886373357_lenovo-ideapad-3-15iau7-xanhnhat-dd.jpg',NULL),(59,'Lenovo Ideapad Gaming 3 15ARH7 R5 6600H/82SB007JVN',5,1,16990000,1000,0,0,NULL,'637961729684969328_lenovo-ideapad-gaming-3-15arh7-trang-dd.jpg',NULL),(60,'Lenovo IdeaPad 3 14IAU7 i3 1215U (82RJ000HVN)',5,1,10490000,1000,0,0,NULL,'638119938224242963_lenovo-ideapad-3-14iau7-xam-dd.jpg',NULL),(61,'Laptop HP Pavilion 14-dv2076TU i5-1235U/7C0P4PA',6,1,16690000,1000,0,0,NULL,'638007643201035731_hp-pavilion-14-dv-vang-dd.jpg',NULL),(62,'Laptop HP Gaming Victus 16-e1107AX R5-6600H',6,1,20490000,1000,0,0,NULL,'638122294500233505_hp-gaming-victus-16-e1107ax-r5-6600h-den-dd.jpg',NULL),(63,'Acer Aspire Gaming A715-42G-R05G R5 5500U (NH.QAYSV.005)',4,1,14990000,1000,0,0,NULL,'637728596076020587_acer-aspire-gaming-a715-42g-r1sb-r5-5500u-den-dd.jpg',NULL),(64,'HP 15s-fq5145TU i7-1255U/76B24PA',6,1,17790000,1000,0,0,NULL,'637931467519964702_hp-15s-fq-bac-win11-dd.jpg',NULL),(65,'Laptop Acer Swift 3 SF314-43-R4X3 R5 5500U (NX.AB1SV.004)',4,1,15990000,1000,0,0,NULL,'637728602789371579_acer-swift-3-sf314-43-r4x3-r5-5500u-bac-dd.jpg',NULL),(66,'Acer Swift 3 SF314-511-55QE i5 1135G7 (NX.ABNSV.003)',4,1,17690000,1000,0,0,NULL,'637784626016113737_acer-swift-3-sf314-511-bac-dd.jpg',NULL),(67,'Laptop HP 15s-fq5163TU i5-1235U/7C135PA',6,1,15490000,1000,0,0,NULL,'637931467519964702_hp-15s-fq-bac-win11-dd.jpg',NULL),(68,'Dell Inspiron 15 N3520 i5-1235U (N5I5122W1)',7,1,16490000,1000,0,0,NULL,'638010984081026772_dell-inspiron-15-n3520-den-dd.jpg',NULL),(69,'Acer Nitro Gaming AN515-57-5669 i5 11400H (NH.QEHSV.001)',4,1,17990000,1000,0,0,NULL,'637743874726278183_acer-nitro-gaming-an515-57-56xx-den-dd.jpg',NULL),(70,'HP 15s-fq5080TU i5-1235U/6K7A0PA',6,1,14290000,1000,0,0,NULL,'637931467519964702_hp-15s-fq-bac-win11-dd.jpg',NULL),(71,'Acer Aspire 3 A315-58-53S6 i5 1135G7 (NX.AM0SV.005)',4,1,11490000,1000,0,0,NULL,'637892430484570044_acer-aspire-3-a315-58-vang-dd.jpg',NULL),(72,'Laptop HP Pavilion 15-eg2086TU i3-1215U',6,1,13790000,1000,0,0,NULL,'638060316580240297_hp-pavilion-15-eg-vang-dd.jpg',NULL),(73,'HP Pavilion 15-eg2058TU i5-1240P/6K788PA',6,1,15990000,1000,0,0,NULL,'637946848298917816_hp-pavilion-15-eg2059tu-i5-1240p-vang-dd.jpg',NULL),(74,'Lenovo Gaming Legion 5 15ARH7 R5 6600H/82RE002VVN',5,1,24990000,1000,0,0,NULL,'638018700298075854_lenovo-gaming-legion-5-15arh7-xam-dam-dd.jpg',NULL),(75,'Laptop HP Pavilion 15-eg2081TU i5-1240P (7C0Q4PA)',6,1,18990000,1000,0,0,NULL,'638175168768402012_hp-pavilion-15-eg-vang-dd-moi.jpg',NULL),(76,'Dell Inspiron 16 N5620 i5 1240P/N6I5003W1',7,1,24990000,1000,0,0,NULL,'638175173111283984_dell-inspiron-16-n5620-bac-dd-moi.jpg',NULL),(77,'Lenovo Yoga 7 14ACN6 R5 5600U (82N7002MVN)',5,1,17990000,1000,0,0,NULL,'638006447895229319_lenovo-yoga-7-14acn6-xam-dd-bh.jpg',NULL),(78,'Laptop Asus TUF Gaming FX506HC-HN949W i5-11400H',1,1,21490000,1000,0,0,NULL,'638147328206711909_asus-tuf-gaming-fx506h-den-dd.jpg',NULL),(79,'HP Pavilion 14-dv2035TU i5 1235U/6K771PA',6,1,15990000,1000,0,0,NULL,'637947167304246349_hp-pavilion-14-dv-win11-vang-dd.jpg',NULL),(80,'MSI GF63 Thin 11UC 444VN i5 11400H',2,1,17990000,1000,0,0,NULL,'637788084553132269_msi-gf63-thin-den-dd.jpg',NULL),(81,'Lenovo Gaming Legion 5 15ARH7 R7 6800H/82RE0035VN',5,1,26990000,1000,0,0,NULL,'638018700298075854_lenovo-gaming-legion-5-15arh7-xam-dam-dd.jpg',NULL),(82,'MSI Gaming Katana GF66 12UCK-815VN i5 12450H',2,1,20490000,1000,0,0,NULL,'638046281859179576_msi-gaming-katana-gf66-12u-den-dd-bh.jpg',NULL),(83,'Laptop Asus Gaming TUF FA506ICB-HN355W R5 4600H/8GB/512GB/15.6FHD/RTX 3050 4GB/Win11',1,1,18990000,1000,0,0,NULL,'638025724080461588_asus-tuf-gaming-fa506-2022-den-dd.jpg',NULL),(84,'Laptop HP Pavilion 14-dv2036TU i5 1235U/8GB/256GB/14\"FHD/Win 11',6,1,15990000,1000,0,0,NULL,'637514266078486477_hp-pavilion-14-dv-bac-dd.jpg',NULL),(85,'Dell Inspiron 15 N3520 i3-1215U U082W11BLU',7,1,12290000,1000,0,0,NULL,'638010984081026772_dell-inspiron-15-n3520-den-dd.jpg',NULL),(86,'HP 15s-fq5161TU i5-1235U/7C0S2PA',6,1,16690000,1000,0,0,NULL,'638060321400587990_hp-15s-fq5161tu-xanh-dd.jpg',NULL),(87,'Asus Vivobook A515EA-BQ3013W i3 1115G4',1,1,12490000,1000,0,0,NULL,'637647989395373500_asus-vivobook-a515-bac-dd.jpg',NULL),(88,'HP Pavilion 15-eg2087TU i3-1215U/7C0Q9PA',6,1,13790000,1000,0,0,NULL,'637947006257497678_hp-pavilion-15-eg-bac-2022-win11-dd.jpg',NULL),(89,'Asus Gaming Zephyrus G513IE-HN246W R7 4800H',1,1,20990000,1000,0,0,NULL,'638001227463678942_asus-gaming-zephyrus-g513-xam-led-4zone-dd.jpg',NULL),(90,'HP Pavilion 15-eg2037TX i5 1235U/6K783PA',6,1,17590000,1000,0,0,NULL,'637947159455512547_hp-pavilion-15-eg2059tu-i5-1240p-vang-dd.jpg',NULL),(91,'HP Pavilion x360 14-ek0058TU i3 1215U/6L295PA',6,1,14890000,1000,0,0,NULL,'638122396479348427_hp-pavilion-x360-14-ek-vang-dd.jpg',NULL),(92,'HP 15s-fq5081TU i5 1235U (6K7A1PA)',6,1,13890000,1000,0,0,NULL,'637922064197943376_hp-15s-fq5104tu-bac-dd.jpg',NULL),(93,'Laptop Asus Vivobook A1405VA-KM059W i5-13500H',1,1,17490000,1000,0,0,NULL,'638146645988349931_asus-vivobook-a1405-den-dd.jpg',NULL),(94,'Lenovo Yoga 7-14ACN6 R7 5800U (82N7002LVN)',5,1,18990000,1000,0,0,NULL,'637861589103455280_lenovo-yoga-7-14acn6-r7-5800u-xam-dd-1.jpg',NULL),(95,'Asus TUF Gaming FX517ZE-HN045W i5 12450H',1,1,22290000,1000,0,0,NULL,'638140638161724111_asus-tuf-gaming-fx517-den-dd-rtx-3050-dd.jpg',NULL),(96,'Acer Aspire 5 A514-54-5127 i5 1135G7 (NX.A28SV.007)',4,1,14190000,1000,0,0,NULL,'637498460861773718_acer-aspire-a514-54-bac-dd.jpg',NULL),(97,'MSI Modern 14 C13M-608VN i5-1335U',2,1,17990000,1000,0,0,NULL,'638139818195276909_msi-modern-14-c11m-den-dd.jpg',NULL),(98,'MacBook Pro 14 2023 M2 Pro 12CPU 19GPU 16GB/1TB',10,1,60490000,1000,0,0,NULL,'638096327862678383_macbook-pro-14-2023-m2-pro-12cpu-19gpu-xam-dd.jpg',NULL),(99,'MacBook Pro 16 2023 M2 Pro 12CPU 19GPU 16GB/512GB',10,1,57990000,1000,0,0,NULL,'638096353283250840_macbook-pro-16-2023-m2-pro-bac-dd.jpg',NULL),(100,'MacBook Pro 16\" 2021 M1 Pro 1TB',10,1,48990000,1000,0,0,NULL,'637703174145702717_macbook-pro-16-2021-bac-dd.jpg',NULL),(101,'MacBook Pro 14 2023 M2 Pro 10CPU 16GPU 16GB/512GB',10,1,47990000,1000,0,0,NULL,'638096308244034700_macbook-pro-14-2023-m2-pro-10cpu-16gpu-bac-dd.jpg',NULL),(102,'LG Gram 16Z90R-E.AH75A5 i7-1360P',11,1,46990000,1000,0,0,NULL,'638219214162493520_lg-gram-16z90r-eah75a5-i7-1360p-den-dd.jpg',NULL),(103,'MacBook Pro 14\" 2021 M1 Pro 1TB',10,1,44990000,1000,0,0,NULL,'637703173012881570_macbook-pro-14-2021-bac-dd.jpg',NULL),(104,'LG Gram 16Z90R-G.AH76A5  i7-1360P',11,1,43990000,1000,0,0,NULL,'638219264346639543_lg-gram-16z90r-gah76a5-i7-1360p-dd.jpg',NULL),(105,'Acer Predator Helios Neo Gaming PHN16-71-74BA i7-13700HX/NH.QLUSV.004',4,1,42990000,1000,0,0,NULL,'638216651229999641_acer-predator-helios-neo-gaming-phn16-71-dd.jpg',NULL),(106,'Dell Gaming G15 5530 i7-1355U/i7H165W11GR4060',7,1,40990000,1000,0,0,NULL,'638218403023233196_dell-gaming-g15-5530-xam-dd.jpg',NULL),(107,'Acer Predator Helios Neo Gaming PHN16-71-7460 i7 13700HX/NH.QLTSV.004',4,1,38990000,1000,0,0,NULL,'638216651229999641_acer-predator-helios-neo-gaming-phn16-71-dd.jpg',NULL),(108,'MSI Gaming Creator M16 B13VE-830VN i7-13700H',2,1,37990000,1000,0,0,NULL,'638218447788531377_msi-creator-m16-b13ve-830vn-i7-13700h-den-dd.jpg',NULL),(109,'LG Gram Style 14Z90RS-G.AH54A5 i5-1340P',11,1,36490000,1000,0,0,NULL,'638219256197157804_lg-gram-style-14z90rs-gah54a5-i5-1340p-trang-dd.jpg',NULL),(110,'Acer Predator Helios Neo Gaming PHN16-71-54CD i5 13500HX/NH.QLTSV.001',4,1,35990000,1000,0,0,NULL,'638216651229999641_acer-predator-helios-neo-gaming-phn16-71-dd.jpg',NULL),(111,'MacBook Pro M2 13 2022 8CPU 10GPU 16GB 256GB',10,1,35990000,1000,0,0,NULL,'637901935364438149_macbook-pro-m2-2022-xam-dd.jpg',NULL),(112,'MSI Gaming Katana 15 B13VFK-676VN i7-13620H',2,1,35890000,1000,0,0,NULL,'638139851534770634_msi-gaming-katana-15-b13v-den-dd.jpg',NULL),(113,'MacBook Air M2 13 2022 8CPU 8GPU 16GB 256GB',10,1,34490000,1000,0,0,NULL,'637901915720184032_macbook-air-m2-2022-den-dd.jpg',NULL),(114,'Acer Gaming Predator Helios PH315-54-99S6 i9 11900H (NH.QC2SV.006)',4,1,32990000,1000,0,0,NULL,'638140608026452828_acer-predator-helios-gaming-ph315-54-den-rtx-3060-dd.jpg',NULL),(115,'Asus TUF Gaming FX507ZM-HN123W i7 12700H',1,1,31990000,1000,0,0,NULL,'637941861708642258_asus-tuf-gaming-fx507-xam-dd-rtx-3060.jpg',NULL),(116,'MSI Gaming Katana 15 B13VEK-252VN i7-13620H',2,1,31990000,1000,0,0,NULL,'638131993065748874_msi-gaming-katana-15-b13vek-den-dd-moi.jpg',NULL),(117,'Asus Vivobook Pro 14X OLED K3405VC-KM070W i9-13900H',1,1,31990000,1000,0,0,NULL,'638198447927019221_asus-vivobook-pro-k3405-bac-dd.jpg',NULL),(118,'MacBook Pro 13\" 2020 Touch Bar M1 512GB',10,1,29999000,1000,0,0,NULL,'637408530311831907_mbp-2020-m1-gray-dd-1.png',NULL),(119,'Lenovo ThinkPad P15s G2 T i5 1135G7/20W600D1VN',5,1,29990000,1000,0,0,NULL,'637961812298124660_lenovo-thinkpad-p15s-g2-dd.jpg',NULL),(120,'HP Gaming OMEN 16-b0178TX i5 11400H (5Z9Q9PA)',6,1,29990000,1000,0,0,NULL,'638140601029912158_hp-gaming-omen-16-rtx-3050ti-dd.jpg',NULL),(121,'MacBook Pro M2 2022 13 inch 8CPU 10GPU 8GB 256GB',10,1,29890000,1000,0,0,NULL,'637901935364438149_macbook-pro-m2-2022-xam-dd.jpg',NULL),(122,'MSI Gaming Cyborg 15 A12VF-267VN i7 12650H',2,1,29490000,1000,0,0,NULL,'638176970683395111_msi-gaming-cyborg-15-a12v-den-dd.jpg',NULL),(123,'Dell Inspiron 16 N5620 i7 1255U/(N6I7004W1)',7,1,28990000,1000,0,0,NULL,'637941164968673889_dell-inspiron-16-n5620-bac-dd.jpg',NULL),(124,'Lenovo ThinkPad T14s Gen 2 i7 1165G7 (20WM01T0VN)',5,1,28190000,1000,0,0,NULL,'638119836706226424_lenovo-thinkpad-t14s-gen-2-den-dd.jpg',NULL),(125,'Laptop Asus Zenbook Flip UP3404VA-KN038W i5-1340P',1,1,27990000,1000,0,0,NULL,'638149046363536315_asus-zenbook-flip-up3404-xanh-dd.jpg',NULL),(126,'MacBook Air M2 13 2022 8CPU 8GPU 8GB 256GB',10,1,27690000,1000,0,0,NULL,'637901915720184032_macbook-air-m2-2022-den-dd.jpg',NULL),(127,'MacBook Air 13\" 2020 M1 16GB/256GB',10,1,27499000,1000,0,0,NULL,'637407970062806725_mba-2020-gold-dd.png',NULL),(128,'MSI Gaming Cyborg 15 A12VE-240VN i7 12650H',2,1,26990000,1000,0,0,NULL,'638142979510381825_msi-gaming-cyborg-15-a12-den-dd.jpg',NULL),(129,'Gigabyte Gaming G5 KF-E3VN313SH i5-12500H',3,1,26190000,1000,0,0,NULL,'638188828261523251_gigabyte-gaming-g5-kf-e3vn313sh-i5-12500h-den-dd.jpg',NULL),(130,'Laptop Asus Zenbook UX3402VA-KM203W i5-1340P',1,1,25990000,1000,0,0,NULL,'638152793095056758_asus-zenbook-ux3402-bac-dd.jpg',NULL),(131,'Acer Swift X SFX16-51G-516Q i5 11320H (NX.AYKSV.002)',4,1,25990000,1000,0,0,NULL,'637784605210241029_acer-swift-x-sfx16-51g-xam-dd.jpg',NULL),(132,'Lenovo ThinkPad T14s Gen 2 i5-1135G7 (20WM01T1VN)',5,1,25490000,1000,0,0,NULL,'638175178328072884_lenovo-thinkpad-t14s-gen-2-den-dd-moi.jpg',NULL),(133,'Asus Vivobook Pro M3500QC-L1516W R9-5900HX',1,1,25490000,1000,0,0,NULL,'637812968481249634_asus-vivobook-pro-m3500qc-bac-dd.jpg',NULL),(134,'Dell Vostro V5620 i5-1240P/VWXVW',7,1,24990000,1000,0,0,NULL,'637931472299277646_dell-vostro-v5620-xam-dd.jpg',NULL),(135,'Asus Vivobook 15X OLED S3504VA-L1227WS i7 1360P',1,1,23990000,1000,0,0,NULL,'638215736568056314_asus-vivobook-s3504va-l1227ws-i7-1360p-vantay-bac-dd.jpg',NULL),(136,'Laptop Gigabyte Gaming G5 MF-F2VN313SH i5 12450H',3,1,23290000,1000,0,0,NULL,'638188828261523251_gigabyte-gaming-g5-kf-e3vn313sh-i5-12500h-den-dd.jpg',NULL),(137,'Asus Vivobook Pro M6500QC-MA002W R5 5600H',1,1,22990000,1000,0,0,NULL,'637962426856958423_asus-vivobook-pro-m6500-bac-dd.jpg',NULL),(138,'Laptop HP Envy x360 13-bf0096TU i5-1230U',6,1,22690000,1000,0,0,NULL,'638122275727221409_hp-envy-x360-13-bf-xanh-dd.jpg',NULL),(139,'HP Pavilion 15-eg2034TX i7 1255U/6K780PA',6,1,22090000,1000,0,0,NULL,'637947159455512547_hp-pavilion-15-eg2059tu-i5-1240p-vang-dd.jpg',NULL),(140,'Acer Nitro Gaming AN515-57-71VV i7 11800H (NH.QENSV.005)',4,1,21890000,1000,0,0,NULL,'638140613270669684_acer-nitro-gaming-an515-57-den-rtx3050-dd.jpg',NULL),(141,'Laptop HP Pavilion 15-eg2089TU i7-1260P',6,1,21490000,1000,0,0,NULL,'638060316580240297_hp-pavilion-15-eg-vang-dd.jpg',NULL),(142,'Asus Zenbook UX3402ZA-KM218W i5 1240P',1,1,21090000,1000,0,0,NULL,'637919255450978130_asus-zenbook-ux3402-xanh-dd.jpg',NULL),(143,'Lenovo Ideapad 5 Pro - 16ARH7 R5 6600HS/82SN003LVN',5,1,20990000,1000,0,0,NULL,'637961571407821990_lenovo-ideapad-5-pro-16arh7-xam-dd.jpg',NULL),(144,'Lenovo Ideapad 5 Pro 16ARH7 R5 6600HS/(82SN003MVN)',5,1,20990000,1000,0,0,NULL,'637961571407821990_lenovo-ideapad-5-pro-16arh7-xam-dd.jpg',NULL),(145,'MSI Modern 15 B13M-297VN i7-1355U',2,1,20990000,1000,0,0,NULL,'638139833422255293_msi-modern-15-b13m-den-dd-icon.jpg',NULL),(146,'Asus TUF Gaming FX517ZC-HN077W i5 12450H',1,1,20790000,1000,0,0,NULL,'638140638161724111_asus-tuf-gaming-fx517-den-dd-rtx-3050-dd.jpg',NULL),(147,'HP Pavilion 15-eg2055TU i7 1260P/6K785PA',6,1,19990000,1000,0,0,NULL,'637947159455512547_hp-pavilion-15-eg2059tu-i5-1240p-vang-dd.jpg',NULL),(148,'Asus Gaming ROG G513IC-HN729W R7 4800H',1,1,19990000,1000,0,0,NULL,'637655728046080925_asus-rog-gaming-g513-rgb4-xam-dd.jpg',NULL),(149,'Lenovo ThinkPad E14 Gen 3 R7 5700U (20Y700BJVN)',5,1,19490000,1000,0,0,NULL,'637823886181454977_lenovo-thinkpad-e14-gen-3-r7-5700u-win-10-Đen-5.jpg',NULL),(150,'Lenovo ThinkPad E14 G4 R7 5825U (21EB0063VN)',5,1,19190000,1000,0,0,NULL,'638011026754717687_lenovo-thinkpad-e14-gen-4-den-dd.jpg',NULL),(151,'HP ZBook Firefly 14 G8 i5 1135G7 (1A2F1AV)',6,1,18990000,1000,0,0,NULL,'637663501702829712_hp-zbook-firefly-14-g8-xam-dd.jpg',NULL),(152,'Laptop Lenovo Yoga Slim 7 Pro 14IHU5 O i5 11320H',5,1,18990000,1000,0,0,NULL,'638219196660165864_lenovo-yoga-slim-7-pro-14ihu5-o-bac-dd.jpg',NULL),(153,'Lenovo ThinkBook 15 G2 ITL i5 1135G7 (20VE00UTVN)',5,1,18690000,1000,0,0,NULL,'637465601998291992_lenovo-thinkbook-15-g2-xam-dd.png',NULL),(154,'HP Pavilion 15-eg2036TX i5 1235U/6K782PA',6,1,18590000,1000,0,0,NULL,'637947006257497678_hp-pavilion-15-eg-bac-2022-win11-dd.jpg',NULL),(155,'MSI Gaming GF63 Thin 11UD-473VN i5 11400H',2,1,18490000,1000,0,0,NULL,'637639339928194488_msi-gaming-gf63-den-dd.jpg',NULL),(156,'Asus Vivobook Pro M3401QA-KM025W R7 5800H',1,1,18490000,1000,0,0,NULL,'638140651212606754_asus-vivobook-pro-m3401qa-bac-dd.jpg',NULL),(157,'MacBook Air 13\" 2020 M1 256GB',10,1,18390000,1000,0,0,NULL,'637407970062806725_mba-2020-gold-dd.png',NULL),(158,'Laptop HP 15s-fq5146TU i7-1255U',6,1,18390000,1000,0,0,NULL,'638060321400587990_hp-15s-fq5161tu-xanh-dd.jpg',NULL),(159,'Asus Vivobook 15X OLED M3504YA-L1144W R5 7530U',1,1,17990000,1000,0,0,NULL,'638215730268703915_asus-vivobook-m3504ya-l1144w-r5-7530u-den-dd.jpg',NULL),(160,'MSI Modern 15 B13M-438VN i5 1335U',2,1,17490000,1000,0,0,NULL,'638139833422255293_msi-modern-15-b13m-den-dd-icon.jpg',NULL),(161,'Asus Expertbook B5302CEA-L50916W i5 1135G7',1,1,17490000,1000,0,0,NULL,'638023827472650997_asus-expertbook-b5302-den-dd.jpg',NULL),(162,'Asus Zenbook UX425EA-KI839W i5 1135G7',1,1,17490000,1000,0,0,NULL,'637387847968025876_637335980720078468_asus-zenbook-ux425ja-xam-dd.png',NULL),(163,'Lenovo ThinkPad E14 Gen 4 R5 5625U (21EB005LVN)',5,1,16990000,1000,0,0,NULL,'638053168623010216_lenovo-thinkpad-e14-gen-4-amd-den-dd.jpg',NULL),(164,'MSI Modern 14 C13M-458VN i5-1335U',2,1,16990000,1000,0,0,NULL,'638139819515601150_msi-modern-14-c11m-den-dd-icon.jpg',NULL),(165,'LG Gram 14Z90Q-G.AJ32A5 i3 1220P',11,1,16590000,1000,0,0,NULL,'637987492065481643_lg-gram-14-den-dd.jpg',NULL),(166,'Asus Vivobook Pro M3401QA-KM006W R5 5600H',1,1,16490000,1000,0,0,NULL,'638140651212606754_asus-vivobook-pro-m3401qa-bac-dd.jpg',NULL),(167,'Asus Vivobook X1605VA-MB105W i5-1335U',1,1,16190000,1000,0,0,NULL,'638176047324773672_asus-vivobook-x1605va-mb105w-i5-1335u-bac-dd.jpg',NULL),(168,'Acer Aspire Gaming A715-42G-R1SB R5 5500U (NH.QAYSV.005)',4,1,15990000,1000,0,0,NULL,'637728596076020587_acer-aspire-gaming-a715-42g-r1sb-r5-5500u-den-dd.jpg',NULL),(169,'Asus Expertbook B1400CEAE-EB3182W i5 1135G7',1,1,15990000,1000,0,0,NULL,'637998758626508804_asus-expertbook-b1400-dd.jpg',NULL),(170,'Asus Expertbook B1500CEAE-BQ2234W i5 1135G7',1,1,15990000,1000,0,0,NULL,'637998828400306631_asus-expertbook-b1500-den-dd.jpg',NULL),(171,'MSI Gaming GF63 Thin 11SC-1090VN i5 11400H',2,1,15990000,1000,0,0,NULL,'638007352801976726_msi-gaming-gf63-thin-11sc-1090vn-den-dd.jpg',NULL),(172,'Lenovo IdeaPad Flex 5 14ALC05 R5 5500U/82HU00EJVN',5,1,15990000,1000,0,0,NULL,'638000683522652094_lenovo-ideapad-flex-5-14alc05-xam-dd.jpg',NULL),(173,'HP Pavilion X360 14-ek0059TU i3 1215U/6K7E1PA',6,1,15090000,1000,0,0,NULL,'637981711607688240_hp-pavilion-x360-14-xanh-den-dd.jpg',NULL),(174,'Microsoft Surface Laptop Go i5 1035G1',12,1,14890000,1000,0,0,NULL,'637694135370655519_microsoft-surface-go-bac-dd.jpg',NULL),(175,'Acer Aspire 7 Gaming A715-76-57CY i5-12450H/NH.QGESV.004',4,1,14490000,1000,0,0,NULL,'638216639882650079_acer-aspire-7-gaming-a715-76-den-dd.jpg',NULL),(176,'HP 14s-em0086AU R5 7520U (835T9PA)',6,1,13690000,1000,0,0,NULL,'638168318097684459_hp-14s-em0080au-r3-7320u-bac-dd.jpg',NULL),(177,'Asus Vivobook A415EA-EK2429W i3 1115G4',1,1,12490000,1000,0,0,NULL,'637476249023155191_asus-vivobook-a415-bac-800x800-dd.jpg',NULL),(178,'HP 14s-fq1065AU R5-5500U/4K0Z5PA',6,1,12490000,1000,0,0,NULL,'638060334776729754_hp-14s-dq-bac-dd.jpg',NULL),(179,'Asus Vivobook X415EA-EB640W i5-1135G7',1,1,11990000,1000,0,0,NULL,'637477837206861780_asus-vivobook-x415-bac-dd.jpg',NULL),(180,'Asus Vivobook 16 X1605ZA-MB193W i3-1215U',1,1,11890000,1000,0,0,NULL,'638176047324773672_asus-vivobook-x1605va-mb105w-i5-1335u-bac-dd.jpg',NULL),(181,'HP 245 G9 R5 5625U (6L1N8PA)',6,1,11490000,1000,0,0,NULL,'638134647806744549_hp-240-g9-bac-dd.jpg',NULL),(182,'HP Pavilion 14-dv2050TU i3 1215U/6K7G7PA',6,1,10990000,1000,0,0,NULL,'638007643201035731_hp-pavilion-14-dv-vang-dd.jpg',NULL),(183,'Acer Aspire 3 A315-57G-573F i5 1035G1 (NX.HZRSV.00B)',4,1,10990000,1000,0,0,NULL,'637443973975955165_acer-aspire-3-a315-57g-den-dd.png',NULL),(184,'Acer Aspire A315-58-35AG i3 1115G4 (NX.ADDSV.00B)',4,1,9490000,1000,0,0,NULL,'637822539982260044_acer-aspire-3-a315-58-bac-dd.jpg',NULL),(185,'Asus Vivobook D515DA-EJ1364W R3 3250U',1,1,8990000,1000,0,0,NULL,'637503832634005581_asus-vivobook-x515-print-bac-dd.jpg',NULL),(186,'Laptop MSI Gaming Stealth 16Studio A13VG-057VN i9-13900H',2,1,77490000,1000,0,0,NULL,'638218488913688335_msi-gaming-stealth-16studio-a13vg-xanh-dd.jpg',NULL),(187,'MSI Gaming Raider GE68HX 13VF-050VN i7-13700HX',2,1,59990000,1000,0,0,NULL,'638218474406908015_msi-gaming-raider-ge68hx-den-dd.jpg',NULL),(188,'ASUS Gaming ROG Zephyrus GU603VU-N3898W i7-13620H',1,1,44990000,1000,0,0,NULL,'638218444149263882_asus-gaming-rog-zephyrus-gu603-xam-dd.jpg',NULL),(189,'ASUS Gaming ROG Zephyrus GA402NJ-L4056W R7-7735HS',1,1,42990000,1000,0,0,NULL,'638218423472924144_asus-gaming-rog-zephyrus-ga402-xam-dd.jpg',NULL),(190,'MacBook Air M2 2023 15 inch 8CPU 10GPU 16GB 256GB',10,1,37890000,1000,0,0,NULL,'638216321889051015_macbook-air-m2-2023-15-inch-xanh-dd.jpg',NULL),(191,'Asus Zenbook S 13 OLED UX5304VA-NQ125W i7-1355U',1,1,36990000,1000,0,0,NULL,'638215695540093179_asus-zenbook-ux5304va-nq125w-i7-1355u-xam-dd.jpg',NULL),(192,'LG Gram 14T90R-G.AH55A5 i5-1340P',11,1,35490000,1000,0,0,NULL,'638219221274683749_lg-gram-14t90r-gah55a5-i5-1340p-den-dd.jpg',NULL),(193,'Asus TUF Gaming FA507NV-LP046W R7-7735HS',1,1,33990000,1000,0,0,NULL,'638205244835598782_asus-tuf-gaming-fa507nu-lp034w-r7-7735hs-dd.jpg',NULL),(194,'MacBook Air M2 2023 15 inch 8CPU 10GPU 8GB 256GB',10,1,32890000,1000,0,0,NULL,'638216321887898902_macbook-air-m2-2023-15-inch-bac-dd.jpg',NULL),(195,'Dell Vostro V5620 i7 1260P/P117F001AGR',7,1,29990000,1000,0,0,NULL,'637931472299277646_dell-vostro-v5620-xam-dd.jpg',NULL),(196,'Laptop MSI Summit E14 Flip Evo A12MT-210VN i7-1280P',2,1,28990000,1000,0,0,NULL,'638218481346373804_msi-summit-e14-flip-evo-a12-den-dd.jpg',NULL),(197,'Laptop Microsoft Surface Pro 9 i5-1235U',12,1,27990000,1000,0,0,NULL,'638137827133102789_microsoft-surface-pro-9-bac-dd.jpg',NULL),(198,'Dell Inspiron 16 N5620 i7-1255U (N6I7009W1)',7,1,26490000,1000,0,0,NULL,'637941164968673889_dell-inspiron-16-n5620-bac-dd.jpg',NULL),(199,'MSI Gaming Katana GF66 12UDK-814VN i7 12650H',2,1,25990000,1000,0,0,NULL,'638046447294275297_msi-gaming-katana-gf66-dd-bh-moi.jpg',NULL),(200,'Asus Vivobook 14X OLED S3405VA-KM071W i9-13900H',1,1,25690000,1000,0,0,NULL,'638198478493520974_asus-vivobook-s3405-den-dd.jpg',NULL),(201,'Lenovo ThinkBook 14p G3 ARH R5-6600H (21EJ000BVN)',5,1,25290000,1000,0,0,NULL,'638053279862941228_lenovo-thinkbook-14p-g3-arh-r5-6600h-xam-dd.jpg',NULL),(202,'HP Pavilion 15-eg2088TU i7 1260P (7C0R0PA)',6,1,24290000,1000,0,0,NULL,'638143029004534074_hp-pavilion-15-eg-vang-dd.jpg',NULL),(203,'Dell Inspiron 16 5620 i5 1240P (i5P165W11SLU)',7,1,22490000,1000,0,0,NULL,'637941164968673889_dell-inspiron-16-n5620-bac-dd.jpg',NULL),(204,'Lenovo ThinkBook 14s Yoga ITL i7 1165G7/20WE007MVN',5,1,22390000,1000,0,0,NULL,'637931331140097206_lenovo-thinkbook-14s-yoga-itl-xam-dd.jpg',NULL),(205,'Acer Aspire 7 Gaming A715-43G-R8GA R5 5625U (NH.QHDSV.002)',4,1,21990000,1000,0,0,NULL,'637728596076020587_acer-aspire-gaming-a715-42g-r1sb-r5-5500u-den-dd.jpg',NULL),(206,'Gigabyte Gaming G5 GE i5 12500H (51VN213SH)',3,1,20990000,1000,0,0,NULL,'638005617517121685_gigabyte-gaming-g5-ge-i5-12500h-rtx3050-dd.jpg',NULL),(207,'MSI Modern 14 C13M-607VN i7 1355U',2,1,20490000,1000,0,0,NULL,'638139818195276909_msi-modern-14-c11m-den-dd.jpg',NULL),(208,'Laptop Lenovo Ideapad Slim 5 Light 14ABR8 R7 7730 (82XS002JVN)',5,1,19990000,1000,0,0,NULL,'638219204861606204_lenovo-ideapad-slim-5-light-14abr8-r7-7730-xam-dd.jpg',NULL),(209,'Lenovo ThinkPad E15 Gen 4 R5-5625U (21ED0069VN)',5,1,19790000,1000,0,0,NULL,'638053299034245473_lenovo-thinkpad-e15-gen-4-amd-den-dd.jpg',NULL),(210,'Asus Zenbook UM5401QA-KN053W R5-5600H',1,1,19490000,1000,0,0,NULL,'637817445615604035_asus-zenbook-um5401-den-dd.jpg',NULL),(211,'HP 15s-fq5160TU i5-1235U/7C0S1PA',6,1,19190000,1000,0,0,NULL,'637931467519964702_hp-15s-fq-bac-win11-dd.jpg',NULL),(212,'Asus Vivobook A515EA-L12033W i5 1135G7',1,1,18990000,1000,0,0,NULL,'638140664678674182_asus-vivobook-a515-print-den-dd.jpg',NULL),(213,'MSI Modern 15 B7M-238VN R7 7730U',2,1,16490000,1000,0,0,NULL,'638152553406648131_msi-modern-15-b7m-den-dd.jpg',NULL),(214,'Dell Vostro V3520 i3 1215U/V5I3614W1',7,1,12490000,1000,0,0,NULL,'638188770716231803_dell-vostro-v3520-i3-1215u-xam-dd.jpg',NULL),(215,'Samsung Galaxy S22 5G 128GB',13,2,12490000,1000,0,0,NULL,'638158962810512367_ss-galaxy-s22-dd-icon.jpg',NULL),(216,'Xiaomi 13 Lite 8GB-128GB',14,2,8790000,1000,0,0,NULL,'638152728715036708_xiaomi-13-lite-dd-docquyen-bh.jpg',NULL),(217,'OPPO Reno8 4G 8GB - 256GB',15,2,6990000,1000,0,0,NULL,'638071497063030667_oppo-reno8-4g-dd.jpg',NULL),(218,'Xiaomi Redmi Note 12 4GB-128GB',14,2,4590000,1000,0,0,NULL,'638152739283440892_xiaomi-redmi-note-12-dd-bh.jpg',NULL),(219,'OPPO A55 4GB-64GB',15,2,3690000,1000,0,0,NULL,'637699137820447063_oppo-a55-dd.jpg',NULL),(220,'OPPO Reno8 T 5G 128GB',15,2,9490000,1000,0,0,NULL,'638155146453917901_oppo-reno8-t-5g-dd.jpg',NULL),(221,'iPhone 12 64GB',10,2,14890000,1000,0,0,NULL,'638107840321195326_iphone-12-dd.jpg',NULL),(222,'Samsung Galaxy A34 5G',13,2,7790000,1000,0,0,NULL,'638204338060590865_samsung-galaxy-a34-dd-moi.jpg',NULL),(223,'Samsung Galaxy A54 5G 128GB',13,2,9490000,1000,0,0,NULL,'638204318787625846_samsung-galaxy-a54-5g-den-dd-moi.jpg',NULL),(224,'realme C55 6GB-128GB',16,2,3990000,1000,0,0,NULL,'638161129322445770_realme-c55-dd-moi.jpg',NULL),(225,'Samsung Galaxy A14 4G',13,2,3990000,1000,0,0,NULL,'638218311992000309_samsung-galaxy-a14-4g-dd.jpg',NULL),(226,'OPPO A17k 3GB-64GB',15,2,2990000,1000,0,0,NULL,'638071502453762468_oppo-a17k-dd.jpg',NULL),(227,'Samsung Galaxy A04',13,2,2490000,1000,0,0,NULL,'638204396768989147_samsung-galaxy-a04-dd.jpg',NULL),(228,'Oppo Reno6 5G',15,2,7290000,1000,0,0,NULL,'638071509969314703_oppo-reno6-5g-dd.jpg',NULL),(229,'OPPO A57 4GB-128GB',15,2,4390000,1000,0,0,NULL,'638071500758726769_oppo-a57-dd.jpg',NULL),(230,'Xiaomi Redmi 12C 4GB - 64GB',14,2,2790000,1000,0,0,NULL,'638138646675090630_xiaomi-redmi-12c-dd.jpg',NULL),(231,'Xiaomi Redmi A1 2GB-32GB',14,2,1890000,1000,0,0,NULL,'638072152885717964_xiaomi-redmi-a1-den-dd-bh.jpg',NULL),(232,'Samsung Galaxy A04s',13,2,3490000,1000,0,0,NULL,'638204394272841272_samsung-galaxy-a04s-dd.jpg',NULL),(233,'Nokia G22 4GB-128GB',17,2,3690000,1000,0,0,NULL,'638149290295223149_nokia-g22-dd.jpg',NULL),(234,'Nokia 5710 XpressAudio',17,2,1590000,1000,0,0,NULL,'638016907739748325_nokia-5710-xpressaudio-den-dd.jpg',NULL),(235,'realme C35 4GB-128GB',16,2,3590000,1000,0,0,NULL,'638151673187488775_realme-c35-dd.jpg',NULL),(236,'Vivo Y35 8GB-128GB',18,2,5690000,1000,0,0,NULL,'638016881305619480_vivo-y35-den-dd.jpg',NULL),(237,'Vivo Y22s 8GB-128GB',18,2,4890000,1000,0,0,NULL,'637983398315589960_vivo-y22s-xanh-dd.jpg',NULL),(238,'Vivo Y15s 3GB - 32GB',18,2,2490000,1000,0,0,NULL,'637707822857432352_00779950-vivo-y15s-trang-xanh-dd.jpg',NULL),(239,'Vivo Y16 4GB-128GB',18,2,3690000,1000,0,0,NULL,'637983383787368693_vivo-y16-vang-dd.jpg',NULL),(240,'Samsung Galaxy Z Fold4 5G 256GB',13,2,31990000,1000,0,0,NULL,'638170656722725117_samsung-galaxy-z-fold4-do-dd-1.jpg',NULL),(241,'Samsung Galaxy S23 Ultra 5G 256GB',13,2,26990000,1000,0,0,NULL,'638211503117869660_samsung-galaxy-s23-ultra-xanh-dd-tragop.jpg',NULL),(242,'Samsung Galaxy Z Flip4 5G 128GB',13,2,16990000,1000,0,0,NULL,'638131738057784556_samsung-galaxy-z-flip4-vang-dd-tragop.jpg',NULL),(243,'Samsung Galaxy S21 FE 5G 8GB - 128GB',13,2,11490000,1000,0,0,NULL,'638005748533316822_samsung-galaxy-s21-fe-dd-tragop.jpg',NULL),(244,'iPhone 11 64GB',10,2,10380000,1000,0,0,NULL,'638173197260604063_iphone-11-dd.jpg',NULL),(245,'OPPO A77s 8GB-128GB',15,2,6290000,1000,0,0,NULL,'638071499364966239_oppo-a77s-dd.jpg',NULL),(246,'Xiaomi Redmi Note 11 Pro 8GB - 128GB',14,2,5990000,1000,0,0,NULL,'638072161262575097_xiaomi-redmi-note-11-pro-4g-dd-bh.jpg',NULL),(247,'OPPO A95 8GB-128GB',15,2,5490000,1000,0,0,NULL,'638071506082950649_oppo-a95-dd.jpg',NULL),(248,'Vivo Y33s 8GB - 128GB',18,2,4690000,1000,0,0,NULL,'637829405985657624_vivo-y33s-vang-dd.jpg',NULL),(249,'Xiaomi Redmi Note 11 4GB - 128GB',14,2,3990000,1000,0,0,NULL,'638072157041005486_xiaomi-redmi-note-11-dd-bh.jpg',NULL),(250,'Xiaomi Redmi 10 2022 4GB-128GB',14,2,3790000,1000,0,0,NULL,'638161092136822060_xiaomi-redmi-10-2022-dd-docquyen.jpg',NULL),(251,'Vivo T1x 4GB-64GB',18,2,3790000,1000,0,0,NULL,'637939995401683559_vivo-t1x-xanh-dd.jpg',NULL),(252,'Samsung Galaxy A13',13,2,3190000,1000,0,0,NULL,'637835361843548009_samsung-galaxy-a13-den-dd.jpg',NULL),(253,'Xiaomi Redmi 10A 3GB-64GB',14,2,2590000,1000,0,0,NULL,'638074782811199183_xiaomi-redmi-10a-dd-bh-docquyen.jpg',NULL),(254,'Nokia C30 3GB-32GB',17,2,1990000,1000,0,0,NULL,'637649063877578070_nokia-c30-xanh-dd.jpg',NULL),(255,'iPhone 14 Pro Max 128GB',10,2,26590000,1000,0,0,NULL,'638107858631679725_iphone-14-pro-max-dd-1.jpg',NULL),(256,'Asus ROG Phone 7 16GB-512GB',1,2,24990000,1000,0,0,NULL,'638208087528589069_asus-rog-phone-7-dd.jpg',NULL),(257,'iPhone 14 Pro 128GB',10,2,24880000,1000,0,0,NULL,'638107858632184994_iphone-14-pro-dd-1.jpg',NULL),(258,'Samsung Galaxy S23 Plus 5G 256GB',13,2,23990000,1000,0,0,NULL,'638182970630939004_samsung-galaxy-s23-plus-tim-dd-tragop.jpg',NULL),(259,'Xiaomi 13 Pro 12GB-256GB',14,2,23490000,1000,0,0,NULL,'638152730495873388_xiaomi-13-pro-dd-bh.jpg',NULL),(260,'iPhone 14 Plus 128GB',10,2,21680000,1000,0,0,NULL,'638138668784200644_iphone-14-plus-dd.jpg',NULL),(261,'Samsung Galaxy S23 5G 256GB',13,2,20490000,1000,0,0,NULL,'638182973204556611_samsung-galaxy-s23-vang-dd-tragop.jpg',NULL),(262,'Asus ROG 6 DIABLO 16GB-512GB',1,2,19990000,1000,0,0,NULL,'638067823694050310_asus-rog6-diablo-dd-docquyen.jpg',NULL),(263,'OPPO Find N2 Flip',15,2,19990000,1000,0,0,NULL,'638219243453454034_oppo-find-n2-flip-dd-bh.jpg',NULL),(264,'iPhone 14 128GB',10,2,19180000,1000,0,0,NULL,'638138668784040702_iphone-14-dd.jpg',NULL),(265,'Asus ROG 6 BATMAN 12GB-256GB',1,2,18790000,1000,0,0,NULL,'638061190099372111_asus-rog6-batman-den-dd.jpg',NULL),(266,'Xiaomi 13 8GB-256GB',14,2,17490000,1000,0,0,NULL,'638152732414181613_xiaomi-13-dd-bh.jpg',NULL),(267,'Samsung Galaxy Z Flip4 5G 256GB Bespoke Edition',13,2,16990000,1000,0,0,NULL,'638167465484591506_samsung-galaxy-z-flip4-xanh-dd.jpg',NULL),(268,'Asus ROG Phone 6 12GB-256GB',1,2,16990000,1000,0,0,NULL,'637944507138520994_asus-rog-6-12gb-256gb-dd.jpg',NULL),(269,'iPhone 13 128GB',10,2,16790000,1000,0,0,NULL,'638107846050335072_iphone-13-dd-1.jpg',NULL),(270,'Vivo V25 Pro 5G 8GB-128GB',18,2,10990000,1000,0,0,NULL,'638036697912302156_vivo-v25-pro-5g-xanh-dd.jpg',NULL),(271,'Vivo V25 5G 8GB-128GB',18,2,9390000,1000,0,0,NULL,'637987655741141806_vivo-v25-den-dd.jpg',NULL),(272,'Samsung Galaxy A73 5G',13,2,8900000,1000,0,0,NULL,'637849355447769871_samsung-galaxy-a73-xanh-dd.jpg',NULL),(273,'Xiaomi Redmi Note 12 Pro 5G 8GB-256GB',14,2,8790000,1000,0,0,NULL,'638152739283284609_xiaomi-redmi-note-12-pro-dd-bh.jpg',NULL),(274,'Samsung Galaxy A53 5G 128GB',13,2,7990000,1000,0,0,NULL,'637825310288115049_samsung-galaxy-a53-den-4.jpg',NULL),(275,'Xiaomi Redmi Note 12 Pro 8GB-256GB',14,2,7490000,1000,0,0,NULL,'638203653824945690_xiaomi-redmi-note-12-pro-4g-dd-bh.jpg',NULL),(276,'OPPO Reno7 Z 5G 8GB - 128GB',15,2,7290000,1000,0,0,NULL,'637816817507294378_oppo-reno7-z-dd.jpg',NULL),(277,'Vivo V25e 8GB - 128GB',18,2,6590000,1000,0,0,NULL,'637987654083012579_vivo-v25e-vang-dd.jpg',NULL),(278,'OPPO Reno6 Z 5G',15,2,6490000,1000,0,0,NULL,'637613342139496099_oppo-reno6z-dd.jpg',NULL),(279,'Samsung Galaxy A33 5G',13,2,6290000,1000,0,0,NULL,'637851846462573963_samsung-galaxy-a33-den-dd.jpg',NULL),(280,'Xiaomi Redmi Note 12S 8GB-256GB',14,2,6190000,1000,0,0,NULL,'638203651486566280_xiaomi-redmi-note-12s-dd-bh.jpg',NULL),(281,'realme 10 8GB-256GB',16,2,6090000,1000,0,0,NULL,'638176081148992373_realme-10-dd.jpg',NULL),(282,'Samsung Galaxy A23 5G',13,2,4990000,1000,0,0,NULL,'638017838320777050_samsung-galaxy-a23-5g-xanh-dd.jpg',NULL),(283,'Xiaomi Redmi Note 11S 8GB - 128GB',14,2,4990000,1000,0,0,NULL,'638125826982133292_xiaomi-redmi-note-11s-dd-bh.jpg',NULL),(284,'Samsung Galaxy A14 5G',13,2,4890000,1000,0,0,NULL,'638218313276170555_samsung-galaxy-a14-5g-dd.jpg',NULL),(285,'OPPO A17 4GB-64GB',15,2,3990000,1000,0,0,NULL,'638071513576393682_oppo-a17-dd.jpg',NULL),(286,'Vivo Y02s 3GB-32GB',18,2,2790000,1000,0,0,NULL,'637940794893480185_vivo-y02s-3gb-32gb-xanh-dd.jpg',NULL),(287,'OPPO A16k 3GB-32GB',15,2,2790000,1000,0,0,NULL,'638071511140797328_oppo-a16k-dd.jpg',NULL),(288,'realme C33 3GB-32GB',16,2,2440000,1000,0,0,NULL,'638151666818171145_realme-c33-dd.jpg',NULL),(289,'realme C30s 3GB-64GB',16,2,2390000,1000,0,0,NULL,'638151666817188867_realme-c30s-dd.jpg',NULL),(290,'Vivo Y02 2GB-32GB',18,2,2290000,1000,0,0,NULL,'638052549038276135_vivo-y02-xanh-dd.jpg',NULL),(291,'Nokia 2660 Flip 4G',17,2,1590000,1000,0,0,NULL,'637988558582103416_nokia-2660-flip-den-dd.jpg',NULL),(292,'Nokia 8210 4G',17,2,1590000,1000,0,0,NULL,'637952294123095133_nokia-8210-4g-xanh-dd.jpg',NULL),(293,'Masstel Hapi 30 4G',9,2,1490000,1000,0,0,NULL,'637751862186648985_masstel-hapi-30-4g-xanh-dd.jpg',NULL),(294,'Nokia 215 DS 4G',17,2,990000,1000,0,0,NULL,'637408832230600670_nokia-215-xanh-dd.png',NULL),(295,'Masstel Fami 65 4G',9,2,850000,1000,0,0,NULL,'637989382071193590_masstel-fami-65-dd-100.jpg',NULL),(296,'Masstel Lux 20 4G',9,2,800000,1000,0,0,NULL,'638006438765947578_masstel-lux-20-dd-100ngay.jpg',NULL),(297,'Masstel Fami 60 4G',9,2,750000,1000,0,0,NULL,'638006434452493367_masstel-izi-60-4g-vang-dd-100ngay.jpg',NULL),(298,'Nokia 110 DS 4G',17,2,720000,1000,0,0,NULL,'637607669839802063_nokia-110-4g-dd.jpg',NULL),(299,'Nokia 105 DS 4G',17,2,670000,1000,0,0,NULL,'637607682248137712_nokia-105-4g-den-dd.jpg',NULL),(300,'Masstel Fami 12 4G',9,2,650000,1000,0,0,NULL,'638006430217284535_masstel-fami-12-4g-dd-100ngay.jpg',NULL),(301,'Masstel Lux 10 4G',9,2,650000,1000,0,0,NULL,'637989382071349621_masstel-lux-10-dd-100.jpg',NULL),(302,'Masstel Izi 25 4G',9,2,550000,1000,0,0,NULL,'637989382071349621_masstel-izi-25-dd-100.jpg',NULL),(303,'Masstel Izi 20 4G',9,2,500000,1000,0,0,NULL,'638064543219075865_masstel-izi-20-4g-dd-100ngay.jpg',NULL),(304,'Masstel Izi 10 4G',9,2,450000,1000,0,0,NULL,'638006440213576388_masstel-izi-10-4g-dd-100ngay.jpg',NULL),(305,'Masstel Izi 15 4G',9,2,390000,1000,0,0,NULL,'638174326917605379_masstel-izi-15-dd.jpg',NULL),(306,'Masstel Izi 11 4G',9,2,450000,1000,0,0,NULL,'638163903724822615_masstel-izi-11-dd-doimoi.jpg',NULL),(307,'Samsung Galaxy Tab S6 Lite 2022',13,3,6990000,1000,0,0,NULL,'637994560710957944_samsung-galaxy-tab-s6-lite-2022--dd-docquyen.jpg',NULL),(308,'Coolpad Tab Tasker 10 Wifi 3GB-32GB',20,3,2990000,1000,0,0,NULL,'638006465857672321_coolpad-tab-tasker-10-dd-docquyen-bh.jpg',NULL),(309,'Masstel Tab 10M 4G',9,3,2990000,1000,0,0,NULL,'638006461102508767_may-tinh-bang-masstel-tab-10m-4g-docquyen-100ngay.jpg',NULL),(310,'iPad Gen 9 2021 10.2 inch WiFi 64GB',10,3,7490000,1000,0,0,NULL,'638059452014421919_ipad-gen-9-wifi-dd.jpg',NULL),(311,'Samsung Galaxy Tab A8 WiFi',13,3,4790000,1000,0,0,NULL,'638174908829566756_samsung-galaxy-tab-a8-wifi-dd.jpg',NULL),(312,'iPad mini 6 2021 8.3 inch WiFi 64GB',10,3,12090000,1000,0,0,NULL,'637673371022722752_ipad-mini-8-3-2021-wi-fi-dd.jpg',NULL),(313,'Samsung Galaxy Tab A7 Lite',13,3,3790000,1000,0,0,NULL,'637577199955105403_ss-tab-a7-lite-bac-dd.jpg',NULL),(314,'Lenovo Tab M8-Gen 2',5,3,2590000,1000,0,0,NULL,'638006463252894432_lenovo-tab-m8-gen-2-dd-bh.jpg',NULL),(315,'Masstel Tab 10 Wifi',9,3,2190000,1000,0,0,NULL,'637994581190835400_may-tinh-bang-masstel-tab-10-wifi-dd-docquyen.jpg',NULL),(316,'Samsung Galaxy Tab S7 FE',13,3,10990000,1000,0,0,NULL,'637607328871408633_samsung-galaxy-tab-s7-fe-dd.jpg',NULL),(317,'Samsung Galaxy Tab S8 5G',13,3,15990000,1000,0,0,NULL,'637800821875665906_samsung-galaxy-tab-s8-bac-dd.jpg',NULL),(318,'Samsung Galaxy Tab A8 2022',13,3,6490000,1000,0,0,NULL,'637772300031773397_samsung-galaxy-tab-a8-xam-dd.jpg',NULL),(319,'iPad Pro 12.9 2022 M2 WiFi 5G 128GB',10,3,31990000,1000,0,0,NULL,'638017418508265503_ipad-pro-129-m2-2022-wifi-5g-dd.jpg',NULL),(320,'iPad Pro 12.9 2022 M2 WiFi 128GB',10,3,27990000,1000,0,0,NULL,'638017406298728611_ipad-pro-129-m2-2022-wifi-dd.jpg',NULL),(321,'Samsung Galaxy Tab S8 Ultra 5G',13,3,25990000,1000,0,0,NULL,'637884857856273629_samsung-galaxy-tab-s8-ultra-dd.jpg',NULL),(322,'iPad Pro 11 2022 M2 WiFi 5G 128GB',10,3,24290000,1000,0,0,NULL,'638017392498973530_ipad-pro-11-m2-2022-wifi-5g-dd.jpg',NULL),(323,'Samsung Galaxy Tab S8 Plus 5G',13,3,20990000,1000,0,0,NULL,'637800828240437267_samsung-galaxy-tab-s8-plus-xam-dd.jpg',NULL),(324,'iPad Pro 11 2022 M2 WiFi 128GB',10,3,20690000,1000,0,0,NULL,'638017388619197196_ipad-pro-11-m2-2022-wifi-dd.jpg',NULL),(325,'iPad Air 5 2022 10.9 inch M1 WiFi 5G 64GB',10,3,17190000,1000,0,0,NULL,'637824189776891172_ipad-air-2022-wifi-cell-dd.jpg',NULL),(326,'iPad mini 6 2021 8.3 inch WiFi 5G 64GB',10,3,15590000,1000,0,0,NULL,'637673393446927234_ipad-mini-8-3-2021-wi-fi-5g-dd.jpg',NULL),(327,'iPad Gen 10 2022 10.9 inch WiFi 5G 64GB',10,3,14390000,1000,0,0,NULL,'638017370231230867_ipad-gen-10-wifi-5g-dd.jpg',NULL),(328,'iPad Air 5 2022 10.9 inch M1 WiFi 64GB',10,3,14190000,1000,0,0,NULL,'637824187249578799_ipad-air-2022-wifi-dd.jpg',NULL),(329,'iPad Gen 10 2022 10.9 inch WiFi 64GB',10,3,11190000,1000,0,0,NULL,'638017355452124924_ipad-gen-10-wifi-dd.jpg',NULL),(330,'iPad Gen 9 2021 10.2 inch WiFi Cellular 64GB',10,3,10090000,1000,0,0,NULL,'638059452164293984_ipad-gen-9-wifi-4g-dd.jpg',NULL),(331,'OPPO Pad Air 4GB-64GB',15,3,6490000,1000,0,0,NULL,'637953965094578434_oppo-pad-air-dd.jpg',NULL),(332,'Nexta Smart Study 1',21,3,5900000,1000,0,0,NULL,'637801979946453203_nexta-smart-study-1-xanh-dd.jpg',NULL),(333,'Lenovo Tab M10 3GB-32GB (Gen 3)',5,3,4790000,1000,0,0,NULL,'638046361535750788_lenovo-tab-m10-gen-3-xam-dd.jpg',NULL),(334,'Xiaomi Redmi Pad 3GB-64GB',14,3,4590000,1000,0,0,NULL,'638048985100937050_xiaomi-redmi-pad-xam-dd.jpg',NULL),(335,'Lenovo Tab M10 64GB (Gen2)',5,3,4190000,1000,0,0,NULL,'638006464334220327_lenovo-tab-m10-gen-2-dd-bh.jpg',NULL),(336,'iPad Pro 12.9 2022 M2 WiFi 5G 1TB',10,3,50990000,1000,0,0,NULL,'638017418508265503_ipad-pro-129-m2-2022-wifi-5g-dd.jpg',NULL),(337,'iPad Pro 12.9 2022 M2 WiFi 1TB',10,3,46990000,1000,0,0,NULL,'638017406298728611_ipad-pro-129-m2-2022-wifi-dd.jpg',NULL),(338,'iPad Pro 11 2022 M2 WiFi 5G 1TB',10,3,42990000,1000,0,0,NULL,'638017392498973530_ipad-pro-11-m2-2022-wifi-5g-dd.jpg',NULL),(339,'iPad Pro 11 2022 M2 WiFi 1TB',10,3,39190000,1000,0,0,NULL,'638017406298728611_ipad-pro-129-m2-2022-wifi-dd.jpg',NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ratings`
--

DROP TABLE IF EXISTS `ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ratings` (
  `rating_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `rate` int unsigned DEFAULT NULL,
  PRIMARY KEY (`rating_id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `rate` CHECK (((`rate` >= 1) and (`rate` <= 5)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ratings`
--

LOCK TABLES `ratings` WRITE;
/*!40000 ALTER TABLE `ratings` DISABLE KEYS */;
/*!40000 ALTER TABLE `ratings` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_ratings_insert` BEFORE INSERT ON `ratings` FOR EACH ROW BEGIN
	IF ((SELECT  COUNT(*) FROM ratings WHERE user_id = NEW.user_id AND product_id = NEW.product_id) = 1) THEN
		SIGNAL sqlstate '45001' set message_text = "No way ! You rated this product !";
	END IF;
	IF ((SELECT COUNT(*) FROM orders JOIN order_details
		ON orders.order_id = order_details.order_id
		WHERE product_id = NEW.product_id AND paid = 1 AND user_id = NEW.user_id) = 0) THEN
		SIGNAL sqlstate '45001' set message_text = "No way ! You have to buy this product !";
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin'),(2,'customer');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `session_id` varchar(512) NOT NULL,
  `valid_until` datetime DEFAULT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `supplier_id` int NOT NULL AUTO_INCREMENT,
  `supplier_name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone_number` varchar(13) DEFAULT NULL,
  PRIMARY KEY (`supplier_id`),
  UNIQUE KEY `UQ_supplier_name` (`supplier_name`),
  UNIQUE KEY `UQ_supplier_email` (`email`),
  UNIQUE KEY `UQ_supplier_phone_number` (`phone_number`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES (1,'Asus','Taiwan',NULL,NULL),(2,'MSI','Taiwan',NULL,NULL),(3,'Gigabyte','Taiwan',NULL,NULL),(4,'Acer','Taiwan',NULL,NULL),(5,'Lenovo','China',NULL,NULL),(6,'HP','USA',NULL,NULL),(7,'Dell','USA',NULL,NULL),(8,'Chuwi','China',NULL,NULL),(9,'Masstel','Vietnam',NULL,NULL),(10,'Apple (MacBook)','USA',NULL,NULL),(11,'LG','Korea',NULL,NULL),(12,'Microsoft','USA',NULL,NULL),(13,'Samsung','Korea',NULL,NULL),(14,'Xiaomi','China',NULL,NULL),(15,'OPPO','China',NULL,NULL),(16,'realme','China',NULL,NULL),(17,'Nokia','Finland',NULL,NULL),(18,'Vivo','China',NULL,NULL),(19,'Honor','China',NULL,NULL),(20,'Coolpad','China',NULL,NULL),(21,'Nexta','Vietnam',NULL,NULL);
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `role_id` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `birth_date` date NOT NULL,
  `sex` char(1) NOT NULL,
  `address` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone_number` char(12) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT 'user.png',
  `hashed_password` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UQ_username` (`username`),
  UNIQUE KEY `UQ_email` (`email`),
  UNIQUE KEY `UQ_phone_number` (`phone_number`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `User_sex` CHECK (((`sex` = _utf8mb4'M') or (`sex` = _utf8mb4'F')))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,1,'hoaian_admin','Hoài Ân','Lê','2003-02-22','M','Hòa Trị, Phú Hòa, Phú Yên',NULL,NULL,'user.png','$2b$10$V11jxXDnQf2Xryyu2jP.6./6v0JRMA5DOCmTTuYd6FgsxJ1R6kxzm');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vouchers`
--

DROP TABLE IF EXISTS `vouchers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vouchers` (
  `voucher_id` varchar(60) NOT NULL,
  `voucher_name` varchar(255) NOT NULL,
  `voucher_discount` double NOT NULL,
  `expiry_date` date NOT NULL,
  `description` text,
  PRIMARY KEY (`voucher_id`),
  CONSTRAINT `voucher_limit` CHECK (((`voucher_discount` > 0) and (`voucher_discount` < 1)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vouchers`
--

LOCK TABLES `vouchers` WRITE;
/*!40000 ALTER TABLE `vouchers` DISABLE KEYS */;
/*!40000 ALTER TABLE `vouchers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'e-commerce'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-12  7:57:53