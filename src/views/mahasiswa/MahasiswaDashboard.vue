<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    
    <!-- Bagian Head Title -->
    <div class="border-b border-slate-200 pb-3 mb-6">
      <h1 class="text-2xl font-normal text-slate-800 tracking-wide">Informasi Umum</h1>
    </div>

    <!-- Alert / Notifikasi -->
    <div class="bg-amber-50 border border-amber-200 text-amber-700 rounded-sm p-4 text-sm font-medium">
      Status Akademik anda Aktif di Tahun Akademik ini. Segera lakukan pengisian KRS sebelum masa perwalian ditutup!
    </div>

    <!-- Banner Rekening Pembayaran (Mirip aslinya) -->
    <div class="bg-[#0f766e] text-white rounded-sm p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center md:items-start relative overflow-hidden">
      <div class="absolute -left-10 -bottom-10 opacity-10">
         <svg class="w-48 h-48" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.64-2.25 1.64-1.74 0-2.32-.9-2.41-1.96H7.78c.11 1.95 1.44 2.97 3.12 3.32V19h2.5v-1.66c1.55-.26 2.88-1.22 2.88-2.92-.01-2.16-1.89-2.89-3.96-3.28z"></path></svg>
      </div>

      <div class="bg-white/20 p-4 rounded-lg flex-shrink-0 z-10 backdrop-blur-sm">
        <svg fill="currentColor" class="w-12 h-12" viewBox="0 0 24 24"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path></svg>
      </div>
      
      <div class="z-10 w-full">
        <h3 class="font-bold text-lg mb-4 uppercase tracking-wider">Pembayaran Dapat Dilakukan Ke Rekening:</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm md:text-base">
           <div class="flex items-center gap-4">
              <span class="font-bold w-16 text-right">BNI46 :</span>
              <span class="font-mono bg-white/10 px-2 py-0.5 rounded">9880246821090147</span>
           </div>
           <div class="text-white/80">Validasi otomatis (Tidak perlu ke BAKKUP)</div>
           
           <div class="flex items-center gap-4">
              <span class="font-bold w-16 text-right">BRIVA :</span>
              <span class="font-mono bg-white/10 px-2 py-0.5 rounded">1097821090147</span>
           </div>
           <div class="text-white/80">Validasi Otomatis (Tidak perlu ke BAKKUP)</div>
        </div>
      </div>
    </div>

    <!-- Kartu Profil & Status Genap/Ganjil -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-slate-200 rounded-sm overflow-hidden bg-white shadow-sm">
      
      <!-- Profil Info -->
      <div class="lg:col-span-2 p-6 flex flex-col md:flex-row gap-6 border-b lg:border-b-0 lg:border-r border-slate-200">
         <div class="flex-shrink-0 flex items-start justify-center">
             <div class="w-32 h-32 bg-slate-100 rounded text-slate-400 p-2 overflow-hidden flex items-end justify-center border border-slate-200">
                <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>
             </div>
         </div>
         <div class="flex-1 space-y-2">
            <div class="grid grid-cols-[140px_10px_1fr] text-sm md:text-base mb-4 lg:mb-2">
                <div class="font-bold text-slate-700 uppercase tracking-widest text-lg md:text-xl relative top-0.5">NIM</div>
                <div class="font-bold text-lg md:text-xl text-slate-700">:</div>
                <div class="font-bold text-2xl md:text-4xl text-slate-800 tracking-tight">{{ authStore.user?.nim || '20260001' }}</div>
            </div>
            
            <div class="grid grid-cols-[140px_10px_1fr] text-sm">
                <div class="text-slate-600">Nama</div>
                <div>:</div>
                <div class="font-medium text-slate-800 uppercase">{{ authStore.user?.name || 'Andi Wijaya' }}</div>
            </div>
            <div class="grid grid-cols-[140px_10px_1fr] text-sm">
                <div class="text-slate-600">Semester Terakhir</div>
                <div>:</div>
                <div class="font-medium text-slate-800">{{ authStore.user?.semester || 1 }}</div>
            </div>
            <div class="grid grid-cols-[140px_10px_1fr] text-sm">
                <div class="text-slate-600">Kelas</div>
                <div>:</div>
                <div class="font-medium text-slate-800">{{ authStore.user?.idKelas || 'Belum Ada Kelas' }}</div>
            </div>
         </div>
      </div>

      <!-- Status Kelulusan / IPK / SKS -->
      <div class="bg-slate-800 text-white p-6 relative overflow-hidden">
         <div class="absolute right-4 top-4 opacity-20">
            <svg fill="currentColor" class="w-16 h-16" viewBox="0 0 24 24"><path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></svg>
         </div>

         <div class="relative z-10 flex flex-col h-full justify-center">
            <p class="text-xs mb-1 uppercase tracking-wider text-white/80">Tahun Akademik saat ini : Ganjil 2026/2027</p>
            <h2 class="text-3xl font-bold mb-2">Aktif</h2>
            <div class="text-lg font-bold mb-4">IPK LOKAL (DARI KRS) : {{ hitungIpk() }}</div>
            
            <div class="text-xs space-y-1 text-white/90">
               <p>Jumlah SKS yang telah diambil : 24</p>
               <p>Jumlah SKS yang diambil semester ini : {{ krsStore.totalSks }}</p>
            </div>
         </div>
      </div>

    </div>

    <!-- Dosen Wali -->
    <div class="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-sm text-sm">
        <span class="text-slate-500 mr-2">Pembimbing Akademik :</span>
        <span class="font-medium text-primary-700">Ir. Budi Santoso, S.Kom., M.T.</span>
    </div>

    <!-- Tabel Validasi Pembayaran -->
    <div class="mt-8">
      <h3 class="text-lg font-normal text-slate-800 border-b border-slate-200 pb-2 mb-4">Validasi Pembayaran</h3>
      <div class="overflow-x-auto shadow-sm border border-slate-200 rounded-sm">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-slate-600 uppercase bg-slate-100 border-b border-slate-200">
            <tr>
              <th scope="col" class="px-6 py-3 font-medium border-r border-slate-200">Tahap Akademik</th>
              <th scope="col" class="px-6 py-3 font-medium border-r border-slate-200">Jenis Pembayaran</th>
              <th scope="col" class="px-6 py-3 font-medium border-r border-slate-200 text-right">Biaya</th>
              <th scope="col" class="px-6 py-3 font-medium border-r border-slate-200 text-right">Bayar</th>
              <th scope="col" class="px-6 py-3 font-medium border-r border-slate-200 text-right">Sisa</th>
              <th scope="col" class="px-6 py-3 font-medium border-r border-slate-200">Status</th>
              <th scope="col" class="px-6 py-3 font-medium text-center">Prioritas</th>
            </tr>
          </thead>
          <tbody class="text-slate-500 text-xs">
            <tr v-if="myTagihanAktif.length === 0">
              <td colspan="7" class="px-6 py-8 text-center bg-white border-b border-slate-200">
                 <div class="flex flex-col items-center justify-center">
                    <svg class="w-10 h-10 mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    Belum ada data validasi pembayaran akademik
                 </div>
              </td>
            </tr>
            <tr v-for="tagihan in myTagihanAktif" :key="tagihan.id" class="bg-white border-b border-slate-200 hover:bg-slate-50 transition">
              <td class="px-6 py-3 border-r border-slate-200 font-medium text-slate-700">{{ tagihan.semester }}</td>
              <td class="px-6 py-3 border-r border-slate-200">{{ tagihan.jenis }}</td>
              <td class="px-6 py-3 border-r border-slate-200 text-right font-mono">{{ formatRupiahNominal(tagihan.nominal) }}</td>
              <td class="px-6 py-3 border-r border-slate-200 text-right font-mono">{{ tagihan.status === 'Lunas' ? formatRupiahNominal(tagihan.nominal) : '0,-' }}</td>
              <td class="px-6 py-3 border-r border-slate-200 text-right font-mono font-bold text-red-600">{{ tagihan.status === 'Lunas' ? '0,-' : formatRupiahNominal(tagihan.nominal) }}</td>
              <td class="px-6 py-3 border-r border-slate-200">
                <span class="px-2 py-1 rounded text-xs font-bold bg-red-100 text-red-700">Belum Lunas</span>
              </td>
              <td class="px-6 py-3 text-center">
                <span class="px-2 py-1 rounded text-xs font-bold bg-amber-100 text-amber-700">Tinggi</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Rekap Jumlah Biaya -->
     <div class="mt-4 flex flex-col items-stretch md:items-end space-y-3 text-sm text-slate-800">
        <div class="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
           <span class="font-bold md:mr-4 text-xs md:text-sm">Jumlah Biaya Studi yang harus dibayarkan :</span>
           <div class="flex items-center flex-shrink-0">
              <span class="bg-slate-700 text-white px-3 py-1.5 font-bold w-12 text-center border-r border-slate-600 whitespace-nowrap">Rp</span>
               <span class="border border-slate-300 px-4 py-1.5 flex-1 md:w-40 font-mono whitespace-nowrap">{{ formatRupiahNominal(myTotalPending) }}</span>
           </div>
        </div>
        <div class="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
           <span class="font-bold md:mr-4 text-xs md:text-sm">Sisa Uang yang masih ada di Kas Universitas Kuningan :</span>
           <div class="flex items-center flex-shrink-0">
              <span class="bg-slate-700 text-white px-3 py-1.5 font-bold w-12 text-center border-r border-slate-600 whitespace-nowrap">Rp</span>
              <span class="border border-slate-300 px-4 py-1.5 flex-1 md:w-40 font-mono whitespace-nowrap">0,-</span>
           </div>
        </div>
     </div>

    <!-- Tabel History Pembayaran -->
    <div class="mt-8">
      <h3 class="text-xl font-normal text-slate-800 border-b border-slate-200 pb-2 mb-4">History Pembayaran</h3>
      <div class="overflow-x-auto shadow-sm border border-slate-200 rounded-sm">
        <table class="w-full text-sm text-left">
          <thead class="text-[11px] text-slate-600 uppercase bg-slate-100 border-b border-slate-200">
            <tr>
              <th scope="col" class="px-6 py-3 font-medium border-r border-slate-200 text-center">Tanggal Bayar</th>
              <th scope="col" class="px-6 py-3 font-medium border-r border-slate-200">Jenis Pembayaran</th>
              <th scope="col" class="px-6 py-3 font-medium border-r border-slate-200 text-right">Jumlah</th>
              <th scope="col" class="px-6 py-3 font-medium border-r border-slate-200 text-right">Metode</th>
              <th scope="col" class="px-6 py-3 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody class="text-slate-500 text-xs">
            <tr v-if="myRiwayat.length === 0">
              <td colspan="5" class="px-6 py-8 text-center bg-white border-b border-slate-200">
                 <div class="flex flex-col items-center justify-center">
                    <svg class="w-10 h-10 mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Riwayat Pembayaran kosong
                 </div>
              </td>
            </tr>
            <tr v-for="riwayat in myRiwayat" :key="riwayat.id" class="bg-white border-b border-slate-200 hover:bg-slate-50 transition">
              <td class="px-6 py-3 border-r border-slate-200 text-center">{{ formatTanggal(riwayat.tanggalBayar) }}</td>
              <td class="px-6 py-3 border-r border-slate-200 font-bold text-slate-700">{{ riwayat.jenis }}</td>
              <td class="px-6 py-3 border-r border-slate-200 text-right font-mono font-bold text-emerald-600">{{ formatRupiahNominal(riwayat.nominal) }}</td>
              <td class="px-6 py-3 border-r border-slate-200 text-right">{{ riwayat.metode || '-' }}</td>
              <td class="px-6 py-3 text-center">
                <span class="px-2 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-700">Lunas ✓</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useKrsStore } from '@/stores/krs'
