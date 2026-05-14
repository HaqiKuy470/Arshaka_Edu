"use client";

import { useState } from "react";

export default function PecahanDesimal() {
  const [numerator, setNumerator] = useState(3);
  const [denominator, setDenominator] = useState(4);
  const [shape, setShape] = useState<"circle"|"rect">("circle");

  // Prevent divide by zero
  const safeDenom = Math.max(1, denominator);
  const decimalValue = numerator / safeDenom;
  const percentage = decimalValue * 100;

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        {/* Math Display */}
        <div className="flex items-center gap-8 mb-12">
          {/* Fraction */}
          <div className="flex flex-col items-center text-4xl font-mono font-bold">
            <div className="text-blue-400 pb-2 px-4 border-b-4 border-white">{numerator}</div>
            <div className="text-rose-400 pt-2 px-4">{safeDenom}</div>
          </div>
          
          <div className="text-zinc-500 text-4xl font-bold">=</div>
          
          {/* Decimal */}
          <div className="text-4xl font-mono font-bold text-emerald-400">
            {decimalValue.toFixed(3).replace(/\.?0+$/, '')}
          </div>

          <div className="text-zinc-500 text-4xl font-bold">=</div>

          {/* Percentage */}
          <div className="text-4xl font-mono font-bold text-amber-400">
            {percentage.toFixed(1).replace(/\.0$/, '')}%
          </div>
        </div>

        {/* Visual Shapes */}
        <div className="glass-card rounded-2xl p-8 flex items-center justify-center min-w-[300px] min-h-[300px]">
          {shape === "circle" ? (
            <div className="relative w-64 h-64 rounded-full border-4 border-white/20 overflow-hidden bg-black/50">
              {/* Slices */}
              {Array.from({ length: safeDenom }).map((_, i) => {
                const angle = 360 / safeDenom;
                const isFilled = i < numerator;
                // We use conic gradient logic or SVG. SVG is cleaner.
                return null;
              })}
              
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {Array.from({ length: safeDenom }).map((_, i) => {
                  const sliceAngle = 360 / safeDenom;
                  const startAngle = i * sliceAngle;
                  const isFilled = i < (numerator % safeDenom) || numerator >= safeDenom; 
                  // If numerator > denom, we fill all, but ideally we show multiple circles. 
                  // For simplicity, let's cap visual at 1 whole, or just fill.
                  
                  // SVG arc math
                  const x1 = 50 + 50 * Math.cos(Math.PI * startAngle / 180);
                  const y1 = 50 + 50 * Math.sin(Math.PI * startAngle / 180);
                  const x2 = 50 + 50 * Math.cos(Math.PI * (startAngle + sliceAngle) / 180);
                  const y2 = 50 + 50 * Math.sin(Math.PI * (startAngle + sliceAngle) / 180);
                  const largeArc = sliceAngle > 180 ? 1 : 0;

                  // If denominator is 1, draw full circle
                  if (safeDenom === 1) {
                     return <circle key={i} cx="50" cy="50" r="50" fill={isFilled ? "#3b82f6" : "transparent"} />;
                  }

                  return (
                    <path 
                      key={i}
                      d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={isFilled ? "#3b82f6" : "transparent"}
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="1"
                    />
                  );
                })}
              </svg>

              {/* Multiple wholes indicator if improper fraction */}
              {numerator > safeDenom && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <span className="text-white font-bold text-2xl">+{Math.floor(numerator/safeDenom)} Utuh</span>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full max-w-md bg-black/50 border-2 border-white/20 flex flex-col h-64 relative">
              <div className="flex-1 flex w-full">
                {Array.from({ length: safeDenom }).map((_, i) => {
                  const isFilled = i < (numerator % safeDenom) || numerator >= safeDenom;
                  return (
                    <div 
                      key={i} 
                      className="flex-1 border-r border-white/20 last:border-0 transition-colors duration-300"
                      style={{ backgroundColor: isFilled ? '#3b82f6' : 'transparent' }}
                    />
                  );
                })}
              </div>
              {numerator > safeDenom && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 border-t border-white/20">
                  <span className="text-white font-bold text-2xl">+{Math.floor(numerator/safeDenom)} Utuh</span>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Pecahan & Desimal</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="flex gap-2 p-1 bg-zinc-900 rounded-xl border border-white/10">
            <button 
              onClick={() => setShape("circle")}
              className={`flex-1 py-2 rounded-lg text-sm font-bold ${shape === "circle" ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              Lingkaran (Pizza)
            </button>
            <button 
              onClick={() => setShape("rect")}
              className={`flex-1 py-2 rounded-lg text-sm font-bold ${shape === "rect" ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              Persegi Panjang
            </button>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-blue-400">Pembilang (Atas)</label>
                <span className="font-mono text-blue-400">{numerator}</span>
              </div>
              <input type="range" className="w-full accent-blue-500" min="0" max="20" step="1" value={numerator} onChange={(e) => setNumerator(parseInt(e.target.value))} />
              <p className="text-[10px] text-zinc-500">Jumlah potongan yang diambil.</p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-rose-400">Penyebut (Bawah)</label>
                <span className="font-mono text-rose-400">{safeDenom}</span>
              </div>
              <input type="range" className="w-full accent-rose-500" min="1" max="20" step="1" value={denominator} onChange={(e) => setDenominator(parseInt(e.target.value))} />
              <p className="text-[10px] text-zinc-500">Satu benda utuh dipotong menjadi berapa bagian rata.</p>
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-2 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Konsep Pecahan:</strong> Membagi satu kesatuan menjadi bagian-bagian yang sama besar.</p>
            <p>Jika Pembilang &gt; Penyebut, itu disebut <em>Pecahan Tidak Biasa</em> (Nilainya lebih dari 1).</p>
            <p>Pecahan, Desimal, dan Persentase adalah tiga cara berbeda untuk menuliskan nilai yang sama!</p>
          </div>

        </div>
      </div>
    </div>
  );
}
