"use client";

import { useState } from "react";

export default function SiklusBatuan() {
  const [stage, setStage] = useState<"magma"|"beku"|"sedimen"|"metamorf">("magma");

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        {/* Cycle Diagram */}
        <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center">
           
           {/* Magma (Center) */}
           <div 
             onClick={()=>setStage("magma")}
             className={`absolute z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center cursor-pointer font-bold transition-all border-4 ${stage === 'magma' ? 'bg-orange-600 text-white border-white scale-125 shadow-[0_0_30px_rgba(234,88,12,0.8)]' : 'bg-orange-950 text-orange-500 border-orange-500/50 hover:bg-orange-900'}`}
           >
             <span className="text-2xl mb-1">🌋</span>
             <span className="text-xs uppercase">Magma</span>
           </div>

           {/* Batuan Beku (Top) */}
           <div 
             onClick={()=>setStage("beku")}
             className={`absolute z-10 -top-4 w-28 h-28 rounded-2xl flex flex-col items-center justify-center cursor-pointer font-bold transition-all border-4 ${stage === 'beku' ? 'bg-slate-700 text-white border-white scale-110 shadow-[0_0_30px_rgba(51,65,85,0.8)]' : 'bg-slate-950 text-slate-400 border-slate-500/50 hover:bg-slate-900'}`}
           >
             <span className="text-3xl mb-1">🪨</span>
             <span className="text-xs uppercase text-center">Batuan<br/>Beku</span>
           </div>

           {/* Batuan Sedimen (Bottom Right) */}
           <div 
             onClick={()=>setStage("sedimen")}
             className={`absolute z-10 bottom-4 -right-4 w-28 h-28 rounded-2xl flex flex-col items-center justify-center cursor-pointer font-bold transition-all border-4 ${stage === 'sedimen' ? 'bg-yellow-600 text-white border-white scale-110 shadow-[0_0_30px_rgba(202,138,4,0.8)]' : 'bg-yellow-950 text-yellow-500 border-yellow-500/50 hover:bg-yellow-900'}`}
           >
             <div className="flex flex-col gap-[2px] mb-2 w-12">
                <div className="h-2 bg-yellow-400 w-full rounded-sm" />
                <div className="h-2 bg-amber-600 w-full rounded-sm" />
                <div className="h-2 bg-yellow-500 w-full rounded-sm" />
             </div>
             <span className="text-xs uppercase text-center">Batuan<br/>Sedimen</span>
           </div>

           {/* Batuan Metamorf (Bottom Left) */}
           <div 
             onClick={()=>setStage("metamorf")}
             className={`absolute z-10 bottom-4 -left-4 w-28 h-28 rounded-2xl flex flex-col items-center justify-center cursor-pointer font-bold transition-all border-4 ${stage === 'metamorf' ? 'bg-emerald-700 text-white border-white scale-110 shadow-[0_0_30px_rgba(4,120,87,0.8)]' : 'bg-emerald-950 text-emerald-500 border-emerald-500/50 hover:bg-emerald-900'}`}
           >
             <span className="text-3xl mb-1 text-emerald-400">💎</span>
             <span className="text-xs uppercase text-center">Batuan<br/>Metamorf</span>
           </div>

           {/* Arrows Base */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
             <defs>
               <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                 <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.4)" />
               </marker>
               <marker id="arrow-active" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                 <path d="M 0 0 L 10 5 L 0 10 z" fill="white" />
               </marker>
             </defs>

             {/* Magma -> Beku */}
             <path d="M 200 150 L 200 100" stroke={stage==='beku' ? "white" : "rgba(255,255,255,0.2)"} strokeWidth="4" markerEnd={stage==='beku' ? "url(#arrow-active)" : "url(#arrow)"} />
             {stage==='beku' && <text x="210" y="130" fill="white" fontSize="12" fontWeight="bold">Pendinginan</text>}

             {/* Beku -> Sedimen */}
             <path d="M 250 80 Q 320 100 300 230" fill="none" stroke={stage==='sedimen' ? "white" : "rgba(255,255,255,0.2)"} strokeWidth="4" markerEnd={stage==='sedimen' ? "url(#arrow-active)" : "url(#arrow)"} />
             {stage==='sedimen' && <text x="310" y="150" fill="white" fontSize="12" fontWeight="bold">Pelapukan & Endapan</text>}

             {/* Sedimen -> Metamorf */}
             <path d="M 250 300 L 150 300" stroke={stage==='metamorf' ? "white" : "rgba(255,255,255,0.2)"} strokeWidth="4" markerEnd={stage==='metamorf' ? "url(#arrow-active)" : "url(#arrow)"} />
             {stage==='metamorf' && <text x="160" y="320" fill="white" fontSize="12" fontWeight="bold">Tekanan & Suhu</text>}

             {/* Metamorf -> Magma */}
             <path d="M 120 230 Q 150 180 160 170" fill="none" stroke={stage==='magma' ? "white" : "rgba(255,255,255,0.2)"} strokeWidth="4" markerEnd={stage==='magma' ? "url(#arrow-active)" : "url(#arrow)"} />
             {stage==='magma' && <text x="90" y="190" fill="white" fontSize="12" fontWeight="bold">Pelelehan</text>}

             {/* Internal shortcuts (e.g. Beku -> Metamorf) */}
             <path d="M 170 100 Q 120 150 120 230" fill="none" stroke={stage==='metamorf' ? "white" : "rgba(255,255,255,0.1)"} strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrow)" />
           </svg>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Siklus Batuan</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          <div className="text-xs text-zinc-500 mb-2 uppercase tracking-widest font-bold">Fase Terpilih:</div>

          {stage === "magma" && (
            <div className="bg-orange-950/50 p-4 rounded-xl border border-orange-500/50">
              <h4 className="text-xl font-bold text-orange-400 mb-2">Magma</h4>
              <p className="text-sm text-zinc-300">Cairan batuan yang sangat panas di dalam perut bumi. Ini adalah asal muasal dari semua jenis batuan.</p>
              <div className="mt-4 p-2 bg-black/50 rounded text-xs">
                <strong>Proses Selanjutnya:</strong> Jika magma naik ke permukaan (Lava) atau menyusup ke kerak bumi lalu mendingin, ia akan mengeras menjadi <span className="text-slate-300 font-bold">Batuan Beku</span>.
              </div>
            </div>
          )}

          {stage === "beku" && (
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-500/50">
              <h4 className="text-xl font-bold text-slate-300 mb-2">Batuan Beku (Igneous)</h4>
              <p className="text-sm text-zinc-300">Terbentuk langsung dari pendinginan magma/lava. Batuan ini sangat keras dan padat.</p>
              <div className="mt-2 text-xs text-zinc-400">Contoh: Batu Granit, Andesit, Basalt, Obsidian.</div>
              <div className="mt-4 p-2 bg-black/50 rounded text-xs">
                <strong>Proses Selanjutnya:</strong> Jika terkena cuaca, batuan ini akan melapuk menjadi debu/pasir, terbawa air, dan mengendap menjadi <span className="text-yellow-400 font-bold">Batuan Sedimen</span>.
              </div>
            </div>
          )}

          {stage === "sedimen" && (
            <div className="bg-yellow-950/50 p-4 rounded-xl border border-yellow-600/50">
              <h4 className="text-xl font-bold text-yellow-400 mb-2">Batuan Sedimen</h4>
              <p className="text-sm text-zinc-300">Terbentuk dari endapan pecahan batuan lain, pasir, atau sisa makhluk hidup yang memfosil dan mengeras di dasar laut/sungai berlapis-lapis.</p>
              <div className="mt-2 text-xs text-zinc-400">Contoh: Batu Gamping (Kapur), Batu Pasir, Batu Bara.</div>
              <div className="mt-4 p-2 bg-black/50 rounded text-xs">
                <strong>Proses Selanjutnya:</strong> Jika tertimbun makin dalam, terkena tekanan dan suhu panas bumi yang tinggi, ia akan berubah bentuk menjadi <span className="text-emerald-400 font-bold">Batuan Metamorf</span>.
              </div>
            </div>
          )}

          {stage === "metamorf" && (
            <div className="bg-emerald-950/50 p-4 rounded-xl border border-emerald-600/50">
              <h4 className="text-xl font-bold text-emerald-400 mb-2">Batuan Metamorf (Malihan)</h4>
              <p className="text-sm text-zinc-300">Batuan yang telah "berubah bentuk" (metamorfosis) dari batuan beku atau sedimen karena tekanan dan panas ekstrim tanpa mencair.</p>
              <div className="mt-2 text-xs text-zinc-400">Contoh: Batu Pualam (Marmer) dari kapur, Intan dari karbon.</div>
              <div className="mt-4 p-2 bg-black/50 rounded text-xs">
                <strong>Proses Selanjutnya:</strong> Jika terdorong lebih dalam lagi hingga melebihi titik lelehnya, batuan ini akan mencair kembali menjadi <span className="text-orange-400 font-bold">Magma</span>.
              </div>
            </div>
          )}

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 text-xs text-zinc-400 leading-relaxed mt-4 italic">
            Klik pada ikon batuan di layar untuk mempelajari tiap fase dalam siklus tak berujung planet kita.
          </div>

        </div>
      </div>
    </div>
  );
}
