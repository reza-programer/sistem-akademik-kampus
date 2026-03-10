<template>
  <component :is="layout">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AuthLayout from './layouts/AuthLayout.vue'
import DashboardLayout from './layouts/DashboardLayout.vue'

const route = useRoute()

const layout = computed(() => {
  if (route.meta.layout === 'auth') return AuthLayout
  if (route.meta.layout === 'dashboard') return DashboardLayout
  return 'div' // fallback
})
</script>

<style>
/* Global Page Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
