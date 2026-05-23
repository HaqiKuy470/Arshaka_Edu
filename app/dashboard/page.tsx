import { auth, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { simulationProgress, simulationHistory, userBadges, submissions, assignments, classrooms } from '@/lib/db/schema';
import { eq, count, sum } from 'drizzle-orm';
import Link from 'next/link';
import {
  Award, BookOpen, Clock, Trophy, Bell, Settings,
  LogOut, Users, Layers, Plus, Link2, FileText,
  CheckSquare, GraduationCap, ChevronDown, Copy
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

// ── Avatar ──────────────────────────────────────────────────────────────────
function Avatar({ name, image, size = "lg" }: {
  name?: string | null;
  image?: string | null;
  size?: "sm" | "lg";
}) {
  const dim = size === "lg" ? "w-16 h-16 sm:w-20 sm:h-20" : "w-8 h-8";
  const text = size === "lg" ? "text-2xl sm:text-3xl" : "text-sm";
  const initials = name
    ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '??';

  if (image) return (
    <img
      src={image}
      alt={name ?? 'User'}
      className={`${dim} rounded-2xl object-cover border border-white/10 shadow-lg shadow-indigo-900/20 shrink-0`}
    />
  );

  return (
    <div className={`${dim} bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center ${text} font-black shadow-lg shadow-indigo-900/20 shrink-0`}>
      {initials}
    </div>
  );
}

// ── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 bg-zinc-900/50 border border-white/[0.07] rounded-2xl p-4 sm:p-5 text-center">
      <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-lg sm:text-xl font-black text-white tracking-tight">{value}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{label}</span>
    </div>
  );
}

// ── Section Header ──────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, iconColor, action }: {
  icon: React.ElementType;
  title: string;
  iconColor: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-4 sm:mb-5">
      <h2 className="flex items-center gap-2 text-sm sm:text-base font-black text-white uppercase tracking-tight">
        <Icon className={`w-4 h-4 ${iconColor} shrink-0`} />
        {title}
      </h2>
      {action}
    </div>
  );
}

// ── Empty State ─────────────────────────────────────────────────────────────
function EmptyState({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 sm:py-12 px-6 bg-zinc-900/40 border border-white/[0.06] rounded-2xl text-center">
      <span className="text-3xl">{emoji}</span>
      <h3 className="font-black text-white text-sm">{title}</h3>
      <p className="text-zinc-500 text-xs leading-relaxed max-w-xs">{desc}</p>
    </div>
  );
}

// ── Server Action ───────────────────────────────────────────────────────────
async function handleSignOut() {
  'use server';
  await signOut({ redirectTo: '/' });
}

