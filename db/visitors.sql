-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 23, 2024 at 01:36 AM
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
  `employee_id` int(11) DEFAULT NULL,
  `health_safety` varchar(128) NOT NULL,
  `checkin_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `checkout_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `visitors`
--

INSERT INTO `visitors` (`id`, `name`, `from`, `email`, `phone`, `employee_id`, `health_safety`, `checkin_time`, `checkout_time`) VALUES
(32, 'bibek munikar', 'atrax group', 'bibek.munikar@gmail.com', 2041677367, 28, '1', '2024-01-20 12:28:58', '0000-00-00 00:00:00'),
(35, 'John Wick ', 'Skycity', 'john@gmail.com', 29939492, 22, '0', '2024-01-20 13:28:59', '0000-00-00 00:00:00'),
(37, 'bibek munikar', 'atrax group', 'bibek.munikar@gmail.com', 2041677367, 19, '0', '2024-01-21 11:37:13', '0000-00-00 00:00:00'),
(38, 'bibek munikar', '', 'bibek.munikar@gmail.com', 2041677367, 21, '1', '2024-01-21 13:39:49', '0000-00-00 00:00:00'),
(39, 'bibek munikar', 'atrax group', 'bibek.munikar@gmail.com', 2041677367, 21, '1', '2024-01-23 00:28:09', '0000-00-00 00:00:00'),
(40, 'Ashma Maharjan', 'TVNZ', 'ashma@gmail.com', 202227367, 22, '0', '2024-01-23 00:30:44', '0000-00-00 00:00:00');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
