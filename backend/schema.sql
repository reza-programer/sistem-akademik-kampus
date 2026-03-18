CREATE DATABASE IF NOT EXISTS uniku_db;
USE uniku_db;

CREATE TABLE IF NOT EXISTS tugas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    matkul VARCHAR(255) NOT NULL,
    kelas VARCHAR(100) NOT NULL,
    judul VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    deadline DATETIME NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    dosenId VARCHAR(50) NOT NULL,
    tipeFormat VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS submisi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tugasId INT NOT NULL,
    nim VARCHAR(50) NOT NULL,
    namaMahasiswa VARCHAR(255) NOT NULL,
    fileUrl TEXT,
    waktuSubmit DATETIME DEFAULT CURRENT_TIMESTAMP,
    nilai INT,
    feedbackDosen TEXT,
    FOREIGN KEY (tugasId) REFERENCES tugas(id) ON DELETE CASCADE
);

-- Seed data for tugas (similar to initial localStorage)
INSERT INTO tugas (matkul, kelas, judul, deskripsi, deadline, dosenId, tipeFormat)
VALUES 
('Sistem Operasi', 'SI 2026 01', 'Tugas 1: Manajemen Memori', 'Buatlah makalah minimal 5 halaman menjelaskan konsep paging dan segmentation.', '2026-04-15 23:59:00', 'D08', 'Document PDF (.pdf)'),
('Rekayasa Perangkat Lunak', 'SI 2026 03', 'Tugas 2: Desain Use Case', 'Buat desain Use Case lengkap berdasarkan studi kasus yang diberikan di materi.', '2026-04-10 23:59:00', 'D01', 'Document PDF (.pdf)');
