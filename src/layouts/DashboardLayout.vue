<template>
  <div class="min-h-screen bg-slate-50 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
      <div class="h-16 flex items-center justify-center font-bold text-xl border-b border-white border-opacity-10">
        SIAKAD 🎓
      </div>
      
      <nav class="flex-1 p-4 space-y-1 overflow-y-auto w-full scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <router-link
          v-for="menu in menus"
          :key="menu.path"
          :to="menu.path"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 justify-between group"
          :class="$route.path === menu.path ? 'bg-primary-600 text-white shadow-md shadow-primary-900/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'"
        >
          <div class="flex items-center space-x-3 font-medium">
             <component :is="menu.icon" class="w-5 h-5 transition-transform duration-200 group-hover:scale-110" :class="$route.path === menu.path ? 'text-white' : 'text-slate-400 group-hover:text-primary-400'" />
             <span>{{ menu.name }}</span>
          </div>
          <span v-if="menu.badge && menu.badge() > 0" class="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold shadow-sm self-center">
             {{ menu.badge() }}
          </span>
        </router-link>
      </nav>

      <div class="p-4 border-t border-white border-opacity-10">
        <div class="text-sm text-slate-400 mb-2">Login sebagai:</div>
        <div class="font-medium truncate">{{ authStore.user?.name }}</div>
        <div class="text-sm truncate opacity-70 mb-4">{{ authStore.role.toUpperCase() }}</div>
        <button 
          @click="handleLogout"
          class="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-red-500 hover:bg-red-600 rounded-lg transition"
        >
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden theme-bg transition-colors duration-300">
      <!-- Navbar (Mobile + Top) -->
      <header class="h-16 theme-card border-b flex items-center justify-between px-6 transition-colors duration-300">
        <div class="font-semibold theme-text md:hidden">
          SIAKAD
        </div>
        <div class="hidden md:block theme-text opacity-70 font-medium">
          Dashboard {{ authStore.role.charAt(0).toUpperCase() + authStore.role.slice(1) }}
        </div>
        
        <div class="flex items-center space-x-6">
          <!-- Dark Mode Toggle -->
          <button @click="toggleDarkMode" class="theme-text opacity-70 hover:opacity-100 transition focus:outline-none">
            <svg v-if="!isDark" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </button>

          <!-- Notification Bell -->
          <div class="relative">
            <button @click="isNotifOpen = !isNotifOpen" class="theme-text opacity-70 hover:opacity-100 transition focus:outline-none relative mt-1">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              <!-- Unread Badge -->
              <span v-if="notificationStore.unreadCount > 0" class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 font-bold text-white" style="font-size: 10px;">
                {{ notificationStore.unreadCount }}
              </span>
            </button>

            <!-- Notification Dropdown -->
            <transition enter-active-class="transition ease-out duration-200" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <div v-show="isNotifOpen" class="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                <div class="px-4 py-3 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                  <h3 class="text-sm border-gray-100 font-semibold theme-text">Notifikasi</h3>
                  <button @click="notificationStore.markAllAsRead" class="text-xs text-primary-600 hover:text-primary-800 dark:text-primary-400 font-medium">Tandai sudah dibaca</button>
                </div>
                <!-- Notif List -->
                <div class="max-h-80 overflow-y-auto">
                  <div v-if="notificationStore.currentNotifications.length === 0" class="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    Belum ada notifikasi baru.
                  </div>
                  <div v-else>
                    <div 
                      v-for="notif in notificationStore.currentNotifications" 
                      :key="notif.id"
                      @click="notificationStore.markAsRead(notif.id)"
                      class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer transition border-b border-gray-50 dark:border-slate-700/50 last:border-0"
                      :class="!notif.isRead ? 'bg-blue-50/30 dark:bg-primary-900/10' : ''"
                    >
                      <div class="flex items-start space-x-3">
                        <!-- Icon type -->
                        <div class="flex-shrink-0 mt-1">
                           <div v-if="notif.type === 'success'" class="w-2 h-2 rounded-full bg-emerald-500"></div>
                           <div v-else-if="notif.type === 'warning'" class="w-2 h-2 rounded-full bg-amber-500"></div>
                           <div v-else class="w-2 h-2 rounded-full bg-blue-500"></div>
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate" :class="!notif.isRead ? 'font-bold' : ''">
                            {{ notif.title }}
                          </p>
                          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2 leading-tight">
                            {{ notif.message }}
                          </p>
                          <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {{ notif.time }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>

          <!-- Profile Info -->
          <router-link to="/profile" class="flex items-center space-x-3 cursor-pointer group">
            <div class="h-9 w-9 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center shadow-sm group-hover:ring-2 group-hover:ring-primary-400 transition">
              {{ authStore.user?.name?.charAt(0) }}
            </div>
            <div class="hidden md:block text-sm">
              <div class="font-bold theme-text group-hover:text-primary-600 transition">{{ authStore.user?.name?.split(' ')[0] || authStore.role.toUpperCase() }}</div>
              <div class="text-[11px] theme-text opacity-60 uppercase font-semibold tracking-wide">{{ authStore.role }}</div>
            </div>
          </router-link>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-auto p-6 theme-bg">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import { useKeuanganStore } from '@/stores/keuangan'
import { useMessageStore } from '@/stores/messages'
import {
  HomeIcon,
  EnvelopeIcon,
  UsersIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ClipboardDocumentCheckIcon,
  CalendarDaysIcon,
  CheckBadgeIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
  FolderOpenIcon,
  BanknotesIcon,
  ClockIcon,
  UserPlusIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const keuanganStore = useKeuanganStore()
const msgStore = useMessageStore()

// Dark Mode Logic
const isDark = ref(false)
const isNotifOpen = ref(false)

// Close notif dropdown on click outside
const closeDropdown = (e) => {
   if (isNotifOpen.value && !e.target.closest('.relative')) {
      isNotifOpen.value = false
   }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
  // Check local storage or system preference
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  }
})

