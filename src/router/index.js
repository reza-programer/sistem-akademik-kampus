import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/auth/LoginView.vue'),
        meta: { layout: 'auth' }
    },
    {
        path: '/login-staff',
        name: 'LoginStaff',
        component: () => import('@/views/auth/LoginStaffView.vue'),
        meta: { layout: 'auth' }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/auth/RegistrasiView.vue'),
        meta: { layout: 'auth' }
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: () => import('@/views/auth/ForgotPasswordView.vue'),
        meta: { layout: 'auth' }
    },
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: { layout: 'dashboard', requiresAuth: true }
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/ProfileView.vue'),
        meta: { layout: 'dashboard', requiresAuth: true }
    },
    {
        path: '/inbox',
        name: 'Inbox',
        component: () => import('@/views/InboxView.vue'),
        meta: { layout: 'dashboard', requiresAuth: true }
    },
    // Rute Mahasiswa
    {
        path: '/mahasiswa/krs',
        name: 'MahasiswaKRS',
        component: () => import('@/views/mahasiswa/KrsView.vue'),
        meta: { layout: 'dashboard', requiresAuth: true, role: 'mahasiswa' }
    },
    {
        path: '/mahasiswa/khs',
        name: 'MahasiswaKHS',
        component: () => import('@/views/mahasiswa/KhsView.vue'),
        meta: { layout: 'dashboard', requiresAuth: true, role: 'mahasiswa' }
    },
    {
        path: '/mahasiswa/administratif',
        name: 'DataAdministratif',
        component: () => import('@/views/mahasiswa/DataAdministratifView.vue'),
        meta: { layout: 'dashboard', requiresAuth: true, role: 'mahasiswa' }
    },
    {
        path: '/mahasiswa/jadwal',
        name: 'MahasiswaJadwal',
        component: () => import('@/views/mahasiswa/JadwalView.vue'),
        meta: { layout: 'dashboard', requiresAuth: true, role: 'mahasiswa' }
    },
    {
        path: '/mahasiswa/kehadiran',
        name: 'MahasiswaKehadiran',
        component: () => import('@/views/mahasiswa/KehadiranView.vue'),
        meta: { layout: 'dashboard', requiresAuth: true, role: 'mahasiswa' }
    },
    {
        path: '/mahasiswa/keuangan',
        name: 'MahasiswaKeuangan',
        component: () => import('@/views/mahasiswa/TagihanView.vue'),
        meta: { layout: 'dashboard', requiresAuth: true, role: 'mahasiswa' }
    },
    {
        path: '/mahasiswa/tugas',
        name: 'MahasiswaTugas',
        component: () => import('@/views/mahasiswa/DaftarTugasView.vue'),
        meta: { layout: 'dashboard', requiresAuth: true, role: 'mahasiswa' }
    },
    // Rute Dosen
    {
        path: '/dosen/jadwal',
        name: 'DosenJadwal',
        component: () => import('@/views/dosen/JadwalView.vue'),
        meta: { layout: 'dashboard', requiresAuth: true, role: 'dosen' }
    },
    {
        path: '/dosen/nilai',
        name: 'InputNilai',
        component: () => import('@/views/dosen/InputNilaiView.vue'),
        meta: { layout: 'dashboard', requiresAuth: true, role: 'dosen' }
    },
    {
        path: '/dosen/perwalian',
        name: 'Perwalian',
        component: () => import('@/views/dosen/PerwalianView.vue'),
        meta: { layout: 'dashboard', requiresAuth: true, role: 'dosen' }
    },
    {
        path: '/dosen/presensi',
        name: 'DosenPresensi',
        component: () => import('@/views/dosen/PresensiView.vue'),
        meta: { layout: 'dashboard', requiresAuth: true, role: 'dosen' }
    },
    {
        path: '/dosen/tugas',
        name: 'ManajemenTugas',
        component: () => import('@/views/dosen/ManajemenTugasView.vue'),
        meta: { layout: 'dashboard', requiresAuth: true, role: 'dosen' }
    },
    // Rute Admin
    {
        path: '/admin/mahasiswa',
        name: 'AdminMahasiswa',
        component: () => import('@/views/admin/DataMahasiswaView.vue'),
        meta: { layout: 'dashboard', requiresAuth: true, role: 'admin' }
    },
    {
        path: '/admin/pmb',
        name: 'AdminPMB',
        component: () => import('@/views/admin/VerifikasiPmbView.vue'),
        meta: { layout: 'dashboard', requiresAuth: true, role: 'admin' }
    },
    {
        path: '/admin/dosen',
        name: 'AdminDosen',
        component: () => import('@/views/admin/DataDosenView.vue'),
        meta: { layout: 'dashboard', requiresAuth: true, role: 'admin' }
    },
    {
        path: '/admin/matakuliah',
        name: 'AdminMatkul',
        component: () => import('@/views/admin/DataMatkulView.vue'),
        meta: { layout: 'dashboard', requiresAuth: true, role: 'admin' }
    },
    {
        path: '/admin/keuangan',
        name: 'AdminKeuangan',
        component: () => import('@/views/admin/AdminKeuanganView.vue'),
        meta: { layout: 'dashboard', requiresAuth: true, role: 'admin' }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Navigation Guard Singkat
router.beforeEach((to) => {
    const isAuthenticated = localStorage.getItem('token')
    const userRole = localStorage.getItem('role')

    if (to.meta.requiresAuth && !isAuthenticated) {
        return { name: 'Login' }
    }

    if (to.meta.role && to.meta.role !== userRole) {
        return { name: 'Dashboard' }
    }

    return true
})

export default router
