<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Jadwal Mengajar</h1>
        <p class="text-slate-500 text-sm mt-1">Daftar kelas yang Anda ampu semester ini</p>
      </div>
      <div class="bg-white px-4 py-2 rounded-xl text-sm border border-slate-200 font-medium">
        Semester Genap 2025/2026
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Card Jadwal Kelas -->
      <div v-for="i in 3" :key="i" class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
        <div class="flex justify-between items-start mb-4">
          <div class="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          </div>
          <span class="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">Senin, 08:00</span>
        </div>
        
        <h3 class="text-lg font-bold text-slate-800">Pemrograman Web {{ i }}</h3>
        <p class="text-sm text-slate-500 mt-1">IF30{{i}} • 3 SKS</p>
        
        <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
          <div class="text-slate-600 flex items-center">
            <svg class="w-4 h-4 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            Ruang Lab Komputer {{i}}
          </div>
          <div class="font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-lg">40 Mahasiswa</div>
        </div>

        <div class="mt-4 w-full">
           <button class="w-full text-center py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium rounded-xl transition text-sm border border-slate-200">Lihat Daftar Mahasiswa</button>
        </div>
      </div>
    </div>
  </div>
</template>
