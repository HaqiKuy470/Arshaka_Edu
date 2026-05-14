"use client";

import { useState } from "react";

export default function PasangSurut() {
  const [moonPosition, setMoonPosition] = useState(0); // 0, 90, 180, 270 degrees

  const getTideStatus = (angle: number) => {
     if (angle === 0 || angle === 180) {
        return "Pasang Purnama (Spring Tide) - Sangat Tinggi";
     } else {
        return "Pasang Perbani (Neap Tide) - Rendah";
     }
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center bg-zinc-950 p-4 lg:p-8 overflow-y-auto">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Pasang Surut Air Laut</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-lg mx-auto">
           Bagaimana gravitasi Bulan menarik lautan Bumi.
        </p>

        <div className="w-full max-w-3xl bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative min-h-[450px] flex items-center justify-center overflow-hidden">
           
           {/* Light source from Sun (Fixed on left) */}
           <div className="absolute left-[-50px] top-1/2 -translate-y-1/2 w-48 h-48 bg-yellow-500 rounded-full blur-[100px] opacity-20 pointer-events-none" />
           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500 font-bold tracking-widest uppercase text-xs -rotate-90">Matahari</div>

           <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center">
              
              {/* Earth Center */}
              <div className="absolute w-24 h-24 rounded-full bg-emerald-600 border-2 border-emerald-400 z-20 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden">
                 {/* Continents rough shapes */}
                 <div className="absolute w-12 h-10 bg-green-500 rounded-full top-2 left-2 opacity-80" />
                 <div className="absolute w-8 h-12 bg-green-500 rounded-full bottom-2 right-4 opacity-80" />
                 <div className="text-[10px] font-bold text-white/50 z-10">Bumi</div>
              </div>

              {/* Water Bulge (Tides) */}
              <div 
                className="absolute w-36 h-36 border-[8px] border-blue-500/50 rounded-full z-10 transition-all duration-1000 ease-in-out"
                style={{ 
                   transform: `rotate(${moonPosition}deg)`,
                   // We make it an oval (bulge) pointing towards the moon
                   width: (moonPosition === 0 || moonPosition === 180) ? '160px' : '140px',
                   height: (moonPosition === 0 || moonPosition === 180) ? '120px' : '140px',
                   boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
                }} 
              />

              {/* Second Water Bulge (perpendicular, lower) - simulated by the opposite axis being smaller */}

              {/* Moon Orbit Path */}
              <div className="absolute w-full h-full border border-white/10 rounded-full border-dashed z-0" />

              {/* The Moon */}
              <div 
                 className="absolute w-full h-full z-30 transition-transform duration-1000 ease-in-out"
                 style={{ transform: `rotate(${moonPosition}deg)` }}
              >
                 {/* Moon positioned at right edge initially (0 deg) */}
                 <div className="absolute top-1/2 right-[-16px] -translate-y-1/2 w-8 h-8 bg-zinc-300 rounded-full shadow-[0_0_15px_white] flex items-center justify-center">
                    <div className="text-[8px] font-bold text-zinc-800">Bulan</div>
                 </div>

                 {/* Gravitational pull lines (Visual only) */}
                 <div className="absolute top-1/2 right-[16px] -translate-y-1/2 w-16 h-[2px] border-t-2 border-white/30 border-dotted" />
                 <div className="absolute top-1/2 right-[16px] translate-y-4 -rotate-12 w-16 h-[2px] border-t-2 border-white/30 border-dotted" />
                 <div className="absolute top-1/2 right-[16px] -translate-y-4 rotate-12 w-16 h-[2px] border-t-2 border-white/30 border-dotted" />
              </div>

           </div>

           <div className="absolute bottom-6 bg-black/60 px-6 py-3 rounded-xl border border-blue-500/30 text-center">
              <div className="text-xs text-blue-400 font-bold uppercase mb-1">Status Laut:</div>
              <div className="text-white font-bold">{getTideStatus(moonPosition)}</div>
           </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Kontrol Orbit Bulan</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          <button 
             onClick={()=>setMoonPosition(0)} 
             className={`w-full p-4 text-left rounded-xl transition-all border ${moonPosition === 0 ? 'bg-blue-900 border-blue-500 text-white shadow-lg' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
          >
             <div className="font-bold">Bulan Baru (Konjungsi)</div>
             <div className="text-[10px] opacity-80 mt-1">Bulan di antara Matahari dan Bumi. Gravitasi Bulan + Matahari bergabung = Pasang Purnama (Spring Tide).</div>
          </button>
          
          <button 
             onClick={()=>setMoonPosition(90)} 
             className={`w-full p-4 text-left rounded-xl transition-all border ${moonPosition === 90 ? 'bg-zinc-800 border-zinc-500 text-white shadow-lg' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
          >
             <div className="font-bold">Kuartal Pertama</div>
             <div className="text-[10px] opacity-80 mt-1">Bulan dan Matahari membentuk sudut 90 derajat. Gravitasi saling melemahkan = Pasang Perbani (Neap Tide).</div>
          </button>

          <button 
             onClick={()=>setMoonPosition(180)} 
             className={`w-full p-4 text-left rounded-xl transition-all border ${moonPosition === 180 ? 'bg-blue-900 border-blue-500 text-white shadow-lg' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
          >
             <div className="font-bold">Bulan Purnama (Oposisi)</div>
             <div className="text-[10px] opacity-80 mt-1">Bumi di antara Bulan dan Matahari. Tarikan kuat di kedua sisi = Pasang Purnama kembali terjadi.</div>
          </button>

          <div className="p-4 bg-blue-950/40 rounded-xl border border-blue-500/30 text-xs text-blue-200 leading-relaxed mt-6">
             <p className="font-bold mb-1">Mengapa air menonjol di dua sisi?</p>
             <p>Sisi yang menghadap bulan tertarik oleh gravitasi. Sisi yang membelakangi bulan menonjol keluar karena gaya sentrifugal inersia dari Bumi yang "tertarik" menjauhi air di sisi tersebut.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
