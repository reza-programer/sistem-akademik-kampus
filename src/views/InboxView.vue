<template>
  <div class="h-[calc(100vh-8rem)] min-h-[500px] flex overflow-hidden theme-card border theme-border rounded-2xl shadow-sm">
    
    <!-- Bagian Kiri: Daftar Kontak Sidebar -->
    <div class="w-1/3 min-w-[280px] max-w-sm border-r theme-border flex flex-col theme-bg">
      <div class="p-4 border-b theme-border flex items-center justify-between">
        <h2 class="font-bold text-lg theme-text flex items-center">
            Pesan Internal
            <span v-if="unreadTotal > 0" class="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{{ unreadTotal }}</span>
        </h2>
      </div>

      <!-- Bilah Pencarian Kontak -->
      <div class="p-3 border-b theme-border border-opacity-50">
         <div class="relative">
            <svg class="w-4 h-4 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input v-model="searchQuery" type="text" placeholder="Cari kontak..." class="w-full pl-9 pr-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary-400 outline-none theme-text">
         </div>
      </div>

      <!-- Daftar Kontak (Diurutkan otomatis yang ada riwayat chat) -->
      <div class="flex-1 overflow-y-auto">
        <div 
           v-for="contact in filteredContacts" 
           :key="contact.id" 
           @click="selectContact(contact)"
           class="p-4 border-b theme-border hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition select-none flex items-start gap-3 relative"
           :class="{ 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-l-primary-500': selectedContact && selectedContact.id === contact.id }"
        >
           <div class="relative">
             <div class="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm shadow-inner shrink-0 theme-border border">
               {{ contact.avatar }}
             </div>
             <div class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900" :class="contact.online ? 'bg-emerald-500' : 'bg-slate-400'"></div>
           </div>

           <div class="flex-1 min-w-0">
              <div class="flex justify-between items-center mb-0.5">
                 <h4 class="font-bold text-sm theme-text truncate">{{ contact.name }}</h4>
                 <span class="text-[10px] text-slate-400 font-mono">{{ formatTimeShort(lastMsg(contact)?.timestamp) }}</span>
              </div>
              <p class="text-xs truncate theme-text opacity-70" :class="{ 'font-bold text-slate-900 dark:text-white': isUnreadFrom(contact) }">
                 <span v-if="lastMsg(contact)">{{ lastMsg(contact).senderId === currentUserIdentifier ? 'Anda: ' : '' }}{{ lastMsg(contact).text }}</span>
                 <span v-else class="italic opacity-50">Mulai percakapan baru</span>
              </p>
           </div>

           <!-- Red Dot Unread Badge specific for this contact -->
           <div v-if="isUnreadFrom(contact)" class="w-2.5 h-2.5 bg-red-500 rounded-full mt-1 shrink-0"></div>
        </div>
        
        <div v-if="filteredContacts.length === 0" class="p-8 text-center text-sm opacity-50 theme-text">
           Kontak tidak ditemukan.
        </div>
      </div>
    </div>

    <!-- Bagian Kanan: Jendela Percakapan (Chat Room) -->
    <div class="flex-1 flex flex-col relative w-full h-full">
      <!-- State 1: Kosong (Belum pilih kontak) -->
      <div v-if="!selectedContact" class="absolute inset-0 flex flex-col items-center justify-center theme-text opacity-50 p-6 text-center">
         <div class="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-300 dark:text-slate-600">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
         </div>
         <h3 class="text-lg font-bold mb-1">Ruang Pesan Internal</h3>
         <p class="text-sm">Pilih kontak atau rekan sivitas akademika di bilah kiri untuk memulai percakapan instan.</p>
      </div>

      <!-- State 2: Area Chat Aktif -->
      <template v-else>
         <!-- Chat Header -->
         <div class="h-16 border-b theme-border flex items-center px-6 bg-slate-50 dark:bg-slate-900/50 justify-between shrink-0">
            <div class="flex items-center gap-3">
               <div class="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm shadow-inner shrink-0">
                  {{ selectedContact.avatar }}
               </div>
               <div>
                  <h3 class="font-bold theme-text text-sm">{{ selectedContact.name }}</h3>
                  <p class="text-[11px] theme-text opacity-70 uppercase tracking-widest font-semibold">{{ selectedContact.role }}</p>
               </div>
            </div>
            
            <button class="text-slate-400 hover:text-primary-600 transition p-2">
               <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </button>
         </div>

         <!-- Chat Canvas (Scrollable) -->
         <div class="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-slate-900/20" id="chat-canvas">
            <!-- Pesan Kosong -->
            <div v-if="activeMessages.length === 0" class="text-center py-10 opacity-50 theme-text text-xs font-mono uppercase tracking-widest">
               — Awal percakapan terenkripsi —
            </div>

            <!-- Bubble List -->
            <div v-for="msg in activeMessages" :key="msg.id" class="flex" :class="msg.senderId === currentUserIdentifier ? 'justify-end' : 'justify-start'">
               
               <div class="max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm"
                  :class="msg.senderId === currentUserIdentifier 
                          ? 'bg-primary-600 text-white rounded-br-sm' 
                          : 'bg-white dark:bg-slate-800 border theme-border theme-text rounded-bl-sm'"
               >
                  <p class="text-sm leading-relaxed">{{ msg.text }}</p>
                  <div class="flex items-center justify-end gap-1 mt-1 opacity-70" :class="msg.senderId === currentUserIdentifier ? 'text-blue-100' : 'text-slate-500'">
                     <span class="text-[10px]">{{ formatTime(msg.timestamp) }}</span>
                     <svg v-if="msg.senderId === currentUserIdentifier" class="w-3 h-3" :class="msg.read ? 'text-sky-300' : 'opacity-50'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
               </div>
               
            </div>
         </div>

         <!-- Chat Type Box -->
         <div class="p-4 bg-white dark:bg-slate-800 border-t theme-border shrink-0">
            <form @submit.prevent="kirimPesan" class="flex items-end gap-2">
               <button type="button" class="p-2.5 text-slate-400 hover:text-primary-600 transition shrink-0 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <svg class="w-5 h-5 transform rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
               </button>
               
               <div class="relative flex-1">
                  <textarea 
                     v-model="pesanTeks"
                     @keydown.enter.prevent="kirimPesanEnter"
                     rows="1" 
                     class="w-full bg-slate-50 dark:bg-slate-900 border theme-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 theme-text resize-none overflow-hidden block"
                     placeholder="Ketik balasan Anda..."
                     style="min-height: 44px; max-height: 120px;"
                  ></textarea>
               </div>

               <button type="submit" :disabled="!pesanTeks.trim()" class="p-3 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 disabled:dark:bg-slate-700 text-white transition shrink-0 rounded-xl shadow-sm flex items-center justify-center">
                  <svg class="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
               </button>
            </form>
         </div>
      </template>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useMessageStore } from '@/stores/messages'
