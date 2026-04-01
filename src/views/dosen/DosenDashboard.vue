<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    
    <div class="border-b border-slate-200 pb-3 mb-6">
      <h1 class="text-2xl font-normal text-slate-800 tracking-wide">Dashboard Dosen</h1>
      <p class="text-sm text-slate-500 mt-1">Ringkasan aktivitas akademik dan perkuliahan Anda</p>
    </div>

    <!-- Alert / Notifikasi -->
    <div class="bg-amber-50 border border-amber-200 text-amber-700 rounded-sm p-4 text-sm font-medium shadow-sm flex items-start gap-3" v-if="pendingCount > 0">
       <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
       Ada <strong>{{ pendingCount }} Mahasiswa Bimbingan</strong> yang sedang menunggu persetujuan KRS. Silakan periksa di <router-link to="/dosen/perwalian" class="underline hover:text-amber-800">Menu Perwalian</router-link>.
    </div>

    <!-- Profil Dosen & Summary -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-slate-200 rounded-sm overflow-hidden bg-white shadow-sm">
      
      <!-- Profil Info -->
      <div class="lg:col-span-2 p-6 flex flex-col md:flex-row gap-6 border-b lg:border-b-0 lg:border-r border-slate-200">
         <div class="flex-shrink-0 flex items-start justify-center">
             <div class="w-32 h-32 bg-slate-100 rounded text-slate-400 p-2 overflow-hidden flex items-end justify-center border border-slate-200">
                 <!-- Dummy Foto -->
                <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>
             </div>
         </div>
         <div class="flex-1 space-y-2">
            <div class="grid grid-cols-[140px_10px_1fr] text-sm md:text-base mb-4 lg:mb-2 border-b border-slate-100 pb-2">
                <div class="font-bold text-slate-700 tracking-widest text-sm relative top-0.5">NIDN / Username</div>
                <div class="font-bold text-sm text-slate-700">:</div>
                <div class="font-bold text-lg md:text-xl text-slate-800 tracking-tight">{{ dosenProfile?.nidn || authStore.user?.username || '0411122201' }}</div>
            </div>
            
            <div class="grid grid-cols-[140px_10px_1fr] text-sm">
                <div class="text-slate-600">Nama Lengkap</div>
                <div>:</div>
                <div class="font-bold text-slate-800 uppercase">{{ dosenProfile?.nama || authStore.user?.name || 'Budi Santoso, M.Kom' }}</div>
            </div>
            <div class="grid grid-cols-[140px_10px_1fr] text-sm">
                <div class="text-slate-600">Keahlian Utama</div>
                <div>:</div>
                <div class="font-medium text-slate-800">{{ dosenProfile?.keahlian || '-' }}</div>
            </div>
            <div class="grid grid-cols-[140px_10px_1fr] text-sm mt-3 pt-3 border-t border-slate-100">
                <div class="text-slate-600">Beban Mengajar</div>
                <div>:</div>
                <div class="font-bold text-slate-800">
                   <span v-if="totalSksMengajar > 0" class="text-emerald-600 bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded text-xs mr-2">Cukup</span>
                   <span v-else class="text-amber-600 bg-amber-50 px-2 py-0.5 border border-amber-200 rounded text-xs mr-2">Kosong</span>
                   {{ totalSksMengajar }} SKS (Semester Ganjil)
                </div>
            </div>
         </div>
      </div>

      <!-- Quick Metrics -->
      <div class="bg-[#0f766e] text-white p-6 relative overflow-hidden flex flex-col justify-center">
         <div class="absolute right-4 top-4 opacity-10">
            <svg fill="currentColor" class="w-24 h-24" viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72l5 2.73 5-2.73v3.72z"></path></svg>
         </div>
         <div class="relative z-10 flex flex-col h-full justify-center">
            <h2 class="text-xs font-bold uppercase tracking-wider mb-4 opacity-80 border-b border-white/20 pb-2">Status Pembimbingan</h2>
            <div class="text-4xl font-bold mb-1">15 <span class="text-sm font-normal">Mahasiswa</span></div>
            <div class="text-sm border border-white/20 bg-white/10 px-3 py-1.5 inline-block rounded max-w-fit mt-2" :class="pendingCount > 0 ? 'bg-amber-500 border-amber-400 text-white' : ''">
               <strong>{{ pendingCount }}</strong> Menunggu Approval KRS
            </div>
         </div>
      </div>

    </div>

    <!-- Jadwal Mengajar & Aktivitas -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <!-- Jadwal Hari Ini -->
      <div class="bg-white border border-slate-200 shadow-sm rounded-sm">
         <div class="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 class="font-bold text-slate-800 uppercase tracking-widest text-sm">Jadwal Mengajar Anda</h3>
            <span class="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded">{{ jadwalMengajar.length }} Sesi</span>
         </div>
         <div class="p-4 space-y-4">
            <div v-if="jadwalMengajar.length === 0" class="text-center py-6">
                <p class="text-sm text-slate-500 italic">Anda belum memiliki jadwal mengajar pada semester ini.</p>
            </div>
            <div v-for="j in jadwalMengajar" :key="j.idJadwal" class="border border-slate-200 p-3 rounded hover:border-slate-400 transition bg-white shadow-sm flex items-start">
               <div class="w-14 flex-shrink-0 text-amber-700 font-bold bg-amber-50 border border-amber-200 py-1.5 px-1 text-center text-xs space-y-1 rounded-sm">
                 <div class="uppercase">{{ j.hari }}</div>
                 <div class="font-mono">{{ j.jamMulai }}</div>
               </div>
               <div class="ml-3 flex-1">
                  <h4 class="font-bold text-slate-800 text-sm uppercase">{{ j.namaMatkul }}</h4>
                  <div class="text-xs text-slate-500 mt-1 uppercase flex items-center justify-between">
                     <span>{{ j.ruangan }}</span>
                     <span class="font-bold text-primary-600 bg-primary-50 px-2 rounded">{{ j.namaKelas }}</span>
                  </div>
               </div>
            </div>
            
            <router-link to="/dosen/jadwal" class="block w-full py-2.5 text-center text-sm font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded transition mt-2 uppercase tracking-wide">
               Buka Kalender Akademik
            </router-link>
         </div>
      </div>

      <!-- Notifikasi / Task -->
      <div class="bg-white border border-slate-200 shadow-sm rounded-sm">
         <div class="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h3 class="font-bold text-slate-800 uppercase tracking-widest text-sm text-center">Tugas & Pengumuman</h3>
         </div>
         <div class="p-0">
            <router-link to="/dosen/perwalian" class="flex items-start p-4 border-b border-slate-100 hover:bg-slate-50 transition cursor-pointer" v-if="pendingCount > 0">
               <div class="bg-amber-100 text-amber-600 p-2 rounded flex-shrink-0 mt-0.5">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
               </div>
               <div class="ml-3">
                  <h4 class="font-bold text-sm text-slate-800">Menunggu Approval KRS Bimbingan</h4>
                  <p class="text-xs text-slate-500 mt-1">{{ pendingCount }} Mahasiswa telah mengajukan KRS untuk semester genap ini. Harap segera dilakukan verifikasi sebelum batas akhir 20 Maret 2026.</p>
               </div>
            </router-link>
            
            <div class="flex items-start p-4 border-b border-slate-100 hover:bg-slate-50 transition cursor-pointer">
               <div class="bg-primary-100 text-primary-600 p-2 rounded flex-shrink-0 mt-0.5">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
               </div>
               <div class="ml-3">
                  <h4 class="font-bold text-sm text-slate-800">Batas Akhir Kelengkapan Nilai UTS</h4>
                  <p class="text-xs text-slate-500 mt-1">Sistem Input Nilai akan ditutup pada 15 April 2026. Mohon segera melengkapi nilai UTS untuk kelas yang belum selesai.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useMasterDataStore } from '@/stores/masterData'
import { useKrsStore } from '@/stores/krs'

const authStore = useAuthStore()
const masterStore = useMasterDataStore()
const krsStore = useKrsStore()

// Hitung berapa maba yg nunggu approve KRS
const pendingCount = computed(() => {
   const data = krsStore.krsData || {}
   return Object.values(data).filter(d => d?.status === 'pending').length
})

// Dapatkan ID Dosen dari user yang sedang login. Jika ga login assume D01 Budi Santoso
const myDosenId = authStore.user?.id || 'D01'

const dosenProfile = computed(() => {
   return masterStore.dosenList.find(d => d.idDosen === myDosenId)
})

const jadwalMengajar = computed(() => {
   return masterStore.jadwalDosen(myDosenId) || []
})

const totalSksMengajar = computed(() => {
   // hitung beban mengajar
   return jadwalMengajar.value.reduce((total, j) => total + j.sks, 0)
})
</script>
