"use client";

import { useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";

export default function ReproduksiSel() {
  const [phase, setPhase] = useState(0); // 0 to 4 (Interphase, Prophase, Metaphase, Anaphase, Telophase/Cytokinesis)

  const phases = [
    { name: "Interfase", desc: "Sel beristirahat, tumbuh, dan menduplikasi DNA (kromosom) sebelum membelah." },
    { name: "Profase", desc: "Kromosom menebal dan terlihat jelas. Membran inti sel mulai menghilang." },
    { name: "Metafase", desc: "Kromosom berjajar rapi di tengah ekuator sel. Benang spindel menempel." },
    { name: "Anafase", desc: "Kromatid ditarik oleh benang spindel menuju kutub sel yang berlawanan." },
    { name: "Telofase & Sitokinesis", desc: "Membran inti terbentuk kembali. Sel membelah menjadi dua sel anak yang identik." }
  ];

  const nextPhase = () => setPhase((p) => (p < 4 ? p + 1 : 4));
  const reset = () => setPhase(0);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 p-6 min-h-[50vh] lg:min-h-0">
        
        {/* Cell Animation Container */}
        <div className="w-80 h-80 relative flex items-center justify-center">
          
          {/* Interphase (0) */}
          <div className={`absolute inset-0 transition-opacity duration-1000 flex items-center justify-center ${phase === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <div className="w-64 h-64 border-4 border-emerald-500 rounded-full bg-emerald-900/20 flex items-center justify-center relative">
              <div className="w-32 h-32 bg-indigo-500/50 rounded-full border border-indigo-300 flex items-center justify-center">
                <span className="text-4xl text-indigo-200">🧬</span>
              </div>
            </div>
          </div>

          {/* Prophase (1) */}
          <div className={`absolute inset-0 transition-opacity duration-1000 flex items-center justify-center ${phase === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <div className="w-64 h-64 border-4 border-emerald-500 rounded-full bg-emerald-900/20 flex items-center justify-center relative">
              <div className="w-32 h-32 border border-indigo-500/30 border-dashed rounded-full flex flex-wrap items-center justify-center gap-2 p-4">
                <div className="w-8 h-8 text-white font-bold transform rotate-12">X</div>
                <div className="w-8 h-8 text-white font-bold transform -rotate-12">X</div>
                <div className="w-8 h-8 text-white font-bold transform rotate-45">X</div>
                <div className="w-8 h-8 text-white font-bold transform -rotate-45">X</div>
              </div>
            </div>
          </div>

          {/* Metaphase (2) */}
          <div className={`absolute inset-0 transition-opacity duration-1000 flex items-center justify-center ${phase === 2 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <div className="w-64 h-64 border-4 border-emerald-500 rounded-full bg-emerald-900/20 flex items-center justify-center relative">
              {/* Spindle poles */}
              <div className="absolute top-4 w-4 h-4 bg-yellow-500 rounded-full" />
              <div className="absolute bottom-4 w-4 h-4 bg-yellow-500 rounded-full" />
              {/* Spindle fibers */}
              <div className="absolute h-full w-px bg-white/20 left-[45%]" />
              <div className="absolute h-full w-px bg-white/20 left-[55%]" />
              
              {/* Chromosomes at equator */}
              <div className="flex gap-4">
                <div className="text-white font-bold">X</div>
                <div className="text-white font-bold">X</div>
                <div className="text-white font-bold">X</div>
              </div>
            </div>
          </div>

          {/* Anaphase (3) */}
          <div className={`absolute inset-0 transition-opacity duration-1000 flex items-center justify-center ${phase === 3 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <div className="w-64 h-72 border-4 border-emerald-500 rounded-[40%] bg-emerald-900/20 flex flex-col items-center justify-between py-12 relative">
              <div className="flex gap-4 mb-8">
                <div className="text-white font-bold">^</div>
                <div className="text-white font-bold">^</div>
                <div className="text-white font-bold">^</div>
              </div>
              <div className="flex gap-4 mt-8">
                <div className="text-white font-bold transform rotate-180">^</div>
                <div className="text-white font-bold transform rotate-180">^</div>
                <div className="text-white font-bold transform rotate-180">^</div>
              </div>
            </div>
          </div>

          {/* Telophase (4) */}
          <div className={`absolute inset-0 transition-opacity duration-1000 flex items-center justify-center ${phase === 4 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <div className="flex items-center">
              <div className="w-48 h-48 border-4 border-emerald-500 rounded-full bg-emerald-900/20 flex items-center justify-center -mr-4 z-10">
                <div className="w-20 h-20 bg-indigo-500/50 rounded-full border border-indigo-300 flex items-center justify-center text-sm text-indigo-200">DNA</div>
              </div>
              <div className="w-48 h-48 border-4 border-emerald-500 rounded-full bg-emerald-900/20 flex items-center justify-center -ml-4 z-0">
                <div className="w-20 h-20 bg-indigo-500/50 rounded-full border border-indigo-300 flex items-center justify-center text-sm text-indigo-200">DNA</div>
              </div>
            </div>
          </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Pembelahan Sel (Mitosis)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto flex flex-col">
          
          <div className="flex-1 space-y-6 relative">
            
            {/* Timeline connection line */}
            <div className="absolute left-[15px] top-4 bottom-8 w-px bg-white/10 z-0" />

            {phases.map((ph, i) => (
              <div key={i} className={`relative z-10 flex gap-4 transition-opacity duration-300 ${i === phase ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mt-1 transition-colors ${i === phase ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-zinc-800 text-zinc-500 border border-white/10'}`}>
                  {i+1}
                </div>
                <div>
                  <h4 className={`font-bold ${i === phase ? 'text-emerald-400' : 'text-white'}`}>{ph.name}</h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{ph.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 mt-auto flex gap-2">
            <button onClick={reset} className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors">
              <RotateCcw className="w-5 h-5 text-white" />
            </button>
            <button 
              onClick={nextPhase} 
              disabled={phase === 4}
              className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${phase === 4 ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
            >
              Fase Selanjutnya <ArrowRight className="w-4 h-4"/>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
