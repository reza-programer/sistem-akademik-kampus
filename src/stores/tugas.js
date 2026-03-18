import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

export const useTugasStore = defineStore('tugas', {
    state: () => ({
        tugasList: [],
        submisiList: [],
        isLoading: false,
        error: null
    }),
    getters: {
        getTugasByDosen: (state) => (dosenId) => state.tugasList.filter(t => t.dosenId === dosenId),
        getTugasByKelas: (state) => (kelas) => state.tugasList.filter(t => t.kelas === kelas),
        getSubmisiByTugas: (state) => (tugasId) => state.submisiList.filter(s => s.tugasId === parseInt(tugasId)),
        getSubmisiByNimTugas: (state) => (nim, tugasId) => state.submisiList.find(s => s.nim === nim && s.tugasId === parseInt(tugasId)),
        getDaftarMatkulDosen: (state) => {
            const matkul = new Set()
            state.tugasList.forEach(t => matkul.add(t.matkul))
            return Array.from(matkul)
        }
    },
    actions: {
        async fetchTugas() {
            this.isLoading = true
            try {
                const response = await axios.get(`${API_URL}/tugas`)
                this.tugasList = response.data
            } catch (err) {
                this.error = 'Gagal memuat daftar tugas'
                console.error(err)
            } finally {
                this.isLoading = false
            }
        },
        async addTugas(tugas) {
            try {
                const response = await axios.post(`${API_URL}/tugas`, tugas)
                this.tugasList.unshift(response.data)
                return response.data
            } catch (err) {
                console.error('Gagal menambah tugas:', err)
                throw err
            }
        },
        async hapusTugas(id) {
            try {
                await axios.delete(`${API_URL}/tugas/${id}`)
                this.tugasList = this.tugasList.filter(t => t.id !== id)
                this.submisiList = this.submisiList.filter(s => s.tugasId !== id)
            } catch (err) {
                console.error('Gagal menghapus tugas:', err)
                throw err
            }
        },
        async fetchSubmisi(tugasId) {
            try {
                const response = await axios.get(`${API_URL}/submisi/${tugasId}`)
                // Update submisiList with new data for this tugas, avoiding duplicates if any
                const otherSubmisi = this.submisiList.filter(s => s.tugasId !== parseInt(tugasId))
                this.submisiList = [...otherSubmisi, ...response.data]
            } catch (err) {
                console.error('Gagal memuat submisi:', err)
            }
        },
        async submitAssignment(submisiInfo) {
            try {
                const response = await axios.post(`${API_URL}/submisi`, submisiInfo)
                // Filter out old submission if it exists
                this.submisiList = this.submisiList.filter(s => !(s.tugasId === submisiInfo.tugasId && s.nim === submisiInfo.nim))
                this.submisiList.push(response.data)
                return response.data
            } catch (err) {
                console.error('Gagal mengirim submisi:', err)
                throw err
            }
        },
        async gradeSubmission(submisiId, nilai, feedback) {
            // Placeholder: Backend doesn't have grade route yet, but we'll add it if needed
            // For now, let's just update local state if we don't implement the route
            try {
                // If we had a PATCH route:
                // await axios.patch(`${API_URL}/submisi/${submisiId}`, { nilai, feedbackDosen: feedback })
                const idx = this.submisiList.findIndex(s => s.id === submisiId)
                if (idx !== -1) {
                    this.submisiList[idx] = { ...this.submisiList[idx], nilai, feedbackDosen: feedback || null }
                    this.submisiList = [...this.submisiList]
                }
            } catch (err) {
                console.error('Gagal memberi nilai:', err)
            }
        }
    }
})
