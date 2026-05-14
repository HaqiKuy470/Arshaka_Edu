"use client";

import { useState } from "react";

export default function AlatMusikTradisional() {
  const [activeInst, setActiveInst] = useState<"angklung"|"sasando"|"gamelan">("angklung");
  const [isPlaying, setIsPlaying] = useState(false);

  const triggerPlay = () => {
     setIsPlaying(true);
     setTimeout(() => setIsPlaying(false), 1000);
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 p-4 lg:p-8 overflow-y-auto">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Instrumen Tradisional Nusantara</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-lg mx-auto">
           Fisika dan seni di balik alat musik kebanggaan Indonesia.
        </p>

        <div className="w-full max-w-3xl bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative min-h-[400px] flex items-center justify-center overflow-hidden">
           
           {activeInst === "angklung" && (
              <div className="flex flex-col items-center animate-fade-in">
                 {/* Stylized Angklung */}
                 <div className={`relative flex gap-2 items-end transition-transform duration-[50ms] ${isPlaying ? 'translate-x-2 -rotate-2' : ''}`}>
                    <div className="w-8 h-48 bg-amber-600 rounded-t-3xl border-2 border-amber-800 shadow-inner flex flex-col justify-end">
                       <div className="w-full h-8 bg-black/30 rounded-full mb-8" /> {/* Resonance hole */}
                    </div>
                    <div className="w-10 h-64 bg-amber-600 rounded-t-3xl border-2 border-amber-800 shadow-inner flex flex-col justify-end">
                       <div className="w-full h-10 bg-black/30 rounded-full mb-12" />
                    </div>
                    {/* Horizontal tying bamboo */}
                    <div className="absolute bottom-8 -left-4 w-32 h-4 bg-amber-700 border-y border-amber-900" />
                 </div>
                 
                 {isPlaying && (
                    <div className="absolute top-1/4 -right-12 text-3xl animate-ping">🎵</div>
                 )}

                 <div className="mt-12 text-center">
                    <h3 className="text-2xl font-bold text-amber-500">Angklung (Jawa Barat)</h3>
                    <p className="text-zinc-400 text-sm mt-2 max-w-md">Dibunyikan dengan cara digoyangkan (Idiofon). Benturan tabung bambu besar dan kecil menghasilkan resonansi nada yang bergetar.</p>
                 </div>
              </div>
           )}

           {activeInst === "sasando" && (
              <div className="flex flex-col items-center animate-fade-in">
                 {/* Stylized Sasando */}
                 <div className="relative">
                    {/* The Haik (Lontar leaf resonator) */}
                    <div className="w-64 h-64 bg-yellow-700/80 rounded-full border-4 border-yellow-900 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden">
                       <div className="w-full h-full border-x-[40px] border-yellow-800/30 rounded-full" />
                    </div>
                    {/* The Bamboo Tube with strings */}
                    <div className="absolute top-[-20px] bottom-[-20px] left-1/2 -translate-x-1/2 w-8 bg-amber-800 border-x-2 border-amber-950 flex justify-center z-10 shadow-xl">
                       {/* Strings */}
                       <div className={`w-[1px] h-full bg-white/50 mx-[1px] ${isPlaying ? 'animate-[pulse_0.1s_infinite]' : ''}`} />
                       <div className={`w-[1px] h-full bg-white/50 mx-[1px] ${isPlaying ? 'animate-[pulse_0.1s_infinite]' : ''}`} />
                       <div className={`w-[1px] h-full bg-white/50 mx-[1px] ${isPlaying ? 'animate-[pulse_0.1s_infinite]' : ''}`} />
                    </div>
                 </div>

                 {isPlaying && (
                    <div className="absolute top-1/4 -right-12 text-3xl animate-ping">🎶</div>
                 )}

                 <div className="mt-12 text-center">
                    <h3 className="text-2xl font-bold text-yellow-500">Sasando (Nusa Tenggara Timur)</h3>
                    <p className="text-zinc-400 text-sm mt-2 max-w-md">Alat musik petik (Kordofon). Menggunakan daun lontar yang melengkung sebagai tabung resonansi untuk memperkuat suara dawai/senar.</p>
                 </div>
              </div>
           )}

           {activeInst === "gamelan" && (
              <div className="flex flex-col items-center animate-fade-in">
                 {/* Stylized Gamelan (Saron) */}
                 <div className="relative flex flex-col items-center">
                    <div className="flex gap-2 mb-2 z-10">
                       {[6,5,4,3,2,1,0].map(i => (
                          <div key={i} className={`w-12 h-4 bg-amber-400 border-2 border-amber-600 shadow-[inset_0_4px_4px_rgba(255,255,255,0.4)] rounded-sm transition-transform duration-100 ${isPlaying && i===3 ? 'translate-y-1 bg-yellow-300' : ''}`} style={{ marginTop: `${i*2}px` }} />
                       ))}
                    </div>
                    {/* Wood base */}
                    <div className="w-96 h-16 bg-[#4a3018] rounded-b-xl border-b-8 border-black/30 shadow-2xl relative">
                       {/* Carving details */}
                       <div className="absolute top-4 left-4 w-12 h-8 border-2 border-[#8b5a2b] rounded-full opacity-50" />
                       <div className="absolute top-4 right-4 w-12 h-8 border-2 border-[#8b5a2b] rounded-full opacity-50" />
                    </div>
                    
                    {/* Mallet (Tabuh) */}
                    <div className={`absolute -top-12 left-1/2 w-2 h-16 bg-zinc-800 rounded transition-transform duration-200 origin-top ${isPlaying ? 'rotate-45 translate-y-8' : '-rotate-12'}`}>
                       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-rose-800 rounded-full" />
                    </div>
                 </div>

                 {isPlaying && (
                    <div className="absolute top-0 right-16 text-3xl animate-ping font-black text-amber-500">TING!</div>
                 )}

                 <div className="mt-12 text-center">
                    <h3 className="text-2xl font-bold text-[#f5deb3]">Saron / Gamelan (Jawa & Bali)</h3>
                    <p className="text-zinc-400 text-sm mt-2 max-w-md">Bilah logam perunggu yang dipukul (Metalofon). Bilah yang lebih pendek menghasilkan nada yang lebih tinggi (Frekuensi getar lebih cepat).</p>
                 </div>
              </div>
           )}

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Mainkan Instrumen</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          <button 
             onClick={()=>{setActiveInst("angklung"); triggerPlay()}} 
             className={`w-full p-4 flex items-center gap-4 text-left rounded-xl transition-all border ${activeInst === 'angklung' ? 'bg-amber-900 border-amber-500 text-white shadow-lg' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
          >
             <span className="text-2xl">🎋</span>
             <span className="font-bold">Angklung</span>
          </button>
          
          <button 
             onClick={()=>{setActiveInst("sasando"); triggerPlay()}} 
             className={`w-full p-4 flex items-center gap-4 text-left rounded-xl transition-all border ${activeInst === 'sasando' ? 'bg-yellow-900 border-yellow-500 text-white shadow-lg' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
          >
             <span className="text-2xl">🍃</span>
             <span className="font-bold">Sasando</span>
          </button>

          <button 
             onClick={()=>{setActiveInst("gamelan"); triggerPlay()}} 
             className={`w-full p-4 flex items-center gap-4 text-left rounded-xl transition-all border ${activeInst === 'gamelan' ? 'bg-[#4a3018] border-[#8b5a2b] text-white shadow-lg' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
          >
             <span className="text-2xl">🔨</span>
             <span className="font-bold">Gamelan (Saron)</span>
          </button>

          <div className="p-4 bg-zinc-900 rounded-xl border border-white/5 mt-8 text-xs text-zinc-400 leading-relaxed">
             <h4 className="font-bold text-white mb-2">Sistem Klasifikasi Sachs-Hornbostel:</h4>
             <ul className="list-disc pl-4 space-y-1">
                <li><span className="text-emerald-400">Idiofon</span>: Angklung, Gamelan (Badan alat bergetar)</li>
                <li><span className="text-rose-400">Kordofon</span>: Sasando, Kecapi (Dawai/Senar bergetar)</li>
                <li><span className="text-blue-400">Aerofon</span>: Suling, Saluang (Udara bergetar)</li>
                <li><span className="text-amber-400">Membranofon</span>: Tifa, Kendang (Kulit bergetar)</li>
             </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
