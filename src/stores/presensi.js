import { defineStore } from 'pinia';
import { useAuthStore } from './auth';

const API_URL = 'http://localhost:5000/api';

export const usePresensiStore = defineStore('presensi', {
    state: () => ({
        historyPresensi: [] // Presensi data fetched from backend
    }),
    getters: {
        getPresensiByJadwal: (state) => {
            return (idJadwal) => state.historyPresensi.filter(p => p.idJadwal === idJadwal);
        }
    },
    actions: {
        async fetchPresensiDosen(idJadwal) {
            try {
                const res = await fetch(`${API_URL}/presensi/${idJadwal}`);
                const data = await res.json();
                this.historyPresensi = data;
            } catch (err) {
                console.error("Gagal load presensi:", err);
            }
        },
        async bukaSesiPresensi(payload) {
            try {
                // Generate secure random Token
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                let randomToken = '';
                for (let i = 0; i < 6; i++) {
                    randomToken += chars.charAt(Math.floor(Math.random() * chars.length));
                }

                const obj = {
                    idJadwal: payload.idJadwal,
                    pertemuan: payload.pertemuan || this.historyPresensi.length + 1,
                    tanggal: new Date().toISOString().split('T')[0],
                    metode: payload.metode,
                    materi: payload.materi,
                    token: randomToken
                };

                const res = await fetch(`${API_URL}/presensi/buka`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(obj)
                });

                const data = await res.json();
                if (data.success) {
                    await this.fetchPresensiDosen(payload.idJadwal);
                    return randomToken;
                }
            } catch (err) {
                console.error(err);
            }
            return null;
        }
    }
});
