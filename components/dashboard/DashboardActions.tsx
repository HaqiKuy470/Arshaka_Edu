'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus, X, Sparkles, AlertCircle, Calendar,
  Settings, RefreshCw, Check, Globe
} from 'lucide-react';
import { signIn } from 'next-auth/react';
import {
  createClassroom, enrollClassroom, createAssignment,
  updateProfile, checkGoogleConnection, fetchGoogleCourses, importGoogleCourse
} from '@/app/dashboard/actions';

// ── Modal Wrapper ────────────────────────────────────────────────────────────
function Modal({ isOpen, onClose, title, children }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-md bg-zinc-900 border border-white/10 rounded-t-[28px] sm:rounded-[24px] p-5 sm:p-6 shadow-2xl text-white max-h-[90dvh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle bar (mobile) */}
        <div className="w-10 h-1 bg-white/10 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-black flex items-center gap-2 text-white">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Shared UI pieces ─────────────────────────────────────────────────────────
const inputCls = "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/40 transition-colors placeholder:text-zinc-600 text-white";
const labelCls = "text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-1.5";

function ErrorBanner({ msg }: { msg: string }) {
  return (
    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-start gap-2">
      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
      <span>{msg}</span>
    </div>
  );
}

function SuccessState({ emoji, title, desc, onClose, btnColor = "bg-indigo-600 hover:bg-indigo-500" }: {
  emoji: string; title: string; desc: string; onClose: () => void; btnColor?: string;
}) {
  return (
    <div className="text-center py-4 space-y-4">
      <div className="w-14 h-14 bg-emerald-500/15 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto text-3xl">
        {emoji}
      </div>
      <h4 className="text-base font-black">{title}</h4>
      <p className="text-zinc-400 text-xs leading-relaxed">{desc}</p>
      <button onClick={onClose} className={`w-full mt-2 py-3 ${btnColor} text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all active:scale-95`}>
        Selesai
      </button>
    </div>
  );
}

// ── 1. Create Classroom ──────────────────────────────────────────────────────
export function CreateClassroomButton() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError(null); setLoading(true);
    try {
      const res = await createClassroom(new FormData(e.currentTarget));
      if (res?.success) setCode(res.code);
    } catch (err: any) { setError(err?.message || 'Gagal membuat kelas.'); }
    finally { setLoading(false); }
  };

  const onClose = () => { setOpen(false); setCode(null); setError(null); };

  return (
    <>
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-purple-600 hover:bg-purple-500 active:scale-95 text-white px-3 py-2 rounded-xl transition-all">
        <Plus className="w-3 h-3" /> Buat Kelas
      </button>
      <Modal isOpen={open} onClose={onClose} title="Buat Kelas Baru">
        {code ? (
          <div className="text-center space-y-4 py-2">
            <div className="text-3xl">🎉</div>
            <h4 className="font-black text-white text-base">Kelas Berhasil Dibuat!</h4>
            <p className="text-zinc-400 text-xs">Bagikan kode ini kepada siswa:</p>
            <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-xl px-4 py-3">
              <span className="font-mono font-black text-xl text-purple-400 tracking-widest">{code}</span>
              <button onClick={() => navigator.clipboard.writeText(code)} className="text-[10px] font-black bg-zinc-800 hover:bg-zinc-700 text-zinc-400 px-3 py-1.5 rounded-lg transition-colors">
                Salin
              </button>
            </div>
            <button onClick={onClose} className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all active:scale-95">
              Selesai
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            {error && <ErrorBanner msg={error} />}
            <div>
              <label className={labelCls}>Nama Kelas</label>
              <input required name="name" placeholder="Contoh: Kelas 10 IPA 1" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Mata Pelajaran</label>
              <select required name="subject" className={inputCls}>
                {['Fisika','Kimia','Matematika','Biologi','Teknologi & Informatika','Seni & Budaya','Astronomi & Bumi'].map(s => (
                  <option key={s} value={s} className="bg-zinc-950">{s}</option>
                ))}
              </select>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all active:scale-95">
              {loading ? 'Memproses...' : 'Buat Kelas Baru'}
            </button>
          </form>
        )}
      </Modal>
    </>
  );
}

// ── 2. Enroll Classroom ──────────────────────────────────────────────────────
export function EnrollClassroomButton() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError(null); setLoading(true);
    try {
      const res = await enrollClassroom(new FormData(e.currentTarget));
      if (res?.success) setSuccess(true);
    } catch (err: any) { setError(err?.message || 'Gagal bergabung.'); }
    finally { setLoading(false); }
  };

  const onClose = () => { setOpen(false); setSuccess(false); setError(null); };

  return (
    <>
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white px-3 py-2 rounded-xl transition-all">
        <Plus className="w-3 h-3" /> Gabung Kelas
      </button>
      <Modal isOpen={open} onClose={onClose} title="Gabung Kelas Virtual">
        {success ? (
          <SuccessState emoji="🎉" title="Berhasil Bergabung!"
            desc="Anda telah terdaftar di kelas virtual tersebut. Dasbor Anda akan menampilkan tugas dari kelas ini."
            onClose={onClose} />
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            {error && <ErrorBanner msg={error} />}
            <div>
              <label className={labelCls}>Kode Kelas</label>
              <input required name="code" placeholder="Contoh: ARS-X8Y9"
                className={`${inputCls} font-mono tracking-widest text-center text-lg uppercase`} />
              <p className="text-[10px] text-zinc-600 mt-1.5 leading-normal">
                Minta kode dari Guru Anda untuk dimasukkan di sini.
              </p>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all active:scale-95">
              {loading ? 'Memproses...' : 'Gabung Kelas'}
            </button>
          </form>
        )}
      </Modal>
    </>
  );
}

