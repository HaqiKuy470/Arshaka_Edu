import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { users, whitelistedEmails } from '@/lib/db/schema';
import { eq, count, desc } from 'drizzle-orm';
import Link from 'next/link';
import { Shield, Sparkles, ArrowLeft } from 'lucide-react';
import AdminClient from './AdminClient';

export default async function AdminPage() {
  const session = await auth();

  // Guard keamanan mutlak di tingkat server: hanya haqikuy470@gmail.com yang bisa masuk!
  if (!session?.user?.id || session.user.email !== 'haqikuy470@gmail.com') {
    redirect('/dashboard');
  }

  // Fetch data statistik secara paralel
  const [
    totalUsersRows,
    studentRows,
    teacherRows,
    adminRows,
    allUsers,
    allWhitelisted
  ] = await Promise.all([
    db.select({ count: count() }).from(users),
    db.select({ count: count() }).from(users).where(eq(users.role, 'student')),
    db.select({ count: count() }).from(users).where(eq(users.role, 'teacher')),
    db.select({ count: count() }).from(users).where(eq(users.role, 'admin')),
    db.select().from(users).orderBy(desc(users.createdAt)),
    db.select().from(whitelistedEmails).orderBy(desc(whitelistedEmails.createdAt)),
  ]);

  const stats = {
    totalUsers: totalUsersRows[0]?.count ?? 0,
    students: studentRows[0]?.count ?? 0,
    teachers: teacherRows[0]?.count ?? 0,
    admins: adminRows[0]?.count ?? 0,
  };

  // Bersihkan data user untuk props
  const sanitizedUsers = allUsers.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    image: u.image,
    role: u.role as 'student' | 'teacher' | 'admin',
    isOnboarded: u.isOnboarded,
    createdAt: u.createdAt,
  }));

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#050505] pt-24 pb-20 px-4">
      
      {/* Background Auras */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[60%] bg-pink-600/10 blur-[150px] rounded-full animate-pulse duration-[6s]" />
        <div className="absolute top-[20%] right-[-20%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10 space-y-10">
        
        {/* Navigation & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Kembali ke Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                <Shield className="w-5.5 h-5.5" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                  Pusat Kontrol Admin <span className="text-xs bg-pink-500/20 text-pink-400 border border-pink-500/30 px-2 py-0.5 rounded font-black tracking-widest uppercase">Root</span>
                </h1>
                <p className="text-zinc-500 text-xs font-medium mt-0.5">Sistem Administrasi Arshaka Edu terenkripsi &amp; aman.</p>
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/5 text-zinc-400 text-xs font-bold shrink-0">
            <Sparkles className="w-4 h-4 text-pink-400 animate-spin duration-[10s]" />
            Operator: haqikuy470@gmail.com
          </div>
        </div>

        {/* Client Interactive Component */}
        <AdminClient 
          initialUsers={sanitizedUsers} 
          stats={stats} 
          initialWhitelisted={allWhitelisted} 
        />

      </div>

    </div>
  );
}
