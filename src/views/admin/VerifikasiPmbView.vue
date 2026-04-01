<template>
  <div class="space-y-6 relative">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold theme-text">Verifikasi PMB (Penerimaan Mahasiswa Baru)</h1>
        <p class="theme-text opacity-60 text-sm mt-1">Tinjau registrasi, berikan persetujuan, dan rilis Nomor Induk (NIM) untuk pendaftar.</p>
      </div>
      <div class="flex space-x-2">
         <button @click="seedKelas" class="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-sm font-medium hover:bg-blue-100">Generate Data Kelas</button>
         <span class="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg text-sm font-medium">Tertunda: {{ (authStore.calonMahasiswa || []).length }} Data</span>
      </div>
    </div>

    <!-- Tab Control -->
    <div class="flex space-x-4 border-b border-slate-200 mb-6">
       <button 
          @click="activeTab = 'pending'" 
          class="pb-3 px-2 font-bold text-sm transition transition-all duration-300 relative"
          :class="activeTab === 'pending' ? 'text-primary-600' : 'text-slate-500 hover:text-slate-700'"
       >
          Antrean Verifikasi ({{ (authStore.calonMahasiswa || []).length }})
          <div v-show="activeTab === 'pending'" class="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full"></div>
       </button>
       <button 
          @click="activeTab = 'riwayat'" 
          class="pb-3 px-2 font-bold text-sm transition transition-all duration-300 relative"
          :class="activeTab === 'riwayat' ? 'text-primary-600' : 'text-slate-500 hover:text-slate-700'"
       >
          Riwayat Diterima ({{ mahasiswaTerverifikasi.length }})
          <div v-show="activeTab === 'riwayat'" class="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full"></div>
       </button>
    </div>

    <!-- Tab 1: Menunggu Validasi -->
    <div class="theme-card rounded-2xl shadow-sm border overflow-hidden" v-show="activeTab === 'pending'">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm theme-text">
          <thead class="theme-bg opacity-80 font-medium">
            <tr>
              <th class="px-6 py-4">ID Registrasi</th>
              <th class="px-6 py-4">Calon Mahasiswa</th>
              <th class="px-6 py-4">Kontak (HP & Email)</th>
              <th class="px-6 py-4">Pilihan Prodi</th>
              <th class="px-6 py-4">Waktu Daftar</th>
              <th class="px-6 py-4 text-center">Validasi BAAK</th>
            </tr>
          </thead>
          <tbody class="divide-y theme-border">
            <template v-if="(authStore.calonMahasiswa || []).length > 0">
               <tr class="hover:bg-slate-50 dark:hover:bg-slate-800 transition" v-for="camaba in authStore.calonMahasiswa" :key="camaba.id">
                 <td class="px-6 py-4 font-mono text-[10px] opacity-70">{{ camaba.id }}</td>
                 <td class="px-6 py-4 font-bold text-primary-600">{{ camaba.nama }}</td>
                 <td class="px-6 py-4 text-[11px] leading-tight opacity-90">
                    <div class="font-medium text-slate-800">{{ camaba.no_hp }}</div>
                    <div>{{ camaba.email }}</div>
                 </td>
                 <td class="px-6 py-4">{{ camaba.prodi }}</td>
                 <td class="px-6 py-4 text-[11px] opacity-80">{{ new Date(camaba.tanggal_daftar || camaba.tanggalDaftar).toLocaleString('id-ID') }}</td>
                 <td class="px-6 py-4 text-center min-w-[200px]">
                    <button @click="tolak(camaba.id, camaba.nama)" class="px-3 py-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold transition mr-2">Tolak</button>
                    <button @click="setujui(camaba)" class="px-4 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-bold transition shadow-sm">Terima & Buat NIM</button>
                 </td>
               </tr>
            </template>
            <tr v-else>
               <td colspan="6" class="px-6 py-10 text-center text-slate-400">
                  <svg class="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  Tidak ada pendaftar mahasiswa baru yang menunggu antrean verifikasi.
               </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tab 2: Riwayat Terverifikasi -->
    <div class="theme-card rounded-2xl shadow-sm border overflow-hidden" v-show="activeTab === 'riwayat'">
       <div class="p-4 border-b theme-border flex flex-wrap gap-4 justify-between items-center theme-bg">
          <div class="flex items-center space-x-3 w-full md:w-auto flex-wrap gap-y-3 md:gap-y-0">
             <input type="text" v-model="searchRiwayat" placeholder="Cari NIM / Nama..." class="px-4 py-2 theme-card border rounded-xl text-sm outline-none w-full md:w-48 theme-text focus:ring-2 focus:ring-primary-200">
             <select v-model="filterKelasHistory" class="px-4 py-2 theme-card border rounded-xl text-sm outline-none w-full md:w-auto theme-text focus:ring-2 focus:ring-primary-200">
                <option value="all">Semua Kelas</option>
                <option v-for="k in (masterStore.kelasList || [])" :key="k.idKelas" :value="k.idKelas">{{ k.namaKelas }} ({{ k.idKelas }})</option>
             </select>
          </div>
          <button @click="exportToExcel" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-sm flex items-center justify-center">
             <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
             Export ke Excel (CSV)
          </button>
       </div>
       <div class="overflow-x-auto">
         <table class="w-full text-left text-sm theme-text">
           <thead class="theme-bg opacity-80 font-medium">
             <tr>
               <th class="px-6 py-4">NIM Baru</th>
               <th class="px-6 py-4">Nama Mahasiswa</th>
               <th class="px-6 py-4">Prodi</th>
               <th class="px-6 py-4 text-center">Kelas Penempatan</th>
               <th class="px-6 py-4 text-center">Status Akun</th>
               <th class="px-6 py-4 text-center">Aksi</th>
             </tr>
           </thead>
           <tbody class="divide-y theme-border">
             <template v-if="paginatedRiwayat.length > 0">
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800 transition" v-for="mhs in paginatedRiwayat" :key="mhs.username">
                  <td class="px-6 py-4 font-mono font-bold text-primary-600">{{ mhs.user?.nim }}</td>
                  <td class="px-6 py-4 font-bold">{{ mhs.user?.name }}</td>
                  <td class="px-6 py-4 uppercase text-xs">{{ mhs.user?.prodi || 'Sistem Informasi' }}</td>
                  <td class="px-6 py-4 text-center">
                     <span class="px-3 py-1 bg-slate-100 dark:bg-slate-800 border theme-border rounded font-mono text-xs">{{ mhs.user?.idKelas }}</span>
                  </td>
                  <td class="px-6 py-4 text-center">
                     <span class="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded">Aktif</span>
                  </td>
                  <td class="px-6 py-4 text-center">
                     <button @click="editRiwayat(mhs)" class="px-3 py-1.5 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded text-xs font-bold transition">Edit Kelas</button>
                  </td>
                </tr>
             </template>
             <tr v-else>
                <td colspan="6" class="px-6 py-10 text-center text-slate-400">
                   Tidak ada data mahasiswa terverifikasi.
                </td>
             </tr>
           </tbody>
         </table>
       </div>
       <div class="p-4 border-t theme-border theme-bg flex items-center justify-between" v-if="filteredRiwayat.length > 0">
          <span class="text-xs font-medium opacity-70">
             Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredRiwayat.length) }} dari {{ filteredRiwayat.length }} data
          </span>
          <div class="flex space-x-2">
             <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1.5 theme-card border rounded text-xs font-bold disabled:opacity-50 transition">Prev</button>
             <span class="px-3 py-1.5 text-xs font-bold opacity-70">Hal {{ currentPage }} / {{ totalPages }}</span>
             <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-1.5 theme-card border rounded text-xs font-bold disabled:opacity-50 transition">Next</button>
          </div>
       </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useMasterDataStore } from '@/stores/masterData'
