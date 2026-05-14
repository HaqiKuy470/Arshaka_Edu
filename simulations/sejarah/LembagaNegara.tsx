"use client";

import { useState } from "react";

export default function LembagaNegara() {
  const [activeBranch, setActiveBranch] = useState<"eksekutif"|"legislatif"|"yudikatif">("eksekutif");

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-4 lg:p-8">
        
        <div className="text-center mb-12">
           <h2 className="text-3xl font-bold text-white drop-shadow-lg mb-2">Lembaga Negara (Trias Politica)</h2>
           <p className="text-zinc-400 text-sm">Prinsip pemisahan kekuasaan agar tidak ada satu pihak yang menjadi diktator.</p>
        </div>

        <div className="w-full max-w-4xl relative mb-12">
           
           {/* Triangle Layout for desktop */}
           <div className="hidden md:block relative w-full h-80">
              {/* Lines connecting them */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <polygon points="50,15 20,85 80,85" fill="none" stroke="white" strokeWidth="1" strokeDasharray="2,2" />
              </svg>

              {/* Eksekutif (Top) */}
              <div 
                onClick={()=>setActiveBranch("eksekutif")}
                className={`absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer transition-all ${activeBranch === 'eksekutif' ? 'scale-125 z-20' : 'opacity-60 hover:opacity-100 z-10'}`}
              >
                 <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-2 shadow-xl border-4 ${activeBranch === 'eksekutif' ? 'bg-rose-600 border-rose-400' : 'bg-black border-zinc-700'}`}>👔</div>
                 <div className={`font-black text-sm uppercase ${activeBranch === 'eksekutif' ? 'text-rose-400' : 'text-zinc-500'}`}>Eksekutif</div>
              </div>

              {/* Legislatif (Bottom Left) */}
              <div 
                onClick={()=>setActiveBranch("legislatif")}
                className={`absolute bottom-0 left-[10%] flex flex-col items-center cursor-pointer transition-all ${activeBranch === 'legislatif' ? 'scale-125 z-20' : 'opacity-60 hover:opacity-100 z-10'}`}
              >
                 <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-2 shadow-xl border-4 ${activeBranch === 'legislatif' ? 'bg-emerald-600 border-emerald-400' : 'bg-black border-zinc-700'}`}>🏛️</div>
                 <div className={`font-black text-sm uppercase ${activeBranch === 'legislatif' ? 'text-emerald-400' : 'text-zinc-500'}`}>Legislatif</div>
              </div>

              {/* Yudikatif (Bottom Right) */}
              <div 
                onClick={()=>setActiveBranch("yudikatif")}
                className={`absolute bottom-0 right-[10%] flex flex-col items-center cursor-pointer transition-all ${activeBranch === 'yudikatif' ? 'scale-125 z-20' : 'opacity-60 hover:opacity-100 z-10'}`}
              >
                 <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-2 shadow-xl border-4 ${activeBranch === 'yudikatif' ? 'bg-blue-600 border-blue-400' : 'bg-black border-zinc-700'}`}>⚖️</div>
                 <div className={`font-black text-sm uppercase ${activeBranch === 'yudikatif' ? 'text-blue-400' : 'text-zinc-500'}`}>Yudikatif</div>
              </div>
           </div>

           {/* Mobile Stack */}
           <div className="md:hidden flex flex-col gap-4">
              <button onClick={()=>setActiveBranch("eksekutif")} className={`p-4 rounded-xl border-2 font-bold ${activeBranch === 'eksekutif' ? 'bg-rose-600 border-rose-400 text-white' : 'bg-black border-zinc-800 text-zinc-500'}`}>Eksekutif 👔</button>
              <button onClick={()=>setActiveBranch("legislatif")} className={`p-4 rounded-xl border-2 font-bold ${activeBranch === 'legislatif' ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-black border-zinc-800 text-zinc-500'}`}>Legislatif 🏛️</button>
              <button onClick={()=>setActiveBranch("yudikatif")} className={`p-4 rounded-xl border-2 font-bold ${activeBranch === 'yudikatif' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-black border-zinc-800 text-zinc-500'}`}>Yudikatif ⚖️</button>
           </div>
        </div>

        {/* Detailed Info Card */}
        <div className={`w-full max-w-2xl bg-zinc-900 border rounded-3xl p-8 shadow-2xl animate-fade-in text-center ${activeBranch === 'eksekutif' ? 'border-rose-500/50' : activeBranch === 'legislatif' ? 'border-emerald-500/50' : 'border-blue-500/50'}`}>
           
           {activeBranch === "eksekutif" && (
              <>
                 <div className="text-sm font-bold text-rose-500 uppercase tracking-widest mb-2">Tugas Utama: Pelaksana Undang-Undang</div>
                 <h3 className="text-2xl font-black text-white mb-6">Presiden, Wapres, dan Menteri</h3>
                 <p className="text-zinc-300 leading-relaxed mb-6">Merekalah yang mengeksekusi (menjalankan) roda pemerintahan sehari-hari. Mulai dari membangun jalan, mengurus pendidikan, menjaga keamanan, hingga diplomasi luar negeri.</p>
                 <div className="bg-rose-950/30 p-4 rounded-xl border border-rose-900/50 text-sm text-rose-200 text-left">
                    <strong>Contoh Lembaga:</strong> Kepresidenan, Kementerian Pendidikan, Kementerian Keuangan, Polri, TNI.
                 </div>
              </>
           )}

           {activeBranch === "legislatif" && (
              <>
                 <div className="text-sm font-bold text-emerald-500 uppercase tracking-widest mb-2">Tugas Utama: Pembuat Undang-Undang</div>
                 <h3 className="text-2xl font-black text-white mb-6">DPR, DPD, dan MPR</h3>
                 <p className="text-zinc-300 leading-relaxed mb-6">Mereka adalah wakil rakyat yang bertugas membuat aturan (Hukum/UU), menyetujui anggaran negara (APBN), dan mengawasi kerja Presiden (Eksekutif) agar tidak melenceng.</p>
                 <div className="bg-emerald-950/30 p-4 rounded-xl border border-emerald-900/50 text-sm text-emerald-200 text-left">
                    <strong>Contoh Lembaga:</strong> DPR (Dewan Perwakilan Rakyat), DPRD (Tingkat Daerah).
                 </div>
              </>
           )}

           {activeBranch === "yudikatif" && (
              <>
                 <div className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-2">Tugas Utama: Pengadil Pelanggar Undang-Undang</div>
                 <h3 className="text-2xl font-black text-white mb-6">MA, MK, dan KY</h3>
                 <p className="text-zinc-300 leading-relaxed mb-6">Mereka adalah kekuasaan kehakiman yang merdeka (independen). Bertugas mengadili pihak yang melanggar hukum, baik rakyat biasa maupun Presiden sekalipun (jika melanggar UUD).</p>
                 <div className="bg-blue-950/30 p-4 rounded-xl border border-blue-900/50 text-sm text-blue-200 text-left">
                    <strong>Contoh Lembaga:</strong> Mahkamah Agung (MA - Kasus Umum), Mahkamah Konstitusi (MK - Peradilan UUD & Pemilu).
                 </div>
              </>
           )}

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Trias Politica</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed">
            <p><strong>Kenapa kekuasaan harus dibagi?</strong></p>
            <p>Bayangkan jika Polisi (Eksekutif), juga bertugas membuat hukum (Legislatif), dan bertugas menjadi Hakim penentu hukuman (Yudikatif) sekaligus.</p>
            <p className="text-rose-400 font-bold">Itulah definisi Diktator / Tirani!</p>
            <p>Karena itu filsuf John Locke & Montesquieu mencetuskan <strong>Trias Politica</strong> agar ketiga lembaga ini saling mengawasi dan menyeimbangkan (Checks and Balances).</p>
          </div>

        </div>
      </div>
    </div>
  );
}
