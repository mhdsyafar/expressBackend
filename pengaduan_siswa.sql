-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 16, 2026 at 05:03 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pengaduan_siswa`
--

-- --------------------------------------------------------

--
-- Table structure for table `guru`
--

CREATE TABLE `guru` (
  `id_guru` int NOT NULL,
  `id_user` int NOT NULL,
  `nip` varchar(30) NOT NULL,
  `kelas` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `guru`
--

INSERT INTO `guru` (`id_guru`, `id_user`, `nip`, `kelas`) VALUES
(1, 5, '198501152010011001', '1'),
(2, 6, '198703222011012002', '2'),
(3, 7, '199005102013011003', '3'),
(4, 8, '198812082012012004', '4'),
(9, 24, '132425426262', '1b');

-- --------------------------------------------------------

--
-- Table structure for table `orangtua`
--

CREATE TABLE `orangtua` (
  `id_orangtua` int NOT NULL,
  `id_user` int NOT NULL,
  `id_siswa` int NOT NULL,
  `hubungan` enum('ayah','ibu','wali') NOT NULL,
  `kelas` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `orangtua`
--

INSERT INTO `orangtua` (`id_orangtua`, `id_user`, `id_siswa`, `hubungan`, `kelas`) VALUES
(17, 28, 1, 'ayah', '1b');

-- --------------------------------------------------------

--
-- Table structure for table `pengaduan`
--

CREATE TABLE `pengaduan` (
  `id_pengaduan` int NOT NULL,
  `id_orangtua` int NOT NULL,
  `judul_pengaduan` varchar(150) NOT NULL,
  `isi_pengaduan` text NOT NULL,
  `tanggal_pengaduan` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` enum('diajukan','diproses','selesai','ditolak') DEFAULT 'diajukan'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `pengaduan`
--

INSERT INTO `pengaduan` (`id_pengaduan`, `id_orangtua`, `judul_pengaduan`, `isi_pengaduan`, `tanggal_pengaduan`, `status`) VALUES
(37, 17, 'cbvjjfyu', '[Kategori: Akademik]\n\nfhghhvh', '2026-04-15 04:40:41', 'diproses'),
(38, 17, 'vdbdv', 'bdbdb', '2026-04-15 04:58:59', 'diajukan');

-- --------------------------------------------------------

--
-- Table structure for table `riwayat_status`
--

CREATE TABLE `riwayat_status` (
  `id_riwayat` int NOT NULL,
  `id_pengaduan` int NOT NULL,
  `status_lama` enum('diajukan','diproses','selesai','ditolak') DEFAULT NULL,
  `status_baru` enum('diajukan','diproses','selesai','ditolak') NOT NULL,
  `id_user` int NOT NULL,
  `waktu` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `riwayat_status`
--

INSERT INTO `riwayat_status` (`id_riwayat`, `id_pengaduan`, `status_lama`, `status_baru`, `id_user`, `waktu`) VALUES
(18, 37, NULL, 'diajukan', 28, '2026-04-15 04:40:41'),
(19, 37, 'diajukan', 'diproses', 24, '2026-04-15 04:43:53'),
(20, 38, NULL, 'diajukan', 28, '2026-04-15 04:58:59');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id_role` int NOT NULL,
  `nama_role` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id_role`, `nama_role`) VALUES
(1, 'admin'),
(2, 'guru'),
(3, 'orangtua'),
(4, 'kepsek');

-- --------------------------------------------------------

--
-- Table structure for table `siswa`
--

