import { defineStore } from 'pinia';

const API_URL = 'http://localhost:5000/api';

export const useMasterDataStore = defineStore('masterData', {
    state: () => ({
        dosenList: [],
        matkulList: [],
        kelasList: [],
        jadwalMengajar: []
    }),
    getters: {
        jadwalLengkap: (state) => {
            return state.jadwalMengajar; // Backend already JOINs required data
        },
        jadwalDosen: (state) => {
            return (idDosen) => state.jadwalMengajar.filter(j => j.idDosen === idDosen);
        },
        jadwalKelas: (state) => {
            return (idKelas) => state.jadwalMengajar.filter(j => j.idKelas === idKelas);
        },
        getMatkulBySemester: (state) => {
            return (semester) => state.matkulList.filter(m => m.semester === semester);
        }
    },
    actions: {
        async fetchAll() {
            try {
                const [dosen, matkul, kelas, jadwal] = await Promise.all([
                    fetch(`${API_URL}/master/dosen`).then(r => r.json()),
                    fetch(`${API_URL}/master/matkul`).then(r => r.json()),
                    fetch(`${API_URL}/master/kelas`).then(r => r.json()),
                    fetch(`${API_URL}/master/jadwal`).then(r => r.json())
                ]);
                this.dosenList = dosen;
                this.matkulList = matkul;
                this.kelasList = kelas;
                this.jadwalMengajar = jadwal;
            } catch (err) {
                console.error("Gagal load master data:", err);
            }
        },
        async tambahJadwal(jadwalBaru) {
            try {
                jadwalBaru.idJadwal = 'JDW-' + Date.now().toString().slice(-4);
                const res = await fetch(`${API_URL}/master/jadwal`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(jadwalBaru)
                });
                const data = await res.json();
                if (data.success) {
                    await this.fetchAll();
                }
            } catch (e) {
                console.error(e);
            }
        },
        hapusJadwal(idJadwal) {
            this.jadwalMengajar = this.jadwalMengajar.filter(j => j.idJadwal !== idJadwal);
        }
    }
});
