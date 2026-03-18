const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Check connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err.message);
    } else {
        console.log('Connected to MySQL Database');
        connection.release();
    }
});

// GET all tugas
app.get('/api/tugas', (req, res) => {
    db.query('SELECT * FROM tugas ORDER BY createdAt DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// POST new tugas
app.post('/api/tugas', (req, res) => {
    const { matkul, kelas, judul, deskripsi, deadline, dosenId, tipeFormat } = req.body;
    const sql = 'INSERT INTO tugas (matkul, kelas, judul, deskripsi, deadline, dosenId, tipeFormat) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [matkul, kelas, judul, deskripsi, deadline, dosenId, tipeFormat], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, ...req.body });
    });
});

// DELETE tugas
app.delete('/api/tugas/:id', (req, res) => {
    db.query('DELETE FROM tugas WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Deleted successfully' });
    });
});

// Submisi routes
app.get('/api/submisi/:tugasId', (req, res) => {
    db.query('SELECT * FROM submisi WHERE tugasId = ?', [req.params.tugasId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/submisi', (req, res) => {
    const { tugasId, nim, namaMahasiswa, fileUrl } = req.body;
    const sql = 'INSERT INTO submisi (tugasId, nim, namaMahasiswa, fileUrl) VALUES (?, ?, ?, ?)';
    db.query(sql, [tugasId, nim, namaMahasiswa, fileUrl], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, ...req.body });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
