"use client";

import { useState } from "react";
import { Play } from "lucide-react";

export default function PeluangDasar() {
  const [coins, setCoins] = useState(3);
  const [trials, setTrials] = useState(10);
  const [results, setResults] = useState<{heads: number, tails: number}[]>([]);
  const [distribution, setDistribution] = useState<number[]>([]);

  const tossCoins = () => {
    const newResults = [];
    const dist = new Array(coins + 1).fill(0);

    for (let i = 0; i < trials; i++) {
      let heads = 0;
      for (let c = 0; c < coins; c++) {
        if (Math.random() > 0.5) heads++;
      }
      newResults.push({ heads, tails: coins - heads });
      dist[heads]++;
    }

    setResults(newResults);
    setDistribution(dist);
  };

  // Theoretical Probabilities (Binomial Distribution)
  // P(X=k) = C(n,k) * p^k * (1-p)^(n-k)
  const getTheoretical = (k: number) => {
    let coeff = 1;
    for (let x = 1; x <= k; x++) {
      coeff = coeff * (coins - x + 1) / x;
    }
    return coeff * Math.pow(0.5, k) * Math.pow(0.5, coins - k);
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center p-8 overflow-y-auto bg-zinc-950">
        
        <div className="w-full max-w-4xl space-y-8">
          
          {/* Main Visual: Histogram */}
          <div className="glass-card rounded-2xl p-6 border-t-4 border-indigo-500">
            <h2 className="text-xl font-bold text-white mb-6">Distribusi Hasil Lemparan (Empiris vs Teoritis)</h2>
            
            <div className="flex items-end justify-between h-64 gap-2 border-b-2 border-l-2 border-white/20 pb-2 pl-2">
              {Array.from({length: coins + 1}).map((_, k) => {
                const empiricProb = distribution.length > 0 ? distribution[k] / trials : 0;
                const theoryProb = getTheoretical(k);
                
                // Max height mapping (say max is 100%)
                const maxH = 200; // pixels
                const empHeight = empiricProb * maxH;
                const theoryHeight = theoryProb * maxH;

                return (
                  <div key={k} className="flex-1 flex flex-col items-center justify-end relative group">
                    {/* Theoretical Line marker */}
                    <div 
                      className="absolute w-full border-t-2 border-dashed border-rose-500 z-10 transition-all"
                      style={{ bottom: `${theoryHeight}px` }}
                    />
                    
                    {/* Bar */}
                    <div 
                      className="w-full max-w-[40px] bg-indigo-500/80 rounded-t transition-all duration-500 hover:bg-indigo-400"
                      style={{ height: `${empHeight}px` }}
                    />
                    
                    {/* Tooltip */}
                    <div className="absolute -top-12 bg-black/80 px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 whitespace-nowrap z-20">
                      Empiris: {(empiricProb*100).toFixed(1)}%<br/>
                      Teoritis: {(theoryProb*100).toFixed(1)}%
                    </div>

                    <div className="mt-2 text-xs font-bold text-zinc-400">{k} Angka</div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-center gap-6 mt-4 text-xs font-bold">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-indigo-500 rounded-sm"/> Hasil Eksperimen (Empiris)</div>
              <div className="flex items-center gap-2"><div className="w-4 h-0 border-t-2 border-dashed border-rose-500"/> Peluang Teoritis (Binomial)</div>
            </div>
          </div>

          {/* Raw Data Log */}
          {results.length > 0 && (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Log Lemparan ({trials} kali)</h3>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {results.map((r, i) => (
                  <div key={i} className="bg-zinc-800/50 border border-white/5 rounded px-2 py-1 text-xs font-mono flex gap-1 items-center">
                    <span className="text-zinc-500">#{i+1}</span>
                    <span className="text-amber-400">{r.heads}A</span>
                    <span className="text-zinc-600">/</span>
                    <span className="text-sky-400">{r.tails}G</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Peluang & Distribusi Binomial</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-amber-400">Jumlah Koin</label>
                <span className="font-mono text-amber-400">{coins}</span>
              </div>
              <input type="range" className="w-full accent-amber-500" min="1" max="10" step="1" value={coins} onChange={(e) => {setCoins(parseInt(e.target.value)); setResults([]); setDistribution([]);}} />
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-emerald-400">Jumlah Lemparan</label>
                <span className="font-mono text-emerald-400">{trials}</span>
              </div>
              <select 
                className="w-full bg-zinc-800 text-white rounded p-2 text-sm border border-white/10 outline-none focus:border-emerald-500"
                value={trials} onChange={(e) => setTrials(parseInt(e.target.value))}
              >
                <option value={10}>10 Kali</option>
                <option value={50}>50 Kali</option>
                <option value={100}>100 Kali</option>
                <option value={500}>500 Kali</option>
                <option value={1000}>1000 Kali (Hukum Bil. Besar)</option>
              </select>
            </div>
          </div>

          <button onClick={tossCoins} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
            <Play className="w-4 h-4"/> Lempar Koin!
          </button>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Peluang Empiris:</strong> Hasil nyata yang terjadi saat eksperimen dilakukan.</p>
            <p><strong>Peluang Teoritis:</strong> Harapan matematis dari sebuah kejadian (Distribusi Binomial).</p>
            <p className="text-emerald-400 bg-emerald-500/10 p-2 rounded">
              <strong>Hukum Bilangan Besar:</strong> Semakin banyak eksperimen diulang (contoh: 1000x lemparan), maka Peluang Empiris akan semakin mendekati Peluang Teoritis (garis merah).
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
