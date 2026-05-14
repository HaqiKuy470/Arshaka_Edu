"use client";

import { useState } from "react";

export default function NilaiWaktuUang() {
  const [principal, setPrincipal] = useState(10000000); // 10 Juta
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(6); // 6% per tahun

  // Compound Interest Formula: FV = PV * (1 + r)^n
  const futureValue = principal * Math.pow(1 + (rate / 100), years);
  const totalInterest = futureValue - principal;

  const formatRp = (num: number) => `Rp ${Math.round(num).toLocaleString('id-ID')}`;

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Nilai Waktu Uang</h2>
        <p className="text-zinc-400 mb-12 text-center max-w-lg">
           (Time Value of Money - Bunga Majemuk)
        </p>

        <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
           
           {/* Present Value (PV) */}
           <div className="w-full md:w-1/3 bg-zinc-900 border border-white/10 p-6 rounded-3xl text-center shadow-lg relative">
              <div className="text-6xl mb-4">💰</div>
              <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Hari Ini (Present Value)</div>
              <div className="text-2xl font-black text-white font-mono">{formatRp(principal)}</div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                 Tahun 0
              </div>
           </div>

           {/* Time passing / Interest Engine */}
           <div className="flex-1 flex flex-col items-center">
              <div className="text-amber-500 text-xl font-bold mb-2">Bunga Majemuk {rate}% / Thn</div>
              <div className="w-full h-2 bg-zinc-800 rounded-full relative overflow-hidden my-4">
                 <div className="absolute top-0 left-0 h-full bg-amber-500 shadow-[0_0_10px_#f59e0b] animate-[pulse_2s_ease-in-out_infinite]" style={{ width: '100%' }} />
              </div>
              <div className="text-blue-400 font-bold uppercase tracking-widest">Berjalan Selama {years} Tahun</div>
              <div className="text-sm text-zinc-500 mt-2">Bunga didapat: <span className="text-emerald-400 font-bold">+{formatRp(totalInterest)}</span></div>
           </div>

           {/* Future Value (FV) */}
           <div className="w-full md:w-1/3 bg-emerald-950/40 border border-emerald-500/30 p-6 rounded-3xl text-center shadow-[0_0_30px_rgba(16,185,129,0.15)] relative">
              <div className="text-6xl mb-4">💎</div>
              <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2">Masa Depan (Future Value)</div>
              <div className="text-3xl font-black text-emerald-400 font-mono">{formatRp(futureValue)}</div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                 Tahun Ke-{years}
              </div>
           </div>

        </div>

        {/* Chart Visualization (Simple block stack) */}
        <div className="mt-16 flex items-end gap-2 h-40 border-b border-zinc-700 pb-2 w-full max-w-2xl px-8">
           {Array.from({length: years + 1}).map((_, i) => {
              const val = principal * Math.pow(1 + (rate / 100), i);
              const heightPct = (val / futureValue) * 100;
              return (
                 <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
                    <div className="w-full bg-amber-500/80 rounded-t-sm transition-all relative border border-amber-400" style={{ height: `${heightPct}%` }}>
                       {/* Tooltip */}
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-20 whitespace-nowrap">
                          {formatRp(val)}
                       </div>
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-2 font-mono">Th {i}</div>
                 </div>
              );
           })}
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Kalkulator Majemuk</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-8">
          
          <div>
            <div className="text-xs font-bold text-zinc-400 mb-2 uppercase">Modal Awal (Rp)</div>
            <input 
              type="range" min="1000000" max="100000000" step="1000000" 
              value={principal} 
              onChange={e=>setPrincipal(parseInt(e.target.value))} 
              className="w-full accent-blue-500" 
            />
            <div className="text-right font-bold text-white mt-1 text-sm">{formatRp(principal)}</div>
          </div>

          <div>
            <div className="text-xs font-bold text-zinc-400 mb-2 uppercase">Lama Waktu Menabung</div>
            <input 
              type="range" min="1" max="40" step="1" 
              value={years} 
              onChange={e=>setYears(parseInt(e.target.value))} 
              className="w-full accent-emerald-500" 
            />
            <div className="text-right font-bold text-white mt-1 text-sm">{years} Tahun</div>
          </div>

          <div>
            <div className="text-xs font-bold text-zinc-400 mb-2 uppercase">Suku Bunga / Return Investasi</div>
            <input 
              type="range" min="1" max="25" step="1" 
              value={rate} 
              onChange={e=>setRate(parseInt(e.target.value))} 
              className="w-full accent-amber-500" 
            />
            <div className="text-right font-bold text-white mt-1 text-sm">{rate}% Per Tahun</div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Bunga Majemuk (Compound Interest)</strong> disebut Einstein sebagai "Keajaiban dunia ke-8".</p>
            <p>Kenapa ajaib? Karena bunga yang Anda dapatkan tahun ini, akan <strong>ditambahkan ke modal</strong>, sehingga tahun depannya bunga tersebut akan <strong>menghasilkan bunga lagi</strong> (Bunga berbunga). Rahasia menjadi kaya adalah WAKTU!</p>
          </div>

        </div>
      </div>
    </div>
  );
}
