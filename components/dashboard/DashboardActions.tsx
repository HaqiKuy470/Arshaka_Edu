'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, GraduationCap, Link2, Sparkles, BookOpen, AlertCircle, Calendar, Settings, User, RefreshCw, Check, Globe } from 'lucide-react';
import { signIn } from 'next-auth/react';
import {
  createClassroom,
  enrollClassroom,
  createAssignment,
  updateProfile,
  checkGoogleConnection,
  fetchGoogleCourses,
  importGoogleCourse
} from '@/app/dashboard/actions';

// ─── Modal Wrapper Component ──────────────────────────────────────────────────
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-zinc-900/90 border border-white/10 rounded-3xl p-6 shadow-[0_0_50px_rgba(99,102,241,0.15)] backdrop-blur-xl animate-scale-up text-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" /> {title}
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-xl transition-colors text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── 1. Create Classroom (Guru) ──────────────────────────────────────────────
export function CreateClassroomButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [createdCode, setCreatedCode] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await createClassroom(formData);
      if (res?.success) {
        setCreatedCode(res.code);
      }
    } catch (err: any) {
      setError(err?.message || 'Gagal membuat kelas.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setCreatedCode(null);
    setError(null);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:scale-102 active:scale-98 transform duration-150"
      >
        <Plus className="w-3.5 h-3.5" /> Buat Kelas
      </button>

      <Modal isOpen={isOpen} onClose={handleClose} title="Buat Kelas Baru">
        {createdCode ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl">
              🎉
            </div>
            <h4 className="text-lg font-bold">Kelas Berhasil Dibuat!</h4>
            <p className="text-zinc-400 text-sm">
              Bagikan kode kelas berikut kepada siswa Anda agar mereka dapat bergabung:
            </p>
            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 font-mono text-2xl font-black tracking-widest text-purple-400 shadow-inner flex items-center justify-between">
              <span>{createdCode}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(createdCode);
                  alert('Kode disalin ke clipboard!');
                }}
                className="text-xs font-bold text-zinc-400 hover:text-white px-3 py-1.5 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors font-sans tracking-normal"
              >
                Salin
              </button>
            </div>
            <button
              onClick={handleClose}
              className="w-full mt-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-sm transition-all"
            >
              Selesai
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400">Nama Kelas</label>
              <input
                required
                name="name"
                placeholder="Contoh: Kelas 10 IPA 1, Kelas 11 IPS 3"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50 transition-colors placeholder:text-zinc-600"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400">Mata Pelajaran</label>
              <select
                required
                name="subject"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50 transition-colors text-white"
              >
                <option value="Fisika" className="bg-zinc-950 text-white">Fisika</option>
                <option value="Kimia" className="bg-zinc-950 text-white">Kimia</option>
                <option value="Matematika" className="bg-zinc-950 text-white">Matematika</option>
                <option value="Biologi" className="bg-zinc-950 text-white">Biologi</option>
                <option value="Teknologi & Informatika" className="bg-zinc-950 text-white">Teknologi & Informatika</option>
                <option value="Seni & Budaya" className="bg-zinc-950 text-white">Seni & Budaya</option>
                <option value="Astronomi & Bumi" className="bg-zinc-950 text-white">Astronomi & Bumi</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all"
            >
              {loading ? 'Memproses...' : 'Buat Kelas Baru'}
            </button>
          </form>
        )}
      </Modal>
    </>
  );
}

// ─── 2. Enroll Classroom (Siswa) ─────────────────────────────────────────────
export function EnrollClassroomButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await enrollClassroom(formData);
      if (res?.success) {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err?.message || 'Gagal bergabung dengan kelas.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSuccess(false);
    setError(null);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:scale-102 active:scale-98 transform duration-150"
      >
        <Plus className="w-3.5 h-3.5" /> Gabung Kelas
      </button>

      <Modal isOpen={isOpen} onClose={handleClose} title="Gabung Kelas Virtual">
        {success ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl">
              🎉
            </div>
            <h4 className="text-lg font-bold">Berhasil Bergabung!</h4>
            <p className="text-zinc-400 text-sm">
              Anda telah terdaftar di kelas virtual tersebut. Dasbor Anda sekarang akan menampilkan tugas dan materi dari kelas ini.
            </p>
            <button
              onClick={handleClose}
              className="w-full mt-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-all"
            >
              Kembali ke Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400">Kode Kelas</label>
              <input
                required
                name="code"
                placeholder="Contoh: ARS-X8Y9"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors placeholder:text-zinc-600 font-mono tracking-widest text-center uppercase text-lg"
              />
              <p className="text-[10px] text-zinc-500 leading-normal">
                Mintalah kode kelas yang dibuat oleh Pengajar (Guru) Anda untuk dimasukkan di sini.
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all"
            >
              {loading ? 'Memproses...' : 'Gabung Kelas'}
            </button>
          </form>
        )}
      </Modal>
    </>
  );
}