const toggleDarkMode = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.theme = 'dark'
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.theme = 'light'
  }
}

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

// Identifikasi spesifik user aktif untuk cek jumlah pesan belum dibaca
const currentUserIdentifier = computed(() => {
   if(authStore.role === 'mahasiswa') return '20260001'
   if(authStore.role === 'dosen') return '110022331'
   return 'admin'
})

// Menu dinamis berdasarkan role
const menus = computed(() => {
  if (authStore.role === 'admin') {
    return [
      { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
      { name: 'Verifikasi PMB', path: '/admin/pmb', icon: UserPlusIcon, badge: () => authStore.calonMahasiswa.length },
      { name: 'Data Mahasiswa', path: '/admin/mahasiswa', icon: UsersIcon },
      { name: 'Data Dosen', path: '/admin/dosen', icon: AcademicCapIcon },
      { name: 'Mata Kuliah', path: '/admin/matakuliah', icon: BookOpenIcon },
      { name: 'Pesan Internal', path: '/inbox', icon: EnvelopeIcon, badge: () => msgStore.getUnreadCount(currentUserIdentifier.value) },
    ]
  } else if (authStore.role === 'dosen') {
    return [
      { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
      { name: 'Jadwal Mengajar', path: '/dosen/jadwal', icon: CalendarDaysIcon },
      { name: 'Presensi Kelas', path: '/dosen/presensi', icon: ClockIcon },
      { name: 'Input Nilai', path: '/dosen/nilai', icon: CheckBadgeIcon },
      { name: 'Persetujuan KRS', path: '/dosen/perwalian', icon: DocumentDuplicateIcon },
      { name: 'Manajemen Tugas', path: '/dosen/tugas', icon: ClipboardDocumentCheckIcon },
      { name: 'Pesan Internal', path: '/inbox', icon: EnvelopeIcon, badge: () => msgStore.getUnreadCount(currentUserIdentifier.value) },
    ]
  } else if (authStore.role === 'mahasiswa') {
    return [
      { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
      { name: 'Data Administratif', path: '/mahasiswa/administratif', icon: FolderOpenIcon },
      { name: 'KRS', path: '/mahasiswa/krs', icon: DocumentTextIcon },
      { name: 'KHS / Transkrip', path: '/mahasiswa/khs', icon: CheckBadgeIcon },
      { name: 'Jadwal Kuliah', path: '/mahasiswa/jadwal', icon: CalendarDaysIcon },
      { name: 'Rekap Kehadiran', path: '/mahasiswa/kehadiran', icon: ClockIcon },
      { name: 'Tugas E-Learning', path: '/mahasiswa/tugas', icon: ClipboardDocumentCheckIcon },
      { name: 'Info Tagihan', path: '/mahasiswa/keuangan', icon: BanknotesIcon, badge: () => keuanganStore.tagihanAktif.length },
      { name: 'Pesan Internal', path: '/inbox', icon: EnvelopeIcon, badge: () => msgStore.getUnreadCount(currentUserIdentifier.value) },
    ]
  }
  return []
})
</script>
