import { defineStore } from 'pinia';
import { useAuthStore } from './auth';

const API_URL = 'http://localhost:5000/api';

export const useKeuanganStore = defineStore('keuangan', {
    state: () => ({
        tagihanList: []
    }),
    getters: {
        totalTagihan: (state) => {
            return state.tagihanList
                .filter(t => t.status === 'Belum Dibayar')
                .reduce((acc, curr) => acc + parseFloat(curr.nominal), 0);
        },
        riwayatPembayaran: (state) => {
            return state.tagihanList.filter(t => t.status === 'Lunas');
        },
        tagihanAktifByNim: (state) => {
            return (nim) => state.tagihanList.filter(t => t.status !== 'Lunas');
        }
    },
    actions: {
        async fetchTagihan() {
            try {
                const auth = useAuthStore();
                if (!auth.user || auth.user.role !== 'mahasiswa') return;

                const res = await fetch(`${API_URL}/tagihan/${auth.user.username}`);
                const data = await res.json();
                this.tagihanList = data;
            } catch (err) {
                console.error("Gagal load tagihan:", err);
            }
        },
        async initPayment(tagihanId) {
            // Mock payment process for now
            // Update tagihan status in database
            try {
                // Because we didn't add a strict PUT route for payment in server.js,
                // we'll mock the UI state change. Usually you would hit a Midtrans/Payment gateway 
                // and a webhook would update the DB. For this demo we'll just mock it.
                const tagihan = this.tagihanList.find(t => t.id === tagihanId);
                if (tagihan) {
                    tagihan.status = 'Lunas';
                }
            } catch(e) {
                console.error(e);
            }
        }
    }
});
