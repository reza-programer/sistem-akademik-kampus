<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
    <!-- Ornamen dekoratif blur -->
    <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
    
    <div class="w-full max-w-md relative z-10 glass rounded-2xl p-8">
      <div class="text-center mb-8">
        <div class="h-16 w-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
          <span class="text-white text-2xl font-bold">🎓</span>
        </div>
        <h1 class="text-2xl font-bold text-slate-800">Sistem Akademik</h1>
        <p class="text-slate-500 mt-2">Login untuk mengakses layanan</p>
      </div>

      <slot />
    </div>
  </div>
</template>

<style>
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
</style>
