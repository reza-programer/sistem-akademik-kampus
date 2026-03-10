import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { useNotificationStore } from './notification'

export const useKrsStore = defineStore('krs', {
    state: () => ({
        // Kuota SKS maksimal
        maxSks: 24,
        // Menyimpan data perwalian berdasarkan NIM user
        // Format: { '20260001': { status: 'draft', matkul: [] } }
        krsData: JSON.parse(localStorage.getItem('krs_all_data')) || {}
    }),
    getters: {
        currentUserNIM: () => {
            const authStore = useAuthStore()
            return authStore.user?.nim || 'default'
        },
        currentKrs: (state) => {
            const nim = useKrsStore().currentUserNIM
            if (!state.krsData[nim]) {
                return { status: 'draft', matkul: [] }
            }
            return state.krsData[nim]
        },
        status: (state) => {
            return state.currentKrs.status
        },
        selectedMatkul: (state) => {
            return state.currentKrs.matkul
        },
        totalSks: (state) => {
            return state.currentKrs.matkul.reduce((total, mk) => total + mk.sks, 0)
        },
        isDraft: (state) => state.currentKrs.status === 'draft',
        isPending: (state) => state.currentKrs.status === 'pending',
        isApproved: (state) => state.currentKrs.status === 'approved'
    },
    actions: {
        _initUserRecord() {
            const nim = this.currentUserNIM
            if (!this.krsData[nim]) {
                this.krsData[nim] = { status: 'draft', matkul: [] }
            }
            return nim
        },
        addMatkul(matkul) {
            const nim = this._initUserRecord()

            if (this.krsData[nim].status !== 'draft' && this.krsData[nim].status !== 'rejected') return false

            // Check if already exist
            const exists = this.krsData[nim].matkul.find(m => m.kode === matkul.kode)
            if (exists) return false

            // Check SKS limit
            const currentTotal = this.krsData[nim].matkul.reduce((acc, m) => acc + m.sks, 0)
            if (currentTotal + matkul.sks > this.maxSks) return false

            this.krsData[nim].matkul.push(matkul)
            this.saveState()
            return true
        },
        removeMatkul(kode) {
            const nim = this._initUserRecord()
            if (this.krsData[nim].status !== 'draft' && this.krsData[nim].status !== 'rejected') return false

            this.krsData[nim].matkul = this.krsData[nim].matkul.filter(m => m.kode !== kode)
            this.saveState()
            return true
        },
        ajukanKRS() {
            const nim = this._initUserRecord()
            if (this.krsData[nim].matkul.length === 0) return false
            this.krsData[nim].status = 'pending'
            this.saveState()

            // Trigger Notifikasi ke Dosen
            const notifStore = useNotificationStore()
            notifStore.addNotification('dosen', {
                title: 'Pengajuan KRS Baru',
                message: `Mahasiswa dengan NIM ${nim} telah mengajukan KRS untuk ditinjau.`,
                type: 'warning'
            })

            return true
        },
        approveKRSFromDosen(nim) {
            if (!this.krsData[nim]) return
            this.krsData[nim].status = 'approved'
            this.saveState()

            // Trigger Notifikasi ke Mahasiswa
            const notifStore = useNotificationStore()
            notifStore.addNotification('mahasiswa', {
                title: 'KRS Disetujui',
                message: `Pengajuan Kartu Rencana Studi (KRS) Anda telah disetujui Dosen Wali.`,
                type: 'success'
            })
        },
        rejectKRSFromDosen(nim) {
            if (!this.krsData[nim]) return
            this.krsData[nim].status = 'rejected'
            this.saveState()

            // Trigger Notifikasi ke Mahasiswa
            const notifStore = useNotificationStore()
            notifStore.addNotification('mahasiswa', {
                title: 'KRS Ditolak',
                message: `Pengajuan KRS Anda ditolak oleh Dosen Wali. Silakan merevisi pilihan Anda.`,
                type: 'info'
            })
        },
        resetKRS() { // Reset KRS Diri Sendiri (Sisi Mahasiswa ketika revise)
            const nim = this._initUserRecord()
            this.krsData[nim].status = 'draft'
            this.krsData[nim].matkul = []
            this.saveState()
        },
        setNilai(nim, kodeMatkul, nilaiAkhir, grade, bobot) {
            if (this.krsData[nim] && this.krsData[nim].matkul) {
                const mk = this.krsData[nim].matkul.find(m => m.kode === kodeMatkul)
                if (mk) {
                    mk.nilaiAkhir = nilaiAkhir
                    mk.grade = grade
                    mk.bobot = bobot
                    this.saveState()
                }
            }
        },
        saveState() {
            localStorage.setItem('krs_all_data', JSON.stringify(this.krsData))
        }
    }
})
