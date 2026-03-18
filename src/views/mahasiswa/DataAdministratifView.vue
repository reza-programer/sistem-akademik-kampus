<template>
  <div class="space-y-6 max-w-7xl mx-auto pb-10">
    
    <div class="border-b border-slate-200 pb-3">
      <h1 class="text-xl md:text-2xl font-normal text-slate-800 tracking-wide">Data Administratif</h1>
    </div>

    <!-- Alert / Notifikasi -->
    <div class="bg-amber-50 border border-amber-200 text-amber-800 rounded-sm p-3 md:p-4 text-sm font-medium leading-relaxed">
      Mohon Isi data dengan Benar, Data ini dipakai untuk keperluan Akademik anda sampai di Wisuda. Jika data yang anda masukkan tidak sesuai, Nomor Induk Mahasiswa anda tidak bisa didaftarkan ke Direktorat Pendidikan Tinggi (DIKTI).
    </div>

    <!-- Main Form Container -->
    <div class="bg-white border border-slate-200 shadow-sm flex flex-col p-4 md:p-6 space-y-8 md:space-y-12">
       
       <!-- BAGIAN 1: Foto & Biodata Dasar -->
       <div class="space-y-4">
          
          <div class="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-4 items-start">
             <div class="md:text-right text-slate-700 font-bold text-sm pt-2">File Foto</div>
             <div>
                <div class="w-32 h-40 bg-blue-600 border-4 border-white shadow-md relative overflow-hidden">
                   <img src="https://ui-avatars.com/api/?name=Mohamad+Reza&background=2563eb&color=fff&size=200" alt="Pas Foto" class="w-full h-full object-cover">
                </div>
             </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-4 items-start md:items-center">
             <div class="md:text-right text-slate-700 font-bold text-sm">Update Foto</div>
             <div class="flex flex-wrap items-center gap-2">
                <button class="px-3 py-1 border border-slate-300 rounded text-sm bg-slate-50 hover:bg-slate-100 flex items-center gap-2">
                   Update Pas Foto
                   <svg class="w-4 h-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                </button>
                <a href="#" class="text-sm text-blue-600 hover:underline break-all">Foto_20210910147_202506192021729.jpg</a>
             </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-4 items-start md:items-center">
             <div class="md:text-right text-slate-700 font-bold text-sm">NISN</div>
             <div>
                <input type="text" class="border border-slate-300 rounded px-3 py-1.5 w-full md:w-64 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                <div class="mt-1"><a href="#" class="text-xs text-blue-600 hover:underline font-bold">Cek NISN disini</a></div>
             </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-4 items-start md:items-center">
             <div class="md:text-right text-slate-700 font-bold text-sm">NIM</div>
             <div>
                <input type="text" readonly value="20210910147" class="border border-slate-200 bg-slate-100 rounded px-3 py-1.5 w-full md:w-64 text-sm text-slate-600">
             </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-4 items-start md:items-center">
             <div class="md:text-right text-slate-700 font-bold text-sm">Tahun Angkatan</div>
             <div>
                <select class="border border-slate-300 rounded px-3 py-1.5 w-full md:w-32 text-sm focus:outline-none focus:border-blue-500">
                   <option>2021</option>
                   <option>2022</option>
                   <option>2026</option>
                </select>
             </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-4 items-start md:items-center">
             <div class="md:text-right text-slate-700 font-bold text-sm">Email / Username</div>
             <div>
                <input type="email" value="reza.147@gmail.com" class="border border-slate-300 rounded px-3 py-1.5 w-full md:w-64 text-sm focus:outline-none focus:border-blue-500">
             </div>
          </div>
          
          <!-- Biodata Diri -->
          <div class="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-4 items-start md:items-center mt-8 pt-8 border-t border-slate-100">
             <div class="md:text-right text-slate-700 font-bold text-sm">Nama</div>
             <div>
                <input type="text" value="Mohamad Reza Nurpadilah" class="border border-slate-300 rounded px-3 py-1.5 w-full md:w-96 text-sm focus:outline-none focus:border-blue-500">
             </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-4 items-start md:items-center">
             <div class="md:text-right text-slate-700 font-bold text-sm">Tempat/Tanggal Lahir</div>
             <div class="flex flex-col sm:flex-row gap-2">
                <input type="text" value="Kuningan" class="border border-slate-300 rounded px-3 py-1.5 w-full sm:w-48 text-sm focus:outline-none focus:border-blue-500">
                <input type="date" value="2003-02-25" class="border border-slate-300 rounded px-3 py-1.5 w-full sm:w-40 text-sm focus:outline-none focus:border-blue-500">
             </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-4 items-start md:items-center">
             <div class="md:text-right text-slate-700 font-bold text-sm">Jenis Kelamin</div>
             <div>
                <select class="border border-slate-300 rounded px-3 py-1.5 w-full md:w-40 text-sm focus:outline-none focus:border-blue-500">
                   <option>Laki - Laki</option>
                   <option>Perempuan</option>
                </select>
             </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-4 items-start md:items-center">
             <div class="md:text-right text-slate-700 font-bold text-sm">Status</div>
             <div>
                <input type="text" value="Belum menikah" class="border border-slate-300 rounded px-3 py-1.5 w-full md:w-96 text-sm focus:outline-none focus:border-blue-500">
             </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-4 items-start md:items-center">
             <div class="md:text-right text-slate-700 font-bold text-sm">Agama</div>
             <div>
                <input type="text" value="Islam" class="border border-slate-300 rounded px-3 py-1.5 w-full md:w-96 text-sm focus:outline-none focus:border-blue-500">
             </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-4 items-start md:items-center">
             <div class="md:text-right text-slate-700 font-bold text-sm">NIK</div>
             <div>
                <input type="text" value="3208172502030006" class="border border-slate-300 rounded px-3 py-1.5 w-full md:w-96 text-sm focus:outline-none focus:border-blue-500">
             </div>
          </div>
          
       </div>

       <!-- BAGIAN 2: Alamat -->
       <div class="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-4 items-start pt-8 border-t border-slate-100">
          <div class="md:text-right text-slate-700 font-bold text-sm pt-2">Alamat</div>
          <div class="bg-slate-50 border border-slate-200 p-4 md:p-6 rounded-sm space-y-4">
             <div class="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-1 md:gap-4 items-start md:items-center">
                <div class="md:text-right text-slate-700 font-bold text-sm">Jalan</div>
                <input type="text" value="Bakom" class="border border-slate-300 rounded px-3 py-1.5 w-full max-w-md text-sm">
             </div>
             
             <div class="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-1 md:gap-4 items-start md:items-center">
                <div class="md:text-right text-slate-700 font-bold text-sm">RT</div>
                <div class="flex items-center gap-4">
                   <input type="text" value="32" class="border border-slate-300 rounded px-3 py-1.5 w-20 text-sm">
                   <span class="font-bold text-sm text-slate-700">RW</span>
                   <input type="text" value="05" class="border border-slate-300 rounded px-3 py-1.5 w-20 text-sm">
                </div>
             </div>

             <div class="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-1 md:gap-4 items-start md:items-center">
                <div class="md:text-right text-slate-700 font-bold text-sm">Dusun</div>
                <input type="text" value="Kopeng" class="border border-slate-300 rounded px-3 py-1.5 w-full max-w-md text-sm">
             </div>
             <div class="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-1 md:gap-4 items-start md:items-center">
                <div class="md:text-right text-slate-700 font-bold text-sm">Desa</div>
                <input type="text" value="Darma" class="border border-slate-300 rounded px-3 py-1.5 w-full max-w-md text-sm">
             </div>
             <div class="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-1 md:gap-4 items-start md:items-center">
                <div class="md:text-right text-slate-700 font-bold text-sm">Provinsi</div>
                <input type="text" value="Jawa Barat" class="border border-slate-300 rounded px-3 py-1.5 w-full max-w-md text-sm">
             </div>
             <div class="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-1 md:gap-4 items-start md:items-center">
                <div class="md:text-right text-slate-700 font-bold text-sm">Kabupaten</div>
                <input type="text" value="Kuningan" class="border border-slate-300 rounded px-3 py-1.5 w-full max-w-md text-sm">
             </div>
             <div class="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-1 md:gap-4 items-start md:items-center">
                <div class="md:text-right text-slate-700 font-bold text-sm">Kecamatan</div>
                <input type="text" value="Darma" class="border border-slate-300 rounded px-3 py-1.5 w-full max-w-md text-sm">
             </div>
             <div class="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-1 md:gap-4 items-start md:items-center">
                <div class="md:text-right text-slate-700 font-bold text-sm">Kode Pos</div>
                <input type="text" value="45562" class="border border-slate-300 rounded px-3 py-1.5 w-full md:w-32 text-sm">
             </div>
          </div>
       </div>

       <!-- BAGIAN 3: Kontak & Extra -->
       <div class="space-y-4 pt-8 border-t border-slate-100">
          <div class="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-4 items-start md:items-center">
             <div class="md:text-right text-slate-700 font-bold text-sm">No Telepon</div>
             <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <input type="text" class="border border-slate-300 rounded px-3 py-1.5 w-full sm:w-48 text-sm">
                <span class="font-bold text-sm text-slate-700 whitespace-nowrap">HP <span class="text-slate-400 font-normal ml-2">085703393787</span></span>
             </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-4 items-start md:items-center">
             <div class="md:text-right text-slate-700 font-bold text-sm">Jenis Tinggal</div>
             <input type="text" value="Bersama Orang Tua" class="border border-slate-300 rounded px-3 py-1.5 w-full max-w-md text-sm">
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-4 items-start md:items-center">
             <div class="md:text-right text-slate-700 font-bold text-sm">Transportasi ke Kampus</div>
             <input type="text" value="Motor" class="border border-slate-300 rounded px-3 py-1.5 w-full max-w-md text-sm">
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-4 items-start md:items-center">
             <div class="md:text-right text-slate-700 font-bold text-sm">Penerima KPS</div>
             <input type="text" value="Tidak" class="border border-slate-300 rounded px-3 py-1.5 w-full max-w-md text-sm">
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-4 items-start md:items-center">
             <div class="md:text-right text-slate-700 font-bold text-sm">Nomor KPS</div>
             <input type="text" class="border border-slate-300 rounded px-3 py-1.5 w-full max-w-md text-sm">
          </div>

          <div class="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-4 items-start md:items-center">
             <div class="md:text-right text-slate-700 font-bold text-sm">Pekerjaan</div>
             <input type="text" value="Tidak Bekerja" class="border border-slate-300 rounded px-3 py-1.5 w-full max-w-md text-sm">
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-4 items-start md:items-center">
             <div class="md:text-right text-slate-700 font-bold text-sm">Alamat Pekerjaan</div>
             <textarea rows="2" class="border border-slate-300 rounded px-3 py-1.5 w-full max-w-md text-sm resize-none"></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-4 items-start md:items-center">
             <div class="md:text-right text-slate-700 font-bold text-sm">Berat Badan</div>
             <div class="flex flex-wrap items-center gap-3 md:gap-6">
                <div class="flex items-center gap-2">
                   <input type="text" value="58" class="border border-slate-300 rounded px-3 py-1.5 w-20 text-sm">
                </div>
                <div class="flex items-center gap-2 md:gap-3">
                   <span class="font-bold text-sm text-slate-700">Tinggi</span>
                   <input type="text" value="170" class="border border-slate-300 rounded px-3 py-1.5 w-20 text-sm">
                </div>
                <div class="flex items-center gap-2 md:gap-3">
                   <span class="font-bold text-sm text-slate-700">Gol. Darah</span>
                   <input type="text" value="AB" class="border border-slate-300 rounded px-3 py-1.5 w-16 text-sm">
                </div>
             </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-4 items-start md:items-center">
             <div class="md:text-right text-slate-700 font-bold text-sm">Ukuran Jaket Almamater</div>
             <input type="text" value="L" class="border border-slate-300 rounded px-3 py-1.5 w-full max-w-md text-sm">
          </div>
       </div>

       <!-- BAGIAN 4: Pendidikan -->
       <div class="pt-8 border-t border-slate-200">
         <h2 class="text-base md:text-lg font-normal text-slate-800 mb-6 pb-2 border-b border-slate-100">Riwayat Pendidikan Calon Mahasiswa <span class="text-sm opacity-60 block sm:inline mt-1 sm:mt-0">(* Data Sekolah SMA / SMK / MA / Sederajat)</span></h2>
         
         <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-4 items-start md:items-center">
               <div class="md:text-right text-slate-700 font-bold text-sm">Jenis Sekolah</div>
               <input type="text" value="SMA" class="border border-slate-300 rounded px-3 py-1.5 w-full max-w-md text-sm">
            </div>
            <div class="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-4 items-start md:items-center">
               <div class="md:text-right text-slate-700 font-bold text-sm">Status Sekolah</div>
               <input type="text" value="Negeri" class="border border-slate-300 rounded px-3 py-1.5 w-full max-w-md text-sm">
            </div>
            <div class="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-4 items-start md:items-center">
               <div class="md:text-right text-slate-700 font-bold text-sm">Nama Sekolah</div>
               <div>
                  <input type="text" value="1 Kadugede" class="border border-slate-300 rounded px-3 py-1.5 w-full max-w-md text-sm">
                  <div class="text-xs text-slate-500 mt-1">* contoh : 1 Kuningan</div>
               </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-4 items-start md:items-center">
               <div class="md:text-right text-slate-700 font-bold text-sm">Jurusan</div>
               <div>
                  <input type="text" value="Ipa" class="border border-slate-300 rounded px-3 py-1.5 w-full max-w-md text-sm">
                  <div class="text-xs text-slate-500 mt-1">* contoh : IPA/IPS</div>
               </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-4 items-start md:items-center">
               <div class="md:text-right text-slate-700 font-bold text-sm">No. Ijazah</div>
               <input type="text" value="DN-02/M-SMA/K13/0047541" class="border border-slate-300 rounded px-3 py-1.5 w-full max-w-md text-sm">
            </div>
            <div class="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-4 items-start md:items-center">
               <div class="md:text-right text-slate-700 font-bold text-sm">Tanggal Ijazah</div>
               <input type="date" value="2021-05-04" class="border border-slate-300 rounded px-3 py-1.5 w-full md:w-48 text-sm text-slate-600">
            </div>
         </div>
       </div>

       <!-- Action Bar -->
       <div class="pt-8 border-t border-slate-200 flex justify-center md:justify-end">
          <button @click="simpanData" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded font-bold uppercase tracking-widest text-sm shadow-sm transition w-full md:w-auto">
             Simpan Perubahan
          </button>
       </div>

    </div>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2'

const simpanData = () => {
   Swal.fire({
      icon: 'success',
      title: 'Tersimpan!',
      text: 'Data administratif mahasiswa berhasil diperbarui.',
      confirmButtonColor: '#2563eb',
      timer: 2000
   })
}
</script>