// ─── 3. Create Assignment (Guru) ────────────────────────────────────────────
interface CreateAssignmentButtonProps {
  classroomsList: Array<{ id: string; name: string; subject: string }>;
  simulationsList: Array<{ id: string; title: string; subject: string }>;
}

export function CreateAssignmentButton({ classroomsList, simulationsList }: CreateAssignmentButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await createAssignment(formData);
      if (res?.success) {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err?.message || 'Gagal menugaskan eksperimen.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSuccess(false);
    setError(null);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-102 active:scale-98 transform duration-150"
      >
        <Plus className="w-3.5 h-3.5" /> Buat Tugas
      </button>

      <Modal isOpen={isOpen} onClose={handleClose} title="Tugaskan Eksperimen Baru">
        {success ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl">
              🎉
            </div>
            <h4 className="text-lg font-bold">Tugas Berhasil Dikirim!</h4>
            <p className="text-zinc-400 text-sm">
              Eksperimen virtual telah ditugaskan ke seluruh siswa di kelas yang bersangkutan. Mereka dapat melihat dan mengerjakannya langsung dari dashboard mereka.
            </p>
            <button
              onClick={handleClose}
              className="w-full mt-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-all"
            >
              Selesai
            </button>
          </div>
        ) : classroomsList.length === 0 ? (
          <div className="text-center py-6 space-y-4">
            <div className="text-4xl">🏫</div>
            <h4 className="font-bold text-white">Belum Ada Kelas</h4>
            <p className="text-zinc-400 text-xs leading-normal">
              Anda perlu membuat kelas terlebih dahulu sebelum dapat menugaskan praktikum/eksperimen kepada siswa.
            </p>
            <button
              onClick={handleClose}
              className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl text-xs transition-colors"
            >
              Tutup
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400">Judul Tugas</label>
              <input
                required
                name="title"
                placeholder="Contoh: Praktikum Mandiri: Hukum Newton II"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-zinc-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400">Pilih Kelas</label>
                <select
                  required
                  name="classroomId"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors text-white"
                >
                  {classroomsList.map((cls) => (
                    <option key={cls.id} value={cls.id} className="bg-zinc-950 text-white">
                      {cls.name} ({cls.subject})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400">Pilih Simulasi</label>
                <select
                  required
                  name="simulationId"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors text-white"
                >
                  {simulationsList.map((sim) => (
                    <option key={sim.id} value={sim.id} className="bg-zinc-950 text-white">
                      [{sim.subject}] {sim.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400">Petunjuk Praktikum</label>
              <textarea
                name="instructions"
                rows={3}
                placeholder="Masukkan instruksi khusus atau target eksperimen..."
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-zinc-600 resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" /> Batas Pengumpulan (Tenggat)
              </label>
              <input
                type="datetime-local"
                name="dueDate"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors text-white"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all"
            >
              {loading ? 'Mengirim Tugas...' : 'Tugaskan Eksperimen'}
            </button>
          </form>
        )}
      </Modal>
    </>
  );
}

// ─── 4. Copy Code Button (Client) ───────────────────────────────────────────
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`text-[10px] font-bold px-2 py-1 rounded transition-all duration-200 ${
        copied
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-transparent'
      }`}
    >
      {copied ? 'Tersalin!' : 'Salin'}
    </button>
  );
}

// ─── 5. Edit Profile Button & Modal (Client) ─────────────────────────────────
interface EditProfileButtonProps {
  initialName: string | null | undefined;
  initialImage: string | null | undefined;
}

export function EditProfileButton({ initialName, initialImage }: EditProfileButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await updateProfile(formData);
      if (res?.success) {
        setSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          setSuccess(false);
        }, 1200);
      }
    } catch (err: any) {
      setError(err?.message || 'Gagal memperbarui profil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors flex items-center justify-center"
        aria-label="Pengaturan Profil"
      >
        <Settings className="w-5 h-5 text-zinc-300" />
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Edit Profil Saya">
        {success ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>
            <h4 className="text-lg font-bold">Profil Diperbarui!</h4>
            <p className="text-zinc-400 text-sm">
              Perubahan profil Anda berhasil disimpan.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400">Nama Tampilan</label>
              <input
                required
                name="name"
                defaultValue={initialName || ''}
                placeholder="Masukkan nama lengkap Anda"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400">URL Gambar Profil (Avatar)</label>
              <input
                name="image"
                defaultValue={initialImage || ''}
                placeholder="https://example.com/avatar.jpg"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors text-white"
              />
              <p className="text-[10px] text-zinc-500 leading-normal">
                Gunakan URL tautan gambar publik untuk avatar Anda (misal dari Unsplash, GitHub, atau Imgur).
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all"
            >
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>
        )}
      </Modal>
    </>
  );
}

