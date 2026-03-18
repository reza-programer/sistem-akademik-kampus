<template>
  <div class="w-full animate-fade-in">
    
    <!-- Simplified Main Login Box -->
    <div class="bg-white p-8 sm:p-10 border border-slate-200 rounded-3xl shadow-sm">
      
      <!-- Top Tab Selection -->
      <div class="flex p-1 bg-slate-100 rounded-2xl mb-8 w-full border border-slate-200">
         <button @click="setRole('dosen')" :class="activeRole === 'dosen' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'" class="py-2.5 text-[11px] font-bold flex-1 transition-all rounded-xl uppercase tracking-wider">Dosen</button>
         <button @click="setRole('admin')" :class="activeRole === 'admin' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'" class="py-2.5 text-[11px] font-bold flex-1 transition-all rounded-xl uppercase tracking-wider">Admin</button>
      </div>

      <div class="text-center mb-8">
         <h2 class="text-2xl font-black text-slate-800 tracking-tight">{{ displayTitle }}</h2>
         <p class="text-xs text-slate-500 font-medium mt-1">{{ displaySubtitle }}</p>
      </div>
      
      <!-- Error Message -->
      <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0">
        <div v-if="errorMessage" class="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl mb-6 text-xs flex items-center">
          <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
          <p class="font-bold">{{ errorMessage }}</p>
        </div>
      </transition>

      <form @submit.prevent="handleLogin" class="space-y-4">
        
        <div>
          <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">{{ usernameLabel }}</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <input 
              v-model="username" 
              type="text" 
              required
              class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 transition-all placeholder:font-normal placeholder:text-slate-400"
              :placeholder="usernamePlaceholder"
            >
          </div>
        </div>
        
        <div>
          <div class="flex items-center justify-between mb-2 ml-1">
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
            <router-link to="/forgot-password" :class="activeLinkClass" class="text-[10px] font-bold">Lupa Password?</router-link>
          </div>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <input 
              v-model="password" 
              type="password" 
              required
              class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 transition-all placeholder:font-normal placeholder:text-slate-400"
              placeholder="••••••••"
            >
          </div>
        </div>

        <div class="pt-2">
          <button 
            type="submit" 
            :disabled="isLoading"
            :class="submitBtnClass"
            class="w-full py-3.5 px-4 text-white text-sm font-bold rounded-xl shadow-md flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-if="!isLoading">Buka Portal {{ activeRole.charAt(0).toUpperCase() + activeRole.slice(1) }}</span>
          </button>
        </div>
      </form>

      <div class="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-4">
        <router-link to="/login" class="text-xs font-bold text-slate-500 hover:text-primary-600 transition-colors">
          Kembali ke Portal Mahasiswa
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const activeRole = ref('dosen') // 'dosen', 'admin'
const username = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const setRole = (role) => {
   activeRole.value = role
   username.value = ''
   password.value = ''
   errorMessage.value = ''
}

const displayTitle = computed(() => {
   if(activeRole.value === 'dosen') return 'Portal Dosen'
   return 'Sistem Admin'
})

const displaySubtitle = computed(() => {
   if(activeRole.value === 'dosen') return 'Modul Pengajar & Verifikasi'
   return 'Kendali Penuh Universitas'
})

const usernameLabel = computed(() => {
   if(activeRole.value === 'dosen') return 'NIDN / ID Pengajar'
   return 'Admin ID'
})

const usernamePlaceholder = computed(() => {
   if(activeRole.value === 'dosen') return 'ID Pengajar'
   return 'admin_utama'
})

const activeLinkClass = computed(() => {
   if(activeRole.value === 'dosen') return 'text-emerald-600 hover:text-emerald-700'
   return 'text-slate-600 hover:text-slate-800'
})

const submitBtnClass = computed(() => {
   if(activeRole.value === 'dosen') return 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
   return 'bg-slate-800 hover:bg-slate-900 shadow-slate-800/20'
})

const handleLogin = async () => {
  if (!username.value || !password.value) return
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const identifiedRole = await authStore.login(username.value, password.value)
    
    if (identifiedRole !== activeRole.value) {
       authStore.logout() 
       throw `Akses ditolak: Akun anda tidak terdaftar sebagai ${activeRole.value.toUpperCase()}.`
    }

    await Swal.fire({
      icon: 'success',
      title: 'Selamat Datang!',
      text: `Berhasil masuk ke portal staff.`,
      showConfirmButton: false,
      timer: 1500,
      customClass: {
        popup: 'rounded-3xl border-none shadow-xl'
      }
    })

    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = error
    Swal.fire({
        icon: 'error',
        title: 'Gagal Masuk',
        text: error,
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
