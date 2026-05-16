"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  Play, 
  Filter, 
  Monitor, 
  Activity, 
  Layers, 
  MousePointer2,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Data ---
const SIMULATIONS = [
  // Fisika
  { id: "gerak-lurus", title: "Gerak Lurus (Kinematika)", cat: "Fisika", color: "from-blue-600 to-cyan-400" },
  { id: "gaya-gesek", title: "Gaya Gesek", cat: "Fisika", color: "from-amber-600 to-orange-400" },
  { id: "gaya-gerak-dasar", title: "Gaya & Gerak Dasar", cat: "Fisika", color: "from-violet-600 to-indigo-400" },
  { id: "keseimbangan-torsi", title: "Keseimbangan Torsi", cat: "Fisika", color: "from-orange-500 to-red-400" },
  { id: "gerak-melingkar", title: "Gerak Melingkar", cat: "Fisika", color: "from-green-600 to-emerald-400" },
  { id: "tumbukan", title: "Tumbukan & Momentum", cat: "Fisika", color: "from-red-600 to-rose-400" },
  { id: "momentum-impuls", title: "Momentum & Impuls", cat: "Fisika", color: "from-indigo-600 to-blue-400" },
  { id: "energi-skate-park", title: "Energi Skate Park", cat: "Fisika", color: "from-emerald-600 to-teal-400" },
  { id: "pegas-hukum-hooke", title: "Pegas & Hukum Hooke", cat: "Fisika", color: "from-sky-600 to-blue-400" },
  { id: "bandul-sederhana", title: "Bandul Sederhana", cat: "Fisika", color: "from-yellow-600 to-amber-400" },
  { id: "tekanan-hidrostatis", title: "Tekanan Hidrostatis", cat: "Fisika", color: "from-cyan-600 to-sky-400" },
  { id: "hukum-archimedes", title: "Hukum Archimedes", cat: "Fisika", color: "from-blue-600 to-indigo-400" },
  { id: "aliran-fluida", title: "Aliran Fluida", cat: "Fisika", color: "from-sky-500 to-cyan-400" },
  { id: "prinsip-bernoulli", title: "Prinsip Bernoulli", cat: "Fisika", color: "from-indigo-500 to-blue-400" },
  { id: "tekanan-gas", title: "Teori Kinetik Gas Ideal", cat: "Fisika", color: "from-rose-600 to-red-400" },
  { id: "tegangan-permukaan", title: "Tegangan Permukaan", cat: "Fisika", color: "from-teal-500 to-emerald-400" },
  { id: "viskositas", title: "Viskositas (Kekentalan)", cat: "Fisika", color: "from-amber-500 to-yellow-400" },
  { id: "suhu-kalor", title: "Suhu & Kalor", cat: "Fisika", color: "from-red-500 to-orange-400" },
  { id: "perpindahan-panas", title: "Perpindahan Panas", cat: "Fisika", color: "from-orange-500 to-yellow-500" },
  { id: "perubahan-wujud-zat", title: "Perubahan Wujud Zat", cat: "Fisika", color: "from-blue-400 to-sky-300" },
  { id: "hukum-gas-ideal", title: "Hukum Gas Ideal", cat: "Fisika", color: "from-sky-500 to-blue-400" },
  { id: "mesin-carnot", title: "Siklus Mesin Carnot", cat: "Fisika", color: "from-emerald-500 to-green-400" },
  { id: "entropi", title: "Entropi", cat: "Fisika", color: "from-zinc-500 to-slate-400" },
  { id: "hukum-coulomb", title: "Hukum Coulomb", cat: "Fisika", color: "from-red-500 to-rose-400" },
  { id: "muatan-medan-listrik", title: "Muatan & Medan Listrik", cat: "Fisika", color: "from-indigo-500 to-purple-400" },
  { id: "potensial-listrik", title: "Potensial Listrik", cat: "Fisika", color: "from-fuchsia-500 to-pink-400" },
  { id: "kapasitor", title: "Kapasitor", cat: "Fisika", color: "from-cyan-500 to-sky-400" },
  { id: "hukum-ohm", title: "Hukum Ohm (V=IR)", cat: "Fisika", color: "from-rose-500 to-red-400" },
  { id: "rangkaian-ac", title: "Rangkaian Listrik AC", cat: "Fisika", color: "from-blue-500 to-indigo-400" },
  { id: "induksi-faraday", title: "Induksi Elektromagnetik", cat: "Fisika", color: "from-amber-500 to-orange-400" },
  { id: "generator-motor", title: "Generator & Motor", cat: "Fisika", color: "from-red-600 to-orange-500" },
  { id: "semikonduktor", title: "Semikonduktor (Dioda)", cat: "Fisika", color: "from-teal-600 to-emerald-400" },
  { id: "gelombang-suara", title: "Gelombang Suara", cat: "Fisika", color: "from-sky-400 to-blue-500" },
  { id: "interferensi-gelombang", title: "Interferensi Gelombang", cat: "Fisika", color: "from-purple-500 to-pink-400" },
  { id: "efek-doppler", title: "Efek Doppler", cat: "Fisika", color: "from-pink-600 to-rose-400" },
  { id: "resonansi", title: "Resonansi", cat: "Fisika", color: "from-emerald-600 to-green-400" },
  { id: "pemantulan-pembiasan", title: "Pemantulan & Pembiasan", cat: "Fisika", color: "from-blue-600 to-sky-400" },
  { id: "dispersi-cahaya", title: "Dispersi Cahaya (Prisma)", cat: "Fisika", color: "from-rose-500 to-orange-400" },
  { id: "difraksi-cahaya", title: "Difraksi & Celah Ganda", cat: "Fisika", color: "from-violet-500 to-purple-400" },
  { id: "polarisasi-cahaya", title: "Polarisasi Cahaya", cat: "Fisika", color: "from-cyan-600 to-blue-400" },
  { id: "efek-fotolistrik", title: "Efek Fotolistrik", cat: "Fisika", color: "from-yellow-500 to-orange-400" },
  { id: "model-atom", title: "Model Atom Bohr", cat: "Fisika", color: "from-indigo-500 to-blue-400" },
  { id: "peluruhan-radioaktif", title: "Peluruhan Radioaktif", cat: "Fisika", color: "from-red-500 to-rose-400" },
  { id: "fisi-fusi-nuklir", title: "Fisi & Fusi Nuklir", cat: "Fisika", color: "from-orange-500 to-red-400" },
  { id: "relativitas-khusus", title: "Relativitas Khusus", cat: "Fisika", color: "from-sky-500 to-indigo-400" },
  { id: "gelombang-tali", title: "Gelombang pada Tali", cat: "Fisika", color: "from-blue-500 to-cyan-400" },
  { id: "gerak-proyektil", title: "Gerak Proyektil", cat: "Fisika", color: "from-pink-500 to-rose-400" },
  { id: "gravitasi-orbit", title: "Gravitasi & Orbit", cat: "Fisika", color: "from-yellow-500 to-amber-400" },
  { id: "hukum-newton", title: "Hukum II Newton", cat: "Fisika", color: "from-violet-500 to-purple-400" },
  { id: "optik-lensa", title: "Optik & Lensa", cat: "Fisika", color: "from-sky-500 to-blue-400" },
  { id: "termodinamika", title: "Termodinamika Gas", cat: "Fisika", color: "from-red-500 to-orange-400" },
  { id: "rangkaian-listrik", title: "Rangkaian Listrik", cat: "Fisika", color: "from-cyan-500 to-sky-400" },
  { id: "medan-magnet", title: "Medan Magnet", cat: "Fisika", color: "from-indigo-500 to-blue-400" },

  // Kimia
  { id: "penyeimbangan-persamaan", title: "Penyeimbangan Persamaan", cat: "Kimia", color: "from-emerald-500 to-teal-400" },
  { id: "tabel-periodik", title: "Tabel Periodik Interaktif", cat: "Kimia", color: "from-orange-500 to-amber-400" },
  { id: "asam-basa", title: "Asam & Basa (pH)", cat: "Kimia", color: "from-rose-500 to-pink-400" },
  { id: "reaksi-kimia", title: "Reaksi Kimia Dasar", cat: "Kimia", color: "from-purple-500 to-indigo-400" },
  { id: "struktur-atom", title: "Struktur Atom", cat: "Kimia", color: "from-indigo-400 to-blue-300" },
  { id: "ikatan-kimia", title: "Ikatan Kimia", cat: "Kimia", color: "from-teal-500 to-cyan-400" },
  { id: "konfigurasi-elektron", title: "Konfigurasi Elektron", cat: "Kimia", color: "from-cyan-500 to-sky-400" },
  { id: "ion-isotop", title: "Ion & Isotop", cat: "Kimia", color: "from-pink-500 to-rose-400" },
  { id: "bentuk-molekul", title: "Bentuk Molekul (VSEPR)", cat: "Kimia", color: "from-purple-600 to-fuchsia-400" },
  { id: "polaritas-molekul", title: "Polaritas Molekul", cat: "Kimia", color: "from-red-500 to-orange-400" },
  { id: "gaya-antarmolekul", title: "Gaya Antarmolekul", cat: "Kimia", color: "from-sky-500 to-cyan-400" },
  { id: "stoikiometri", title: "Stoikiometri Dasar", cat: "Kimia", color: "from-orange-600 to-amber-500" },
  { id: "laju-reaksi", title: "Laju Reaksi", cat: "Kimia", color: "from-yellow-500 to-orange-400" },
  { id: "kesetimbangan-kimia", title: "Kesetimbangan Kimia", cat: "Kimia", color: "from-emerald-500 to-green-400" },
  { id: "elektrokimia", title: "Elektrokimia", cat: "Kimia", color: "from-blue-600 to-indigo-400" },
  { id: "titrasi-asam-basa", title: "Titrasi Asam-Basa", cat: "Kimia", color: "from-pink-600 to-rose-400" },
  { id: "sifat-koligatif", title: "Sifat Koligatif Larutan", cat: "Kimia", color: "from-cyan-500 to-sky-400" },
  { id: "koloid-suspensi", title: "Koloid & Suspensi", cat: "Kimia", color: "from-yellow-600 to-amber-500" },
  { id: "gugus-fungsi", title: "Gugus Fungsi Organik", cat: "Kimia", color: "from-purple-500 to-pink-400" },
  { id: "polimer", title: "Reaksi Polimerisasi", cat: "Kimia", color: "from-emerald-600 to-teal-400" },

  // Matematika
  { id: "pecahan-desimal", title: "Pecahan & Desimal", cat: "Matematika", color: "from-sky-500 to-blue-400" },
  { id: "garis-bilangan", title: "Garis Bilangan (Bulat)", cat: "Matematika", color: "from-emerald-500 to-teal-400" },
  { id: "faktor-kelipatan", title: "FPB & KPK", cat: "Matematika", color: "from-rose-500 to-pink-400" },
  { id: "teorema-pythagoras", title: "Teorema Pythagoras", cat: "Matematika", color: "from-purple-600 to-fuchsia-400" },
  { id: "sistem-persamaan", title: "Sistem Persamaan Linear", cat: "Matematika", color: "from-indigo-500 to-blue-400" },
  { id: "kesebangunan", title: "Kesebangunan & Kongruen", cat: "Matematika", color: "from-amber-500 to-yellow-400" },
  { id: "fungsi-kuadrat", title: "Fungsi Kuadrat & Parabola", cat: "Matematika", color: "from-emerald-600 to-green-400" },
  { id: "eksponen-logaritma", title: "Eksponen & Logaritma", cat: "Matematika", color: "from-pink-500 to-rose-400" },
  { id: "komposisi-fungsi", title: "Komposisi Fungsi", cat: "Matematika", color: "from-orange-500 to-yellow-500" },
  { id: "grafik-fungsi", title: "Grafik Fungsi", cat: "Matematika", color: "from-emerald-500 to-green-400" },
  { id: "geometri-interaktif", title: "Geometri 2D Interaktif", cat: "Matematika", color: "from-sky-400 to-cyan-300" },
  { id: "kubus", title: "Bangun Ruang: Kubus", cat: "Matematika", color: "from-sky-500 to-blue-400" },
  { id: "balok", title: "Bangun Ruang: Balok", cat: "Matematika", color: "from-emerald-500 to-teal-400" },
  { id: "tabung", title: "Bangun Ruang: Tabung", cat: "Matematika", color: "from-violet-500 to-purple-400" },
  { id: "kerucut", title: "Bangun Ruang: Kerucut", cat: "Matematika", color: "from-rose-500 to-pink-400" },
  { id: "bola", title: "Bangun Ruang: Bola", cat: "Matematika", color: "from-yellow-500 to-amber-400" },
  { id: "kalkulus-visual", title: "Kalkulus Visual", cat: "Matematika", color: "from-fuchsia-500 to-purple-400" },
  { id: "statistik-probabilitas", title: "Statistik & Probabilitas", cat: "Matematika", color: "from-blue-600 to-indigo-500" },
  { id: "matriks-transformasi", title: "Matriks & Transformasi", cat: "Matematika", color: "from-violet-600 to-purple-500" },
  { id: "aljabar-linear", title: "Aljabar Linear", cat: "Matematika", color: "from-rose-400 to-pink-300" },
  { id: "trigonometri", title: "Trigonometri", cat: "Matematika", color: "from-yellow-400 to-amber-300" },
  { id: "peluang-dasar", title: "Peluang & Distribusi", cat: "Matematika", color: "from-indigo-500 to-blue-400" },
  { id: "vektor-visual", title: "Vektor 2D", cat: "Matematika", color: "from-teal-500 to-emerald-400" },
  { id: "bilangan-kompleks", title: "Bilangan Kompleks", cat: "Matematika", color: "from-purple-500 to-fuchsia-400" },
  { id: "barisan-deret", title: "Barisan & Deret", cat: "Matematika", color: "from-rose-600 to-red-400" },

  // Biologi
  { id: "sel-organel", title: "Anatomi Sel & Organel", cat: "Biologi", color: "from-emerald-600 to-green-400" },
  { id: "fotosintesis", title: "Proses Fotosintesis", cat: "Biologi", color: "from-lime-500 to-green-400" },
  { id: "genetika-dna", title: "Hukum Mendel & DNA", cat: "Biologi", color: "from-rose-500 to-pink-400" },
  { id: "ekosistem", title: "Keseimbangan Ekosistem", cat: "Biologi", color: "from-teal-600 to-emerald-400" },
  { id: "tubuh-manusia", title: "Sistem Tubuh Manusia", cat: "Biologi", color: "from-red-500 to-orange-400" },
  { id: "evolusi", title: "Seleksi Alam & Evolusi", cat: "Biologi", color: "from-orange-600 to-amber-500" },
  { id: "reproduksi-sel", title: "Reproduksi Sel (Mitosis)", cat: "Biologi", color: "from-indigo-500 to-purple-400" },
  { id: "transpor-membran", title: "Transpor Membran Sel", cat: "Biologi", color: "from-cyan-500 to-sky-400" },
  { id: "respirasi-seluler", title: "Respirasi Seluler", cat: "Biologi", color: "from-emerald-500 to-green-400" },
  { id: "sintesis-protein", title: "Sintesis Protein", cat: "Biologi", color: "from-fuchsia-500 to-purple-400" },
  { id: "sistem-saraf", title: "Sistem Saraf & Impuls", cat: "Biologi", color: "from-yellow-500 to-orange-400" },
  { id: "efek-rumah-kaca", title: "Efek Rumah Kaca & Iklim", cat: "Biologi", color: "from-orange-500 to-yellow-500" },
  { id: "mutasi-genetik", title: "Mutasi Genetik", cat: "Biologi", color: "from-rose-600 to-pink-400" },
  { id: "sistem-peredaran-darah", title: "Sistem Peredaran Darah", cat: "Biologi", color: "from-red-500 to-rose-400" },
  { id: "sistem-pernapasan", title: "Sistem Pernapasan", cat: "Biologi", color: "from-sky-500 to-blue-400" },
  { id: "sistem-pencernaan", title: "Sistem Pencernaan", cat: "Biologi", color: "from-amber-600 to-orange-500" },
  { id: "sistem-imun", title: "Sistem Imun (Pertahanan)", cat: "Biologi", color: "from-purple-600 to-fuchsia-400" },
  { id: "pohon-filogenetik", title: "Pohon Filogenetik", cat: "Biologi", color: "from-emerald-700 to-green-500" },
  { id: "sistem-hormon", title: "Sistem Hormon", cat: "Biologi", color: "from-fuchsia-600 to-purple-400" },
  { id: "sistem-ekskresi", title: "Sistem Ekskresi (Ginjal)", cat: "Biologi", color: "from-rose-500 to-red-400" },
  { id: "siklus-biogeokimia", title: "Siklus Biogeokimia", cat: "Biologi", color: "from-blue-500 to-cyan-400" },
  { id: "dinamika-populasi", title: "Dinamika Populasi", cat: "Biologi", color: "from-teal-600 to-emerald-400" },

  // Ilmu Bumi & Geografi
  { id: "struktur-bumi", title: "Struktur Lapisan Bumi", cat: "Ilmu Bumi", color: "from-orange-700 to-amber-600" },
  { id: "tektonik-lempeng", title: "Tektonik Lempeng", cat: "Ilmu Bumi", color: "from-zinc-600 to-slate-400" },
  { id: "gunung-berapi", title: "Gunung Berapi & Erupsi", cat: "Ilmu Bumi", color: "from-red-600 to-orange-500" },
  { id: "siklus-batuan", title: "Siklus Batuan", cat: "Ilmu Bumi", color: "from-amber-700 to-orange-600" },
  { id: "lapisan-atmosfer", title: "Lapisan Atmosfer", cat: "Ilmu Bumi", color: "from-sky-600 to-blue-400" },
  { id: "gempa-bumi", title: "Gempa & Seismik", cat: "Ilmu Bumi", color: "from-red-500 to-rose-400" },
  { id: "siklus-air", title: "Siklus Air", cat: "Ilmu Bumi", color: "from-blue-400 to-cyan-300" },
  { id: "cuaca-iklim", title: "Cuaca & Iklim", cat: "Ilmu Bumi", color: "from-yellow-500 to-orange-400" },
  { id: "arus-laut", title: "Arus Laut Global", cat: "Ilmu Bumi", color: "from-indigo-600 to-blue-500" },
  { id: "zona-waktu", title: "Zona Waktu Dunia", cat: "Ilmu Bumi", color: "from-slate-700 to-zinc-500" },

  // Bahasa & Linguistik
  { id: "struktur-kalimat", title: "Struktur Kalimat (SPOK)", cat: "Bahasa", color: "from-emerald-600 to-green-400" },
  { id: "jenis-kata", title: "Jenis-Jenis Kata", cat: "Bahasa", color: "from-blue-600 to-indigo-500" },
  { id: "majas-gaya-bahasa", title: "Majas & Gaya Bahasa", cat: "Bahasa", color: "from-purple-600 to-fuchsia-400" },
  { id: "sintaksis", title: "Sintaksis (Pohon Frasa)", cat: "Bahasa", color: "from-rose-600 to-pink-400" },
  { id: "fonetik-pengucapan", title: "Fonetik (Bunyi Vokal)", cat: "Bahasa", color: "from-amber-600 to-yellow-500" },
  { id: "ejaan-tanda-baca", title: "Ejaan & Tanda Baca", cat: "Bahasa", color: "from-red-500 to-rose-400" },
  { id: "paragraf-wacana", title: "Struktur Paragraf", cat: "Bahasa", color: "from-emerald-500 to-teal-400" },
  { id: "teks-genre", title: "Analisis Genre Teks", cat: "Bahasa", color: "from-cyan-600 to-sky-400" },
  { id: "peta-kata", title: "Relasi Makna Kata", cat: "Bahasa", color: "from-teal-500 to-emerald-400" },
  { id: "morfologi", title: "Morfologi", cat: "Bahasa", color: "from-orange-500 to-yellow-400" },

  // Ekonomi & Akuntansi
  { id: "penawaran-permintaan", title: "Supply & Demand", cat: "Ekonomi", color: "from-blue-600 to-sky-400" },
  { id: "inflasi-deflasi", title: "Inflasi & Deflasi", cat: "Ekonomi", color: "from-red-600 to-rose-400" },
  { id: "persamaan-akuntansi", title: "Persamaan Akuntansi", cat: "Ekonomi", color: "from-emerald-600 to-teal-400" },
  { id: "simulasi-saham", title: "Simulasi Pasar Saham", cat: "Ekonomi", color: "from-amber-500 to-orange-400" },
  { id: "kebijakan-fiskal-moneter", title: "Fiskal & Moneter", cat: "Ekonomi", color: "from-indigo-600 to-blue-500" },
  { id: "elastisitas", title: "Elastisitas Harga", cat: "Ekonomi", color: "from-purple-600 to-pink-400" },
  { id: "struktur-pasar", title: "Struktur Pasar", cat: "Ekonomi", color: "from-rose-600 to-red-400" },
  { id: "siklus-akuntansi", title: "Siklus Akuntansi", cat: "Ekonomi", color: "from-cyan-600 to-sky-400" },
  { id: "pajak-dasar", title: "Dasar Perpajakan", cat: "Ekonomi", color: "from-teal-500 to-emerald-400" },
  { id: "nilai-waktu-uang", title: "Nilai Waktu Uang", cat: "Ekonomi", color: "from-yellow-600 to-orange-500" },

  // Sejarah & IPS
  { id: "sejarah-indonesia", title: "Linimasa Sejarah NKRI", cat: "Sejarah", color: "from-red-600 to-rose-400" },
  { id: "kerajaan-nusantara", title: "Peta Kerajaan Nusantara", cat: "Sejarah", color: "from-amber-700 to-orange-600" },
  { id: "perjuangan-kemerdekaan", title: "Perjuangan 1945", cat: "Sejarah", color: "from-rose-600 to-red-400" },
  { id: "peradaban-kuno", title: "Peradaban Kuno", cat: "Sejarah", color: "from-amber-600 to-yellow-500" },
  { id: "perang-dunia", title: "Perang Dunia I & II", cat: "Sejarah", color: "from-stone-700 to-zinc-500" },
  { id: "sistem-pemerintahan", title: "Sistem Pemerintahan", cat: "Sejarah", color: "from-indigo-600 to-blue-500" },
  { id: "demokrasi-pemilu", title: "Demokrasi & Pemilu", cat: "Sejarah", color: "from-blue-600 to-indigo-500" },
  { id: "lembaga-negara", title: "Lembaga Negara", cat: "Sejarah", color: "from-emerald-600 to-teal-400" },
  { id: "interaksi-sosial", title: "Interaksi Sosial", cat: "Sejarah", color: "from-purple-600 to-fuchsia-400" },
  { id: "mobilitas-sosial", title: "Mobilitas Sosial", cat: "Sejarah", color: "from-cyan-600 to-sky-400" },

  // Teknologi & Informatika
  { id: "algoritma-flowchart", title: "Algoritma & Flowchart", cat: "Teknologi", color: "from-emerald-600 to-teal-400" },
  { id: "sorting-visual", title: "Sorting Visualizer", cat: "Teknologi", color: "from-rose-600 to-pink-500" },
  { id: "searching-visual", title: "Searching Visualizer", cat: "Teknologi", color: "from-blue-600 to-indigo-500" },
  { id: "struktur-data", title: "Struktur Data", cat: "Teknologi", color: "from-purple-600 to-fuchsia-400" },
  { id: "rekursi", title: "Visualisasi Rekursi", cat: "Teknologi", color: "from-amber-600 to-orange-500" },
  { id: "kompleksitas-algoritma", title: "Big O Notation", cat: "Teknologi", color: "from-rose-700 to-red-500" },
  { id: "jaringan-komputer", title: "LAN & WAN", cat: "Teknologi", color: "from-emerald-700 to-green-500" },
  { id: "model-osi", title: "OSI Layer", cat: "Teknologi", color: "from-fuchsia-600 to-pink-400" },
  { id: "dns-http", title: "DNS & HTTP Request", cat: "Teknologi", color: "from-blue-700 to-cyan-500" },
  { id: "keamanan-jaringan", title: "Cybersecurity Dasar", cat: "Teknologi", color: "from-red-600 to-orange-500" },
  { id: "sistem-bilangan", title: "Biner & Hexadesimal", cat: "Teknologi", color: "from-purple-600 to-indigo-400" },
  { id: "gerbang-logika", title: "Gerbang Logika", cat: "Teknologi", color: "from-blue-500 to-sky-400" },
  { id: "arsitektur-cpu", title: "Arsitektur CPU", cat: "Teknologi", color: "from-zinc-700 to-slate-500" },
  { id: "machine-learning", title: "Neural Network (AI)", cat: "Teknologi", color: "from-blue-800 to-indigo-600" },
  { id: "visualisasi-data", title: "Visualisasi Data", cat: "Teknologi", color: "from-emerald-600 to-teal-400" },

  // Seni & Budaya
  { id: "teori-warna", title: "Teori Warna", cat: "Seni", color: "from-fuchsia-600 to-purple-400" },
  { id: "perspektif-seni", title: "Perspektif Seni Rupa", cat: "Seni", color: "from-orange-600 to-amber-500" },
  { id: "komposisi-desain", title: "Komposisi Desain", cat: "Seni", color: "from-rose-600 to-pink-500" },
  { id: "desain-batik", title: "Desain Batik", cat: "Seni", color: "from-amber-700 to-orange-600" },
  { id: "seni-ukir", title: "Seni Ukir & Ornamen", cat: "Seni", color: "from-amber-800 to-yellow-600" },
  { id: "not-ritme", title: "Not & Ritme Musik", cat: "Seni", color: "from-blue-600 to-indigo-500" },
  { id: "tangga-nada", title: "Tangga Nada", cat: "Seni", color: "from-emerald-600 to-green-400" },
  { id: "gelombang-timbre", title: "Warna Suara (Timbre)", cat: "Seni", color: "from-amber-500 to-orange-400" },
  { id: "alat-musik-tradisional", title: "Alat Musik Nusantara", cat: "Seni", color: "from-yellow-700 to-amber-600" },
  { id: "budaya-tari-wayang", title: "Peta Budaya Indonesia", cat: "Seni", color: "from-red-700 to-orange-600" },

  // Astronomi
  { id: "tata-surya", title: "Tata Surya 3D", cat: "Astronomi", color: "from-yellow-500 to-orange-400" },
  { id: "fase-bulan", title: "Siklus Fase Bulan", cat: "Astronomi", color: "from-zinc-600 to-slate-400" },
  { id: "gerhana", title: "Gerhana Matahari & Bulan", cat: "Astronomi", color: "from-orange-700 to-red-500" },
  { id: "siklus-bintang", title: "Siklus Hidup Bintang", cat: "Astronomi", color: "from-cyan-700 to-blue-500" },
  { id: "galaksi-alam-semesta", title: "Skala Alam Semesta", cat: "Astronomi", color: "from-fuchsia-800 to-purple-600" },
  { id: "pasang-surut", title: "Gravitasi & Pasang Surut", cat: "Astronomi", color: "from-blue-800 to-indigo-600" },
  { id: "rotasi-bumi", title: "Rotasi & Revolusi Bumi", cat: "Astronomi", color: "from-green-700 to-emerald-500" },
  { id: "asteroid-meteor", title: "Asteroid & Meteor", cat: "Astronomi", color: "from-amber-600 to-orange-500" },
  { id: "teleskop-spektrum", title: "Spektrum Cahaya", cat: "Astronomi", color: "from-purple-800 to-indigo-600" },
  { id: "zona-layak-huni", title: "Zona Layak Huni", cat: "Astronomi", color: "from-emerald-500 to-teal-400" },
  
  // Psikologi & Kesehatan
  { id: "ilusi-optik", title: "Persepsi & Ilusi Optik", cat: "Kesehatan", color: "from-indigo-600 to-blue-500" },
  { id: "memori-belajar", title: "Memori & Belajar", cat: "Kesehatan", color: "from-blue-700 to-indigo-500" },
  { id: "emosi-mental", title: "Kesehatan Mental", cat: "Kesehatan", color: "from-rose-700 to-pink-500" },
  { id: "kalkulator-imt", title: "Indeks Massa Tubuh (IMT)", cat: "Kesehatan", color: "from-emerald-600 to-green-500" },
  { id: "simulasi-p3k", title: "Pertolongan Pertama (P3K)", cat: "Kesehatan", color: "from-red-600 to-orange-500" },
];

