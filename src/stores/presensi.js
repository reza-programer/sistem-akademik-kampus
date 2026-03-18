import { defineStore } from 'pinia'

export const usePresensiStore = defineStore('presensi', {
    state: () => ({
        // Daftar nama mahasiswa di kelas dummy (SI 2026 01)
        students: [
            { nim: '20260001', nama: 'Andi Wijaya' },
            { nim: '20260002', nama: 'Budi Santoso' },
            { nim: '20260003', nama: 'Citra Lestari' },
            { nim: '20260004', nama: 'Dewi Sartika' },
            { nim: '20260005', nama: 'Eko Prasetyo' }
        ],
        // Record Absensi: 
        // Array per pertemuan. Misal: { pertemuan: 1, tanggal: '2025-03-01', matkul: 'Struktur Data', data: { '20260001': 'Hadir', '20260002': 'Alpa' } }
        records: JSON.parse(localStorage.getItem('presensi_records')) || [
            {
                id: 1,
                pertemuan: 1,
                tanggal: '2025-03-01',
                matkul: 'Struktur Data',
                data: {
                    '20260001': 'Hadir',
                    '20260002': 'Hadir',
                    '20260003': 'Izin',
                    '20260004': 'Hadir',
                    '20260005': 'Sakit'
                }
            },
            {
                id: 2,
                pertemuan: 2,
                tanggal: '2025-03-08',
                matkul: 'Struktur Data',
                data: {
                    '20260001': 'Hadir',
                    '20260002': 'Sakit',
                    '20260003': 'Hadir',
                    '20260004': 'Hadir',
                    '20260005': 'Hadir'
                }
            }
        ]
    }),
    getters: {
        getRekapMahasiswa: (state) => (nim) => {
            // Menghitung % kehadiran untuk mahasiswa tertentu berdasarkan history record
            const history = state.records.map(r => ({
                pertemuan: r.pertemuan,
                tanggal: r.tanggal,
                matkul: r.matkul,
                status: r.data[nim] || 'Belum Input'
            }))

            const hadir = history.filter(h => h.status === 'Hadir').length
            const total = history.length
            const persentase = total > 0 ? Math.round((hadir / total) * 100) : 0

            return { history, hadir, total, persentase }
        }
    },
    actions: {
        saveRecord(matkul, pertemuan, tanggal, dataAbsensi) {
            // Cek apakah pertemuan sudah ada
            const existingIndex = this.records.findIndex(r => r.matkul === matkul && r.pertemuan === pertemuan)

            const newRecord = {
                id: Date.now(),
                pertemuan,
                tanggal,
                matkul,
                data: dataAbsensi
            }

            if (existingIndex >= 0) {
                this.records[existingIndex] = newRecord // Update
            } else {
                this.records.push(newRecord) // Insert new
            }

            this.saveState()
        },
        saveState() {
            localStorage.setItem('presensi_records', JSON.stringify(this.records))
        }
    }
})
