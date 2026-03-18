<template>
  <div class="w-full relative">
    
    <div class="text-center mb-6">
       <div class="inline-block bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">Portal PMB</div>
       <h2 class="text-3xl font-bold text-slate-800">Registrasi Mahasiswa</h2>
       <p class="text-slate-500 mt-2 text-sm">Daftar sekarang untuk mendapatkan akun dan Nomor Induk Mahasiswa (NIM).</p>
    </div>

    <form @submit.prevent="handleRegister" class="space-y-4 animate-fade-in-up">
      
      <!-- Grid format untuk space hemat -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="relative">
            <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Nama Lengkap</label>
            <input 
              v-model="form.nama" 
              type="text" 
              required
              class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 outline-none transition-all duration-300 text-slate-800 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 placeholder-slate-400 font-medium"
              placeholder="Sesuai Ijazah"
            >
          </div>

          <div class="relative">
            <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Program Studi</label>
            <select 
              v-model="form.prodi" 
              required
              class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 outline-none transition-all duration-300 text-slate-800 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 font-medium"
            >
                <option value="" disabled>Pilih Jurusan...</option>
                <option value="Sistem Informasi">S1 Sistem Informasi</option>
                <option value="Teknik Informatika">S1 Teknik Informatika</option>
                <option value="Desain Komunikasi Visual">S1 Desain Komunikasi Visual</option>
            </select>
          </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="relative">
            <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Alamat Email Aktif</label>
            <input 
              v-model="form.email" 
              type="email" 
              required
              class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 outline-none transition-all duration-300 text-slate-800 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 placeholder-slate-400 font-medium"
              placeholder="contoh@gmail.com"
            >
          </div>

          <div class="relative">
            <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Nomor Handphone (WA)</label>
            <input 
              v-model="form.nohp" 
              type="text" 
              required
              class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 outline-none transition-all duration-300 text-slate-800 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 placeholder-slate-400 font-medium"
              placeholder="0812xxxxxx"
            >
          </div>
      </div>

      <div class="relative">
        <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Password Baru (Untuk Login SIAKAD)</label>
        <input 
          v-model="form.password" 
          type="password" 
          required
          minlength="6"
          class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 outline-none transition-all duration-300 text-slate-800 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 placeholder-slate-400 font-medium tracking-widest"
          placeholder="••••••••"
        >
      </div>

      <!-- Action -->
      <button 
        type="submit" 
        :disabled="isLoading"
        class="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold tracking-wide py-4 px-4 rounded-xl transition-all duration-300 flex justify-center items-center mt-6 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5"
      >
        <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span v-else class="flex items-center">
           Ajukan Registrasi
        </span>
      </button>

      <div class="text-center mt-4">
         <p class="text-sm text-slate-500">Sudah punya akun SIAKAD? 
            <router-link to="/login" class="text-primary-600 font-bold hover:underline">Masuk di sini</router-link>
         </p>
      </div>

    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref(false)

const form = ref({
   nama: '',
   prodi: '',
   email: '',
   nohp: '',
   password: ''
})

const handleRegister = () => {
   isLoading.value = true
   
   setTimeout(() => {
      authStore.registerCamaba(form.value)
      
      Swal.fire({
          icon: 'success',
          title: 'Registrasi Berhasil!',
          html: `Halo <b>${form.value.nama}</b>, pendaftaran kamu telah masuk ke sistem.<br><br>
                 Sistem telah mengirimkan riwayat pendaftaran ke email:<br>
                 <span class="text-primary-600 font-bold underline">${form.value.email}</span><br><br>
                 <span class="text-sm text-slate-500 bg-slate-100 px-3 py-2 rounded block border border-slate-200">Silakan tunggu verifikasi admin BAAK. Begitu divalidasi, NIM resmi akan <b>dikirimkan langsung masuk ke email kamu</b>.</span>`,
          confirmButtonText: 'Kembali ke Login',
          confirmButtonColor: '#0c4a6e'
      }).then(() => {
          router.push('/login')
      })

      isLoading.value = false
   }, 1500)
}
</script>

<style scoped>
.animate-fade-in-up {
   animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeInUp {
   from { opacity: 0; transform: translateY(10px); }
   to { opacity: 1; transform: translateY(0); }
}
</style>
