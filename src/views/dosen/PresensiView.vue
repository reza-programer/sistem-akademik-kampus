<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="border-b border-slate-200 pb-3 mb-6">
      <h1 class="text-2xl font-normal text-slate-800 tracking-wide">Input Presensi Mahasiswa</h1>
    </div>

    <!-- Filter/Settings Kelas -->
    <div class="bg-white border border-slate-200 shadow-sm p-6 rounded-sm flex flex-col md:flex-row gap-4 items-end mb-6">
      <div class="w-full md:w-1/3">
         <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Pilih Mata Kuliah & Kelas</label>
         <select v-model="form.matkul" class="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
            <option value="Struktur Data">Struktur Data - SINFC-2026-01</option>
            <option value="Pemrograman Web Lanjut">Pemrograman Web Lanjut - SINFC-2026-01</option>
         </select>
      </div>
      <div class="w-full md:w-1/4">
         <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Pertemuan Ke-</label>
         <input type="number" min="1" max="16" v-model="form.pertemuan" class="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
      </div>
      <div class="w-full md:w-1/3">
         <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Tanggal Perkuliahan</label>
         <input type="date" v-model="form.tanggal" class="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
      </div>
      <div class="w-full md:w-auto mt-4 md:mt-0">
         <button @click="loadDataSesi" class="w-full px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded shadow-sm text-sm font-medium transition">
           Buka Sesi
         </button>
      </div>
    </div>

    <!-- Tabel Daftar Hadir -->
    <div v-if="isSessionOpen" class="bg-white shadow-sm border border-slate-200 overflow-hidden">
      <div class="bg-slate-800 text-white p-4 flex justify-between items-center">
         <div>
            <h3 class="font-bold">Form Input Presensi: {{ form.matkul }}</h3>
            <p class="text-xs text-slate-300 mt-1 uppercase tracking-wider">Pertemuan {{ form.pertemuan }} | {{ formatDate(form.tanggal) }}</p>
         </div>
         <div class="bg-white/20 px-3 py-1 rounded text-sm font-semibold">
           Total Hadir: {{ totalHadir }} / {{ presensiStore.students.length }}
         </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-700">
          <thead class="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase text-xs tracking-wider">
            <tr>
              <th class="px-6 py-3 w-16 text-center border-r border-slate-200">No</th>
              <th class="px-6 py-3 w-32 border-r border-slate-200">NIM</th>
              <th class="px-6 py-3 border-r border-slate-200 w-1/3">Nama Mahasiswa</th>
              <th class="px-6 py-3 text-center border-r border-slate-200">Hadir</th>
              <th class="px-6 py-3 text-center border-r border-slate-200">Izin</th>
              <th class="px-6 py-3 text-center border-r border-slate-200">Sakit</th>
              <th class="px-6 py-3 text-center">Alpa</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="(student, index) in presensiStore.students" :key="student.nim" class="hover:bg-slate-50 transition" :class="{'bg-red-50/50': tempAbsensi[student.nim] === 'Alpa'}">
              <td class="px-6 py-3 text-center border-r border-slate-200 text-slate-500">{{ index + 1 }}</td>
              <td class="px-6 py-3 font-mono text-xs border-r border-slate-200 text-slate-600">{{ student.nim }}</td>
              <td class="px-6 py-3 font-semibold text-slate-800 border-r border-slate-200 uppercase">{{ student.nama }}</td>
              
              <!-- Radio Buttons for Status -->
              <td class="px-6 py-3 text-center border-r border-slate-200 bg-emerald-50/20 hover:bg-emerald-50 transition">
                 <input type="radio" :name="'absensi_'+student.nim" value="Hadir" v-model="tempAbsensi[student.nim]" class="w-5 h-5 text-emerald-600 bg-white border-slate-300 focus:ring-emerald-500 focus:ring-2 cursor-pointer">
              </td>
              <td class="px-6 py-3 text-center border-r border-slate-200 bg-amber-50/20 hover:bg-amber-50 transition">
                 <input type="radio" :name="'absensi_'+student.nim" value="Izin" v-model="tempAbsensi[student.nim]" class="w-5 h-5 text-amber-500 bg-white border-slate-300 focus:ring-amber-500 focus:ring-2 cursor-pointer">
              </td>
              <td class="px-6 py-3 text-center border-r border-slate-200 bg-amber-50/20 hover:bg-amber-50 transition">
                 <input type="radio" :name="'absensi_'+student.nim" value="Sakit" v-model="tempAbsensi[student.nim]" class="w-5 h-5 text-amber-500 bg-white border-slate-300 focus:ring-amber-500 focus:ring-2 cursor-pointer">
              </td>
              <td class="px-6 py-3 text-center bg-red-50/20 hover:bg-red-50 transition">
                 <input type="radio" :name="'absensi_'+student.nim" value="Alpa" v-model="tempAbsensi[student.nim]" class="w-5 h-5 text-red-600 bg-white border-slate-300 focus:ring-red-500 focus:ring-2 cursor-pointer">
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer Actions -->
      <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
         <p class="text-xs text-slate-500 italic block">Pastikan seluruh entri telah diperiksa sebelum disimpan.</p>
         <div class="space-x-4 flex">
            <button @click="markAllPresent" class="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded text-sm font-medium transition bg-white shadow-sm">
               Tandai Hadir Semua
            </button>
            <button @click="simpanPresensi" class="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded shadow text-sm font-bold transition flex items-center">
               <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
               Simpan Data Absensi
            </button>
         </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import Swal from 'sweetalert2'
