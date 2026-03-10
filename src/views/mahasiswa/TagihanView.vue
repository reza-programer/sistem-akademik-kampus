<template>
  <div class="space-y-6 max-w-7xl mx-auto pb-10">
    <div class="border-b border-slate-200 pb-3">
      <h1 class="text-2xl font-bold theme-text">Tagihan & Pembayaran Akademik</h1>
      <p class="theme-text opacity-60 text-sm mt-1">Laman rincian biaya pendidikan dan Uang Kuliah Tunggal (UKT) Anda.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Kolom Kiri: Ringkasan Tagihan Aktif -->
      <div class="lg:col-span-1 space-y-6">
        
        <div class="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
           <div class="absolute top-0 right-0 opacity-10 drop-shadow-2xl translate-x-4 -translate-y-4">
              <svg class="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M11 20H6A2 2 0 014 18V6a2 2 0 012-2h5m4-4h5a2 2 0 012 2v10a2 2 0 01-2 2h-5m0-14V4a2 2 0 00-2-2H9a2 2 0 00-2 2v2"></path></svg>
           </div>
           
           <h3 class="text-white/80 font-bold uppercase tracking-widest text-xs mb-1 relative z-10">Total Tagihan Belum Dibayar</h3>
           <h2 class="text-4xl font-black tracking-tighter relative z-10 mb-4">{{ formatRupiah(keuanganStore.totalTagihanPending) }}</h2>
           
           <div v-if="keuanganStore.totalTagihanPending > 0" class="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 relative z-10 mt-6">
             <div class="flex items-center text-sm font-semibold mb-2">
                <svg class="w-5 h-5 mr-2 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>Segera Lakukan Pembayaran</span>
             </div>
             <p class="text-xs text-white/70 leading-relaxed mb-4">
               Harap lunasi tagihan Anda sebelum batas waktu yang ditentukan agar bisa mengajukan KRS semester depan.
             </p>
           </div>

           <div v-else class="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 relative z-10">
             <div class="flex items-center text-sm font-semibold text-emerald-300">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>Selesai! Tidak ada tagihan aktif.</span>
             </div>
           </div>
        </div>

        <!-- Instruksi -->
        <div class="theme-card border theme-border rounded-xl p-5 shadow-sm">
           <h4 class="font-bold text-sm theme-text mb-3 flex items-center">
             <svg class="w-4 h-4 mr-2 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             Metode Pembayaran Tersedia
           </h4>
           <div class="space-y-3">
              <div class="flex items-center p-2.5 border theme-border rounded-lg grayscale hover:grayscale-0 transition cursor-help border-l-4 border-l-blue-600">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg" class="h-4 object-contain mr-3 w-12" alt="BCA">
                 <span class="text-xs font-bold theme-text">BCA Virtual Account</span>
              </div>
              <div class="flex items-center p-2.5 border theme-border rounded-lg grayscale hover:grayscale-0 transition cursor-help border-l-4 border-l-amber-500">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg" class="h-4 object-contain mr-3 w-12" alt="Mandiri">
                 <span class="text-xs font-bold theme-text">Livin' by Mandiri VA</span>
              </div>
              <div class="flex items-center p-2.5 border theme-border rounded-lg grayscale hover:grayscale-0 transition cursor-help border-l-4 border-l-orange-500">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/9/97/Logo_BNI_%28Bank_Negara_Indonesia%29.svg" class="h-4 object-contain mr-3 w-12" alt="BNI">
                 <span class="text-xs font-bold theme-text">BNI Virtual Account</span>
              </div>
           </div>
        </div>

      </div>

      <!-- Kolom Kanan: Rincian Tagihan Tertunda & Riwayat -->
      <div class="lg:col-span-2 space-y-6">
         
         <div class="theme-card rounded-2xl shadow-sm border theme-border overflow-hidden">
            <div class="px-5 py-4 border-b theme-border theme-bg flex justify-between items-center">
               <h3 class="font-bold theme-text">Daftar Tagihan Aktif</h3>
               <span class="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold">{{ keuanganStore.tagihanAktif.length }} Pending</span>
            </div>
            
            <div class="p-5">
               <template v-if="keuanganStore.tagihanAktif.length > 0">
                 <div v-for="tagihan in keuanganStore.tagihanAktif" :key="tagihan.id" class="border theme-border rounded-xl p-5 relative overflow-hidden transition-all hover:border-primary-400 group">
                    <!-- Ribbon -->
                    <div class="absolute top-3 -right-8 bg-red-500 text-white font-bold text-[10px] tracking-widest uppercase py-1 px-10 rotate-45 shadow-sm hidden md:block">
                       Past Due
                    </div>
                    
                    <div class="flex flex-col md:flex-row justify-between md:items-center gap-4">
                       <div>
                          <div class="flex items-center gap-2 mb-1">
                             <span class="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{{ tagihan.id }}</span>
                             <span class="text-xs font-bold px-2 py-0.5 rounded" :class="isPastDue(tagihan.batasPembayaran) ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'">
                                Jatuh Tempo: {{ formatDate(tagihan.batasPembayaran) }}
                             </span>
                          </div>
                          <h4 class="font-bold text-lg theme-text">{{ tagihan.jenis }}</h4>
                          <p class="text-sm theme-text opacity-70">Semester {{ tagihan.semester }}</p>
                       </div>
                       
                       <div class="md:text-right flex flex-col items-start md:items-end">
                          <p class="text-2xl font-black text-red-600 tracking-tighter">{{ formatRupiah(tagihan.nominal) }}</p>
                          <button @click="openPaymentModal(tagihan)" class="mt-2 bg-primary-600 hover:bg-primary-700 w-full md:w-auto text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm transition">
                             Bayar Sekarang
                          </button>
                       </div>
                    </div>
                 </div>
               </template>
               <div v-else class="text-center py-10 opacity-70">
                  <div class="inline-flex w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full items-center justify-center mb-4">
                     <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <p class="font-bold theme-text">Semua tagihan lunas!</p>
                  <p class="text-sm">Anda tidak memiliki tunggakan biaya perkuliahan.</p>
               </div>
            </div>
         </div>

         <!-- Riwayat Pembayaran -->
         <div class="theme-card rounded-2xl shadow-sm border theme-border overflow-hidden">
            <div class="px-5 py-4 border-b theme-border theme-bg">
               <h3 class="font-bold theme-text">Riwayat Transaksi (Lunas)</h3>
            </div>
            
            <div class="overflow-x-auto">
               <table class="w-full text-left text-sm theme-text">
                  <thead class="theme-bg opacity-80 font-medium text-xs uppercase tracking-wider">
                     <tr>
                        <th class="px-5 py-3 border-b theme-border">No. Invoice</th>
                        <th class="px-5 py-3 border-b theme-border">Rincian Pembayaran</th>
                        <th class="px-5 py-3 border-b theme-border">Tanggal Bayar</th>
                        <th class="px-5 py-3 border-b theme-border">Nominal</th>
                        <th class="px-5 py-3 border-b theme-border text-center">Status</th>
                     </tr>
                  </thead>
                  <tbody class="divide-y theme-border">
                     <tr v-for="riwayat in keuanganStore.riwayatPembayaran" :key="riwayat.id" class="hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                        <td class="px-5 py-4 font-mono text-xs">{{ riwayat.id }}</td>
                        <td class="px-5 py-4">
                           <p class="font-bold">{{ riwayat.jenis }}</p>
                           <p class="text-xs opacity-70">Smt: {{ riwayat.semester }}</p>
                           <p class="text-xs text-primary-600 font-semibold mt-1">{{ riwayat.metode }}</p>
                        </td>
                        <td class="px-5 py-4">{{ formatDate(riwayat.tanggalBayar) }}</td>
                        <td class="px-5 py-4 font-bold tracking-tight">{{ formatRupiah(riwayat.nominal) }}</td>
                        <td class="px-5 py-4 text-center">
                           <span class="inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 rounded-sm text-xs font-bold">
                              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>LUNAS
                           </span>
                        </td>
                     </tr>
                  </tbody>
               </table>
               <div v-if="keuanganStore.riwayatPembayaran.length === 0" class="p-8 text-center text-sm theme-text opacity-60">
                 Belum ada riwayat transaksi pembayaran.
               </div>
            </div>
         </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { useKeuanganStore } from '@/stores/keuangan'
