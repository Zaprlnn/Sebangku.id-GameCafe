# Cafe.Sebangku.id - Sebangku Board Game Cafe App

[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB.svg?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC.svg?style=flat&logo=tailwindcss)](https://tailwindcss.com/)

Aplikasi Capstone untuk **Sebangku Board Game Cafe** (`cafe.sebangku.id`). Platform ini dirancang untuk mempermudah interaksi pelanggan dengan layanan cafe, mulai dari pemesanan menu hidangan, pencarian board game interaktif, hingga program loyalitas pelanggan yang gamified.

---

## 🚀 Fitur Utama

Aplikasi ini terbagi menjadi area publik dan area aplikasi pelanggan (Customer App) terproteksi/interaktif:

### 🌐 Fitur Publik / Onboarding
*   **Landing Page**: Halaman utama yang interaktif memperkenalkan Sebangku Board Game Cafe, menu andalan, koleksi board game, dan program loyalitas.
*   **QR Scan Page**: Halaman pemindaian cepat untuk memindai kode QR meja di cafe.
*   **Onboarding & Auth Flow**: Alur onboarding interaktif serta sistem registrasi dan login pelanggan.

### 📱 Customer App
*   **Beranda (Dashboard)**: Informasi personalia, poin loyalitas, tantangan aktif, dan akses cepat ke layanan cafe.
*   **Menu Pemesanan**: Katalog menu makanan, minuman, dan penyewaan board game dengan sistem keranjang belanja (Cart) dan konfirmasi pesanan (Order Confirmation).
*   **Katalog Board Games**: Pencarian, rekomendasi, dan panduan bermain board game yang tersedia di cafe.
*   **Loyalty & Rewards**: Program pengumpulan poin loyalitas yang dapat ditukarkan dengan berbagai penawaran menarik dan reward khusus.
*   **Challenges & Quests**: Aktivitas gamifikasi interaktif yang memberikan tantangan unik kepada pelanggan untuk mendapatkan poin ekstra.
*   **Profile**: Pengaturan akun, histori aktivitas, dan preferensi pelanggan.

---

## 🛠️ Tech Stack & Library

*   **Framework Utama**: React 19 (TypeScript)
*   **Build Tool**: Vite 6
*   **Styling & UI**: TailwindCSS 4, Radix UI (Primitives), Lucide React (Icons), Motion (Animations)
*   **Routing**: React Router 7
*   **State & Utilities**: Class Variance Authority (CVA), Clsx, Tailwind Merge

---

## 📦 Panduan Instalasi dan Pengoperasian

Pastikan Anda telah menginstal **Node.js** di sistem Anda.

### 1. Kloning Repositori
```bash
git clone <repository-url>
cd Cafe.Sebangku.id
```

### 2. Instalasi Dependensi
Gunakan npm untuk menginstal library pendukung:
```bash
npm install
```

### 3. Menjalankan Server Pengembangan
Jalankan perintah berikut untuk mengoperasikan server lokal:
```bash
npm run dev
```
Buka browser dan akses [http://localhost:5173](http://localhost:5173).

### 4. Build untuk Produksi
Untuk melakukan build aplikasi siap pasang di server produksi:
```bash
npm run build
```

---

## 📂 Struktur Direktori

```text
src/
├── assets/          # Aset gambar, ikon, dan file statis lainnya
├── components/      # Komponen UI global (Button, Input, Card, dll.)
├── context/         # React Context untuk state management global
├── hooks/           # Custom React hooks
├── layouts/         # Layout utama halaman (seperti CustomerAppLayout)
├── lib/             # Konfigurasi utility library (seperti utils untuk styling)
├── pages/           # Halaman/modul aplikasi
│   ├── app/         # Modul Customer App (Beranda, Menu, Games, Loyalty, dll.)
│   ├── auth/        # Halaman Login dan Register
│   ├── landing/     # Halaman landing utama publik
│   ├── onboarding/  # Alur pengenalan aplikasi
│   └── scan/        # Modul pemindaian QR Code meja
├── routes/          # Konfigurasi routing aplikasi menggunakan React Router 7
└── styles/          # File styling CSS global
```   