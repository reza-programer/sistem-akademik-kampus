import { defineStore } from 'pinia'

export const useKeuanganStore = defineStore('keuangan', {
    state: () => ({
        // Dummy data tagihan mahasiswa
        tagihanData: [
            {
                id: 'INV-2026-01',
                semester: '1 (Ganjil 2026/2027)',
                jenis: 'Uang Kuliah Tunggal (UKT) & Biaya Gedung',
                nominal: 4500000,
                batasPembayaran: '2026-08-15',
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
