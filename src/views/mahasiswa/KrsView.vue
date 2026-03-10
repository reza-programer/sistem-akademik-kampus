<template>
  <div class="space-y-6 max-w-7xl mx-auto relative">
    
    <!-- Header KRS -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-4">
      <div>
        <h1 class="text-2xl font-normal tracking-wide text-slate-800">Kartu Rencana Studi (KRS)</h1>
      </div>
      <div class="text-right flex items-center gap-4 bg-white p-2 border border-slate-200 shadow-sm rounded-lg pr-4">
        <div class="hidden sm:block pl-2">
           <div class="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-0.5">Status KRS</div>
           <div class="text-sm font-bold uppercase" 
             :class="{
               'text-slate-600': krsStore.isDraft,
               'text-amber-600': krsStore.isPending,
               'text-emerald-600': krsStore.isApproved,
               'text-red-600': krsStore.status === 'rejected'
             }">
             {{ krsStatusLabel }}
           </div>
        </div>
        <div class="pl-4 border-l border-slate-200">
           <div class="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-0.5">SKS Terambil</div>
           <div class="text-xl font-bold font-mono tracking-tighter" :class="krsStore.totalSks > krsStore.maxSks ? 'text-red-600' : 'text-slate-800'">
             {{ krsStore.totalSks }}<span class="text-slate-400 font-normal text-sm"> / {{ krsStore.maxSks }}</span>
           </div>
        </div>
      </div>
    </div>

    <!-- Alert Status -->
    <div v-if="krsStore.isPending" class="p-4 bg-amber-50 border-l-4 border-amber-500 rounded flex items-start text-amber-900 shadow-sm">
       <svg class="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
       <div>
          <h4 class="font-bold">KRS Sedang Dievaluasi</h4>
          <p class="text-sm mt-1 opacity-90">KRS Anda telah diajukan dan sedang menunggu persetujuan dari Dosen Wali Pembimbing Akademik. Anda tidak dapat merubah matkul.</p>
       </div>
    </div>
    
    <div v-else-if="krsStore.isApproved" class="p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded flex items-start text-emerald-900 shadow-sm">
       <svg class="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
       <div>
          <h4 class="font-bold">KRS Disetujui</h4>
          <p class="text-sm mt-1 opacity-90">Rencana Studi Anda telah disetujui secara permanen pada Kartu Hasil Studi (KHS) Anda.</p>
       </div>
    </div>
    
    <div v-else-if="krsStore.status === 'rejected'" class="p-4 bg-red-50 border-l-4 border-red-500 rounded flex items-start justify-between text-red-900 shadow-sm">
       <div class="flex items-start">
          <svg class="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <div>
             <h4 class="font-bold">KRS Ditolak</h4>
             <p class="text-sm mt-1 opacity-90">KRS Anda ditolak oleh Dosen Wali. Harap revisi rencana studi Anda dan ajukan kembali.</p>
          </div>
       </div>
       <button @click="krsStore.resetKRS" class="px-4 py-2 bg-red-600 text-white rounded border border-red-700 text-sm font-medium hover:bg-red-700 shadow-sm transition flex-shrink-0">Revisi KRS</button>
    </div>

    <!-- Layout Utama KRS -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Daftar Mata Kuliah Tersedia -->
      <div class="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col h-[650px] transition-opacity duration-300" :class="{ 'opacity-60 pointer-events-none': !canEdit }">
        <div class="p-4 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row justify-between gap-3 items-center rounded-t-lg">
          <h2 class="font-bold text-slate-800 uppercase tracking-widest text-sm w-full md:w-auto">Mata Kuliah Ditawarkan</h2>
          <div class="flex w-full md:w-auto gap-2">
             <select v-model="selectedSemester" class="px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white text-slate-700 flex-1 md:w-32 shadow-sm font-medium">
                <option value="all">Semua Smt</option>
                <option v-for="i in 9" :key="i" :value="i.toString()">Semester {{ i }}</option>
             </select>
             <input type="text" v-model="searchQuery" placeholder="Cari Matkul..." class="px-3 py-1.5 border border-slate-300 rounded text-sm w-full md:w-48 focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white shadow-sm text-slate-700">
          </div>
        </div>
        
        <div class="p-3 bg-slate-100 border-b border-slate-200 flex justify-between items-center" v-if="selectedSemester !== 'all' && filteredMatkul.length > 0">
           <span class="text-sm text-slate-600 font-medium">Tampilkan Paket Semester {{ selectedSemester }}</span>
           <button @click="ambilPaketSemester" class="text-xs bg-slate-800 hover:bg-slate-900 border border-slate-900 text-white px-3 py-1.5 rounded shadow-sm transition font-medium">
              Ambil Paket Smt {{ selectedSemester }}
           </button>
        </div>

        <div class="overflow-y-auto flex-1 p-4 space-y-3 bg-white">
          <div v-for="mk in filteredMatkul" :key="mk.kode" class="border border-slate-200 rounded p-4 hover:border-slate-400 transition flex items-center justify-between bg-white hover:bg-slate-50 group">
            <div>
              <div class="flex items-center space-x-3">
                <span class="px-2 py-0.5 border border-slate-300 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-sm">SMT {{ mk.semester }}</span>
                <h3 class="font-bold text-slate-800">{{ mk.nama }} ({{ mk.kode }})</h3>
              </div>
              <p class="text-sm text-slate-500 mt-2 flex items-center gap-4">
                 <span class="flex items-center"><svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg> {{ mk.dosen }}</span>
                 <span class="font-bold text-slate-700 flex items-center"><svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> {{ mk.sks }} SKS</span>
              </p>
            </div>
            <button @click="tambahMatkul(mk)" :disabled="isMatkulSelected(mk.kode) || krsStore.totalSks + mk.sks > krsStore.maxSks" 
              class="w-10 h-10 rounded border flex items-center justify-center font-bold text-lg transition shadow-sm"
              :class="isMatkulSelected(mk.kode) ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-default' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-800 hover:text-white hover:border-slate-800 cursor-pointer'">
              <span v-if="isMatkulSelected(mk.kode)">✓</span>
              <span v-else>+</span>
            </button>
          </div>
          
          <div v-if="filteredMatkul.length === 0" class="text-center py-12 text-slate-400 text-sm">
             Tidak ada mata kuliah yang ditemukan.
          </div>
        </div>
      </div>

      <!-- KRS Terpilih Sidebar -->
      <div class="rounded-lg shadow-sm border border-slate-200 bg-white flex flex-col h-[650px] overflow-hidden">
        <div id="print-krs" class="flex-1 flex flex-col overflow-hidden">
          <div class="p-4 border-b border-[#2496bb] bg-[#29a8d1] text-white">
             <h2 class="font-bold uppercase tracking-widest text-sm">Keranjang KRS</h2>
             <p class="text-xs opacity-90 mt-1">Smt Genap 2025/2026</p>
          </div>
          <div class="overflow-y-auto flex-1 p-4 space-y-3 bg-slate-50/50">
            
            <template v-if="krsStore.selectedMatkul.length > 0">
               <div v-for="mk in krsStore.selectedMatkul" :key="mk.kode" class="bg-white border border-slate-200 shadow-sm rounded p-3 flex items-start justify-between">
                 <div>
                   <h4 class="font-bold text-sm text-slate-800 uppercase">{{ mk.nama }}</h4>
                   <div class="flex items-center gap-3 mt-1.5">
                      <span class="text-xs font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-sm">{{ mk.kode }}</span>
                      <span class="text-xs font-bold text-slate-700">{{ mk.sks }} SKS</span>
                   </div>
                 </div>
                 <button v-if="canEdit" @click="hapusMatkul(mk.kode)" class="text-slate-400 hover:text-red-600 p-1 data-html2canvas-ignore transition bg-slate-50 hover:bg-red-50 rounded border border-transparent hover:border-red-200">
                   <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                 </button>
               </div>
            </template>
            <div v-else class="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400">
               <svg class="w-12 h-12 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
               <p class="text-sm font-medium">Keranjang KRS Kosong</p>
               <p class="text-xs mt-1">Silakan pilih matkul di samping.</p>
            </div>

          </div>
        </div>
        
        <!-- Action Buttons Sidebar -->
        <div class="p-4 border-t border-slate-200 bg-white flex flex-col gap-3">
          <button @click="downloadKRS" class="bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-4 rounded transition flex items-center justify-center text-sm border border-slate-300 shadow-sm">
             <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
             <span v-if="!isDownloading">Cetak Berkas PDF</span>
             <span v-else>Menyiapkan...</span>
          </button>
          
          <button v-if="canEdit" @click="ajukanKRS" :disabled="krsStore.selectedMatkul.length === 0" 
            class="text-white font-bold py-3 rounded uppercase tracking-wider text-xs transition shadow-sm border"
            :class="krsStore.selectedMatkul.length > 0 ? 'bg-[#29a8d1] border-[#2496bb] hover:bg-[#2496bb]' : 'bg-slate-300 border-slate-400 cursor-not-allowed'">
            Ajukan ke Dosen Wali
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import html2pdf from 'html2pdf.js'
import Swal from 'sweetalert2'
import { useKrsStore } from '@/stores/krs'

