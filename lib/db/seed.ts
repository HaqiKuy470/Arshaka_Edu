/**
 * Seed script — isi data awal simulasi & badges ke database
 * Jalankan: npx tsx lib/db/seed.ts
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

const SIMULATIONS = [
  // Fisika
  { id: 'gerak-lurus', title: 'Gerak Lurus', subject: 'Fisika', grade: 'SD–SMP', slug: 'gerak-lurus', description: 'Visualisasi posisi, kecepatan, dan percepatan pada gerak 1D' },
  { id: 'gerak-proyektil', title: 'Gerak Proyektil', subject: 'Fisika', grade: 'SMP–SMA', slug: 'gerak-proyektil', description: 'Analisis lintasan benda yang dilempar dengan sudut & kecepatan awal' },
  { id: 'hukum-newton', title: 'Hukum Newton', subject: 'Fisika', grade: 'SMP–SMA', slug: 'hukum-newton', description: 'Simulasi gaya, massa, dan percepatan' },
  { id: 'energi-skate-park', title: 'Energi Skate Park', subject: 'Fisika', grade: 'SMP–SMA', slug: 'energi-skate-park', description: 'Konversi energi kinetik dan potensial pada lintasan skate' },
  { id: 'rangkaian-listrik-dc', title: 'Rangkaian Listrik DC', subject: 'Fisika', grade: 'SMP–SMA', slug: 'rangkaian-listrik-dc', description: 'Buat & uji rangkaian seri dan paralel' },
  { id: 'hukum-ohm', title: 'Hukum Ohm', subject: 'Fisika', grade: 'SMP–SMA', slug: 'hukum-ohm', description: 'Hubungan tegangan, arus, dan hambatan' },
  { id: 'bandul-sederhana', title: 'Bandul Sederhana', subject: 'Fisika', grade: 'SMP–SMA', slug: 'bandul-sederhana', description: 'Pengaruh panjang tali dan gravitasi pada periode ayunan' },
  { id: 'gelombang-suara', title: 'Gelombang Suara', subject: 'Fisika', grade: 'SMP–SMA', slug: 'gelombang-suara', description: 'Visualisasi gelombang bunyi, amplitudo, dan frekuensi' },
  // Kimia
  { id: 'struktur-atom', title: 'Struktur Atom', subject: 'Kimia', grade: 'SMP–SMA', slug: 'struktur-atom', description: 'Visualisasi proton, neutron, dan elektron dalam atom' },
  { id: 'tabel-periodik', title: 'Tabel Periodik Interaktif', subject: 'Kimia', grade: 'SMP–Kuliah', slug: 'tabel-periodik', description: 'Eksplorasi sifat-sifat unsur kimia secara interaktif' },
  { id: 'asam-basa-ph', title: 'Asam, Basa & pH', subject: 'Kimia', grade: 'SMP–SMA', slug: 'asam-basa-ph', description: 'Simulasi pH larutan, indikator, dan skala keasaman' },
  { id: 'ikatan-kimia', title: 'Ikatan Ion & Kovalen', subject: 'Kimia', grade: 'SMA–Kuliah', slug: 'ikatan-kimia', description: 'Simulasi pembentukan ikatan kimia antar atom' },
  // Matematika
  { id: 'grafik-fungsi', title: 'Grafik Fungsi Interaktif', subject: 'Matematika', grade: 'SMP–Kuliah', slug: 'grafik-fungsi', description: 'Plot fungsi linear, kuadrat, eksponen, logaritma, dll' },
  { id: 'turunan', title: 'Turunan (Diferensial)', subject: 'Matematika', grade: 'SMA–Kuliah', slug: 'turunan', description: 'Visualisasi garis singgung dan laju perubahan' },
  { id: 'integral', title: 'Integral (Antiturunan)', subject: 'Matematika', grade: 'SMA–Kuliah', slug: 'integral', description: 'Luas daerah di bawah kurva secara visual' },
  { id: 'statistik-deskriptif', title: 'Statistik Deskriptif', subject: 'Matematika', grade: 'SMP–SMA', slug: 'statistik-deskriptif', description: 'Mean, median, modus, dan sebaran data' },
  // Biologi
  { id: 'sel-prokariot-eukariot', title: 'Sel Prokariot & Eukariot', subject: 'Biologi', grade: 'SMP–SMA', slug: 'sel-prokariot-eukariot', description: 'Perbandingan struktur dan organel sel' },
  { id: 'fotosintesis', title: 'Fotosintesis', subject: 'Biologi', grade: 'SMP–SMA', slug: 'fotosintesis', description: 'Proses reaksi terang dan gelap secara visual' },
  { id: 'dna-replikasi', title: 'DNA & Replikasi', subject: 'Biologi', grade: 'SMA–Kuliah', slug: 'dna-replikasi', description: 'Struktur DNA dan proses replikasi' },
  { id: 'rantai-makanan', title: 'Rantai & Jaring Makanan', subject: 'Biologi', grade: 'SD–SMA', slug: 'rantai-makanan', description: 'Aliran energi antar organisme dalam ekosistem' },
  // Astronomi
  { id: 'tata-surya-3d', title: 'Tata Surya 3D', subject: 'Astronomi', grade: 'SD–SMA', slug: 'tata-surya-3d', description: 'Eksplorasi orbit dan skala planet secara 3D interaktif' },
  { id: 'fase-bulan', title: 'Fase Bulan', subject: 'Astronomi', grade: 'SD–SMP', slug: 'fase-bulan', description: 'Simulasi perubahan fase bulan dari bumi' },
];

const BADGES = [
  { id: 'first-simulation', name: 'Penjelajah Pertama', description: 'Menjalankan simulasi untuk pertama kali', icon: '🚀', condition: 'complete_1_simulation' },
  { id: 'physics-starter', name: 'Calon Fisikawan', description: 'Menyelesaikan 3 simulasi Fisika', icon: '⚛️', condition: 'complete_3_physics', subject: 'Fisika' },
  { id: 'chemistry-starter', name: 'Calon Kimiawan', description: 'Menyelesaikan 3 simulasi Kimia', icon: '🧪', condition: 'complete_3_chemistry', subject: 'Kimia' },
  { id: 'math-starter', name: 'Calon Matematikawan', description: 'Menyelesaikan 3 simulasi Matematika', icon: '📐', condition: 'complete_3_math', subject: 'Matematika' },
  { id: 'biology-starter', name: 'Calon Biolog', description: 'Menyelesaikan 3 simulasi Biologi', icon: '🧬', condition: 'complete_3_biology', subject: 'Biologi' },
  { id: 'explorer-5', name: 'Penjelajah Aktif', description: 'Menjalankan 5 simulasi berbeda', icon: '🗺️', condition: 'complete_5_simulations' },
  { id: 'explorer-10', name: 'Penjelajah Sejati', description: 'Menjalankan 10 simulasi berbeda', icon: '🏆', condition: 'complete_10_simulations' },
  { id: 'dedicated-1h', name: 'Siswa Berdedikasi', description: 'Total waktu belajar 1 jam', icon: '⏱️', condition: 'spend_3600_seconds' },
  { id: 'all-subjects', name: 'Polymath', description: 'Mencoba simulasi dari 5 mata pelajaran berbeda', icon: '🌟', condition: 'try_5_subjects' },
];

async function seed() {
  console.log('🌱 Memulai seeding database...\n');

  try {
    // Seed simulations
    console.log('📚 Memasukkan data simulasi...');
    for (const sim of SIMULATIONS) {
      await db
        .insert(schema.simulations)
        .values(sim)
        .onConflictDoUpdate({
          target: schema.simulations.id,
          set: {
            title: sim.title,
            description: sim.description,
            subject: sim.subject,
            grade: sim.grade,
          },
        });
    }
    console.log(`   ✅ ${SIMULATIONS.length} simulasi berhasil dimasukkan`);

    // Seed badges
    console.log('🏅 Memasukkan data badges...');
    for (const badge of BADGES) {
      await db
        .insert(schema.badges)
        .values(badge)
        .onConflictDoUpdate({
          target: schema.badges.id,
          set: { name: badge.name, description: badge.description },
        });
    }
    console.log(`   ✅ ${BADGES.length} badge berhasil dimasukkan`);

    console.log('\n🎉 Seeding selesai!');
  } catch (err) {
    console.error('❌ Seeding gagal:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
