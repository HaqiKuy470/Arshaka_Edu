'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Presentation, ChevronRight,
  Sparkles, ArrowRight, Loader2, Check, Atom, BookOpen
} from 'lucide-react';
import { completeOnboarding } from './actions';

interface OnboardingClientProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const GRADES = [
  { value: 'SD',      label: 'Sekolah Dasar (SD)' },
  { value: 'SMP',     label: 'SMP / Sederajat' },
  { value: 'SMA',     label: 'SMA / Sederajat' },
  { value: 'Kuliah',  label: 'Perguruan Tinggi' },
  { value: 'Umum',    label: 'Masyarakat Umum / Praktisi' },
];

export default function OnboardingClient({ user }: OnboardingClientProps) {
  const [step, setStep]     = useState<1 | 2>(1);
  const [role, setRole]     = useState<'student' | 'teacher' | null>(null);
  const [grade, setGrade]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  const selectRole = (r: 'student' | 'teacher') => {
    setRole(r);
    setStep(2);
  };

  const handleFinish = async () => {
    if (!role) return;
    setLoading(true);
    setError(null);
    const result = await completeOnboarding({ role, grade: role === 'student' ? grade : undefined });
    if (result.success) {
      window.location.href = '/dashboard';
    } else {
      setError(result.error || 'Terjadi kesalahan sistem');
      setLoading(false);
    }
  };

  const firstName = user.name?.split(' ')[0]?.toUpperCase() ?? 'TEMAN';

  return (
    <div className="min-h-screen bg-[#060608] flex flex-col items-center justify-center px-5 py-16 sm:py-20">

      {/* Ambient aura */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-700/8 blur-[160px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-700/8 blur-[140px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">

        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 space-y-3 sm:space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.18em] text-indigo-300">
            <Sparkles className="w-3 h-3" />
            Onboarding Akun Baru
          </span>

          <h2 className="text-[clamp(1.8rem,7vw,3.2rem)] font-black tracking-tighter text-white leading-[1]">
            HALO,{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {firstName}
            </span>!
          </h2>

          <p className="text-zinc-500 text-sm sm:text-base font-medium max-w-sm mx-auto leading-relaxed">
            Sebelum mulai mengeksplorasi laboratorium virtual, sesuaikan profil belajarmu dulu.
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-8 sm:mb-10">
          <div className={`h-1 w-14 sm:w-20 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-indigo-500' : 'bg-white/10'}`} />
          <div className={`h-1 w-14 sm:w-20 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-purple-500' : 'bg-white/10'}`} />
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">

          {/* Step 1: Role selection */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
            >
              {/* Siswa */}
              <RoleCard
                icon={<GraduationCap className="w-6 h-6" />}
                iconCls="bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                hoverBorder="hover:border-indigo-500/35"
                hoverGlow="group-hover:bg-indigo-500/8"
                hoverBtn="group-hover:bg-indigo-600"
                title="Saya adalah Siswa"
                sub="Eksplorasi Mandiri & Praktikum"
                desc="Saya ingin belajar sains dengan cara yang menyenangkan, merekam hasil eksperimen, serta meraih poin dan badge penjelajah!"
                cta="Pilih sebagai Siswa"
                onClick={() => selectRole('student')}
              />

              {/* Guru */}
              <RoleCard
                icon={<Presentation className="w-6 h-6" />}
                iconCls="bg-purple-500/10 border-purple-500/20 text-purple-400"
                hoverBorder="hover:border-purple-500/35"
                hoverGlow="group-hover:bg-purple-500/8"
                hoverBtn="group-hover:bg-purple-600"
                title="Saya adalah Guru"
                sub="Manajemen Kelas & Penugasan"
                desc="Saya ingin membuat kelas virtual, memantau perkembangan siswa, memberikan tugas berbasis simulasi, dan mengunduh panduan mengajar."
                cta="Pilih sebagai Guru"
                onClick={() => selectRole('teacher')}
              />
            </motion.div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full max-w-md mx-auto"
            >
              <div className="bg-zinc-900/50 border border-white/[0.08] rounded-2xl sm:rounded-[24px] p-5 sm:p-7 space-y-5">

                {/* Back + role badge */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="text-[10px] font-black text-zinc-500 hover:text-white transition-colors uppercase tracking-widest"
                  >
                    ← Kembali
                  </button>
                  <div className="h-3 w-px bg-white/10" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">
                    {role === 'student' ? '🎓 Siswa' : '🏫 Guru'}
                  </span>
                </div>

                {/* Student: grade picker */}
                {role === 'student' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="flex items-center gap-2 text-sm sm:text-base font-black text-white">
                        <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
                        Pilih Jenjang Pendidikan
                      </h3>
                      <p className="text-zinc-500 text-xs font-medium mt-1 leading-relaxed">
                        Kami akan merekomendasikan simulasi sesuai tingkatan sekolahmu.
                      </p>
                    </div>

                    <div className="space-y-2">
                      {GRADES.map(g => (
                        <button
                          key={g.value}
                          onClick={() => setGrade(g.value)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-bold text-left transition-all duration-200 ${
                            grade === g.value
                              ? 'bg-indigo-600/10 border-indigo-500/50 text-white'
                              : 'bg-black/20 border-white/[0.06] hover:border-white/15 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          {g.label}
                          {grade === g.value && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Teacher: info */}
                {role === 'teacher' && (
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-sm sm:text-base font-black text-white">
                      <Atom className="w-4 h-4 text-purple-400 shrink-0" />
                      Profil Pengajar Siap!
                    </h3>
                    <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-medium">
                      Sebagai <strong className="text-white">Guru</strong>, kamu akan langsung mendapat akses penuh ke fitur manajemen pengajaran — buat kelas, bagikan panduan praktikum, dan sinkronisasi ke Google Classroom.
                    </p>
                    <div className="flex items-start gap-3 p-4 bg-purple-500/5 border border-purple-500/15 rounded-xl">
                      <span className="text-xl shrink-0">🗒️</span>
                      <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
                        Kamu bisa melengkapi data pengajaran kapan saja di pengaturan dashboard guru.
                      </p>
                    </div>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-bold text-red-400 text-center">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  disabled={loading || (role === 'student' && !grade)}
                  onClick={handleFinish}
                  className="w-full flex items-center justify-center gap-2 h-12 sm:h-13 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 disabled:pointer-events-none text-white font-black uppercase tracking-widest text-[10px] sm:text-xs rounded-xl shadow-lg shadow-indigo-600/15 transition-all active:scale-[0.98]"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</>
                  ) : (
                    <>Selesaikan &amp; Masuk Dashboard <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Role Card ────────────────────────────────────────────────────────────────
function RoleCard({ icon, iconCls, hoverBorder, hoverGlow, hoverBtn, title, sub, desc, cta, onClick }: {
  icon: React.ReactNode;
  iconCls: string;
  hoverBorder: string;
  hoverGlow: string;
  hoverBtn: string;
  title: string;
  sub: string;
  desc: string;
  cta: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative text-left w-full flex flex-col justify-between bg-zinc-900/50 border border-white/[0.07] ${hoverBorder} rounded-2xl sm:rounded-[24px] p-5 sm:p-7 overflow-hidden transition-all duration-400 hover:-translate-y-1 active:scale-[0.99]`}
    >
      {/* Glow */}
      <div className={`absolute top-0 right-0 w-36 h-36 blur-3xl rounded-full transition-colors duration-500 ${hoverGlow}`} />

      <div className="space-y-4 relative z-10">
        <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl border flex items-center justify-center ${iconCls} group-hover:scale-105 transition-transform duration-400`}>
          {icon}
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">{title}</h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-0.5">{sub}</p>
        </div>
        <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-medium">{desc}</p>
      </div>

      <div className="relative z-10 pt-5 mt-5 border-t border-white/[0.06] flex items-center justify-between">
        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{cta}</span>
        <div className={`w-7 h-7 rounded-full bg-white/5 flex items-center justify-center transition-colors duration-300 ${hoverBtn}`}>
          <ChevronRight className="w-3.5 h-3.5 text-white" />
        </div>
      </div>
    </button>
  );
}