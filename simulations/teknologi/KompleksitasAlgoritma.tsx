"use client";

import { useState } from "react";

export default function KompleksitasAlgoritma() {
  const [dataSize, setDataSize] = useState(10); // N

  const complexities = [
    { label: "O(1) - Konstan", color: "text-emerald-400", bg: "bg-emerald-500", fn: () => 1, desc: "Sangat Cepat! Waktu eksekusi tidak peduli berapa banyak datanya. Contoh: Mengambil elemen pertama dari Array." },
    { label: "O(log n) - Logaritmik", color: "text-blue-400", bg: "bg-blue-500", fn: (n: number) => Math.log2(n || 1), desc: "Sangat Efisien! Membelah data jadi dua tiap langkah. Contoh: Binary Search." },
    { label: "O(n) - Linear", color: "text-amber-400", bg: "bg-amber-500", fn: (n: number) => n, desc: "Biasa. Waktu naik sejajar dengan jumlah data. Contoh: Looping array dari awal sampai akhir (Linear Search)." },
    { label: "O(n log n) - Linearithmic", color: "text-orange-500", bg: "bg-orange-600", fn: (n: number) => n * Math.log2(n || 1), desc: "Lumayan. Biasa ditemukan pada algoritma sorting efisien. Contoh: Merge Sort, Quick Sort." },
    { label: "O(n²) - Kuadratik", color: "text-rose-500", bg: "bg-rose-600", fn: (n: number) => n * n, desc: "Mengerikan untuk data besar! Waktu melonjak drastis. Contoh: Nested Loop (loop di dalam loop), Bubble Sort." }
  ];

  // For visualization, normalize heights based on max N=100
  const maxN = 100;
  const maxO_n2 = maxN * maxN;

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-4 lg:p-8 overflow-y-auto">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Kompleksitas Algoritma (Big O Notation)</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-lg">
           Menganalisis seberapa efisien kode program saat jumlah data (N) membesar.
        </p>

        <div className="w-full max-w-4xl bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl relative mb-8">
           <div className="text-center mb-8">
              <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Jumlah Data (N) = {dataSize}</div>
           </div>

           {/* The Comparison Chart (Horizontal bars) */}
           <div className="space-y-6 relative">
              {/* Scale guides background */}
              <div className="absolute inset-0 flex justify-between pointer-events-none z-0 px-[200px] opacity-10">
                 <div className="h-full border-l border-white border-dashed"></div>
                 <div className="h-full border-l border-white border-dashed"></div>
                 <div className="h-full border-l border-white border-dashed"></div>
                 <div className="h-full border-l border-white border-dashed"></div>
              </div>

              {complexities.map((comp, idx) => {
                 const rawValue = comp.fn(dataSize);
                 // Special scaling to make the chart look visually intuitive 
                 // We scale relative to O(n^2) at current dataSize, but cap minimum width so it's visible
                 let widthPct = 0;
                 if (dataSize > 0) {
                     const maxValCurrent = complexities[4].fn(dataSize); // O(n^2) is always max here
                     widthPct = Math.max(0.5, (rawValue / maxValCurrent) * 100);
                 }

                 return (
                    <div key={idx} className="relative z-10 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 group">
                       <div className={`w-48 text-right font-bold text-sm ${comp.color}`}>{comp.label}</div>
                       <div className="flex-1 h-8 bg-zinc-950 border border-zinc-800 rounded-r-lg relative flex items-center">
                          {/* The Bar */}
                          <div 
                             className={`h-full transition-all duration-300 rounded-r-sm ${comp.bg}`}
                             style={{ width: `${widthPct}%` }}
                          />
                          {/* Operations Count Label */}
                          <div className={`absolute ml-2 text-xs font-mono font-bold transition-all duration-300 ${comp.color}`} style={{ left: `${widthPct}%` }}>
                             {Math.round(rawValue)} op
                          </div>
                       </div>
                       
                       {/* Tooltip Description */}
                       <div className="hidden md:block absolute right-0 -top-12 bg-black text-white p-2 text-xs rounded border border-zinc-700 w-64 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none shadow-xl">
                          {comp.desc}
                       </div>
                    </div>
                 );
              })}
           </div>

           <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-zinc-400 text-sm italic">
                 "Programmer yang baik bukan hanya yang kodenya bisa jalan, tapi yang kodenya efisien."
              </p>
           </div>
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Uji Beban (Load Test)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-8">
          
          <div>
            <div className="text-xs font-bold text-zinc-400 mb-4 uppercase">Geser Jumlah Data (N):</div>
            <input 
              type="range" min="1" max="100" step="1" 
              value={dataSize} 
              onChange={e=>setDataSize(parseInt(e.target.value))} 
              className="w-full accent-blue-500" 
            />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-mono">
               <span>N=1</span>
               <span className="text-white text-sm">N={dataSize}</span>
               <span>N=100</span>
            </div>
          </div>

          <div className="space-y-4">
             <div className="p-3 bg-rose-950/30 border border-rose-900/50 rounded-xl">
                <div className="text-rose-400 font-bold text-xs mb-1">Bahaya O(n²)</div>
                <div className="text-[10px] text-zinc-400">Saat N = 100, algoritma ini butuh 10.000 operasi! Bayangkan jika user aplikasi Anda ada 1 Juta, server pasti langsung crash/hang.</div>
             </div>

             <div className="p-3 bg-blue-950/30 border border-blue-900/50 rounded-xl">
                <div className="text-blue-400 font-bold text-xs mb-1">Keajaiban O(log n)</div>
                <div className="text-[10px] text-zinc-400">Mencari 1 orang dari 1 Juta data base hanya butuh maksimal 20 operasi pembelahan! Sangat luar biasa efisien.</div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
