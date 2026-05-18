import { auth, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { simulationProgress, simulationHistory, userBadges } from '@/lib/db/schema';
import { eq, count, sum } from 'drizzle-orm';
import Link from 'next/link';
import {
  Award, BookOpen, Star, Clock, Trophy,
  Bell, Settings, ChevronRight, LogOut, Atom,
  Users, Layers, Plus, Link2, FileText, CheckSquare, GraduationCap
} from 'lucide-react';



// ─── Komponen Avatar ────────────────────────────────────────────────────────
function Avatar({ name, image }: { name: string | null | undefined; image: string | null | undefined }) {
  if (image) {
    return (
      <img
        src={image}
        alt={name ?? 'User'}
        className="w-24 h-24 rounded-full object-cover shadow-[0_0_30px_rgba(99,102,241,0.3)] border-2 border-indigo-500/30"
      />
    );
  }
  const initials = name
    ? name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '??';
  return (
    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold shadow-[0_0_30px_rgba(99,102,241,0.3)]">
      {initials}
    </div>
  );
}

// ─── Server Action: Logout ───────────────────────────────────────────────────
async function handleSignOut() {
  'use server';
  await signOut({ redirectTo: '/' });
}

// ─── Dashboard Page ──────────────────────────────────────────────────────────
export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const user = session.user;
  const isOnboarded = (user as { isOnboarded?: boolean }).isOnboarded ?? false;
  if (!isOnboarded) redirect('/onboarding');

  const userId = session.user.id;

  // Ambil statistik dari database (paralel)
  const [progressRows, historyRows, badgeRows] = await Promise.all([
    db.select({ count: count() }).from(simulationProgress).where(eq(simulationProgress.userId, userId)),
    db.select({ total: sum(simulationHistory.durationSeconds) }).from(simulationHistory).where(eq(simulationHistory.userId, userId)),
    db.select({ count: count() }).from(userBadges).where(eq(userBadges.userId, userId)),
  ]);

  const completedCount = progressRows[0]?.count ?? 0;
  const totalSeconds = Number(historyRows[0]?.total ?? 0);
  const totalHours = Math.floor(totalSeconds / 3600);
  const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
  const timeLabel = totalHours > 0 ? `${totalHours} Jam ${totalMinutes} Mnt` : totalMinutes > 0 ? `${totalMinutes} Mnt` : '0 Mnt';
  const badgeCount = badgeRows[0]?.count ?? 0;

  const role = (user as { role?: string }).role ?? 'student';

  if (role === 'teacher') {
    return (
      <div className="min-h-screen pt-16 pb-24 relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">

          {/* ── Header / Profile Summary ── */}
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start bg-zinc-900/50 p-8 rounded-3xl border border-white/5 mb-8">
            <Avatar name={user.name} image={user.image} />

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">{user.name ?? 'Pengguna'}</h1>
              <p className="text-zinc-500 text-sm mb-3">{user.email}</p>
              <div className="text-zinc-400 flex flex-wrap gap-3 justify-center md:justify-start text-sm">
                <span className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full border border-purple-500/20 capitalize font-bold">
                  🏫 Pengajar (Teacher)
                </span>
                <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-medium">
                  <Users className="w-3.5 h-3.5" />
                  4 Kelas Virtual
                </span>
                <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20 font-medium">
                  👥 124 Siswa Terdaftar
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors relative" aria-label="Notifikasi">
                <Bell className="w-5 h-5 text-zinc-300" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full" />
              </button>
              <button className="p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors" aria-label="Pengaturan">
                <Settings className="w-5 h-5 text-zinc-300" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Main Content ── */}
            <div className="lg:col-span-2 space-y-8">

              {/* Statistik Kelas Cepat */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Users, color: 'purple', label: 'Total Siswa', value: '124' },
                  { icon: CheckSquare, color: 'emerald', label: 'Tugas Aktif', value: '5 Tugas' },
                  { icon: Layers, color: 'indigo', label: 'Rata-rata Nilai', value: '88%' },
                ].map(({ icon: Icon, color, label, value }) => (
                  <div key={label} className={`bg-zinc-900 border border-white/5 rounded-2xl p-5 text-center`}>
                    <div className={`w-10 h-10 rounded-xl bg-${color}-500/20 flex items-center justify-center mx-auto mb-3`}>
                      <Icon className={`w-5 h-5 text-${color}-400`} />
                    </div>
                    <div className="text-xl font-bold text-white mb-0.5">{value}</div>
                    <div className="text-xs text-zinc-500">{label}</div>
                  </div>
                ))}
              </div>

              {/* Kelas Virtual Anda */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-purple-400" /> Kelas Virtual Anda
                  </h2>
                  <button className="text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Buat Kelas
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { id: '10-ipa-1', name: 'Kelas 10 IPA 1', subject: 'Fisika', students: '32 Siswa', activeTask: 'Hukum Newton II', progress: 75, color: 'from-blue-600 to-cyan-400' },
                    { id: '11-ipa-3', name: 'Kelas 11 IPA 3', subject: 'Kimia', students: '30 Siswa', activeTask: 'Ikatan Kovalen', progress: 90, color: 'from-purple-600 to-pink-500' },
                    { id: '12-ipa-2', name: 'Kelas 12 IPA 2', subject: 'Fisika', students: '31 Siswa', activeTask: 'Rangkaian Listrik AC', progress: 40, color: 'from-indigo-600 to-blue-500' },
                    { id: '10-ipa-2', name: 'Kelas 10 IPA 2', subject: 'Biologi', students: '31 Siswa', activeTask: 'Anatomi Sel & Organel', progress: 85, color: 'from-green-600 to-emerald-400' },
                  ].map((cls) => (
                    <div key={cls.id} className="group bg-zinc-900 border border-white/5 rounded-2xl p-5 hover:bg-zinc-800 transition-all hover:border-purple-500/30">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-white mb-0.5 group-hover:text-purple-400 transition-colors">{cls.name}</h3>
                          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{cls.students}</span>
                        </div>
                        <span className="text-xs font-bold bg-zinc-800 px-2 py-1 rounded text-zinc-400">{cls.subject}</span>
                      </div>
                      <div className="space-y-2 mt-4">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-zinc-400">Tugas: {cls.activeTask}</span>
                          <span className="text-purple-400">{cls.progress}% Selesai</span>
                        </div>
                        <div className="w-full bg-zinc-800 rounded-full h-1.5">
                          <div className={`bg-gradient-to-r ${cls.color} h-1.5 rounded-full`} style={{ width: `${cls.progress}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Tugas & Simulasi Terkini */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-emerald-400" /> Tugas & Simulasi Terkini
                  </h2>
                  <Link href="/simulasi" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                    Lihat Semua
                  </Link>
                </div>

                <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden divide-y divide-white/5">
                  {[
                    { emoji: '🔬', title: 'Panduan Praktikum: Hukum Newton II', sub: 'Kelas 10 IPA 1 & 2 • Dikirim 2 hari lalu', deadline: 'Besok', completed: '58/63 Siswa' },
                    { emoji: '⚗️', title: 'Tugas Mandiri: Ikatan Kovalen & Ion', sub: 'Kelas 11 IPA 3 • Dikirim 3 hari lalu', deadline: '24 Mei', completed: '27/30 Siswa' },
                    { emoji: '⚡', title: 'Eksperimen Virtual: Rangkaian AC', sub: 'Kelas 12 IPA 2 • Dikirim 5 hari lalu', deadline: '28 Mei', completed: '12/31 Siswa' },
                  ].map((item) => (
                    <div key={item.title} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0 text-2xl">
                        {item.emoji}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white text-sm">{item.title}</h4>
                        <p className="text-xs text-zinc-500">{item.sub}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold text-emerald-400">{item.completed}</div>
                        <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">Batas: {item.deadline}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* ── Sidebar ── */}
            <div className="space-y-6">

              {/* Integrasi LMS */}
              <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-indigo-400" /> Integrasi LMS
                </h3>
                <p className="text-zinc-500 text-xs leading-relaxed mb-4">
                  Sambungkan kelas virtual Arshaka Edu kamu langsung dengan Google Classroom atau Moodle.
                </p>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-white text-gray-800 font-bold rounded-xl text-xs hover:bg-zinc-100 transition-colors">
                    <span className="text-base">🧩</span> Hubungkan Google Classroom
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#f6821f] text-white font-bold rounded-xl text-xs hover:bg-[#e07216] transition-colors">
                    <span className="text-base">🔌</span> Hubungkan Moodle LMS
                  </button>
                </div>
              </div>

              {/* Panduan Mengajar Terbaru */}
              <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" /> Panduan Mengajar
                </h3>
                <div className="space-y-3">
                  {[
                    { title: 'RPP Eksperimen Gerak Lurus', size: '1.2 MB', ext: 'PDF' },
                    { title: 'Modul Guru: Kesetimbangan Reaksi', size: '2.4 MB', ext: 'PDF' },
                    { title: 'Panduan Asesmen Struktur Atom', size: '980 KB', ext: 'PDF' },
                  ].map((doc) => (
                    <div key={doc.title} className="flex justify-between items-center p-3 bg-black/20 rounded-xl border border-white/5 hover:border-purple-500/20 transition-all">
                      <div className="truncate pr-2">
                        <div className="text-xs font-bold text-white truncate">{doc.title}</div>
                        <span className="text-[9px] text-zinc-500 font-black">{doc.size}</span>
                      </div>
                      <span className="text-[9px] font-black text-purple-400 bg-purple-500/10 px-2 py-1 rounded">{doc.ext}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keluar Akun */}
              <form action={handleSignOut}>
                <button
                  id="btn-logout"
                  type="submit"
                  className="w-full flex items-center gap-3 p-4 bg-zinc-900 hover:bg-red-950/30 border border-white/5 hover:border-red-500/20 rounded-xl transition-all text-left group"
                >
                  <LogOut className="w-5 h-5 text-red-500 group-hover:translate-x-1 transition-transform" />
                  <span className="font-bold text-red-400">Keluar Akun</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-24 relative z-10">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* ── Header / Profile Summary ── */}
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start bg-zinc-900/50 p-8 rounded-3xl border border-white/5 mb-8">
          <Avatar name={user.name} image={user.image} />

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white mb-2">{user.name ?? 'Pengguna'}</h1>
            <p className="text-zinc-500 text-sm mb-3">{user.email}</p>
            <div className="text-zinc-400 flex flex-wrap gap-3 justify-center md:justify-start text-sm">
              <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20 capitalize">
                {role === 'student' ? '🎓 Pelajar' : role === 'teacher' ? '📖 Pengajar' : '⚙️ Admin'}
              </span>
              <span className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full border border-amber-500/20">
                <Trophy className="w-3.5 h-3.5" />
                {completedCount} Simulasi Selesai
              </span>
              {badgeCount > 0 && (
                <span className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full border border-purple-500/20">
                  🏅 {badgeCount} Badge
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button className="p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors relative" aria-label="Notifikasi">
              <Bell className="w-5 h-5 text-zinc-300" />
            </button>
            <button className="p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors" aria-label="Pengaturan">
              <Settings className="w-5 h-5 text-zinc-300" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Main Content ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Statistik Cepat */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: BookOpen, color: 'indigo', label: 'Simulasi', value: String(completedCount) },
                { icon: Clock, color: 'rose', label: 'Waktu', value: timeLabel },
                { icon: Award, color: 'amber', label: 'Badge', value: String(badgeCount) },
              ].map(({ icon: Icon, color, label, value }) => (
                <div key={label} className={`bg-zinc-900 border border-white/5 rounded-2xl p-5 text-center`}>
                  <div className={`w-10 h-10 rounded-xl bg-${color}-500/20 flex items-center justify-center mx-auto mb-3`}>
                    <Icon className={`w-5 h-5 text-${color}-400`} />
                  </div>
                  <div className="text-xl font-bold text-white mb-0.5">{value}</div>
                  <div className="text-xs text-zinc-500">{label}</div>
                </div>
              ))}
            </div>

            {/* Lanjutkan Belajar */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" /> Lanjutkan Belajar
              </h2>

              {completedCount === 0 ? (
                <div className="bg-zinc-900 border border-white/5 rounded-2xl p-8 text-center">
                  <div className="text-4xl mb-3">🔬</div>
                  <h3 className="font-bold text-white mb-2">Belum ada simulasi</h3>
                  <p className="text-zinc-400 text-sm mb-4">
                    Mulai eksplorasi dan progresmu akan muncul di sini!
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors text-sm"
                  >
                    Jelajahi Simulasi →
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  <Link href="/simulasi/gerak-lurus" className="group bg-zinc-900 border border-white/5 rounded-2xl p-5 hover:bg-zinc-800 transition-all hover:border-indigo-500/30">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                        <Atom className="w-5 h-5 text-purple-400" />
                      </div>
                      <span className="text-xs font-bold bg-zinc-800 px-2 py-1 rounded text-zinc-400">Fisika</span>
                    </div>
                    <h3 className="font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">Gerak Lurus</h3>
                    <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-3">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full" style={{ width: '30%' }} />
                    </div>
                    <div className="text-right text-[10px] text-zinc-500 font-bold mt-1">30% Selesai</div>
                  </Link>
                </div>
              )}
            </section>

            {/* Simulasi Tersimpan */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" /> Simulasi Populer
                </h2>
                <Link href="/" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                  Lihat Semua
                </Link>
              </div>

              <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden divide-y divide-white/5">
                {[
                  { emoji: '⚖️', title: 'Kesetimbangan Reaksi Kimia', sub: 'Kimia • SMA', href: '/simulasi/kesetimbangan-kimia' },
                  { emoji: '🧬', title: 'DNA & Replikasi', sub: 'Biologi • SMA–Kuliah', href: '/simulasi/dna-replikasi' },
                  { emoji: '⚡', title: 'Rangkaian Listrik DC', sub: 'Fisika • SMP–SMA', href: '/simulasi/rangkaian-listrik-dc' },
                ].map((item) => (
                  <Link key={item.href} href={item.href} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0 text-2xl">
                      {item.emoji}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-sm">{item.title}</h4>
                      <p className="text-xs text-zinc-400">{item.sub}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-600" />
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-6">

            {/* Badges */}
            <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" /> Pencapaian
              </h3>
              {badgeCount === 0 ? (
                <div className="text-center py-6">
                  <div className="text-3xl mb-2">🏅</div>
                  <p className="text-zinc-500 text-sm">Selesaikan simulasi untuk mendapatkan badge!</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  <div className="aspect-square bg-gradient-to-br from-yellow-500/20 to-orange-600/20 border border-yellow-500/30 rounded-xl flex flex-col items-center justify-center p-2">
                    <span className="text-2xl mb-1">🚀</span>
                    <span className="text-[9px] font-bold text-yellow-500 text-center uppercase">Penjelajah</span>
                  </div>
                  <div className="aspect-square bg-zinc-800 border border-zinc-700 rounded-xl flex flex-col items-center justify-center p-2 opacity-40">
                    <span className="text-2xl mb-1">⚛️</span>
                    <span className="text-[9px] font-bold text-zinc-500 text-center uppercase">Fisikawan</span>
                  </div>
                  <div className="aspect-square bg-zinc-800 border border-zinc-700 rounded-xl flex flex-col items-center justify-center p-2 opacity-40">
                    <span className="text-2xl mb-1">🌟</span>
                    <span className="text-[9px] font-bold text-zinc-500 text-center uppercase">Polymath</span>
                  </div>
                </div>
              )}
              <button className="w-full mt-4 text-xs font-bold text-zinc-400 hover:text-white py-2 bg-black/20 rounded-lg transition-colors">
                Lihat Semua Badge
              </button>
            </div>

            {/* Statistik */}
            <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6">
              <h3 className="font-bold text-white mb-4">Statistik Belajar</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><BookOpen className="w-4 h-4" /></div>
                    <span className="text-sm text-zinc-300">Simulasi Selesai</span>
                  </div>
                  <span className="font-bold text-white">{completedCount}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-500/20 rounded-lg text-rose-400"><Clock className="w-4 h-4" /></div>
                    <span className="text-sm text-zinc-300">Waktu Belajar</span>
                  </div>
                  <span className="font-bold text-white">{timeLabel}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400"><Trophy className="w-4 h-4" /></div>
                    <span className="text-sm text-zinc-300">Badge Diraih</span>
                  </div>
                  <span className="font-bold text-white">{badgeCount}</span>
                </div>
              </div>
            </div>

            {/* Logout */}
            <form action={handleSignOut}>
              <button
                id="btn-logout"
                type="submit"
                className="w-full flex items-center gap-3 p-4 bg-zinc-900 hover:bg-red-950/30 border border-white/5 hover:border-red-500/20 rounded-xl transition-all text-left group"
              >
                <LogOut className="w-5 h-5 text-red-500 group-hover:translate-x-1 transition-transform" />
                <span className="font-bold text-red-400">Keluar Akun</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
