<template>
  <div class="w-full animate-fade-in">
    
    <div class="bg-white p-8 sm:p-10 border border-slate-200 rounded-3xl shadow-sm">
      
      <div v-if="!isSubmitted">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-black text-slate-800 tracking-tight">Atur Ulang Kata Sandi</h2>
          <p class="text-xs text-slate-500 font-medium mt-2 leading-relaxed">
            Masukkan NIM atau ID Staff Anda. Kami akan mengirimkan tautan pemulihan ke alamat email yang terdaftar di sistem.
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Identitas (NIM/ID)</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
              <input 
                v-model="identifier" 
                type="text" 
                required
                class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 transition-all placeholder:font-normal placeholder:text-slate-400"
                placeholder="Masukkan NIM atau ID Staff"
              >
            </div>
          </div>

          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full py-3.5 px-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl shadow-md shadow-primary-500/20 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-if="!isLoading">Kirim Tautan Pemulihan</span>
          </button>
        </form>
      </div>

      <div v-else class="text-center py-4">
        <div class="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 class="text-2xl font-black text-slate-800 tracking-tight mb-2">Email Terkirim!</h2>
        <p class="text-xs text-slate-500 font-medium leading-relaxed px-4">
          Instruksi pemulihan kata sandi telah dikirimkan ke email: <br>
          <span class="font-bold text-primary-600 underline">{{ targetEmail }}</span><br><br>
          Mohon periksa folder Kotak Masuk atau Spam Anda.
        </p>
      </div>

      <div class="mt-8 pt-6 border-t border-slate-100 text-center">
        <router-link to="/login" class="text-xs font-bold text-slate-500 hover:text-primary-600 transition-colors flex items-center justify-center">
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Kembali ke Login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Swal from 'sweetalert2'
import emailjs from '@emailjs/browser'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const identifier = ref('')
const isLoading = ref(false)
const isSubmitted = ref(false)
const targetEmail = ref('')

// EmailJS Config
const SERVICE_ID = 'service_91x6abn'
const TEMPLATE_ID = 'template_pzbwpza'
const PUBLIC_KEY = 'MU6rQhY8_JcedLtfP'

const handleSubmit = async () => {
  if (!identifier.value) return
  
  isLoading.value = true
  try {
    const user = await authStore.forgotPassword(identifier.value)
    targetEmail.value = user.email
    
    // Kirim email via EmailJS
    const templateParams = {
      to_name: user.name,
      to_email: user.email,
      message: `Halo ${user.name}, Anda baru saja meminta pengaturan ulang kata sandi untuk akun ${identifier.value}. Silakan gunakan tautan berikut untuk membuat kata sandi baru: [TAUTAN_PEMULIHAN_CONTOH]`
    }

    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
    
    isSubmitted.value = true
    Swal.fire({
      icon: 'success',
      title: 'Email Terkirim',
      text: 'Silakan cek kotak masuk email anda.',
      showConfirmButton: false,
      timer: 2000,
      customClass: {
        popup: 'rounded-3xl border-none shadow-xl'
      }
    })
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: error.text || error,
      confirmButtonColor: '#2563eb',
      customClass: {
        popup: 'rounded-3xl border-none shadow-xl'
      }
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