import { useKeuanganStore } from '@/stores/keuangan'

const authStore = useAuthStore()
const krsStore = useKrsStore()
const keuanganStore = useKeuanganStore()

const role = computed(() => authStore.role)
const currentNim = computed(() => authStore.user?.nim || '20260001')
const myTagihanAktif = computed(() => keuanganStore.tagihanAktifByNim(currentNim.value))
const myTotalPending = computed(() => keuanganStore.totalTagihanPendingByNim(currentNim.value))
const myRiwayat = computed(() => keuanganStore.riwayatPembayaranByNim(currentNim.value))

const formatRupiahNominal = (angka) => {
  if (!angka) return '0,-'
  return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',-'
}

const formatTanggal = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
}

const hitungIpk = () => {
   if (!krsStore.isApproved || krsStore.selectedMatkul.length === 0) return '0.00'
   
   let totalSks = 0
   let totalBobot = 0
   krsStore.selectedMatkul.forEach(mk => {
      if(mk.bobot !== undefined) {
         totalSks += mk.sks
         totalBobot += (mk.sks * mk.bobot)
      }
   })
   
   if (totalSks === 0) return '0.00'
   return (totalBobot / totalSks).toFixed(2)
}
</script>

<style scoped>
/* Scoped styles untuk menangani detail border yang mirip table HTML asli */
table {
   border-collapse: collapse;
}
th, td {
   border-bottom: 1px solid #e2e8f0;
}
</style>