const CATEGORIES = ["Semua", "Fisika", "Kimia", "Matematika", "Biologi", "Ilmu Bumi", "Astronomi", "Teknologi", "Seni", "Bahasa", "Ekonomi", "Sejarah", "Kesehatan"];

export default function SimulationsPage() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSimulations = useMemo(() => {
    return SIMULATIONS.filter(sim => {
      const matchesCat = activeCategory === "Semua" || sim.cat === activeCategory;
      const matchesSearch = sim.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="flex-1 bg-[#050505] relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-purple-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 pt-40 pb-24 relative z-10">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20">
          <div className="space-y-6 max-w-3xl">
             <motion.div 
               initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
               className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest text-indigo-400"
             >
                <Monitor className="w-3 h-3" />
                Laboratorium Virtual Aktif
             </motion.div>
             <motion.h1 
               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
               className="text-5xl md:text-6xl font-black tracking-tighter text-white uppercase leading-none"
             >
               KATALOG <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">SIMULASI</span>
             </motion.h1>
             <motion.p 
               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
               className="text-zinc-500 text-lg font-medium leading-relaxed"
             >
               Rendering {SIMULATIONS.length} modul interaktif. Pilih laboratorium virtual yang ingin Anda jalankan.
             </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="relative w-full lg:w-96"
          >
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-zinc-500">
               <Search className="w-5 h-5" />
            </div>
            <input 
              type="text" 
              placeholder="Cari Laboratorium..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all placeholder:text-zinc-600 backdrop-blur-xl"
            />
          </motion.div>
        </div>

        {/* --- Category Tabs --- */}
        <div className="flex items-center gap-4 mb-12 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6">
           <div className="flex items-center gap-3 text-zinc-500 mr-2">
              <Filter className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Filter Topik</span>
           </div>
           {CATEGORIES.map((cat, idx) => (
             <button 
               key={cat}
               onClick={() => setActiveCategory(cat)}
               className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border
                 ${activeCategory === cat 
                   ? 'bg-indigo-600 text-white border-indigo-400 shadow-xl shadow-indigo-600/20' 
                   : 'bg-white/5 text-zinc-500 border-white/5 hover:bg-white/10 hover:text-zinc-300'
                 }
               `}
             >
               {cat}
             </button>
           ))}
        </div>

        {/* --- Simulations Grid --- */}
        <AnimatePresence mode="popLayout">
           <motion.div 
             layout
             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
           >
             {filteredSimulations.map((sim, idx) => (
               <motion.div
                 layout
                 key={sim.id}
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.9 }}
                 transition={{ duration: 0.3, delay: idx * 0.005 }}
               >
                 <Link href={`/simulasi/${sim.id}`} className="group relative block h-[340px] rounded-[40px] bg-zinc-900/40 border border-white/5 hover:border-indigo-500/30 transition-all duration-500 overflow-hidden shadow-2xl">
                    
                    {/* Card Body */}
                    <div className="h-full flex flex-col justify-between p-8">
                       
                       {/* Top Part: Icon & Category */}
                       <div className="space-y-4">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${sim.color} flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                             <Play className="w-6 h-6 fill-current ml-1" />
                          </div>
                          <div>
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400/80 mb-2 block">{sim.cat}</span>
                             <h3 className="text-xl font-black text-white leading-tight uppercase tracking-tight group-hover:text-indigo-300 transition-colors">{sim.title}</h3>
                          </div>
                       </div>

                       {/* Bottom Part: Action */}
                       <div className="flex items-center justify-between pt-6 border-t border-white/5">
                          <div className="flex items-center gap-2">
                             <Activity className="w-3 h-3 text-emerald-500" />
                             <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest italic">Simulation Ready</span>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-600 transition-all duration-500">
                             <ChevronRight className="w-5 h-5 text-white" />
                          </div>
                       </div>
                    </div>

                    {/* Hover Overlay Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${sim.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                 </Link>
               </motion.div>
             ))}
           </motion.div>
        </AnimatePresence>

        {/* --- Empty State --- */}
        {filteredSimulations.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="py-40 text-center space-y-4"
          >
             <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                <Search className="w-8 h-8 text-zinc-700" />
             </div>
             <h3 className="text-2xl font-black text-white uppercase tracking-tight">Tidak Ada Laboratorium</h3>
             <p className="text-zinc-500 max-w-sm mx-auto font-medium">Pencarian "{searchQuery}" tidak membuahkan hasil. Coba kata kunci lain atau kategori yang berbeda.</p>
          </motion.div>
        )}

      </div>

      {/* --- Footer Hint --- */}
      <div className="container mx-auto px-6 pb-20 border-t border-white/5 pt-20">
         <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex items-center gap-6">
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-2">Platform Power</span>
                  <div className="flex items-center gap-4">
                     <Layers className="w-5 h-5 text-indigo-400" />
                     <span className="text-sm font-bold text-zinc-400">Rendering {SIMULATIONS.length} Modul Interaktif</span>
                  </div>
               </div>
            </div>
            <div className="flex items-center gap-4 px-6 py-3 bg-white/5 rounded-full border border-white/5 text-zinc-500">
               <MousePointer2 className="w-4 h-4 animate-bounce text-indigo-500" />
               <span className="text-[9px] font-black uppercase tracking-widest">Klik kartu simulasi untuk membuka Laboratorium Virtual</span>
            </div>
         </div>
      </div>

    </div>
  );
}
