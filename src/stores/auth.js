import { defineStore } from 'pinia'

// Default Dummy Database 30 Mahasiswa
const defaultDummy = Array.from({ length: 30 }, (_, i) => {
    const no = String(i + 1).padStart(4, '0')
    const nim = `2026${no}`
    return {
        username: nim,
        password: 'password123', // Default password untuk semua dummy
        user: { id: i + 10, name: `Mahasiswa Dummy ${i + 1}`, nim: nim },
        token: `token_mhs_${nim}`,
        role: 'mahasiswa'
    }
})

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        role: localStorage.getItem('role') || null, // 'admin', 'dosen', 'mahasiswa'
        mahasiswaDB: JSON.parse(localStorage.getItem('mahasiswaDB')) || defaultDummy,
        calonMahasiswa: JSON.parse(localStorage.getItem('calonMahasiswa')) || []
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
        currentRole: (state) => state.role
    },
    actions: {
        login(username, password) {
            // Dummy Authentication
            return new Promise((resolve, reject) => {
                const u = username.trim()
                const p = password.trim()

                setTimeout(() => {
                    // 1. Cek Admin
                    if (u === 'admin' && p === 'admin') {
                        this.setAuth({ id: 1, name: 'Administrator' }, 'admin_token_123', 'admin')
                        resolve('admin')
                    }
                    // 2. Cek Dosen
                    else if (username === 'dosen' && password === 'dosen') {
                        this.setAuth({ id: 2, name: 'Budi Santoso, M.Kom' }, 'dosen_token_123', 'dosen')
                        resolve('dosen')
                    }
                    // 3. Cek Mahasiswa
                    else {
                        const student = this.mahasiswaDB.find(s => s.username === u && s.password === p)
                        if (student) {
                            this.setAuth(student.user, student.token, student.role)
                            resolve(student.role)
                        } else {
                            reject('Username (NIM) atau password salah')
                        }
                    }
                }, 800)
            })
        },
        setAuth(user, token, role) {
            this.user = user
            this.token = token
            this.role = role
            localStorage.setItem('user', JSON.stringify(user))
            localStorage.setItem('token', token)
            localStorage.setItem('role', role)
        },
        logout() {
            this.user = null
            this.token = null
            this.role = null
            localStorage.removeItem('user')
            localStorage.removeItem('token')
            localStorage.removeItem('role')
        },
        registerCamaba(data) {
            this.calonMahasiswa.push({
                ...data,
                id: 'C-' + Date.now(),
                status: 'pending',
                tanggalDaftar: new Date().toISOString()
            })
            localStorage.setItem('calonMahasiswa', JSON.stringify(this.calonMahasiswa))
        },
        approveCamaba(id) {
            const idx = this.calonMahasiswa.findIndex(c => c.id === id)
            if (idx !== -1) {
                const camaba = this.calonMahasiswa[idx]

                // Generate logic NIM. Misal: 2026 + urutan dari database
                const count = this.mahasiswaDB.length + 1
                const no = String(count).padStart(4, '0')
                const nim = `2026${no}`

                const newMhs = {
                    username: nim,
                    password: camaba.password,
                    user: { id: Date.now(), name: camaba.nama, nim: nim, prodi: camaba.prodi },
                    token: `token_mhs_${nim}`,
                    role: 'mahasiswa'
                }

                // Tambahkan ke sistem MHS
                this.mahasiswaDB.unshift(newMhs)

                // Hapus dari calon mahasiswa
                this.calonMahasiswa.splice(idx, 1)

                localStorage.setItem('mahasiswaDB', JSON.stringify(this.mahasiswaDB))
                localStorage.setItem('calonMahasiswa', JSON.stringify(this.calonMahasiswa))

                return nim // return created NIM
            }
            return null
        },
        rejectCamaba(id) {
            this.calonMahasiswa = this.calonMahasiswa.filter(c => c.id !== id)
            localStorage.setItem('calonMahasiswa', JSON.stringify(this.calonMahasiswa))
        }
    }
})
