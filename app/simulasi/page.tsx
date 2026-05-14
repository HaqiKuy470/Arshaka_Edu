"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, Play } from "lucide-react";

export default function SimulationsPage() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const simulations = [
    // Fisika
    { id: "gerak-lurus", title: "Gerak Lurus (Kinematika)", cat: "Fisika", level: "SMP", color: "bg-blue-600" },
    { id: "gaya-gesek", title: "Gaya Gesek", cat: "Fisika", level: "SMA", color: "bg-amber-600" },
    { id: "gaya-gerak-dasar", title: "Gaya & Gerak Dasar", cat: "Fisika", level: "SD", color: "bg-violet-600" },
    { id: "keseimbangan-torsi", title: "Keseimbangan Torsi", cat: "Fisika", level: "SMA", color: "bg-orange-500" },
    { id: "gerak-melingkar", title: "Gerak Melingkar", cat: "Fisika", level: "SMA", color: "bg-green-600" },
    
    { id: "tumbukan", title: "Tumbukan & Momentum", cat: "Fisika", level: "SMA", color: "bg-red-600" },
    { id: "momentum-impuls", title: "Momentum & Impuls", cat: "Fisika", level: "SMA", color: "bg-indigo-600" },
    { id: "energi-skate-park", title: "Energi Skate Park", cat: "Fisika", level: "SMP", color: "bg-emerald-600" },
    { id: "pegas-hukum-hooke", title: "Pegas & Hukum Hooke", cat: "Fisika", level: "SMP", color: "bg-sky-600" },
    { id: "bandul-sederhana", title: "Bandul Sederhana", cat: "Fisika", level: "SMP", color: "bg-yellow-600" },
    
    { id: "tekanan-hidrostatis", title: "Tekanan Hidrostatis", cat: "Fisika", level: "SMP", color: "bg-cyan-600" },
    { id: "hukum-archimedes", title: "Hukum Archimedes", cat: "Fisika", level: "SMP", color: "bg-blue-600" },
    { id: "aliran-fluida", title: "Aliran Fluida", cat: "Fisika", level: "SMA", color: "bg-sky-500" },
    { id: "prinsip-bernoulli", title: "Prinsip Bernoulli", cat: "Fisika", level: "SMA", color: "bg-indigo-500" },
    { id: "tekanan-gas", title: "Teori Kinetik Gas Ideal", cat: "Fisika", level: "SMA", color: "bg-rose-600" },
    
    { id: "tegangan-permukaan", title: "Tegangan Permukaan", cat: "Fisika", level: "SMA", color: "bg-teal-500" },
    { id: "viskositas", title: "Viskositas (Kekentalan)", cat: "Fisika", level: "SMA", color: "bg-amber-500" },
    { id: "suhu-kalor", title: "Suhu & Kalor (Asas Black)", cat: "Fisika", level: "SMP", color: "bg-red-500" },
    { id: "perpindahan-panas", title: "Perpindahan Panas", cat: "Fisika", level: "SMP", color: "bg-orange-500" },
    { id: "perubahan-wujud-zat", title: "Perubahan Wujud Zat", cat: "Fisika", level: "SMP", color: "bg-blue-400" },
    
    { id: "hukum-gas-ideal", title: "Hukum Gas Ideal & Grafik", cat: "Fisika", level: "SMA", color: "bg-sky-500" },
    { id: "mesin-carnot", title: "Siklus Mesin Carnot", cat: "Fisika", level: "SMA", color: "bg-emerald-500" },
    { id: "entropi", title: "Entropi (Hukum II Termo)", cat: "Fisika", level: "SMA", color: "bg-zinc-500" },
    { id: "hukum-coulomb", title: "Hukum Coulomb", cat: "Fisika", level: "SMA", color: "bg-red-500" },
    { id: "muatan-medan-listrik", title: "Muatan & Medan Listrik", cat: "Fisika", level: "SMA", color: "bg-indigo-500" },
    
    { id: "potensial-listrik", title: "Potensial Listrik", cat: "Fisika", level: "SMA", color: "bg-fuchsia-500" },
    { id: "kapasitor", title: "Kapasitor Keping Sejajar", cat: "Fisika", level: "SMA", color: "bg-cyan-500" },
    { id: "hukum-ohm", title: "Hukum Ohm (V=IR)", cat: "Fisika", level: "SMP", color: "bg-rose-500" },
    { id: "rangkaian-ac", title: "Rangkaian Listrik AC", cat: "Fisika", level: "SMA", color: "bg-blue-500" },
    { id: "induksi-faraday", title: "Induksi Elektromagnetik", cat: "Fisika", level: "SMA", color: "bg-amber-500" },
    
    { id: "generator-motor", title: "Generator & Motor", cat: "Fisika", level: "SMA", color: "bg-red-600" },
    { id: "semikonduktor", title: "Semikonduktor (Dioda)", cat: "Fisika", level: "SMA", color: "bg-teal-600" },
    { id: "gelombang-suara", title: "Gelombang Suara", cat: "Fisika", level: "SMP", color: "bg-sky-400" },
    { id: "interferensi-gelombang", title: "Interferensi Gelombang", cat: "Fisika", level: "SMA", color: "bg-purple-500" },
    { id: "efek-doppler", title: "Efek Doppler", cat: "Fisika", level: "SMA", color: "bg-pink-600" },
    
    { id: "resonansi", title: "Resonansi", cat: "Fisika", level: "SMA", color: "bg-emerald-600" },
    { id: "pemantulan-pembiasan", title: "Pemantulan & Pembiasan", cat: "Fisika", level: "SMA", color: "bg-blue-600" },
    { id: "dispersi-cahaya", title: "Dispersi Cahaya (Prisma)", cat: "Fisika", level: "SMP", color: "bg-rose-500" },
    { id: "difraksi-cahaya", title: "Difraksi & Celah Ganda", cat: "Fisika", level: "SMA", color: "bg-violet-500" },
    { id: "polarisasi-cahaya", title: "Polarisasi Cahaya", cat: "Fisika", level: "SMA", color: "bg-cyan-600" },
    
    { id: "efek-fotolistrik", title: "Efek Fotolistrik", cat: "Fisika", level: "SMA", color: "bg-yellow-500" },
    { id: "model-atom", title: "Model Atom Bohr", cat: "Fisika", level: "SMA", color: "bg-indigo-500" },
    { id: "peluruhan-radioaktif", title: "Peluruhan Radioaktif", cat: "Fisika", level: "SMA", color: "bg-red-500" },
    { id: "fisi-fusi-nuklir", title: "Fisi & Fusi Nuklir", cat: "Fisika", level: "SMA", color: "bg-orange-500" },
    { id: "relativitas-khusus", title: "Relativitas Khusus", cat: "Fisika", level: "SMA", color: "bg-sky-500" },
    
    { id: "gelombang-tali", title: "Gelombang pada Tali", cat: "Fisika", level: "SMA", color: "bg-blue-500" },
    { id: "gerak-proyektil", title: "Gerak Proyektil", cat: "Fisika", level: "SMA", color: "bg-pink-500" },
    { id: "gravitasi-orbit", title: "Gravitasi & Orbit", cat: "Fisika", level: "SMA", color: "bg-yellow-500" },
    { id: "hukum-newton", title: "Hukum II Newton", cat: "Fisika", level: "SMP", color: "bg-violet-500" },
    { id: "optik-lensa", title: "Optik & Lensa", cat: "Fisika", level: "SMA", color: "bg-sky-500" },
    { id: "termodinamika", title: "Termodinamika Gas", cat: "Fisika", level: "SMA", color: "bg-red-500" },
    { id: "rangkaian-listrik", title: "Rangkaian Listrik", cat: "Fisika", level: "SMA", color: "bg-cyan-500" },
    { id: "medan-magnet", title: "Medan Magnet", cat: "Fisika", level: "SMP", color: "bg-indigo-500" },
    
    // Kimia
    { id: "penyeimbangan-persamaan", title: "Penyeimbangan Persamaan", cat: "Kimia", level: "SMP", color: "bg-emerald-500" },
    { id: "tabel-periodik", title: "Tabel Periodik Interaktif", cat: "Kimia", level: "SMP", color: "bg-orange-500" },
    { id: "asam-basa", title: "Asam & Basa (pH)", cat: "Kimia", level: "SMA", color: "bg-rose-500" },
    { id: "reaksi-kimia", title: "Reaksi Kimia Dasar", cat: "Kimia", level: "SMA", color: "bg-purple-500" },
    { id: "struktur-atom", title: "Struktur Atom", cat: "Kimia", level: "SMP", color: "bg-indigo-400" },
    { id: "ikatan-kimia", title: "Ikatan Kimia", cat: "Kimia", level: "SMA", color: "bg-teal-500" },
    
    { id: "konfigurasi-elektron", title: "Konfigurasi Elektron", cat: "Kimia", level: "SMA", color: "bg-cyan-500" },
    { id: "ion-isotop", title: "Ion & Isotop", cat: "Kimia", level: "SMA", color: "bg-pink-500" },
    { id: "bentuk-molekul", title: "Bentuk Molekul (VSEPR)", cat: "Kimia", level: "SMA", color: "bg-purple-600" },
    { id: "polaritas-molekul", title: "Polaritas Molekul", cat: "Kimia", level: "SMA", color: "bg-red-500" },
    { id: "gaya-antarmolekul", title: "Gaya Antarmolekul", cat: "Kimia", level: "SMA", color: "bg-sky-500" },
    
    { id: "stoikiometri", title: "Stoikiometri Dasar", cat: "Kimia", level: "SMA", color: "bg-orange-600" },
    { id: "laju-reaksi", title: "Laju Reaksi", cat: "Kimia", level: "SMA", color: "bg-yellow-500" },
    { id: "kesetimbangan-kimia", title: "Kesetimbangan Kimia", cat: "Kimia", level: "SMA", color: "bg-emerald-500" },
    { id: "elektrokimia", title: "Elektrokimia", cat: "Kimia", level: "SMA", color: "bg-blue-600" },
    { id: "titrasi-asam-basa", title: "Titrasi Asam-Basa", cat: "Kimia", level: "SMA", color: "bg-pink-600" },
    
    { id: "sifat-koligatif", title: "Sifat Koligatif Larutan", cat: "Kimia", level: "SMA", color: "bg-cyan-500" },
    { id: "koloid-suspensi", title: "Koloid & Suspensi", cat: "Kimia", level: "SMA", color: "bg-yellow-600" },
    { id: "gugus-fungsi", title: "Gugus Fungsi Organik", cat: "Kimia", level: "SMA", color: "bg-purple-500" },
    { id: "polimer", title: "Reaksi Polimerisasi", cat: "Kimia", level: "SMA", color: "bg-emerald-600" },
    
    // Matematika
    { id: "operasi-bilangan", title: "Operasi Bilangan", cat: "Matematika", level: "SD", color: "bg-blue-500" },
    { id: "pecahan-desimal", title: "Pecahan & Desimal", cat: "Matematika", level: "SD", color: "bg-sky-500" },
    { id: "garis-bilangan", title: "Garis Bilangan (Bulat)", cat: "Matematika", level: "SMP", color: "bg-emerald-500" },
    { id: "faktor-kelipatan", title: "FPB & KPK", cat: "Matematika", level: "SMP", color: "bg-rose-500" },
    { id: "teorema-pythagoras", title: "Teorema Pythagoras", cat: "Matematika", level: "SMP", color: "bg-purple-600" },
    
    { id: "sistem-persamaan", title: "Sistem Persamaan Linear", cat: "Matematika", level: "SMP", color: "bg-indigo-500" },
    { id: "kesebangunan", title: "Kesebangunan & Kongruen", cat: "Matematika", level: "SMP", color: "bg-amber-500" },
    { id: "fungsi-kuadrat", title: "Fungsi Kuadrat & Parabola", cat: "Matematika", level: "SMA", color: "bg-emerald-600" },
    { id: "eksponen-logaritma", title: "Eksponen & Logaritma", cat: "Matematika", level: "SMA", color: "bg-pink-500" },
    { id: "komposisi-fungsi", title: "Komposisi Fungsi", cat: "Matematika", level: "SMA", color: "bg-orange-500" },
    
    { id: "grafik-fungsi", title: "Grafik Fungsi", cat: "Matematika", level: "SMA", color: "bg-emerald-500" },
    { id: "geometri-interaktif", title: "Geometri 2D Interaktif", cat: "Matematika", level: "SD", color: "bg-sky-400" },
    { id: "kubus", title: "Bangun Ruang: Kubus", cat: "Matematika", level: "SD", color: "bg-sky-500" },
    { id: "balok", title: "Bangun Ruang: Balok", cat: "Matematika", level: "SD", color: "bg-emerald-500" },
    { id: "tabung", title: "Bangun Ruang: Tabung", cat: "Matematika", level: "SMP", color: "bg-violet-500" },
    { id: "kerucut", title: "Bangun Ruang: Kerucut", cat: "Matematika", level: "SMP", color: "bg-rose-500" },
    { id: "bola", title: "Bangun Ruang: Bola", cat: "Matematika", level: "SMP", color: "bg-yellow-500" },
    { id: "kalkulus-visual", title: "Kalkulus Visual", cat: "Matematika", level: "SMA", color: "bg-fuchsia-500" },
    { id: "statistik-probabilitas", title: "Statistik & Probabilitas", cat: "Matematika", level: "SMP", color: "bg-blue-600" },
    { id: "matriks-transformasi", title: "Matriks & Transformasi", cat: "Matematika", level: "SMA", color: "bg-violet-600" },
    { id: "aljabar-linear", title: "Aljabar Linear", cat: "Matematika", level: "SMA", color: "bg-rose-400" },
    { id: "trigonometri", title: "Trigonometri", cat: "Matematika", level: "SMA", color: "bg-yellow-400" },
    
    { id: "peluang-dasar", title: "Peluang & Distribusi Binomial", cat: "Matematika", level: "SMP", color: "bg-indigo-500" },
    { id: "vektor-visual", title: "Vektor 2D", cat: "Matematika", level: "SMA", color: "bg-teal-500" },
    { id: "bilangan-kompleks", title: "Bidang Argand (Bil. Kompleks)", cat: "Matematika", level: "SMA", color: "bg-purple-500" },
    { id: "barisan-deret", title: "Barisan & Deret", cat: "Matematika", level: "SMA", color: "bg-rose-600" },
    
    // Biologi
    { id: "sel-organel", title: "Anatomi Sel & Organel", cat: "Biologi", level: "SMP", color: "bg-emerald-600" },
    { id: "fotosintesis", title: "Proses Fotosintesis", cat: "Biologi", level: "SMP", color: "bg-lime-500" },
    { id: "genetika-dna", title: "Hukum Mendel & DNA", cat: "Biologi", level: "SMA", color: "bg-rose-500" },
    { id: "ekosistem", title: "Keseimbangan Ekosistem", cat: "Biologi", level: "SD", color: "bg-teal-600" },
    { id: "tubuh-manusia", title: "Sistem Tubuh Manusia", cat: "Biologi", level: "SMP", color: "bg-red-500" },
    { id: "evolusi", title: "Seleksi Alam & Evolusi", cat: "Biologi", level: "SMA", color: "bg-orange-600" },
    { id: "reproduksi-sel", title: "Reproduksi Sel (Mitosis)", cat: "Biologi", level: "SMA", color: "bg-indigo-500" },
    
    { id: "transpor-membran", title: "Transpor Membran Sel", cat: "Biologi", level: "SMA", color: "bg-cyan-500" },
    { id: "respirasi-seluler", title: "Respirasi Seluler", cat: "Biologi", level: "SMA", color: "bg-emerald-500" },
    { id: "sintesis-protein", title: "Sintesis Protein", cat: "Biologi", level: "SMA", color: "bg-fuchsia-500" },
    { id: "sistem-saraf", title: "Sistem Saraf & Impuls", cat: "Biologi", level: "SMA", color: "bg-yellow-500" },
    { id: "efek-rumah-kaca", title: "Efek Rumah Kaca & Iklim", cat: "Biologi", level: "SMP", color: "bg-orange-500" },
    
    { id: "mutasi-genetik", title: "Mutasi Genetik", cat: "Biologi", level: "SMA", color: "bg-rose-600" },
    { id: "sistem-peredaran-darah", title: "Sistem Peredaran Darah", cat: "Biologi", level: "SMP", color: "bg-red-500" },
    { id: "sistem-pernapasan", title: "Sistem Pernapasan", cat: "Biologi", level: "SMP", color: "bg-sky-500" },
    { id: "sistem-pencernaan", title: "Sistem Pencernaan", cat: "Biologi", level: "SMP", color: "bg-amber-600" },
    { id: "sistem-imun", title: "Sistem Imun (Pertahanan)", cat: "Biologi", level: "SMA", color: "bg-purple-600" },
    
    { id: "pohon-filogenetik", title: "Pohon Filogenetik (Evolusi)", cat: "Biologi", level: "SMA", color: "bg-emerald-700" },
    { id: "sistem-hormon", title: "Sistem Endokrin (Hormon)", cat: "Biologi", level: "SMA", color: "bg-fuchsia-600" },
    { id: "sistem-ekskresi", title: "Sistem Ekskresi (Ginjal)", cat: "Biologi", level: "SMP", color: "bg-rose-500" },
    { id: "siklus-biogeokimia", title: "Siklus Biogeokimia", cat: "Biologi", level: "SMP", color: "bg-blue-500" },
    { id: "dinamika-populasi", title: "Dinamika Populasi", cat: "Biologi", level: "SMA", color: "bg-teal-600" },
    
    // Geografi / Ilmu Bumi
    { id: "struktur-bumi", title: "Struktur Lapisan Bumi", cat: "Ilmu Bumi", level: "SMP", color: "bg-orange-700" },
    { id: "tektonik-lempeng", title: "Tektonik Lempeng", cat: "Ilmu Bumi", level: "SMP", color: "bg-zinc-600" },
    { id: "gunung-berapi", title: "Gunung Berapi & Erupsi", cat: "Ilmu Bumi", level: "SMP", color: "bg-red-600" },
    { id: "siklus-batuan", title: "Siklus Batuan", cat: "Ilmu Bumi", level: "SMA", color: "bg-amber-700" },
    { id: "lapisan-atmosfer", title: "Lapisan Atmosfer", cat: "Ilmu Bumi", level: "SMP", color: "bg-sky-600" },
    
    { id: "gempa-bumi", title: "Gempa & Seismik", cat: "Ilmu Bumi", level: "SMP", color: "bg-red-500" },
    { id: "siklus-air", title: "Siklus Air (Hidrologi)", cat: "Ilmu Bumi", level: "SD", color: "bg-blue-400" },
    { id: "cuaca-iklim", title: "Cuaca & Iklim", cat: "Ilmu Bumi", level: "SMP", color: "bg-yellow-500" },
    { id: "arus-laut", title: "Arus Laut Global", cat: "Ilmu Bumi", level: "SMA", color: "bg-indigo-600" },
    { id: "zona-waktu", title: "Zona Waktu Dunia", cat: "Ilmu Bumi", level: "SMP", color: "bg-slate-700" },
    
    // Bahasa & Linguistik
    { id: "struktur-kalimat", title: "Struktur Kalimat (SPOK)", cat: "Bahasa", level: "SD", color: "bg-emerald-600" },
    { id: "jenis-kata", title: "Jenis-Jenis Kata", cat: "Bahasa", level: "SMP", color: "bg-blue-600" },
    { id: "majas-gaya-bahasa", title: "Majas & Gaya Bahasa", cat: "Bahasa", level: "SMP", color: "bg-purple-600" },
    { id: "sintaksis", title: "Sintaksis (Pohon Frasa)", cat: "Bahasa", level: "Kuliah", color: "bg-rose-600" },
    { id: "fonetik-pengucapan", title: "Fonetik (Bunyi Vokal)", cat: "Bahasa", level: "SMA", color: "bg-amber-600" },
    
    { id: "ejaan-tanda-baca", title: "Klinik Ejaan (PUEBI)", cat: "Bahasa", level: "SD", color: "bg-red-500" },
    { id: "paragraf-wacana", title: "Struktur Paragraf", cat: "Bahasa", level: "SMP", color: "bg-emerald-500" },
    { id: "teks-genre", title: "Analisis Genre Teks", cat: "Bahasa", level: "SMP", color: "bg-cyan-600" },
    { id: "peta-kata", title: "Relasi Makna Kata", cat: "Bahasa", level: "SMP", color: "bg-teal-500" },
    { id: "morfologi", title: "Morfologi (Pembentukan Kata)", cat: "Bahasa", level: "SMA", color: "bg-orange-500" },
    
    // Ekonomi & Akuntansi
    { id: "penawaran-permintaan", title: "Supply & Demand", cat: "Ekonomi", level: "SMA", color: "bg-blue-600" },
    { id: "inflasi-deflasi", title: "Inflasi & Deflasi", cat: "Ekonomi", level: "SMA", color: "bg-red-600" },
    { id: "persamaan-akuntansi", title: "Persamaan Akuntansi", cat: "Ekonomi", level: "SMA", color: "bg-emerald-600" },
    { id: "simulasi-saham", title: "Simulasi Pasar Saham", cat: "Ekonomi", level: "Kuliah", color: "bg-amber-500" },
    { id: "kebijakan-fiskal-moneter", title: "Fiskal & Moneter", cat: "Ekonomi", level: "Kuliah", color: "bg-indigo-600" },
    
    { id: "elastisitas", title: "Elastisitas Harga", cat: "Ekonomi", level: "SMA", color: "bg-purple-600" },
    { id: "struktur-pasar", title: "Struktur Pasar", cat: "Ekonomi", level: "SMA", color: "bg-rose-600" },
    { id: "siklus-akuntansi", title: "Siklus Akuntansi", cat: "Ekonomi", level: "SMA", color: "bg-cyan-600" },
    { id: "pajak-dasar", title: "Kalkulator PPh 21", cat: "Ekonomi", level: "SMA", color: "bg-teal-500" },
    { id: "nilai-waktu-uang", title: "Nilai Waktu Uang", cat: "Ekonomi", level: "SMA", color: "bg-yellow-600" },
    
    // Sejarah & IPS
    { id: "sejarah-indonesia", title: "Linimasa Sejarah NKRI", cat: "Sejarah", level: "SD", color: "bg-red-600" },
    { id: "kerajaan-nusantara", title: "Peta Kerajaan Nusantara", cat: "Sejarah", level: "SMP", color: "bg-amber-700" },
    { id: "perjuangan-kemerdekaan", title: "Detik Proklamasi 1945", cat: "Sejarah", level: "SMP", color: "bg-rose-600" },
    { id: "peradaban-kuno", title: "Peradaban Kuno Dunia", cat: "Sejarah", level: "SMA", color: "bg-amber-600" },
    { id: "perang-dunia", title: "Perang Dunia I & II", cat: "Sejarah", level: "SMA", color: "bg-stone-700" },
    
    { id: "sistem-pemerintahan", title: "Sistem Pemerintahan", cat: "Sejarah", level: "SMA", color: "bg-indigo-600" },
    { id: "demokrasi-pemilu", title: "Demokrasi & Pemilu", cat: "Sejarah", level: "SMP", color: "bg-blue-600" },
    { id: "lembaga-negara", title: "Lembaga Negara", cat: "Sejarah", level: "SMP", color: "bg-emerald-600" },
    { id: "interaksi-sosial", title: "Interaksi Sosil", cat: "Sejarah", level: "SMP", color: "bg-purple-600" },
    { id: "mobilitas-sosial", title: "Mobilitas Sosial", cat: "Sejarah", level: "SMA", color: "bg-cyan-600" },
    
    // Teknologi & Informatika
    { id: "algoritma-flowchart", title: "Algoritma & Flowchart", cat: "Teknologi", level: "SMP", color: "bg-emerald-600" },
    { id: "sorting-visual", title: "Sorting Visualizer", cat: "Teknologi", level: "SMA", color: "bg-rose-600" },
    { id: "searching-visual", title: "Searching Visualizer", cat: "Teknologi", level: "SMA", color: "bg-blue-600" },
    { id: "struktur-data", title: "Struktur Data (Array, Stack, Queue)", cat: "Teknologi", level: "SMA", color: "bg-purple-600" },
    { id: "rekursi", title: "Visualisasi Rekursi", cat: "Teknologi", level: "Kuliah", color: "bg-amber-600" },
    
    { id: "kompleksitas-algoritma", title: "Big O Notation", cat: "Teknologi", level: "Kuliah", color: "bg-rose-700" },
    { id: "jaringan-komputer", title: "LAN & WAN", cat: "Teknologi", level: "SMA", color: "bg-emerald-700" },
    { id: "model-osi", title: "OSI Layer", cat: "Teknologi", level: "SMA", color: "bg-fuchsia-600" },
    { id: "dns-http", title: "DNS & HTTP Request", cat: "Teknologi", level: "SMA", color: "bg-blue-700" },
    { id: "keamanan-jaringan", title: "Cybersecurity Dasar", cat: "Teknologi", level: "SMA", color: "bg-red-600" },
    
    { id: "sistem-bilangan", title: "Biner & Hexadesimal", cat: "Teknologi", level: "SMP", color: "bg-purple-600" },
    { id: "gerbang-logika", title: "Gerbang Logika", cat: "Teknologi", level: "SMA", color: "bg-blue-500" },
    { id: "arsitektur-cpu", title: "Arsitektur CPU", cat: "Teknologi", level: "SMA", color: "bg-zinc-700" },
    { id: "machine-learning", title: "Neural Network (AI)", cat: "Teknologi", level: "Kuliah", color: "bg-blue-800" },
    { id: "visualisasi-data", title: "Visualisasi Data", cat: "Teknologi", level: "SMA", color: "bg-emerald-600" },
    
    // Seni & Budaya
    { id: "teori-warna", title: "Teori Warna RGB & CMYK", cat: "Seni", level: "SMP", color: "bg-fuchsia-600" },
    { id: "perspektif-seni", title: "Perspektif Ruang", cat: "Seni", level: "SMA", color: "bg-orange-600" },
    { id: "komposisi-desain", title: "Komposisi Desain", cat: "Seni", level: "SMA", color: "bg-rose-600" },
    { id: "desain-batik", title: "Desain Batik Nusantara", cat: "Seni", level: "SMP", color: "bg-amber-700" },
    { id: "seni-ukir", title: "Seni Ukir Tradisional", cat: "Seni", level: "SMP", color: "bg-[#8b5a2b]" },
    
    { id: "not-ritme", title: "Not & Ritme Musik", cat: "Seni", level: "SMP", color: "bg-blue-600" },
    { id: "tangga-nada", title: "Tangga Nada (Scales)", cat: "Seni", level: "SMA", color: "bg-emerald-600" },
    { id: "gelombang-timbre", title: "Fisika Warna Suara", cat: "Seni", level: "SMA", color: "bg-amber-500" },
    { id: "alat-musik-tradisional", title: "Instrumen Nusantara", cat: "Seni", level: "SMP", color: "bg-yellow-700" },
    { id: "budaya-tari-wayang", title: "Tari & Pertunjukan", cat: "Seni", level: "SD", color: "bg-red-700" },
    
    // Astronomi & Bumi
    { id: "tata-surya", title: "Tata Surya 3D", cat: "Ilmu Bumi", level: "SMP", color: "bg-yellow-500" },
    { id: "fase-bulan", title: "Siklus Fase Bulan", cat: "Ilmu Bumi", level: "SMP", color: "bg-zinc-600" },
    { id: "gerhana", title: "Gerhana Matahari & Bulan", cat: "Ilmu Bumi", level: "SMP", color: "bg-orange-700" },
    { id: "siklus-bintang", title: "Siklus Hidup Bintang", cat: "Ilmu Bumi", level: "SMA", color: "bg-cyan-700" },
    { id: "galaksi-alam-semesta", title: "Skala Alam Semesta", cat: "Ilmu Bumi", level: "SMA", color: "bg-fuchsia-800" },
    
    { id: "pasang-surut", title: "Gravitasi Bulan (Pasang Surut)", cat: "Ilmu Bumi", level: "SMP", color: "bg-blue-800" },
    { id: "rotasi-bumi", title: "Rotasi & Revolusi Bumi", cat: "Ilmu Bumi", level: "SD", color: "bg-green-700" },
    { id: "asteroid-meteor", title: "Asteroid & Hujan Meteor", cat: "Ilmu Bumi", level: "SMP", color: "bg-amber-600" },
    { id: "teleskop-spektrum", title: "Spektrum Cahaya (Teleskop)", cat: "Ilmu Bumi", level: "SMA", color: "bg-purple-800" },
    { id: "zona-layak-huni", title: "Zona Layak Huni (Goldilocks)", cat: "Ilmu Bumi", level: "SMA", color: "bg-emerald-500" },
    
    // Psikologi & Kesehatan
    { id: "ilusi-optik", title: "Persepsi & Ilusi Optik", cat: "Biologi", level: "SMP", color: "bg-indigo-600" },
    { id: "memori-belajar", title: "Uji Memori Jangka Pendek", cat: "Biologi", level: "SMA", color: "bg-blue-700" },
    { id: "emosi-mental", title: "Emosi & Kesehatan Mental", cat: "Biologi", level: "SMP", color: "bg-rose-700" },
    { id: "kalkulator-imt", title: "Kalkulator IMT & Gizi", cat: "Biologi", level: "SMP", color: "bg-emerald-600" },
    { id: "simulasi-p3k", title: "Pertolongan Pertama (P3K)", cat: "Biologi", level: "SD", color: "bg-red-600" },
  ];

  const categories = ["Semua", "Fisika", "Kimia", "Matematika", "Biologi", "Ilmu Bumi", "Bahasa", "Ekonomi", "Sejarah", "Teknologi", "Seni"];

  const filteredSimulations = simulations.filter(sim => {
    const matchesCat = activeCategory === "Semua" || sim.cat === activeCategory;
    const matchesSearch = sim.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Katalog Simulasi</h1>
          <p className="text-zinc-400 max-w-2xl text-lg">Pilih laboratorium virtual yang ingin Anda jalankan.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Cari simulasi..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex flex-wrap gap-2 mb-10 border-b border-white/5 pb-6">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5 hover:border-white/20'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredSimulations.map((sim) => (
          <Link key={sim.id} href={`/simulasi/${sim.id}`} className="group glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
            <div className="aspect-video bg-zinc-900 relative overflow-hidden">
              <div className={`absolute inset-0 opacity-20 ${sim.color} group-hover:opacity-30 transition-opacity`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-12 h-12 rounded-full glass flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Play className="w-5 h-5 text-white ml-1" />
                </div>
              </div>
            </div>
            <div className="p-5 bg-black/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">{sim.cat}</span>
                <span className="text-xs font-medium bg-white/10 px-2 py-0.5 rounded text-zinc-300">{sim.level}</span>
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">{sim.title}</h3>
            </div>
          </Link>
        ))}
      </div>
      
      {filteredSimulations.length === 0 && (
        <div className="py-20 text-center text-zinc-500">
          Tidak ada simulasi yang cocok dengan pencarian "{searchQuery}".
        </div>
      )}
    </div>
  );
}
