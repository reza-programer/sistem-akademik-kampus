import { defineStore } from 'pinia'

export const useKeuanganStore = defineStore('keuangan', {
    state: () => ({
        // Dummy data tagihan mahasiswa
        tagihanData: [
            {
                id: 'INV-2026-01',
                semester: '1 (Ganjil 2026/2024)',
                jenis: 'Uang Kuliah Tunggal (UKT)',
                nominal: 4500000,
                batasPembayaran: '2026-08-15',
                status: 'Lunas',
                tanggalBayar: '2026-08-10',
                metode: 'BCA Virtual Account'
            },
            {
                id: 'INV-2026-02',
                semester: '2 (Genap 2026/2024)',
                jenis: 'Uang Kuliah Tunggal (UKT)',
                nominal: 4500000,
                batasPembayaran: '2024-02-15',
                status: 'Lunas',
                tanggalBayar: '2024-02-05',
                metode: 'Mandiri Virtual Account'
            },
            {
                id: 'INV-2024-03',
                semester: '3 (Ganjil 2024/2025)',
                jenis: 'Uang Kuliah Tunggal (UKT)',
                nominal: 4500000,
                batasPembayaran: '2024-08-15',
                status: 'Lunas',
                tanggalBayar: '2024-08-01',
                metode: 'BCA Virtual Account'
            },
            {
                id: 'INV-2024-04',
                semester: '4 (Genap 2024/2025)',
                jenis: 'Uang Kuliah Tunggal (UKT)',
                nominal: 4500000,
                batasPembayaran: '2025-02-15',
                status: 'Belum Lunas',
                tanggalBayar: null,
                metode: null
            }
        ]
    }),
    getters: {
        totalTagihanPending: (state) => {
            return state.tagihanData
                .filter(t => t.status === 'Belum Lunas')
                .reduce((total, t) => total + t.nominal, 0)
        },
        tagihanAktif: (state) => {
            return state.tagihanData.filter(t => t.status === 'Belum Lunas')
        },
        riwayatPembayaran: (state) => {
            // Urutkan riwayat pembayaran terbaru ke terlama
            return state.tagihanData
                .filter(t => t.status === 'Lunas')
                .sort((a, b) => new Date(b.tanggalBayar) - new Date(a.tanggalBayar))
        }
    },
    actions: {
        bayarTagihan(id, metode) {
            const index = this.tagihanData.findIndex(t => t.id === id)
            if (index !== -1) {
                this.tagihanData[index].status = 'Lunas'
                // Set tanggal pembayaran hari ini YYYY-MM-DD
                this.tagihanData[index].tanggalBayar = new Date().toISOString().slice(0, 10)
                this.tagihanData[index].metode = metode
            }
        }
    }
})
