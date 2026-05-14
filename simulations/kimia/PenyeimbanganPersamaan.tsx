"use client";

import { useState } from "react";
import { RefreshCw, CheckCircle2 } from "lucide-react";

export default function PenyeimbanganPersamaan() {
  const [n2, setN2] = useState(1);
  const [h2, setH2] = useState(1);
  const [nh3, setNh3] = useState(1);

  const leftN = n2 * 2;
  const leftH = h2 * 2;
  const rightN = nh3 * 1;
  const rightH = nh3 * 3;

  const isBalanced = leftN === rightN && leftH === rightH;

  const reset = () => {
    setN2(1); setH2(1); setNh3(1);
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] p-8">
        
        {/* Success Banner */}
        {isBalanced && (
          <div className="absolute top-8 bg-green-500/20 text-green-400 border border-green-500/50 px-6 py-3 rounded-full flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold">Persamaan Setara!</span>
          </div>
        )}

        <div className="flex items-center justify-center gap-6 text-4xl font-mono mb-16">
          <div className="flex items-center gap-2">
            <input type="number" min="0" max="9" value={n2} onChange={(e) => setN2(parseInt(e.target.value) || 0)} className="w-16 h-16 text-center bg-zinc-900 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <span>N<sub className="text-xl">2</sub></span>
          </div>
          <span className="text-zinc-500">+</span>
          <div className="flex items-center gap-2">
            <input type="number" min="0" max="9" value={h2} onChange={(e) => setH2(parseInt(e.target.value) || 0)} className="w-16 h-16 text-center bg-zinc-900 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <span>H<sub className="text-xl">2</sub></span>
          </div>
          <span className="text-zinc-500 text-5xl mx-4">→</span>
          <div className="flex items-center gap-2">
            <input type="number" min="0" max="9" value={nh3} onChange={(e) => setNh3(parseInt(e.target.value) || 0)} className="w-16 h-16 text-center bg-zinc-900 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <span>NH<sub className="text-xl">3</sub></span>
          </div>
        </div>

        <div className="flex gap-16">
          {/* Nitrogen Balance */}
          <div className="flex flex-col items-center">
            <div className="text-indigo-400 font-bold mb-4 text-xl">Nitrogen (N)</div>
            <div className="flex items-end gap-12 h-32 border-b-4 border-zinc-600 px-8 relative">
              <div className="w-12 bg-indigo-500/50 rounded-t-md transition-all duration-300 flex items-end justify-center pb-2 font-bold" style={{ height: `${Math.min(100, leftN * 15)}%` }}>{leftN}</div>
              <div className="w-12 bg-indigo-500/50 rounded-t-md transition-all duration-300 flex items-end justify-center pb-2 font-bold" style={{ height: `${Math.min(100, rightN * 15)}%` }}>{rightN}</div>
              <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 ${leftN === rightN ? 'bg-green-500' : 'bg-zinc-600'}`}></div>
            </div>
            <div className="flex justify-between w-full mt-2 text-zinc-400 text-sm">
              <span>Reaktan</span><span>Produk</span>
            </div>
          </div>

          {/* Hydrogen Balance */}
          <div className="flex flex-col items-center">
            <div className="text-pink-400 font-bold mb-4 text-xl">Hidrogen (H)</div>
            <div className="flex items-end gap-12 h-32 border-b-4 border-zinc-600 px-8 relative">
              <div className="w-12 bg-pink-500/50 rounded-t-md transition-all duration-300 flex items-end justify-center pb-2 font-bold" style={{ height: `${Math.min(100, leftH * 15)}%` }}>{leftH}</div>
              <div className="w-12 bg-pink-500/50 rounded-t-md transition-all duration-300 flex items-end justify-center pb-2 font-bold" style={{ height: `${Math.min(100, rightH * 15)}%` }}>{rightH}</div>
              <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 ${leftH === rightH ? 'bg-green-500' : 'bg-zinc-600'}`}></div>
            </div>
            <div className="flex justify-between w-full mt-2 text-zinc-400 text-sm">
              <span>Reaktan</span><span>Produk</span>
            </div>
          </div>
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Panduan</h3></div>
        <div className="p-4 flex-1 overflow-y-auto space-y-4 text-zinc-300 text-sm">
          <p>Ubah angka koefisien di depan setiap molekul untuk menyetarakan jumlah atom di sisi Reaktan (kiri) dan Produk (kanan).</p>
          <p>Dalam reaksi pembentukan Amonia ini, atom Nitrogen (N) dan Hidrogen (H) harus setimbang.</p>
        </div>
        <div className="p-4 border-t border-white/10 bg-black/20">
          <button onClick={reset} className="w-full py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4" /> Ulangi</button>
        </div>
      </div>
    </div>
  );
}
