<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <div class="flex items-center justify-between border-b border-slate-200 pb-3">
      <div>
        <h1 class="text-2xl font-normal tracking-wide text-slate-800">Jadwal Kuliah</h1>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <!-- Hari Jadwal -->
      <div class="bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div class="bg-[#29a8d1] p-3 border-b border-[#2496bb] font-bold text-white uppercase tracking-widest text-sm text-center">
          Senin
        </div>
        <div class="p-4 space-y-4 flex-1">
          <div class="flex items-start">
             <div class="w-14 flex-shrink-0 text-sm font-bold text-slate-700 border border-slate-200 bg-slate-50 py-1.5 px-1 text-center font-mono">08:00</div>
             <div class="flex-1 ml-3 p-3 bg-white border border-slate-200 hover:border-slate-400 transition shadow-sm">
                <div class="font-bold text-slate-800 text-sm uppercase">Pemrograman Web Lanjut</div>
                <div class="text-xs text-slate-500 mt-1 uppercase">Lab Komputer 1</div>
             </div>
          </div>
          <div class="flex items-start">
             <div class="w-14 flex-shrink-0 text-sm font-bold text-slate-700 border border-slate-200 bg-slate-50 py-1.5 px-1 text-center font-mono">10:30</div>
             <div class="flex-1 ml-3 p-3 bg-white border border-slate-200 hover:border-slate-400 transition shadow-sm">
                <div class="font-bold text-slate-800 text-sm uppercase">Struktur Data</div>
                <div class="text-xs text-slate-500 mt-1 uppercase">Ruang Teori 3</div>
             </div>
          </div>
        </div>
      </div>

      <div class="bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div class="bg-[#29a8d1] p-3 border-b border-[#2496bb] font-bold text-white uppercase tracking-widest text-sm text-center">
          Selasa
        </div>
        <div class="p-4 space-y-4 flex-1">
          <div class="flex items-start">
             <div class="w-14 flex-shrink-0 text-sm font-bold text-slate-700 border border-slate-200 bg-slate-50 py-1.5 px-1 text-center font-mono">13:00</div>
             <div class="flex-1 ml-3 p-3 bg-white border border-slate-200 hover:border-slate-400 transition shadow-sm">
                <div class="font-bold text-slate-800 text-sm uppercase">Kecerdasan Buatan</div>
                <div class="text-xs text-slate-500 mt-1 uppercase">Ruang Teori 2</div>
             </div>
          </div>
        </div>
      </div>

      <div class="bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col opacity-80">
        <div class="bg-slate-300 p-3 border-b border-slate-400 font-bold text-slate-700 uppercase tracking-widest text-sm text-center">
          Rabu
        </div>
        <div class="p-8 text-center text-slate-500 text-sm flex-1 flex items-center justify-center font-medium">
          TIDAK ADA JADWAL KULIAH
        </div>
      </div>

    </div>
  </div>
</template>
