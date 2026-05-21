'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// router tidak dibutuhkan — kita pakai hard redirect setelah onboarding
import { 
  GraduationCap, 
  Presentation, 
  ChevronRight, 
  Sparkles, 
  ArrowRight, 
  Loader2, 
  Check, 
  Atom,
  BookOpen
} from 'lucide-react';
import { completeOnboarding } from './actions';

interface OnboardingClientProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function OnboardingClient({ user }: OnboardingClientProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<'student' | 'teacher' | null>(null);
  const [grade, setGrade] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelect = (selectedRole: 'student' | 'teacher') => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleFinish = async () => {
    if (!role) return;
    setLoading(true);
    setError(null);

    const result = await completeOnboarding({
      role,
      grade: role === 'student' ? grade : undefined,
    });

    if (result.success) {
      // Gunakan hard redirect agar browser meminta session JWT baru dari server.
      // Kalau pakai router.push(), cookie JWT lama yang masih isOnboarded:false
      // akan menyebabkan loop redirect antara /onboarding dan /dashboard.
      window.location.href = '/dashboard';
    } else {
      setError(result.error || 'Terjadi kesalahan sistem');
      setLoading(false);
    }
  };

  const grades = [
    { value: 'SD', label: 'Sekolah Dasar (SD)' },
    { value: 'SMP', label: 'Sekolah Menengah Pertama (SMP)' },
    { value: 'SMA', label: 'Sekolah Menengah Atas (SMA)' },
    { value: 'Kuliah', label: 'Perguruan Tinggi / Kuliah' },
    { value: 'Umum', label: 'Masyarakat Umum / Praktisi' },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Header Info */}
      <div className="text-center mb-10 md:mb-14 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">
          <Sparkles className="w-3.5 h-3.5" />
          Onboarding Akun Baru
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white">
          HALO, <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent uppercase">{user.name?.split(' ')[0] ?? 'TEMAN'}</span>!
        </h2>
        <p className="text-zinc-500 max-w-md mx-auto text-sm md:text-base font-medium">
          Sebelum mulai mengeksplorasi laboratorium virtual, mari sesuaikan profil belajarmu.
        </p>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center gap-3 mb-10">
        <div className={`h-1.5 w-16 rounded-full transition-colors duration-500 ${step >= 1 ? 'bg-indigo-500' : 'bg-white/10'}`} />
        <div className={`h-1.5 w-16 rounded-full transition-colors duration-500 ${step >= 2 ? 'bg-purple-500' : 'bg-white/10'}`} />
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full grid md:grid-cols-2 gap-6"
          >
            {/* Siswa Card */}
            <button
              type="button"
              onClick={() => handleRoleSelect('student')}
              className="group text-left relative rounded-[32px] bg-zinc-900/40 border border-white/5 hover:border-indigo-500/30 p-8 sm:p-10 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none group-hover:bg-indigo-500/10 transition-colors duration-500" />
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform duration-500">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Saya adalah Siswa</h3>
                  <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mt-1">Eksplorasi Mandiri & Praktikum</p>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                  Saya ingin belajar sains dengan cara yang menyenangkan, merekam hasil eksperimen, serta meraih poin dan badge penjelajah!
                </p>
              </div>
              <div className="pt-8 border-t border-white/5 mt-8 flex items-center justify-between w-full">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Pilih sebagai Siswa</span>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                  <ChevronRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </button>

            {/* Guru Card */}
            <button
              type="button"
              onClick={() => handleRoleSelect('teacher')}
              className="group text-left relative rounded-[32px] bg-zinc-900/40 border border-white/5 hover:border-purple-500/30 p-8 sm:p-10 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full pointer-events-none group-hover:bg-purple-500/10 transition-colors duration-500" />
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform duration-500">
                  <Presentation className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Saya adalah Guru</h3>
                  <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mt-1">Manajemen Kelas & Penugasan</p>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                  Saya ingin membuat kelas virtual, memantau perkembangan siswa, memberikan tugas berbasis simulasi, dan mengunduh panduan mengajar.
                </p>
              </div>
              <div className="pt-8 border-t border-white/5 mt-8 flex items-center justify-between w-full">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Pilih sebagai Guru</span>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                  <ChevronRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-xl mx-auto bg-zinc-900/50 border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-zinc-500 hover:text-white transition-colors"
                >
                  ← Kembali
                </button>
                <div className="h-4 w-[1px] bg-white/10" />
                <span className="text-xs font-black text-purple-400 uppercase tracking-wider">
                  Peran terpilih: {role === 'student' ? '🎓 Siswa' : '🏫 Guru'}
                </span>
              </div>

              {role === 'student' ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-400" /> Pilih Jenjang Pendidikan
                  </h3>
                  <p className="text-zinc-500 text-xs font-medium">
                    Kami akan mengoptimalkan rekomendasi simulasi sains sesuai dengan tingkatan sekolahmu saat ini.
                  </p>
                  
                  <div className="space-y-2.5 pt-2">
                    {grades.map((g) => (
                      <button
                        key={g.value}
                        onClick={() => setGrade(g.value)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left font-bold text-sm ${
                          grade === g.value
                            ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-lg shadow-indigo-600/5'
                            : 'bg-black/20 border-white/5 hover:border-white/10 text-zinc-400'
                        }`}
                      >
                        {g.label}
                        {grade === g.value && (
                          <Check className="w-4 h-4 text-indigo-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6 py-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Atom className="w-5 h-5 text-purple-400" /> Profil Pengajar Siap!
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Sebagai seorang <strong>Guru</strong>, kamu akan langsung terdaftar dengan akses penuh ke fitur management pengajaran kami. Kamu bisa membuat kelas, membagikan panduan praktikum, dan mensinkronisasikan tugas ke Google Classroom.
                  </p>
                  <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-2xl flex items-center gap-3">
                    <span className="text-2xl">🗒️</span>
                    <p className="text-xs text-zinc-400 font-medium">
                      Anda bisa mengganti mata pelajaran atau melengkapi data pengajaran tambahan kapan saja di halaman pengaturan dashboard guru.
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-400 text-center">
                  {error}
                </div>
              )}

              <button
                disabled={loading || (role === 'student' && !grade)}
                onClick={handleFinish}
                className="w-full flex items-center justify-center gap-2 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 disabled:pointer-events-none text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-xl shadow-indigo-600/10 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan Profil...
                  </>
                ) : (
                  <>
                    Selesaikan &amp; Masuk Dashboard <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