import { useAuthStore } from '@/stores/auth'

const msgStore = useMessageStore()
const authStore = useAuthStore()

// Mock indentifier (Dalam aslinya bisa NIM atau NIDN)
// Agar logika chating bisa dimainkan baik login sebagai dosen / mahasiswa.
const currentUserIdentifier = computed(() => {
   if(authStore.role === 'mahasiswa') return '20260001' // Pakai Dummy NIM Ahmad Fauzi
   if(authStore.role === 'dosen') return '110022331' // Pakai Dummy NIDN Budi Santoso
   return 'admin'
})

const searchQuery = ref('')
const selectedContact = ref(null)
const pesanTeks = ref('')

// Computed List of Contacts for this user (Except themselves)
const contactsList = computed(() => {
   return msgStore.contacts.filter(c => c.id !== currentUserIdentifier.value)
})

const filteredContacts = computed(() => {
   let list = contactsList.value
   if(searchQuery.value) {
       list = list.filter(c => c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || c.id.includes(searchQuery.value))
   }

   // Sort by latest message date descending (Bubble to top)
   return list.sort((a,b) => {
       const msgA = msgStore.getLastMessage(currentUserIdentifier.value, a.id)
       const msgB = msgStore.getLastMessage(currentUserIdentifier.value, b.id)
       const tA = msgA ? new Date(msgA.timestamp).getTime() : 0
       const tB = msgB ? new Date(msgB.timestamp).getTime() : 0
       return tB - tA
   })
})

const unreadTotal = computed(() => {
   return msgStore.getUnreadCount(currentUserIdentifier.value)
})

const isUnreadFrom = (contact) => {
   const msg = msgStore.getLastMessage(currentUserIdentifier.value, contact.id)
   return msg && msg.receiverId === currentUserIdentifier.value && !msg.read
}

const lastMsg = (contact) => {
   return msgStore.getLastMessage(currentUserIdentifier.value, contact.id)
}

const activeMessages = computed(() => {
   if(!selectedContact.value) return []
   return msgStore.getMessagesWithUser(currentUserIdentifier.value, selectedContact.value.id)
})

const selectContact = (contact) => {
   selectedContact.value = contact
   // Mark messages read from this user
   msgStore.markAsRead(currentUserIdentifier.value, contact.id)
   scrollToBottom()
}

// Format Datetime untuk Bubble Chat
const formatTime = (isoString) => {
    if(!isoString) return ''
    const d = new Date(isoString)
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

const formatTimeShort = (isoString) => {
    if(!isoString) return ''
    const d = new Date(isoString)
    const today = new Date()

    if(d.toDateString() === today.toDateString()) {
       return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
}

const scrollToBottom = async () => {
    await nextTick()
    const container = document.getElementById('chat-canvas')
    if(container) {
        container.scrollTop = container.scrollHeight
    }
}

// Trigger kirim jika Enter ditekan (Shift+Enter buat Baris Baru)
const kirimPesanEnter = (e) => {
   if(!e.shiftKey) {
      kirimPesan()
   } else {
      pesanTeks.value += '\n'
   }
}

const kirimPesan = () => {
   if(!pesanTeks.value.trim() || !selectedContact.value) return

   msgStore.sendMessage(currentUserIdentifier.value, selectedContact.value.id, pesanTeks.value.trim())
   pesanTeks.value = ''
   
   // Auto scroll via nextTick watcher
   scrollToBottom()
}

// Watch active messages untuk auto-scroll ketika ada pesang baru masuk
watch(activeMessages, () => {
   scrollToBottom()
}, { deep: true })

</script>
