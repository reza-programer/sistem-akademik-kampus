<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold theme-text">Pengaturan Profil</h1>
        <p class="theme-text opacity-60 text-sm mt-1">Kelola informasi pribadi dan keamanan akun</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Profil Card -->
      <div class="theme-card p-6 rounded-2xl border shadow-sm flex flex-col items-center text-center">
        <div class="relative w-32 h-32 mb-4">
          <div class="w-full h-full rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-5xl font-bold shadow-inner">
            {{ authStore.user?.name?.charAt(0) }}
          </div>
          <button class="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full shadow-lg hover:bg-primary-700 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </button>
        </div>
        <h2 class="text-xl font-bold theme-text">{{ authStore.user?.name }}</h2>
        <p class="theme-text opacity-70 mt-1 uppercase text-sm tracking-wider font-semibold">{{ authStore.role }}</p>
        <p class="theme-text opacity-50 mt-1 text-sm">{{ authStore.user?.nim || '1122334455' }}</p>

        <div class="mt-6 w-full pt-6 border-t theme-card font-medium text-red-500 hover:text-red-600 cursor-pointer flex items-center justify-center transition" @click="handleLogout">
           <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
           Keluar Akun
        </div>
      </div>

      <!-- Form Pengaturan -->
      <div class="lg:col-span-2 space-y-6">
        <div class="theme-card p-6 rounded-2xl border shadow-sm">
          <h3 class="text-lg font-bold theme-text mb-4">Informasi Dasar</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label class="block text-sm font-medium theme-text opacity-70 mb-1">Nama Lengkap</label>
                <input type="text" :value="authStore.user?.name" class="w-full px-4 py-2 theme-bg border theme-card rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-200 theme-text">
             </div>
             <div>
                <label class="block text-sm font-medium theme-text opacity-70 mb-1">Email / Kontak</label>
                <input type="email" value="user@kampus.ac.id" class="w-full px-4 py-2 theme-bg border theme-card rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-200 theme-text">
             </div>
          </div>
          <div class="mt-4 flex justify-end">
             <button @click="saveProfile" class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition shadow-sm">Simpan Profil</button>
          </div>
        </div>

        <div class="theme-card p-6 rounded-2xl border shadow-sm">
          <h3 class="text-lg font-bold theme-text mb-4">Keamanan & Password</h3>
          <div class="space-y-4">
             <div>
                <label class="block text-sm font-medium theme-text opacity-70 mb-1">Password Saat Ini</label>
                <input type="password" placeholder="••••••••" class="w-full max-w-sm px-4 py-2 theme-bg border theme-card rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-200 theme-text">
             </div>
             <div>
                <label class="block text-sm font-medium theme-text opacity-70 mb-1">Password Baru</label>
                <input type="password" placeholder="Minimal 8 karakter" class="w-full max-w-sm px-4 py-2 theme-bg border theme-card rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-200 theme-text">
             </div>
          </div>
          <div class="mt-4 flex justify-start">
             <button @click="savePassword" class="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2 rounded-xl text-sm font-medium transition shadow-sm">Update Password</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  Swal.fire({
      title: 'Keluar Sesi?',
      text: "Anda akan keluar dari aplikasi saat ini.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal'
  }).then((result) => {
      if (result.isConfirmed) {
          authStore.logout()
          router.push('/login')
      }
  })
}

const saveProfile = () => {
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Informasi Profil Anda sukses diperbarui.',
      confirmButtonColor: '#0ea5e9',
      timer: 2000
   })
}

const savePassword = () => {
    Swal.fire({
      icon: 'success',
      title: 'Sandi Diperbarui!',
      text: 'Kata sandi keamanan berhasil diubah.',
      confirmButtonColor: '#0ea5e9',
      timer: 2000
   })
}
</script>
