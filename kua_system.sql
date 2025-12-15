
-- Database: kua_system (FIXED VERSION)

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

SET NAMES utf8mb4;

-- Ensure a clean import: recreate database and disable foreign key checks while importing
DROP DATABASE IF EXISTS `kua_system`;
CREATE DATABASE IF NOT EXISTS `kua_system` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `kua_system`;
SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------
-- Table: agenda_surat_keluar
-- --------------------------------------------------------
DROP TABLE IF EXISTS `agenda_surat_keluar`;
CREATE TABLE IF NOT EXISTS `agenda_surat_keluar` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tanggal_surat` date NOT NULL,
  `nomor_surat` varchar(50) NOT NULL,
  `tujuan_surat` varchar(100) NOT NULL,
  `keterangan` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `agenda_surat_keluar` VALUES
(2, '2025-10-06', 'KUA/040/PW-KP/10/2025', 'Masjid Paripurna Al-Mujahadah',
 'Permintaan Data Petugas Jumat Per Bulan September 2025', '2025-10-06 11:15:47');

-- --------------------------------------------------------
-- Table: agenda_surat_masuk
-- --------------------------------------------------------
DROP TABLE IF EXISTS `agenda_surat_masuk`;
CREATE TABLE IF NOT EXISTS `agenda_surat_masuk` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama_pengirim` varchar(100) NOT NULL,
  `nomor_surat` varchar(50) NOT NULL,
  `tanggal_surat` date NOT NULL,
  `hal` varchar(200) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `agenda_surat_masuk` VALUES
(3, 'Universitas Islam Negeri Sultan Syarif Qasim Riau', 'UIN/310/XIV/10/2025',
 '2025-10-02', 'Permohonan Izin Kerja Praktek', '2025-10-06 10:50:19');

-- --------------------------------------------------------
-- Table: legalisir
-- --------------------------------------------------------
DROP TABLE IF EXISTS `legalisir`;
CREATE TABLE IF NOT EXISTS `legalisir` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(200) NOT NULL,
  `nomor_legalisir` varchar(50) NOT NULL,
  `tanggal_legalisir` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: pendaftaran_nikah
-- --------------------------------------------------------
DROP TABLE IF EXISTS `pendaftaran_nikah`;
CREATE TABLE IF NOT EXISTS `pendaftaran_nikah` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nomor_pendaftaran` varchar(50) NOT NULL UNIQUE,
  `nama_calon_suami` varchar(100) NOT NULL,
  `nama_calon_istri` varchar(100) NOT NULL,
  `tanggal_mendaftar` date NOT NULL,
  `hari_pernikahan` varchar(20) NOT NULL,
  `tanggal_pernikahan` date NOT NULL,
  `alamat_akad_nikah` varchar(255) NOT NULL,
  `tanggal_pemeriksaan` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: rekomendasi_nikah
-- --------------------------------------------------------
DROP TABLE IF EXISTS `rekomendasi_nikah`;
CREATE TABLE IF NOT EXISTS `rekomendasi_nikah` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama_pemohon` varchar(100) NOT NULL,
  `asal_kelurahan` varchar(100),
  `nomor_surat_lurah` varchar(50),
  `tempat_lahir` varchar(100),
  `tanggal_lahir` date,
  `pekerjaan` varchar(100),
  `alamat` text,
  `nama_pasangan` varchar(100),
  `kua_tujuan` varchar(100),
  `provinsi_tujuan` varchar(100),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: user
