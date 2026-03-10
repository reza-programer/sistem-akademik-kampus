import os

filepath = r'c:\laragon\www\Uniku\src\stores\tugas.js'

code = """import { defineStore } from 'pinia'

export const useTugasStore = defineStore('tugas', {
    state: () => ({
        tugasList: [
            {
                id: 1,
                matkul: 'Sistem Operasi',
                kelas: 'SINFC-2026-01',
                judul: 'Tugas 1: Manajemen Memori',
                deskripsi: 'Buatlah makalah minimal 5 halaman menjelaskan konsep paging dan segmentation.',
                deadline: '2026-04-15T23:59:00',
                createdAt: '2026-03-01T10:00:00',
                dosenId: 2,
                fileUrl: null
            },
            {
                id: 2,
                matkul: 'Pemrograman Web 1',
                kelas: 'SINFC-2026-01',
                judul: 'Tugas 2: Desain HTML Dasar',
                deskripsi: 'Buat halaman profile menggunakan HTML dan CSS murni.',
                deadline: '2026-04-10T23:59:00',
                createdAt: '2026-03-05T08:00:00',
                dosenId: 2,
                fileUrl: null
            }
        ],
        submisiList: [
            {
                id: 1,
                tugasId: 1,
                nim: '20260001',
                waktuSubmit: '2026-04-10T14:30:00',
                catatan: 'Ini tugas saya pak. Terima kasih.',
                fileName: 'Tugas1_AhmadFauzi_OS.pdf',
                fileDataUrl: null, 
                nilai: null,
                feedbackDosen: null
            }
        ]
    }),
    getters: {
        getTugasByKelas: (state) => (kelas) => state.tugasList.filter(t => t.kelas === kelas),
        getSubmisiByTugas: (state) => (tugasId) => state.submisiList.filter(s => s.tugasId === tugasId),
        getSubmisiByNimTugas: (state) => (nim, tugasId) => state.submisiList.find(s => s.nim === nim && s.tugasId === tugasId),
        getDaftarMatkulDosen: (state) => {
            const matkul = new Set()
            state.tugasList.forEach(t => matkul.add(t.matkul))
            return Array.from(matkul)
        }
    },
    actions: {
        addTugas(tugas) {
            this.tugasList.push({
                ...tugas,
                id: this.tugasList.length + 1,
                createdAt: new Date().toISOString()
            })
        },
        submitAssignment(submisiInfo) {
            const existingIndex = this.submisiList.findIndex(s => s.tugasId === submisiInfo.tugasId && s.nim === submisiInfo.nim)
            
            const payload = {
                ...submisiInfo,
                id: existingIndex >= 0 ? this.submisiList[existingIndex].id : this.submisiList.length + 1,
                waktuSubmit: new Date().toISOString(),
                nilai: null,
                feedbackDosen: null
            }

            if(existingIndex >= 0) {
                this.submisiList[existingIndex] = payload
            } else {
                this.submisiList.push(payload)
            }
        },
        gradeSubmission(submisiId, nilai, feedback) {
            const sumbisi = this.submisiList.find(s => s.id === submisiId)
            if(sumbisi) {
                sumbisi.nilai = nilai
                sumbisi.feedbackDosen = feedback
            }
        }
    }
})"""

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(code)

print("Tugas JS created via python as strict utf-8")