const krsStore = useKrsStore()
const isDownloading = ref(false)
const searchQuery = ref('')
const selectedSemester = ref('all')

// Dummy Master Data Mata Kuliah Komplit (Semester 1 - 9)
const allMatkul = ref([
  // Semester 1
  { kode: 'KU101', nama: 'Pendidikan Agama', sks: 2, semester: '1', dosen: 'Tim Dosen' },
  { kode: 'KU102', nama: 'Bahasa Indonesia', sks: 2, semester: '1', dosen: 'Tim Dosen' },
  { kode: 'IF101', nama: 'Pemrograman Dasar', sks: 3, semester: '1', dosen: 'Budi Santoso, M.Kom' },
  { kode: 'IF103', nama: 'Matematika Diskrit', sks: 3, semester: '1', dosen: 'Dr. Indah Permatasari' },
  { kode: 'IF105', nama: 'Pengantar Teknologi Informasi', sks: 3, semester: '1', dosen: 'Arif Maulana, M.T.I.' },
  { kode: 'IF107', nama: 'Sistem Digital', sks: 3, semester: '1', dosen: 'Siti Rahayu, M.Sc.' },
  
  // Semester 2
  { kode: 'KU201', nama: 'Kewarganegaraan', sks: 2, semester: '2', dosen: 'Tim Dosen' },
  { kode: 'IF102', nama: 'Struktur Data', sks: 3, semester: '2', dosen: 'Dr. Indah Permatasari' },
  { kode: 'IF104', nama: 'Aljabar Linear', sks: 3, semester: '2', dosen: 'Dr. Wahyu Setiawan' },
  { kode: 'IF106', nama: 'Arsitektur Komputer', sks: 3, semester: '2', dosen: 'Siti Rahayu, M.Sc.' },
  { kode: 'IF108', nama: 'Pemrograman Berorientasi Objek', sks: 3, semester: '2', dosen: 'Budi Santoso, M.Kom' },

  // Semester 3
  { kode: 'IF201', nama: 'Basis Data Terapan', sks: 3, semester: '3', dosen: 'Arif Maulana, M.T.I.' },
  { kode: 'IF203', nama: 'Sistem Operasi', sks: 3, semester: '3', dosen: 'Siti Rahayu, M.Sc.' },
  { kode: 'IF205', nama: 'Rekayasa Perangkat Lunak', sks: 3, semester: '3', dosen: 'Budi Santoso, M.Kom' },
  { kode: 'IF207', nama: 'Statistika Klasik', sks: 3, semester: '3', dosen: 'Dr. Wahyu Setiawan' },
  
  // Semester 4
  { kode: 'IF202', nama: 'Pemrograman Web Lanjut', sks: 3, semester: '4', dosen: 'Budi Santoso, M.Kom' },
  { kode: 'IF204', nama: 'Jaringan Komputer', sks: 3, semester: '4', dosen: 'Arif Maulana, M.T.I.' },
  { kode: 'IF206', nama: 'Interaksi Manusia & Komputer', sks: 3, semester: '4', dosen: 'Dr. Indah Permatasari' },
  { kode: 'IF208', nama: 'Kecerdasan Komputasional', sks: 3, semester: '4', dosen: 'Siti Rahayu, M.Sc.' },
  
  // Semester 5
  { kode: 'IF301', nama: 'Kecerdasan Buatan', sks: 3, semester: '5', dosen: 'Siti Rahayu, M.Sc.' },
  { kode: 'IF303', nama: 'Metode Numerik', sks: 3, semester: '5', dosen: 'Dr. Wahyu Setiawan' },
  { kode: 'IF305', nama: 'Manajemen Proyek TI', sks: 3, semester: '5', dosen: 'Dr. Indah Permatasari' },
  
  // Semester 6
  { kode: 'IF302', nama: 'Kriptografi & Keamanan Jaringan', sks: 3, semester: '6', dosen: 'Arif Maulana, M.T.I.' },
  { kode: 'IF304', nama: 'Data Mining', sks: 3, semester: '6', dosen: 'Siti Rahayu, M.Sc.' },
  { kode: 'IF306', nama: 'Kerja Praktik (Magang)', sks: 4, semester: '6', dosen: 'Tim Dosen Pembimbing' },
  
  // Semester 7 (Request User)
  { kode: 'IF401', nama: 'Seminar Usulan Penelitian (SUP)', sks: 2, semester: '7', dosen: 'Tim Dosen Pembimbing' },
  { kode: 'IF403', nama: 'Kapita Selekta / Topik Khusus I', sks: 3, semester: '7', dosen: 'Budi Santoso, M.Kom' },
  { kode: 'IF405', nama: 'Metodologi Penelitian Canggih', sks: 3, semester: '7', dosen: 'Dr. Indah Permatasari' },
  
  // Semester 8
  { kode: 'IF402', nama: 'Pengembangan Aplikasi Enterprise', sks: 3, semester: '8', dosen: 'Arif Maulana, M.T.I.' },
  { kode: 'IF404', nama: 'Kapita Selekta / Topik Khusus II', sks: 3, semester: '8', dosen: 'Dr. Wahyu Setiawan' },

  // Semester 9 (Request User)
  { kode: 'IF502', nama: 'Seminar Hasil Penelitian (SHP)', sks: 2, semester: '9', dosen: 'Tim Dosen Pembimbing' },
  { kode: 'IF504', nama: 'Skripsi / Tugas Akhir', sks: 6, semester: '9', dosen: 'Tim Dosen Pembimbing' },
])

