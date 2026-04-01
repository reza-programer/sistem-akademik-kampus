import { defineStore } from 'pinia';
import { useAuthStore } from './auth';

const API_URL = 'http://localhost:5000/api';

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        notifications: []
    }),
    getters: {
        unreadCount: (state) => state.notifications.filter(n => !n.isRead).length,
        currentNotifications: (state) => state.notifications
    },
    actions: {
        async fetchNotifications() {
            try {
                const auth = useAuthStore();
                if (!auth.user) return;
                
                const targetId = auth.user.username || auth.user.idDosen || 'admin';
                const res = await fetch(`${API_URL}/notifications/${targetId}`);
                const data = await res.json();
                this.notifications = data;
            } catch (err) {
                console.error("Gagal load notifications:", err);
            }
        },
        markAsRead(id) {
            const notif = this.notifications.find(n => n.id === id);
            if (notif) notif.isRead = true;
            // Missing API endpoint for PUT mark read in server.js but fine for demo logic
        },
        markAllAsRead() {
            this.notifications.forEach(n => n.isRead = true);
        }
    }
});
