<template>
  <div class="w-full relative">
    
    <!-- Title Area (Dynamic based on role) -->
    <div class="text-center mb-8 transition-all duration-300">
       <h2 class="text-3xl font-bold text-slate-800 transition-colors" :class="{'text-primary-700': activeRole !== 'admin', 'text-slate-800': activeRole === 'admin'}">
          {{ displayTitle }}
       </h2>
       <p class="text-slate-500 mt-2 text-sm">{{ displaySubtitle }}</p>
    </div>

    <!-- Role Selector -->
    <div class="grid grid-cols-3 gap-3 mb-8">
      <button 
        @click="setRole('mahasiswa')"
        :class="activeRole === 'mahasiswa' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/40 scale-105 border-transparent z-10' : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-white hover:shadow-sm'"
        class="flex flex-col items-center justify-center py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden"
      >
        <div v-if="activeRole === 'mahasiswa'" class="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
        <svg class="w-6 h-6 mb-2 relative z-10" :class="activeRole === 'mahasiswa' ? 'text-white' : 'text-primary-400 group-hover:text-primary-600 transition-colors'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14l9-5-9-5-9 5 9 5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg>
        <span class="text-[10px] sm:text-xs font-bold uppercase tracking-widest relative z-10">Mahasiswa</span>
      </button>

      <button 
        @click="setRole('dosen')"
        :class="activeRole === 'dosen' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/40 scale-105 border-transparent z-10' : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-white hover:shadow-sm'"
        class="flex flex-col items-center justify-center py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden"
      >
        <div v-if="activeRole === 'dosen'" class="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
        <svg class="w-6 h-6 mb-2 relative z-10" :class="activeRole === 'dosen' ? 'text-white' : 'text-emerald-400 group-hover:text-emerald-600 transition-colors'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
        <span class="text-[10px] sm:text-xs font-bold uppercase tracking-widest relative z-10">Dosen</span>
      </button>

      <button 
        @click="setRole('admin')"
        :class="activeRole === 'admin' ? 'bg-slate-800 text-white shadow-lg shadow-slate-800/40 scale-105 border-transparent z-10' : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-white hover:shadow-sm'"
        class="flex flex-col items-center justify-center py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden"
      >
        <div v-if="activeRole === 'admin'" class="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
        <svg class="w-6 h-6 mb-2 relative z-10" :class="activeRole === 'admin' ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 transition-colors'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
        <span class="text-[10px] sm:text-xs font-bold uppercase tracking-widest relative z-10">Admin</span>
      </button>
    </div>

    <!-- The Form -->
    <form @submit.prevent="handleLogin" class="space-y-5 animate-fade-in-up">
      
      <!-- Error Alert -->
      <transition enter-active-class="transition duration-300 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
        <div v-if="errorMessage" class="bg-red-50 text-red-600 p-3.5 rounded-xl text-sm border border-red-100 flex items-center mb-4 shadow-sm">
          <svg class="h-5 w-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <span class="font-medium">{{ errorMessage }}</span>
        </div>
      </transition>

      <!-- Input Group -->
      <div class="space-y-4">
        <div class="relative">
          <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">{{ usernameLabel }}</label>
          <div class="relative flex items-center">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
               <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <input 
              v-model="username" 
              type="text" 
              required
              :class="activeInputBorderClass"
              class="w-full pl-11 pr-4 py-3.5 rounded-xl border bg-slate-50/50 outline-none transition-all duration-300 text-slate-800 focus:bg-white focus:ring-4 placeholder-slate-400 font-medium"
              :placeholder="usernamePlaceholder"
            >
          </div>
        </div>
        
        <div class="relative">
          <div class="flex items-center justify-between mb-1.5 ml-1">
            <label class="block text-sm font-semibold text-slate-700">Password</label>
            <a href="#" class="text-xs transition-colors font-medium" :class="activeLinkClass">Lupa kata sandi?</a>
          </div>
          <div class="relative flex items-center">
             <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
             </div>
             <input 
               v-model="password" 
               type="password" 
               required
               :class="activeInputBorderClass"
               class="w-full pl-11 pr-4 py-3.5 rounded-xl border bg-slate-50/50 outline-none transition-all duration-300 text-slate-800 focus:bg-white focus:ring-4 placeholder-slate-400 font-medium tracking-widest"
               placeholder="••••••••"
             >
          </div>
        </div>
      </div>

      <!-- Action -->
      <button 
        type="submit" 
        :disabled="isLoading"
        :class="activeButtonClass"
        class="w-full text-white font-bold tracking-wide py-4 px-4 rounded-xl transition-all duration-300 flex justify-center items-center mt-2 border border-transparent"
      >
        <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span v-else class="flex items-center">
           Masuk ke Sistem
           <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </span>
      </button>

      <!-- Hints Footer -->
      <div v-if="activeRole === 'mahasiswa'" class="mt-8 text-center animate-fade-in text-slate-500">
        <div class="mb-4 text-sm font-semibold p-3 border border-primary-200 bg-primary-50 rounded-xl text-primary-700">
           Calon Mahasiswa Baru?<br>
           <router-link to="/register" class="underline hover:text-primary-900 ml-1">Daftar Akun SIAKAD di sini</router-link>
        </div>
        <p class="text-xs font-semibold uppercase tracking-widest mb-3 opacity-60">Akun Mhs Tersedia</p>
        <div class="flex flex-col items-center justify-center text-xs">
          <div class="px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 cursor-pointer hover:bg-white hover:border-primary-300 transition-colors shadow-sm text-left">
            <span class="block opacity-70 mb-1">Coba salah satu (NIM 1 s/d 30):</span>
            <span class="block text-primary-700 font-bold font-mono">20260001 <span class="text-slate-400 font-normal px-2">s/d</span> 20260030</span>
            <span class="block mt-1">Pass: <span class="font-mono text-slate-700">password123</span></span>
          </div>
        </div>
      </div>
      
      <div v-if="activeRole === 'dosen'" class="mt-8 text-center animate-fade-in text-slate-500">
        <p class="text-xs font-semibold uppercase tracking-widest mb-3 opacity-60">Akun Pengajar</p>
        <div class="inline-block px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white hover:border-emerald-300 transition shadow-sm">
           <span class="font-mono font-bold text-emerald-700">dosen</span> / <span class="font-mono font-bold text-emerald-700">dosen</span>
        </div>
      </div>
      
      <div v-if="activeRole === 'admin'" class="mt-8 text-center animate-fade-in text-slate-500">
        <p class="text-xs font-semibold uppercase tracking-widest mb-3 opacity-60">Root Access</p>
        <div class="inline-block px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white hover:border-slate-400 transition shadow-sm">
           <span class="font-mono font-bold text-slate-700">admin</span> / <span class="font-mono font-bold text-slate-700">admin</span>
        </div>
      </div>

    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// State