import Swal from 'sweetalert2'
import emailjs from '@emailjs/browser'

const authStore = useAuthStore()
const masterStore = useMasterDataStore()

// Fetch data saat halaman dibuka
onMounted(async () => {
   await authStore.fetchCalonMahasiswa()
   await authStore.fetchMahasiswa()
   await masterStore.fetchAll()
})

const activeTab = ref('pending')
const filterKelasHistory = ref('all')
const searchRiwayat = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

// Ambil data dari mahasiswaDB yang mana itu adalah akun MHS yang telah digenerate (diverifikasi)
const mahasiswaTerverifikasi = computed(() => {
   return (authStore.mahasiswaDB || [])
      .filter(m => m.user && m.role === 'mahasiswa')
      .map(m => m)
})

const filteredRiwayat = computed(() => {
   let result = mahasiswaTerverifikasi.value
   
   if(filterKelasHistory.value !== 'all') {
      result = result.filter(m => m.user?.idKelas === filterKelasHistory.value)
   }
   
   if(searchRiwayat.value) {
      const q = searchRiwayat.value.toLowerCase()
      result = result.filter(m => 
          (m.user?.nim && m.user.nim.toLowerCase().includes(q)) || 
          (m.user?.name && m.user.name.toLowerCase().includes(q))
      )
   }
   
   return result
})

const totalPages = computed(() => {
   return Math.ceil(filteredRiwayat.value.length / itemsPerPage) || 1
})

const paginatedRiwayat = computed(() => {
   const start = (currentPage.value - 1) * itemsPerPage
   const end = start + itemsPerPage
   return filteredRiwayat.value.slice(start, end)
})

