import { defineStore } from 'pinia'

// Default Dummy Database 30 Mahasiswa
const defaultDummy = Array.from({ length: 30 }, (_, i) => {
    const no = String(i + 1).padStart(4, '0')
    const nim = `2026${no}`
    return {
        username: nim,
        password: 'password123', // Default password untuk semua dummy
        user: { id: i + 10, name: `Mahasiswa Dummy ${i + 1}`, nim: nim, email: `${nim}@uniku.ac.id` },
        token: `token_mhs_${nim}`,
        role: 'mahasiswa'
    }
})

export const useAuthStore = defineStore('auth', {
    state: () => {
        let db = JSON.parse(localStorage.getItem('mahasiswaDB')) || defaultDummy
        
        // Data Migration: Pastikan semua mhs punya email (untuk stale data di localStorage)
        let migrated = false
        db = db.map(m => {
            if (m.user && !m.user.email) {
                migrated = true
                return { ...m, user: { ...m.user, email: `${m.username}@uniku.ac.id` } }
            }
            return m
        })
        
        if (migrated) {
            localStorage.setItem('mahasiswaDB', JSON.stringify(db))
        }

        return {
            user: JSON.parse(localStorage.getItem('user')) || null,
            token: localStorage.getItem('token') || null,
            role: localStorage.getItem('role') || null,
            mahasiswaDB: db,
            calonMahasiswa: JSON.parse(localStorage.getItem('calonMahasiswa')) || []
        }
    },
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
                        this.setAuth({ id: 'D01', nidn: '0411122201', username: '0411122201', name: 'Budi Santoso, M.Kom' }, 'dosen_token_123', 'dosen')
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
        approveCamaba(id, selectedKelas) {
            const idx = this.calonMahasiswa.findIndex(c => c.id === id)
            if (idx !== -1) {
                const camaba = this.calonMahasiswa[idx]

                // Generate logic NIM. Misal: 2026 + urutan dari database
                const count = this.mahasiswaDB.length + 1
                const no = String(count).padStart(4, '0')
                const nim = `2026${no}`

                const instEmail = `${nim}@uniku.ac.id` // Generate Email Institusi
                const newMhs = {
                    username: nim,
                    password: camaba.password,
                    user: { 
                        id: Date.now(), 
                        name: camaba.nama, 
                        nim: nim, 
                        personalEmail: camaba.email, // Simpan email pribadi
                        email: instEmail,            // Email resmi kampus
                        prodi: camaba.prodi, 
                        idKelas: selectedKelas 
                    },
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
        },
        updateMahasiswaData(username, newData) {
            const idx = this.mahasiswaDB.findIndex(m => m.username === username)
            if (idx !== -1) {
                // Gunakan Object.assign agar sinkronisasinya deep-reactive
                Object.assign(this.mahasiswaDB[idx].user, newData)
                // Trigger pinia reactivity dgn merestrukturisasi array reference
                this.mahasiswaDB = [...this.mahasiswaDB]

                // Jika mahasiswa yg diedit itu sedang login
                if (this.user && (this.user.nim === username || this.user.username === username)) {
                    Object.assign(this.user, newData)
                    localStorage.setItem('user', JSON.stringify(this.user))
                }

                localStorage.setItem('mahasiswaDB', JSON.stringify(this.mahasiswaDB))
                return true
            }
            return false
        },
        forgotPassword(identifier) {
            return new Promise((resolve, reject) => {
                const id = identifier.trim()
                setTimeout(() => {
                    // Cek di DB Mahasiswa
                    const student = this.mahasiswaDB.find(s => s.username === id)
                    if (student) {
                        resolve({ name: student.user.name, email: student.user.email })
                    } else if (id === 'admin') {
                        resolve({ name: 'Administrator', email: 'admin@uniku.ac.id' })
                    } else if (id === 'dosen') {
                        resolve({ name: 'Budi Santoso', email: 'dosen@uniku.ac.id' })
                    } else {
                        reject('Identifier (NIM/ID) tidak ditemukan dalam sistem.')
                    }
                }, 1000)
            })
        }
    }
})
