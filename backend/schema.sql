CREATE DATABASE IF NOT EXISTS uniku_db;
USE uniku_db;

-- 1. Users & Auth
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'dosen', 'mahasiswa') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS calon_mahasiswa (
    id VARCHAR(50) PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    no_hp VARCHAR(50),
    asal_sekolah VARCHAR(255),
    prodi VARCHAR(100),
    jalur VARCHAR(100),
    password VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    tanggal_daftar DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mahasiswa (
    nim VARCHAR(50) PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    personalEmail VARCHAR(255),
    prodi VARCHAR(100),
    idKelas VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS dosen (
    idDosen VARCHAR(50) PRIMARY KEY,
    user_id INT NOT NULL,
    nidn VARCHAR(50) UNIQUE,
    nama VARCHAR(255) NOT NULL,
    keahlian VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2. Master Data
CREATE TABLE IF NOT EXISTS kelas (
    idKelas VARCHAR(50) PRIMARY KEY,
    prodi VARCHAR(100) NOT NULL,
    semester INT NOT NULL,
    namaKelas VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS matakuliah (
    kodeMtk VARCHAR(50) PRIMARY KEY,
    semester INT NOT NULL,
    namaMatkul VARCHAR(255) NOT NULL,
    sks INT NOT NULL
);

CREATE TABLE IF NOT EXISTS jadwal_mengajar (
    idJadwal VARCHAR(50) PRIMARY KEY,
    idDosen VARCHAR(50) NOT NULL,
    kodeMtk VARCHAR(50) NOT NULL,
    idKelas VARCHAR(50) NOT NULL,
    hari VARCHAR(20) NOT NULL,
    jamMulai TIME NOT NULL,
    jamSelesai TIME NOT NULL,
    ruangan VARCHAR(100),
    FOREIGN KEY (idDosen) REFERENCES dosen(idDosen) ON DELETE CASCADE,
    FOREIGN KEY (kodeMtk) REFERENCES matakuliah(kodeMtk) ON DELETE CASCADE,
    FOREIGN KEY (idKelas) REFERENCES kelas(idKelas) ON DELETE CASCADE
);

-- 3. KRS
CREATE TABLE IF NOT EXISTS krs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nim VARCHAR(50) NOT NULL,
    semester INT NOT NULL,
    status VARCHAR(50) DEFAULT 'Draft',
    total_sks INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (nim) REFERENCES mahasiswa(nim) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS krs_detail (
    id INT AUTO_INCREMENT PRIMARY KEY,
    krs_id INT NOT NULL,
    jadwal_id VARCHAR(50) NOT NULL,
    FOREIGN KEY (krs_id) REFERENCES krs(id) ON DELETE CASCADE,
    FOREIGN KEY (jadwal_id) REFERENCES jadwal_mengajar(idJadwal) ON DELETE CASCADE
);

-- 4. Keuangan (Tagihan)
CREATE TABLE IF NOT EXISTS tagihan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nim VARCHAR(50) NOT NULL,
    jenis_tagihan VARCHAR(100) NOT NULL,
    nominal DECIMAL(15, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Belum Dibayar',
    tenggat_waktu DATETIME,
    order_id VARCHAR(100),
    term_pembayaran INT DEFAULT 1,
    potongan DECIMAL(15, 2) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nim) REFERENCES mahasiswa(nim) ON DELETE CASCADE
);

-- 5. Akademik (Tugas & Presensi)
CREATE TABLE IF NOT EXISTS tugas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    matkul VARCHAR(255),
    kelas VARCHAR(100),
    judul VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    deadline DATETIME NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    dosenId VARCHAR(50),
    tipeFormat VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS submisi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tugasId INT NOT NULL,
    nim VARCHAR(50) NOT NULL,
    namaMahasiswa VARCHAR(255),
    fileUrl TEXT,
    waktuSubmit DATETIME DEFAULT CURRENT_TIMESTAMP,
    nilai INT,
    feedbackDosen TEXT,
    FOREIGN KEY (tugasId) REFERENCES tugas(id) ON DELETE CASCADE,
    FOREIGN KEY (nim) REFERENCES mahasiswa(nim) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS presensi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idJadwal VARCHAR(50) NOT NULL,
    pertemuan INT NOT NULL,
    tanggal DATE NOT NULL,
    metode VARCHAR(50),
    materi TEXT,
    token VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Berlangsung',
    FOREIGN KEY (idJadwal) REFERENCES jadwal_mengajar(idJadwal) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS presensi_mahasiswa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    presensi_id INT NOT NULL,
    nim VARCHAR(50) NOT NULL,
    status_hadir VARCHAR(50) NOT NULL,
    waktu_hadir DATETIME,
    metode VARCHAR(50),
    FOREIGN KEY (presensi_id) REFERENCES presensi(id) ON DELETE CASCADE,
    FOREIGN KEY (nim) REFERENCES mahasiswa(nim) ON DELETE CASCADE
);

-- 6. Messages & Notifications
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    senderId VARCHAR(50) NOT NULL,
    receiverId VARCHAR(50) NOT NULL,
    text TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    isRead BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    targetId VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    time DATETIME DEFAULT CURRENT_TIMESTAMP,
    isRead BOOLEAN DEFAULT FALSE,
    actionUrl VARCHAR(255)
);

-- =========================================================
-- SEED DATA
-- =========================================================

-- Admin
INSERT IGNORE INTO users (id, username, password, role) VALUES 
(1, 'admin', 'admin', 'admin');

-- Dosen Users & Profile
INSERT IGNORE INTO users (id, username, password, role) VALUES 
(2, 'dosen', 'dosen', 'dosen');
INSERT IGNORE INTO dosen (idDosen, user_id, nidn, nama, keahlian) VALUES 
('D01', 2, '0411122201', 'Budi Santoso, M.Kom', 'Rekayasa Perangkat Lunak');

-- Seed Matkul (Sample)
INSERT IGNORE INTO matakuliah (kodeMtk, semester, namaMatkul, sks) VALUES 
('SI-101', 1, 'Algoritma & Pemrograman', 3),
('SI-102', 1, 'Pengantar Teknologi Informasi', 2),
('SI-301', 3, 'Basis Data Terapan', 3);

-- Seed Kelas
INSERT IGNORE INTO kelas (idKelas, prodi, semester, namaKelas) VALUES 
('SI 2026 01', 'Sistem Informasi', 1, 'Sistem Informasi - 1A'),
('SI 2026 02', 'Sistem Informasi', 1, 'Sistem Informasi - 1B');

-- Seed Jadwal
INSERT IGNORE INTO jadwal_mengajar (idJadwal, idDosen, kodeMtk, idKelas, hari, jamMulai, jamSelesai, ruangan) VALUES 
('JDW-001', 'D01', 'SI-101', 'SI 2026 01', 'Senin', '08:00:00', '10:30:00', 'Lab Komputer 1');
