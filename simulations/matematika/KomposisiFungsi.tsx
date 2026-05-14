"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function KomposisiFungsi() {
  const [xVal, setXVal] = useState(2);
  
  // f(x) = 2x + 3
  const [f_a, setF_a] = useState(2);
  const [f_b, setF_b] = useState(3);
  
  // g(x) = x^2
  const [g_pow, setG_pow] = useState(2);

  // Math logic
  const fx = f_a * xVal + f_b;
  const gfx = Math.pow(fx, g_pow); // g(f(x))

  const gx = Math.pow(xVal, g_pow);
  const fgx = f_a * gx + f_b; // f(g(x))

  const [mode, setMode] = useState<"gof"|"fog">("gof"); // g o f or f o g

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <div className="text-3xl font-mono text-white mb-12 flex gap-8 border-b border-white/10 pb-8 w-full justify-center">
          <div className="text-blue-400">f(x) = {f_a}x + {f_b}</div>
          <div className="text-rose-400">g(x) = x<sup>{g_pow}</sup></div>
        </div>

        {/* Machine visualization */}
        <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-4xl">
          
          {/* Input */}
          <div className="flex flex-col items-center">
            <div className="text-zinc-500 mb-2 font-bold uppercase text-sm">Input (x)</div>
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center text-2xl font-bold font-mono shadow-[0_0_20px_rgba(16,185,129,0.5)]">
              {xVal}
            </div>
          </div>

          <ArrowRight className="w-8 h-8 text-zinc-600" />

          {/* Machine 1 */}
          <div className="glass-card rounded-2xl p-6 flex flex-col items-center relative overflow-hidden border-2 border-blue-500/50 w-48">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/50" />
            <div className="text-blue-400 font-bold mb-4">Mesin {mode === 'gof' ? 'f(x)' : 'g(x)'}</div>
            {mode === 'gof' ? (
              <div className="font-mono text-xl">{f_a}(<span className="text-emerald-400">{xVal}</span>) + {f_b}</div>
            ) : (
              <div className="font-mono text-xl"><span className="text-emerald-400">{xVal}</span><sup>{g_pow}</sup></div>
            )}
          </div>

          <ArrowRight className="w-8 h-8 text-zinc-600" />

          {/* Intermediate */}
          <div className="flex flex-col items-center">
            <div className="text-zinc-500 mb-2 font-bold uppercase text-xs">Hasil 1</div>
            <div className="w-16 h-16 rounded-xl bg-purple-500 text-white flex items-center justify-center text-2xl font-bold font-mono shadow-[0_0_20px_rgba(168,85,247,0.5)]">
              {mode === 'gof' ? fx : gx}
            </div>
          </div>

          <ArrowRight className="w-8 h-8 text-zinc-600" />

          {/* Machine 2 */}
          <div className="glass-card rounded-2xl p-6 flex flex-col items-center relative overflow-hidden border-2 border-rose-500/50 w-48">
            <div className="absolute top-0 left-0 w-full h-1 bg-rose-500/50" />
            <div className="text-rose-400 font-bold mb-4">Mesin {mode === 'gof' ? 'g(x)' : 'f(x)'}</div>
            {mode === 'gof' ? (
              <div className="font-mono text-xl"><span className="text-purple-400">{fx}</span><sup>{g_pow}</sup></div>
            ) : (
              <div className="font-mono text-xl">{f_a}(<span className="text-purple-400">{gx}</span>) + {f_b}</div>
            )}
          </div>

          <ArrowRight className="w-8 h-8 text-zinc-600" />

          {/* Output */}
          <div className="flex flex-col items-center">
            <div className="text-amber-500 mb-2 font-bold uppercase text-sm">Output Final</div>
            <div className="w-20 h-20 rounded-full bg-amber-500 text-white flex items-center justify-center text-3xl font-bold font-mono shadow-[0_0_30px_rgba(245,158,11,0.6)] border-4 border-amber-300">
              {mode === 'gof' ? gfx : fgx}
            </div>
          </div>

        </div>

        <div className="mt-16 text-2xl font-mono text-white p-4 border border-white/10 bg-white/5 rounded-xl">
          {mode === 'gof' ? `(g ∘ f)(${xVal}) = g(f(${xVal})) = ${gfx}` : `(f ∘ g)(${xVal}) = f(g(${xVal})) = ${fgx}`}
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Komposisi Fungsi</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="flex gap-2 p-1 bg-zinc-900 rounded-xl border border-white/10">
            <button onClick={() => setMode("gof")} className={`flex-1 py-3 rounded-lg text-sm font-bold font-mono ${mode === "gof" ? "bg-amber-500 text-white" : "text-zinc-500 hover:text-zinc-300"}`}>
              g ∘ f
            </button>
            <button onClick={() => setMode("fog")} className={`flex-1 py-3 rounded-lg text-sm font-bold font-mono ${mode === "fog" ? "bg-amber-500 text-white" : "text-zinc-500 hover:text-zinc-300"}`}>
              f ∘ g
            </button>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-emerald-400">Input Awal (x)</label>
                <span className="font-mono text-emerald-400">{xVal}</span>
              </div>
              <input type="range" className="w-full accent-emerald-500" min="-10" max="10" step="1" value={xVal} onChange={(e) => setXVal(parseInt(e.target.value))} />
            </div>

            <div className="space-y-2 pt-4 border-t border-white/10">
              <label className="text-sm font-bold text-blue-400">Mesin f(x) = ax + b</label>
              <div className="flex gap-2">
                <input type="number" placeholder="a" className="w-full bg-zinc-800 rounded p-2 text-white font-mono text-center" value={f_a} onChange={(e)=>setF_a(Number(e.target.value))} />
                <input type="number" placeholder="b" className="w-full bg-zinc-800 rounded p-2 text-white font-mono text-center" value={f_b} onChange={(e)=>setF_b(Number(e.target.value))} />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-sm font-bold text-rose-400">Mesin g(x) = xⁿ</label>
              <input type="number" className="w-full bg-zinc-800 rounded p-2 text-white font-mono text-center" value={g_pow} onChange={(e)=>setG_pow(Number(e.target.value))} />
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-2 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Fungsi Komposisi</strong> ibarat merangkai dua mesin pabrik menjadi satu jalur produksi.</p>
            <p>Bahan mentah <span className="text-emerald-400">(x)</span> masuk ke mesin pertama, hasilnya masuk ke mesin kedua untuk menjadi produk akhir.</p>
            <p className="mt-2 text-rose-400">Perhatikan bahwa urutan mesin sangat menentukan hasil akhir! <span className="font-mono">(g ∘ f) ≠ (f ∘ g)</span>.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
