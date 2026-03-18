<template>
  <div class="space-y-6 max-w-7xl mx-auto pb-10">
    <div class="border-b border-slate-200 pb-3">
      <h1 class="text-2xl font-bold theme-text">Tugas Akademik (E-Learning)</h1>
      <p class="theme-text opacity-60 text-sm mt-1">Selesaikan dan kumpulkan tugas yang diberikan Dosen Anda tepat waktu.</p>
    </div>

    <!-- Filter Toggle -->
    <div class="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
       <button @click="tabTarget = 'Selesai'" :class="tabTarget === 'Selesai' ? 'bg-white shadow-sm font-bold dark:bg-slate-700 theme-text' : 'font-medium text-slate-500 hover:text-slate-700'" class="px-5 py-2 rounded-lg text-sm transition">
          Sudah Dinilai / Selesai ({{ tugasSelesai.length }})
       </button>
       <button @click="tabTarget = 'To-Do'" :class="tabTarget === 'To-Do' ? 'bg-rose-500 shadow-sm font-bold text-white' : 'font-medium text-slate-500 shadow-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'" class="px-5 py-2 rounded-lg text-sm flex items-center transition relative overflow-hidden">
          <span v-if="tabTarget === 'To-Do'" class="absolute inset-0 bg-white/20 animate-pulse"></span>
          Belum Dikerjakan ({{ tugasBelum.length }})
       </button>
    </div>

    <div v-if="daftarTugasDitampilkan.length === 0" class="theme-card border theme-border rounded-2xl p-10 text-center">
       <div class="inline-flex w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full items-center justify-center mb-4">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
       </div>
       <h4 class="font-bold theme-text text-xl">Kerja Bagus!</h4>
       <p class="opacity-70 mt-2 max-w-sm mx-auto">Anda tidak mempunyai tunggakan tugas untuk diselesaikan pada tab ini.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       <!-- Komponen Card List Tugas Individual -->
       <div v-for="tugas in daftarTugasDitampilkan" :key="tugas.id" 
            class="theme-card border theme-border rounded-2xl shadow-sm hover:-translate-y-1 transition duration-300 flex flex-col relative overflow-hidden group">
          
          <!-- Ribbon Status Keterlambatan Top-Right -->
          <div v-if="tabTarget === 'To-Do' && isLomba(tugas.deadline)" class="absolute top-3 -right-8 bg-red-600 text-white font-bold text-[10px] tracking-wider py-1 px-8 rotate-45 shadow-md z-10">TERLAMBAT</div>
          <div v-if="tabTarget === 'Selesai'" class="absolute top-3 -right-8 bg-emerald-500 text-white font-bold text-[10px] tracking-wider py-1 px-8 rotate-45 shadow-md z-10">SELESAI</div>
          
          <div class="p-5 flex-1 relative z-0">
             <span class="text-[10px] font-bold tracking-widest uppercase border border-primary-500 text-primary-700 px-2 py-0.5 rounded-full mb-3 inline-block">
                {{ tugas.matkul }}
             </span>
             <h3 class="font-bold text-lg leading-snug theme-text group-hover:text-primary-600 transition">{{ tugas.judul }}</h3>
             <p class="text-xs opacity-70 mt-2 mb-4 line-clamp-3 leading-relaxed">{{ tugas.deskripsi }}</p>

             <div class="p-3 bg-slate-50 dark:bg-slate-900 border theme-border rounded-xl space-y-2 text-xs">
                <div class="flex justify-between items-center" :class="isLomba(tugas.deadline) && tabTarget === 'To-Do' ? 'text-red-600 font-bold' : 'theme-text'">
                   <span class="opacity-70">Tenggat Waktu:</span>
                   <span>{{ formatDateTime(tugas.deadline) }}</span>
                </div>
                <div class="flex justify-between items-center theme-text">
                   <span class="opacity-70">Tipe Berkas:</span>
                   <span class="font-mono text-[10px]">.pdf</span>
                </div>
             </div>

             <!-- Khusus Tampilan Selesai (Riwayat Upload & Nilai) -->
             <div v-if="tabTarget === 'Selesai'" class="mt-4 p-3 border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl">
                 <p class="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1 flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Sudah Disubmit
                 </p>
                 <p class="text-[10px] truncate text-slate-500">Berkas: {{ statusSubmisi(tugas.id)?.fileName }}</p>
                  <div class="mt-2 text-xs font-bold pt-2 border-t border-emerald-200 dark:border-emerald-800">
                     NILAI: <span class="text-lg" :class="statusSubmisi(tugas.id)?.nilai !== null && statusSubmisi(tugas.id)?.nilai !== undefined ? 'text-emerald-600 font-extrabold' : 'text-slate-400'">{{ statusSubmisi(tugas.id)?.nilai !== null && statusSubmisi(tugas.id)?.nilai !== undefined ? statusSubmisi(tugas.id)?.nilai : 'Belum dinilai dosen' }}</span>
                  </div>
             </div>

          </div>
          
          <div class="p-4 border-t theme-border bg-slate-50 dark:bg-slate-800 mt-auto">
             <button v-if="tabTarget === 'To-Do'" @click="bukaModalUpload(tugas)" class="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 rounded-xl text-sm transition shadow-sm">
                Lihat & Kumpulkan
             </button>
             <button v-else @click="bukaModalUpload(tugas)" class="w-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 theme-text font-bold py-2.5 rounded-xl text-sm transition">
                Ganti Berkas / Update
             </button>
          </div>

       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTugasStore } from '@/stores/tugas'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'