const canEdit = computed(() => krsStore.isDraft || krsStore.status === 'rejected')

const krsStatusLabel = computed(() => {
   if(krsStore.isDraft) return 'Draft'
   if(krsStore.isPending) return 'Dievaluasi'
   if(krsStore.isApproved) return 'Disetujui'
   return 'Ditolak'
})

const filteredMatkul = computed(() => {
   let result = allMatkul.value
   
   // Filter by Semester
   if(selectedSemester.value !== 'all') {
      result = result.filter(m => m.semester === selectedSemester.value)
   }
   
   // Filter by Search Query
   if(searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(m => m.nama.toLowerCase().includes(q) || m.kode.toLowerCase().includes(q))
   }
   
   return result
})

const isMatkulSelected = (kode) => {
   return krsStore.selectedMatkul.some(m => m.kode === kode)
}

const tambahMatkul = (mk) => {
   if(krsStore.totalSks + mk.sks > krsStore.maxSks) {
      Swal.fire({
          icon: 'error',
          title: 'Gagal Menambahkan',
          text: `Melebihi batas maksimal SKS (${krsStore.maxSks} SKS).`,
          confirmButtonColor: '#0ea5e9'
      })
      return
   }
   krsStore.addMatkul(mk)
}

const hapusMatkul = (kode) => {
   krsStore.removeMatkul(kode)
}

