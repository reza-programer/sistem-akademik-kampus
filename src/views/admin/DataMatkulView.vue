<template>
  <div class="space-y-6 relative">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold theme-text">Kelola Mata Kuliah</h1>
        <p class="theme-text opacity-60 text-sm mt-1">Daftar silabus mata kuliah, SKS, dan pengampu</p>
      </div>
      <button @click="openModal('add')" class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 flex items-center justify-center rounded-xl shadow-sm transition">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
        Tambah Matkul
      </button>
    </div>

    <!-- Area Tabel -->
    <div class="theme-card rounded-2xl shadow-sm border overflow-hidden flex flex-col min-h-[400px]">
      <div class="p-4 border-b theme-border flex flex-wrap gap-4 justify-between items-center theme-bg">
        <input v-model="searchQuery" type="text" placeholder="Cari Kode atau Nama Matkul..." class="px-4 py-2 theme-card border rounded-xl text-sm w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-primary-200 theme-text">
        <select v-model="semesterFilter" class="px-4 py-2 theme-card border rounded-xl text-sm outline-none w-full md:w-auto theme-text">
          <option value="">Semua Semester</option>
          <option value="1">Semester 1</option>
          <option value="2">Semester 2</option>
          <option value="3">Semester 3</option>
          <option value="4">Semester 4</option>
        </select>
      </div>
      
      <div class="overflow-x-auto flex-1">
        <table class="w-full text-left text-sm theme-text">
          <thead class="theme-bg opacity-80 font-medium">
            <tr>
              <th class="px-6 py-4">Kode</th>
              <th class="px-6 py-4">Nama Mata Kuliah</th>
              <th class="px-6 py-4 text-center">SKS</th>
              <th class="px-6 py-4 text-center">Semester</th>
              <th class="px-6 py-4">Dosen Pengampu</th>
              <th class="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y theme-border">
            <template v-if="filteredMatkul.length > 0">
               <tr class="hover:bg-slate-50 dark:hover:bg-slate-800 transition" v-for="mk in filteredMatkul" :key="mk.id">
                <td class="px-6 py-4 font-medium">{{ mk.kode }}</td>
                <td class="px-6 py-4 font-bold">{{ mk.nama }}</td>
                <td class="px-6 py-4 text-center">
                   <span class="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded font-semibold">{{ mk.sks }}</span>
                </td>
                <td class="px-6 py-4 text-center">{{ mk.semester }}</td>
                <td class="px-6 py-4 opacity-80">{{ mk.dosen }}</td>
                <td class="px-6 py-4 text-center">
                  <button @click="openModal('edit', mk)" class="p-1.5 text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-2 transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                  <button @click="confirmDelete(mk.id)" class="p-1.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 rounded-lg transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </td>
              </tr>
            </template>
            <tr v-else>
               <td colspan="6" class="px-6 py-12 text-center opacity-50">Data mata kuliah tidak ditemukan</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-4 border-t theme-border text-sm opacity-70 flex justify-between items-center bg-transparent mt-auto">
        <span>Total: {{ filteredMatkul.length }} Mata Kuliah</span>
      </div>
    </div>

    <!-- Modal Form (Tambah / Edit) -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div class="theme-card w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border theme-border">
        <div class="px-6 py-4 border-b theme-border flex justify-between items-center theme-bg">
          <h3 class="font-bold text-lg theme-text">{{ modalMode === 'add' ? 'Tambah Mata Kuliah' : 'Edit Mata Kuliah' }}</h3>
          <button @click="closeModal" class="opacity-60 hover:opacity-100 transition focus:outline-none">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <form @submit.prevent="saveData" class="p-6 space-y-4">
          <div class="grid grid-cols-3 gap-4">
            <div class="col-span-1">
              <label class="block text-sm font-medium theme-text opacity-80 mb-1">Kode MK</label>
              <input v-model="formData.kode" type="text" required placeholder="Contoh: IF101" class="w-full px-4 py-2 theme-bg border theme-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-400 theme-text uppercase">
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium theme-text opacity-80 mb-1">Nama Mata Kuliah</label>
              <input v-model="formData.nama" type="text" required class="w-full px-4 py-2 theme-bg border theme-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-400 theme-text">
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium theme-text opacity-80 mb-1">Total SKS</label>
              <input v-model.number="formData.sks" type="number" min="1" max="6" required class="w-full px-4 py-2 theme-bg border theme-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-400 theme-text">
            </div>
            <div>
              <label class="block text-sm font-medium theme-text opacity-80 mb-1">Semester</label>
               <select v-model="formData.semester" required class="w-full px-4 py-2 theme-bg border theme-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-400 theme-text">
                  <option value="1">Semester 1 (Ganjil)</option>
                  <option value="2">Semester 2 (Genap)</option>
                  <option value="3">Semester 3 (Ganjil)</option>
                  <option value="4">Semester 4 (Genap)</option>
               </select>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium theme-text opacity-80 mb-1">Dosen Pengampu Utama</label>
            <select v-model="formData.dosen" required class="w-full px-4 py-2 theme-bg border theme-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-400 theme-text">
               <option value="Budi Santoso, M.Kom">Budi Santoso, M.Kom</option>
               <option value="Dr. Indah Permatasari, S.T., M.T.">Dr. Indah Permatasari, S.T., M.T.</option>
               <option value="Arif Maulana, S.Kom., M.T.I.">Arif Maulana, S.Kom., M.T.I.</option>
               <option value="-">- (Belum Ditentukan)</option>
            </select>
          </div>
          
          <div class="pt-4 flex gap-3">
             <button type="button" @click="closeModal" class="flex-1 px-4 py-2 border theme-border rounded-xl font-medium opacity-80 hover:bg-slate-50 dark:hover:bg-slate-800 transition">Batal</button>
             <button type="submit" class="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition shadow-sm">Simpan Data</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Swal from 'sweetalert2'

