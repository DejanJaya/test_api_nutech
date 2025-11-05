-- MySQL Administrator dump 1.4
--
-- ------------------------------------------------------
-- Server version	5.5.5-10.5.8-MariaDB


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


--
-- Create schema nutech_api
--

CREATE DATABASE IF NOT EXISTS nutech_api;
USE nutech_api;

--
-- Definition of table `banners`
--

DROP TABLE IF EXISTS `banners`;
CREATE TABLE `banners` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `banner_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `banner_image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `banners`
--

/*!40000 ALTER TABLE `banners` DISABLE KEYS */;
INSERT INTO `banners` (`id`,`banner_name`,`banner_image`,`description`) VALUES 
 (1,'Banner 1','https://nutech-integrasi.app/dummy.jpg','Lorem Ipsum Dolor sit amet'),
 (2,'Banner 2','https://nutech-integrasi.app/dummy.jpg','Lorem Ipsum Dolor sit amet'),
 (3,'Banner 3','https://nutech-integrasi.app/dummy.jpg','Lorem Ipsum Dolor sit amet'),
 (4,'Banner 4','https://nutech-integrasi.app/dummy.jpg','Lorem Ipsum Dolor sit amet'),
 (5,'Banner 5','https://nutech-integrasi.app/dummy.jpg','Lorem Ipsum Dolor sit amet'),
 (6,'Banner 6','https://nutech-integrasi.app/dummy.jpg','Lorem Ipsum Dolor sit amet');
/*!40000 ALTER TABLE `banners` ENABLE KEYS */;


--
-- Definition of table `services`
--

DROP TABLE IF EXISTS `services`;
CREATE TABLE `services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `service_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `service_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `service_icon` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `service_tariff` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `service_code` (`service_code`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `services`
--

/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` (`id`,`service_code`,`service_name`,`service_icon`,`service_tariff`) VALUES 
 (1,'PAJAK','Pajak PBB','https://nutech-integrasi.app/dummy.jpg',40000),
 (2,'PLN','Listrik','https://nutech-integrasi.app/dummy.jpg',10000),
 (3,'PDAM','PDAM Berlangganan','https://nutech-integrasi.app/dummy.jpg',40000),
 (4,'PULSA','Pulsa','https://nutech-integrasi.app/dummy.jpg',40000),
 (5,'PGN','PGN Berlangganan','https://nutech-integrasi.app/dummy.jpg',50000),
 (6,'MUSIK','Musik Berlangganan','https://nutech-integrasi.app/dummy.jpg',50000),
 (7,'TV','TV Berlangganan','https://nutech-integrasi.app/dummy.jpg',50000),
 (8,'PAKET_DATA','Paket data','https://nutech-integrasi.app/dummy.jpg',50000),
 (9,'VOUCHER_GAME','Voucher Game','https://nutech-integrasi.app/dummy.jpg',100000),
 (10,'VOUCHER_MAKANAN','Voucher Makanan','https://nutech-integrasi.app/dummy.jpg',100000),
 (11,'QURBAN','Qurban','https://nutech-integrasi.app/dummy.jpg',200000),
 (12,'ZAKAT','Zakat','https://nutech-integrasi.app/dummy.jpg',300000);
/*!40000 ALTER TABLE `services` ENABLE KEYS */;


--
-- Definition of table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
CREATE TABLE `transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `transaction_type` enum('TOPUP','PAYMENT') COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_amount` int(11) NOT NULL,
  `service_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `service_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoice_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transactions`
--

/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` (`id`,`user_id`,`transaction_type`,`total_amount`,`service_code`,`service_name`,`invoice_number`,`description`,`created_on`) VALUES 
 (5,1,'TOPUP',100000,NULL,NULL,'INV05112025-001','Top Up balance','2025-11-05 11:50:03'),
 (6,1,'PAYMENT',40000,'PAJAK','Pajak PBB','INV05112025-002','Pajak PBB','2025-11-05 11:50:33');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;


--
-- Definition of table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `balance` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`,`email`,`first_name`,`last_name`,`password`,`profile_image`,`balance`) VALUES 
 (1,'user@gmail.com','Dejan update','Jaya','$2b$10$c57P4/mbPpu81BiWOidpv.YULndcXZhvWaf8AwaVWePwRBsq2BX7S','http://localhost:3000/uploads/1762243277548-milo.jpg',60000);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;




/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
