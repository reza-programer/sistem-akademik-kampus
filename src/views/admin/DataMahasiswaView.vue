<template>
  <div class="space-y-6 relative">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold theme-text">Data Mahasiswa</h1>
        <p class="theme-text opacity-60 text-sm mt-1">Kelola data induk dan status mahasiswa</p>
      </div>
      <button @click="openModal('add')" class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 flex items-center justify-center rounded-xl shadow-sm transition">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
        Tambah Mahasiswa
      </button>
    </div>

    <!-- Area Tabel -->
    <div class="theme-card rounded-2xl shadow-sm border overflow-hidden">
      <div class="p-4 border-b theme-border flex flex-wrap gap-4 justify-between items-center theme-bg">
        <input v-model="searchQuery" type="text" placeholder="Cari NIM atau Nama..." class="px-4 py-2 theme-card border rounded-xl text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary-200 theme-text">
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm theme-text">
          <thead class="theme-bg opacity-80 font-medium">
            <tr>
              <th class="px-6 py-4">NIM</th>
              <th class="px-6 py-4">Nama Mahasiswa</th>
              <th class="px-6 py-4">Jurusan</th>
              <th class="px-6 py-4">Angkatan</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y theme-border">
            <template v-if="filteredMahasiswa.length > 0">
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800 transition" v-for="mhs in filteredMahasiswa" :key="mhs.id">
                <td class="px-6 py-4 font-medium">{{ mhs.nim }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center">
                     <div class="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold mr-3 text-xs flex-shrink-0">
                       {{ mhs.nama.charAt(0) }}
                     </div>
                     <span class="truncate">{{ mhs.nama }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">{{ mhs.jurusan }}</td>
                <td class="px-6 py-4">{{ mhs.angkatan }}</td>
                <td class="px-6 py-4">
                  <span class="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold">Aktif</span>
                </td>
                <td class="px-6 py-4 text-center">
                  <button @click="openModal('edit', mhs)" class="p-1.5 text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-2 transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                  <button @click="konfirmasiHapus(mhs.id)" class="p-1.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 rounded-lg transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </td>
              </tr>
            </template>
            <tr v-else>
               <td colspan="6" class="px-6 py-8 text-center opacity-60">Tidak ada data mahasiswa ditemukan.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-4 border-t theme-border text-sm opacity-70 flex justify-between items-center">
        <span>Menampilkan {{ filteredMahasiswa.length }} data</span>
      </div>
    </div>

    <!-- Modal Form (Tambah / Edit) -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div class="theme-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden border theme-border">
        <div class="px-6 py-4 border-b theme-border flex justify-between items-center theme-bg">
          <h3 class="font-bold text-lg theme-text">{{ modalMode === 'add' ? 'Tambah Mahasiswa' : 'Edit Mahasiswa' }}</h3>
          <button @click="closeModal" class="opacity-60 hover:opacity-100 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <form @submit.prevent="saveData" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium theme-text opacity-80 mb-1">NIM</label>
            <input v-model="formData.nim" type="text" required class="w-full px-4 py-2 theme-bg border theme-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-400 theme-text">
          </div>
          <div>
            <label class="block text-sm font-medium theme-text opacity-80 mb-1">Nama Lengkap</label>
            <input v-model="formData.nama" type="text" required class="w-full px-4 py-2 theme-bg border theme-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-400 theme-text">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium theme-text opacity-80 mb-1">Jurusan</label>
               <select v-model="formData.jurusan" required class="w-full px-4 py-2 theme-bg border theme-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-400 theme-text">
                  <option value="Teknik Informatika">Teknik Informatika</option>
                  <option value="Sistem Informasi">Sistem Informasi</option>
                  <option value="Bisnis Digital">Bisnis Digital</option>
               </select>
            </div>
            <div>
              <label class="block text-sm font-medium theme-text opacity-80 mb-1">Angkatan</label>
               <select v-model="formData.angkatan" required class="w-full px-4 py-2 theme-bg border theme-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-400 theme-text">
                  <option value="2026">2026</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
               </select>
            </div>
          </div>
          
          <div class="pt-4 flex gap-3">
             <button type="button" @click="closeModal" class="flex-1 px-4 py-2 border theme-border rounded-xl font-medium opacity-80 hover:bg-slate-50 dark:hover:bg-slate-800 transition">Batal</button>
             <button type="submit" class="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition shadow-sm">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Swal from 'sweetalert2'

// Dummy State (Sebagai pengganti Database/API)
const mahasiswaList = ref([
  { id: 1, nim: '20260001', nama: 'Andi Wijaya', jurusan: 'Teknik Informatika', angkatan: '2026' },
  { id: 2, nim: '20260002', nama: 'Budi Santoso', jurusan: 'Sistem Informasi', angkatan: '2026' },
  { id: 3, nim: '20240003', nama: 'Citra Kirana', jurusan: 'Bisnis Digital', angkatan: '2024' },
  { id: 4, nim: '20250004', nama: 'Dewi Lestari', jurusan: 'Teknik Informatika', angkatan: '2025' },
  { id: 5, nim: '20260005', nama: 'Eko Prasetyo', jurusan: 'Sistem Informasi', angkatan: '2026' },
])

const searchQuery = ref('')
const isModalOpen = ref(false)
const modalMode = ref('add') // 'add' atau 'edit'

const initialForm = { id: null, nim: '', nama: '', jurusan: 'Teknik Informatika', angkatan: '2025' }
const formData = ref({ ...initialForm })

// Computed Filter
const filteredMahasiswa = computed(() => {
  if (!searchQuery.value) return mahasiswaList.value
  return mahasiswaList.value.filter(mhs => 
    mhs.nama.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
    mhs.nim.includes(searchQuery.value)
  )
})

// Buka Modal
const openModal = (mode, data = null) => {
  modalMode.value = mode
  if (mode === 'edit' && data) {
    formData.value = { ...data }
  } else {
    formData.value = { ...initialForm }
  }
  isModalOpen.value = true
}

// Tutup Modal
const closeModal = () => {
  isModalOpen.value = false
  formData.value = { ...initialForm }
}

// Simpan Data
const saveData = () => {
  if (modalMode.value === 'add') {
    // Generate simple ID
    const newId = mahasiswaList.value.length > 0 ? Math.max(...mahasiswaList.value.map(m => m.id)) + 1 : 1
    mahasiswaList.value.unshift({ ...formData.value, id: newId })
  } else {
    // Edit
    const index = mahasiswaList.value.findIndex(m => m.id === formData.value.id)
    if (index !== -1) {
      mahasiswaList.value[index] = { ...formData.value }
    }
  }
  closeModal()
}

// Hapus Data
const konfirmasiHapus = (id) => {
  Swal.fire({
      title: 'Hapus Mahasiswa?',
      text: "Apakah Anda yakin ingin menghapus data mahasiswa ini?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
  }).then((result) => {
      if (result.isConfirmed) {
          mahasiswaList.value = mahasiswaList.value.filter(m => m.id !== id)
          Swal.fire({
              title: 'Terhapus!',
              text: 'Data mahasiswa berhasil dihapus.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
          })
      }
  })
}
</script>
