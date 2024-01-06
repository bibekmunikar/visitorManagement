-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 06, 2024 at 07:39 AM
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
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `full_name` varchar(128) NOT NULL,
  `alt_name` varchar(128) NOT NULL,
  `email` varchar(128) NOT NULL,
  `department_id` int(128) NOT NULL,
  `mobile_number` int(11) NOT NULL,
  `job_title` varchar(128) NOT NULL,
  `emp_role_type` varchar(128) DEFAULT NULL,
  `photo` varchar(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `full_name`, `alt_name`, `email`, `department_id`, `mobile_number`, `job_title`, `emp_role_type`, `photo`) VALUES
(14, 'bibek munikar', '', 'bibek.munikar@gmail.com', 0, 2041677367, 'Developer', NULL, NULL),
(15, 'bibek munikar', 'S', 'bibek.munikar@gmail.com', 0, 2041677367, 'Developer', NULL, NULL),
(16, 'bibek munikar', '', 'bibek.munikar@gmail.com', 0, 2041677367, 'q', NULL, NULL),
(17, 'bibek munikar', '', 'bibek.munikar@gmail.com', 0, 2041677367, 'Developer', NULL, NULL),
(18, 'bibek munikar', '', 'bibek.munikar@gmail.com', 98, 2041677367, 'Developer', NULL, NULL),
(19, 'bibek munikar', '', 'bibek.munikar@gmail.com', 112, 2041677367, 'new job title added', NULL, NULL),
(20, 'bibek munikar', '', 'bibek.munikar@gmail.com', 113, 2041677367, 'bibek job title', NULL, NULL),
(21, 'bibek munikar', '', 'bibek.munikar@gmail.com', 114, 2041677367, 'Developer', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