const tugasStore = useTugasStore()
const authStore = useAuthStore()
const tabTarget = ref('To-Do') // 'To-Do' | 'Selesai'

// Ambil riwayat tugas berdasarkan kelas user login
const semuaTugas = computed(() => {
   return tugasStore.getTugasByKelas(authStore.user?.idKelas || 'Belum Ada Kelas')
})

const statusSubmisi = (tugasId) => {
   const d = tugasStore.getSubmisiByNimTugas(authStore.user?.nim, tugasId)
   return d ? d : null
}

// Pisahkan antara yang udah disubmit dan belum
const tugasSelesai = computed(() => {
   return semuaTugas.value.filter(t => statusSubmisi(t.id) !== null)
})

const tugasBelum = computed(() => {
   return semuaTugas.value.filter(t => statusSubmisi(t.id) === null)
})

const daftarTugasDitampilkan = computed(() => {
   return tabTarget.value === 'To-Do' ? tugasBelum.value : tugasSelesai.value
})

const formatDateTime = (isoString) => {
   const d = new Date(isoString)
   const dt = d.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).replace('pukul', '')
   return dt
}

// Lebih kecil dari waktu sekarang?
const isLomba = (isoString) => {
   return new Date(isoString) < new Date()
}

const bukaModalUpload = (tugas) => {
   const dL = isLomba(tugas.deadline)
   const currentSb = statusSubmisi(tugas.id)

   Swal.fire({
      title: 'Kumpulkan Formulir',
      html: `
         <div class="text-left mt-2">
            <div class="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-4">
               <span class="text-xs uppercase font-bold text-blue-800">${tugas.matkul}</span>
               <h3 class="text-lg font-bold text-slate-800 leading-tight mt-1">${tugas.judul}</h3>
            </div>
            
            <p class="text-sm text-slate-600 mb-4 whitespace-pre-wrap">${tugas.deskripsi}</p>
            
            ${dL && !currentSb ? '<div class="text-xs bg-red-100 text-red-700 p-2 font-bold text-center rounded mb-3">TENGGAT WAKTU TERLEWATI! TUGAS INI BERSTATUS TERLAMBAT.</div>' : ''}
            
            <div class="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50 relative hover:bg-slate-100 transition group cursor-pointer w-full text-xs">
               <svg class="w-8 h-8 mx-auto text-slate-400 mb-2 group-hover:text-blue-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
               <input type="file" id="swal-file" accept=".pdf" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-sm">
               <p class="font-bold text-slate-700 pointer-events-none mb-1">Klik atau seret file PDF Anda ke sini</p>
               <p class="pointer-events-none text-blue-600 font-semibold" id="swal-file-name">${currentSb ? currentSb.fileName : 'Belum ada file dipilih'}</p>
               <p class="opacity-50 pointer-events-none mt-2">Diperbolehkan: .pdf</p>
            </div>
         </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Kirim Pekerjaan',
      cancelButtonText: 'Tutup',
      confirmButtonColor: '#0ea5e9',
      allowEnterKey: false,
      didOpen: () => {
         const fileInput = document.getElementById('swal-file');
         const nameDisplay = document.getElementById('swal-file-name');
         fileInput.addEventListener('change', (e) => {
            if(e.target.files.length > 0) {
               nameDisplay.textContent = e.target.files[0].name;
               nameDisplay.classList.add('text-emerald-600');
               nameDisplay.classList.remove('text-blue-600');
            } else {
               nameDisplay.textContent = currentSb ? currentSb.fileName : 'Belum ada file dipilih';
            }
         });
      },
      preConfirm: () => {
         const fileInput = document.getElementById('swal-file')
         const file = fileInput.files[0]
         
         // Jika ga ada file baru, dan blm ada submit, tolak
         if(!file && !currentSb) {
            Swal.showValidationMessage('Anda harus melampirkan file PDF!')
            return false
         }

         // Kalo ada file baru, convert ke Base64 agar bisa dibaca dosen lintas sesi
         if(file) {
            return new Promise((resolve, reject) => {
               const reader = new FileReader()
               reader.onload = (e) => {
                  resolve({
                     name: file.name,
                     url: e.target.result // Base64 data URL — permanen, bisa dibaca siapapun
                  })
               }
               reader.onerror = () => {
                  Swal.showValidationMessage('Gagal membaca file. Coba lagi.')
                  reject()
               }
               reader.readAsDataURL(file)
            })
         }
         
         return {
            name: currentSb.fileName,
            url: currentSb.fileDataUrl
         }
      }
   }).then((res) => {
      if(res.isConfirmed) {
         tugasStore.submitAssignment({
            tugasId: tugas.id,
            nim: authStore.user?.nim,
            fileName: res.value.name,
            fileDataUrl: res.value.url,
            catatan: 'Disubmit dari Portal Mahasiswa'
         })
         Swal.fire({
            icon: 'success',
            title: 'Berhasil Dikumpulkan!',
            text: 'Jawaban dan riwayat pengumpulan Anda telah tercatat di server dosen yang bersangkutan.',
            confirmButtonColor: '#10b981'
         })
         
         // Jika tdinya di todo, pindah tab ke Selesai auto
         tabTarget.value = 'Selesai'
      }
   })
}
</script>
