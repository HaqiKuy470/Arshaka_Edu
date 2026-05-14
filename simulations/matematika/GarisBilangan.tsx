"use client";

import { useState } from "react";

export default function GarisBilangan() {
  const [startNum, setStartNum] = useState(0);
  const [stepNum, setStepNum] = useState(3);

  const result = startNum + stepNum;

  // Garis bilangan range: -10 to 10
  const min = -10;
  const max = 10;

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-4">
        
        {/* Math Display */}
        <div className="text-3xl md:text-5xl font-mono font-bold text-white mb-16 flex items-center gap-4">
          <div className={startNum < 0 ? "text-rose-400" : "text-blue-400"}>
            {startNum < 0 ? `(${startNum})` : startNum}
          </div>
          <div className="text-zinc-500">{stepNum >= 0 ? "+" : "-"}</div>
          <div className={stepNum < 0 ? "text-rose-400" : "text-emerald-400"}>
            {Math.abs(stepNum)}
          </div>
          <div className="text-zinc-500">=</div>
          <div className={`px-4 py-2 rounded-xl ${result < 0 ? 'bg-rose-500/20 text-rose-400' : result > 0 ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-800 text-white'}`}>
            {result}
          </div>
        </div>

        {/* Number Line Visual */}
        <div className="w-full max-w-4xl relative pt-10 pb-20 px-8 bg-black/30 rounded-2xl border border-white/10">
          
          {/* Arrow / Frog jumps */}
          <div className="absolute top-4 left-8 right-8 h-20">
            {stepNum !== 0 && (
              <svg className="w-full h-full overflow-visible">
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill={stepNum > 0 ? "#10b981" : "#f43f5e"} />
                  </marker>
                </defs>
                <path 
                  d={`M ${((startNum - min)/(max - min)) * 100}% 60 
                      Q ${(((startNum + result)/2 - min)/(max - min)) * 100}% 0 
                      ${((result - min)/(max - min)) * 100}% 60`} 
                  fill="none" 
                  stroke={stepNum > 0 ? "#10b981" : "#f43f5e"} 
                  strokeWidth="4" 
                  strokeDasharray="5,5"
                  markerEnd="url(#arrowhead)" 
                />
              </svg>
            )}
          </div>

          {/* The Line */}
          <div className="h-1 bg-white/30 w-full relative">
            {/* Ticks */}
            {Array.from({ length: max - min + 1 }).map((_, i) => {
              const val = min + i;
              const isZero = val === 0;
              const isStart = val === startNum;
              const isResult = val === result;

              return (
                <div 
                  key={i} 
                  className="absolute top-0 flex flex-col items-center"
                  style={{ left: `${(i / (max - min)) * 100}%`, transform: 'translateX(-50%)' }}
                >
                  <div className={`w-0.5 ${isZero ? 'h-6 bg-yellow-400 -mt-2.5' : 'h-3 bg-white/50'}`} />
                  <div className={`mt-2 font-mono text-sm sm:text-base font-bold
                    ${isZero ? 'text-yellow-400' : val < 0 ? 'text-rose-400/80' : 'text-blue-400/80'}
                    ${isStart ? 'bg-blue-500/30 ring-2 ring-blue-500 rounded px-1' : ''}
                    ${isResult ? 'bg-emerald-500/30 ring-2 ring-emerald-500 rounded px-1 scale-125' : ''}
                  `}>
                    {val}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Garis Bilangan (Bulat & Negatif)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-blue-400">Posisi Awal</label>
                <span className="font-mono text-blue-400">{startNum}</span>
              </div>
              <input type="range" className="w-full accent-blue-500" min="-10" max="10" step="1" value={startNum} onChange={(e) => setStartNum(parseInt(e.target.value))} />
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-emerald-400">Langkah (Tambah/Kurang)</label>
                <span className="font-mono text-emerald-400">{stepNum > 0 ? `+${stepNum}` : stepNum}</span>
              </div>
              <input type="range" className="w-full accent-emerald-500" min="-10" max="10" step="1" value={stepNum} onChange={(e) => setStepNum(parseInt(e.target.value))} />
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-2 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Aturan Garis Bilangan:</strong></p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Maju ke Kanan $\rightarrow$ Menambah (Positif)</li>
              <li>Mundur ke Kiri $\leftarrow$ Mengurang (Negatif)</li>
            </ul>
            <p className="mt-2 text-rose-400 font-bold bg-rose-500/10 p-2 rounded border border-rose-500/20">
              Perhatian: Jika Posisi Awal Negatif (-3) dan Langkah Positif (+5), maka kita melangkah ke kanan melewati angka Nol! Hasilnya = 2.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