import { usePresensiStore } from '@/stores/presensi'
import { useNotificationStore } from '@/stores/notification'

const presensiStore = usePresensiStore()
const notificationStore = useNotificationStore()

const isSessionOpen = ref(false)

const form = reactive({
   matkul: 'Struktur Data',
   pertemuan: 3,
   tanggal: new Date().toISOString().slice(0, 10) // Today's YYYY-MM-DD
})

// Temporary state untuk input form sebelum di-save ke store pinia
const tempAbsensi = ref({})

const loadDataSesi = () => {
   // Cek apakah pertemuan ini sudah pernah diisi sebelumnya
   const exist = presensiStore.records.find(r => r.matkul === form.matkul && r.pertemuan == form.pertemuan)
   
   tempAbsensi.value = {}

   if (exist && exist.data) {
       // Load existing data
       Object.keys(exist.data).forEach(nim => {
           tempAbsensi.value[nim] = exist.data[nim]
       })
   } else {
       // Defaults to empty for a fresh form
       presensiStore.students.forEach(s => {
           tempAbsensi.value[s.nim] = 'Alpa' // Pancing dengan status 'Alpa' untuk memancing dosen mengecek
       })
   }
   
   isSessionOpen.value = true
}

const markAllPresent = () => {
   presensiStore.students.forEach(s => {
       tempAbsensi.value[s.nim] = 'Hadir'
   })
}

const totalHadir = computed(() => {
   return Object.values(tempAbsensi.value).filter(val => val === 'Hadir').length
})

const formatDate = (dateStr) => {
   if (!dateStr) return '-'
   const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
   return new Date(dateStr).toLocaleDateString('id-ID', options)
}

const simpanPresensi = () => {
   // Save to Store
   // We clone tempAbsensi down to a plain object
   const dataToSave = { ...tempAbsensi.value }
   
   presensiStore.saveRecord(form.matkul, parseInt(form.pertemuan), form.tanggal, dataToSave)
   isSessionOpen.value = false
   
   // Trigger Notification to Mahasiswa Role just as Demo
   notificationStore.addNotification('mahasiswa', {
       title: 'Update Presensi',
       message: `Dosen Pengampu telah mengunggah Absensi Kelas ${form.matkul} Pertemuan ${form.pertemuan}. Cek laman rekapan kehadiran Anda.`,
       type: 'info'
   })
   
   Swal.fire({
       icon: 'success',
       title: 'Tersimpan!',
       text: `Data Absensi Pertemuan ${form.pertemuan} berhasil disimpan permanen ke dalam sistem state.`,
       confirmButtonColor: '#0ea5e9',
       timer: 2000
   })
}
</script>
