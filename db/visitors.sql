-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 14, 2024 at 02:51 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `visitorManagement`
--

-- --------------------------------------------------------

--
-- Table structure for table `visitors`
--

CREATE TABLE `visitors` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `from` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` int(15) NOT NULL,
  `visiting_employee_id` int(11) DEFAULT NULL,
  `health_safety` varchar(255) DEFAULT NULL,
  `checkin_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `checkout_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `visitors`
--

INSERT INTO `visitors` (`id`, `name`, `from`, `email`, `phone`, `visiting_employee_id`, `health_safety`, `checkin_time`, `checkout_time`) VALUES
(5, 'ashma', 'abc', 'abz@gmail.com', 0, NULL, NULL, '2024-01-13 06:55:53', '0000-00-00 00:00:00'),
(9, 'bibek munikar', 'atrax group', 'bibek.munikar@gmail.com', 2041677367, 15, NULL, '2024-01-13 08:00:23', '0000-00-00 00:00:00'),
(10, 'Soumya', 'atrax group', 'soumya@gmail.com', 93948834, 16, NULL, '2024-01-13 08:00:56', '0000-00-00 00:00:00'),
(12, 'John Wick ', 'ajsjsjsjs', 'bibek.munikar@gmail.com', 2041677367, 22, NULL, '2024-01-13 08:03:01', '0000-00-00 00:00:00'),
(13, 'bibek munikarasdas', 'asdasd', 'bibek.munikssasdaar@gmail.com', 234234234, 20, NULL, '2024-01-13 09:34:00', '0000-00-00 00:00:00'),
(14, 'bibek munikar', '', 'bibek.munikar@gmail.com', 2041677367, NULL, NULL, '2024-01-14 07:03:05', '0000-00-00 00:00:00'),
(15, 'Jackson Smith', 'Skycity', 'jacky@gmail.com', 993848393, NULL, NULL, '2024-01-14 12:55:53', '0000-00-00 00:00:00'),
(16, 'bibek munikar', '', 'bibek.munikar@gmail.com', 2041677367, NULL, NULL, '2024-01-14 13:29:58', '0000-00-00 00:00:00'),
(17, 'bibek munikar', '', 'bibek.munikar@gmail.com', 2041677367, NULL, NULL, '2024-01-14 13:36:15', '0000-00-00 00:00:00'),
(18, 'bibek munikar', '', 'bibek.munikar@gmail.com', 2041677367, NULL, NULL, '2024-01-14 13:46:56', '0000-00-00 00:00:00'),
(19, 'bibek munikar', 'atrax group', 'bibek.munikar@gmail.com', 2041677367, NULL, NULL, '2024-01-14 13:48:54', '0000-00-00 00:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `visitors`
--
ALTER TABLE `visitors`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `visitors`
--
ALTER TABLE `visitors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
