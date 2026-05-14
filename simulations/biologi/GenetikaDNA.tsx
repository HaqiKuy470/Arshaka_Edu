"use client";

import { useState } from "react";

export default function GenetikaDNA() {
  const [p1, setP1] = useState<"AA" | "Aa" | "aa">("Aa");
  const [p2, setP2] = useState<"AA" | "Aa" | "aa">("Aa");

  // Determine traits
  const traitName = "Warna Bunga";
  const dominant = "Merah (A)";
  const recessive = "Putih (a)";

  // Punnett Square calculation
  const p1_alleles = p1.split('');
  const p2_alleles = p2.split('');
  
  const square = [
    [p1_alleles[0] + p2_alleles[0], p1_alleles[0] + p2_alleles[1]],
    [p1_alleles[1] + p2_alleles[0], p1_alleles[1] + p2_alleles[1]]
  ].map(row => row.map(g => {
    // Sort so dominant 'A' is always first (Aa instead of aA)
    return g.split('').sort((a, b) => a === 'A' ? -1 : 1).join('');
  }));

  // Calculate probabilities
  const flat = square.flat();
  const counts = { "AA": 0, "Aa": 0, "aa": 0 };
  flat.forEach(g => counts[g as keyof typeof counts]++);

  const domProb = ((counts["AA"] + counts["Aa"]) / 4) * 100;
  const recProb = (counts["aa"] / 4) * 100;

  const getPhenotypeColor = (genotype: string) => genotype.includes('A') ? 'bg-rose-500' : 'bg-slate-100 text-black';

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 p-6 min-h-[50vh] lg:min-h-0">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Hukum Mendel: Persilangan Monohibrid</h2>
          <p className="text-zinc-400">Sifat: {traitName}</p>
        </div>

        {/* Punnett Square Grid */}
        <div className="relative border-t-2 border-l-2 border-white/20 mt-8">
          
          {/* Top Headers (Parent 1) */}
          <div className="absolute -top-12 left-0 w-full flex text-2xl font-mono font-bold text-indigo-400">
            <div className="flex-1 text-center">{p1_alleles[0]}</div>
            <div className="flex-1 text-center">{p1_alleles[1]}</div>
          </div>
          <div className="absolute -top-16 w-full text-center text-xs text-zinc-500">Parent 1</div>

          {/* Left Headers (Parent 2) */}
          <div className="absolute -left-12 top-0 h-full flex flex-col text-2xl font-mono font-bold text-emerald-400">
            <div className="flex-1 flex items-center justify-center">{p2_alleles[0]}</div>
            <div className="flex-1 flex items-center justify-center">{p2_alleles[1]}</div>
          </div>
          <div className="absolute -left-20 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-zinc-500">Parent 2</div>

          {/* Grid Cells */}
          <div className="grid grid-cols-2 grid-rows-2 w-64 h-64 md:w-80 md:h-80 border-r-2 border-b-2 border-white/20">
            {square.flat().map((genotype, i) => (
              <div key={i} className="border-r-2 border-b-2 border-white/20 flex flex-col items-center justify-center relative group p-2">
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg flex items-center justify-center transition-transform group-hover:scale-110 ${getPhenotypeColor(genotype)}`}>
                  <span className="text-2xl font-mono font-bold">{genotype}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Genetika & Pewarisan Sifat</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-8">
          
          <div className="space-y-4">
            <label className="text-sm text-zinc-300 font-semibold">Genotipe Parent 1</label>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => setP1("AA")} className={`py-2 rounded border transition-colors ${p1 === "AA" ? "bg-indigo-600 border-indigo-400 text-white" : "bg-black/20 border-white/10 text-zinc-400"}`}>AA</button>
              <button onClick={() => setP1("Aa")} className={`py-2 rounded border transition-colors ${p1 === "Aa" ? "bg-indigo-600 border-indigo-400 text-white" : "bg-black/20 border-white/10 text-zinc-400"}`}>Aa</button>
              <button onClick={() => setP1("aa")} className={`py-2 rounded border transition-colors ${p1 === "aa" ? "bg-indigo-600 border-indigo-400 text-white" : "bg-black/20 border-white/10 text-zinc-400"}`}>aa</button>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm text-zinc-300 font-semibold">Genotipe Parent 2</label>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => setP2("AA")} className={`py-2 rounded border transition-colors ${p2 === "AA" ? "bg-emerald-600 border-emerald-400 text-white" : "bg-black/20 border-white/10 text-zinc-400"}`}>AA</button>
              <button onClick={() => setP2("Aa")} className={`py-2 rounded border transition-colors ${p2 === "Aa" ? "bg-emerald-600 border-emerald-400 text-white" : "bg-black/20 border-white/10 text-zinc-400"}`}>Aa</button>
              <button onClick={() => setP2("aa")} className={`py-2 rounded border transition-colors ${p2 === "aa" ? "bg-emerald-600 border-emerald-400 text-white" : "bg-black/20 border-white/10 text-zinc-400"}`}>aa</button>
            </div>
          </div>

          <div className="w-full h-px bg-white/10" />

          <div className="space-y-4">
            <h4 className="font-bold text-white mb-2">Probabilitas Fenotipe</h4>
            
            <div className="flex justify-between items-center bg-rose-500/10 border border-rose-500/30 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-rose-500" />
                <span className="text-rose-100">{dominant}</span>
              </div>
              <span className="font-mono text-xl font-bold text-rose-400">{domProb}%</span>
            </div>

            <div className="flex justify-between items-center bg-slate-100/10 border border-slate-100/30 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-slate-100 border border-zinc-400" />
                <span className="text-slate-200">{recessive}</span>
              </div>
              <span className="font-mono text-xl font-bold text-slate-300">{recProb}%</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
