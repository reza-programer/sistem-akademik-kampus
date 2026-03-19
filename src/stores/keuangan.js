import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const useKeuanganStore = defineStore('keuangan', {
    state: () => ({
        // Tagihan data from localStorage or default
        tagihanData: JSON.parse(localStorage.getItem('keuangan_tagihan')) || [],
        // Biaya per semester (dikelola admin)
        biayaSemester: JSON.parse(localStorage.getItem('keuangan_biaya_semester')) || []
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
            return state.tagihanData
                .filter(t => t.status === 'Lunas')
                .sort((a, b) => new Date(b.tanggalBayar) - new Date(a.tanggalBayar))
        },
        // Getter yang difilter per NIM (untuk mahasiswa)
        tagihanAktifByNim: (state) => {
            return (nim) => state.tagihanData.filter(t => t.status === 'Belum Lunas' && (!t.nim || t.nim === nim))
        },
        totalTagihanPendingByNim: (state) => {
            return (nim) => state.tagihanData
                .filter(t => t.status === 'Belum Lunas' && (!t.nim || t.nim === nim))
                .reduce((total, t) => total + t.nominal, 0)
        },
        riwayatPembayaranByNim: (state) => {
            return (nim) => state.tagihanData
                .filter(t => t.status === 'Lunas' && (!t.nim || t.nim === nim))
                .sort((a, b) => new Date(b.tanggalBayar) - new Date(a.tanggalBayar))
        }
    },
    actions: {
        bayarTagihan(id, metode) {
            const index = this.tagihanData.findIndex(t => t.id === id)
            if (index !== -1) {
                this.tagihanData[index].status = 'Lunas'
                this.tagihanData[index].tanggalBayar = new Date().toISOString().slice(0, 10)
                this.tagihanData[index].metode = metode
                this._save()
            }
        },
        addTagihanFromKRS(nim, totalBiaya, matkulList) {
            // Cek jika sudah ada tagihan KRS untuk semester ini
            const invoiceId = `INV-KRS-${nim}-${Date.now()}`
            const rincian = matkulList.map(mk => `${mk.nama} (${mk.sks} SKS)`).join(', ')
            
            this.tagihanData.push({
                id: invoiceId,
                semester: 'Genap 2025/2026',
                jenis: 'Biaya Studi KRS (UKT)',
                nominal: totalBiaya,
                batasPembayaran: '2026-04-15',
                status: 'Belum Lunas',
                tanggalBayar: null,
                metode: null,
                rincian: rincian,
                nim: nim
            })
            this._save()
        },

        // ========== ADMIN: Kelola Biaya Per Semester ==========
        addBiayaSemester(data) {
            const biayaId = 'BS-' + Date.now()
            const biayaBaru = {
                id: biayaId,
                semester: data.semester,
                jenis: data.jenis,
                nominal: Number(data.nominal),
                batasPembayaran: data.batasPembayaran,
                createdAt: new Date().toISOString().slice(0, 10)
            }

            // Simpan ke daftar biaya semester
            this.biayaSemester.push(biayaBaru)
            this._saveBiayaSemester()

            // Generate tagihan ke semua mahasiswa yang terdaftar
            const authStore = useAuthStore()
            authStore.mahasiswaDB.forEach(mhs => {
                const invoiceId = `INV-${data.jenis.toUpperCase().replace(/\s/g, '')}-${mhs.user.nim}-${Date.now()}`
                this.tagihanData.push({
                    id: invoiceId,
                    semester: data.semester,
                    jenis: `${data.jenis} - ${data.semester}`,
                    nominal: Number(data.nominal),
                    batasPembayaran: data.batasPembayaran,
                    status: 'Belum Lunas',
                    tanggalBayar: null,
                    metode: null,
                    rincian: `Biaya ${data.jenis} semester ${data.semester}`,
                    biayaSemesterId: biayaId,
                    nim: mhs.user.nim
                })
            })
            this._save()
        },

        deleteBiayaSemester(id) {
            // Hapus biaya semester
            this.biayaSemester = this.biayaSemester.filter(b => b.id !== id)
            this._saveBiayaSemester()

            // Hapus tagihan terkait yang masih belum lunas
            this.tagihanData = this.tagihanData.filter(t => !(t.biayaSemesterId === id && t.status === 'Belum Lunas'))
            this._save()
        },

        _save() {
            localStorage.setItem('keuangan_tagihan', JSON.stringify(this.tagihanData))
        },
        _saveBiayaSemester() {
            localStorage.setItem('keuangan_biaya_semester', JSON.stringify(this.biayaSemester))
        }
    }
})
