<template>
  <div class="space-y-6 max-w-7xl mx-auto pb-10">
    <div class="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-3 gap-4">
      <div>
         <h1 class="text-2xl font-bold theme-text">Manajemen E-Learning</h1>
         <p class="theme-text opacity-60 text-sm mt-1">Buat, kelola, dan periksa penugasan kelas yang Anda ampu.</p>
      </div>
      <div>
         <button @click="showForm = true" v-if="!showForm" class="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary-500/30 flex items-center transition">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            Tugas Baru
         </button>
      </div>
    </div>

    <!-- Panel Form Buat Tugas Baru -->
    <transition enter-active-class="transition duration-300 ease-out transform" enter-from-class="-translate-y-4 opacity-0" enter-to-class="translate-y-0 opacity-100" leave-active-class="transition duration-200 ease-in transform" leave-from-class="translate-y-0 opacity-100" leave-to-class="-translate-y-4 opacity-0">
      <div v-if="showForm" class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-emerald-500 shadow-xl relative overflow-hidden">
         <!-- Hiasan -->
         <div class="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
         
         <div class="flex justify-between items-center mb-6 pl-4">
            <h2 class="text-xl font-bold theme-text text-emerald-600 dark:text-emerald-400">Buat Penugasan Baru</h2>
            <button @click="showForm = false" class="text-slate-400 hover:text-red-500 transition">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
         </div>

         <form @submit.prevent="simpanTugas" class="space-y-4 pl-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label class="block text-sm font-bold theme-text mb-1">Mata Kuliah</label>
                  <select v-model="formBaru.matkul" required class="w-full bg-slate-50 dark:bg-slate-900 border theme-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none theme-text">
                     <option v-for="j in myMatkulUniq" :key="j" :value="j">{{ j }}</option>
                  </select>
               </div>
               <div>
                  <label class="block text-sm font-bold theme-text mb-1">Kelas Tujuan</label>
                  <select v-model="formBaru.kelas" required class="w-full bg-slate-50 dark:bg-slate-900 border theme-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none theme-text">
                     <option v-for="k in masterStore.kelasList" :key="k.idKelas" :value="k.idKelas">{{ k.namaKelas }} ({{ k.idKelas }})</option>
                  </select>
               </div>
            </div>

            <div>
               <label class="block text-sm font-bold theme-text mb-1">Topik / Judul Tugas</label>
               <input v-model="formBaru.judul" required type="text" placeholder="Contoh: Makalah Sistem Keamanan Siber" class="w-full bg-slate-50 dark:bg-slate-900 border theme-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none theme-text">
            </div>

            <div>
               <label class="block text-sm font-bold theme-text mb-1">Deskripsi Tambahan</label>
               <textarea v-model="formBaru.deskripsi" required rows="3" placeholder="Jelaskan detail spesifikasi pengerjaan..." class="w-full bg-slate-50 dark:bg-slate-900 border theme-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none theme-text resize-none"></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label class="block text-sm font-bold theme-text mb-1">Batas Waktu (Deadline) Kumpul</label>
                  <input v-model="formBaru.deadline" required type="datetime-local" class="w-full bg-slate-50 dark:bg-slate-900 border theme-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none theme-text">
               </div>
               <div>
                  <label class="block text-sm font-bold theme-text mb-1">Format File Diminta</label>
                  <select v-model="formBaru.tipeFormat" required class="w-full bg-slate-50 dark:bg-slate-900 border theme-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none theme-text">
                     <option value="Document PDF (.pdf)">Document PDF (.pdf)</option>
                     <option value="Document Word (.doc/.docx)">Document Word (.doc/.docx)</option>
                     <option value="File Presentasi (.ppt/.pptx)">File Presentasi (.ppt/.pptx)</option>
                     <option value="Arsip Kompresi (.zip/.rar)">Arsip Kompresi (.zip/.rar)</option>
                     <option value="Link URL / Remote Repo">Link URL / Remote Repo</option>
                  </select>
               </div>
            </div>

            <div class="pt-4 flex justify-end gap-3">
               <button @click="showForm = false" type="button" class="px-5 py-2 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition">Batal</button>
               <button type="submit" class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-sm transition">Posting Tugas</button>
            </div>
         </form>
      </div>
    </transition>

    <!-- Daftar Penugasan Aktif (History) -->
    <div>
       <h3 class="font-bold theme-text mb-4">Riwayat Penugasan Kelas</h3>
       
       <div v-if="daftarTugasSaya.length === 0" class="theme-card border theme-border rounded-2xl p-10 text-center">
          <svg class="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          <h4 class="font-bold theme-text opacity-70">Belum ada tugas yang dibuat.</h4>
          <p class="text-sm opacity-50 mt-1">Klik tombol "Tugas Baru" untuk mulai memberikan assignment.</p>
       </div>
       
       <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Card Tugas -->
          <div v-for="tugas in daftarTugasSaya" :key="tugas.id" class="theme-card border theme-border rounded-2xl shadow-sm overflow-hidden flex flex-col group transition hover:border-primary-400">
             <!-- Header Card -->
             <div class="px-5 py-4 border-b theme-border flex justify-between items-start bg-slate-50/50 dark:bg-slate-900/30">
                <div>
                   <div class="flex items-center gap-2 mb-1">
                      <span class="text-xs font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400 px-2 py-0.5 rounded">{{ tugas.kelas }}</span>
                      <span class="text-[10px] font-semibold text-slate-500 border border-slate-300 dark:border-slate-600 px-2 py-0.5 rounded-full">{{ tugas.id }}</span>
                   </div>
                   <h4 class="font-bold text-lg theme-text group-hover:text-primary-600 transition">{{ tugas.judul }}</h4>
                   <p class="text-xs theme-text opacity-70">{{ tugas.matkul }}</p>
                </div>
                <button @click="hapusTugas(tugas.id)" class="text-slate-400 hover:text-red-500 rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                   <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
             </div>
             
             <!-- Body Card -->
             <div class="p-5 flex-1">
                <p class="text-sm theme-text opacity-80 leading-relaxed line-clamp-2 mb-4">{{ tugas.deskripsi }}</p>
                
                <div class="grid grid-cols-2 gap-3 text-xs">
                   <div class="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-lg border theme-border">
                      <p class="opacity-60 mb-1 font-semibold">Tenggat Waktu</p>
                      <p class="font-bold text-rose-600 dark:text-rose-400">{{ formatDateTime(tugas.deadline) }}</p>
                   </div>
                   <div class="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-lg border theme-border">
                      <p class="opacity-60 mb-1 font-semibold">Format Diterima</p>
                      <p class="font-bold theme-text truncate">{{ tugas.tipeFormat }}</p>
                   </div>
                </div>
             </div>
             
             <!-- Footer Card Stats -->
             <div class="px-5 py-3 border-t theme-border bg-slate-50 dark:bg-slate-800 flex justify-between items-center">
                <div class="text-xs font-bold theme-text flex items-center">
                   <svg class="w-4 h-4 mr-1.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>
                   {{ tugasStore.getSubmisiByTugas(tugas.id).length }} Mahasiswa Kumpul
                </div>
                <button @click="lihatSubmisi(tugas)" class="text-xs font-bold text-primary-600 hover:text-primary-800 dark:text-primary-400 hover:underline">
                   Review Tugas &rarr;
                </button>
             </div>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useMasterDataStore } from '@/stores/masterData'