const prevPage = () => {
   if(currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
   if(currentPage.value < totalPages.value) currentPage.value++
}

// Reset curpage kalau filter berubah
watch([filterKelasHistory, searchRiwayat], () => {
   currentPage.value = 1
})

const exportToExcel = () => {
   // Buat header CSV
   let csvContent = "NIM,Nama Lengkap,Program Studi,Kelas Penempatan\n"
   
   // Loop data baris per baris
   filteredRiwayat.value.forEach(mhs => {
      const row = [
         mhs.user?.nim || '-',
         `"${mhs.user?.name || '-'}"`,
         `"${mhs.user?.prodi || '-'}"`,
         `"${mhs.user?.idKelas || '-'}"`
      ].join(",")
      csvContent += row + "\n"
   })
   
   // Bikin dummy trigger donwload
   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
   const url = URL.createObjectURL(blob)
   const link = document.createElement("a")
   link.setAttribute("href", url)
   link.setAttribute("download", `Data_Mahasiswa_Baru_${filterKelasHistory.value}.csv`)
   link.style.visibility = 'hidden'
   document.body.appendChild(link)
   link.click()
   document.body.removeChild(link)
}

const editRiwayat = (mhs) => {
   // Filter kelas yang sesuai dengan Program Studi pendaftar
   const availableClasses = masterStore.kelasList.filter(k => k.prodi === mhs.user?.prodi)
   
   // Siapkan options untuk SweetAlert Select
   const inputOptions = {}
   availableClasses.forEach(c => {
      inputOptions[c.idKelas] = `${c.namaKelas} (${c.idKelas})`
   })

   Swal.fire({
      title: 'Edit Kelas Penempatan',
      html: `Pilih plot kelas penempatan pengganti untuk <b>${mhs.user?.name}</b> (${mhs.user?.nim}).<br><br><span class="text-sm opacity-80">Saat ini dia berada di kelas <span class="font-bold p-1 bg-slate-100 rounded border">${mhs.user?.idKelas}</span></span>`,
      icon: 'info',
      input: 'select',
      inputOptions: inputOptions,
      inputValue: mhs.user?.idKelas,
      showCancelButton: true,
      confirmButtonText: 'Simpan Perubahan',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#3b82f6',
      inputValidator: (value) => {
          return new Promise((resolve) => {
              if (value) {
                  resolve()
              } else {
                  resolve('Pilih kelas terlebih dahulu!')
              }
          })
      }
   }).then((res) => {
      if(res.isConfirmed) {
         const isUpdated = authStore.updateMahasiswaData(mhs.username, { idKelas: res.value })
         if(isUpdated) {
             Swal.fire('Tersimpan', `Mahasiswa ${mhs.user?.name} sukses dipindahkan ke kelas ${res.value}.`, 'success')
         } else {
             Swal.fire('Gagal', 'Terjadi kesalahan saat memindahkan kelas.', 'error')
         }
      }
   })
}

// Konfigurasi EmailJS (Harus diisi dengan kredensial dari emailjs.com)
const EMAILJS_SERVICE_ID = 'service_91x6abn'
const EMAILJS_TEMPLATE_ID = 'template_pzbwpza'
const EMAILJS_PUBLIC_KEY = 'MU6rQhY8_JcedLtfP'

const sendRealEmail = (nama, emailTarget, nimBaru) => {
   // Cek apakah key sudah diubah oleh user, jika belum kita abort agar tidak melemparkan error console
   if(EMAILJS_TEMPLATE_ID === 'TEMPLATE_ID_ANDA_DISINI' || EMAILJS_PUBLIC_KEY === 'PUBLIC_KEY_ANDA_DISINI') {
      console.warn('Email asli tidak terkirim: Kredensial Template / Public Key EmailJS belum diisi.')
      return
   }

   const templateParams = {
      to_name: nama,
      to_email: emailTarget,       // Pastikan di EmailJS dashboard -> template ini dinamakan sama `to_email`
      message: `Pendaftaran Anda telah di-ACC. Nomor Induk Anda adalah ${nimBaru}. Anda sudah dapat menggunakannya bersama dengan password yang Anda buat untuk Login ke portal Mahasiswa.`
   };

   emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY)
      .then((response) => {
         console.log('Surat asli berhasil masuk ke Gmail pendaftar!', response.status, response.text)
      }, (err) => {
         console.error('Gagal mengirim email: ', err)
         // Swal.fire('Oops! Email Gagal Dikirim', `Alasannya: ${err.text || 'Cek Console F12'}`, 'error')
      })
}

