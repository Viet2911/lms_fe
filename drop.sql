-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th1 02, 2026 lúc 08:33 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `lms`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED DEFAULT NULL,
  `action` varchar(100) DEFAULT NULL,
  `entity_type` varchar(50) DEFAULT NULL,
  `entity_id` int(10) UNSIGNED DEFAULT NULL,
  `old_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`old_data`)),
  `new_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_data`)),
  `ip_address` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `assignments`
--

CREATE TABLE `assignments` (
  `id` int(10) UNSIGNED NOT NULL,
  `class_id` int(10) UNSIGNED NOT NULL,
  `session_id` int(10) UNSIGNED DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `file_id` int(10) UNSIGNED DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `assignment_submissions`
--

CREATE TABLE `assignment_submissions` (
  `id` int(10) UNSIGNED NOT NULL,
  `assignment_id` int(10) UNSIGNED NOT NULL,
  `student_id` int(10) UNSIGNED NOT NULL,
  `content` text DEFAULT NULL,
  `file_url` varchar(500) DEFAULT NULL,
  `status` enum('pending','submitted','graded') DEFAULT 'pending',
  `score` decimal(5,2) DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `graded_at` timestamp NULL DEFAULT NULL,
  `graded_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `attendance`
--

CREATE TABLE `attendance` (
  `id` int(10) UNSIGNED NOT NULL,
  `session_id` int(10) UNSIGNED NOT NULL,
  `student_id` int(10) UNSIGNED NOT NULL,
  `trial_student_id` int(10) UNSIGNED DEFAULT NULL,
  `status` enum('present','absent','late','excused') DEFAULT 'present',
  `check_in_time` timestamp NULL DEFAULT NULL,
  `check_in_by` int(10) UNSIGNED DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `branches`
--

CREATE TABLE `branches` (
  `id` int(10) UNSIGNED NOT NULL,
  `code` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `address` text DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `bank_account` varchar(50) DEFAULT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `branches`
--

INSERT INTO `branches` (`id`, `code`, `name`, `address`, `phone`, `email`, `bank_account`, `bank_name`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'TH-LLQ', '160 Lạc Long Quân', '160 Lạc Long Quân, Tây Hồ, Hà Nội', '0866766189', NULL, NULL, NULL, 1, '2026-01-01 14:34:45', '2026-01-01 14:34:45');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `branch_packages`
--

CREATE TABLE `branch_packages` (
  `id` int(10) UNSIGNED NOT NULL,
  `branch_id` int(10) UNSIGNED NOT NULL,
  `package_id` int(10) UNSIGNED NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `classes`
--

CREATE TABLE `classes` (
  `id` int(10) UNSIGNED NOT NULL,
  `branch_id` int(10) UNSIGNED NOT NULL,
  `class_code` varchar(30) NOT NULL,
  `class_name` varchar(100) NOT NULL,
  `subject_id` int(10) UNSIGNED DEFAULT NULL,
  `level_id` int(10) UNSIGNED DEFAULT NULL,
  `study_days` text NOT NULL,
  `teacher_id` int(10) UNSIGNED DEFAULT NULL,
  `cm_id` int(10) UNSIGNED DEFAULT NULL,
  `schedule` varchar(200) DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `max_students` int(11) DEFAULT 15,
  `status` enum('forming','active','completed','cancelled') DEFAULT 'forming',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `end_time` time DEFAULT NULL,
  `room` int(11) NOT NULL,
  `total_sessions` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `classes`
--

INSERT INTO `classes` (`id`, `branch_id`, `class_code`, `class_name`, `subject_id`, `level_id`, `study_days`, `teacher_id`, `cm_id`, `schedule`, `start_time`, `max_students`, `status`, `start_date`, `end_date`, `note`, `created_at`, `updated_at`, `end_time`, `room`, `total_sessions`) VALUES
(1, 1, 'TH-LLQ-MJVKFCRL', 'RBT1.1-TH-LLQ-001', 2, 1, 'CN', 2, 3, NULL, '23:53:00', 15, 'active', '2026-01-01', NULL, NULL, '2026-01-01 14:53:54', '2026-01-01 14:53:54', '18:53:00', 1, 15);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `class_students`
--

CREATE TABLE `class_students` (
  `id` int(10) UNSIGNED NOT NULL,
  `class_id` int(10) UNSIGNED NOT NULL,
  `student_id` int(10) UNSIGNED NOT NULL,
  `status` enum('active','paused','completed','dropped','removed') DEFAULT 'active',
  `enrolled_at` date DEFAULT NULL,
  `left_at` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `class_students`
--

INSERT INTO `class_students` (`id`, `class_id`, `student_id`, `status`, `enrolled_at`, `left_at`, `created_at`) VALUES
(1, 1, 1, 'active', NULL, NULL, '2026-01-01 14:55:09');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ec_kpi_targets`
--

CREATE TABLE `ec_kpi_targets` (
  `id` int(10) UNSIGNED NOT NULL,
  `ec_id` int(10) UNSIGNED NOT NULL,
  `branch_id` int(10) UNSIGNED DEFAULT NULL,
  `target_month` date NOT NULL,
  `target_revenue` decimal(15,2) DEFAULT 0.00,
  `target_leads` int(11) DEFAULT 0,
  `target_conversions` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `experience_schedules`
--

CREATE TABLE `experience_schedules` (
  `id` int(10) UNSIGNED NOT NULL,
  `branch_id` int(10) UNSIGNED NOT NULL,
  `code` varchar(30) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `customer_phone` varchar(20) NOT NULL,
  `customer_email` varchar(100) DEFAULT NULL,
  `student_name` varchar(100) NOT NULL,
  `student_birth_year` int(11) DEFAULT NULL,
  `subject_id` int(10) UNSIGNED DEFAULT NULL,
  `level_id` int(10) UNSIGNED DEFAULT NULL,
  `scheduled_date` date DEFAULT NULL,
  `scheduled_time` time DEFAULT NULL,
  `duration_minutes` int(11) DEFAULT 60,
  `status` enum('scheduled','attended','no_show','cancelled','converted') DEFAULT 'scheduled',
  `rating` tinyint(4) DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `note` text DEFAULT NULL,
  `sale_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `files`
--

CREATE TABLE `files` (
  `id` int(10) UNSIGNED NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_url` varchar(500) NOT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `file_size` int(11) DEFAULT NULL,
  `public_id` varchar(255) DEFAULT NULL,
  `uploaded_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `gift_logs`
--

CREATE TABLE `gift_logs` (
  `id` int(10) UNSIGNED NOT NULL,
  `student_id` int(10) UNSIGNED NOT NULL,
  `item_id` int(10) UNSIGNED NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `given_by` int(10) UNSIGNED DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hoec_ec_assignments`
--

CREATE TABLE `hoec_ec_assignments` (
  `id` int(10) UNSIGNED NOT NULL,
  `hoec_id` int(10) UNSIGNED NOT NULL,
  `ec_id` int(10) UNSIGNED NOT NULL,
  `branch_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `leads`
--

CREATE TABLE `leads` (
  `id` int(10) UNSIGNED NOT NULL,
  `branch_id` int(10) UNSIGNED NOT NULL,
  `code` varchar(30) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `customer_phone` varchar(20) NOT NULL,
  `customer_email` varchar(100) DEFAULT NULL,
  `student_name` varchar(100) NOT NULL,
  `student_birth_year` int(11) DEFAULT NULL,
  `subject_id` int(10) UNSIGNED DEFAULT NULL,
  `level_id` int(10) UNSIGNED DEFAULT NULL,
  `source` varchar(50) DEFAULT 'facebook',
  `status` enum('new','scheduled','attended','waiting','trial','converted','cancelled','no_show') DEFAULT 'new',
  `scheduled_date` date DEFAULT NULL,
  `scheduled_time` time DEFAULT NULL,
  `trial_class_id` int(10) UNSIGNED DEFAULT NULL,
  `trial_sessions_max` int(11) DEFAULT 3,
  `trial_sessions_attended` int(11) DEFAULT 0,
  `converted_student_id` int(10) UNSIGNED DEFAULT NULL,
  `converted_at` datetime DEFAULT NULL,
  `fee_total` decimal(15,2) DEFAULT 0.00,
  `actual_revenue` decimal(15,2) DEFAULT 0.00,
  `deposit_amount` decimal(15,2) DEFAULT 0.00,
  `rating` tinyint(4) DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `note` text DEFAULT NULL,
  `sale_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `expected_revenue` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `leads`
--

INSERT INTO `leads` (`id`, `branch_id`, `code`, `customer_name`, `customer_phone`, `customer_email`, `student_name`, `student_birth_year`, `subject_id`, `level_id`, `source`, `status`, `scheduled_date`, `scheduled_time`, `trial_class_id`, `trial_sessions_max`, `trial_sessions_attended`, `converted_student_id`, `converted_at`, `fee_total`, `actual_revenue`, `deposit_amount`, `rating`, `feedback`, `note`, `sale_id`, `created_at`, `updated_at`, `expected_revenue`) VALUES
(1, 1, 'TH-LLQ-00001', 'Lê Thị Duyên', '0123456787', 'thaoanh@classflow.vn', 'Lê Việt Quang', 2016, 2, NULL, 'facebook', 'converted', '2026-01-02', '09:00:00', NULL, 3, 1, 1, '2026-01-01 21:45:35', 9600000.00, 0.00, 0.00, NULL, NULL, NULL, 1, '2026-01-01 14:41:40', '2026-01-01 14:45:35', '0'),
(2, 1, 'TH-LLQ-00002', 'Lê Thị Duyên', '0123456781', 'thaoanh@classflow.vn', 'Lê Việt Quang', 2016, 2, NULL, 'facebook', 'converted', '2026-01-03', '09:00:00', NULL, 3, 0, 2, '2026-01-02 09:45:08', 12600000.00, 0.00, 0.00, NULL, NULL, NULL, 1, '2026-01-02 02:44:26', '2026-01-02 02:45:08', '0'),
(3, 1, 'TH-LLQ-00003', 'Lê Thị Duyên', '0123456782', 'thaoanh@classflow.vn', 'Lê Việt Quang', 2016, 2, NULL, 'facebook', 'converted', '2026-01-03', '09:00:00', NULL, 3, 0, 3, '2026-01-02 10:12:17', 16800000.00, 0.00, 0.00, NULL, NULL, NULL, 1, '2026-01-02 03:11:39', '2026-01-02 03:12:17', '0');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lead_call_logs`
--

CREATE TABLE `lead_call_logs` (
  `id` int(10) UNSIGNED NOT NULL,
  `lead_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED DEFAULT NULL,
  `duration` int(11) DEFAULT 0,
  `result` varchar(50) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `called_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lead_promotions`
--

CREATE TABLE `lead_promotions` (
  `id` int(10) UNSIGNED NOT NULL,
  `lead_id` int(10) UNSIGNED NOT NULL,
  `program_id` int(10) UNSIGNED DEFAULT NULL,
  `program_discount` decimal(15,2) DEFAULT 0.00,
  `extra_discount` decimal(15,2) DEFAULT 0.00,
  `extra_discount_reason` text DEFAULT NULL,
  `extra_discount_status` enum('pending','approved','rejected') DEFAULT NULL,
  `total_discount` decimal(15,2) DEFAULT 0.00,
  `approved_by` int(10) UNSIGNED DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lead_promotion_gifts`
--

CREATE TABLE `lead_promotion_gifts` (
  `id` int(10) UNSIGNED NOT NULL,
  `lead_id` int(10) UNSIGNED NOT NULL,
  `item_id` int(10) UNSIGNED DEFAULT NULL,
  `scholarship_id` int(10) UNSIGNED DEFAULT NULL,
  `quantity` int(11) DEFAULT 1,
  `delivery_condition` enum('immediate','on_paid','on_completed') DEFAULT 'immediate',
  `delivery_status` enum('pending','delivered','returned') DEFAULT 'pending',
  `delivered_at` datetime DEFAULT NULL,
  `delivered_by` int(10) UNSIGNED DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `levels`
--

CREATE TABLE `levels` (
  `id` int(10) UNSIGNED NOT NULL,
  `subject_id` int(10) UNSIGNED DEFAULT NULL,
  `code` varchar(20) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `order_index` int(11) DEFAULT 0,
  `sessions_required` int(11) DEFAULT 15,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `levels`
--

INSERT INTO `levels` (`id`, `subject_id`, `code`, `name`, `order_index`, `sessions_required`, `description`, `created_at`) VALUES
(1, 1, 'lv1', 'Level 1', 1, 1, NULL, '2026-01-01 14:48:44');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `type` varchar(50) DEFAULT 'info',
  `link` varchar(500) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `packages`
--

CREATE TABLE `packages` (
  `id` int(10) UNSIGNED NOT NULL,
  `code` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `months` int(11) NOT NULL DEFAULT 1,
  `sessions_per_week` int(11) DEFAULT 2,
  `sessions_count` int(11) NOT NULL DEFAULT 8,
  `base_price` decimal(15,2) NOT NULL DEFAULT 0.00,
  `default_scholarship_months` int(11) DEFAULT 0,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `packages`
--

INSERT INTO `packages` (`id`, `code`, `name`, `months`, `sessions_per_week`, `sessions_count`, `base_price`, `default_scholarship_months`, `description`, `is_active`, `created_by`, `created_at`, `updated_at`) VALUES
(1, '1M-2B', 'Gói 1 tháng (2 buổi/tuần)', 1, 2, 8, 1900000.00, 0, NULL, 1, NULL, '2026-01-01 14:34:45', '2026-01-01 14:34:45'),
(2, '3M-2B', 'Gói 3 tháng (2 buổi/tuần)', 3, 2, 24, 5400000.00, 1, NULL, 1, NULL, '2026-01-01 14:34:45', '2026-01-01 14:34:45'),
(3, '6M-2B', 'Gói 6 tháng (2 buổi/tuần)', 6, 2, 48, 9600000.00, 1, NULL, 1, NULL, '2026-01-01 14:34:45', '2026-01-01 14:34:45'),
(4, '12M-2B', 'Gói 12 tháng (2 buổi/tuần)', 12, 2, 96, 16800000.00, 2, NULL, 1, NULL, '2026-01-01 14:34:45', '2026-01-01 14:34:45'),
(5, '1M-3B', 'Gói 1 tháng (3 buổi/tuần)', 1, 3, 12, 2700000.00, 0, NULL, 1, NULL, '2026-01-01 14:34:45', '2026-01-01 14:34:45'),
(6, '3M-3B', 'Gói 3 tháng (3 buổi/tuần)', 3, 3, 36, 7200000.00, 1, NULL, 1, NULL, '2026-01-01 14:34:45', '2026-01-01 14:34:45'),
(7, '6M-3B', 'Gói 6 tháng (3 buổi/tuần)', 6, 3, 72, 12600000.00, 1, NULL, 1, NULL, '2026-01-01 14:34:45', '2026-01-01 14:34:45');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payments`
--

CREATE TABLE `payments` (
  `id` int(10) UNSIGNED NOT NULL,
  `branch_id` int(10) UNSIGNED NOT NULL,
  `student_id` int(10) UNSIGNED DEFAULT NULL,
  `lead_id` int(10) UNSIGNED DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `payment_type` varchar(50) DEFAULT 'tuition',
  `payment_method` varchar(50) DEFAULT 'cash',
  `proof_url` varchar(500) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `received_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `permissions`
--

CREATE TABLE `permissions` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `display_name` varchar(200) DEFAULT NULL,
  `module` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `display_name`, `module`, `description`, `created_at`) VALUES
(1, 'leads.view', 'Xem leads', 'leads', NULL, '2026-01-01 14:34:45'),
(2, 'leads.create', 'Tạo lead', 'leads', NULL, '2026-01-01 14:34:45'),
(3, 'leads.edit', 'Sửa lead', 'leads', NULL, '2026-01-01 14:34:45'),
(4, 'leads.delete', 'Xóa lead', 'leads', NULL, '2026-01-01 14:34:45'),
(5, 'leads.convert', 'Chuyển đổi lead', 'leads', NULL, '2026-01-01 14:34:45'),
(6, 'students.view', 'Xem học sinh', 'students', NULL, '2026-01-01 14:34:45'),
(7, 'students.create', 'Tạo học sinh', 'students', NULL, '2026-01-01 14:34:45'),
(8, 'students.edit', 'Sửa học sinh', 'students', NULL, '2026-01-01 14:34:45'),
(9, 'students.delete', 'Xóa học sinh', 'students', NULL, '2026-01-01 14:34:45'),
(10, 'students.payment', 'Xác nhận thanh toán', 'students', NULL, '2026-01-01 14:34:45'),
(11, 'classes.view', 'Xem lớp học', 'classes', NULL, '2026-01-01 14:34:45'),
(12, 'classes.create', 'Tạo lớp học', 'classes', NULL, '2026-01-01 14:34:45'),
(13, 'classes.edit', 'Sửa lớp học', 'classes', NULL, '2026-01-01 14:34:45'),
(14, 'classes.delete', 'Xóa lớp học', 'classes', NULL, '2026-01-01 14:34:45'),
(15, 'attendance.view', 'Xem điểm danh', 'attendance', NULL, '2026-01-01 14:34:45'),
(16, 'attendance.checkin', 'Điểm danh', 'attendance', NULL, '2026-01-01 14:34:45'),
(17, 'reports.view', 'Xem báo cáo', 'reports', NULL, '2026-01-01 14:34:45'),
(18, 'reports.export', 'Xuất báo cáo', 'reports', NULL, '2026-01-01 14:34:45'),
(19, 'users.view', 'Xem users', 'users', NULL, '2026-01-01 14:34:45'),
(20, 'users.create', 'Tạo user', 'users', NULL, '2026-01-01 14:34:45'),
(21, 'users.edit', 'Sửa user', 'users', NULL, '2026-01-01 14:34:45'),
(22, 'users.delete', 'Xóa user', 'users', NULL, '2026-01-01 14:34:45'),
(23, 'settings.view', 'Xem cài đặt', 'settings', NULL, '2026-01-01 14:34:45'),
(24, 'settings.edit', 'Sửa cài đặt', 'settings', NULL, '2026-01-01 14:34:45');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `promotion_items`
--

CREATE TABLE `promotion_items` (
  `id` int(10) UNSIGNED NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  `category` varchar(50) DEFAULT 'gift',
  `description` text DEFAULT NULL,
  `unit` varchar(20) DEFAULT 'cái',
  `stock_quantity` int(11) DEFAULT 0,
  `given_quantity` int(11) DEFAULT 0,
  `min_stock` int(11) DEFAULT 5,
  `image_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `promotion_item_stocks`
--

CREATE TABLE `promotion_item_stocks` (
  `id` int(10) UNSIGNED NOT NULL,
  `item_id` int(10) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL,
  `type` enum('in','out') NOT NULL,
  `note` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `promotion_programs`
--

CREATE TABLE `promotion_programs` (
  `id` int(10) UNSIGNED NOT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `discount_type` enum('percent','amount') DEFAULT 'percent',
  `discount_value` decimal(15,2) DEFAULT 0.00,
  `max_discount` decimal(15,2) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `requires_approval` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `promotion_scholarships`
--

CREATE TABLE `promotion_scholarships` (
  `id` int(10) UNSIGNED NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  `subject_id` int(10) UNSIGNED DEFAULT NULL,
  `months` int(11) DEFAULT 1,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `revenues`
--

CREATE TABLE `revenues` (
  `id` int(10) UNSIGNED NOT NULL,
  `branch_id` int(10) UNSIGNED NOT NULL,
  `student_id` int(10) UNSIGNED DEFAULT NULL,
  `lead_id` int(10) UNSIGNED DEFAULT NULL,
  `ec_id` int(10) UNSIGNED DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `type` varchar(50) DEFAULT 'tuition',
  `payment_method` varchar(50) DEFAULT 'cash',
  `proof_url` varchar(500) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `revenues`
--

INSERT INTO `revenues` (`id`, `branch_id`, `student_id`, `lead_id`, `ec_id`, `amount`, `type`, `payment_method`, `proof_url`, `note`, `created_at`, `updated_at`) VALUES
(1, 1, 1, NULL, 1, 9600000.00, 'tuition', 'bank_transfer', NULL, 'Thanh toán qua QR sau chuyển đổi', '2026-01-01 14:45:53', '2026-01-01 14:45:53'),
(2, 1, 2, NULL, 1, 1000000.00, 'tuition', 'cash', NULL, 'Tiền cọc khi convert', '2026-01-02 02:45:08', '2026-01-02 02:45:08'),
(3, 1, 3, NULL, 1, 1000000.00, 'tuition', 'cash', NULL, 'Tiền cọc khi convert', '2026-01-02 03:12:17', '2026-01-02 03:12:17'),
(4, 1, 3, NULL, 1, 1000000.00, 'tuition', 'bank_transfer', NULL, 'Thanh toán qua QR', '2026-01-02 03:12:26', '2026-01-02 03:12:26');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `roles`
--

CREATE TABLE `roles` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `display_name` varchar(100) DEFAULT NULL,
  `permissions` text DEFAULT NULL,
  `is_system_wide` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `roles`
--

INSERT INTO `roles` (`id`, `name`, `display_name`, `permissions`, `is_system_wide`, `created_at`) VALUES
(1, 'ADMIN', 'Quản trị viên', NULL, 1, '2026-01-01 14:34:45'),
(2, 'GDV', 'Giám đốc vùng', NULL, 1, '2026-01-01 14:34:45'),
(3, 'CHU', 'Chủ cơ sở', NULL, 1, '2026-01-01 14:34:45'),
(4, 'QLCS', 'Quản lý cơ sở', NULL, 0, '2026-01-01 14:34:45'),
(5, 'HOEC', 'Trưởng EC', NULL, 0, '2026-01-01 14:34:45'),
(6, 'OM', 'Trưởng vận hành', NULL, 0, '2026-01-01 14:34:45'),
(7, 'CM', 'Quản lý lớp', NULL, 0, '2026-01-01 14:34:45'),
(8, 'EC', 'Tư vấn viên', NULL, 0, '2026-01-01 14:34:45'),
(9, 'TEACHER', 'Giáo viên', NULL, 0, '2026-01-01 14:34:45'),
(10, 'TA', 'Trợ giảng', NULL, 0, '2026-01-01 14:34:45');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `role_permissions`
--

CREATE TABLE `role_permissions` (
  `id` int(10) UNSIGNED NOT NULL,
  `role_id` int(10) UNSIGNED NOT NULL,
  `permission_id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `role_permissions`
--

INSERT INTO `role_permissions` (`id`, `role_id`, `permission_id`, `created_at`) VALUES
(1, 1, 16, '2026-01-01 14:34:45'),
(2, 1, 15, '2026-01-01 14:34:45'),
(3, 1, 12, '2026-01-01 14:34:45'),
(4, 1, 14, '2026-01-01 14:34:45'),
(5, 1, 13, '2026-01-01 14:34:45'),
(6, 1, 11, '2026-01-01 14:34:45'),
(7, 1, 5, '2026-01-01 14:34:45'),
(8, 1, 2, '2026-01-01 14:34:45'),
(9, 1, 4, '2026-01-01 14:34:45'),
(10, 1, 3, '2026-01-01 14:34:45'),
(11, 1, 1, '2026-01-01 14:34:45'),
(12, 1, 18, '2026-01-01 14:34:45'),
(13, 1, 17, '2026-01-01 14:34:45'),
(14, 1, 24, '2026-01-01 14:34:45'),
(15, 1, 23, '2026-01-01 14:34:45'),
(16, 1, 7, '2026-01-01 14:34:45'),
(17, 1, 9, '2026-01-01 14:34:45'),
(18, 1, 8, '2026-01-01 14:34:45'),
(19, 1, 10, '2026-01-01 14:34:45'),
(20, 1, 6, '2026-01-01 14:34:45'),
(21, 1, 20, '2026-01-01 14:34:45'),
(22, 1, 22, '2026-01-01 14:34:45'),
(23, 1, 21, '2026-01-01 14:34:45'),
(24, 1, 19, '2026-01-01 14:34:45');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sale_reports`
--

CREATE TABLE `sale_reports` (
  `id` int(10) UNSIGNED NOT NULL,
  `ec_id` int(10) UNSIGNED NOT NULL,
  `branch_id` int(10) UNSIGNED DEFAULT NULL,
  `student_id` int(10) UNSIGNED DEFAULT NULL,
  `package_id` int(10) UNSIGNED DEFAULT NULL,
  `report_month` date NOT NULL,
  `checkin_count` int(11) DEFAULT 0,
  `revenue` decimal(15,2) DEFAULT 0.00,
  `deposit_total` decimal(15,2) DEFAULT 0.00,
  `expected_revenue` decimal(15,2) DEFAULT 0.00,
  `leads_converted` int(11) DEFAULT 0,
  `kpi_target` decimal(15,2) DEFAULT 0.00,
  `kpi_percent` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sessions`
--

CREATE TABLE `sessions` (
  `id` int(10) UNSIGNED NOT NULL,
  `class_id` int(10) UNSIGNED NOT NULL,
  `session_number` int(11) DEFAULT 1,
  `session_date` date NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `teacher_id` int(10) UNSIGNED DEFAULT NULL,
  `ta_id` int(10) UNSIGNED DEFAULT NULL,
  `substitute_teacher_id` int(10) UNSIGNED DEFAULT NULL,
  `topic` varchar(200) DEFAULT NULL,
  `status` enum('scheduled','completed','cancelled') DEFAULT 'scheduled',
  `attendance_submitted` tinyint(1) DEFAULT 0,
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `sessions`
--

INSERT INTO `sessions` (`id`, `class_id`, `session_number`, `session_date`, `start_time`, `end_time`, `teacher_id`, `ta_id`, `substitute_teacher_id`, `topic`, `status`, `attendance_submitted`, `note`, `created_at`) VALUES
(1, 1, 1, '2026-01-01', '23:53:00', '18:53:00', 2, NULL, NULL, NULL, 'scheduled', 0, NULL, '2026-01-01 14:54:50'),
(2, 1, 2, '2026-01-08', '23:53:00', '18:53:00', 2, NULL, NULL, NULL, 'scheduled', 0, NULL, '2026-01-01 14:54:50'),
(3, 1, 3, '2026-01-15', '23:53:00', '18:53:00', 2, NULL, NULL, NULL, 'scheduled', 0, NULL, '2026-01-01 14:54:50'),
(4, 1, 4, '2026-01-22', '23:53:00', '18:53:00', 2, NULL, NULL, NULL, 'scheduled', 0, NULL, '2026-01-01 14:54:50'),
(5, 1, 5, '2026-01-29', '23:53:00', '18:53:00', 2, NULL, NULL, NULL, 'scheduled', 0, NULL, '2026-01-01 14:54:50'),
(6, 1, 6, '2026-02-05', '23:53:00', '18:53:00', 2, NULL, NULL, NULL, 'scheduled', 0, NULL, '2026-01-01 14:54:50'),
(7, 1, 7, '2026-02-12', '23:53:00', '18:53:00', 2, NULL, NULL, NULL, 'scheduled', 0, NULL, '2026-01-01 14:54:50'),
(8, 1, 8, '2026-02-19', '23:53:00', '18:53:00', 2, NULL, NULL, NULL, 'scheduled', 0, NULL, '2026-01-01 14:54:50'),
(9, 1, 9, '2026-02-26', '23:53:00', '18:53:00', 2, NULL, NULL, NULL, 'scheduled', 0, NULL, '2026-01-01 14:54:50'),
(10, 1, 10, '2026-03-05', '23:53:00', '18:53:00', 2, NULL, NULL, NULL, 'scheduled', 0, NULL, '2026-01-01 14:54:50'),
(11, 1, 11, '2026-03-12', '23:53:00', '18:53:00', 2, NULL, NULL, NULL, 'scheduled', 0, NULL, '2026-01-01 14:54:50'),
(12, 1, 12, '2026-03-19', '23:53:00', '18:53:00', 2, NULL, NULL, NULL, 'scheduled', 0, NULL, '2026-01-01 14:54:50'),
(13, 1, 13, '2026-03-26', '23:53:00', '18:53:00', 2, NULL, NULL, NULL, 'scheduled', 0, NULL, '2026-01-01 14:54:50'),
(14, 1, 14, '2026-04-02', '23:53:00', '18:53:00', 2, NULL, NULL, NULL, 'scheduled', 0, NULL, '2026-01-01 14:54:50'),
(15, 1, 15, '2026-04-09', '23:53:00', '18:53:00', 2, NULL, NULL, NULL, 'scheduled', 0, NULL, '2026-01-01 14:54:50');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `session_feedbacks`
--

CREATE TABLE `session_feedbacks` (
  `id` int(10) UNSIGNED NOT NULL,
  `session_id` int(10) UNSIGNED NOT NULL,
  `student_id` int(10) UNSIGNED NOT NULL,
  `rating` tinyint(4) DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `homework_assigned` tinyint(1) DEFAULT 0,
  `parent_notified` tinyint(1) DEFAULT 0,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `settings`
--

CREATE TABLE `settings` (
  `id` int(10) UNSIGNED NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `settings`
--

INSERT INTO `settings` (`id`, `setting_key`, `setting_value`, `description`, `updated_at`) VALUES
(1, 'default_scholarship_months', '1', 'Số tháng học bổng mặc định', '2026-01-01 14:34:45'),
(2, 'attendance_window_minutes', '30', 'Thời gian cho phép điểm danh', '2026-01-01 14:34:45'),
(3, 'trial_sessions_max', '3', 'Số buổi học thử tối đa', '2026-01-01 14:34:45');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `students`
--

CREATE TABLE `students` (
  `id` int(10) UNSIGNED NOT NULL,
  `branch_id` int(10) UNSIGNED NOT NULL,
  `student_code` varchar(30) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `birth_year` int(11) DEFAULT NULL,
  `gender` enum('male','female') DEFAULT NULL,
  `school` varchar(200) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `avatar_url` varchar(500) DEFAULT NULL,
  `parent_name` varchar(100) DEFAULT NULL,
  `parent_phone` varchar(20) DEFAULT NULL,
  `parent_email` varchar(100) DEFAULT NULL,
  `parent_job` varchar(100) DEFAULT NULL,
  `subject_id` int(10) UNSIGNED DEFAULT NULL,
  `level_id` int(10) UNSIGNED DEFAULT NULL,
  `current_level_id` int(10) UNSIGNED DEFAULT NULL,
  `level_sessions_completed` int(11) DEFAULT 0,
  `package_id` int(10) UNSIGNED DEFAULT NULL,
  `package_start_date` date DEFAULT NULL,
  `package_end_date` date DEFAULT NULL,
  `fee_original` decimal(15,2) DEFAULT 0.00,
  `fee_discount` decimal(15,2) DEFAULT 0.00,
  `fee_total` decimal(15,2) DEFAULT 0.00,
  `deposit_amount` decimal(15,2) DEFAULT 0.00,
  `actual_revenue` decimal(15,2) DEFAULT 0.00,
  `fee_status` enum('pending','partial','paid','active','expiring_soon','expired') DEFAULT 'pending',
  `payment_status` enum('pending','partial','paid') DEFAULT 'pending',
  `total_sessions` int(11) DEFAULT 0,
  `used_sessions` int(11) DEFAULT 0,
  `remaining_sessions` int(11) DEFAULT 0,
  `scholarship_months` int(11) DEFAULT 0,
  `scholarship_sessions` int(11) DEFAULT 0,
  `status` enum('pending','waiting','active','paused','expired','quit_paid','quit_refund','reserved','inactive','graduated','dropped') DEFAULT 'pending',
  `status_changed_at` timestamp NULL DEFAULT NULL,
  `status_reason` text DEFAULT NULL,
  `reserve_until` date DEFAULT NULL,
  `expected_return_date` date DEFAULT NULL,
  `refund_amount` decimal(15,2) DEFAULT 0.00,
  `sale_id` int(10) UNSIGNED DEFAULT NULL,
  `ec_id` int(10) UNSIGNED DEFAULT NULL,
  `assigned_ec` int(10) UNSIGNED DEFAULT NULL,
  `gifts` text DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `sessions_per_week` text NOT NULL,
  `start_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `students`
--

INSERT INTO `students` (`id`, `branch_id`, `student_code`, `full_name`, `birth_year`, `gender`, `school`, `address`, `avatar_url`, `parent_name`, `parent_phone`, `parent_email`, `parent_job`, `subject_id`, `level_id`, `current_level_id`, `level_sessions_completed`, `package_id`, `package_start_date`, `package_end_date`, `fee_original`, `fee_discount`, `fee_total`, `deposit_amount`, `actual_revenue`, `fee_status`, `payment_status`, `total_sessions`, `used_sessions`, `remaining_sessions`, `scholarship_months`, `scholarship_sessions`, `status`, `status_changed_at`, `status_reason`, `reserve_until`, `expected_return_date`, `refund_amount`, `sale_id`, `ec_id`, `assigned_ec`, `gifts`, `note`, `created_at`, `updated_at`, `sessions_per_week`, `start_date`) VALUES
(1, 1, 'TH-LLQ-MJVK4NND', 'Lê Việt Quang', 2016, NULL, 'thcs avc', '160 llq', NULL, 'Lê Thị Duyên', '0123456787', 'thaoanh@classflow.vn', 'Kinh doanh', 2, NULL, NULL, 0, 3, NULL, NULL, 9600000.00, 0.00, 9600000.00, 1000000.00, 9600000.00, 'paid', 'pending', 0, 0, 0, 1, 0, 'active', NULL, NULL, NULL, NULL, 0.00, 1, NULL, NULL, '', NULL, '2026-01-01 14:45:35', '2026-01-01 14:55:09', '2', NULL),
(2, 1, 'TH-LLQ-MJW9TZYD', 'Lê Việt Quang', 2016, NULL, 'thcs avc', '160 llq', NULL, 'Lê Thị Duyên', '0123456781', 'thaoanh@classflow.vn', 'Kinh doanh', 2, NULL, NULL, 0, 7, NULL, NULL, 12600000.00, 0.00, 12600000.00, 1000000.00, 1000000.00, 'partial', 'partial', 0, 0, 0, 1, 0, 'pending', NULL, NULL, NULL, NULL, 0.00, 1, NULL, NULL, '', NULL, '2026-01-02 02:45:08', '2026-01-02 02:45:08', '2', NULL),
(3, 1, 'TH-LLQ-MJWASX1Y', 'Lê Việt Quang', 2016, NULL, 'thcs avc', '160 llq', NULL, 'Lê Thị Duyên', '0123456782', 'thaoanh@classflow.vn', 'Kinh doanh', 2, NULL, NULL, 0, 4, NULL, NULL, 16800000.00, 0.00, 16800000.00, 1000000.00, 2000000.00, 'partial', 'partial', 0, 0, 0, 2, 0, 'pending', NULL, NULL, NULL, NULL, 0.00, 1, NULL, NULL, '', NULL, '2026-01-02 03:12:17', '2026-01-02 03:12:26', '2', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `student_documents`
--

CREATE TABLE `student_documents` (
  `id` int(10) UNSIGNED NOT NULL,
  `student_id` int(10) UNSIGNED NOT NULL,
  `document_type` varchar(50) DEFAULT 'other',
  `file_name` varchar(255) DEFAULT NULL,
  `file_url` varchar(500) DEFAULT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `file_size` int(11) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `uploaded_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `student_level_history`
--

CREATE TABLE `student_level_history` (
  `id` int(10) UNSIGNED NOT NULL,
  `student_id` int(10) UNSIGNED NOT NULL,
  `level_id` int(10) UNSIGNED NOT NULL,
  `started_at` date DEFAULT NULL,
  `completed_at` date DEFAULT NULL,
  `sessions_completed` int(11) DEFAULT 0,
  `status` enum('in_progress','completed','skipped') DEFAULT 'in_progress',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `student_renewals`
--

CREATE TABLE `student_renewals` (
  `id` int(10) UNSIGNED NOT NULL,
  `student_id` int(10) UNSIGNED NOT NULL,
  `package_id` int(10) UNSIGNED NOT NULL,
  `branch_id` int(10) UNSIGNED DEFAULT NULL,
  `ec_id` int(10) UNSIGNED DEFAULT NULL,
  `sessions_added` int(11) DEFAULT 0,
  `scholarship_months` int(11) DEFAULT 0,
  `scholarship_sessions` int(11) DEFAULT 0,
  `package_price` decimal(15,2) DEFAULT 0.00,
  `discount_amount` decimal(15,2) DEFAULT 0.00,
  `final_price` decimal(15,2) DEFAULT 0.00,
  `deposit_amount` decimal(15,2) DEFAULT 0.00,
  `paid_amount` decimal(15,2) DEFAULT 0.00,
  `remaining_amount` decimal(15,2) DEFAULT 0.00,
  `status` enum('pending','deposited','paid','cancelled') DEFAULT 'pending',
  `payment_date` date DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `student_status_logs`
--

CREATE TABLE `student_status_logs` (
  `id` int(10) UNSIGNED NOT NULL,
  `student_id` int(10) UNSIGNED NOT NULL,
  `old_status` varchar(50) DEFAULT NULL,
  `new_status` varchar(50) DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `changed_by` int(10) UNSIGNED DEFAULT NULL,
  `changed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `subjects`
--

CREATE TABLE `subjects` (
  `id` int(10) UNSIGNED NOT NULL,
  `code` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `subjects`
--

INSERT INTO `subjects` (`id`, `code`, `name`, `description`, `is_active`, `created_at`) VALUES
(1, 'STEM', 'STEM & Robotics', NULL, 1, '2026-01-01 14:34:45'),
(2, 'CODE', 'Lập trình', NULL, 1, '2026-01-01 14:34:45');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `trial_class_students`
--

CREATE TABLE `trial_class_students` (
  `id` int(10) UNSIGNED NOT NULL,
  `trial_student_id` int(10) UNSIGNED NOT NULL,
  `class_id` int(10) UNSIGNED NOT NULL,
  `attended_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `trial_students`
--

CREATE TABLE `trial_students` (
  `id` int(10) UNSIGNED NOT NULL,
  `branch_id` int(10) UNSIGNED NOT NULL,
  `code` varchar(30) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `parent_phone` varchar(20) DEFAULT NULL,
  `experience_id` int(10) UNSIGNED DEFAULT NULL,
  `subject_id` int(10) UNSIGNED DEFAULT NULL,
  `level_id` int(10) UNSIGNED DEFAULT NULL,
  `sale_id` int(10) UNSIGNED DEFAULT NULL,
  `status` enum('trial','converted','cancelled') DEFAULT 'trial',
  `trial_sessions` int(11) DEFAULT 0,
  `max_trial_sessions` int(11) DEFAULT 3,
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tuition_packages`
--

CREATE TABLE `tuition_packages` (
  `id` int(10) UNSIGNED NOT NULL,
  `subject_id` int(10) UNSIGNED DEFAULT NULL,
  `level_id` int(10) UNSIGNED DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `sessions_per_week` int(11) DEFAULT 2,
  `total_sessions` int(11) DEFAULT 8,
  `price` decimal(15,2) DEFAULT 0.00,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role_id` int(10) UNSIGNED DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `full_name`, `email`, `phone`, `role_id`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'admin', '$2a$10$0hniKjjVsEbYYX1AlPyHGuYAvlqoWVa.01zy7FMz7gOTSBMuZNZFC', 'Administrator', 'admin@army.edu.vn', NULL, 1, 1, '2026-01-01 14:34:45', '2026-01-01 14:35:14'),
(2, 'quanglv', '$2a$10$zr484QyXlvXwVWB9B6tf8.zpaJCB3P6XgtZQL7yaH9Ovz62/R53by', 'Lê Việt Quang', 'le610200@gmail.com', NULL, 9, 1, '2026-01-01 14:49:30', '2026-01-01 14:49:30'),
(3, 'ltanh', '$2a$10$eiDDq.EwdvNpJ94Ge41ohuAejZ6K8EGL7xEqKWiwq/zWmcj63gmJe', 'Lê Thảo Anh', 'thaoanh@classflow.vn', NULL, 7, 1, '2026-01-01 14:49:55', '2026-01-01 14:49:55');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_branches`
--

CREATE TABLE `user_branches` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `branch_id` int(10) UNSIGNED NOT NULL,
  `is_primary` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `user_branches`
--

INSERT INTO `user_branches` (`id`, `user_id`, `branch_id`, `is_primary`, `created_at`) VALUES
(1, 1, 1, 1, '2026-01-01 14:34:45'),
(2, 2, 1, 1, '2026-01-01 14:49:30'),
(3, 3, 1, 1, '2026-01-01 14:49:55');

-- --------------------------------------------------------

--
-- Cấu trúc đóng vai cho view `v_branch_stats`
-- (See below for the actual view)
--
CREATE TABLE `v_branch_stats` (
`id` int(10) unsigned
,`code` varchar(20)
,`name` varchar(100)
,`active_students` bigint(21)
,`active_classes` bigint(21)
,`pending_leads` bigint(21)
);

-- --------------------------------------------------------

--
-- Cấu trúc cho view `v_branch_stats`
--
DROP TABLE IF EXISTS `v_branch_stats`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_branch_stats`  AS SELECT `b`.`id` AS `id`, `b`.`code` AS `code`, `b`.`name` AS `name`, (select count(0) from `students` `s` where `s`.`branch_id` = `b`.`id` and `s`.`status` = 'active') AS `active_students`, (select count(0) from `classes` `c` where `c`.`branch_id` = `b`.`id` and `c`.`status` = 'active') AS `active_classes`, (select count(0) from `leads` `l` where `l`.`branch_id` = `b`.`id` and `l`.`status` not in ('converted','cancelled')) AS `pending_leads` FROM `branches` AS `b` WHERE `b`.`is_active` = 1 ;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_entity` (`entity_type`,`entity_id`),
  ADD KEY `idx_date` (`created_at`);

--
-- Chỉ mục cho bảng `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_class` (`class_id`),
  ADD KEY `idx_session` (`session_id`);

--
-- Chỉ mục cho bảng `assignment_submissions`
--
ALTER TABLE `assignment_submissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_assign_student` (`assignment_id`,`student_id`),
  ADD KEY `idx_assignment` (`assignment_id`),
  ADD KEY `idx_student` (`student_id`);

--
-- Chỉ mục cho bảng `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_session_student` (`session_id`,`student_id`),
  ADD KEY `idx_session` (`session_id`),
  ADD KEY `idx_student` (`student_id`);

--
-- Chỉ mục cho bảng `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `idx_active` (`is_active`);

--
-- Chỉ mục cho bảng `branch_packages`
--
ALTER TABLE `branch_packages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_branch_package` (`branch_id`,`package_id`),
  ADD KEY `idx_branch` (`branch_id`),
  ADD KEY `idx_package` (`package_id`);

--
-- Chỉ mục cho bảng `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `class_code` (`class_code`),
  ADD KEY `idx_branch` (`branch_id`),
  ADD KEY `idx_subject` (`subject_id`),
  ADD KEY `idx_teacher` (`teacher_id`),
  ADD KEY `idx_status` (`status`);

--
-- Chỉ mục cho bảng `class_students`
--
ALTER TABLE `class_students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_class_student` (`class_id`,`student_id`),
  ADD KEY `idx_class` (`class_id`),
  ADD KEY `idx_student` (`student_id`);

--
-- Chỉ mục cho bảng `ec_kpi_targets`
--
ALTER TABLE `ec_kpi_targets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_ec_month` (`ec_id`,`target_month`),
  ADD KEY `idx_ec` (`ec_id`),
  ADD KEY `idx_month` (`target_month`);

--
-- Chỉ mục cho bảng `experience_schedules`
--
ALTER TABLE `experience_schedules`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `idx_branch` (`branch_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_date` (`scheduled_date`);

--
-- Chỉ mục cho bảng `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_uploaded_by` (`uploaded_by`);

--
-- Chỉ mục cho bảng `gift_logs`
--
ALTER TABLE `gift_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_student` (`student_id`),
  ADD KEY `idx_item` (`item_id`);

--
-- Chỉ mục cho bảng `hoec_ec_assignments`
--
ALTER TABLE `hoec_ec_assignments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_assignment` (`hoec_id`,`ec_id`),
  ADD KEY `idx_hoec` (`hoec_id`),
  ADD KEY `idx_ec` (`ec_id`);

--
-- Chỉ mục cho bảng `leads`
--
ALTER TABLE `leads`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `idx_branch` (`branch_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_sale` (`sale_id`),
  ADD KEY `idx_phone` (`customer_phone`),
  ADD KEY `idx_date` (`scheduled_date`);

--
-- Chỉ mục cho bảng `lead_call_logs`
--
ALTER TABLE `lead_call_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_lead` (`lead_id`);

--
-- Chỉ mục cho bảng `lead_promotions`
--
ALTER TABLE `lead_promotions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `lead_id` (`lead_id`),
  ADD KEY `idx_lead` (`lead_id`);

--
-- Chỉ mục cho bảng `lead_promotion_gifts`
--
ALTER TABLE `lead_promotion_gifts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_lead` (`lead_id`);

--
-- Chỉ mục cho bảng `levels`
--
ALTER TABLE `levels`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_subject` (`subject_id`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_read` (`is_read`);

--
-- Chỉ mục cho bảng `packages`
--
ALTER TABLE `packages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Chỉ mục cho bảng `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_branch` (`branch_id`),
  ADD KEY `idx_student` (`student_id`);

--
-- Chỉ mục cho bảng `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Chỉ mục cho bảng `promotion_items`
--
ALTER TABLE `promotion_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category` (`category`);

--
-- Chỉ mục cho bảng `promotion_item_stocks`
--
ALTER TABLE `promotion_item_stocks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_item` (`item_id`);

--
-- Chỉ mục cho bảng `promotion_programs`
--
ALTER TABLE `promotion_programs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Chỉ mục cho bảng `promotion_scholarships`
--
ALTER TABLE `promotion_scholarships`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `revenues`
--
ALTER TABLE `revenues`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_branch` (`branch_id`),
  ADD KEY `idx_student` (`student_id`),
  ADD KEY `idx_ec` (`ec_id`),
  ADD KEY `idx_date` (`created_at`),
  ADD KEY `idx_type` (`type`);

--
-- Chỉ mục cho bảng `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Chỉ mục cho bảng `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_role_permission` (`role_id`,`permission_id`),
  ADD KEY `idx_role` (`role_id`),
  ADD KEY `idx_permission` (`permission_id`);

--
-- Chỉ mục cho bảng `sale_reports`
--
ALTER TABLE `sale_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ec` (`ec_id`),
  ADD KEY `idx_month` (`report_month`),
  ADD KEY `idx_branch` (`branch_id`);

--
-- Chỉ mục cho bảng `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_class` (`class_id`),
  ADD KEY `idx_date` (`session_date`),
  ADD KEY `idx_status` (`status`);

--
-- Chỉ mục cho bảng `session_feedbacks`
--
ALTER TABLE `session_feedbacks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_session_student` (`session_id`,`student_id`),
  ADD KEY `idx_session` (`session_id`),
  ADD KEY `idx_student` (`student_id`);

--
-- Chỉ mục cho bảng `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`);

--
-- Chỉ mục cho bảng `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_code` (`student_code`),
  ADD KEY `idx_branch` (`branch_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_fee_status` (`fee_status`),
  ADD KEY `idx_sale` (`sale_id`),
  ADD KEY `idx_subject` (`subject_id`),
  ADD KEY `idx_package` (`package_id`);

--
-- Chỉ mục cho bảng `student_documents`
--
ALTER TABLE `student_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_student` (`student_id`);

--
-- Chỉ mục cho bảng `student_level_history`
--
ALTER TABLE `student_level_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_student` (`student_id`),
  ADD KEY `idx_level` (`level_id`);

--
-- Chỉ mục cho bảng `student_renewals`
--
ALTER TABLE `student_renewals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_student` (`student_id`);

--
-- Chỉ mục cho bảng `student_status_logs`
--
ALTER TABLE `student_status_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_student` (`student_id`);

--
-- Chỉ mục cho bảng `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Chỉ mục cho bảng `trial_class_students`
--
ALTER TABLE `trial_class_students`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_trial` (`trial_student_id`),
  ADD KEY `idx_class` (`class_id`);

--
-- Chỉ mục cho bảng `trial_students`
--
ALTER TABLE `trial_students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `idx_branch` (`branch_id`),
  ADD KEY `idx_status` (`status`);

--
-- Chỉ mục cho bảng `tuition_packages`
--
ALTER TABLE `tuition_packages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_subject` (`subject_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `idx_role` (`role_id`),
  ADD KEY `idx_active` (`is_active`);

--
-- Chỉ mục cho bảng `user_branches`
--
ALTER TABLE `user_branches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_branch` (`user_id`,`branch_id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_branch` (`branch_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `assignments`
--
ALTER TABLE `assignments`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `assignment_submissions`
--
ALTER TABLE `assignment_submissions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `branches`
--
ALTER TABLE `branches`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `branch_packages`
--
ALTER TABLE `branch_packages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `class_students`
--
ALTER TABLE `class_students`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `ec_kpi_targets`
--
ALTER TABLE `ec_kpi_targets`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `experience_schedules`
--
ALTER TABLE `experience_schedules`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `files`
--
ALTER TABLE `files`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `gift_logs`
--
ALTER TABLE `gift_logs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `hoec_ec_assignments`
--
ALTER TABLE `hoec_ec_assignments`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `leads`
--
ALTER TABLE `leads`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `lead_call_logs`
--
ALTER TABLE `lead_call_logs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `lead_promotions`
--
ALTER TABLE `lead_promotions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `lead_promotion_gifts`
--
ALTER TABLE `lead_promotion_gifts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `levels`
--
ALTER TABLE `levels`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `packages`
--
ALTER TABLE `packages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT cho bảng `promotion_items`
--
ALTER TABLE `promotion_items`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `promotion_item_stocks`
--
ALTER TABLE `promotion_item_stocks`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `promotion_programs`
--
ALTER TABLE `promotion_programs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `promotion_scholarships`
--
ALTER TABLE `promotion_scholarships`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `revenues`
--
ALTER TABLE `revenues`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `role_permissions`
--
ALTER TABLE `role_permissions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT cho bảng `sale_reports`
--
ALTER TABLE `sale_reports`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `session_feedbacks`
--
ALTER TABLE `session_feedbacks`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `students`
--
ALTER TABLE `students`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `student_documents`
--
ALTER TABLE `student_documents`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `student_level_history`
--
ALTER TABLE `student_level_history`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `student_renewals`
--
ALTER TABLE `student_renewals`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `student_status_logs`
--
ALTER TABLE `student_status_logs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `trial_class_students`
--
ALTER TABLE `trial_class_students`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `trial_students`
--
ALTER TABLE `trial_students`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `tuition_packages`
--
ALTER TABLE `tuition_packages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `user_branches`
--
ALTER TABLE `user_branches`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
