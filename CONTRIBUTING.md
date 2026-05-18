# 🎓 Panduan Kontribusi — Arshaka Edu

Pertama-tama, terima kasih banyak telah meluangkan waktu untuk ikut serta berkontribusi di **Arshaka Edu**! Kami sangat senang menyambut pengembang, desainer, guru, dan penggiat pendidikan yang ingin bersama-sama mendemokratisasikan pendidikan sains interaktif berkualitas di Indonesia.

Dengan berkontribusi, Anda turut membantu jutaan anak bangsa memahami konsep sains yang abstrak secara visual dan menyenangkan!

---

## 🎯 Cara Anda Bisa Membantu

Kami menyambut kontribusi dalam berbagai bentuk:

1. **Pembuatan Simulasi Baru**: Merancang modul simulasi interaktif baru untuk Fisika, Kimia, Matematika, Biologi, atau mata pelajaran lainnya menggunakan React & Canvas/Tailwind.
2. **Perbaikan Bug**: Menemukan masalah responsivitas, kesalahan formula matematika, atau bug performa dan memperbaikinya.
3. **Peningkatan UI/UX**: Menyempurnakan transisi animasi, mempercantik palet warna mode terang & gelap, atau meningkatkan aksesibilitas.
4. **Dokumentasi & Lokalisasi**: Menambahkan dokumentasi modul atau menyempurnakan terjemahan istilah sains.

---

## 🚀 Alur Kerja Kontribusi (Workflow)

Ikuti langkah-langkah di bawah ini untuk mulai berkontribusi:

### 1. Fork Repositori
Lakukan fork terhadap repositori utama **Arshaka Edu** ke akun GitHub Anda:
* Kunjungi repositori: [GitHub Arshaka Edu](https://github.com/HaqiKuy470/Arshaka_Edu)
* Klik tombol **Fork** di pojok kanan atas.

### 2. Kloning & Pengaturan Lokal
Kloning repositori hasil fork Anda ke perangkat lokal Anda:
```bash
git clone https://github.com/USERNAME-ANDA/Arshaka_Edu.git
cd Arshaka_Edu
```

Instal seluruh dependensi proyek:
```bash
npm install
```

Jalankan server pengembangan lokal:
```bash
npm run dev
```
Buka `http://localhost:3000` di browser Anda untuk melihat aplikasi berjalan.

### 3. Buat Branch Baru
Selalu buat branch baru yang deskriptif sebelum menulis kode:
```bash
git checkout -b feature/simulasi-[nama-topik]
# atau jika memperbaiki bug
git checkout -b bugfix/perbaikan-[deskripsi-bug]
```

### 4. Menulis Kode
Saat menulis kode, harap perhatikan **Standar Kode** berikut:
* **TypeScript & React**: Seluruh berkas komponen baru wajib menggunakan TypeScript (`.tsx` atau `.ts`).
* **Struktur File**: 
  * Letakkan logika simulasi interaktif utama di dalam folder `@/simulations/[kategori]/[NamaSimulasi].tsx`.
  * Daftarkan simulasi baru Anda di dalam katalog berkas `app/simulasi/page.tsx`.
* **Aestetika**: Gunakan Tailwind CSS dengan tema variabel HSL dinamis. Pastikan simulasi Anda mendukung Mode Gelap (*Dark Mode*) dan Mode Terang (*Light Mode*) dengan transisi visual yang premium.
* **Performa**: Optimalkan siklus render. Jika simulasi menggunakan grafis berat, gunakan `<canvas>` dengan `requestAnimationFrame` secara terisolasi.

### 5. Lakukan Commit
Tulis pesan commit yang ringkas dan jelas dalam bahasa Indonesia atau Inggris:
```bash
git commit -m "feat: menambah simulasi hukum hooke untuk fisika"
```

### 6. Push & Ajukan Pull Request (PR)
Kirim branch Anda ke GitHub hasil fork:
```bash
git push origin feature/simulasi-[nama-topik]
```
* Buka halaman repositori asli [HaqiKuy470/Arshaka_Edu](https://github.com/HaqiKuy470/Arshaka_Edu).
* Anda akan melihat tombol **Compare & Pull Request**. Klik tombol tersebut.
* Berikan penjelasan detail mengenai perubahan atau penambahan fitur yang Anda lakukan, lalu kirimkan PR Anda.

---

## 🛡️ Aturan Komunitas

Demi menjaga kenyamanan dan inklusivitas ruang kolaborasi ini:
* Bersikaplah ramah, menghargai masukan, dan bersedia menerima ulasan kode (*code review*).
* Dilarang keras menyalin materi atau kode yang memiliki hak cipta komersial tertutup milik platform lain.
* Seluruh karya kontribusi yang Anda ajukan akan dilisensikan di bawah lisensi terbuka platform Arshaka Edu agar dapat diakses gratis selamanya oleh seluruh siswa di Indonesia.

Sekali lagi, terima kasih atas kontribusi Anda. **Mari bersama-sama memajukan pendidikan Indonesia!** 🇮🇩🚀🎓
