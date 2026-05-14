import Link from "next/link";
import { Award, BookOpen, Star, Clock, Trophy, Users, FileText, Bell, Settings, LogOut, ChevronRight } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen pt-16 pb-24 relative z-10">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header / Profile Summary */}
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start bg-zinc-900/50 p-8 rounded-3xl border border-white/5 mb-8">
           <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold shadow-[0_0_30px_rgba(99,102,241,0.3)]">
              AS
           </div>
           <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">Arshaka Siswa</h1>
              <div className="text-zinc-400 flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                 <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20">Level 12 Explorer</span>
                 <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">SMA Kelas 11</span>
                 <span className="flex items-center gap-1"><Trophy className="w-4 h-4 text-yellow-500" /> 12,450 XP</span>
              </div>
           </div>
           <div className="flex gap-2">
              <button className="p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors relative">
                 <Bell className="w-5 h-5 text-zinc-300" />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors">
                 <Settings className="w-5 h-5 text-zinc-300" />
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Main Content Area */}
           <div className="lg:col-span-2 space-y-8">
              
              {/* Continue Learning */}
              <section>
                 <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-400" /> Lanjutkan Belajar
                 </h2>
                 <div className="grid sm:grid-cols-2 gap-4">
                    <Link href="/simulasi/efek-fotolistrik" className="group bg-zinc-900 border border-white/5 rounded-2xl p-5 hover:bg-zinc-800 transition-all hover:border-indigo-500/30">
                       <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                             <Atom className="w-5 h-5 text-purple-400" />
                          </div>
                          <span className="text-xs font-bold bg-zinc-800 px-2 py-1 rounded text-zinc-400 group-hover:bg-zinc-700">Fisika Modern</span>
                       </div>
                       <h3 className="font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">Efek Fotolistrik</h3>
                       <p className="text-xs text-zinc-400 mb-4">Terakhir diakses: 2 jam lalu</p>
                       
                       <div className="w-full bg-zinc-800 rounded-full h-1.5 mb-2">
                          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                       </div>
                       <div className="text-right text-[10px] text-zinc-500 font-bold">45% Selesai</div>
                    </Link>

                    <Link href="/simulasi/siklus-bintang" className="group bg-zinc-900 border border-white/5 rounded-2xl p-5 hover:bg-zinc-800 transition-all hover:border-cyan-500/30">
                       <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                             <Star className="w-5 h-5 text-cyan-400" />
                          </div>
                          <span className="text-xs font-bold bg-zinc-800 px-2 py-1 rounded text-zinc-400 group-hover:bg-zinc-700">Astronomi</span>
                       </div>
                       <h3 className="font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">Siklus Hidup Bintang</h3>
                       <p className="text-xs text-zinc-400 mb-4">Terakhir diakses: Kemarin</p>
                       
                       <div className="w-full bg-zinc-800 rounded-full h-1.5 mb-2">
                          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full" style={{ width: '80%' }}></div>
                       </div>
                       <div className="text-right text-[10px] text-zinc-500 font-bold">80% Selesai</div>
                    </Link>
                 </div>
              </section>

              {/* Saved / Favorites */}
              <section>
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                       <Star className="w-5 h-5 text-yellow-500" /> Simulasi Tersimpan
                    </h2>
                    <button className="text-sm text-indigo-400 hover:text-indigo-300">Lihat Semua</button>
                 </div>
                 <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden divide-y divide-white/5">
                    
                    <div className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors cursor-pointer">
                       <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                          <span className="text-emerald-400 font-bold text-lg">⚖️</span>
                       </div>
                       <div className="flex-1">
                          <h4 className="font-bold text-white text-sm">Kesetimbangan Reaksi Kimia</h4>
                          <p className="text-xs text-zinc-400">Kimia • SMA</p>
                       </div>
                       <ChevronRight className="w-5 h-5 text-zinc-600" />
                    </div>

                    <div className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors cursor-pointer">
                       <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center shrink-0">
                          <span className="text-rose-400 font-bold text-lg">🧬</span>
                       </div>
                       <div className="flex-1">
                          <h4 className="font-bold text-white text-sm">Sintesis Protein (Transkripsi)</h4>
                          <p className="text-xs text-zinc-400">Biologi • SMA</p>
                       </div>
                       <ChevronRight className="w-5 h-5 text-zinc-600" />
                    </div>

                 </div>
              </section>

              {/* Teachers / Class View Link */}
              <section>
                 <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center shrink-0">
                       <Users className="w-8 h-8 text-blue-400" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                       <h3 className="text-lg font-bold text-white mb-1">Grup Kelas 11 MIPA 1</h3>
                       <p className="text-sm text-blue-200/70">Ada 2 tugas simulasi baru dari Pak Budi (Fisika).</p>
                    </div>
                    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors whitespace-nowrap">
                       Buka Kelas
                    </button>
                 </div>
              </section>

           </div>

           {/* Sidebar */}
           <div className="space-y-8">
              
              {/* Badges & Achievements */}
              <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6">
                 <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" /> Pencapaian Terbaru
                 </h3>
                 <div className="grid grid-cols-3 gap-3">
                    <div className="aspect-square bg-gradient-to-br from-yellow-500/20 to-orange-600/20 border border-yellow-500/30 rounded-xl flex flex-col items-center justify-center p-2 group cursor-help relative">
                       <span className="text-2xl mb-1">⚛️</span>
                       <span className="text-[9px] font-bold text-yellow-500 text-center uppercase">Fisikawan Muda</span>
                    </div>
                    <div className="aspect-square bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/30 rounded-xl flex flex-col items-center justify-center p-2 group cursor-help relative">
                       <span className="text-2xl mb-1">🔬</span>
                       <span className="text-[9px] font-bold text-emerald-500 text-center uppercase">Ahli Mikroskop</span>
                    </div>
                    <div className="aspect-square bg-zinc-800 border border-zinc-700 rounded-xl flex flex-col items-center justify-center p-2 opacity-50 grayscale">
                       <span className="text-2xl mb-1">🌌</span>
                       <span className="text-[9px] font-bold text-zinc-500 text-center uppercase">Penjelajah Bintang</span>
                    </div>
                 </div>
                 <button className="w-full mt-4 text-xs font-bold text-zinc-400 hover:text-white py-2 bg-black/20 rounded-lg transition-colors">
                    Lihat Semua (12)
                 </button>
              </div>

              {/* Statistics */}
              <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6">
                 <h3 className="font-bold text-white mb-4">Statistik Belajar</h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-white/5">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><BookOpen className="w-4 h-4" /></div>
                          <span className="text-sm text-zinc-300">Simulasi Selesai</span>
                       </div>
                       <span className="font-bold text-white">42</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-white/5">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-rose-500/20 rounded-lg text-rose-400"><Clock className="w-4 h-4" /></div>
                          <span className="text-sm text-zinc-300">Waktu Belajar</span>
                       </div>
                       <span className="font-bold text-white">18 Jam</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400"><FileText className="w-4 h-4" /></div>
                          <span className="text-sm text-zinc-300">LKS Diunduh</span>
                       </div>
                       <span className="font-bold text-white">15</span>
                    </div>
                 </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col gap-2">
                 <button className="flex items-center gap-3 p-4 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-xl transition-colors text-left group">
                    <LogOut className="w-5 h-5 text-red-500 group-hover:translate-x-1 transition-transform" />
                    <span className="font-bold text-red-400">Keluar Akun</span>
                 </button>
              </div>

           </div>

        </div>
      </div>
    </div>
  );
}

// Temporary icon component just for the dashboard mockup
function Atom(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}
