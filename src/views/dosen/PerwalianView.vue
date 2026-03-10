<template>
  <div class="space-y-6 relative">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold theme-text">Bimbingan Akademik (Perwalian)</h1>
        <p class="theme-text opacity-60 text-sm mt-1">Daftar mahasiswa perwalian dan persetujuan KRS</p>
      </div>
      <div class="flex space-x-2">
        <span class="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg text-sm font-medium">{{ pendingCount }} Menunggu Persetujuan</span>
      </div>
    </div>

    <!-- Area Tabel Mahasiswa Bimbingan -->
    <div class="theme-card rounded-2xl shadow-sm border overflow-hidden">
      <div class="p-4 border-b theme-border flex flex-wrap gap-4 justify-between items-center theme-bg">
        <h3 class="font-bold theme-text">Daftar Mahasiswa Wali</h3>
        <select v-model="filterStatus" class="px-4 py-2 theme-card border rounded-xl text-sm outline-none w-full md:w-auto theme-text focus:ring-2 focus:ring-primary-200">
          <option value="all">Semua Mahasiswa</option>
          <option value="pending">Menunggu Persetujuan KRS</option>
          <option value="approved">KRS Disetujui</option>
        </select>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm theme-text">
          <thead class="theme-bg opacity-80 font-medium">
            <tr>
              <th class="px-6 py-4">NIM</th>
              <th class="px-6 py-4">Nama Mahasiswa</th>
              <th class="px-6 py-4">Angkatan</th>
              <th class="px-6 py-4">IPK Terakhir</th>
              <th class="px-6 py-4">Status KRS</th>
              <th class="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y theme-border">
            
            <!-- Generate List Mahasiswa Asli dari State -->
            <tr v-for="([nim, data]) in filteredKRSBimbingan" :key="nim" class="hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              <td class="px-6 py-4 font-medium">{{ nim }}</td>
              <td class="px-6 py-4 font-bold text-primary-600">{{ getStudentName(nim) }}</td>
              <td class="px-6 py-4">2026</td>
              <td class="px-6 py-4">{{ hitungIpk(nim) }}</td>
              <td class="px-6 py-4">
                <span v-if="data.status === 'pending'" class="px-2.5 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded-full text-xs font-semibold flex items-center w-max">
                   <svg class="w-3 h-3 mr-1 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                   Menunggu Approval
                </span>
                <span v-else-if="data.status === 'approved'" class="px-2.5 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 rounded-full text-xs font-semibold flex items-center w-max">
                   <svg class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                   Disetujui
                </span>
                <span v-else-if="data.status === 'rejected'" class="px-2.5 py-1 bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 rounded-full text-xs font-semibold flex items-center w-max">
                   Ditolak
                </span>
                <span v-else class="px-2.5 py-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 rounded-full text-xs font-semibold flex items-center w-max">
                   Belum Diajukan (Draft)
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                 <button @click="openModal(nim)" class="px-3 py-1.5 bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/40 rounded-lg text-xs font-medium transition">
                    Lihat Detail KRS
                 </button>
              </td>
            </tr>

            <tr v-if="filteredKRSBimbingan.length === 0">
               <td colspan="6" class="px-6 py-8 text-center opacity-60">Tidak ada mahasiswa yang melakukan pengajuan KRS.</td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Review KRS -->
    <div v-if="isModalOpen && selectedDataModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div class="theme-card w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border theme-border flex flex-col max-h-[90vh]">
        <div class="px-6 py-4 border-b theme-border flex justify-between items-center theme-bg">
          <div>
             <h3 class="font-bold text-lg theme-text">Review KRS Mahasiswa</h3>
             <p class="text-sm opacity-60">{{ getStudentName(selectedDataModal.nim) }} ({{ selectedDataModal.nim }})</p>
          </div>
          <button @click="closeModal" class="opacity-60 hover:opacity-100 transition focus:outline-none">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div class="p-6 overflow-y-auto flex-1">
           <div class="flex justify-between items-center mb-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border theme-border">
              <div>
                 <p class="text-sm opacity-70">Total SKS Diambil</p>
                 <p class="text-xl font-bold theme-text">{{ getTotalSks(selectedDataModal.matkul) }} / {{ krsStore.maxSks }} SKS</p>
              </div>
              <div class="text-right">
                 <p class="text-sm opacity-70">Status Pengajuan</p>
                 <p class="font-bold text-amber-500 uppercase text-sm" v-if="selectedDataModal.status === 'pending'">Menunggu Review</p>
                 <p class="font-bold text-emerald-500 uppercase text-sm" v-else-if="selectedDataModal.status === 'approved'">Disetujui</p>
                 <p class="font-bold text-slate-500 uppercase text-sm" v-else>Belum Diajukan / Draft</p>
              </div>
           </div>

           <h4 class="font-bold theme-text mb-3">Daftar Mata Kuliah Diambil:</h4>
           <div class="space-y-2">
              <div v-for="(mk, idx) in selectedDataModal.matkul" :key="idx" class="p-3 border theme-border rounded-lg flex justify-between items-center bg-white dark:bg-slate-800">
                 <div>
                    <span class="font-bold text-sm theme-text">{{ mk.kode }} - {{ mk.nama }}</span>
                    <span class="text-xs opacity-60 block mt-0.5">Smt {{ mk.semester }} • {{ mk.dosen }}</span>
                 </div>
                 <div class="font-bold bg-primary-50 text-primary-600 dark:bg-primary-900/30 px-2 py-1 rounded text-sm">{{ mk.sks }} SKS</div>
              </div>
              <p v-if="selectedDataModal.matkul.length === 0" class="text-center opacity-60 p-4">Mahasiswa belum mengisi KRS</p>
           </div>
        </div>

        <div class="p-4 border-t theme-border theme-bg flex gap-3 justify-end" v-if="selectedDataModal.status === 'pending'">
           <button @click="handleReject" class="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 rounded-xl font-medium transition">Tolak KRS</button>
           <button @click="handleApprove" class="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 rounded-xl font-medium transition flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              Setujui KRS Mahasiswa
           </button>
        </div>
        <div class="p-4 border-t theme-border theme-bg flex gap-3 justify-end" v-else>
           <button @click="closeModal" class="px-6 py-2 bg-slate-800 text-white rounded-xl font-medium transition">Tutup Modal</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Swal from 'sweetalert2'