import { useTugasStore } from '@/stores/tugas'
import Swal from 'sweetalert2'

const authStore = useAuthStore()
const masterStore = useMasterDataStore()
const tugasStore = useTugasStore()

const dosenDummyId = authStore.user?.id || 'D01' 
const showForm = ref(false)

const jadwalKu = computed(() => masterStore.jadwalDosen(dosenDummyId) || [])
const myMatkulUniq = computed(() => [...new Set(jadwalKu.value.map(j => j.namaMatkul))])
const myKelasUniq = computed(() => [...new Set(jadwalKu.value.map(j => j.idKelas))])

const formBaru = ref({
   matkul: myMatkulUniq.value[0] || 'Pemrograman',
   kelas: masterStore.kelasList[0]?.idKelas || 'SI 2026 01',
   judul: '',
   deskripsi: '',
   deadline: '',
   tipeFormat: 'Document PDF (.pdf)'
})

const daftarTugasSaya = computed(() => {
   return tugasStore.getTugasByDosen(dosenDummyId)
})

onMounted(() => {
   // Simpan referensi tugas yg sedang dibuka utk bisa reload modal setelah nilai disimpan
   window.tugasSedangReview = null

   window.handleInputNilai = async (submissionId, nim, currentNilai) => {
      const { value: nilai } = await Swal.fire({
         title: 'Beri / Edit Nilai',
         html: `<p class="text-sm opacity-70 mb-2">NIM Mahasiswa: <strong>${nim}</strong></p>
                <p class="text-xs text-slate-500 mb-3">Masukkan nilai angka 0 - 100</p>`,
         input: 'number',
         inputValue: currentNilai !== null && currentNilai !== undefined ? currentNilai : '',
         inputAttributes: {
             min: 0,
             max: 100,
             step: 1,
             placeholder: '0 - 100'
         },
         inputValidator: (v) => {
            if (v === '' || v === null || v === undefined) return 'Nilai tidak boleh kosong!'
            if (parseInt(v) < 0 || parseInt(v) > 100) return 'Nilai harus antara 0 - 100!'
         },
         showCancelButton: true,
         confirmButtonText: 'Simpan Nilai',
         cancelButtonText: 'Batal',
         confirmButtonColor: '#10b981'
      })

      if (nilai !== undefined && nilai !== null && nilai !== '') {
         tugasStore.gradeSubmission(parseInt(submissionId), parseInt(nilai))
         
         // Auto-refresh modal dengan reopen lihatSubmisi
         const tugas = window.tugasSedangReview
         if (tugas) {
            setTimeout(() => {
               lihatSubmisi(tugas)
            }, 200)
         }
      }
   }

   window.bukaPdfPreview = (url, fileName) => {
      Swal.fire({
         title: `<span class="text-sm">Preview: ${fileName}</span>`,
         html: `
            <div class="w-full bg-slate-100 rounded-xl overflow-hidden shadow-inner border border-slate-200 flex flex-col h-[70vh]">
               <iframe src="${url}#toolbar=0" class="w-full flex-1" frameborder="0"></iframe>
            </div>
         `,
         width: '85%',
         padding: '1em',
         showCloseButton: true,
         showConfirmButton: true,
         confirmButtonText: 'Tutup Preview',
         confirmButtonColor: '#64748b'
      })
   }
})