-- --------------------------------------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'pegawai',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: login_logs
-- --------------------------------------------------------
DROP TABLE IF EXISTS `login_logs`;
CREATE TABLE IF NOT EXISTS `login_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11),
  `username` varchar(50) NOT NULL,
  `success` tinyint(1) NOT NULL DEFAULT 0,
  `ip_address` varchar(45),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Dumping data for table `agenda_surat_keluar`
-- --------------------------------------------------------
INSERT IGNORE INTO `agenda_surat_keluar` (`id`, `tanggal_surat`, `nomor_surat`, `tujuan_surat`, `keterangan`, `created_at`) VALUES
(2, '2025-10-06', 'KUA/040/PW-KP/10/2025', 'Masjid Paripurna Al-Mujahadah', 'Permintaan Data Petugas Jumat Per Bulan Sepember 2025', '2025-10-06 11:15:47');

-- --------------------------------------------------------
-- Dumping data for table `agenda_surat_masuk`
-- --------------------------------------------------------
INSERT IGNORE INTO `agenda_surat_masuk` (`id`, `nama_pengirim`, `nomor_surat`, `tanggal_surat`, `hal`, `created_at`) VALUES
(3, 'Universitas Islam Negeri Sultan Syarif Qasim Riau', 'UIN/310/XIV/10/2025', '2025-10-02', 'Permohonan Izin Melaksanakan Kerja Praktek Mahasiswa', '2025-10-06 10:50:19');

-- --------------------------------------------------------
-- Dumping data for table `legalisir`
-- --------------------------------------------------------
INSERT IGNORE INTO `legalisir` (`id`, `nama`, `nomor_legalisir`, `tanggal_legalisir`, `created_at`) VALUES
(3, 'Andika Satriya', 'KUA/04/5/9/KS-02/300/10/2025', '2025-10-06', '2025-10-06 10:33:19'),
(4, 'Khusnatul Amaliyah', 'KUA/04/5/09/KS-02/331/20/2025', '2025-10-03', '2025-10-06 10:59:51');

-- --------------------------------------------------------
-- Dumping data for table `pendaftaran_nikah`
-- --------------------------------------------------------
INSERT IGNORE INTO `pendaftaran_nikah` (`id`, `nomor_pendaftaran`, `nama_calon_suami`, `nama_calon_istri`, `tanggal_mendaftar`, `hari_pernikahan`, `tanggal_pernikahan`, `alamat_akad_nikah`, `tanggal_pemeriksaan`, `created_at`, `updated_at`) VALUES
(2, '330', 'Muhammad Azmi', 'Syifa Aulia', '2025-10-06', 'Kamis', '2025-11-20', 'Jl. Kartama No. 19 Kel. Maharatu Kec. Marpoyan Damai Kota Pekanbaru', '2025-11-11', '2025-10-06 10:11:48', '2025-10-06 10:11:48');

-- --------------------------------------------------------
-- Dumping data for table `rekomendasi_nikah`
-- --------------------------------------------------------
INSERT IGNORE INTO `rekomendasi_nikah` (`id`, `nama_pemohon`, `asal_kelurahan`, `nomor_surat_lurah`, `tempat_lahir`, `tanggal_lahir`, `pekerjaan`, `alamat`, `nama_pasangan`, `kua_tujuan`, `provinsi_tujuan`, `created_at`) VALUES
(2, 'Andi Saputra', 'PerhentianMarpoyan', '115/Des-,PM/10/2025', 'TeratakBuluh', '1995-01-31', 'PNS', 'Jl. Garuda No. 18', 'Ani Riyadha', 'Jakarta Pusat', 'DKI Jakarta', '2025-10-01 09:00:40'),
(4, 'Suryadi', 'Wonorejo', '143/10/WR-KESOS/10/2025', 'Pekanbaru', '1990-02-13', 'Wiraswasta', 'Jl. Kuini', 'Asnita', 'Tenayan Raya', 'Riau', '2025-10-06 10:20:41'),
(5, 'Andika Surya', 'Tangkerang Barat', '110/MD-TB/XI/10/2025', 'Pangkalan Bunut', '1992-06-02', 'PNS', 'Jl. Lion Air no. 119', 'Maulida Aliyana', 'Karo', 'Sumatera Utara', '2025-10-06 10:59:15');

-- --------------------------------------------------------
-- Dumping data for table `user`
-- --------------------------------------------------------
INSERT IGNORE INTO `user` (`id`, `username`, `password`, `role`) VALUES
(1, 'Admin', '1234', 'pegawai'),
(2, 'Admin2', '1234', 'pegawai'),
(3, 'Admin3', '1234', 'pegawai'),
(4, 'Admin4', '1234', 'pegawai'),
(5, 'superadmin', 'superadmin123', 'superadmin');

SET FOREIGN_KEY_CHECKS = 1;
