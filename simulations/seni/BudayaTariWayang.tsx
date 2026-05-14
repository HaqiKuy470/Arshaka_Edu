"use client";

import { useState } from "react";

export default function BudayaTariWayang() {
  const [culture, setCulture] = useState<"wayang"|"saman"|"kecak">("wayang");

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center bg-zinc-950 p-4 lg:p-8 overflow-y-auto">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Seni Pertunjukan Nusantara</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-lg mx-auto">
           Kombinasi luar biasa dari seni rupa, teater, musik, dan sastra lokal.
        </p>

        <div className="w-full max-w-4xl bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative min-h-[450px] flex items-center justify-center overflow-hidden">
           
           {culture === "wayang" && (
              <div className="relative w-full h-full flex flex-col items-center justify-center animate-fade-in">
                 {/* The Kelir (Screen) */}
                 <div className="absolute inset-0 bg-yellow-100/10 border-[16px] border-[#3e2723] rounded shadow-[inset_0_0_100px_rgba(255,255,255,0.2)] flex items-center justify-center overflow-hidden">
                    
                    {/* Blencong (Oil Lamp Light) */}
                    <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-yellow-500/30 rounded-full blur-3xl animate-pulse" />
                    
                    {/* Gunungan Silhouette */}
                    <svg width="200" height="300" viewBox="0 0 100 150" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fill-black opacity-80 drop-shadow-2xl z-10">
                       <path d="M50 0 Q60 50 100 120 L0 120 Q40 50 50 0 Z" />
                       <circle cx="50" cy="80" r="15" fill="transparent" stroke="#222" strokeWidth="2" />
                    </svg>

                 </div>
                 
                 <div className="absolute bottom-8 bg-black/80 px-6 py-4 rounded-xl border border-zinc-700 text-center z-20 max-w-md">
                    <h3 className="text-amber-400 font-bold text-xl mb-1">Wayang Kulit (Jawa/Bali)</h3>
                    <p className="text-zinc-300 text-sm">Seni bayangan. Dalang menceritakan epik Mahabarata/Ramayana sebagai cerminan sifat manusia. Kelir melambangkan alam semesta, Blencong melambangkan matahari.</p>
                 </div>
              </div>
           )}

           {culture === "saman" && (
              <div className="relative w-full h-full flex flex-col items-center justify-center animate-fade-in">
                 
                 <div className="flex gap-1 md:gap-4 mb-20 z-10">
                    {[1,2,3,4,5,6,7].map((i) => (
                       <div key={i} className="flex flex-col items-center" style={{ animation: `bounce 1s infinite ${i%2===0 ? 'alternate' : 'alternate-reverse'}` }}>
                          {/* Dancer head and shoulders */}
                          <div className="w-10 h-10 md:w-16 md:h-16 bg-yellow-600 rounded-full border-4 border-red-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">👳‍♂️</div>
                          <div className="w-12 md:w-20 h-16 md:h-24 bg-red-600 rounded-t-xl mt-2 border-x-4 border-yellow-500 relative">
                             {/* Arms pattern cross */}
                             <div className="absolute top-4 left-0 w-full h-2 bg-yellow-500/50 -rotate-12" />
                             <div className="absolute top-4 left-0 w-full h-2 bg-yellow-500/50 rotate-12" />
                          </div>
                       </div>
                    ))}
                 </div>

                 <div className="absolute bottom-8 bg-black/80 px-6 py-4 rounded-xl border border-zinc-700 text-center z-20 max-w-md">
                    <h3 className="text-red-400 font-bold text-xl mb-1">Tari Saman (Gayo, Aceh)</h3>
                    <p className="text-zinc-300 text-sm">Tarian Seribu Tangan. Kecepatan dan kekompakan absolut menepuk dada dan tangan. Mengandung nilai keagamaan (Dakwah), pendidikan, dan kepahlawanan.</p>
                 </div>
              </div>
           )}

           {culture === "kecak" && (
              <div className="relative w-full h-full flex flex-col items-center justify-center animate-fade-in overflow-hidden">
                 
                 {/* Concentric circles of men */}
                 <div className="relative w-64 h-64 md:w-80 md:h-80 border-4 border-amber-900/50 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
                    <div className="absolute w-48 h-48 border-4 border-amber-800/50 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
                    <div className="absolute w-32 h-32 border-4 border-amber-700/50 rounded-full animate-[spin_6s_linear_infinite]" />
                    
                    {/* Fire at center */}
                    <div className="text-5xl md:text-7xl absolute z-20 animate-pulse">🔥</div>
                 </div>

                 <div className="absolute inset-0 flex items-center justify-center text-white/5 font-black text-9xl uppercase tracking-widest pointer-events-none z-0">
                    CAK CAK
                 </div>

                 <div className="absolute bottom-8 bg-black/80 px-6 py-4 rounded-xl border border-zinc-700 text-center z-20 max-w-md">
                    <h3 className="text-orange-400 font-bold text-xl mb-1">Tari Kecak (Bali)</h3>
                    <p className="text-zinc-300 text-sm">Tanpa iringan alat musik (A Cappella). Hanya mengandalkan paduan suara mulut puluhan pria "Cak cak cak" yang magis, melingkari api unggun menceritakan kisah Ramayana.</p>
                 </div>
              </div>
           )}

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Eksplorasi Mahakarya</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          <button 
             onClick={()=>setCulture("wayang")} 
             className={`w-full p-4 flex items-center gap-4 text-left rounded-xl transition-all border ${culture === 'wayang' ? 'bg-yellow-900 border-yellow-500 text-white shadow-lg' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
          >
             <span className="text-2xl">🎭</span>
             <span className="font-bold">Wayang Kulit</span>
          </button>
          
          <button 
             onClick={()=>setCulture("saman")} 
             className={`w-full p-4 flex items-center gap-4 text-left rounded-xl transition-all border ${culture === 'saman' ? 'bg-red-900 border-red-500 text-white shadow-lg' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
          >
             <span className="text-2xl">🤝</span>
             <span className="font-bold">Tari Saman</span>
          </button>

          <button 
             onClick={()=>setCulture("kecak")} 
             className={`w-full p-4 flex items-center gap-4 text-left rounded-xl transition-all border ${culture === 'kecak' ? 'bg-orange-900 border-orange-500 text-white shadow-lg' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
          >
             <span className="text-2xl">🔥</span>
             <span className="font-bold">Tari Kecak</span>
          </button>

          <div className="p-4 bg-zinc-900 rounded-xl border border-white/5 mt-8 text-xs text-zinc-400 leading-relaxed">
             <p className="font-bold text-white mb-2">Seni Terapan vs Seni Murni</p>
             <p>Pertunjukan tradisional Nusantara bukan sekadar <em>Seni Murni</em> (hanya untuk keindahan), melainkan <em>Seni Terapan</em> (memiliki fungsi). Fungsi utamanya adalah edukasi moral masyarakat, ritual keagamaan, penyampaian sejarah lisan, dan perekat solidaritas warga.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
