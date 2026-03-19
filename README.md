# 🎓 SIAKAD (Sistem Informasi Akademik)

SIAKAD adalah platform Sistem Informasi Akademik berbasis web modern yang dibangun untuk memudahkan pengelolaan data akademik kampus, mulai dari manajemen mahasiswa, dosen, perwalian (KRS), hingga tagihan dan pembayaran (UKT/BPP).

Proyek ini dibangun menggunakan **Vue 3** (dengan Composition API via `<script setup>`), **Vite** untuk build tool yang super cepat, **Tailwind CSS** untuk styling, dan **Pinia** untuk state management yang elegan.

---

## ✨ Fitur Utama

- 👨‍🎓 **Dashboard Mahasiswa & Dosen**  
  Tampilan antarmuka yang modern, bersih, dan informatif yang disesuaikan dengan peran pengguna (Admin, Dosen, atau Mahasiswa).
- 📚 **Manajemen KRS & Perwalian**  
  Mahasiswa dapat menyusun rencana studi (KRS) dengan batasan SKS, dan dosen wali dapat meninjau (menyetujui/menolak) pengajuan KRS secara langsung.
- 💳 **Integrasi Tagihan & Keuangan**  
  Ketika KRS disetujui atau Admin menambahkan tagihan semester baru (UKT/Biaya Praktikum), sistem akan otomatis membuat tagihan *(invoice)* yang muncul di Dashboard Mahasiswa.
- 📝 **E-Learning & Tugas**  
  Fitur kelas online mini dimana dosen dapat memberikan materi/tugas dan mahasiswa dapat mengumpulkannya.
- 💬 **Pesan Internal (Inbox)**  
  Fitur chat komunikasi internal antara Mahasiswa dan Dosen.

## 🛠️ Tech Stack

- **Framework:** [Vue 3](https://v3.vuejs.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Statemanagement:** [Pinia](https://pinia.vuejs.org/)
- **Router:** [Vue Router](https://router.vuejs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [@heroicons/vue](https://heroicons.com/)
- **Alert/Modal:** [SweetAlert2](https://sweetalert2.github.io/)

---

## 🚀 Cara Menjalankan Project

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di komputer lokal Anda:

### Prasyarat
Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) (versi LTS direkomendasikan).

### 1. Clone Repository (jika menggunakan git)
```bash
git clone <url-repository-anda>
cd Uniku
```

### 2. Instal Dependensi
Gunakan NPM atau Yarn untuk menginstal seluruh dependensi.
```bash
npm install
# atau
yarn install
```

### 3. Jalankan Server Development
Jalankan perintah berikut untuk memulai server lokal dengan Hot-Module-Replacement (HMR).
```bash
npm run dev
# atau
yarn dev
```
Aplikasi biasanya akan berjalan di `http://localhost:5173`. 

### 4. Build untuk Production
Jika Anda ingin melakukan build untuk di-deploy ke server (production), jalankan:
```bash
npm run build
```
Vite akan membuat folder `dist` yang berisi file statis HTML, CSS, dan JS yang sudah teroptimasi.

---

## 🔐 Akun Dummy (Testing)
Data sementara disimpan di `localStorage`. Berikut adalah akun default untuk mencoba sistem:

- **Admin/Keuangan**  
  - Username: `admin`  
  - Password: `password123` *(atau password apa saja)*
- **Dosen**  
  - Username: `0001017011` / `0001017012`  
  - Password: `password123` 
- **Mahasiswa**  
  - Username: `20260001` / `20260002`  
  - Password: `password123`

---

## 📚 Dokumentasi Ekstra

- Referensi Vue 3: [SFC Script Setup Docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup)
- Panduan Tooling IDE Vue: [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support)