import { useKrsStore } from '@/stores/krs'

const krsStore = useKrsStore()
const filterStatus = ref('all')
const isModalOpen = ref(false)
const selectedDataModal = ref(null)

const getStudentName = (nim) => {
   if(nim === '20260001') return 'Andi Wijaya'
   return `Mahasiswa Dummy ${parseInt(nim.slice(-4))}`
}

const getTotalSks = (matkulArray) => {
   return matkulArray.reduce((total, mk) => total + mk.sks, 0)
}

const hitungIpk = (nim) => {
   const matkul = krsStore.krsData[nim]?.matkul || []
   if (matkul.length === 0) return '0.00'
   
   let totalSks = 0
   let totalBobot = 0
   matkul.forEach(mk => {
      if(mk.bobot >= 0) { // Jika sudah dinilai
         totalSks += mk.sks
         totalBobot += (mk.sks * mk.bobot)
      }
   })
   
   if (totalSks === 0) return '0.00'
   return (totalBobot / totalSks).toFixed(2)
}

const pendingCount = computed(() => {
   return Object.values(krsStore.krsData).filter(d => d.status === 'pending').length
})

const filteredKRSBimbingan = computed(() => {
   const allData = Object.entries(krsStore.krsData)
   if(filterStatus.value === 'all') return allData
   return allData.filter(([nim, data]) => data.status === filterStatus.value)
})

const openModal = (nim) => {
   selectedDataModal.value = {
       nim: nim,
       ...krsStore.krsData[nim]
   }
   isModalOpen.value = true
}

const closeModal = () => {
   isModalOpen.value = false
   selectedDataModal.value = null
}

const handleApprove = () => {
   Swal.fire({
      title: 'Setujui KRS?',
      text: "Anda yakin ingin menyetujui KRS ini? Jadwal akan paten bagi mahasiswa.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Setujui',
      cancelButtonText: 'Batal'
   }).then((result) => {
      if (result.isConfirmed) {
         krsStore.approveKRSFromDosen(selectedDataModal.value.nim)
         selectedDataModal.value.status = 'approved'
         Swal.fire({
             title: 'Berhasil!',
             text: 'KRS Mahasiswa telah disetujui.',
             icon: 'success',
             timer: 1500,
             showConfirmButton: false
         })
      }
   })
}

const handleReject = () => {
   Swal.fire({
      title: 'Tolak KRS',
      input: 'text',
      inputLabel: 'Masukkan alasan penolakan KRS:',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Tolak KRS',
      cancelButtonText: 'Batal',
      inputValidator: (value) => {
         if (!value) {
            return 'Alasan penolakan tidak boleh kosong!'
         }
      }
   }).then((result) => {
      if (result.isConfirmed) {
         krsStore.rejectKRSFromDosen(selectedDataModal.value.nim)
         selectedDataModal.value.status = 'rejected'
         Swal.fire({
             title: 'Ditolak',
             text: 'KRS Mahasiswa berhasil ditolak.',
             icon: 'info',
             timer: 1500,
             showConfirmButton: false
         })
      }
   })
}
</script>