// ── 3. Create Assignment ─────────────────────────────────────────────────────
export function CreateAssignmentButton({ classroomsList, simulationsList }: {
  classroomsList: Array<{ id: string; name: string; subject: string }>;
  simulationsList: Array<{ id: string; title: string; subject: string }>;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError(null); setLoading(true);
    try {
      const res = await createAssignment(new FormData(e.currentTarget));
      if (res?.success) setSuccess(true);
    } catch (err: any) { setError(err?.message || 'Gagal menugaskan eksperimen.'); }
    finally { setLoading(false); }
  };

  const onClose = () => { setOpen(false); setSuccess(false); setError(null); };

  return (
    <>
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white px-3 py-2 rounded-xl transition-all">
        <Plus className="w-3 h-3" /> Buat Tugas
      </button>
      <Modal isOpen={open} onClose={onClose} title="Tugaskan Eksperimen Baru">
        {success ? (
          <SuccessState emoji="🎉" title="Tugas Berhasil Dikirim!"
            desc="Eksperimen virtual telah ditugaskan ke seluruh siswa di kelas yang dipilih."
            onClose={onClose} btnColor="bg-emerald-600 hover:bg-emerald-500" />
        ) : classroomsList.length === 0 ? (
          <div className="text-center py-6 space-y-3">
            <p className="text-3xl">🏫</p>
            <h4 className="font-black text-white text-sm">Belum Ada Kelas</h4>
            <p className="text-zinc-500 text-xs">Buat kelas terlebih dahulu sebelum menugaskan eksperimen.</p>
            <button onClick={onClose} className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-colors">
              Tutup
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            {error && <ErrorBanner msg={error} />}
            <div>
              <label className={labelCls}>Judul Tugas</label>
              <input required name="title" placeholder="Contoh: Praktikum Mandiri: Hukum Newton II" className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Kelas</label>
                <select required name="classroomId" className={inputCls}>
                  {classroomsList.map(c => (
                    <option key={c.id} value={c.id} className="bg-zinc-950">{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Simulasi</label>
                <select required name="simulationId" className={inputCls}>
                  {simulationsList.map(s => (
                    <option key={s.id} value={s.id} className="bg-zinc-950">[{s.subject}] {s.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>Petunjuk Praktikum</label>
              <textarea name="instructions" rows={3} placeholder="Instruksi khusus atau target eksperimen..."
                className={`${inputCls} resize-none`} />
            </div>
            <div>
              <label className={`${labelCls} flex items-center gap-1.5`}>
                <Calendar className="w-3 h-3" /> Batas Pengumpulan
              </label>
              <input type="datetime-local" name="dueDate" className={inputCls} />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all active:scale-95">
              {loading ? 'Mengirim...' : 'Tugaskan Eksperimen'}
            </button>
          </form>
        )}
      </Modal>
    </>
  );
}

// ── 4. Copy Button ───────────────────────────────────────────────────────────
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy}
      className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg transition-all duration-200 ${
        copied
          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-transparent'
      }`}>
      {copied ? '✓ Salin' : 'Salin'}
    </button>
  );
}

// ── 5. Edit Profile ──────────────────────────────────────────────────────────
export function EditProfileButton({ initialName, initialImage }: {
  initialName?: string | null;
  initialImage?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError(null); setLoading(true);
    try {
      const res = await updateProfile(new FormData(e.currentTarget));
      if (res?.success) { setSuccess(true); setTimeout(() => { setOpen(false); setSuccess(false); }, 1200); }
    } catch (err: any) { setError(err?.message || 'Gagal memperbarui profil.'); }
    finally { setLoading(false); }
  };

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="w-9 h-9 bg-zinc-800 hover:bg-zinc-700 border border-white/[0.07] rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-all"
        aria-label="Edit Profil">
        <Settings className="w-4 h-4" />
      </button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Edit Profil Saya">
        {success ? (
          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 bg-emerald-500/15 rounded-2xl flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 text-emerald-400" />
            </div>
            <h4 className="font-black text-white text-sm">Profil Diperbarui!</h4>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            {error && <ErrorBanner msg={error} />}
            <div>
              <label className={labelCls}>Nama Tampilan</label>
              <input required name="name" defaultValue={initialName || ''} placeholder="Nama lengkap Anda" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>URL Gambar Profil</label>
              <input name="image" defaultValue={initialImage || ''} placeholder="https://example.com/avatar.jpg" className={inputCls} />
              <p className="text-[10px] text-zinc-600 mt-1.5 leading-normal">
                Gunakan URL gambar publik (Unsplash, GitHub, Imgur, dll).
              </p>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all active:scale-95">
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>
        )}
      </Modal>
    </>
  );
}

// ── 6. Google Classroom ──────────────────────────────────────────────────────
export function GoogleClassroomButton() {
  const [open, setOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [isSimulated, setIsSimulated] = useState(true);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await fetchGoogleCourses();
      setConnected(data.connected);
      setCourses(data.courses || []);
      setIsSimulated(data.simulated);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { if (open) loadCourses(); }, [open]);

  const handleSync = async (id: string, name: string, subject: string) => {
    setSyncingId(id);
    try {
      const res = await importGoogleCourse(id, name, subject);
      if (res.success) { alert(`Berhasil mengimpor "${name}"!`); loadCourses(); }
    } catch (e: any) { alert(e?.message || 'Gagal sinkronisasi.'); }
    finally { setSyncingId(null); }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="w-full flex items-center justify-center gap-2 py-2.5 bg-white text-gray-800 font-black text-xs rounded-xl hover:bg-zinc-100 transition-colors active:scale-95">
        🧩 Google Classroom
      </button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Integrasi Google Classroom">
        <div className="space-y-4">
          {connected ? (
            <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs">
              <Check className="w-4 h-4 shrink-0" /> Akun Google Terkoneksi
            </div>
          ) : (
            <div className="p-4 bg-zinc-800/40 border border-white/[0.06] rounded-xl space-y-3">
              <p className="text-xs text-zinc-400 leading-relaxed">
                Hubungkan Google untuk menyinkronkan kelas virtual Anda.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => signIn('google')}
                  className="flex items-center justify-center gap-1.5 py-2 bg-white text-gray-800 font-black rounded-xl text-[10px] hover:bg-zinc-100 transition-colors">
                  <Globe className="w-3 h-3" /> OAuth
                </button>
                <button onClick={() => { setConnected(true); setIsSimulated(true); }}
                  className="py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-black rounded-xl text-[10px] transition-colors">
                  Mode Demo
                </button>
              </div>
            </div>
          )}

          {isSimulated && connected && (
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl text-[10px] leading-relaxed">
              💡 Mode Demo aktif — menampilkan kelas contoh untuk pengujian.
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center gap-2 py-8 text-zinc-500">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span className="text-xs">Memuat kelas...</span>
            </div>
          ) : courses.length > 0 ? (
            <div className="space-y-2 max-h-56 overflow-y-auto">
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Pilih Kelas:</p>
              {courses.map(c => (
                <div key={c.id} className="flex items-center justify-between gap-3 p-3 bg-black/20 border border-white/[0.05] hover:border-white/10 rounded-xl transition-colors">
                  <div className="min-w-0">
                    <p className="text-xs font-black text-white truncate">{c.name}</p>
                    <p className="text-[10px] text-zinc-500 truncate">{c.section || 'Google Classroom'}</p>
                  </div>
                  <button disabled={!!syncingId} onClick={() => handleSync(c.id, c.name, c.subject)}
                    className="shrink-0 flex items-center gap-1 text-[10px] font-black bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50 active:scale-95">
                    {syncingId === c.id ? <><RefreshCw className="w-3 h-3 animate-spin" /> Impor...</> : 'Impor'}
                  </button>
                </div>
              ))}
            </div>
          ) : connected && (
            <p className="text-xs text-zinc-600 italic text-center py-4">Tidak ada kelas aktif ditemukan.</p>
          )}
        </div>
      </Modal>
    </>
  );
}

// ── 7. Moodle ────────────────────────────────────────────────────────────────
export function MoodleComingSoonButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#f6821f] hover:bg-[#e07216] text-white font-black text-xs rounded-xl transition-colors active:scale-95">
        🔌 Moodle LMS
      </button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Integrasi Moodle LMS">
        <div className="text-center space-y-4 py-2">
          <div className="w-14 h-14 bg-[#f6821f]/15 text-[#f6821f] rounded-2xl flex items-center justify-center mx-auto text-3xl">🔌</div>
          <h4 className="font-black text-white text-base">Segera Hadir!</h4>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Integrasi Moodle LMS menggunakan standar LTI v1.3 sedang dikembangkan.
          </p>
          <div className="text-left bg-black/30 border border-white/[0.06] rounded-xl p-4 space-y-2 text-[11px] text-zinc-500">
            <p className="font-black text-zinc-400">Rencana fitur:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Penyematan simulasi langsung di Moodle Course.</li>
              <li>Single Sign-On (SSO) otomatis bagi murid.</li>
              <li>Sinkronisasi buku nilai (Gradebook) ke Moodle.</li>
            </ul>
          </div>
          <button onClick={() => setOpen(false)}
            className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-black rounded-xl text-xs uppercase tracking-widest transition-colors">
            Tutup
          </button>
        </div>
      </Modal>
    </>
  );
}