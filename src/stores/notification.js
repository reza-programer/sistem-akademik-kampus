import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        // Format: { 'mahasiswa': [...], 'dosen': [...], 'admin': [...] } 
        // Bisa diubah menjadi array of objects secara global untuk keperluan mock
        notifications: JSON.parse(localStorage.getItem('app_notifications')) || {
            mahasiswa: [
                { id: 1, title: 'Pembayaran Valid', message: 'Pembayaran UKT Semester Genap Anda telah Tervalidasi.', isRead: false, time: '2 Jam yang lalu', type: 'success' },
                { id: 2, title: 'KRS Dibuka', message: 'Masa pengisian Kartu Rencana Studi (KRS) telah dibuka.', isRead: true, time: '1 Hari yang lalu', type: 'info' }
            ],
            dosen: [
                { id: 1, title: 'Perwalian Baru', message: 'Terdapat 3 Mahasiswa yang mengajukan KRS untuk Anda tinjau.', isRead: false, time: '1 Jam yang lalu', type: 'warning' }
            ],
            admin: []
        }
    }),
    getters: {
        currentNotifications: (state) => {
            const authStore = useAuthStore()
            const role = authStore.role
            return state.notifications[role] || []
        },
        unreadCount: (state) => {
            const authStore = useAuthStore()
            const role = authStore.role
            return (state.notifications[role] || []).filter(n => !n.isRead).length
        }
    },
    actions: {
        addNotification(role, notif) {
            if (!this.notifications[role]) {
                this.notifications[role] = []
            }
            const newNotif = {
                id: Date.now(),
                isRead: false,
                time: 'Baru saja',
                ...notif
            }
            this.notifications[role].unshift(newNotif)
            this.saveState()
        },
        markAllAsRead() {
            const authStore = useAuthStore()
            const role = authStore.role
            if (this.notifications[role]) {
                this.notifications[role].forEach(n => n.isRead = true)
            }
            this.saveState()
        },
        markAsRead(id) {
            const authStore = useAuthStore()
            const role = authStore.role
            if (this.notifications[role]) {
                const notif = this.notifications[role].find(n => n.id === id)
                if (notif) notif.isRead = true
            }
            this.saveState()
        },
        saveState() {
            localStorage.setItem('app_notifications', JSON.stringify(this.notifications))
        }
    }
})
