'use client';

import React, { useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  Presentation, 
  Shield, 
  Loader2, 
  Check, 
  Mail,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { updateUserRole } from './actions';

interface UserItem {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: 'student' | 'teacher' | 'admin';
  isOnboarded: boolean;
  createdAt: Date;
}

interface AdminClientProps {
  initialUsers: UserItem[];
  stats: {
    totalUsers: number;
    students: number;
    teachers: number;
    admins: number;
  };
}

export default function AdminClient({ initialUsers, stats }: AdminClientProps) {
  const [usersList, setUsersList] = useState<UserItem[]>(initialUsers);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRoleChange = async (userId: string, currentRole: string, newRole: 'student' | 'teacher' | 'admin') => {
    if (currentRole === newRole) return;
    setUpdatingId(userId);
    setStatusMessage(null);

    const res = await updateUserRole(userId, newRole);

    if (res.success) {
      setUsersList(prev => 
        prev.map(u => u.id === userId ? { ...u, role: newRole } : u)
      );
      setStatusMessage({ type: 'success', text: 'Role pengguna berhasil diperbarui!' });
    } else {
      setStatusMessage({ type: 'error', text: res.error || 'Gagal mengubah role' });
    }
    setUpdatingId(null);
  };

  const filteredUsers = usersList.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      
      {/* Alert Status */}
      {statusMessage && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 border text-sm font-semibold transition-all ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="flex-1">{statusMessage.text}</p>
          <button 
            onClick={() => setStatusMessage(null)}
            className="text-xs font-bold opacity-60 hover:opacity-100 uppercase tracking-widest pl-2"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Grid Statistik */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Pengguna', value: stats.totalUsers, icon: Users, color: 'indigo' },
          { label: 'Total Siswa', value: stats.students, icon: GraduationCap, color: 'blue' },
          { label: 'Total Pengajar', value: stats.teachers, icon: Presentation, color: 'purple' },
          { label: 'Administrator', value: stats.admins, icon: Shield, color: 'pink' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-zinc-900 border border-white/5 p-5 rounded-2xl flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-${s.color}-500/10 flex items-center justify-center text-${s.color}-400 shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Manajemen Pengguna */}
      <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden">
        
        {/* Header Control Panel */}
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight">Daftar Pengguna Platform</h3>
            <p className="text-zinc-500 text-xs font-medium mt-0.5">Kelola role hak akses pengguna secara real-time.</p>
          </div>
          <input
            type="text"
            placeholder="Cari pengguna berdasarkan nama/email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:max-w-xs px-4 py-2 bg-black/40 border border-white/5 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-zinc-600 outline-none transition-colors"
          />
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] font-black uppercase tracking-wider text-zinc-500">
                <th className="py-4 px-6">Pengguna</th>
                <th className="py-4 px-6">Kontak</th>
                <th className="py-4 px-6">Status Onboarding</th>
                <th className="py-4 px-6">Role / Hak Akses</th>
                <th className="py-4 px-6 text-right">Ubah Peran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs font-bold text-zinc-600 uppercase tracking-widest">
                    Tidak ada pengguna ditemukan
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-white/[0.01] transition-colors text-xs">
                    
                    {/* Pengguna */}
                    <td className="py-4 px-6 flex items-center gap-3">
                      {u.image ? (
                        <img src={u.image} alt={u.name || ''} className="w-9 h-9 rounded-full object-cover border border-white/10" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center">
                          {u.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-white text-sm">{u.name || 'Anonymous'}</div>
                        <span className="text-[9px] text-zinc-500 font-black uppercase tracking-wider flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          Terdaftar: {new Date(u.createdAt).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    </td>

                    {/* Kontak */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-zinc-400 font-medium">
                        <Mail className="w-3.5 h-3.5 text-zinc-600" />
                        {u.email}
                      </div>
                    </td>

                    {/* Status Onboarding */}
                    <td className="py-4 px-6">
                      {u.isOnboarded ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase tracking-wider">
                          <Check className="w-3 h-3" /> Selesai
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-black uppercase tracking-wider">
                          Belum
                        </span>
                      )}
                    </td>

                    {/* Role / Hak Akses */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                        u.role === 'admin' 
                          ? 'bg-pink-500/10 border-pink-500/20 text-pink-400'
                          : u.role === 'teacher'
                          ? 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                          : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                      }`}>
                        {u.role === 'admin' ? '🛡️ Admin' : u.role === 'teacher' ? '🏫 Guru' : '🎓 Siswa'}
                      </span>
                    </td>

                    {/* Ubah Peran */}
                    <td className="py-4 px-6 text-right">
                      {updatingId === u.id ? (
                        <div className="inline-flex items-center gap-2 text-zinc-500 font-bold text-[10px] uppercase">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Menyimpan...
                        </div>
                      ) : (
                        <div className="inline-flex gap-1.5 justify-end">
                          <button
                            onClick={() => handleRoleChange(u.id, u.role, 'student')}
                            disabled={u.email === 'haqikuy470@gmail.com'}
                            className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider transition-colors ${
                              u.role === 'student' 
                                ? 'bg-indigo-600 text-white shadow-md' 
                                : 'bg-black/40 hover:bg-zinc-800 text-zinc-500 hover:text-white border border-white/5'
                            }`}
                          >
                            Siswa
                          </button>
                          <button
                            onClick={() => handleRoleChange(u.id, u.role, 'teacher')}
                            disabled={u.email === 'haqikuy470@gmail.com'}
                            className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider transition-colors ${
                              u.role === 'teacher' 
                                ? 'bg-purple-600 text-white shadow-md' 
                                : 'bg-black/40 hover:bg-zinc-800 text-zinc-500 hover:text-white border border-white/5'
                            }`}
                          >
                            Guru
                          </button>
                          <button
                            onClick={() => handleRoleChange(u.id, u.role, 'admin')}
                            disabled={u.email === 'haqikuy470@gmail.com'}
                            className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider transition-colors ${
                              u.role === 'admin' 
                                ? 'bg-pink-600 text-white shadow-md' 
                                : 'bg-black/40 hover:bg-zinc-800 text-zinc-500 hover:text-white border border-white/5'
                            }`}
                          >
                            Admin
                          </button>
                        </div>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
