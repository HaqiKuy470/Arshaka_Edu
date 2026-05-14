"use client";

import { useState } from "react";

export default function RespirasiSeluler() {
  const [stage, setStage] = useState(0);

  const stages = [
    {
      id: 0,
      name: "Glikolisis",
      location: "Sitoplasma",
      input: "1 Glukosa (6C)",
      output: "2 Asam Piruvat (3C), 2 ATP, 2 NADH",
      desc: "Pemecahan awal gula. Tidak membutuhkan oksigen (Anaerob). Glukosa dipecah menjadi dua molekul Asam Piruvat.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 1,
      name: "Dekarboksilasi Oksidatif",
      location: "Matriks Mitokondria",
      input: "2 Asam Piruvat",
      output: "2 Asetil Ko-A, 2 CO₂, 2 NADH",
      desc: "Piruvat masuk ke mitokondria dan diubah menjadi Asetil Ko-A sambil melepaskan gas Karbon Dioksida.",
      color: "from-amber-500 to-orange-500"
    },
    {
      id: 2,
      name: "Siklus Krebs",
      location: "Matriks Mitokondria",
      input: "2 Asetil Ko-A",
      output: "4 CO₂, 6 NADH, 2 FADH₂, 2 ATP",
      desc: "Siklus asam sitrat yang menghasilkan banyak pembawa elektron (NADH & FADH2) untuk tahap akhir.",
      color: "from-emerald-500 to-teal-500"
    },
    {
      id: 3,
      name: "Rantai Transpor Elektron",
      location: "Krista Mitokondria (Membran Dalam)",
      input: "NADH, FADH₂, O₂",
      output: "~34 ATP, H₂O",
      desc: "Elektron dialirkan antar protein membran untuk memompa proton. Oksigen bertindak sebagai penangkap elektron terakhir dan membentuk air. Menghasilkan ATP terbanyak!",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const current = stages[stage];

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        {/* Visual Map */}
        <div className="w-full max-w-4xl h-96 relative border-2 border-white/10 rounded-3xl overflow-hidden bg-black/40">
          
          {/* Cell Background */}
          <div className="absolute inset-0 bg-blue-900/20" /> {/* Cytoplasm */}
          
          {/* Mitochondrion Shape */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-orange-900/40 rounded-[100px] border-4 border-orange-500/50 flex items-center justify-center">
            {/* Inner Membrane (Cristae) abstraction */}
            <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M 10 50 Q 20 20 30 50 T 50 50 T 70 50 T 90 50" fill="none" stroke="#f97316" strokeWidth="2" />
              <path d="M 10 50 Q 20 80 30 50 T 50 50 T 70 50 T 90 50" fill="none" stroke="#f97316" strokeWidth="2" />
            </svg>
            <div className="text-orange-500/50 font-bold uppercase tracking-widest absolute bottom-4">Mitokondria</div>
          </div>
          <div className="absolute top-4 left-4 text-blue-400/50 font-bold uppercase tracking-widest">Sitoplasma</div>

          {/* Node 0: Glycolysis */}
          <div className={`absolute top-[20%] left-[10%] w-32 h-32 rounded-full flex items-center justify-center font-bold text-center p-2 cursor-pointer transition-all duration-500 border-4 ${stage === 0 ? 'bg-blue-500 border-white scale-110 shadow-[0_0_30px_rgba(59,130,246,0.6)] z-10' : 'bg-blue-900/50 border-blue-500/50 text-blue-300 hover:bg-blue-800'}`} onClick={()=>setStage(0)}>
            1. Glikolisis
          </div>

          {/* Arrow 0->1 */}
          <div className="absolute top-[30%] left-[calc(10%+8rem)] w-16 h-1 bg-white/20">
            <div className={`h-full bg-white transition-all duration-1000 ${stage >= 1 ? 'w-full' : 'w-0'}`} />
          </div>

          {/* Node 1: Dekarboksilasi */}
          <div className={`absolute top-[20%] left-[calc(10%+12rem)] w-32 h-32 rounded-full flex items-center justify-center font-bold text-center p-2 cursor-pointer transition-all duration-500 border-4 ${stage === 1 ? 'bg-amber-500 border-white scale-110 shadow-[0_0_30px_rgba(245,158,11,0.6)] z-10' : 'bg-amber-900/50 border-amber-500/50 text-amber-300 hover:bg-amber-800'}`} onClick={()=>setStage(1)}>
            2. Dekarboksilasi Oksidatif
          </div>

          {/* Arrow 1->2 */}
          <div className="absolute top-[30%] left-[calc(10%+20rem)] w-16 h-1 bg-white/20">
            <div className={`h-full bg-white transition-all duration-1000 ${stage >= 2 ? 'w-full' : 'w-0'}`} />
          </div>

          {/* Node 2: Krebs */}
          <div className={`absolute top-[20%] left-[calc(10%+24rem)] w-32 h-32 rounded-full flex items-center justify-center font-bold text-center p-2 cursor-pointer transition-all duration-500 border-4 ${stage === 2 ? 'bg-emerald-500 border-white scale-110 shadow-[0_0_30px_rgba(16,185,129,0.6)] z-10' : 'bg-emerald-900/50 border-emerald-500/50 text-emerald-300 hover:bg-emerald-800'}`} onClick={()=>setStage(2)}>
            3. Siklus Krebs
          </div>

          {/* Arrow 2->3 */}
          <div className="absolute top-[45%] left-[calc(10%+28rem)] w-1 h-16 bg-white/20">
            <div className={`w-full bg-white transition-all duration-1000 ${stage >= 3 ? 'h-full' : 'h-0'}`} />
          </div>

          {/* Node 3: ETC */}
          <div className={`absolute top-[60%] left-[calc(10%+24rem)] w-32 h-32 rounded-full flex items-center justify-center font-bold text-center p-2 cursor-pointer transition-all duration-500 border-4 ${stage === 3 ? 'bg-purple-500 border-white scale-110 shadow-[0_0_30px_rgba(168,85,247,0.6)] z-10' : 'bg-purple-900/50 border-purple-500/50 text-purple-300 hover:bg-purple-800'}`} onClick={()=>setStage(3)}>
            4. Transpor Elektron
          </div>

          {/* Floating Energy particles */}
          {stage === 3 && (
             <div className="absolute top-[60%] left-[calc(10%+16rem)] flex flex-col gap-2 animate-bounce">
                <div className="bg-yellow-400 text-black font-bold px-2 py-1 rounded text-xs">⚡ 34 ATP</div>
                <div className="bg-blue-400 text-white font-bold px-2 py-1 rounded text-xs">💧 H₂O</div>
             </div>
          )}

        </div>

        {/* Formula Summary */}
        <div className="mt-12 text-xl md:text-2xl font-mono text-white p-4 border border-white/10 bg-white/5 rounded-xl text-center">
          <div className="text-sm text-zinc-400 mb-2 font-sans uppercase tracking-widest font-bold">Reaksi Keseluruhan</div>
          <span className="text-blue-400">C₆H₁₂O₆</span> + <span className="text-sky-400">6O₂</span> → <span className="text-zinc-400">6CO₂</span> + <span className="text-blue-500">6H₂O</span> + <span className="text-yellow-400">⚡ 38 ATP</span>
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Respirasi Seluler</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-2">
            {stages.map((s, i) => (
              <button 
                key={s.id}
                onClick={() => setStage(i)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${stage === i ? `bg-gradient-to-r ${s.color} text-white font-bold border-white/50 shadow-lg` : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
              >
                {i + 1}. {s.name}
              </button>
            ))}
          </div>

          <div className={`p-5 rounded-2xl bg-gradient-to-br ${current.color} text-white shadow-xl mt-4`}>
            <div className="text-sm font-bold opacity-80 uppercase tracking-wider mb-4">{current.name}</div>
            
            <div className="space-y-3 text-sm">
              <div className="bg-black/20 p-2 rounded">
                <span className="block text-[10px] uppercase font-bold opacity-70">Lokasi</span>
                {current.location}
              </div>
              <div className="bg-black/20 p-2 rounded">
                <span className="block text-[10px] uppercase font-bold opacity-70">Bahan Masuk</span>
                {current.input}
              </div>
              <div className="bg-black/20 p-2 rounded">
                <span className="block text-[10px] uppercase font-bold opacity-70">Hasil Utama</span>
                <span className="font-bold text-yellow-300">{current.output}</span>
              </div>
            </div>
            
            <p className="text-xs leading-relaxed mt-4 bg-black/20 p-3 rounded-lg border border-white/10 italic">
              "{current.desc}"
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
