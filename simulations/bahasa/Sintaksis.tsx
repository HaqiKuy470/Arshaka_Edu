"use client";

import { useState } from "react";

export default function Sintaksis() {
  const [level, setLevel] = useState(2); // 0=Word, 1=Phrase, 2=Clause/Sentence

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <h2 className="text-2xl font-bold text-white mb-8">Pohon Sintaksis (Syntax Tree)</h2>

        {/* Tree Visualizer */}
        <div className="relative flex flex-col items-center">
           
           {/* Level 2: Sentence (S) */}
           <div className={`transition-all duration-500 ${level >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
              <div className="bg-white text-black font-bold px-6 py-2 rounded-xl mb-8 shadow-[0_0_20px_rgba(255,255,255,0.5)] z-10 relative">
                 Kalimat (K)
              </div>
              
              {/* Lines from S to NP and VP */}
              <svg className="absolute w-[400px] h-[40px] top-10 left-1/2 -translate-x-1/2 pointer-events-none" viewBox="0 0 400 40">
                 <path d="M 200 0 L 100 40" stroke="white" strokeWidth="2" fill="none" />
                 <path d="M 200 0 L 300 40" stroke="white" strokeWidth="2" fill="none" />
              </svg>
           </div>

           <div className="flex gap-[120px]">
              {/* Level 1: Noun Phrase (NP) */}
              <div className={`flex flex-col items-center transition-all duration-500 delay-100 ${level >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                 <div className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg mb-8 relative">
                    Frasa Nomina (FN)
                 </div>
                 
                 <svg className="absolute w-[160px] h-[40px] top-[144px] left-[calc(50%-180px)] pointer-events-none" viewBox="0 0 160 40">
                    <path d="M 80 0 L 30 40" stroke="#3b82f6" strokeWidth="2" fill="none" />
                    <path d="M 80 0 L 130 40" stroke="#3b82f6" strokeWidth="2" fill="none" />
                 </svg>

                 {/* Level 0: Words for NP */}
                 <div className={`flex gap-4 transition-all duration-500 delay-200 ${level >= 0 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                    <div className="flex flex-col items-center">
                       <span className="text-xs text-blue-400 font-bold mb-1">Nomina</span>
                       <div className="bg-zinc-800 border border-zinc-600 text-white px-3 py-2 rounded">Kucing</div>
                    </div>
                    <div className="flex flex-col items-center">
                       <span className="text-xs text-blue-400 font-bold mb-1">Adjektiva</span>
                       <div className="bg-zinc-800 border border-zinc-600 text-white px-3 py-2 rounded">Hitam</div>
                    </div>
                 </div>
              </div>

              {/* Level 1: Verb Phrase (VP) */}
              <div className={`flex flex-col items-center transition-all duration-500 delay-300 ${level >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                 <div className="bg-red-600 text-white font-bold px-4 py-2 rounded-lg mb-8 relative">
                    Frasa Verba (FV)
                 </div>
                 
                 <svg className="absolute w-[160px] h-[40px] top-[144px] left-[calc(50%+20px)] pointer-events-none" viewBox="0 0 160 40">
                    <path d="M 80 0 L 30 40" stroke="#ef4444" strokeWidth="2" fill="none" />
                    <path d="M 80 0 L 130 40" stroke="#ef4444" strokeWidth="2" fill="none" />
                 </svg>

                 {/* Level 0: Words for VP */}
                 <div className={`flex gap-4 transition-all duration-500 delay-400 ${level >= 0 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                    <div className="flex flex-col items-center">
                       <span className="text-xs text-red-400 font-bold mb-1">Verba</span>
                       <div className="bg-zinc-800 border border-zinc-600 text-white px-3 py-2 rounded">Mengejar</div>
                    </div>
                    <div className="flex flex-col items-center">
                       <span className="text-xs text-emerald-400 font-bold mb-1">Nomina</span>
                       <div className="bg-zinc-800 border border-zinc-600 text-white px-3 py-2 rounded">Tikus</div>
                    </div>
                 </div>
              </div>
           </div>

        </div>

        {/* The Full Sentence Box */}
        <div className="mt-16 bg-white/5 border border-white/10 px-8 py-4 rounded-2xl flex gap-2 text-xl shadow-lg">
           <span className="text-blue-300 font-bold">Kucing</span>
           <span className="text-blue-300 font-bold">hitam</span>
           <span className="text-red-400 font-bold">mengejar</span>
           <span className="text-emerald-400 font-bold">tikus.</span>
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Sintaksis (Pohon Frasa)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-3">
             <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Tahap Analisis:</div>
             <button onClick={()=>setLevel(0)} className={`w-full p-3 text-left rounded-xl border transition-all ${level === 0 ? 'bg-zinc-800 border-zinc-400 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
                1. Kata (Words)
             </button>
             <button onClick={()=>setLevel(1)} className={`w-full p-3 text-left rounded-xl border transition-all ${level === 1 ? 'bg-blue-900 border-blue-400 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
                2. Pengelompokan Frasa
             </button>
             <button onClick={()=>setLevel(2)} className={`w-full p-3 text-left rounded-xl border transition-all ${level === 2 ? 'bg-white text-black font-bold' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
                3. Kesatuan Kalimat
             </button>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Sintaksis</strong> adalah cabang linguistik yang mempelajari bagaimana kata-kata dirangkai menjadi frasa, klausa, dan kalimat yang bermakna.</p>
            <p>Dengan <strong>Diagram Pohon (Tree Diagram)</strong>, kita bisa melihat bahwa kalimat bukanlah sekadar jejeran kata, melainkan blok-blok frasa yang memiliki hierarki.</p>
            <p className="mt-2 text-amber-400">Contoh: "Kucing hitam" adalah satu kesatuan (Frasa Nomina) yang bertindak sebagai Subjek.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
