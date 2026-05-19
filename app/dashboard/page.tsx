import { auth, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { simulationProgress, simulationHistory, userBadges, submissions, assignments, classrooms } from '@/lib/db/schema';
import { eq, count, sum } from 'drizzle-orm';
import Link from 'next/link';
import {
  Award, BookOpen, Star, Clock, Trophy,
  Bell, Settings, ChevronRight, LogOut, Atom,
  Users, Layers, Plus, Link2, FileText, CheckSquare, GraduationCap
} from 'lucide-react';
import {
  CreateClassroomButton,
  EnrollClassroomButton,
  CreateAssignmentButton,
  CopyButton,
  EditProfileButton,
  GoogleClassroomButton,
  MoodleComingSoonButton
} from '@/components/dashboard/DashboardActions';
import {
  getTeacherClassrooms,
  getStudentClassrooms,
  getTeacherAssignments,
  getStudentAssignments,
  getClassroomStudentCounts,
  getActiveSimulationsList,
  getTeacherClassroomStudents
} from './queries';

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

  // Ambil statistik dasar dari database (paralel)
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

  // ─── RENDERING UNTUK GURU (TEACHER) ────────────────────────────────────────
  if (role === 'teacher') {
    const [
      teacherClassrooms,
      teacherAssignments,
      studentCounts,
      simulationsList,
      submissionRows,
      classroomStudents
    ] = await Promise.all([
      getTeacherClassrooms(userId),
      getTeacherAssignments(userId),
      getClassroomStudentCounts(userId),
      getActiveSimulationsList(),
      db.select({ grade: submissions.grade })
        .from(submissions)
        .innerJoin(assignments, eq(assignments.id, submissions.assignmentId))
        .innerJoin(classrooms, eq(classrooms.id, assignments.classroomId))
        .where(eq(classrooms.teacherId, userId)),
      getTeacherClassroomStudents(userId)
    ]);

    // Group students by classroomId
    const studentsByClassroom: Record<string, typeof classroomStudents> = {};
    for (const std of classroomStudents) {
      if (!studentsByClassroom[std.classroomId]) {
        studentsByClassroom[std.classroomId] = [];
      }
      studentsByClassroom[std.classroomId].push(std);
    }

    // Hitung akumulasi
    const totalStudents = Object.values(studentCounts).reduce((a, b) => a + b, 0);
    const activeTasks = teacherAssignments.length;
    const gradedSubmissions = submissionRows.map(s => s.grade).filter((g): g is number => g !== null);
    const averageGrade = gradedSubmissions.length > 0
      ? `${Math.round(gradedSubmissions.reduce((a, b) => a + b, 0) / gradedSubmissions.length)}%`
      : 'Belum Ada';

    // Skema warna kartu kelas virtual
    const colors = [
      'from-blue-600 to-cyan-400',
      'from-purple-600 to-pink-500',
      'from-indigo-600 to-blue-500',
      'from-green-600 to-emerald-400',
      'from-orange-600 to-amber-400'
    ];

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
                  {teacherClassrooms.length} Kelas Virtual
                </span>
                <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20 font-medium">
                  👥 {totalStudents} Siswa Terdaftar
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors relative" aria-label="Notifikasi">
                <Bell className="w-5 h-5 text-zinc-300" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full" />
              </button>
              <EditProfileButton initialName={user.name} initialImage={user.image} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Main Content ── */}
            <div className="lg:col-span-2 space-y-8">

              {/* Statistik Kelas Cepat */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Users, color: 'purple', label: 'Total Siswa', value: `${totalStudents} Siswa` },
                  { icon: CheckSquare, color: 'emerald', label: 'Tugas Aktif', value: `${activeTasks} Tugas` },
                  { icon: Layers, color: 'indigo', label: 'Rata-rata Nilai', value: averageGrade },
                ].map(({ icon: Icon, color, label, value }) => (
                  <div key={label} className={`bg-zinc-900 border border-white/5 rounded-2xl p-5 text-center`}>
                    <div className={`w-10 h-10 rounded-xl bg-${color}-500/20 flex items-center justify-center mx-auto mb-3`}>
                      <Icon className={`w-5 h-5 text-${color}-400`} />
                    </div>
                    <div className="text-lg font-bold text-white mb-0.5">{value}</div>
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
                  <CreateClassroomButton />
                </div>

                {teacherClassrooms.length === 0 ? (
                  <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 text-center space-y-3">
                    <div className="text-4xl">🏫</div>
                    <h3 className="font-bold text-white">Belum Ada Kelas</h3>
                    <p className="text-zinc-500 text-sm max-w-sm mx-auto">
                      Buat kelas virtual baru dan bagikan kodenya agar siswa dapat bergabung dan menerima penugasan eksperimen virtual.
                    </p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {teacherClassrooms.map((cls, idx) => {
                      const count = studentCounts[cls.id] || 0;
                      const color = colors[idx % colors.length];
                          const classStudents = studentsByClassroom[cls.id] || [];
                          return (
                            <div key={cls.id} className="group bg-zinc-900 border border-white/5 rounded-2xl p-5 hover:bg-zinc-800 transition-all hover:border-purple-500/30">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3 className="font-bold text-white mb-0.5 group-hover:text-purple-400 transition-colors">{cls.name}</h3>
                                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{count} Siswa Terdaftar</span>
                                </div>
                                <span className="text-xs font-bold bg-zinc-800 px-2 py-1 rounded text-zinc-400">{cls.subject}</span>
                              </div>
                              
                              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
                                <span>Kode Gabung:</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded">{cls.code}</span>
                                  <CopyButton text={cls.code} />
                                </div>
                              </div>

                              {/* List of Enrolled Students with Emails */}
                              <details className="mt-4 pt-4 border-t border-white/5 group/details text-xs">
                                <summary className="font-bold text-zinc-400 cursor-pointer hover:text-white flex justify-between items-center outline-none list-none select-none">
                                  <span>Lihat Siswa ({classStudents.length})</span>
                                  <span className="text-[10px] text-zinc-600 group-open/details:rotate-180 transition-transform">▼</span>
                                </summary>
                                {classStudents.length === 0 ? (
                                  <p className="text-zinc-600 mt-2 text-[10px] italic">Belum ada siswa yang bergabung.</p>
                                ) : (
                                  <div className="mt-3 space-y-2 max-h-36 overflow-y-auto pr-1">
                                    {classStudents.map((std) => (
                                      <div key={std.studentId} className="flex items-center gap-2 py-1.5 border-b border-white/5 last:border-0 text-left">
                                        {std.image ? (
                                          <img src={std.image} alt={std.name || 'Siswa'} className="w-5 h-5 rounded-full object-cover shrink-0" />
                                        ) : (
                                          <div className="w-5 h-5 bg-zinc-800 rounded-full flex items-center justify-center text-[9px] font-bold text-indigo-400 shrink-0">
                                            {std.name ? std.name[0].toUpperCase() : '?'}
                                          </div>
                                        )}
                                        <div className="min-w-0 flex-1">
                                          <div className="font-semibold text-zinc-200 truncate text-[11px]">{std.name}</div>
                                          <div className="text-[9px] text-zinc-500 truncate leading-none mt-0.5">{std.email}</div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </details>
                            </div>
                          );
                    })}
                  </div>
                )}
              </section>

              {/* Tugas & Simulasi Terkini */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-emerald-400" /> Tugas & Simulasi Terkini
                  </h2>
                  <CreateAssignmentButton classroomsList={teacherClassrooms} simulationsList={simulationsList} />
                </div>

                {teacherAssignments.length === 0 ? (
                  <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 text-center space-y-2">
                    <div className="text-3xl">🧪</div>
                    <h3 className="font-bold text-white">Belum Ada Tugas Aktif</h3>
                    <p className="text-zinc-500 text-sm">Klik tombol &quot;Buat Tugas&quot; di atas untuk menugaskan eksperimen kepada kelas Anda.</p>
                  </div>
                ) : (
                  <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden divide-y divide-white/5">
                    {teacherAssignments.map((item) => {
                      const formattedDate = item.dueDate
                        ? new Date(item.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                        : 'Tidak Ada';

                      return (
                        <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                          <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0 text-2xl">
                            🔬
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-white text-sm truncate">{item.title}</h4>
                            <p className="text-xs text-zinc-500 truncate">
                              Kelas: {item.classroomName} • Simulasi: {item.simulationTitle}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs font-bold text-emerald-400">Aktif</div>
                            <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">
                              Batas: {formattedDate}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
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
                  <GoogleClassroomButton />
                  <MoodleComingSoonButton />
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

  // ─── RENDERING UNTUK SISWA (STUDENT) ────────────────────────────────────────
  const [
    studentClassrooms,
    studentAssignments
  ] = await Promise.all([
    getStudentClassrooms(userId),
    getStudentAssignments(userId)
  ]);

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
              <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20 capitalize font-bold">
                🎓 Pelajar (Student)
              </span>
              <span className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full border border-amber-500/20 font-medium">
                <Trophy className="w-3.5 h-3.5" />
                {completedCount} Simulasi Selesai
              </span>
              {badgeCount > 0 && (
                <span className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full border border-purple-500/20 font-medium">
                  🏅 {badgeCount} Badge Diraih
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button className="p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors relative" aria-label="Notifikasi">
              <Bell className="w-5 h-5 text-zinc-300" />
            </button>
            <EditProfileButton initialName={user.name} initialImage={user.image} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Main Content ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Statistik Cepat */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: BookOpen, color: 'indigo', label: 'Simulasi', value: String(completedCount) },
                { icon: Clock, color: 'rose', label: 'Waktu Belajar', value: timeLabel },
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

            {/* Kelas Virtual Saya */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-400" /> Kelas Virtual Saya
                </h2>
                <EnrollClassroomButton />
              </div>

              {studentClassrooms.length === 0 ? (
                <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 text-center space-y-3">
                  <div className="text-4xl">🏫</div>
                  <h3 className="font-bold text-white">Belum Bergabung ke Kelas</h3>
                  <p className="text-zinc-500 text-sm max-w-sm mx-auto">
                    Hubungi Guru Anda untuk mendapatkan Kode Kelas dan masukkan dengan mengeklik tombol &quot;Gabung Kelas&quot; di atas.
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {studentClassrooms.map((cls) => (
                    <div key={cls.id} className="bg-zinc-900 border border-white/5 rounded-2xl p-5 hover:border-indigo-500/30 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-white text-base">{cls.name}</h3>
                        <span className="text-[10px] font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded">
                          {cls.subject}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500">Pengajar: {cls.teacherName ?? 'Guru'}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Tugas Kelas Virtual */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-400" /> Tugas Kelas Virtual
              </h2>

              {studentAssignments.length === 0 ? (
                <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 text-center space-y-2">
                  <div className="text-3xl">📝</div>
                  <h3 className="font-bold text-white">Bebas Tugas!</h3>
                  <p className="text-zinc-500 text-sm">Tidak ada tugas praktikum aktif dari kelas Anda saat ini.</p>
                </div>
              ) : (
                <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden divide-y divide-white/5">
                  {studentAssignments.map((task) => {
                    const formattedDate = task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                      : 'Tidak Ada';

                    const isCompleted = task.submissionStatus === 'completed';

                    return (
                      <div key={task.id} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0 text-2xl">
                          📝
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-white text-sm truncate">{task.title}</h4>
                          <p className="text-xs text-zinc-500 truncate">
                            Kelas: {task.classroomName} • Simulasi: {task.simulationTitle}
                          </p>
                          {task.instructions && (
                            <p className="text-[10px] text-zinc-400 truncate mt-1 italic">
                              &quot;{task.instructions}&quot;
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          {isCompleted ? (
                            <>
                              <div className="text-xs font-bold text-emerald-400">Selesai</div>
                              {task.submissionGrade !== null && (
                                <div className="text-sm font-bold text-purple-400">Nilai: {task.submissionGrade}</div>
                              )}
                            </>
                          ) : (
                            <Link
                              href={`/simulasi/${task.simulationSlug}`}
                              className="inline-block text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Mulai Praktikum
                            </Link>
                          )}
                          <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-black mt-1">
                            Batas: {formattedDate}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
                  <div className="aspect-square bg-gradient-to-br from-yellow-500/20 to-orange-600/20 border border-yellow-500/30 rounded-xl flex flex-col items-center justify-center p-2 animate-pulse">
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

            {/* Statistik Belajar */}
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
