"use client";

import { useState } from "react";

export default function FaktorKelipatan() {
  const [numA, setNumA] = useState(12);
  const [numB, setNumB] = useState(18);

  // Math logic
  const getFactors = (n: number) => {
    const f = [];
    for (let i = 1; i <= n; i++) if (n % i === 0) f.push(i);
    return f;
  };

  const factorsA = getFactors(numA);
  const factorsB = getFactors(numB);
  const commonFactors = factorsA.filter(x => factorsB.includes(x));
  const fpb = Math.max(...commonFactors);

  const getMultiples = (n: number, count: number) => {
    return Array.from({length: count}).map((_, i) => n * (i + 1));
  };

  const multiplesA = getMultiples(numA, 10);
  const multiplesB = getMultiples(numB, 10);
  const commonMultiples = multiplesA.filter(x => multiplesB.includes(x));
  const kpk = commonMultiples.length > 0 ? commonMultiples[0] : (numA * numB) / fpb; // calculate mathematically if not in list

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative overflow-y-auto bg-zinc-950 p-4 lg:p-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* FPB Section */}
          <div className="glass-card rounded-2xl p-6 border-t-4 border-rose-500">
            <h2 className="text-2xl font-bold text-rose-400 mb-6 flex items-center gap-2">
              <span className="bg-rose-500/20 px-2 py-1 rounded text-rose-300">FPB</span> Faktor Persekutuan Terbesar
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-zinc-400 mb-1">Faktor dari <strong className="text-white">{numA}</strong>:</div>
                <div className="flex flex-wrap gap-2">
                  {factorsA.map(f => (
                    <div key={f} className={`px-3 py-1 rounded font-mono ${f === fpb ? 'bg-rose-500 text-white ring-2 ring-white font-bold' : commonFactors.includes(f) ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50' : 'bg-zinc-800 text-zinc-400'}`}>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-zinc-400 mb-1">Faktor dari <strong className="text-white">{numB}</strong>:</div>
                <div className="flex flex-wrap gap-2">
                  {factorsB.map(f => (
                    <div key={f} className={`px-3 py-1 rounded font-mono ${f === fpb ? 'bg-rose-500 text-white ring-2 ring-white font-bold' : commonFactors.includes(f) ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50' : 'bg-zinc-800 text-zinc-400'}`}>
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 p-4 bg-black/40 rounded-xl border border-rose-500/20 text-center">
                <div className="text-zinc-400 text-sm">Faktor yang sama & paling besar:</div>
                <div className="text-4xl font-bold font-mono text-rose-400 mt-2">{fpb}</div>
              </div>
            </div>
          </div>

          {/* KPK Section */}
          <div className="glass-card rounded-2xl p-6 border-t-4 border-blue-500">
            <h2 className="text-2xl font-bold text-blue-400 mb-6 flex items-center gap-2">
              <span className="bg-blue-500/20 px-2 py-1 rounded text-blue-300">KPK</span> Kelipatan Persekutuan Terkecil
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-zinc-400 mb-1">Kelipatan <strong className="text-white">{numA}</strong>:</div>
                <div className="flex flex-wrap gap-2">
                  {multiplesA.map(m => (
                    <div key={m} className={`px-3 py-1 rounded font-mono ${m === kpk ? 'bg-blue-500 text-white ring-2 ring-white font-bold' : commonMultiples.includes(m) ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50' : 'bg-zinc-800 text-zinc-400'}`}>
                      {m}
                    </div>
                  ))}
                  <div className="text-zinc-600 px-2 py-1">...</div>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-zinc-400 mb-1">Kelipatan <strong className="text-white">{numB}</strong>:</div>
                <div className="flex flex-wrap gap-2">
                  {multiplesB.map(m => (
                    <div key={m} className={`px-3 py-1 rounded font-mono ${m === kpk ? 'bg-blue-500 text-white ring-2 ring-white font-bold' : commonMultiples.includes(m) ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50' : 'bg-zinc-800 text-zinc-400'}`}>
                      {m}
                    </div>
                  ))}
                  <div className="text-zinc-600 px-2 py-1">...</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-black/40 rounded-xl border border-blue-500/20 text-center">
                <div className="text-zinc-400 text-sm">Kelipatan yang sama & paling kecil:</div>
                <div className="text-4xl font-bold font-mono text-blue-400 mt-2">{kpk}</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Faktor & Kelipatan (FPB/KPK)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-amber-400">Angka Pertama (A)</label>
                <span className="font-mono text-amber-400">{numA}</span>
              </div>
              <input type="range" className="w-full accent-amber-500" min="2" max="36" step="1" value={numA} onChange={(e) => setNumA(parseInt(e.target.value))} />
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-emerald-400">Angka Kedua (B)</label>
                <span className="font-mono text-emerald-400">{numB}</span>
              </div>
              <input type="range" className="w-full accent-emerald-500" min="2" max="36" step="1" value={numB} onChange={(e) => setNumB(parseInt(e.target.value))} />
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong className="text-rose-400">Faktor:</strong> Angka-angka yang bisa membagi habis bilangan tersebut. <em>Contoh: Faktor 6 adalah 1, 2, 3, 6.</em></p>
            <p><strong className="text-blue-400">Kelipatan:</strong> Angka hasil perkalian bilangan tersebut dengan 1, 2, 3, dst. <em>Contoh: Kelipatan 6 adalah 6, 12, 18, 24...</em></p>
            <div className="bg-zinc-800/50 p-2 rounded border border-white/10 font-mono text-[10px] text-center text-zinc-400">
              Rumus: FPB × KPK = A × B
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
