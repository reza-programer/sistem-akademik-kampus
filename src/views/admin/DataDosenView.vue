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
                       {{ dosen.nama.charAt(0).toUpperCase() }}
                     </div>
                     <div>
                        <span class="truncate block font-bold">{{ dosen.nama }}</span>
                        <div class="mt-1 flex flex-wrap gap-1">
                           <span v-for="j in getJadwalDosen(dosen.idDosen)" :key="j.idJadwal" class="px-1.5 py-0.5 bg-slate-100 border text-[10px] rounded text-slate-600 truncate max-w-[150px]" :title="`${j.namaMatkul} (${j.sks} SKS) - ${j.namaKelas}`">
                              {{ j.namaMatkul }} ({{ j.sks }} SKS)
                           </span>
                        </div>
                     </div>
                  </div>
                </td>
                <td class="px-6 py-4 opacity-80 text-xs">{{ dosen.user?.email || '-' }}</td>
                <td class="px-6 py-4">
                  <span class="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold">Aktif</span>
                </td>
                <td class="px-6 py-4 text-center">
                  <button @click="openAssignModal(dosen)" class="p-1.5 text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mr-2 transition" title="Tugaskan Mata Kuliah">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                  </button>
                  <button @click="openModal('edit', dosen)" class="p-1.5 text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-2 transition" title="Edit Data">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                  <button @click="confirmDelete(dosen.nidn)" class="p-1.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 rounded-lg transition" title="Hapus Dosen">
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
    <!-- Modal Jadwal Mengajar -->
    <div v-if="isAssignModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div class="theme-card w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border theme-border">
        <div class="px-6 py-4 border-b theme-border flex justify-between items-center theme-bg">
          <h3 class="font-bold text-lg theme-text">Tugaskan Mata Kuliah</h3>
          <button @click="closeAssignModal" class="opacity-60 hover:opacity-100 transition focus:outline-none">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <form @submit.prevent="saveAssignment" class="p-6 space-y-4">
          <div class="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg flex items-center mb-2">
             <div class="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold mr-3 text-sm flex-shrink-0">
                {{ assignData.namaDosen ? assignData.namaDosen.charAt(0) : 'D' }}
             </div>
             <div>
                <p class="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase track-widest">Dosen Pengajar</p>
                <p class="font-bold text-sm">{{ assignData.namaDosen }}</p>
             </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium theme-text opacity-80 mb-1">Mata Kuliah (beserta SKS)</label>
             <select v-model="assignData.kodeMtk" required class="w-full px-4 py-2 theme-bg border theme-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-400 theme-text">
                <option value="" disabled>-- Pilih Mata Kuliah --</option>
                <option v-for="m in masterStore.matkulList" :key="m.kodeMtk" :value="m.kodeMtk">
                   {{ m.namaMatkul }} ({{ m.sks }} SKS)
                </option>
             </select>
          </div>
          <div>
            <label class="block text-sm font-medium theme-text opacity-80 mb-1">Kelas Penempatan</label>
             <select v-model="assignData.idKelas" required class="w-full px-4 py-2 theme-bg border theme-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-400 theme-text">
                <option value="" disabled>-- Pilih Kelas --</option>
                <option v-for="k in masterStore.kelasList" :key="k.idKelas" :value="k.idKelas">
                   {{ k.namaKelas }} ({{ k.prodi }})
                </option>
             </select>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
             <div>
               <label class="block text-sm font-medium theme-text opacity-80 mb-1">Hari</label>
                <select v-model="assignData.hari" required class="w-full px-4 py-2 theme-bg border theme-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-400 theme-text">
                   <option value="Senin">Senin</option><option value="Selasa">Selasa</option>
                   <option value="Rabu">Rabu</option><option value="Kamis">Kamis</option>
                   <option value="Jumat">Jumat</option><option value="Sabtu">Sabtu</option>
                </select>
             </div>
             <div>
               <label class="block text-sm font-medium theme-text opacity-80 mb-1">Ruangan</label>
               <input v-model="assignData.ruangan" type="text" placeholder="Misal: Lab Komputer" required class="w-full px-4 py-2 theme-bg border theme-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-400 theme-text">
             </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
             <div>
               <label class="block text-sm font-medium theme-text opacity-80 mb-1">Jam Mulai</label>
               <input v-model="assignData.jamMulai" type="time" required class="w-full px-4 py-2 theme-bg border theme-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-400 theme-text">
             </div>
             <div>
               <label class="block text-sm font-medium theme-text opacity-80 mb-1">Jam Selesai</label>
               <input v-model="assignData.jamSelesai" type="time" required class="w-full px-4 py-2 theme-bg border theme-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-400 theme-text">
             </div>
          </div>
          
          <div class="pt-4 flex gap-3">
             <button type="button" @click="closeAssignModal" class="flex-1 px-4 py-2 border theme-border rounded-xl font-medium opacity-80 hover:bg-slate-50 dark:hover:bg-slate-800 transition">Batal</button>
             <button type="submit" class="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition shadow-sm">Simpan Jadwal</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMasterDataStore } from '@/stores/masterData'
import Swal from 'sweetalert2'

const masterStore = useMasterDataStore()

onMounted(async () => {
    await masterStore.fetchAll()
})

const searchQuery = ref('')
const statusFilter = ref('')

const isModalOpen = ref(false)
const modalMode = ref('add')
const initialForm = { id: null, nidn: '', nama: '', email: '', status: 'Aktif' }
const formData = ref({ ...initialForm })

const isAssignModalOpen = ref(false)
const assignData = ref({
   idDosen: '',
   namaDosen: '',
   kodeMtk: '',
   idKelas: '',
   hari: 'Senin',
   jamMulai: '08:00',
   jamSelesai: '10:30',
   ruangan: 'Reguler A'
})

const getJadwalDosen = (idDosen) => {
   return masterStore.jadwalMengajar.filter(j => j.idDosen === idDosen)
}

const filteredDosen = computed(() => {
  return (masterStore.dosenList || []).filter(dosen => {
    const matchSearch = dosen.nama.toLowerCase().includes(searchQuery.value.toLowerCase()) || dosen.nidn.includes(searchQuery.value)
    // status kepegawaian tidak ada di db, anggap Aktif default
    const matchStatus = true; 
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

const openAssignModal = (dosen) => {
   assignData.value = {
      idDosen: dosen.idDosen,
      namaDosen: dosen.nama,
      kodeMtk: '',
      idKelas: '',
      hari: 'Senin',
      jamMulai: '08:00',
      jamSelesai: '10:30',
      ruangan: ''
   }
   isAssignModalOpen.value = true
}

const closeAssignModal = () => {
   isAssignModalOpen.value = false
}

const saveAssignment = async () => {
   // Validate if already teaching that class? Optional.
   await masterStore.tambahJadwal(assignData.value)
   Swal.fire('Berhasil Terjadwal', 'Mata kuliah berhasil ditambahkan ke beban mengajar dosen!', 'success')
   closeAssignModal()
}

const saveData = () => {
   Swal.fire('Belum Diimplementasi', 'Fitur tambah/edit dosen belum API-ready.', 'info')
   closeModal()
}

const confirmDelete = (nidn) => {
  Swal.fire({
      title: 'Hapus Dosen?',
      text: "Fitur ini memerlukan penyesuaian endpoint API di backend.",
      icon: 'info'
  })
}
</script>