CREATE TABLE `siswa` (
  `id_siswa` int NOT NULL,
  `nama_siswa` varchar(100) NOT NULL,
  `kelas` varchar(10) NOT NULL,
  `tahun_ajaran` varchar(9) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `siswa`
--

INSERT INTO `siswa` (`id_siswa`, `nama_siswa`, `kelas`, `tahun_ajaran`, `created_at`) VALUES
(1, 'Muhammad Rizky Rahman', '2', '2025/2026', '2026-04-14 09:04:21'),
(2, 'Aisyah Zahra Rahman', '3', '2025/2026', '2026-04-14 09:04:21'),
(3, 'Farhan Dwi Putra', '1', '2025/2026', '2026-04-14 09:04:21'),
(4, 'Anisa Nur Fadillah', '4', '2025/2026', '2026-04-14 09:04:21'),
(5, 'Dimas Arya Basri', '5', '2025/2026', '2026-04-14 09:04:21'),
(6, 'Laila Nur Safitri', '6', '2025/2026', '2026-04-14 09:04:21'),
(7, 'Rafi Ahmad Hidayat', '6', '2025/2026', '2026-04-14 09:04:21'),
(8, 'Nadia Putri Aisyah', '1', '2025/2026', '2026-04-14 09:04:21'),
(9, 'Galang Surya Mulyadi', '2', '2025/2026', '2026-04-14 09:04:21'),
(10, 'Zahra Aulia Wahyuni', '3', '2025/2026', '2026-04-14 09:04:21'),
(11, 'Kevin Pratama', '4', '2025/2026', '2026-04-14 09:04:21'),
(12, 'Shafira Dwi Lestari', '5', '2025/2026', '2026-04-14 09:04:21'),
(13, 'Rizal Fajar Pradipta', '6', '2025/2026', '2026-04-14 09:04:21'),
(14, 'Cantika Sari Rahayu', '1', '2025/2026', '2026-04-14 09:04:21'),
(15, 'Alif Maulana', '2', '2024/2025', '2026-04-14 09:04:21'),
(16, 'Putri Indah Sari', '3', '2024/2025', '2026-04-14 09:04:21'),
(17, 'Bagus Dwi Cahyo', '4', '2024/2025', '2026-04-14 09:04:21'),
(18, 'Sarah Amelia', '5', '2024/2025', '2026-04-14 09:04:21'),
(19, 'safar', '1b', '2020', '2026-04-15 05:05:56');

-- --------------------------------------------------------

--
-- Table structure for table `tanggapan`
--

CREATE TABLE `tanggapan` (
  `id_tanggapan` int NOT NULL,
  `id_pengaduan` int NOT NULL,
  `id_user` int NOT NULL,
  `isi_tanggapan` text NOT NULL,
  `tanggal_tanggapan` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_user` int NOT NULL,
  `id_role` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `no_hp` varchar(15) DEFAULT NULL,
  `status` enum('aktif','nonaktif') DEFAULT 'aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `id_role`, `username`, `password`, `nama_lengkap`, `email`, `no_hp`, `status`, `created_at`) VALUES
(1, 1, 'admin', '$2a$10$AOC69sXGkG2QEKDLkEyuMetFnRczPFXE1KFB3PoUW7dvcTQi751e2', 'Administrator', 'admin@school.com', '0898334455', 'aktif', '2026-04-14 09:04:21'),
(2, 1, 'admin2', '$2a$10$AOC69sXGkG2QEKDLkEyuMetFnRczPFXE1KFB3PoUW7dvcTQi751e2', 'Ahmad Fauzi', 'ahmad.fauzi@school.com', '081234567890', 'aktif', '2026-04-14 09:04:21'),
(3, 4, 'kepsek1', '$2a$10$AOC69sXGkG2QEKDLkEyuMetFnRczPFXE1KFB3PoUW7dvcTQi751e2', 'Dr. Hj. Siti Aminah, M.Pd', 'siti.aminah@school.com', '081234567891', 'aktif', '2026-04-14 09:04:21'),
(4, 4, 'kepsek2', '$2a$10$AOC69sXGkG2QEKDLkEyuMetFnRczPFXE1KFB3PoUW7dvcTQi751e2', 'Drs. Bambang Susilo, M.M', 'bambang.susilo@school.com', '081234567892', 'nonaktif', '2026-04-14 09:04:21'),
(5, 2, 'guru_budi', '$2a$10$AOC69sXGkG2QEKDLkEyuMetFnRczPFXE1KFB3PoUW7dvcTQi751e2', 'Budi Santoso, S.Pd', 'budi.santoso@school.com', '082111222333', 'aktif', '2026-04-14 09:04:21'),
(6, 2, 'guru_dewi', '$2a$10$AOC69sXGkG2QEKDLkEyuMetFnRczPFXE1KFB3PoUW7dvcTQi751e2', 'Dewi Lestari, S.Pd', 'dewi.lestari@school.com', '082111222334', 'aktif', '2026-04-14 09:04:21'),
(7, 2, 'guru_agus', '$2a$10$AOC69sXGkG2QEKDLkEyuMetFnRczPFXE1KFB3PoUW7dvcTQi751e2', 'Agus Wijaya, S.Pd', 'agus.wijaya@school.com', '082111222335', 'aktif', '2026-04-14 09:04:21'),
(8, 2, 'guru_rina', '$2a$10$AOC69sXGkG2QEKDLkEyuMetFnRczPFXE1KFB3PoUW7dvcTQi751e2', 'Rina Handayani, S.Pd', 'rina.handayani@school.com', '082111222336', 'aktif', '2026-04-14 09:04:21'),
(24, 2, 'syafar', '$2a$10$l1h6ETHgEibkvDgAoPqyg.P.qGW7S2n3.EFYoRO9dV.WUsdgph7ZS', 'muhammad syafar', 'syafar@gmail.com', '082343726382', 'aktif', '2026-04-14 13:29:05'),
(28, 3, 'safar', '$2a$10$jhPLzg8ty/10MtWSAdvXQ.AvxG.g6zrYgAUU9PAYhNu02UFCggfDe', 'safar', 'safar@gmail.com', '0855258008555', 'aktif', '2026-04-15 04:39:50');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `guru`
--
ALTER TABLE `guru`
  ADD PRIMARY KEY (`id_guru`),
  ADD UNIQUE KEY `nip` (`nip`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `idx_guru_kelas` (`kelas`);

--
-- Indexes for table `orangtua`
--
ALTER TABLE `orangtua`
  ADD PRIMARY KEY (`id_orangtua`),
  ADD KEY `idx_orangtua_user` (`id_user`),
  ADD KEY `idx_orangtua_siswa` (`id_siswa`),
  ADD KEY `idx_orangtua_kelas` (`kelas`);

--
-- Indexes for table `pengaduan`
--
ALTER TABLE `pengaduan`
  ADD PRIMARY KEY (`id_pengaduan`),
  ADD KEY `idx_pengaduan_orangtua` (`id_orangtua`),
  ADD KEY `idx_pengaduan_status` (`status`);

--
-- Indexes for table `riwayat_status`
--
ALTER TABLE `riwayat_status`
  ADD PRIMARY KEY (`id_riwayat`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `idx_riwayat_pengaduan` (`id_pengaduan`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_role`);

--
-- Indexes for table `siswa`
--
ALTER TABLE `siswa`
  ADD PRIMARY KEY (`id_siswa`);

--
-- Indexes for table `tanggapan`
--
ALTER TABLE `tanggapan`
  ADD PRIMARY KEY (`id_tanggapan`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `idx_tanggapan_pengaduan` (`id_pengaduan`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_role` (`id_role`),
  ADD KEY `idx_users_status` (`status`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `guru`
--
ALTER TABLE `guru`
  MODIFY `id_guru` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `orangtua`
--
ALTER TABLE `orangtua`
  MODIFY `id_orangtua` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `pengaduan`
--
ALTER TABLE `pengaduan`
  MODIFY `id_pengaduan` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `riwayat_status`
--
ALTER TABLE `riwayat_status`
  MODIFY `id_riwayat` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id_role` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `siswa`
--
ALTER TABLE `siswa`
  MODIFY `id_siswa` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `tanggapan`
--
ALTER TABLE `tanggapan`
  MODIFY `id_tanggapan` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `guru`
--
ALTER TABLE `guru`
  ADD CONSTRAINT `guru_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE;

--
-- Constraints for table `orangtua`
--
ALTER TABLE `orangtua`
  ADD CONSTRAINT `orangtua_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE,
  ADD CONSTRAINT `orangtua_ibfk_2` FOREIGN KEY (`id_siswa`) REFERENCES `siswa` (`id_siswa`) ON DELETE CASCADE;

--
-- Constraints for table `pengaduan`
--
ALTER TABLE `pengaduan`
  ADD CONSTRAINT `pengaduan_ibfk_1` FOREIGN KEY (`id_orangtua`) REFERENCES `orangtua` (`id_orangtua`) ON DELETE CASCADE;

--
-- Constraints for table `riwayat_status`
--
ALTER TABLE `riwayat_status`
  ADD CONSTRAINT `riwayat_status_ibfk_1` FOREIGN KEY (`id_pengaduan`) REFERENCES `pengaduan` (`id_pengaduan`) ON DELETE CASCADE,
  ADD CONSTRAINT `riwayat_status_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE;

--
-- Constraints for table `tanggapan`
--
ALTER TABLE `tanggapan`
  ADD CONSTRAINT `tanggapan_ibfk_1` FOREIGN KEY (`id_pengaduan`) REFERENCES `pengaduan` (`id_pengaduan`) ON DELETE CASCADE,
  ADD CONSTRAINT `tanggapan_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`id_role`) REFERENCES `roles` (`id_role`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
