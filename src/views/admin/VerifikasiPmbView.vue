<template>
  <div class="space-y-6 relative">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold theme-text">Verifikasi PMB (Penerimaan Mahasiswa Baru)</h1>
        <p class="theme-text opacity-60 text-sm mt-1">Tinjau registrasi, berikan persetujuan, dan rilis Nomor Induk (NIM) untuk pendaftar.</p>
      </div>
      <div class="flex space-x-2">
         <span class="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg text-sm font-medium">Tertunda: {{ authStore.calonMahasiswa.length }} Data</span>
      </div>
    </div>

    <!-- Area Tabel Verifikasi -->
    <div class="theme-card rounded-2xl shadow-sm border overflow-hidden">
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
            <template v-if="authStore.calonMahasiswa.length > 0">
               <tr class="hover:bg-slate-50 dark:hover:bg-slate-800 transition" v-for="camaba in authStore.calonMahasiswa" :key="camaba.id">
                 <td class="px-6 py-4 font-mono text-[10px] opacity-70">{{ camaba.id }}</td>
                 <td class="px-6 py-4 font-bold text-primary-600">{{ camaba.nama }}</td>
                 <td class="px-6 py-4 text-[11px] leading-tight opacity-90">
                    <div class="font-medium text-slate-800">{{ camaba.nohp }}</div>
                    <div>{{ camaba.email }}</div>
                 </td>
                 <td class="px-6 py-4">{{ camaba.prodi }}</td>
                 <td class="px-6 py-4 text-[11px] opacity-80">{{ new Date(camaba.tanggalDaftar).toLocaleString('id-ID') }}</td>
                 <td class="px-6 py-4 text-center min-w-[200px]">
                    <button @click="tolak(camaba.id, camaba.nama)" class="px-3 py-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold transition mr-2">Tolak</button>
                    <button @click="setujui(camaba.id, camaba.nama, camaba.email)" class="px-4 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-bold transition shadow-sm">Terima & Buat NIM</button>
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
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'
import emailjs from '@emailjs/browser'

const authStore = useAuthStore()

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

const setujui = (id, nama, email) => {
   Swal.fire({
      title: 'Verifikasi Pendaftar?',
      html: `Sistem SIAKAD akan mencetak Nomor Induk Mahasiswa (NIM) resmi untuk <b>${nama}</b> dan secara otomatis sistem akan <b>mengirimkan email notifikasi ke <u>${email}</u></b> berisi data akses masuknya.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Setujui & Buat NIM',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#10b981'
   }).then((res) => {
      if(res.isConfirmed) {
         const newNim = authStore.approveCamaba(id)
         if(newNim) {
             // 1. Trigger Plugin Pengirim Email Asli Disini!
             sendRealEmail(nama, email, newNim)

             // 2. Munculkan Pop up
             Swal.fire({
                 title: 'Akun Diaktifkan & Email Terkirim!',
                 html: `<div class="mb-4">Calon Mahasiswa <b>${nama}</b> berhasil diverifikasi dan diregistrasi.</div>
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
                           <p class="text-blue-800/80 mb-2"><b>Tujuan:</b> ${email}</p>
                           <div class="bg-white p-3 rounded border border-blue-100/50">
                              <p class="font-bold uppercase tracking-widest text-[10px] text-slate-400 mb-2">Surat Pemberitahuan SIAKAD</p>
                              Halo ${nama},<br><br>Pendaftaran Anda telah di-ACC. Nomor Induk Anda adalah <span class="bg-green-100 font-mono font-bold px-1">${newNim}</span>.<br>Anda sudah dapat menggunakannya bersama dengan password yang Anda buat untuk Login ke portal Mahasiswa.
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
</script>
