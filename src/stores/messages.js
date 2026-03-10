import { defineStore } from 'pinia'

export const useMessageStore = defineStore('messages', {
    state: () => ({
        // Dummy daftar pengguna untuk di-chat
        contacts: [
            { id: '110022331', name: 'Budi Santoso, M.Kom', role: 'dosen', avatar: 'B', online: true },
            { id: '20260001', name: 'Ahmad Fauzi', role: 'mahasiswa', avatar: 'A', online: false },
            { id: '20260002', name: 'Siti Aminah', role: 'mahasiswa', avatar: 'S', online: true },
            { id: 'admin', name: 'System Administrator', role: 'admin', avatar: 'S', online: true }
        ],
        // Dummy riwayat chat per-kamar log
        messages: [
            { id: 1, senderId: '110022331', receiverId: '20260001', text: 'Halo Ahmad, tolong revisi pengajuan KRS kamu di matkul Basis Data.', timestamp: new Date(Date.now() - 86400000).toISOString(), read: true },
            { id: 2, senderId: '20260001', receiverId: '110022331', text: 'Baik Pak, segera saya sesuaikan dan ajukan ulang hari ini.', timestamp: new Date(Date.now() - 82800000).toISOString(), read: true },
            { id: 3, senderId: 'admin', receiverId: '20260001', text: 'Pemberitahuan Sistem: Batas akhir pembayaran UKT adalah 15 Agustus.', timestamp: new Date(Date.now() - 40000000).toISOString(), read: false }
        ]
    }),
    getters: {
        getMessagesWithUser: (state) => (myId, contactId) => {
            return state.messages.filter(m =>
                (m.senderId === myId && m.receiverId === contactId) ||
                (m.senderId === contactId && m.receiverId === myId)
            ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        },
        getUnreadCount: (state) => (myId) => {
            return state.messages.filter(m => m.receiverId === myId && !m.read).length
        },
        getLastMessage: (state) => (myId, contactId) => {
            const msgs = state.messages.filter(m =>
                (m.senderId === myId && m.receiverId === contactId) ||
                (m.senderId === contactId && m.receiverId === myId)
            ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            return msgs.length > 0 ? msgs[0] : null
        }
    },
    actions: {
        sendMessage(senderId, receiverId, text) {
            this.messages.push({
                id: Date.now(),
                senderId,
                receiverId,
                text,
                timestamp: new Date().toISOString(),
                read: false
            })
        },
        markAsRead(myId, contactId) {
            this.messages.forEach(m => {
                if (m.senderId === contactId && m.receiverId === myId && !m.read) {
                    m.read = true
                }
            })
        }
    }
})
