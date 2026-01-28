CREATE TABLE `guestbook` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `avatar` varchar(500) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip_address` varchar(45) DEFAULT NULL,
  `is_approved` tinyint(1) DEFAULT 1 COMMENT '是否审核通过',
  PRIMARY KEY (`id`),
  KEY `created_at` (`created_at`),
  KEY `is_approved` (`is_approved`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 管理员表（可选，用于管理留言）
CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入默认管理员（密码：admin123）
INSERT INTO `admin_users` (`username`, `password`) VALUES
('admin', '$2y$10$YourHashedPasswordHere');