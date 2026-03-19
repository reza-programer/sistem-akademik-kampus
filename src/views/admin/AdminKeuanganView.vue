<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 mb-6">
      <div>
        <h1 class="text-2xl font-normal text-slate-800 tracking-wide">Kelola Keuangan</h1>
        <p class="text-sm text-slate-500 mt-1">Atur biaya pembayaran per semester untuk seluruh mahasiswa</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <span class="bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded uppercase tracking-widest shadow-sm">Modul Keuangan</span>
      </div>
    </div>

    <!-- Form Tambah Biaya Semester -->
    <div class="bg-white border border-slate-200 shadow-sm">
      <div class="p-4 border-b border-slate-200 bg-slate-50">
        <h3 class="font-bold text-slate-800 uppercase tracking-widest text-sm">Tambah Biaya Semester Baru</h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <!-- Semester -->
          <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Semester</label>
            <select v-model="form.semester" class="w-full border border-slate-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white">
              <option value="">-- Pilih Semester --</option>
              <option v-for="sem in semesterOptions" :key="sem" :value="sem">{{ sem }}</option>
            </select>
          </div>
          <!-- Jenis Biaya -->
          <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Jenis Biaya</label>
            <select v-model="form.jenis" class="w-full border border-slate-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white">
              <option value="">-- Pilih Jenis --</option>
              <option value="UKT">UKT (Uang Kuliah Tunggal)</option>
              <option value="BPP">BPP (Biaya Penyelenggaraan Pendidikan)</option>
              <option value="DPP">DPP (Dana Pengembangan Pendidikan)</option>
              <option value="Biaya Praktikum">Biaya Praktikum</option>
              <option value="Biaya Wisuda">Biaya Wisuda</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          <!-- Nominal -->
          <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Nominal (Rp)</label>
            <input v-model.number="form.nominal" type="number" placeholder="Contoh: 3500000" class="w-full border border-slate-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
          </div>
          <!-- Batas Pembayaran -->
          <div>
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Batas Pembayaran</label>
            <input v-model="form.batasPembayaran" type="date" class="w-full border border-slate-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
          </div>
        </div>

        <!-- Info -->
        <div class="bg-amber-50 border border-amber-200 rounded p-3 mb-6 flex items-start gap-3">
          <svg class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <p class="text-xs text-amber-700 leading-relaxed">
            <strong>Perhatian:</strong> Saat Anda menambahkan biaya semester, tagihan akan <strong>otomatis digenerate</strong> ke seluruh mahasiswa yang terdaftar di sistem 
            (<strong>{{ authStore.mahasiswaDB.length }}</strong> mahasiswa). Tagihan langsung berstatus <em>"Belum Lunas"</em> dan muncul di dashboard masing-masing mahasiswa.
          </p>
        </div>

        <button
          @click="handleTambahBiaya"
          :disabled="!isFormValid"
          class="px-6 py-2.5 bg-teal-700 text-white font-bold text-sm uppercase tracking-wider rounded shadow-sm hover:bg-teal-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          + Tambah & Generate Tagihan
        </button>
      </div>
    </div>

    <!-- Daftar Biaya Semester yang Sudah Dibuat -->
    <div class="bg-white border border-slate-200 shadow-sm">
      <div class="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <h3 class="font-bold text-slate-800 uppercase tracking-widest text-sm">Daftar Biaya Semester</h3>
        <span class="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded font-bold">{{ keuanganStore.biayaSemester.length }} Item</span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-slate-600 uppercase bg-slate-100 border-b border-slate-200">
            <tr>
              <th class="px-6 py-3 font-medium border-r border-slate-200">No</th>
              <th class="px-6 py-3 font-medium border-r border-slate-200">Semester</th>
              <th class="px-6 py-3 font-medium border-r border-slate-200">Jenis Biaya</th>
              <th class="px-6 py-3 font-medium border-r border-slate-200 text-right">Nominal</th>
              <th class="px-6 py-3 font-medium border-r border-slate-200">Batas Bayar</th>
              <th class="px-6 py-3 font-medium border-r border-slate-200">Dibuat</th>
              <th class="px-6 py-3 font-medium text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="text-slate-600 text-xs">
            <tr v-if="keuanganStore.biayaSemester.length === 0">
              <td colspan="7" class="px-6 py-10 text-center bg-white border-b border-slate-200">
                <div class="flex flex-col items-center justify-center">
                  <svg class="w-10 h-10 mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Belum ada biaya semester yang ditambahkan
                </div>
              </td>
            </tr>
            <tr v-for="(biaya, index) in keuanganStore.biayaSemester" :key="biaya.id" class="border-b border-slate-100 hover:bg-slate-50 transition">
              <td class="px-6 py-3 border-r border-slate-100 font-bold">{{ index + 1 }}</td>
              <td class="px-6 py-3 border-r border-slate-100">
                <span class="bg-slate-200 text-slate-700 px-2 py-1 rounded text-xs font-bold">{{ biaya.semester }}</span>
              </td>
              <td class="px-6 py-3 border-r border-slate-100 font-semibold">{{ biaya.jenis }}</td>
              <td class="px-6 py-3 border-r border-slate-100 text-right font-bold text-slate-800">{{ formatRupiah(biaya.nominal) }}</td>
              <td class="px-6 py-3 border-r border-slate-100">{{ formatDate(biaya.batasPembayaran) }}</td>
              <td class="px-6 py-3 border-r border-slate-100 text-slate-400">{{ formatDate(biaya.createdAt) }}</td>
              <td class="px-6 py-3 text-center">
                <button @click="handleHapusBiaya(biaya.id, biaya.jenis, biaya.semester)" class="text-red-500 hover:text-red-700 font-bold text-xs uppercase tracking-wider hover:underline transition">
                  Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Statistik Ringkas -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white border border-slate-200 shadow-sm p-0 flex flex-col">
        <div class="bg-teal-700 text-white p-4 flex items-center justify-between">
          <h3 class="font-bold uppercase tracking-widest text-sm text-white/90">Total Mahasiswa</h3>
          <svg class="w-6 h-6 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        </div>
        <div class="p-6 flex-1 flex flex-col justify-center items-center">
          <p class="text-4xl font-bold text-slate-800 mb-2">{{ authStore.mahasiswaDB.length }}</p>
          <p class="text-xs font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-200 shadow-sm">Akan Menerima Tagihan</p>
        </div>
      </div>

      <div class="bg-white border border-slate-200 shadow-sm p-0 flex flex-col">
        <div class="bg-amber-500 text-white p-4 flex items-center justify-between">
          <h3 class="font-bold uppercase tracking-widest text-sm text-white/90">Tagihan Belum Lunas</h3>
          <svg class="w-6 h-6 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <div class="p-6 flex-1 flex flex-col justify-center items-center">
          <p class="text-4xl font-bold text-amber-600 mb-2">{{ keuanganStore.tagihanAktif.length }}</p>
          <p class="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200 shadow-sm">Belum Dibayar</p>
        </div>
      </div>

      <div class="bg-white border border-slate-200 shadow-sm p-0 flex flex-col">
        <div class="bg-emerald-600 text-white p-4 flex items-center justify-between">
          <h3 class="font-bold uppercase tracking-widest text-sm text-white/90">Sudah Lunas</h3>
          <svg class="w-6 h-6 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <div class="p-6 flex-1 flex flex-col justify-center items-center">
          <p class="text-4xl font-bold text-emerald-600 mb-2">{{ keuanganStore.riwayatPembayaran.length }}</p>
          <p class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 shadow-sm">Transaksi Lunas</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useKeuanganStore } from '@/stores/keuangan'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'

