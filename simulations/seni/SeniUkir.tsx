"use client";

import { useState } from "react";

export default function SeniUkir() {
  const [style, setStyle] = useState<"jepara"|"bali"|"toraja">("jepara");

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center bg-zinc-950 p-4 lg:p-8 overflow-y-auto">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Seni Ukir & Ornamen Nusantara</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-lg mx-auto">
           Mengenal ciri khas pahatan kayu dari berbagai daerah di Indonesia.
        </p>

        <div className="w-full max-w-2xl bg-[#5c4033] border-[16px] border-[#3e2723] rounded p-8 shadow-2xl relative min-h-[400px] flex items-center justify-center overflow-hidden">
           
           {/* Wood texture background overlay */}
           <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)`
           }} />

           {style === "jepara" && (
              <div className="relative animate-fade-in text-center flex flex-col items-center">
                 {/* Visual Representation of Jepara carving (Leaves & Flowers interlocking) */}
                 <svg width="200" height="200" viewBox="0 0 100 100" className="drop-shadow-[2px_4px_4px_rgba(0,0,0,0.8)] fill-[#8b5a2b]">
                    <path d="M50 10 Q70 0 90 20 Q80 40 50 50 Q20 40 10 20 Q30 0 50 10 Z" />
                    <path d="M50 50 Q70 70 90 90 Q60 100 50 90 Q40 100 10 90 Q30 70 50 50 Z" />
                    <circle cx="50" cy="50" r="10" fill="#4a3018" />
                 </svg>
                 <div className="mt-8 text-[#f5deb3] font-bold tracking-widest uppercase">Motif Daun Trubusan (Jepara)</div>
              </div>
           )}

           {style === "bali" && (
              <div className="relative animate-fade-in text-center flex flex-col items-center">
                 {/* Visual Representation of Bali carving (Symmetrical, dense, demon/floral mask like Karang Boma) */}
                 <svg width="200" height="200" viewBox="0 0 100 100" className="drop-shadow-[2px_4px_4px_rgba(0,0,0,0.8)] fill-[#b8860b]">
                    <rect x="20" y="20" width="60" height="60" rx="10" />
                    <circle cx="35" cy="40" r="8" fill="#4a3018" />
                    <circle cx="65" cy="40" r="8" fill="#4a3018" />
                    <path d="M30 70 Q50 90 70 70" fill="none" stroke="#4a3018" strokeWidth="5" />
                    {/* Intricate surrounding curves */}
                    <path d="M20 20 Q0 50 20 80" fill="none" stroke="#b8860b" strokeWidth="8" />
                    <path d="M80 20 Q100 50 80 80" fill="none" stroke="#b8860b" strokeWidth="8" />
                 </svg>
                 <div className="mt-8 text-[#f5deb3] font-bold tracking-widest uppercase">Motif Karang Boma (Bali)</div>
              </div>
           )}

           {style === "toraja" && (
              <div className="relative animate-fade-in text-center flex flex-col items-center">
                 {/* Visual Representation of Toraja (Geometric, black/red/yellow/white patterns) */}
                 <div className="flex flex-col gap-2 drop-shadow-[2px_4px_4px_rgba(0,0,0,0.8)]">
                    <svg width="200" height="60" viewBox="0 0 100 30" className="fill-transparent stroke-white stroke-2">
                       <path d="M0 15 L10 0 L20 15 L30 0 L40 15 L50 0 L60 15 L70 0 L80 15 L90 0 L100 15 L90 30 L80 15 L70 30 L60 15 L50 30 L40 15 L30 30 L20 15 L10 30 Z" fill="#b91c1c" />
                    </svg>
                    <svg width="200" height="60" viewBox="0 0 100 30" className="fill-transparent stroke-black stroke-2">
                       <path d="M0 15 L10 0 L20 15 L30 0 L40 15 L50 0 L60 15 L70 0 L80 15 L90 0 L100 15 L90 30 L80 15 L70 30 L60 15 L50 30 L40 15 L30 30 L20 15 L10 30 Z" fill="#fbbf24" />
                    </svg>
                 </div>
                 <div className="mt-8 text-[#f5deb3] font-bold tracking-widest uppercase">Motif Pa'tedong / Geometris (Toraja)</div>
              </div>
           )}

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Ragam Ukiran</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          <button 
             onClick={()=>setStyle("jepara")} 
             className={`w-full p-4 text-left rounded-xl transition-all border ${style === 'jepara' ? 'bg-[#4a3018] border-[#8b5a2b] text-white shadow-lg' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
          >
             <div className="font-bold">Ukiran Jepara (Jawa Tengah)</div>
             <div className="text-[10px] opacity-80 mt-1">Sangat luwes, dinamis, mengandalkan motif daun menjalar, relung, dan bunga yang saling bertumpuk (relief tinggi).</div>
          </button>
          
          <button 
             onClick={()=>setStyle("bali")} 
             className={`w-full p-4 text-left rounded-xl transition-all border ${style === 'bali' ? 'bg-[#4a3018] border-[#8b5a2b] text-white shadow-lg' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
          >
             <div className="font-bold">Ukiran Bali</div>
             <div className="text-[10px] opacity-80 mt-1">Cenderung simetris, padat, cekungan dalam. Sering memasukkan figur mitologi dewa, naga, atau makhluk mistis (Karang Boma/Keket).</div>
          </button>

          <button 
             onClick={()=>setStyle("toraja")} 
             className={`w-full p-4 text-left rounded-xl transition-all border ${style === 'toraja' ? 'bg-[#4a3018] border-[#8b5a2b] text-white shadow-lg' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
          >
             <div className="font-bold">Ukiran Toraja (Sulawesi Selatan)</div>
             <div className="text-[10px] opacity-80 mt-1">Didominasi bentuk geometris berulang (garis, segitiga) dan hewan kerbau (Pa'tedong). Menggunakan 4 warna sakral: Hitam, Merah, Kuning, Putih.</div>
          </button>

        </div>
      </div>
    </div>
  );
}