const matkulList = ref([
  { id: 1, kode: 'IF101', nama: 'Pemrograman Dasar', sks: 3, semester: '1', dosen: 'Budi Santoso, M.Kom' },
  { id: 2, kode: 'IF102', nama: 'Struktur Data', sks: 3, semester: '2', dosen: 'Dr. Indah Permatasari, S.T., M.T.' },
  { id: 3, kode: 'IF201', nama: 'Basis Data', sks: 3, semester: '3', dosen: 'Arif Maulana, S.Kom., M.T.I.' },
  { id: 4, kode: 'IF202', nama: 'Pemrograman Web Lanjut', sks: 3, semester: '4', dosen: 'Budi Santoso, M.Kom' },
  { id: 5, kode: 'KU101', nama: 'Pendidikan Agama Islam', sks: 2, semester: '1', dosen: '-' },
])

const searchQuery = ref('')
const semesterFilter = ref('')

const isModalOpen = ref(false)
const modalMode = ref('add')

const initialForm = { id: null, kode: '', nama: '', sks: 3, semester: '1', dosen: 'Budi Santoso, M.Kom' }
const formData = ref({ ...initialForm })

const filteredMatkul = computed(() => {
  return matkulList.value.filter(mk => {
    const matchSearch = mk.nama.toLowerCase().includes(searchQuery.value.toLowerCase()) || mk.kode.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchSemester = semesterFilter.value === '' || mk.semester === semesterFilter.value
    return matchSearch && matchSemester
  })
})

const openModal = (mode, data = null) => {
  modalMode.value = mode
  if (mode === 'edit' && data) {
    formData.value = { ...data }
  } else {
    formData.value = { ...initialForm }
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  formData.value = { ...initialForm }
}

const saveData = () => {
  // Format kode jadi uppercase
  formData.value.kode = formData.value.kode.toUpperCase()
  
  if (modalMode.value === 'add') {
    const newId = matkulList.value.length > 0 ? Math.max(...matkulList.value.map(mk => mk.id)) + 1 : 1
    matkulList.value.unshift({ ...formData.value, id: newId })
  } else {
    const index = matkulList.value.findIndex(mk => mk.id === formData.value.id)
    if (index !== -1) {
      matkulList.value[index] = { ...formData.value }
    }
  }
  closeModal()
}

const confirmDelete = (id) => {
  Swal.fire({
      title: 'Hapus Mata Kuliah?',
      text: "Yakin ingin menghapus mata kuliah ini secara permanen dari rencana kurikulum?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
  }).then((result) => {
      if (result.isConfirmed) {
          matkulList.value = matkulList.value.filter(mk => mk.id !== id)
          Swal.fire({
              title: 'Terhapus!',
              text: 'Data mata kuliah berhasil dihapus.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
          })
      }
  })
}
</script>