import { useNotificationStore } from '@/stores/notification'
import Swal from 'sweetalert2'

const keuanganStore = useKeuanganStore()
const notificationStore = useNotificationStore()

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number)
}

const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateStr).toLocaleDateString('id-ID', options)
}

const isPastDue = (dueDateStr) => {
    if (!dueDateStr) return false
    const due = new Date(dueDateStr)
    const today = new Date()
    return due < today
}

const openPaymentModal = (tagihan) => {
   // Simulasi integrasi Payment Gateway via Modal SweetAlert HTML Custom
   Swal.fire({
      title: 'Pilih Metode Pembayaran',
      html: `
        <div class="text-left mt-4 text-sm space-y-4">
           <div class="bg-blue-50 p-4 border border-blue-100 rounded-lg">
              <p class="font-bold mb-1">Invoice: ${tagihan.id}</p>
              <p>Rincian: UKT Semester ${tagihan.semester}</p>
              <p class="text-xl font-black text-slate-800 mt-2">${formatRupiah(tagihan.nominal)}</p>
           </div>
           <div>
              <label class="block font-bold text-slate-700 mb-2">Metode Tersedia (Virtual Account)</label>
              <select id="swal-metode" class="w-full border border-slate-300 p-3 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500">
                 <option value="BCA Virtual Account">BCA Virtual Account</option>
                 <option value="Mandiri Virtual Account">Mandiri Virtual Account</option>
                 <option value="BNI Virtual Account">BNI Virtual Account</option>
                 <option value="BSI Virtual Account">Bank Syariah Indonesia (BSI)</option>
                 <option value="BRI Virtual Account">BRI Virtual Account (BRIVA)</option>
              </select>
           </div>
           <div class="text-xs text-slate-500 italic mt-2 text-center text-rose-500">Ini adalah area simulasi sandbox payment gateway.</div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Proses Demo Bayar',
      cancelButtonText: 'Tutup',
      confirmButtonColor: '#0ea5e9',
      width: '32em',
      preConfirm: () => {
         const metode = document.getElementById('swal-metode').value
         return metode
      }
   }).then((result) => {
      if(result.isConfirmed) {
         // Animasi loading buatan
         Swal.fire({
            title: 'Memproses Pembayaran...',
            text: 'Menghubungi provider bank.',
            allowOutsideClick: false,
            didOpen: () => {
               Swal.showLoading()
            }
         })

         setTimeout(() => {
            // Commit ke global store pinia
            keuanganStore.bayarTagihan(tagihan.id, result.value)
            
            // Beri global notif ke admin/keuangan
            notificationStore.addNotification('admin', {
                title: 'Pembayaran UKT Baru Diterima',
                message: `Mahasiswa telah membayar tagihan [${tagihan.id}] senilai ${formatRupiah(tagihan.nominal)} melalui ${result.value}.`,
                type: 'success'
            })

            Swal.fire({
               icon: 'success',
               title: 'Pembayaran Berhasil!',
               html: `<p class="text-sm">Terima kasih. Dana tagihan akademik UKT Anda telah masuk ke kas bendahara dan status Invoice telah dilunaskan.</p>`,
               confirmButtonColor: '#10b981'
            })
         }, 1500)
      }
   })
}
</script>
