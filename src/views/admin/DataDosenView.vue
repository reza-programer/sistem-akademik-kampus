<template>
  <div class="space-y-6 relative">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold theme-text">Data Dosen</h1>
        <p class="theme-text opacity-60 text-sm mt-1">Kelola data tenaga pengajar</p>
      </div>
      <button @click="openModal('add')" class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 flex items-center justify-center rounded-xl shadow-sm transition">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
        Tambah Dosen
      </button>
    </div>

    <!-- Area Tabel -->
    <div class="theme-card rounded-2xl shadow-sm border overflow-hidden flex flex-col min-h-[400px]">
      <div class="p-4 border-b theme-border flex flex-wrap gap-4 justify-between items-center theme-bg">
        <input v-model="searchQuery" type="text" placeholder="Cari NIDN atau Nama..." class="px-4 py-2 theme-card border rounded-xl text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary-200 theme-text">
        <select v-model="statusFilter" class="px-4 py-2 theme-card border rounded-xl text-sm outline-none w-full md:w-auto theme-text">
          <option value="">Semua Status</option>
          <option value="Aktif">Aktif</option>
          <option value="Cuti">Cuti</option>
          <option value="Tugas Belajar">Tugas Belajar</option>
        </select>
      </div>
      
      <div class="overflow-x-auto flex-1">
        <table class="w-full text-left text-sm theme-text">
          <thead class="theme-bg opacity-80 font-medium">
            <tr>
              <th class="px-6 py-4">NIDN</th>
              <th class="px-6 py-4">Nama Dosen</th>
              <th class="px-6 py-4">Email</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y theme-border">
            <template v-if="filteredDosen.length > 0">
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800 transition" v-for="dosen in filteredDosen" :key="dosen.id">
                <td class="px-6 py-4 font-medium">{{ dosen.nidn }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center">
                     <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold mr-3 text-xs flex-shrink-0">
                       D
                     </div>
                     <span class="truncate">{{ dosen.nama }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 opacity-80">{{ dosen.email }}</td>
                <td class="px-6 py-4">
                  <span v-if="dosen.status === 'Aktif'" class="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold">Aktif</span>
                  <span v-else-if="dosen.status === 'Cuti'" class="px-2.5 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-full text-xs font-semibold">Cuti</span>
                  <span v-else class="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs font-semibold">Tugas Belajar</span>
                </td>
                <td class="px-6 py-4 text-center">
                  <button @click="openModal('edit', dosen)" class="p-1.5 text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-2 transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                  <button @click="confirmDelete(dosen.id)" class="p-1.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 rounded-lg transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </td>
              </tr>
            </template>
            <tr v-else>
               <td colspan="5" class="px-6 py-12 text-center opacity-50">Data dosen tidak ditemukan</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-4 border-t theme-border text-sm opacity-70 flex justify-between items-center bg-transparent mt-auto">
        <span>Total: {{ filteredDosen.length }} Dosen</span>
      </div>
    </div>

    <!-- Modal Form (Tambah / Edit) -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div class="theme-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden border theme-border">
        <div class="px-6 py-4 border-b theme-border flex justify-between items-center theme-bg">
          <h3 class="font-bold text-lg theme-text">{{ modalMode === 'add' ? 'Tambah Dosen' : 'Edit Dosen' }}</h3>
          <button @click="closeModal" class="opacity-60 hover:opacity-100 transition focus:outline-none">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <form @submit.prevent="saveData" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium theme-text opacity-80 mb-1">NIDN</label>
            <input v-model="formData.nidn" type="text" required class="w-full px-4 py-2 theme-bg border theme-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-400 theme-text">
          </div>
          <div>
            <label class="block text-sm font-medium theme-text opacity-80 mb-1">Nama Lengkap beserta Gelar</label>
            <input v-model="formData.nama" type="text" required class="w-full px-4 py-2 theme-bg border theme-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-400 theme-text">
          </div>
          <div>
            <label class="block text-sm font-medium theme-text opacity-80 mb-1">Email Akademik</label>
            <input v-model="formData.email" type="email" required class="w-full px-4 py-2 theme-bg border theme-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-400 theme-text">
          </div>
          <div>
            <label class="block text-sm font-medium theme-text opacity-80 mb-1">Status Kepegawaian</label>
             <select v-model="formData.status" required class="w-full px-4 py-2 theme-bg border theme-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-400 theme-text">
                <option value="Aktif">Aktif Mengajar</option>
                <option value="Cuti">Cuti</option>
                <option value="Tugas Belajar">Tugas Belajar</option>
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

const dosenList = ref([
  { id: 1, nidn: '110022331', nama: 'Budi Santoso, M.Kom', email: 'budi.s@kampus.ac.id', status: 'Aktif' },
  { id: 2, nidn: '110022332', nama: 'Dr. Indah Permatasari, S.T., M.T.', email: 'indah.p@kampus.ac.id', status: 'Aktif' },
  { id: 3, nidn: '110022333', nama: 'Arif Maulana, S.Kom., M.T.I.', email: 'arif.m@kampus.ac.id', status: 'Cuti' },
  { id: 4, nidn: '110022334', nama: 'Siti Rahayu, S.Si., M.Sc.', email: 'siti.r@kampus.ac.id', status: 'Tugas Belajar' },
])

const searchQuery = ref('')
const statusFilter = ref('')

const isModalOpen = ref(false)
const modalMode = ref('add')

const initialForm = { id: null, nidn: '', nama: '', email: '', status: 'Aktif' }
const formData = ref({ ...initialForm })

const filteredDosen = computed(() => {
  return dosenList.value.filter(dosen => {
    const matchSearch = dosen.nama.toLowerCase().includes(searchQuery.value.toLowerCase()) || dosen.nidn.includes(searchQuery.value)
    const matchStatus = statusFilter.value === '' || dosen.status === statusFilter.value
    return matchSearch && matchStatus
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
  if (modalMode.value === 'add') {
    const newId = dosenList.value.length > 0 ? Math.max(...dosenList.value.map(d => d.id)) + 1 : 1
    dosenList.value.unshift({ ...formData.value, id: newId })
  } else {
    const index = dosenList.value.findIndex(d => d.id === formData.value.id)
    if (index !== -1) {
      dosenList.value[index] = { ...formData.value }
    }
  }
  closeModal()
}

const confirmDelete = (id) => {
  Swal.fire({
      title: 'Hapus Dosen?',
      text: "Yakin ingin menghapus dosen ini dari sistem?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
  }).then((result) => {
      if (result.isConfirmed) {
          dosenList.value = dosenList.value.filter(d => d.id !== id)
          Swal.fire({
              title: 'Terhapus!',
              text: 'Data dosen berhasil dihapus.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
          })
      }
  })
}
</script>
