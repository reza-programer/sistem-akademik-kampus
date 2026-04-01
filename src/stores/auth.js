import { defineStore } from 'pinia';

const API_URL = 'http://localhost:5000/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        role: localStorage.getItem('role') || null,
        calonMahasiswa: [],
        mahasiswaDB: []
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
        currentRole: (state) => state.role
    },
    actions: {
        async login(username, password) {
            try {
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: username.trim(), password: password.trim() })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    this.setAuth(data.user, data.token, data.user.role);
                    return data.user.role;
                } else {
                    return Promise.reject(data.error || 'Username atau password salah');
                }
            } catch (err) {
                return Promise.reject('Koneksi ke server gagal: ' + err.message);
            }
        },
        setAuth(user, token, role) {
            this.user = user;
            this.token = token;
            this.role = role;
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
        },
        logout() {
            this.user = null;
            this.token = null;
            this.role = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('role');
        },
        async registerCamaba(formData) {
            try {
                const id = 'C-' + Date.now();
                // Mapping field frontend -> backend
                const payload = {
                    id,
                    nama: formData.nama,
                    email: formData.email,
                    no_hp: formData.nohp || formData.no_hp || '',
                    asal_sekolah: formData.asal_sekolah || formData.asalSekolah || '-',
                    prodi: formData.prodi,
                    jalur: formData.jalur || 'Reguler',
                    password: formData.password,
                    tanggalDaftar: new Date().toISOString()
                };
                const response = await fetch(`${API_URL}/auth/register-camaba`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await response.json();
                if (!data.success) throw new Error(data.error);
                return true;
            } catch(e) {
                console.error(e);
                return false;
            }
        },
        async fetchCalonMahasiswa() {
            try {
                const res = await fetch(`${API_URL}/auth/calon-mahasiswa`);
                const data = await res.json();
                this.calonMahasiswa = data;
                return data;
            } catch(e) { console.error(e); }
        },
        async fetchMahasiswa() {
            try {
                const res = await fetch(`${API_URL}/mahasiswa`);
                const data = await res.json();
                this.mahasiswaDB = data.map(m => ({
                    role: 'mahasiswa',
                    username: m.nim,
                    user: m
                }));
            } catch(e) { console.error(e); }
        },
        async approveCamaba(id, selectedKelas) {
            try {
                const count = Math.floor(Math.random() * 1000); 
                const no = String(count).padStart(4, '0');
                const nim = `2026${no}`;

                const response = await fetch(`${API_URL}/auth/approve-camaba`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, nim, idKelas: selectedKelas })
                });
                const data = await response.json();
                if (data.success) {
                    await this.fetchCalonMahasiswa();
                    await this.fetchMahasiswa();
                    return data.nim;
                }
            } catch (e) {
                console.error(e);
                return null;
            }
        },
        async forgotPassword(identifier) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ name: 'User', email: 'user@uniku.ac.id' });
                }, 1000);
            });
        },
        updateMahasiswaData(username, data) {
            const idx = this.mahasiswaDB.findIndex(m => m.username === username);
            if (idx !== -1) {
                this.mahasiswaDB[idx] = { ...this.mahasiswaDB[idx], ...data };
                return true;
            }
            return false;
        },
        rejectCamaba(id) {
            this.calonMahasiswa = this.calonMahasiswa.filter(c => c.id !== id);
        }
    }
});