const keuanganStore = useKeuanganStore()
const authStore = useAuthStore()

const semesterOptions = [
  'Ganjil 2024/2025',
  'Genap 2024/2025',
  'Ganjil 2025/2026',
  'Genap 2025/2026',
  'Ganjil 2026/2027',
  'Genap 2026/2027'
]

const form = reactive({
  semester: '',
  jenis: '',
  nominal: null,
  batasPembayaran: ''
})

const isFormValid = computed(() => {
  return form.semester && form.jenis && form.nominal > 0 && form.batasPembayaran
})

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number)
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString('id-ID', options)
}

const resetForm = () => {
  form.semester = ''
  form.jenis = ''
  form.nominal = null
  form.batasPembayaran = ''
}

const handleTambahBiaya = () => {
  Swal.fire({
    title: 'Konfirmasi Penambahan Biaya',
    html: `
      <div class="text-left text-sm space-y-2 mt-3">
        <p><strong>Semester:</strong> ${form.semester}</p>
        <p><strong>Jenis:</strong> ${form.jenis}</p>
        <p><strong>Nominal:</strong> ${formatRupiah(form.nominal)}</p>
        <p><strong>Batas Bayar:</strong> ${formatDate(form.batasPembayaran)}</p>
        <div class="bg-amber-50 border border-amber-200 rounded p-3 mt-3">
          <p class="text-xs text-amber-700"><strong>⚠️ Tagihan akan digenerate ke ${authStore.mahasiswaDB.length} mahasiswa.</strong></p>
        </div>
      </div>
    `,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, Tambahkan',
    cancelButtonText: 'Batal',
    confirmButtonColor: '#0f766e',
    width: '28em'
  }).then((result) => {
    if (result.isConfirmed) {
      keuanganStore.addBiayaSemester({ ...form })
      resetForm()

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: `Biaya semester telah ditambahkan dan tagihan berhasil digenerate ke ${authStore.mahasiswaDB.length} mahasiswa.`,
        confirmButtonColor: '#0f766e'
      })
    }
  })
}

const handleHapusBiaya = (id, jenis, semester) => {
  Swal.fire({
    title: 'Hapus Biaya Semester?',
    html: `<p class="text-sm">Biaya <strong>${jenis}</strong> untuk semester <strong>${semester}</strong> akan dihapus.<br>Tagihan terkait yang <em>belum lunas</em> juga akan dihapus.</p>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal',
    confirmButtonColor: '#dc2626'
  }).then((result) => {
    if (result.isConfirmed) {
      keuanganStore.deleteBiayaSemester(id)
      Swal.fire({
        icon: 'success',
        title: 'Terhapus!',
        text: 'Biaya semester dan tagihan terkait telah dihapus.',
        confirmButtonColor: '#0f766e'
      })
    }
  })
}
</script>