// ─── 6. Google Classroom Integration (Client) ─────────────────────────────────
export function GoogleClassroomButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [isSimulated, setIsSimulated] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const initConnection = async () => {
    try {
      const conn = await checkGoogleConnection();
      setConnected(conn.connected);
    } catch (e) {
      console.error(e);
    }
  };

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await fetchGoogleCourses();
      setConnected(data.connected);
      setCourses(data.courses || []);
      setIsSimulated(data.simulated);
      setMessage(data.message || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      initConnection();
      loadCourses();
    }
  }, [isOpen]);

  const handleSyncCourse = async (courseId: string, courseName: string, subject: string) => {
    setSyncingId(courseId);
    try {
      const res = await importGoogleCourse(courseId, courseName, subject);
      if (res.success) {
        alert(`Berhasil mengimpor "${courseName}" ke kelas virtual Arshaka Edu!`);
        loadCourses();
      }
    } catch (e: any) {
      alert(e?.message || 'Gagal menyinkronkan kelas.');
    } finally {
      setSyncingId(null);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-white text-gray-800 font-bold rounded-xl text-xs hover:bg-zinc-100 transition-colors"
      >
        <span className="text-base">🧩</span> Hubungkan Google Classroom
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Integrasi Google Classroom">
        <div className="space-y-4 text-left">
          {connected ? (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>Akun Google Terkoneksi</span>
            </div>
          ) : (
            <div className="p-4 bg-zinc-800/40 border border-white/5 rounded-2xl space-y-3">
              <div className="text-xs text-zinc-400 leading-normal">
                Hubungkan dengan Google untuk menyinkronkan kelas virtual Anda secara riil dengan Google Classroom API.
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => signIn('google')}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-white text-gray-800 font-bold rounded-xl text-[11px] hover:bg-zinc-100 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" /> Google OAuth
                </button>
                <button
                  onClick={() => {
                    setConnected(true);
                    setIsSimulated(true);
                  }}
                  className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl text-[11px] transition-colors"
                >
                  Gunakan Simulasi
                </button>
              </div>
            </div>
          )}

          {isSimulated && connected && (
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl text-[11px] leading-normal">
              💡 <strong>Mode Demo / Simulasi:</strong> Akun Google Anda terdeteksi dalam mode uji coba lokal. Kami menyediakan katalog kelas virtual contoh untuk disinkronkan.
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-2 text-zinc-500">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span className="text-xs">Memuat kelas Google Classroom...</span>
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest">
                Pilih Kelas untuk Diimpor:
              </h4>

              {courses.length === 0 ? (
                <p className="text-xs text-zinc-500 italic py-4 text-center">
                  Tidak ada kelas Google Classroom aktif ditemukan.
                </p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="flex justify-between items-center p-3 bg-black/20 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                    >
                      <div className="min-w-0 pr-3">
                        <div className="text-xs font-bold text-white truncate">
                          {course.name}
                        </div>
                        <div className="text-[10px] text-zinc-500 truncate mt-0.5">
                          Deskripsi: {course.section || 'Google Classroom'}
                        </div>
                      </div>

                      <button
                        disabled={syncingId !== null}
                        onClick={() => handleSyncCourse(course.id, course.name, course.subject)}
                        className="shrink-0 flex items-center gap-1 text-[10px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {syncingId === course.id ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" /> Impor...
                          </>
                        ) : (
                          'Impor Kelas'
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}

// ─── 7. Moodle Coming Soon Button (Client) ────────────────────────────────────
export function MoodleComingSoonButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#f6821f] text-white font-bold rounded-xl text-xs hover:bg-[#e07216] transition-colors"
      >
        <span className="text-base">🔌</span> Hubungkan Moodle LMS
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Integrasi Moodle LMS">
        <div className="text-center py-4 space-y-4 text-white">
          <div className="w-16 h-16 bg-[#f6821f]/20 text-[#f6821f] rounded-full flex items-center justify-center mx-auto text-3xl">
            🔌
          </div>
          <h4 className="text-lg font-bold">Segera Hadir!</h4>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Integrasi Moodle LMS menggunakan standar **LTI v1.3 (Learning Tools Interoperability)** sedang dikembangkan.
          </p>
          <div className="bg-black/30 border border-white/5 rounded-2xl p-4 text-[11px] text-zinc-500 leading-normal text-left space-y-2">
            <div>
              <strong>Rencana fitur meliputi:</strong>
            </div>
            <ul className="list-disc list-inside space-y-1">
              <li>Penyematan simulasi langsung di Moodle Course module.</li>
              <li>Single Sign-On (SSO) otomatis bagi murid.</li>
              <li>Sinkronisasi buku nilai (Gradebook passback) otomatis ke Moodle.</li>
            </ul>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-full mt-2 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl text-xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </Modal>
    </>
  );
}



