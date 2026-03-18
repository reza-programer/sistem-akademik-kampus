import { defineStore } from 'pinia'

export const useMasterDataStore = defineStore('masterData', {
    state: () => ({
        // 1. Master Data Dosen Prodi Sistem Informasi
        dosenList: [
            { idDosen: 'D01', nidn: '0411122201', nama: 'Budi Santoso, M.Kom', keahlian: 'Rekayasa Perangkat Lunak' },
            { idDosen: 'D02', nidn: '0411122202', nama: 'Siti Aminah, M.T.', keahlian: 'Basis Data' },
            { idDosen: 'D03', nidn: '0411122203', nama: 'Dr. Ahmad Fauzi', keahlian: 'Kecerdasan Buatan' },
            { idDosen: 'D04', nidn: '0411122204', nama: 'Dewi Lestari, S.Kom., M.MSI', keahlian: 'Manajemen Sistem Informasi' },
            { idDosen: 'D05', nidn: '0411122205', nama: 'Ir. Eko Prasetyo, M.T.', keahlian: 'Jaringan Komputer' },
            { idDosen: 'D06', nidn: '0411122206', nama: 'Fahmi Nugroho, M.Kom', keahlian: 'Pemrograman Web & Mobile' },
            { idDosen: 'D07', nidn: '0411122207', nama: 'Gita Pertiwi, S.T., M.Kom', keahlian: 'Analisis & Desain Sistem' },
            { idDosen: 'D08', nidn: '0411122208', nama: 'Hendra Gunawan, M.T.', keahlian: 'Sistem Operasi' }
        ],

        // 2. Katalog Mata Kuliah (Semester 1 - 8)
        matkulList: [
            // Semester 1
            { kodeMtk: 'SI-101', semester: 1, namaMatkul: 'Algoritma & Pemrograman', sks: 3 },
            { kodeMtk: 'SI-102', semester: 1, namaMatkul: 'Pengantar Teknologi Informasi', sks: 2 },
            { kodeMtk: 'SI-103', semester: 1, namaMatkul: 'Matematika Diskrit', sks: 3 },
            { kodeMtk: 'SI-104', semester: 1, namaMatkul: 'Pendidikan Agama', sks: 2 },
            { kodeMtk: 'SI-105', semester: 1, namaMatkul: 'Bahasa Indonesia', sks: 2 },
            { kodeMtk: 'SI-106', semester: 1, namaMatkul: 'Praktikum Algoritma', sks: 1 },

            // Semester 2
            { kodeMtk: 'SI-201', semester: 2, namaMatkul: 'Sistem Operasi', sks: 3 },
            { kodeMtk: 'SI-202', semester: 2, namaMatkul: 'Struktur Data & Algoritma', sks: 3 },
            { kodeMtk: 'SI-203', semester: 2, namaMatkul: 'Kalkulus Dasar', sks: 3 },
            { kodeMtk: 'SI-204', semester: 2, namaMatkul: 'Arsitektur Komputer', sks: 3 },
            { kodeMtk: 'SI-205', semester: 2, namaMatkul: 'Bahasa Inggris', sks: 2 },

            // Semester 3
            { kodeMtk: 'SI-301', semester: 3, namaMatkul: 'Basis Data Terapan', sks: 3 },
            { kodeMtk: 'SI-302', semester: 3, namaMatkul: 'Pemrograman Berorientasi Objek', sks: 3 },
            { kodeMtk: 'SI-303', semester: 3, namaMatkul: 'Jaringan Komputer', sks: 3 },
            { kodeMtk: 'SI-304', semester: 3, namaMatkul: 'Analisis & Desain Sistem', sks: 3 },
            { kodeMtk: 'SI-305', semester: 3, namaMatkul: 'Aljabar Linear', sks: 3 },

            // Semester 4
            { kodeMtk: 'SI-401', semester: 4, namaMatkul: 'Pemrograman Web Tingkat Dasar', sks: 3 },
            { kodeMtk: 'SI-402', semester: 4, namaMatkul: 'Sistem Informasi Manajemen', sks: 3 },
            { kodeMtk: 'SI-403', semester: 4, namaMatkul: 'Desain UI/UX', sks: 3 },
            { kodeMtk: 'SI-404', semester: 4, namaMatkul: 'Statistika & Probabilitas', sks: 3 },
            { kodeMtk: 'SI-405', semester: 4, namaMatkul: 'Keamanan Komputer', sks: 3 },

            // Semester 5
            { kodeMtk: 'SI-501', semester: 5, namaMatkul: 'Pemrograman Web Lanjut (Framework)', sks: 3 },
            { kodeMtk: 'SI-502', semester: 5, namaMatkul: 'Rekayasa Perangkat Lunak', sks: 3 },
            { kodeMtk: 'SI-503', semester: 5, namaMatkul: 'Pemrograman Mobile', sks: 3 },
            { kodeMtk: 'SI-504', semester: 5, namaMatkul: 'Kecerdasan Buatan', sks: 3 },
            { kodeMtk: 'SI-505', semester: 5, namaMatkul: 'Metodologi Penelitian', sks: 2 },

            // Semester 6
            { kodeMtk: 'SI-601', semester: 6, namaMatkul: 'E-Business & E-Commerce', sks: 3 },
            { kodeMtk: 'SI-602', semester: 6, namaMatkul: 'Data Mining & Business Intelligence', sks: 3 },
            { kodeMtk: 'SI-603', semester: 6, namaMatkul: 'Manajemen Proyek TI', sks: 3 },
            { kodeMtk: 'SI-604', semester: 6, namaMatkul: 'Kewirausahaan Berbasis Digital', sks: 2 },
            { kodeMtk: 'SI-605', semester: 6, namaMatkul: 'Kerja Praktek (KP)', sks: 3 },

            // Semester 7
            { kodeMtk: 'SI-701', semester: 7, namaMatkul: 'Audit Sistem Informasi', sks: 3 },
            { kodeMtk: 'SI-702', semester: 7, namaMatkul: 'Cloud Computing & IoT', sks: 3 },
            { kodeMtk: 'SI-703', semester: 7, namaMatkul: 'Tata Kelola TI (IT Governance)', sks: 3 },
            { kodeMtk: 'SI-704', semester: 7, namaMatkul: 'Seminar Proposal Skripsi', sks: 2 },

            // Semester 8
            { kodeMtk: 'SI-801', semester: 8, namaMatkul: 'Etika Profesi TI', sks: 2 },
            { kodeMtk: 'SI-802', semester: 8, namaMatkul: 'Skripsi / Tugas Akhir', sks: 6 }
        ],

        // 3. Master Kelas yang Tersedia (3 Prodi, masing-masing 5 kelas di Angkatan 2026)
        kelasList: [
            // Prodi Sistem Informasi
            { idKelas: 'SI 2026 01', prodi: 'Sistem Informasi', semester: 1, namaKelas: 'Sistem Informasi - 1A' },
            { idKelas: 'SI 2026 02', prodi: 'Sistem Informasi', semester: 1, namaKelas: 'Sistem Informasi - 1B' },
            { idKelas: 'SI 2026 03', prodi: 'Sistem Informasi', semester: 1, namaKelas: 'Sistem Informasi - 1C' },
            { idKelas: 'SI 2026 04', prodi: 'Sistem Informasi', semester: 1, namaKelas: 'Sistem Informasi - 1D' },
            { idKelas: 'SI 2026 05', prodi: 'Sistem Informasi', semester: 1, namaKelas: 'Sistem Informasi - 1E' },

            // Prodi Teknik Informatika
            { idKelas: 'TI 2026 01', prodi: 'Teknik Informatika', semester: 1, namaKelas: 'Teknik Informatika - 1A' },
            { idKelas: 'TI 2026 02', prodi: 'Teknik Informatika', semester: 1, namaKelas: 'Teknik Informatika - 1B' },
            { idKelas: 'TI 2026 03', prodi: 'Teknik Informatika', semester: 1, namaKelas: 'Teknik Informatika - 1C' },
            { idKelas: 'TI 2026 04', prodi: 'Teknik Informatika', semester: 1, namaKelas: 'Teknik Informatika - 1D' },
            { idKelas: 'TI 2026 05', prodi: 'Teknik Informatika', semester: 1, namaKelas: 'Teknik Informatika - 1E' },

            // Prodi Desain Komunikasi Visual (DKV)
            { idKelas: 'DKV 2026 01', prodi: 'Desain Komunikasi Visual', semester: 1, namaKelas: 'DKV - 1A' },
            { idKelas: 'DKV 2026 02', prodi: 'Desain Komunikasi Visual', semester: 1, namaKelas: 'DKV - 1B' },
            { idKelas: 'DKV 2026 03', prodi: 'Desain Komunikasi Visual', semester: 1, namaKelas: 'DKV - 1C' },
            { idKelas: 'DKV 2026 04', prodi: 'Desain Komunikasi Visual', semester: 1, namaKelas: 'DKV - 1D' },
            { idKelas: 'DKV 2026 05', prodi: 'Desain Komunikasi Visual', semester: 1, namaKelas: 'DKV - 1E' }
        ],

        // 4. Plotting / Penugasan Mengajar Dosen (Jadwal)
        // Disimpan dalam localstorage untuk dummy persistence
        jadwalMengajar: JSON.parse(localStorage.getItem('jadwal_mengajar_db')) || [
            // Plotting Semester 1
            { idJadwal: 'JDW-001', idDosen: 'D01', kodeMtk: 'SI-101', idKelas: 'SI 2026 01', hari: 'Senin', jamMulai: '08:00', jamSelesai: '10:30', ruangan: 'Lab Komputer 1' },
            { idJadwal: 'JDW-002', idDosen: 'D08', kodeMtk: 'SI-102', idKelas: 'SI 2026 01', hari: 'Selasa', jamMulai: '10:30', jamSelesai: '12:10', ruangan: 'Ruang Teori 1' },

            // Plotting Semester 3
            { idJadwal: 'JDW-003', idDosen: 'D02', kodeMtk: 'SI-301', idKelas: 'SI 2026 02', hari: 'Rabu', jamMulai: '08:00', jamSelesai: '10:30', ruangan: 'Lab Database' },
            { idJadwal: 'JDW-004', idDosen: 'D07', kodeMtk: 'SI-304', idKelas: 'TI 2026 01', hari: 'Kamis', jamMulai: '13:00', jamSelesai: '15:30', ruangan: 'Ruang Teori 2' },
            { idJadwal: 'JDW-005', idDosen: 'D05', kodeMtk: 'SI-303', idKelas: 'DKV 2026 01', hari: 'Jumat', jamMulai: '08:00', jamSelesai: '10:30', ruangan: 'Lab Jaringan' },

            // Plotting Semester 5
            { idJadwal: 'JDW-006', idDosen: 'D06', kodeMtk: 'SI-501', idKelas: 'SI 2026 03', hari: 'Senin', jamMulai: '13:00', jamSelesai: '15:30', ruangan: 'Lab Web & Mobile' },
            { idJadwal: 'JDW-007', idDosen: 'D01', kodeMtk: 'SI-502', idKelas: 'DKV 2026 02', hari: 'Rabu', jamMulai: '10:30', jamSelesai: '13:00', ruangan: 'Ruang Teori 4' },
            { idJadwal: 'JDW-008', idDosen: 'D03', kodeMtk: 'SI-504', idKelas: 'TI 2026 02', hari: 'Kamis', jamMulai: '08:00', jamSelesai: '10:30', ruangan: 'Lab Cerdas' },

            // Plotting Semester 7
            { idJadwal: 'JDW-009', idDosen: 'D04', kodeMtk: 'SI-703', idKelas: 'SI 2026 04', hari: 'Jumat', jamMulai: '13:30', jamSelesai: '16:00', ruangan: 'Ruang Konferensi' },
        ]
    }),
    getters: {
        // Mendapatkan detail lengkap jadwal (dengan join data dosen, matkul, dll)
        jadwalLengkap: (state) => {
            return state.jadwalMengajar.map(jadwal => {
                const dosen = state.dosenList.find(d => d.idDosen === jadwal.idDosen)
                const matkul = state.matkulList.find(m => m.kodeMtk === jadwal.kodeMtk)
                const kelas = state.kelasList.find(k => k.idKelas === jadwal.idKelas)

                return {
                    ...jadwal,
                    namaDosen: dosen ? dosen.nama : 'Unknown Dosen',
                    namaMatkul: matkul ? matkul.namaMatkul : 'Unknown Matkul',
                    sks: matkul ? matkul.sks : 0,
                    semester: matkul ? matkul.semester : 0,
                    namaKelas: kelas ? kelas.namaKelas : 'Unknown Kelas'
                }
            })
        },

        // Ambil jadwal khusus 1 orang Dosen (diakses saat dosen buka dashboard/presensi/tugas)
        jadwalDosen: (state) => {
            return (idDosen) => {
                // Return proxy dari jadwalLengkap getter
                return useMasterDataStore().jadwalLengkap.filter(j => j.idDosen === idDosen)
            }
        },

        // Ambil jadwal khusus untuk Mahasiswa pada Suatu Kelas
        jadwalKelas: (state) => {
            return (idKelas) => {
                return useMasterDataStore().jadwalLengkap.filter(j => j.idKelas === idKelas)
            }
        },

        // Mengambil daftar matkul yang ditawarkan berdasarkan semester tertentu
        getMatkulBySemester: (state) => {
            return (semester) => state.matkulList.filter(m => m.semester === semester)
        }
    },
    actions: {
        // Digunakan oleh admin untuk menambah plotting/jadwal baru
        tambahJadwal(jadwalBaru) {
            this.jadwalMengajar.push({
                ...jadwalBaru,
                idJadwal: 'JDW-' + Date.now().toString().slice(-4)
            })
            this.saveState()
        },
        hapusJadwal(idJadwal) {
            this.jadwalMengajar = this.jadwalMengajar.filter(j => j.idJadwal !== idJadwal)
            this.saveState()
        },
        saveState() {
            localStorage.setItem('jadwal_mengajar_db', JSON.stringify(this.jadwalMengajar))
        }
    }
})
