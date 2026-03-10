<template>
  <div class="space-y-6 max-w-7xl mx-auto" id="print-khs">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3">
      <div>
        <h1 class="text-2xl font-normal text-slate-800 tracking-wide">Kartu Hasil Studi (KHS)</h1>
      </div>
      <select class="mt-3 sm:mt-0 px-3 py-1.5 border border-slate-300 rounded text-sm outline-none focus:ring-1 focus:ring-slate-400 bg-white shadow-sm text-slate-700">
        <option>Semester Ganjil 2025/2026</option>
        <option>Semester Genap 2024/2025</option>
      </select>
    </div>

    <!-- Ringkasan Nilai Semester -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-4 border border-slate-200 shadow-sm flex flex-col justify-center">
        <div class="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">IPS Semester Ini</div>
        <div class="text-2xl font-bold text-slate-800">{{ isApproved ? hitungIps() : '0.00' }}</div>
      </div>
      <div class="bg-white p-4 border border-slate-200 shadow-sm flex flex-col justify-center">
        <div class="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">IPK Kumulatif</div>
        <div class="text-2xl font-bold text-slate-800">{{ isApproved ? hitungIps() : '0.00' }}</div>
      </div>
      <div class="bg-white p-4 border border-slate-200 shadow-sm flex flex-col justify-center">
        <div class="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">SKS Semester Ini</div>
        <div class="text-2xl font-bold text-slate-800">{{ isApproved ? krsStore.totalSks : '0' }}</div>
      </div>
      <div class="bg-white p-4 border border-slate-200 shadow-sm flex flex-col justify-center">
        <div class="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">Total SKS</div>
        <div class="text-2xl font-bold text-slate-800">{{ 62 + (isApproved ? krsStore.totalSks : 0) }}</div>
      </div>
    </div>

    <!-- Tabel Nilai KHS -->
    <div class="bg-white shadow-sm border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-700">
          <thead class="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase text-xs tracking-wider">
            <tr>
              <th class="px-6 py-3 w-16 text-center border-r border-slate-200">No</th>
              <th class="px-6 py-3 border-r border-slate-200">Mata Kuliah</th>
              <th class="px-6 py-3 text-center border-r border-slate-200">SKS</th>
              <th class="px-6 py-3 text-center border-r border-slate-200">Nilai Angka</th>
              <th class="px-6 py-3 text-center border-r border-slate-200">Grade</th>
              <th class="px-6 py-3 text-center">Bobot</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200" v-if="isApproved && approvedMatkul.length > 0">
            <tr v-for="(mk, index) in approvedMatkul" :key="mk.kode" class="hover:bg-slate-50 transition">
              <td class="px-6 py-3 text-center border-r border-slate-200">{{ index + 1 }}</td>
              <td class="px-6 py-3 font-medium text-slate-800 border-r border-slate-200 uppercase">{{ mk.nama }}</td>
              <td class="px-6 py-3 text-center border-r border-slate-200">{{ mk.sks }}</td>
              <td class="px-6 py-3 text-center border-r border-slate-200">{{ mk.nilaiAkhir !== undefined ? mk.nilaiAkhir : '-' }}</td>
              <td class="px-6 py-3 text-center font-bold text-slate-800 border-r border-slate-200">{{ mk.grade || '-' }}</td>
              <td class="px-6 py-3 text-center">{{ mk.bobot !== undefined ? (mk.sks * mk.bobot).toFixed(2) : '-' }}</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
               <td colspan="6" class="px-6 py-8 text-center text-slate-500 italic bg-slate-50">
                  <div class="flex flex-col items-center justify-center">
                     <svg class="w-12 h-12 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                     <p>Belum ada data Kartu Hasil Studi (KHS) untuk semester ini.</p>
                     <p class="text-xs mt-1">Selesaikan perwalian dan pastikan KRS Anda telah disetujui Dosen Wali terlebih dahulu.</p>
                  </div>
               </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-4 bg-slate-50 border-t border-slate-200 flex justify-end data-html2canvas-ignore">
        <button @click="downloadPDF" class="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium px-4 py-2 rounded text-sm transition flex items-center shadow-sm">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
          <span v-if="!isDownloading">Cetak KHS (PDF)</span>
          <span v-else>Memproses PDF...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import html2pdf from 'html2pdf.js'
import { useKrsStore } from '@/stores/krs'

const krsStore = useKrsStore()

const isApproved = computed(() => krsStore.isApproved)
const approvedMatkul = computed(() => {
   if (krsStore.isApproved) return krsStore.selectedMatkul
   return []
})

const isDownloading = ref(false)

const hitungIps = () => {
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

const downloadPDF = () => {
  isDownloading.value = true
  const element = document.getElementById('print-khs')
  
  const opt = {
    margin:       [15, 15, 15, 15],
    filename:     'KHS_Semester_Ganjil.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }

  // Generate PDF
  html2pdf().set(opt).from(element).save().then(() => {
    isDownloading.value = false
  })
}
</script>