const activeRole = ref('mahasiswa') // 'mahasiswa', 'dosen', 'admin'
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

// Dynamics computed property for seamless UI
const displayTitle = computed(() => {
   if(activeRole.value === 'mahasiswa') return 'Portal Mahasiswa'
   if(activeRole.value === 'dosen') return 'Portal Dosen'
   return 'Sistem Admin'
})

const displaySubtitle = computed(() => {
   if(activeRole.value === 'mahasiswa') return 'Akses layanan KRS, KHS, dan Perkuliahan.'
   if(activeRole.value === 'dosen') return 'Manajemen kelas dan persetujuan studi mahasiswa.'
   return 'Kontrol penuh sistem akademik Universitas.'
})

const usernameLabel = computed(() => {
   if(activeRole.value === 'mahasiswa') return 'Nomor Induk Mahasiswa (NIM)'
   if(activeRole.value === 'dosen') return 'NIDN / Username Pengajar'
   return 'Username Administrator'
})

const usernamePlaceholder = computed(() => {
   if(activeRole.value === 'mahasiswa') return 'Contoh: 20260001'
   if(activeRole.value === 'dosen') return 'Contoh: 00123456'
   return 'admin_utama'
})

const activeInputBorderClass = computed(() => {
   if(activeRole.value === 'mahasiswa') return 'border-slate-200 focus:border-primary-500 focus:ring-primary-100'
   if(activeRole.value === 'dosen') return 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
   return 'border-slate-200 focus:border-slate-700 focus:ring-slate-100'
})

const activeLinkClass = computed(() => {
   if(activeRole.value === 'mahasiswa') return 'text-primary-600 hover:text-primary-800'
   if(activeRole.value === 'dosen') return 'text-emerald-600 hover:text-emerald-800'
   return 'text-slate-600 hover:text-slate-800'
})

const activeButtonClass = computed(() => {
   if(isLoading.value) return 'opacity-70 cursor-wait bg-slate-400'
   
   if(activeRole.value === 'mahasiswa') return 'bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5'
   if(activeRole.value === 'dosen') return 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5'
   return 'bg-slate-800 hover:bg-slate-900 shadow-lg shadow-slate-800/30 hover:shadow-slate-800/50 hover:-translate-y-0.5'
})

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const identifiedRole = await authStore.login(username.value, password.value)
    
    // Validasi pencegah salah portal (Cek apakah role yang dipilih sesuai dengan kredensial)
    if (identifiedRole !== activeRole.value) {
       authStore.logout() // Batalkan login jika salah kamar
       throw `Sistem menolak: Akun tersebut bukan merupakan kredensial ${activeRole.value.toUpperCase()}.`
    }

    await Swal.fire({
      icon: 'success',
      title: 'Akses Diberikan!',
      text: `Selamat datang di Portal Akademik.`,
      showConfirmButton: false,
      timer: 1500
    })

    router.push('/dashboard')
  } catch (error) {
    // Memberikan guncangan jika error
    errorMessage.value = error
    Swal.fire({
        icon: 'error',
        title: 'Gagal Masuk',
        text: error,
        confirmButtonColor: '#0ea5e9'
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.animate-fade-in-up {
   animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.animate-fade-in {
   animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeInUp {
   from { opacity: 0; transform: translateY(10px); }
   to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
   from { opacity: 0; }
   to { opacity: 1; }
}
</style>
