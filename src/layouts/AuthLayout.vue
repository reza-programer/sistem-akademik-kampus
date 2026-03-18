<template>
  <div class="flex flex-col min-h-screen bg-white font-sans">
    
    <!-- Simplified Topbar -->
    <header class="bg-white border-b border-slate-100 py-4 px-6 md:px-10 flex items-center sticky top-0 z-30">
      <div class="mr-4">
         <img src="/unikuuuu.jpg" alt="Logo Uniku" class="h-10 w-auto rounded-full shadow-sm" />
      </div>
      <div>
        <h1 class="text-lg md:text-xl font-black tracking-tight text-slate-800 m-0 leading-tight">UNIVERSITAS KUNINGAN</h1>
        <p class="text-primary-600 font-bold text-[9px] md:text-xs tracking-wider uppercase m-0 mt-0.5">Studentsite Portal</p>
      </div>
    </header>

    <!-- Content Area -->
    <main class="flex-grow flex items-center justify-center bg-slate-50/50 p-6">
      <div class="w-full max-w-[440px] animate-fade-in">
        <slot />
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-slate-100 py-6 px-4 text-center">
      <p class="text-[11px] text-slate-400 font-medium">
        &copy; 2026 Universitas Kuningan &bull; Sistem Informasi Akademik
      </p>
    </footer>

  </div>
</template>

<style scoped>
.animate-fade-in {
   animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeIn {
   from { opacity: 0; transform: translateY(10px); }
   to { opacity: 1; transform: translateY(0); }
}
</style>
