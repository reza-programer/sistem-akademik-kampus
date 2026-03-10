<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Input Nilai Mahasiswa</h1>
        <p class="text-slate-500 text-sm mt-1">Masukkan komponen nilai UTS, UAS, dan Tugas</p>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden p-6">
      
      <!-- Filter Kelas -->
      <div class="flex space-x-4 mb-6">
        <div class="flex-1">
          <label class="block text-sm font-medium text-slate-700 mb-1">Pilih Kelas Mata Kuliah</label>
          <select v-model="selectedMatkul" class="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-200">
            <option value="">-- Pilih Mata Kuliah --</option>
            <option v-for="mk in daftarMatkul" :key="mk.kode" :value="mk.kode">{{ mk.nama }} ({{ mk.kode }})</option>
          </select>
        </div>
      </div>

      <!-- Tabel Input Nilai -->
      <div v-if="selectedMatkul" class="overflow-x-auto border border-slate-100 rounded-xl">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50 text-slate-700 font-medium border-b border-slate-200">
            <tr>
              <th class="px-4 py-3 w-16 text-center">No</th>
              <th class="px-4 py-3">NIM Mahasiswa</th>
              <th class="px-4 py-3 w-28 text-center">Tugas (20%)</th>
              <th class="px-4 py-3 w-28 text-center">UTS (30%)</th>
              <th class="px-4 py-3 w-28 text-center">UAS (50%)</th>
              <th class="px-4 py-3 w-24 text-center bg-primary-50 text-primary-700">Nilai Akhir</th>
              <th class="px-4 py-3 w-20 text-center bg-primary-50 text-primary-700">Grade</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="daftarMahasiswa.length === 0">
               <td colspan="7" class="px-4 py-8 text-center opacity-60">Tidak ada mahasiswa yang mengambil mata kuliah ini di kelas Anda, atau KRS belum disetujui.</td>
            </tr>
            <tr class="hover:bg-slate-50 transition" v-for="(mhs, idx) in daftarMahasiswa" :key="mhs.nim">
              <td class="px-4 py-3 text-center text-slate-400">{{ idx + 1 }}</td>
              <td class="px-4 py-3">
                <div class="font-bold text-slate-800">{{ getStudentName(mhs.nim) }}</div>
                <div class="text-xs text-slate-500 font-mono mt-0.5">{{ mhs.nim }}</div>
              </td>
              <td class="px-4 py-3">
                <input v-model.number="mhs.input.tugas" @input="kalkulasi(mhs)" type="number" min="0" max="100" class="w-full text-center p-1.5 border border-slate-200 rounded filter outline-none focus:border-primary-500">
              </td>
              <td class="px-4 py-3">
                <input v-model.number="mhs.input.uts" @input="kalkulasi(mhs)" type="number" min="0" max="100" class="w-full text-center p-1.5 border border-slate-200 rounded filter outline-none focus:border-primary-500">
              </td>
              <td class="px-4 py-3">
                <input v-model.number="mhs.input.uas" @input="kalkulasi(mhs)" type="number" min="0" max="100" class="w-full text-center p-1.5 border border-slate-200 rounded filter outline-none focus:border-primary-500">
              </td>
              <td class="px-4 py-3 text-center font-bold text-slate-800 bg-primary-50/50">
                {{ mhs.calc.akhir }}
              </td>
              <td class="px-4 py-3 text-center font-bold bg-emerald-50/50" :class="mhs.calc.grade === 'E' ? 'text-red-500' : 'text-emerald-600'">
                {{ mhs.calc.grade }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="!selectedMatkul" class="py-10 text-center text-slate-400 opacity-60">
         Silakan pilih mata kuliah di atas terlebih dahulu untuk memunculkan daftar mahasiswa.
      </div>

      <div class="mt-6 flex justify-end" v-if="selectedMatkul && daftarMahasiswa.length > 0">
        <button @click="simpanNilai" class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-xl text-sm transition font-medium flex items-center shadow-lg shadow-primary-500/30">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
          Simpan Nilai Kelas
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Swal from 'sweetalert2'
import { useKrsStore } from '@/stores/krs'

const krsStore = useKrsStore()
const selectedMatkul = ref('')

// Generate list of unique matkul from approved students
const daftarMatkul = computed(() => {
   const matkuls = {}
   Object.values(krsStore.krsData).forEach(data => {
      if(data.status === 'approved') {
         data.matkul.forEach(mk => {
            if(!matkuls[mk.kode]) matkuls[mk.kode] = { kode: mk.kode, nama: mk.nama }
         })
      }
   })
   return Object.values(matkuls)
})

const getStudentName = (nim) => {
   if(nim === '20260001') return 'Andi Wijaya'
   return `Mahasiswa ${parseInt(nim.slice(-4))}`
}

const daftarMahasiswa = ref([])

// When matkul changes, populate students
watch(selectedMatkul, (kodeBaru) => {
   if(!kodeBaru) {
      daftarMahasiswa.value = []
      return
   }
   
   const mhsArray = []
   Object.entries(krsStore.krsData).forEach(([nim, data]) => {
      if(data.status === 'approved') {
         const mk = data.matkul.find(m => m.kode === kodeBaru)
         if(mk) {
            // Restore previous inputs if existed, use dummy algorithm to break apart final grade
            let t = mk.nilaiAkhir || 0, uts = mk.nilaiAkhir || 0, uas = mk.nilaiAkhir || 0
            
            mhsArray.push({
               nim: nim,
               input: { tugas: t, uts: uts, uas: uas },
               calc: { akhir: mk.nilaiAkhir || 0, grade: mk.grade || '-', bobot: mk.bobot || 0 }
            })
         }
      }
   })
   daftarMahasiswa.value = mhsArray
})

const hitungGradeDanBobot = (akhir) => {
   if (akhir >= 85) return { grade: 'A', bobot: 4.00 }
   if (akhir >= 80) return { grade: 'A-', bobot: 3.70 }
   if (akhir >= 75) return { grade: 'B+', bobot: 3.30 }
   if (akhir >= 70) return { grade: 'B', bobot: 3.00 }
   if (akhir >= 65) return { grade: 'B-', bobot: 2.70 }
   if (akhir >= 60) return { grade: 'C+', bobot: 2.30 }
   if (akhir >= 55) return { grade: 'C', bobot: 2.00 }
   if (akhir >= 40) return { grade: 'D', bobot: 1.00 }
   return { grade: 'E', bobot: 0.00 }
}

const kalkulasi = (mhs) => {
   const tugas = Number(mhs.input.tugas) || 0
   const uts = Number(mhs.input.uts) || 0
   const uas = Number(mhs.input.uas) || 0
   
   const akhir = (tugas * 0.2) + (uts * 0.3) + (uas * 0.5)
   mhs.calc.akhir = akhir.toFixed(1)
   
   const gb = hitungGradeDanBobot(akhir)
   mhs.calc.grade = gb.grade
   mhs.calc.bobot = gb.bobot
}

const simpanNilai = () => {
    // Inject all into krs store
    daftarMahasiswa.value.forEach(mhs => {
       krsStore.setNilai(mhs.nim, selectedMatkul.value, mhs.calc.akhir, mhs.calc.grade, mhs.calc.bobot)
    })

    Swal.fire({
      icon: 'success',
      title: 'Tersimpan!',
      text: 'Nilai mahasiswa untuk mata kuliah ini berhasil disimpan tanpa dummy! Cek Mahasiswa -> KHS secara reaktif.',
      confirmButtonColor: '#10b981',
      timer: 3500
    })
}
</script>