// ── Dashboard Page ──────────────────────────────────────────────────────────
export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const user = session.user;
  const isOnboarded = (user as any).isOnboarded ?? false;
  if (!isOnboarded) redirect('/onboarding');

  const userId = session.user.id;
  const role = (user as any).role ?? 'student';

  const [progressRows, historyRows, badgeRows] = await Promise.all([
    db.select({ count: count() }).from(simulationProgress).where(eq(simulationProgress.userId, userId)),
    db.select({ total: sum(simulationHistory.durationSeconds) }).from(simulationHistory).where(eq(simulationHistory.userId, userId)),
    db.select({ count: count() }).from(userBadges).where(eq(userBadges.userId, userId)),
  ]);

  const completedCount = progressRows[0]?.count ?? 0;
  const totalSeconds = Number(historyRows[0]?.total ?? 0);
  const totalHours = Math.floor(totalSeconds / 3600);
  const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
  const timeLabel = totalHours > 0
    ? `${totalHours}j ${totalMinutes}m`
    : totalMinutes > 0 ? `${totalMinutes}m` : '0m';
  const badgeCount = badgeRows[0]?.count ?? 0;

  // ── TEACHER VIEW ──────────────────────────────────────────────────────────
  if (role === 'teacher') {
    const [
      teacherClassrooms, teacherAssignments, studentCounts,
      simulationsList, submissionRows, classroomStudents
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

    const studentsByClassroom: Record<string, typeof classroomStudents> = {};
    for (const s of classroomStudents) {
      if (!studentsByClassroom[s.classroomId]) studentsByClassroom[s.classroomId] = [];
      studentsByClassroom[s.classroomId].push(s);
    }

    const totalStudents = Object.values(studentCounts).reduce((a, b) => a + b, 0);
    const activeTasks = teacherAssignments.length;
    const graded = submissionRows.map(s => s.grade).filter((g): g is number => g !== null);
    const averageGrade = graded.length > 0
      ? `${Math.round(graded.reduce((a, b) => a + b, 0) / graded.length)}%`
      : '—';

    const cardColors = [
      'from-blue-600/20 to-cyan-600/10 border-blue-500/20',
      'from-purple-600/20 to-pink-600/10 border-purple-500/20',
      'from-indigo-600/20 to-blue-600/10 border-indigo-500/20',
      'from-green-600/20 to-emerald-600/10 border-green-500/20',
      'from-orange-600/20 to-amber-600/10 border-orange-500/20',
    ];

    return (
      <div className="min-h-screen bg-[#060608] pt-14 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-5 sm:px-6 py-8">

          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-center sm:items-start bg-zinc-900/50 border border-white/[0.07] rounded-2xl sm:rounded-[24px] p-5 sm:p-6 mb-6 sm:mb-8">
            <Avatar name={user.name} image={user.image} />

            <div className="flex-1 text-center sm:text-left min-w-0">
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight truncate">
                {user.name ?? 'Pengguna'}
              </h1>
              <p className="text-xs text-zinc-500 font-medium mt-0.5 mb-3 truncate">{user.email}</p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-1 rounded-lg">
                  🏫 Pengajar
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                  <Users className="w-3 h-3" />
                  {teacherClassrooms.length} Kelas
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-lg">
                  👥 {totalStudents} Siswa
                </span>
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              <button className="relative w-9 h-9 bg-zinc-800 hover:bg-zinc-700 border border-white/[0.07] rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-all">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
              </button>
              <EditProfileButton initialName={user.name} initialImage={user.image} />
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <StatCard icon={Users} label="Total Siswa" value={`${totalStudents}`} color="bg-purple-500/15 text-purple-400" />
            <StatCard icon={CheckSquare} label="Tugas Aktif" value={`${activeTasks}`} color="bg-emerald-500/15 text-emerald-400" />
            <StatCard icon={Layers} label="Rerata Nilai" value={averageGrade} color="bg-indigo-500/15 text-indigo-400" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

            {/* Main */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">

              {/* Kelas Virtual */}
              <section>
                <SectionHeader
                  icon={GraduationCap} title="Kelas Virtual" iconColor="text-purple-400"
                  action={<CreateClassroomButton />}
                />
                {teacherClassrooms.length === 0 ? (
                  <EmptyState emoji="🏫" title="Belum Ada Kelas"
                    desc="Buat kelas virtual baru dan bagikan kodenya agar siswa dapat bergabung dan menerima penugasan." />
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    {teacherClassrooms.map((cls, idx) => {
                      const cnt = studentCounts[cls.id] || 0;
                      const color = cardColors[idx % cardColors.length];
                      const students = studentsByClassroom[cls.id] || [];
                      return (
                        <div key={cls.id} className={`group bg-gradient-to-br ${color} border rounded-2xl p-4 sm:p-5 hover:border-opacity-60 transition-all duration-300`}>
                          <div className="flex justify-between items-start mb-3">
                            <div className="min-w-0 flex-1 pr-2">
                              <h3 className="font-black text-white text-sm truncate">{cls.name}</h3>
                              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">{cnt} Siswa</p>
                            </div>
                            <span className="shrink-0 text-[9px] font-black bg-white/5 border border-white/10 text-zinc-400 px-2 py-1 rounded-lg uppercase tracking-widest">
                              {cls.subject}
                            </span>
                          </div>

                          {/* Kode */}
                          <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Kode Kelas</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-sm text-purple-400">{cls.code}</span>
                              <CopyButton text={cls.code} />
                            </div>
                          </div>

                          {/* Students expandable */}
                          <details className="mt-3 pt-3 border-t border-white/[0.06]">
                            <summary className="flex items-center justify-between text-[10px] font-black text-zinc-500 hover:text-white cursor-pointer transition-colors list-none select-none">
                              <span>Daftar Siswa ({students.length})</span>
                              <ChevronDown className="w-3 h-3" />
                            </summary>
                            {students.length === 0 ? (
                              <p className="text-[10px] text-zinc-700 mt-2 italic">Belum ada siswa.</p>
                            ) : (
                              <div className="mt-2.5 space-y-1.5 max-h-32 overflow-y-auto">
                                {students.map(s => (
                                  <div key={s.studentId} className="flex items-center gap-2">
                                    {s.image
                                      ? <img src={s.image} alt="" className="w-5 h-5 rounded-full object-cover shrink-0" />
                                      : <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[9px] font-black text-indigo-400 shrink-0">
                                          {s.name?.[0]?.toUpperCase() ?? '?'}
                                        </div>
                                    }
                                    <div className="min-w-0">
                                      <p className="text-[11px] font-semibold text-zinc-300 truncate">{s.name}</p>
                                      <p className="text-[9px] text-zinc-600 truncate">{s.email}</p>
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

              {/* Tugas Terkini */}
              <section>
                <SectionHeader
                  icon={CheckSquare} title="Tugas & Eksperimen" iconColor="text-emerald-400"
                  action={<CreateAssignmentButton classroomsList={teacherClassrooms} simulationsList={simulationsList} />}
                />
                {teacherAssignments.length === 0 ? (
                  <EmptyState emoji="🧪" title="Belum Ada Tugas"
                    desc='Klik "Buat Tugas" untuk menugaskan eksperimen kepada kelas Anda.' />
                ) : (
                  <div className="bg-zinc-900/50 border border-white/[0.07] rounded-2xl overflow-hidden divide-y divide-white/[0.05]">
                    {teacherAssignments.map(item => {
                      const date = item.dueDate
                        ? new Date(item.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                        : '—';
                      return (
                        <div key={item.id} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 hover:bg-white/[0.03] transition-colors">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-lg shrink-0">🔬</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-black text-white text-xs sm:text-sm truncate">{item.title}</h4>
                            <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                              {item.classroomName} · {item.simulationTitle}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Aktif</div>
                            <div className="text-[9px] text-zinc-600 font-bold mt-0.5">Batas: {date}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-5">
              {/* LMS Integration */}
              <div className="bg-zinc-900/50 border border-white/[0.07] rounded-2xl p-4 sm:p-5">
                <h3 className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-wider mb-3">
                  <Link2 className="w-4 h-4 text-indigo-400" /> Integrasi LMS
                </h3>
                <p className="text-zinc-600 text-[11px] leading-relaxed mb-3">
                  Sambungkan kelas virtual dengan Google Classroom atau Moodle.
                </p>
                <div className="space-y-2">
                  <GoogleClassroomButton />
                  <MoodleComingSoonButton />
                </div>
              </div>

              {/* Teaching Guides */}
              <div className="bg-zinc-900/50 border border-white/[0.07] rounded-2xl p-4 sm:p-5">
                <h3 className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-wider mb-3">
                  <FileText className="w-4 h-4 text-purple-400" /> Panduan Mengajar
                </h3>
                <div className="space-y-2">
                  {[
                    { title: 'RPP Eksperimen Gerak Lurus', size: '1.2 MB' },
                    { title: 'Modul Guru: Kesetimbangan Reaksi', size: '2.4 MB' },
                    { title: 'Panduan Asesmen Struktur Atom', size: '980 KB' },
                  ].map(doc => (
                    <div key={doc.title} className="flex items-center justify-between gap-2 p-3 bg-black/20 border border-white/[0.05] hover:border-purple-500/20 rounded-xl transition-all">
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-white truncate">{doc.title}</p>
                        <p className="text-[9px] text-zinc-600 font-bold mt-0.5">{doc.size}</p>
                      </div>
                      <span className="shrink-0 text-[9px] font-black text-purple-400 bg-purple-500/10 px-2 py-1 rounded-lg">PDF</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logout */}
              <form action={handleSignOut}>
                <button type="submit" className="w-full flex items-center gap-3 p-3.5 bg-zinc-900/50 hover:bg-red-950/30 border border-white/[0.07] hover:border-red-500/20 rounded-xl transition-all text-left group">
                  <LogOut className="w-4 h-4 text-red-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  <span className="text-xs font-black text-red-400">Keluar Akun</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── STUDENT VIEW ──────────────────────────────────────────────────────────
  const [studentClassrooms, studentAssignments] = await Promise.all([
    getStudentClassrooms(userId),
    getStudentAssignments(userId),
  ]);

  return (
    <div className="min-h-screen bg-[#060608] pt-14 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 sm:px-6 py-8">

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-center sm:items-start bg-zinc-900/50 border border-white/[0.07] rounded-2xl sm:rounded-[24px] p-5 sm:p-6 mb-6 sm:mb-8">
          <Avatar name={user.name} image={user.image} />

          <div className="flex-1 text-center sm:text-left min-w-0">
            <h1 className="text-lg sm:text-xl font-black text-white tracking-tight truncate">
              {user.name ?? 'Pengguna'}
            </h1>
            <p className="text-xs text-zinc-500 font-medium mt-0.5 mb-3 truncate">{user.email}</p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-lg">
                🎓 Pelajar
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                <Trophy className="w-3 h-3" />
                {completedCount} Simulasi
              </span>
              {badgeCount > 0 && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-1 rounded-lg">
                  🏅 {badgeCount} Badge
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <button className="w-9 h-9 bg-zinc-800 hover:bg-zinc-700 border border-white/[0.07] rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-all">
              <Bell className="w-4 h-4" />
            </button>
            <EditProfileButton initialName={user.name} initialImage={user.image} />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard icon={BookOpen} label="Simulasi" value={String(completedCount)} color="bg-indigo-500/15 text-indigo-400" />
          <StatCard icon={Clock} label="Waktu" value={timeLabel} color="bg-rose-500/15 text-rose-400" />
          <StatCard icon={Award} label="Badge" value={String(badgeCount)} color="bg-amber-500/15 text-amber-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

          {/* Main */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">

            {/* Kelas */}
            <section>
              <SectionHeader
                icon={GraduationCap} title="Kelas Virtual Saya" iconColor="text-indigo-400"
                action={<EnrollClassroomButton />}
              />
              {studentClassrooms.length === 0 ? (
                <EmptyState emoji="🏫" title="Belum Bergabung Kelas"
                  desc="Hubungi guru Anda untuk mendapatkan kode kelas, lalu klik Gabung Kelas." />
              ) : (
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  {studentClassrooms.map(cls => (
                    <div key={cls.id} className="bg-zinc-900/50 border border-white/[0.07] hover:border-indigo-500/25 rounded-2xl p-4 sm:p-5 transition-all duration-300">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="font-black text-white text-sm truncate">{cls.name}</h3>
                        <span className="shrink-0 text-[9px] font-black bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-lg">{cls.subject}</span>
                      </div>
                      <p className="text-[11px] text-zinc-500">Pengajar: {cls.teacherName ?? 'Guru'}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Tugas */}
            <section>
              <SectionHeader icon={CheckSquare} title="Tugas Praktikum" iconColor="text-emerald-400" />
              {studentAssignments.length === 0 ? (
                <EmptyState emoji="📝" title="Bebas Tugas!"
                  desc="Tidak ada tugas praktikum aktif dari kelas Anda saat ini." />
              ) : (
                <div className="bg-zinc-900/50 border border-white/[0.07] rounded-2xl overflow-hidden divide-y divide-white/[0.05]">
                  {studentAssignments.map(task => {
                    const date = task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                      : '—';
                    const done = task.submissionStatus === 'completed';
                    return (
                      <div key={task.id} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 hover:bg-white/[0.03] transition-colors">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-lg shrink-0">📝</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-white text-xs sm:text-sm truncate">{task.title}</h4>
                          <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                            {task.classroomName} · {task.simulationTitle}
                          </p>
                          {task.instructions && (
                            <p className="text-[9px] text-zinc-600 italic truncate mt-0.5">"{task.instructions}"</p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          {done ? (
                            <>
                              <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Selesai</div>
                              {task.submissionGrade != null && (
                                <div className="text-xs font-black text-purple-400 mt-0.5">{task.submissionGrade}</div>
                              )}
                            </>
                          ) : (
                            <Link
                              href={`/simulasi/${task.simulationSlug}`}
                              className="inline-flex items-center text-[10px] font-black bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white px-3 py-1.5 rounded-lg transition-all uppercase tracking-widest"
                            >
                              Mulai
                            </Link>
                          )}
                          <div className="text-[9px] text-zinc-600 font-bold mt-1">Batas: {date}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-5">

            {/* Badges */}
            <div className="bg-zinc-900/50 border border-white/[0.07] rounded-2xl p-4 sm:p-5">
              <h3 className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-wider mb-4">
                <Award className="w-4 h-4 text-amber-400" /> Pencapaian
              </h3>
              {badgeCount === 0 ? (
                <div className="text-center py-5">
                  <p className="text-2xl mb-2">🏅</p>
                  <p className="text-zinc-600 text-xs">Selesaikan simulasi untuk mendapat badge!</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { e: '🚀', l: 'Penjelajah', active: true },
                    { e: '⚛️', l: 'Fisikawan', active: false },
                    { e: '🌟', l: 'Polymath', active: false },
                  ].map(b => (
                    <div key={b.l} className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 p-2 border transition-all ${
                      b.active
                        ? 'bg-yellow-500/10 border-yellow-500/30'
                        : 'bg-zinc-800/50 border-zinc-700/50 opacity-40'
                    }`}>
                      <span className="text-xl">{b.e}</span>
                      <span className="text-[8px] font-black text-center uppercase tracking-wider text-zinc-400">{b.l}</span>
                    </div>
                  ))}
                </div>
              )}
              <button className="w-full mt-3 text-[10px] font-black text-zinc-600 hover:text-white py-2 bg-black/20 hover:bg-black/40 rounded-xl transition-colors uppercase tracking-widest">
                Lihat Semua Badge
              </button>
            </div>

            {/* Stats detail */}
            <div className="bg-zinc-900/50 border border-white/[0.07] rounded-2xl p-4 sm:p-5">
              <h3 className="text-xs font-black text-white uppercase tracking-wider mb-4">Statistik Belajar</h3>
              <div className="space-y-3">
                {[
                  { icon: BookOpen, label: 'Simulasi Selesai', value: String(completedCount), color: 'bg-indigo-500/15 text-indigo-400' },
                  { icon: Clock, label: 'Waktu Belajar', value: timeLabel, color: 'bg-rose-500/15 text-rose-400' },
                  { icon: Trophy, label: 'Badge Diraih', value: String(badgeCount), color: 'bg-amber-500/15 text-amber-400' },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between py-2.5 border-b border-white/[0.05] last:border-0">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg ${s.color} flex items-center justify-center`}>
                        <s.icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs text-zinc-400">{s.label}</span>
                    </div>
                    <span className="text-xs font-black text-white">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Logout */}
            <form action={handleSignOut}>
              <button type="submit" className="w-full flex items-center gap-3 p-3.5 bg-zinc-900/50 hover:bg-red-950/30 border border-white/[0.07] hover:border-red-500/20 rounded-xl transition-all text-left group">
                <LogOut className="w-4 h-4 text-red-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
                <span className="text-xs font-black text-red-400">Keluar Akun</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}