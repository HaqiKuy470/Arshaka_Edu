"use client";

import { useState } from "react";

export default function BarisanDeret() {
  const [type, setType] = useState<"ar"|"geo">("ar");
  
  const [a, setA] = useState(2); // Suku pertama
  const [r, setR] = useState(3); // Beda (b) atau Rasio (r)
  const [n, setN] = useState(5); // Jumlah suku ditampil

  const seq = [];
  let sum = 0;

  for(let i=0; i<n; i++) {
    const val = type === "ar" ? a + i*r : a * Math.pow(r, i);
    seq.push(val);
    sum += val;
  }

  // Max value for visual scaling
  const maxVal = Math.max(...seq, 1);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center p-8 overflow-y-auto bg-zinc-950">
        
        {/* Math Display */}
        <div className="text-3xl lg:text-4xl font-mono text-white mb-12 flex flex-col items-center border-b border-white/10 pb-8 w-full max-w-4xl">
          <div className="text-amber-400 font-bold mb-2">
            S_{n} = {sum}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center text-xl text-zinc-300">
            {seq.map((v, i) => (
              <div key={i} className="flex items-center">
                <span>{v}</span>
                {i < seq.length - 1 && <span className="text-zinc-600 ml-4">+</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="w-full max-w-4xl h-64 border-b-2 border-l-2 border-white/20 flex items-end gap-2 px-2 pb-0 pt-8">
          {seq.map((v, i) => {
            const hPct = (v / maxVal) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center justify-end relative group h-full">
                {/* Tooltip */}
                <div className="absolute -top-10 bg-black/80 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 z-20 font-mono">
                  U_{i+1} = {v}
                </div>
                
                {/* The Bar */}
                <div 
                  className={`w-full max-w-[60px] rounded-t transition-all duration-500 shadow-lg ${type === 'ar' ? 'bg-blue-500 hover:bg-blue-400' : 'bg-rose-500 hover:bg-rose-400'}`}
                  style={{ height: `${Math.max(1, hPct)}%` }}
                >
                  <div className="w-full h-full bg-gradient-to-b from-white/20 to-transparent rounded-t"/>
                </div>
                
                <div className="mt-2 text-xs font-bold text-zinc-500">U_{i+1}</div>
              </div>
            );
          })}
        </div>
        
        {/* Connection Arcs (visualize the jump) */}
        <div className="w-full max-w-4xl flex gap-2 px-2 mt-4 opacity-50">
           {seq.slice(0, -1).map((_, i) => (
              <div key={i} className="flex-1 text-center font-mono text-xs">
                {type === "ar" ? (r >= 0 ? `+${r}` : r) : `×${r}`}
              </div>
           ))}
           <div className="flex-1"></div>
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Barisan & Deret</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="flex gap-2 p-1 bg-zinc-900 rounded-xl border border-white/10">
            <button onClick={() => setType("ar")} className={`flex-1 py-2 rounded-lg text-sm font-bold ${type === "ar" ? "bg-blue-500 text-white" : "text-zinc-500 hover:text-zinc-300"}`}>Aritmatika</button>
            <button onClick={() => setType("geo")} className={`flex-1 py-2 rounded-lg text-sm font-bold ${type === "geo" ? "bg-rose-500 text-white" : "text-zinc-500 hover:text-zinc-300"}`}>Geometri</button>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-emerald-400">Suku Pertama (a)</label>
                <span className="font-mono text-emerald-400">{a}</span>
              </div>
              <input type="range" className="w-full accent-emerald-500" min="1" max="10" step="1" value={a} onChange={(e) => setA(parseInt(e.target.value))} />
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-amber-400">{type === "ar" ? "Beda (b)" : "Rasio (r)"}</label>
                <span className="font-mono text-amber-400">{r}</span>
              </div>
              <input type="range" className="w-full accent-amber-500" min={type === 'geo' ? 1 : -5} max={type === 'geo' ? 5 : 10} step="1" value={r} onChange={(e) => setR(parseInt(e.target.value))} />
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-zinc-300">Jumlah Suku (n)</label>
                <span className="font-mono text-zinc-300">{n}</span>
              </div>
              <input type="range" className="w-full accent-zinc-500" min="3" max="15" step="1" value={n} onChange={(e) => setN(parseInt(e.target.value))} />
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            {type === "ar" ? (
              <>
                <p><strong className="text-blue-400">Barisan Aritmatika:</strong> Setiap suku didapat dengan <strong className="text-white">menambahkan</strong> beda (b) yang konstan dari suku sebelumnya.</p>
                <p className="font-mono">Un = a + (n-1)b</p>
                <p>Grafiknya membentuk garis lurus (Linear).</p>
              </>
            ) : (
              <>
                <p><strong className="text-rose-400">Barisan Geometri:</strong> Setiap suku didapat dengan <strong className="text-white">mengalikan</strong> rasio (r) yang konstan dari suku sebelumnya.</p>
                <p className="font-mono">Un = a × r^(n-1)</p>
                <p>Grafiknya melengkung tajam ke atas (Eksponensial).</p>
              </>
            )}
            <hr className="border-white/10 my-2" />
            <p><strong>Deret (Sn):</strong> Adalah hasil penjumlahan seluruh suku dalam barisan tersebut.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
