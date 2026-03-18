<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 mb-6">
      <div>
        <h1 class="text-2xl font-normal text-slate-800 tracking-wide">Dashboard Administrator</h1>
        <p class="text-sm text-slate-500 mt-1">Ringkasan Sistem Informasi Akademik</p>
      </div>
      <div class="mt-4 sm:mt-0">
         <span class="bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded uppercase tracking-widest shadow-sm">Super Admin Mode</span>
      </div>
    </div>

    <!-- Statistik Singkat Admin -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white border border-slate-200 shadow-sm p-0 flex flex-col">
        <div class="bg-blue-600 text-white p-4 flex items-center justify-between">
            <h3 class="font-bold uppercase tracking-widest text-sm text-white/90">Total Mahasiswa</h3>
            <svg class="w-6 h-6 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        </div>
        <div class="p-6 flex-1 flex flex-col justify-center items-center">
            <p class="text-5xl font-bold text-slate-800 mb-2">{{ authStore.mahasiswaDB.length }}</p>
            <p class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 flex items-center shadow-sm">
              <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              Total Terdaftar
            </p>
        </div>
      </div>

      <div class="bg-white border border-slate-200 shadow-sm p-0 flex flex-col">
        <div class="bg-indigo-600 text-white p-4 flex items-center justify-between">
            <h3 class="font-bold uppercase tracking-widest text-sm text-white/90">Total Dosen Aktif</h3>
            <svg class="w-6 h-6 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
        </div>
        <div class="p-6 flex-1 flex flex-col justify-center items-center">
            <p class="text-5xl font-bold text-slate-800 mb-2">86</p>
            <p class="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-200 shadow-sm">
              Semester Genap 2025/2026
            </p>
        </div>
      </div>

      <div class="bg-white border border-slate-200 shadow-sm p-0 flex flex-col">
        <div class="bg-emerald-600 text-white p-4 flex items-center justify-between">
            <h3 class="font-bold uppercase tracking-widest text-sm text-white/90">Mata Kuliah Aktif</h3>
            <svg class="w-6 h-6 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
        </div>
        <div class="p-6 flex-1 flex flex-col justify-center items-center">
            <p class="text-5xl font-bold text-slate-800 mb-2">124</p>
            <p class="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-300 shadow-sm">
              Tersebar di 9 Semester
            </p>
        </div>
      </div>

      <!-- Add PMB Status -->
      <div class="bg-white border border-slate-200 shadow-sm p-0 flex flex-col">
        <div class="bg-amber-500 text-white p-4 flex items-center justify-between">
            <h3 class="font-bold uppercase tracking-widest text-sm text-white/90">PMB Menunggu Validasi</h3>
            <svg class="w-6 h-6 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
        </div>
        <div class="p-6 flex-1 flex flex-col justify-center items-center">
            <p class="text-5xl font-bold text-amber-600 mb-2">{{ authStore.calonMahasiswa.length }}</p>
            <router-link to="/admin/pmb" class="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded border border-amber-200 shadow-sm hover:bg-amber-100 transition whitespace-nowrap">
              Verifikasi Sekarang &rarr;
            </router-link>
        </div>
      </div>
    </div>

    <!-- System Log (Khusus Admin) -->
    <div class="bg-white border border-slate-200 shadow-sm mt-8">
      <div class="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h3 class="font-bold text-slate-800 uppercase tracking-widest text-sm">Aktivitas Sistem Terbaru</h3>
        <button class="text-xs text-primary-600 hover:text-primary-800 font-bold uppercase tracking-wider">Muat Ulang</button>
      </div>
      <div class="p-0">
         <div v-for="(camaba, i) in authStore.calonMahasiswa.slice(0, 3)" :key="'c-'+i" class="flex items-start px-6 py-4 border-b border-slate-100/50 hover:bg-slate-50 transition">
            <div class="w-2 h-2 rounded-full bg-amber-500 mt-2 mr-4"></div>
            <div>
               <p class="text-sm text-slate-800 font-medium">Calon Mahasiswa <span class="font-bold">{{ camaba.nama }}</span> telah mendaftar PMB.</p>
               <p class="text-xs text-slate-400 mt-1">Baru Saja</p>
            </div>
         </div>
         <div class="flex items-start px-6 py-4 border-b border-slate-100/50 hover:bg-slate-50 transition">
            <div class="w-2 h-2 rounded-full bg-emerald-500 mt-2 mr-4"></div>
            <div>
               <p class="text-sm text-slate-800 font-medium">Sistem Server tersinkronisasi dengan Database lokal.</p>
               <p class="text-xs text-slate-400 mt-1">10 Menit lalu</p>
            </div>
         </div>
         <div class="flex items-start px-6 py-4 border-b border-slate-100/50 hover:bg-slate-50 transition">
            <div class="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-4"></div>
            <div>
               <p class="text-sm text-slate-800 font-medium">Dosen <span class="font-bold">Wahyu Setiawan</span> telah menyetujui KRS Mahasiswa <span class="font-bold">20260001</span>.</p>
               <p class="text-xs text-slate-400 mt-1">45 Menit lalu</p>
            </div>
         </div>
         <div class="flex items-start px-6 py-4 border-b border-slate-100/50 hover:bg-slate-50 transition">
            <div class="w-2 h-2 rounded-full bg-amber-500 mt-2 mr-4"></div>
            <div>
               <p class="text-sm text-slate-800 font-medium">Admin mengubah status mata kuliah <strong>Pemrograman Dasar</strong>.</p>
               <p class="text-xs text-slate-400 mt-1">2 Jam lalu</p>
            </div>
         </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
</script>