const setujui = (camaba) => {
   // Filter kelas yang sesuai dengan Program Studi pendaftar
   let availableClasses = masterStore.kelasList.filter(k => k.prodi === camaba.prodi)
   
   // Fallback: kalau tidak ada kelas match, tampilkan semua kelas
   if (availableClasses.length === 0) {
      availableClasses = masterStore.kelasList
   }
   
   // Kalau masih kosong, beri tahu user
   if (availableClasses.length === 0) {
      Swal.fire('Data Kelas Kosong', 'Tidak ada data kelas di sistem. Silakan tambah kelas dulu di Master Data.', 'error')
      return
   }
   
   // Siapkan options untuk SweetAlert Select
   const inputOptions = {}
   availableClasses.forEach(c => {
      inputOptions[c.idKelas] = `${c.namaKelas} (${c.prodi || 'Umum'}) - ${c.idKelas}`
   })

   Swal.fire({
      title: 'Verifikasi Pendaftar?',
      html: `Pilih plot kelas penempatan untuk <b>${camaba.nama}</b>.<br><br><span class="text-sm opacity-80">Sistem akan otomatis merilis NIM dan mengirimkan pesan konfirmasi ke <b>${camaba.email}</b>.</span>`,
      icon: 'question',
      input: 'select',
      inputOptions: inputOptions,
      inputPlaceholder: 'Pilih Kelas Penempatan...',
      showCancelButton: true,
      confirmButtonText: 'Setujui & Buat NIM',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#10b981',
      inputValidator: (value) => {
          return new Promise((resolve) => {
              if (value) {
                  resolve()
              } else {
                  resolve('Anda harus menempatkan maba ke dalam kelas minimal satu!')
              }
          })
      }
   }).then(async (res) => {
      if(res.isConfirmed) {
         const selectedKelas = res.value
         // Jalankan action Minta Buat NIM + passing parameter ID kelas
         const newNim = await authStore.approveCamaba(camaba.id, selectedKelas)
         
         if(newNim) {
             // 1. Trigger Plugin Pengirim Email Asli Disini!
             sendRealEmail(camaba.nama, camaba.email, newNim)

             // 2. Munculkan Pop up
             Swal.fire({
                 title: 'Akun Diaktifkan & Email Terkirim!',
                 html: `<div class="mb-4">Calon Mahasiswa <b>${camaba.nama}</b> berhasil diverifikasi dan diregistrasi. Disimpan pada kelompok kelas <span class="font-bold border px-1 rounded bg-slate-100">${selectedKelas}</span></div>
                        <span class="text-sm opacity-80">NIM yang diberikan:</span><br>
                        <span class="text-3xl font-bold font-mono text-emerald-600 mt-2 block">${newNim}</span>
                        
                        <!-- Simulasi Kotak Email Diterima: -->
                        <div class="mt-6 text-sm text-left bg-blue-50/70 border border-blue-200 p-4 rounded-xl shadow-sm relative overflow-hidden">
                           <div class="absolute right-[-10px] top-max-[-10px] opacity-10 text-blue-800">
                             <svg class="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"></path></svg>
                           </div>
                           <p class="font-bold text-blue-900 flex items-center mb-1">
                              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                              LOG SISTEM EMAIL: TERKIRIM
                           </p>
                           <p class="text-blue-800/80 mb-2"><b>Tujuan:</b> ${camaba.email}</p>
                           <div class="bg-white p-3 rounded border border-blue-100/50">
                              <p class="font-bold uppercase tracking-widest text-[10px] text-slate-400 mb-2">Surat Pemberitahuan SIAKAD</p>
                              Halo ${camaba.nama},<br><br>Pendaftaran Anda telah di-ACC. Nomor Induk Anda adalah <span class="bg-green-100 font-mono font-bold px-1">${newNim}</span>.<br>Anda sudah dapat menggunakannya bersama dengan password yang Anda buat untuk Login ke portal Mahasiswa.
                           </div>
                        </div>`,
                 icon: 'success'
             })
         }
      }
   })
}

const tolak = (id, nama) => {
   Swal.fire({
      title: 'Tolak Pendaftar?',
      text: `Surat permohonan untuk ${nama} akan ditarik. Keputusan tidak dapat dibatalkan.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Tolak',
      confirmButtonColor: '#ef4444'
   }).then((res) => {
      if(res.isConfirmed) {
         authStore.rejectCamaba(id)
         Swal.fire('Terhapus', 'Registrasi pendaftar telah dibuang dari sistem.', 'info')
      }
   })
}

const seedKelas = async () => {
   try {
      const res = await fetch('http://localhost:5000/api/master/seed-kelas', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
         Swal.fire('Berhasil!', `${data.message}\nSilakan refresh halaman untuk melihat perubahan.`, 'success')
         await masterStore.fetchAll()
      } else {
         Swal.fire('Error', data.error || 'Gagal generate kelas', 'error')
      }
   } catch (e) {
      Swal.fire('Error', 'Gagal konek ke server', 'error')
   }
}
</script>
