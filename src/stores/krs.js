import { defineStore } from 'pinia';
import { useAuthStore } from './auth';

const API_URL = 'http://localhost:5000/api';

export const useKrsStore = defineStore('krs', {
    state: () => ({
        krsList: [],          // Overview of all semesters
        currentDetails: [],   // Details of the latest KRS
        selectedMatkul: [],   // Cart for drafting
        krsData: {},
        maxSks: 24
    }),
    getters: {
        totalSksSelected: (state) => {
            return state.selectedMatkul.reduce((acc, current) => acc + current.sks, 0);
        },
        riwayatKrs: (state) => {
            return state.krsList;
        }
    },
    actions: {
        approveKRSFromDosen(nim) {
            if (!nim) return;
            if (!this.krsData) this.krsData = {};
            if (!this.krsData[nim]) return;
            this.krsData = {
                ...this.krsData,
                [nim]: {
                    ...this.krsData[nim],
                    status: 'approved'
                }
            };
        },
        rejectKRSFromDosen(nim) {
            if (!nim) return;
            if (!this.krsData) this.krsData = {};
            if (!this.krsData[nim]) return;
            this.krsData = {
                ...this.krsData,
                [nim]: {
                    ...this.krsData[nim],
                    status: 'rejected'
                }
            };
        },
        async fetchKrsMahasiswa() {
            try {
                const auth = useAuthStore();
                if (!auth.user || auth.user.role !== 'mahasiswa') return;
                
                const res = await fetch(`${API_URL}/krs/${auth.user.username}`);
                const data = await res.json();
                
                if (data.krs) {
                    this.krsList = data.krs;
                    this.currentDetails = data.currentDetails;
                }
            } catch (err) {
                console.error("Gagal load KRS:", err);
            }
        },
        addToKrs(jadwalLengkap) {
            const exists = this.selectedMatkul.find(item => item.idJadwal === jadwalLengkap.idJadwal);
            if (!exists) {
                this.selectedMatkul.push(jadwalLengkap);
            }
        },
        removeFromKrs(idJadwal) {
            this.selectedMatkul = this.selectedMatkul.filter(item => item.idJadwal !== idJadwal);
        },
        async submitKRS() {
            try {
                const auth = useAuthStore();
                if (!auth.user) return false;

                const jadwal_ids = this.selectedMatkul.map(j => j.idJadwal);
                
                const res = await fetch(`${API_URL}/krs/submit`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nim: auth.user.username,
                        semester: 1, // Example, should be dynamic based on user profile
                        total_sks: this.totalSksSelected,
                        jadwal_ids
                    })
                });
                
                const data = await res.json();
                if (data.success) {
                    // Automatically generate bill
                    await fetch(`${API_URL}/tagihan`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            nim: auth.user.username,
                            jenis_tagihan: 'SPP / UKT Semester ' + 1,
                            nominal: 5000000 + (this.totalSksSelected * 150000), // example formula
                            tenggat_waktu: new Date(Date.now() + 30*24*60*60*1000).toISOString().slice(0, 19).replace('T', ' '),
                            order_id: 'TRX-UKT-' + Date.now()
                        })
                    });

                    this.selectedMatkul = [];
                    await this.fetchKrsMahasiswa();
                    return true;
                }
                return false;
            } catch (e) {
                console.error(e);
                return false;
            }
        }
    }
});