const ambilPaketSemester = () => {
   const matkulPaket = filteredMatkul.value
   let totalAvailable = 0
   let addedCount = 0
   
   matkulPaket.forEach(mk => {
      // Hanya tambahkan jika belum ada di KRS
      if(!isMatkulSelected(mk.kode)) {
         if(krsStore.totalSks + mk.sks <= krsStore.maxSks) {
            krsStore.addMatkul(mk)
            addedCount++
         }
      }
      totalAvailable++
   })
   
   if(addedCount === 0) {
       Swal.fire({
           icon: 'info',
           title: 'Info',
           text: 'Tidak ada mata kuliah baru yang bisa ditambahkan (mungkin KRS sudah penuh atau semua matkul paket ini sudah ada di KRS).',
           confirmButtonColor: '#0ea5e9'
       })
   } else {
       Swal.fire({
           icon: 'success',
           title: 'Berhasil',
           text: `Berhasil menambahkan ${addedCount} mata kuliah paket.`,
           timer: 1500,
           showConfirmButton: false
       })
   }
}

const ajukanKRS = () => {
   Swal.fire({
      title: 'Ajukan Rencana Studi?',
      text: "Sesudah diajukan, Anda tidak bisa memodifikasinya sampai di-review oleh dosen.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0ea5e9',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Ajukan!'
   }).then((result) => {
      if (result.isConfirmed) {
         krsStore.ajukanKRS()
         Swal.fire({
             title: 'Berhasil Diajukan!',
             text: 'KRS Anda sedang menunggu tinjauan Dosen Wali.',
             icon: 'success',
             confirmButtonColor: '#0ea5e9'
         })
      }
   })
}

const downloadKRS = () => {
  isDownloading.value = true
  const element = document.getElementById('print-krs')
  
  // Create a temporary clone for proper PDF formatting without overflowing scrollbars
  const clone = element.cloneNode(true)
  clone.style.height = 'auto'
  clone.style.overflow = 'visible'
  
  // Make list items visible
  const listContainer = clone.querySelector('.overflow-y-auto')
  if(listContainer) {
     listContainer.style.overflow = 'visible'
     listContainer.style.flex = 'none'
  }
  
  // Remove dark mode specifically for PDF rendering to ensure readable black text
  clone.classList.remove('theme-text')
  clone.style.color = '#000'
  
  const container = document.createElement('div')
  container.style.position = 'absolute'
  container.style.left = '-9999px'
  container.style.background = 'white'
  container.appendChild(clone)
  document.body.appendChild(container)

  const opt = {
    margin:       [15, 15, 15, 15],
    filename:     'KRS_Saya.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }

  html2pdf().set(opt).from(clone).save().then(() => {
    isDownloading.value = false
    document.body.removeChild(container)
  })
}
</script>
