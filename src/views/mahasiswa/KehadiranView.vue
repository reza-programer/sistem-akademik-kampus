<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="border-b border-slate-200 pb-3 mb-6">
      <h1 class="text-2xl font-normal text-slate-800 tracking-wide">Rekap Kehadiran Kuliah</h1>
    </div>

    <!-- Alert Status -->
    <div v-if="rekap.persentase >= 75" class="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-sm p-4 text-sm font-medium flex items-center shadow-sm">
      <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      Persentase kehadiran Anda sebesar {{ rekap.persentase }}% telah memenuhi batas minimal kewajiban (75%) untuk mengikuti Ujian Akhir Semester.
    </div>
    <div v-else class="bg-red-50 border border-red-200 text-red-700 rounded-sm p-4 text-sm font-medium flex items-center shadow-sm">
      <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
      PERHATIAN: Persentase kehadiran Anda ({{ rekap.persentase }}%) berada di bawah syarat minimal UAS (75%). Segera hubungi Dosen Pengampu Mata Kuliah.
    </div>

    <!-- Progress Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
       <!-- Card % Kehadiran -->
       <div class="bg-white border flex flex-col items-center justify-center p-6 border-slate-200 shadow-sm rounded-sm">
          <div class="relative w-32 h-32 mb-4 flex items-center justify-center">
             <!-- Circular Progress Simulation -->
             <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
               <path class="text-slate-100" stroke-width="3" stroke="currentColor" fill="none"
                 d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
               <path :class="rekap.persentase >= 75 ? 'text-primary-600' : 'text-red-500'" stroke-width="3" :stroke-dasharray="`${rekap.persentase}, 100`" stroke="currentColor" fill="none" stroke-linecap="round"
                 d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
             </svg>
             <div class="absolute inset-0 flex items-center justify-center flex-col">
                <span class="text-3xl font-bold text-slate-800">{{ rekap.persentase }}%</span>
             </div>
          </div>
          <h3 class="text-slate-500 font-semibold uppercase tracking-wider text-sm">Persentase Kehadiran</h3>
       </div>

       <!-- Card Info & Sesi -->
       <div class="md:col-span-2 grid grid-cols-2 gap-4">
          <div class="bg-slate-800 text-white p-6 rounded-sm shadow-sm flex flex-col justify-center">
             <div class="text-slate-400 text-xs font-semibold mb-1 uppercase tracking-wider">Hadir Perkuliahan</div>
             <div class="text-4xl font-bold mb-1">{{ rekap.hadir }} <span class="text-lg font-normal text-slate-300">Kali</span></div>
             <div class="text-xs text-slate-400 mt-auto">Dari total {{ rekap.total }} sesi tercatat.</div>
          </div>
          <div class="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col justify-center">
             <div class="text-slate-500 text-xs font-semibold mb-1 uppercase tracking-wider">Total Tdk Hadir</div>
             <div class="text-4xl font-bold text-slate-800 mb-1">{{ rekap.total - rekap.hadir }} <span class="text-lg font-normal text-slate-400">Kali</span></div>
             <div class="text-xs text-slate-500 mt-auto">Akumulasi Izin, Sakit, & Alpa.</div>
          </div>
       </div>
    </div>

    <!-- History Tabel -->
    <div class="bg-white shadow-sm border border-slate-200 mt-8">
      <div class="px-6 py-4 border-b border-slate-200 bg-slate-50">
         <h3 class="font-semibold text-slate-800">Riwayat Presensi per Pertemuan (Struktur Data)</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-700">
          <thead class="bg-white text-slate-600 font-semibold border-b border-slate-200 uppercase text-xs tracking-wider">
            <tr>
              <th class="px-6 py-3 w-20 text-center border-r border-slate-200">Ke-</th>
              <th class="px-6 py-3 border-r border-slate-200">Tanggal Pertemuan</th>
              <th class="px-6 py-3 border-r border-slate-200">Mata Kuliah</th>
              <th class="px-6 py-3 text-center">Status Absensi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <template v-if="rekap.history.length > 0">
               <tr v-for="sesi in rekap.history" :key="sesi.pertemuan" class="hover:bg-slate-50 transition">
                 <td class="px-6 py-3 text-center border-r border-slate-200 font-bold bg-slate-50">{{ sesi.pertemuan }}</td>
                 <td class="px-6 py-3 font-medium text-slate-800 border-r border-slate-200">{{ formatDate(sesi.tanggal) }}</td>
                 <td class="px-6 py-3 text-slate-600 border-r border-slate-200">{{ sesi.matkul }}</td>
                 <td class="px-6 py-3 text-center">
                    <span 
                       class="px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider"
                       :class="{
                          'bg-emerald-100 text-emerald-800': sesi.status === 'Hadir',
                          'bg-amber-100 text-amber-800': sesi.status === 'Izin' || sesi.status === 'Sakit',
                          'bg-red-100 text-red-800': sesi.status === 'Alpa' || sesi.status === 'Belum Input'
                       }"
                    >
                       {{ sesi.status }}
                    </span>
                 </td>
               </tr>
            </template>
            <tr v-else>
               <td colspan="4" class="px-6 py-8 text-center text-slate-500 italic">Belum ada data presensi yang di-input dosen.</td>
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
import { usePresensiStore } from '@/stores/presensi'

const authStore = useAuthStore()
const presensiStore = usePresensiStore()

// Mock NIM for the current user (if real, get from authStore.user.nim)
const defaultNim = authStore.user?.nim || '20260001'

const rekap = computed(() => presensiStore.getRekapMahasiswa(defaultNim))

const formatDate = (dateStr) => {
   const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
   return new Date(dateStr).toLocaleDateString('id-ID', options)
}
</script>
