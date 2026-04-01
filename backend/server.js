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
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, connection) => {
    if (err) console.error('Database connection failed:', err.message);
    else {
        console.log('Connected to MySQL Database (uniku_db)');
        connection.release();
    }
});

// ==========================================
// 1. AUTHENTICATION & USERS
// ==========================================
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ error: 'Username atau password salah' });

        const user = results[0];
        
        // Ambil profil spesifik sesuai role
        if (user.role === 'mahasiswa') {
            db.query('SELECT * FROM mahasiswa WHERE user_id = ?', [user.id], (err, mhs) => {
                res.json({ success: true, user: { ...user, profile: mhs[0] }, token: `token_${user.id}` });
            });
        } else if (user.role === 'dosen') {
            db.query('SELECT * FROM dosen WHERE user_id = ?', [user.id], (err, dsn) => {
                res.json({ success: true, user: { ...user, profile: dsn[0] }, token: `token_${user.id}` });
            });
        } else {
            res.json({ success: true, user, token: `token_${user.id}` });
        }
    });
});

app.post('/api/auth/register-camaba', (req, res) => {
    const { id, nama, email, no_hp, asal_sekolah, prodi, jalur, password } = req.body;
    const sql = `INSERT INTO calon_mahasiswa (id, nama, email, no_hp, asal_sekolah, prodi, jalur, password, status, tanggal_daftar) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`;
    db.query(sql, [id, nama, email, no_hp, asal_sekolah, prodi, jalur, password], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: 'Berhasil mendaftar', id });
    });
});

