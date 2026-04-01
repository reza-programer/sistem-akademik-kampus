import { defineStore } from 'pinia';
import { useAuthStore } from './auth';

const API_URL = 'http://localhost:5000/api';

export const useMessageStore = defineStore('messages', {
    state: () => ({
        messages: [],
        contacts: []
    }),
    getters: {
        getMessagesWithUser: (state) => {
            return (otherUserId) => {
                const auth = useAuthStore();
                if (!auth.user) return [];
                const me = auth.user.username || auth.user.idDosen; // Basic mapping
                
                return state.messages.filter(msg => 
                    (msg.senderId === me && msg.receiverId === otherUserId) ||
                    (msg.senderId === otherUserId && msg.receiverId === me)
                );
            }
        },
        getUnreadCount: (state) => {
            return (userId) => {
                return state.messages.filter(msg => msg.receiverId === userId && !msg.isRead).length;
            }
        }
    },
    actions: {
        async fetchMessages() {
            try {
                const auth = useAuthStore();
                if (!auth.user) return;
                
                const myId = auth.user.username || auth.user.idDosen || 'admin';
                const res = await fetch(`${API_URL}/messages/${myId}`);
                const data = await res.json();
                this.messages = data;
            } catch (err) { 
                console.error(err);
            }
        },
        sendMessage(senderId, receiverId, text) {
            const msg = { 
                id: Date.now(), 
                senderId, 
                receiverId, 
                text, 
                timestamp: new Date().toISOString(),
                read: false 
            };
            this.messages.push(msg);
        },
        markAsRead(currentUserId, contactId) {
            this.messages.forEach(msg => {
                if (msg.receiverId === currentUserId && msg.senderId === contactId) {
                    msg.read = true;
                }
            });
        },
        getLastMessage(currentUserId, contactId) {
            const relevant = this.messages.filter(msg => 
                (msg.senderId === currentUserId && msg.receiverId === contactId) ||
                (msg.senderId === contactId && msg.receiverId === currentUserId)
            );
            return relevant.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
        }
    }
});
