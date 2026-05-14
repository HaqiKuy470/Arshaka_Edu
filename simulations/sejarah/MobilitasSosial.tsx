"use client";

import { useState } from "react";

export default function MobilitasSosial() {
  const [level, setLevel] = useState<number>(1); // 0=Bawah, 1=Menengah, 2=Atas
  const [animation, setAnimation] = useState<"up"|"down"|"horizontal"|null>(null);

  const moveVertical = (target: number) => {
     if (target > level) setAnimation("up");
     else if (target < level) setAnimation("down");
     setLevel(target);
     setTimeout(() => setAnimation(null), 1000);
  };

  const moveHorizontal = () => {
     setAnimation("horizontal");
     setTimeout(() => setAnimation(null), 1000);
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Mobilitas Sosial</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-lg">Perpindahan status individu/kelompok dalam stratifikasi (piramida) masyarakat.</p>

        {/* The Social Pyramid */}
        <div className="relative w-full max-w-lg h-[400px] flex flex-col items-center justify-center mb-8">
           
           {/* Tier 2: Atas */}
           <div className={`w-32 h-24 flex items-center justify-center font-bold text-sm border-b border-black clip-triangle transition-all ${level === 2 ? 'bg-amber-400 text-amber-950 shadow-[0_0_30px_rgba(251,191,36,0.5)] z-10' : 'bg-zinc-800 text-zinc-500'}`} style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}>
              Kelas Atas
           </div>
           
           {/* Tier 1: Menengah */}
           <div className={`w-64 h-24 flex items-center justify-center font-bold text-sm border-b border-black transition-all ${level === 1 ? 'bg-blue-400 text-blue-950 shadow-[0_0_30px_rgba(96,165,250,0.5)] z-10' : 'bg-zinc-800 text-zinc-500'}`} style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)' }}>
              Kelas Menengah
           </div>

           {/* Tier 0: Bawah */}
           <div className={`w-96 h-24 flex items-center justify-center font-bold text-sm transition-all ${level === 0 ? 'bg-emerald-500 text-emerald-950 shadow-[0_0_30px_rgba(16,185,129,0.5)] z-10' : 'bg-zinc-800 text-zinc-500'}`} style={{ clipPath: 'polygon(17% 0%, 83% 0%, 100% 100%, 0% 100%)' }}>
              Kelas Bawah (Akar Rumput)
           </div>

           {/* Character avatar overlay */}
           <div 
             className={`absolute flex flex-col items-center justify-center z-20 transition-all duration-1000 ease-in-out ${
                level === 2 ? 'bottom-[250px]' : 
                level === 1 ? 'bottom-[140px]' : 'bottom-[40px]'
             } ${animation === 'horizontal' ? 'animate-bounce' : ''}`}
           >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-xl">
                 🧑‍💼
              </div>
           </div>
           
        </div>

        {/* Message Box */}
        <div className="h-20 max-w-lg text-center">
           {animation === "up" && <div className="text-emerald-400 font-bold text-xl animate-fade-in uppercase tracking-widest">Mobilitas Vertikal Naik (Social Climbing) 📈</div>}
           {animation === "down" && <div className="text-rose-400 font-bold text-xl animate-fade-in uppercase tracking-widest">Mobilitas Vertikal Turun (Social Sinking) 📉</div>}
           {animation === "horizontal" && <div className="text-blue-400 font-bold text-xl animate-fade-in uppercase tracking-widest">Mobilitas Horizontal ↔️</div>}
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Skenario Kehidupan</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Simulasikan Peristiwa:</div>
          
          <button onClick={()=>moveVertical(2)} disabled={level===2} className="w-full p-3 text-left rounded-xl bg-amber-950/30 border border-amber-900/50 text-amber-300 hover:bg-amber-900/50 text-sm disabled:opacity-30 disabled:cursor-not-allowed">
             🎓 Lulus S2 & Jadi Direktur Perusahaan
          </button>
          
          <button onClick={()=>moveVertical(1)} disabled={level===1} className="w-full p-3 text-left rounded-xl bg-blue-950/30 border border-blue-900/50 text-blue-300 hover:bg-blue-900/50 text-sm disabled:opacity-30 disabled:cursor-not-allowed">
             💼 Diterima jadi PNS Golongan II
          </button>

          <button onClick={()=>moveVertical(0)} disabled={level===0} className="w-full p-3 text-left rounded-xl bg-rose-950/30 border border-rose-900/50 text-rose-300 hover:bg-rose-900/50 text-sm disabled:opacity-30 disabled:cursor-not-allowed">
             🔥 Bangkrut total & Menanggung Utang
          </button>

          <div className="my-4 border-b border-white/10" />

          <button onClick={()=>moveHorizontal()} className="w-full p-3 text-left rounded-xl bg-zinc-800 border border-zinc-600 text-white hover:bg-zinc-700 text-sm">
             ↔️ Pindah kerja beda kantor (Gaji/Jabatan sama)
          </button>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-8">
            <p><strong>Pendidikan (Sekolah)</strong> adalah saluran mobilitas sosial vertikal (naik) yang paling efektif, alias *Social Elevator*.</p>
            <p>Itulah sebabnya negara maju selalu memberikan pendidikan gratis berkualitas, agar rakyat kelas bawah punya kesempatan adil untuk naik kelas sosial.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