app.get('/api/auth/calon-mahasiswa', (req, res) => {
    db.query('SELECT * FROM calon_mahasiswa WHERE status = "pending" ORDER BY tanggal_daftar DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/auth/approve-camaba', (req, res) => {
    const { id, nim, idKelas } = req.body;
    // 1. Ambil data camaba
    db.query('SELECT * FROM calon_mahasiswa WHERE id = ?', [id], (err, camabaList) => {
        if (err || camabaList.length === 0) return res.status(404).json({ error: 'Not found' });
        const camaba = camabaList[0];
        
        // 2. Insert User
        db.query('INSERT INTO users (username, password, role) VALUES (?, ?, "mahasiswa")', 
        [nim, camaba.password], (err, resultUser) => {
            if (err) return res.status(500).json({ error: err.message });
            
            // 3. Insert Mahasiswa
            const instEmail = `${nim}@uniku.ac.id`;
            db.query('INSERT INTO mahasiswa (nim, user_id, name, email, personalEmail, prodi, idKelas) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nim, resultUser.insertId, camaba.nama, instEmail, camaba.email, camaba.prodi, idKelas], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                
                // 4. Update status camaba
                db.query('UPDATE calon_mahasiswa SET status = "approved" WHERE id = ?', [id], () => {
                    res.json({ success: true, nim });
                });
            });
        });
    });
});

app.get('/api/mahasiswa', (req, res) => {
    db.query('SELECT m.*, u.username FROM mahasiswa m JOIN users u ON m.user_id = u.id', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ==========================================
// 2. MASTER DATA
// ==========================================
app.get('/api/master/dosen', (req, res) => {
    db.query('SELECT * FROM dosen', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/master/matkul', (req, res) => {
    db.query('SELECT * FROM matakuliah', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/master/kelas', (req, res) => {
    db.query('SELECT * FROM kelas', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Seed data kelas - panggil sekali untuk generate data awal
app.post('/api/master/seed-kelas', (req, res) => {
    const prodis = [
        { kode: 'SI', nama: 'Sistem Informasi' },
        { kode: 'TI', nama: 'Teknik Informatika' },
        { kode: 'DKV', nama: 'Desain Komunikasi Visual' },
        { kode: 'TS', nama: 'Teknik Sipil' }
    ];
    
    const values = [];
    prodis.forEach(p => {
        for (let i = 1; i <= 5; i++) {
            const nomor = String(i).padStart(2, '0');
            values.push([
                `${p.kode}-${nomor}`,
                `${p.nama} ${nomor}`,
                p.nama,
                1
            ]);
        }
    });
    
    const sql = 'INSERT INTO kelas (idKelas, namaKelas, prodi, semester) VALUES ? ON DUPLICATE KEY UPDATE namaKelas=VALUES(namaKelas), prodi=VALUES(prodi), semester=VALUES(semester)';
    db.query(sql, [values], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: `${values.length} kelas berhasil ditambahkan` });
    });
});

app.get('/api/master/jadwal', (req, res) => {
    db.query(`
        SELECT j.*, d.nama as namaDosen, m.namaMatkul, m.sks, m.semester, k.namaKelas 
        FROM jadwal_mengajar j
        LEFT JOIN dosen d ON j.idDosen = d.idDosen
        LEFT JOIN matakuliah m ON j.kodeMtk = m.kodeMtk
        LEFT JOIN kelas k ON j.idKelas = k.idKelas
    `, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/master/jadwal', (req, res) => {
    const { idJadwal, idDosen, kodeMtk, idKelas, hari, jamMulai, jamSelesai, ruangan } = req.body;
    const sql = 'INSERT INTO jadwal_mengajar (idJadwal, idDosen, kodeMtk, idKelas, hari, jamMulai, jamSelesai, ruangan) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [idJadwal, idDosen, kodeMtk, idKelas, hari, jamMulai, jamSelesai, ruangan], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// ==========================================
// 3. KRS
// ==========================================
app.get('/api/krs/:nim', (req, res) => {
    db.query('SELECT * FROM krs WHERE nim = ? ORDER BY semester DESC', [req.params.nim], (err, krsList) => {
        if (err) return res.status(500).json({ error: err.message });
        if (krsList.length === 0) return res.json([]);

        // Get details for the latest KRS
        const latestKrs = krsList[0];
        db.query(`
            SELECT kd.*, j.*, m.namaMatkul, m.sks 
            FROM krs_detail kd
            JOIN jadwal_mengajar j ON kd.jadwal_id = j.idJadwal
            JOIN matakuliah m ON j.kodeMtk = m.kodeMtk
            WHERE kd.krs_id = ?
        `, [latestKrs.id], (err, details) => {
            res.json({ krs: krsList, currentDetails: details });
        });
    });
});

app.post('/api/krs/submit', (req, res) => {
    const { nim, semester, total_sks, jadwal_ids } = req.body;
    db.query('INSERT INTO krs (nim, semester, status, total_sks) VALUES (?, ?, "Menunggu Persetujuan", ?)', 
    [nim, semester, total_sks], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const krsId = result.insertId;
        const detailValues = jadwal_ids.map(jId => [krsId, jId]);
        
        if (detailValues.length > 0) {
            db.query('INSERT INTO krs_detail (krs_id, jadwal_id) VALUES ?', [detailValues], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ success: true, krs_id: krsId });
            });
        } else {
            res.json({ success: true, krs_id: krsId });
        }
    });
});

// ==========================================
// 4. KEUANGAN (TAGIHAN)
// ==========================================
app.get('/api/tagihan/:nim', (req, res) => {
    db.query('SELECT * FROM tagihan WHERE nim = ? ORDER BY created_at DESC', [req.params.nim], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/tagihan', (req, res) => {
    const { nim, jenis_tagihan, nominal, tenggat_waktu, order_id } = req.body;
    db.query('INSERT INTO tagihan (nim, jenis_tagihan, nominal, tenggat_waktu, order_id) VALUES (?, ?, ?, ?, ?)',
    [nim, jenis_tagihan, nominal, tenggat_waktu, order_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// ==========================================
// 5. AKADEMIK (TUGAS & PRESENSI)
// ==========================================
// Tugas Routes (Existing, merged with new table structure)
app.get('/api/tugas', (req, res) => {
    db.query('SELECT * FROM tugas ORDER BY createdAt DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});
app.post('/api/tugas', (req, res) => {
    const { matkul, kelas, judul, deskripsi, deadline, dosenId, tipeFormat } = req.body;
    const sql = 'INSERT INTO tugas (matkul, kelas, judul, deskripsi, deadline, dosenId, tipeFormat) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [matkul, kelas, judul, deskripsi, deadline, dosenId, tipeFormat], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, ...req.body });
    });
});
app.delete('/api/tugas/:id', (req, res) => {
    db.query('DELETE FROM tugas WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Deleted successfully' });
    });
});
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

// Presensi
app.get('/api/presensi/:idJadwal', (req, res) => {
    db.query('SELECT * FROM presensi WHERE idJadwal = ?', [req.params.idJadwal], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/presensi/buka', (req, res) => {
    const { idJadwal, pertemuan, tanggal, metode, materi, token } = req.body;
    db.query('INSERT INTO presensi (idJadwal, pertemuan, tanggal, metode, materi, token) VALUES (?, ?, ?, ?, ?, ?)',
    [idJadwal, pertemuan, tanggal, metode, materi, token], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, presensi_id: result.insertId });
    });
});

// ==========================================
// 6. MESSAGES & NOTIFICATIONS
// ==========================================
app.get('/api/messages/:userId', (req, res) => {
    db.query('SELECT * FROM messages WHERE senderId = ? OR receiverId = ? ORDER BY timestamp ASC', 
    [req.params.userId, req.params.userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/messages', (req, res) => {
    const { senderId, receiverId, text } = req.body;
    db.query('INSERT INTO messages (senderId, receiverId, text) VALUES (?, ?, ?)',
    [senderId, receiverId, text], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.get('/api/notifications/:userId', (req, res) => {
    db.query('SELECT * FROM notifications WHERE targetId = ? ORDER BY time DESC', 
    [req.params.userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
