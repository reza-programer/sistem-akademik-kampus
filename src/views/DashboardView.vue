<template>
  <div>
    <!-- Render Dashboard Khusus Admin -->
    <AdminDashboard v-if="role === 'admin'" />

    <!-- Render Dashboard Khusus Dosen -->
    <DosenDashboard v-if="role === 'dosen'" />

    <!-- Render Dashboard Khusus Mahasiswa -->
    <MahasiswaDashboard v-if="role === 'mahasiswa'" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

// Import Komponen Dashboard Berdasarkan Role
import AdminDashboard from './admin/AdminDashboard.vue'
import DosenDashboard from './dosen/DosenDashboard.vue'
import MahasiswaDashboard from './mahasiswa/MahasiswaDashboard.vue'

const authStore = useAuthStore()
const role = computed(() => authStore.role)
</script>