onUnmounted(() => {
   delete window.handleInputNilai
   delete window.bukaPdfPreview
})

const formatDateTime = (isoString) => {
   const d = new Date(isoString)
   return d.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
}

const simpanTugas = () => {
   tugasStore.addTugas({
      ...formBaru.value,
      dosenId: dosenDummyId
   })

   Swal.fire({
      icon: 'success',
      title: 'Tugas Terpublikasi!',
      text: 'Mahasiswa di kelas tujuan akan mendapatkan list tugas ini di dashboard mereka.',
      confirmButtonColor: '#10b981',
      timer: 2500
   })

   // Reset
   formBaru.value.judul = ''
   formBaru.value.deskripsi = ''
   formBaru.value.deadline = ''
   showForm.value = false
}

const hapusTugas = (id) => {
   Swal.fire({
      title: 'Hapus Tugas?',
      text: 'Semua rekaman submisi mahasiswa yang mengirimkan payload pada tugas ini juga akan terhapus. Lanjutkan?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus Permanen',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#ef4444'
   }).then((res) => {
      if(res.isConfirmed) {
         tugasStore.hapusTugas(id)
         Swal.fire('Terhapus!', 'Penugasan telah ditarik dari peredaran.', 'success')
      }
   })
}

const lihatSubmisi = (tugas) => {
   // Simpan referensi tugas supaya setelah beri nilai, modal bisa reopen otomatis
   window.tugasSedangReview = tugas

   const subs = tugasStore.getSubmisiByTugas(tugas.id)
   
   if(subs.length === 0) {
      Swal.fire({
         title: 'Belum Ada Submisi',
         text: 'Belum ada satupun mahasiswa yang mengumpulkan tugas ini.',
         icon: 'info',
         confirmButtonText: 'Tutup',
         confirmButtonColor: '#64748b'
      })
      return
   }

   let listHtml = '<div class="space-y-3 mt-4 text-left max-h-72 overflow-y-auto pr-2">'
   subs.forEach(s => {
      const sudahDinilai = s.nilai !== null && s.nilai !== undefined
      listHtml += `
         <div class="p-4 border ${sudahDinilai ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-200 bg-white'} rounded-xl flex items-center justify-between text-sm shadow-sm gap-4">
           <div class="min-w-0 flex-1">
              <p class="font-bold text-slate-800">NIM: <span class="text-emerald-700">${s.nim}</span></p>
              <p class="text-[11px] text-slate-500 truncate mt-0.5">${s.fileName || '-'}</p>
              <p class="text-[12px] font-bold mt-1.5 ${sudahDinilai ? 'text-emerald-600' : 'text-rose-500'}">
                 Nilai: <span class="text-base">${sudahDinilai ? s.nilai : 'Belum Dinilai'}</span>
              </p>
           </div>
           <div class="flex flex-col gap-2 shrink-0">
               ${s.fileDataUrl ? 
                 `<button onclick="window.bukaPdfPreview('${s.fileDataUrl}', '${s.fileName}')" class="text-xs px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg font-bold transition flex items-center justify-center shrink-0">
                     <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                     Lihat PDF
                  </button>` : 
                 `<span class="text-[10px] italic text-slate-400 opacity-80 text-center">(Belum ada file)</span>`
               }
               <button onclick="window.handleInputNilai('${s.id}', '${s.nim}', ${sudahDinilai ? s.nilai : 'null'})" class="text-xs px-3 py-1.5 ${sudahDinilai ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'} rounded-lg font-bold transition flex items-center justify-center shrink-0">
                  ${sudahDinilai ? '✏️ Ubah Nilai' : '⭐ Beri Nilai'}
               </button>
           </div>
        </div>
      `
   })
   listHtml += '</div>'

   Swal.fire({
      title: `Review Submisi`,
      html: `
        <div class="text-left">
           <div class="bg-emerald-50 text-emerald-800 px-3 py-2 rounded mb-3 text-sm font-bold border border-emerald-100 flex justify-between items-center">
              <span>${tugas.judul}</span>
              <span class="bg-emerald-600 text-white px-2 py-0.5 rounded-full text-xs">${subs.length} Terkumpul</span>
           </div>
           ${listHtml}
        </div>
      `,
      confirmButtonText: 'Tutup Modul Review',
      confirmButtonColor: '#10b981',
      width: '32em'
   })
}
</script>
