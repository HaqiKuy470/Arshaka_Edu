"use client";

import { useState } from "react";

export default function VisualisasiData() {
  const [chartType, setChartType] = useState<"bar"|"line"|"pie">("bar");

  // Mock data for visual
  const data = [
    { label: "Jan", value: 30 },
    { label: "Feb", value: 45 },
    { label: "Mar", value: 20 },
    { label: "Apr", value: 80 },
    { label: "Mei", value: 65 },
  ];

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Data Science & Visualisasi</h2>
        <p className="text-zinc-400 mb-12 text-center max-w-lg mx-auto">
           Mengubah kumpulan angka membosankan menjadi informasi/wawasan (Insight).
        </p>

        <div className="w-full max-w-3xl bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative min-h-[400px] flex flex-col">
           
           <h3 className="text-center font-bold text-white mb-8">Statistik Kunjungan Web (Ribuan)</h3>

           {/* The Chart Canvas Area */}
           <div className="flex-1 relative flex items-end justify-center pb-8 px-4 gap-4 md:gap-12 w-full">
              
              {chartType === "bar" && data.map((d, i) => (
                 <div key={i} className="flex flex-col items-center flex-1 group">
                    <div className="w-full bg-blue-500 rounded-t-md transition-all duration-700 ease-out relative group-hover:bg-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]" style={{ height: `${(d.value/maxValue)*200}px` }}>
                       <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">{d.value}k</span>
                    </div>
                    <div className="text-xs text-zinc-500 font-bold mt-2">{d.label}</div>
                 </div>
              ))}

              {chartType === "line" && (
                 <div className="absolute inset-0 flex items-end justify-between pb-8 px-12 md:px-24">
                    {/* Fake Line SVG */}
                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                       <path d="M10,80 L30,65 L50,90 L70,30 L90,45" fill="none" stroke="#10b981" strokeWidth="2" className="animate-[draw_1s_ease-out_forwards]" strokeDasharray="200" strokeDashoffset="0" />
                    </svg>
                    
                    {data.map((d, i) => (
                       <div key={i} className="flex flex-col items-center relative z-10" style={{ transform: `translateY(-${(d.value/maxValue)*200}px)` }}>
                          <div className="w-4 h-4 bg-emerald-500 border-2 border-zinc-900 rounded-full hover:scale-150 transition-all cursor-pointer shadow-[0_0_10px_#10b981]" />
                          <div className="absolute top-6 text-xs text-zinc-500 font-bold">{d.label}</div>
                       </div>
                    ))}
                 </div>
              )}

              {chartType === "pie" && (
                 <div className="absolute inset-0 flex items-center justify-center">
                    {/* Abstract Pie Chart using CSS conic-gradient */}
                    <div 
                      className="w-48 h-48 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.1)] animate-[spin_2s_ease-out]"
                      style={{ 
                         background: 'conic-gradient(#ef4444 0% 15%, #f59e0b 15% 40%, #10b981 40% 50%, #3b82f6 50% 80%, #8b5cf6 80% 100%)'
                      }}
                    />
                    <div className="absolute w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center font-bold text-white shadow-inner">
                       Total
                    </div>
                 </div>
              )}

           </div>
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Tipe Grafik</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          <button 
             onClick={()=>setChartType("bar")} 
             className={`w-full p-4 flex items-center gap-4 text-left rounded-xl transition-all border ${chartType === 'bar' ? 'bg-blue-900 border-blue-500 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
          >
             <span className="text-2xl">📊</span>
             <div>
                <div className="text-sm">Bar Chart (Batang)</div>
                <div className="text-[10px] opacity-70 mt-1 font-normal">Bagus untuk membandingkan jumlah antar kategori.</div>
             </div>
          </button>
          
          <button 
             onClick={()=>setChartType("line")} 
             className={`w-full p-4 flex items-center gap-4 text-left rounded-xl transition-all border ${chartType === 'line' ? 'bg-emerald-900 border-emerald-500 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
          >
             <span className="text-2xl">📈</span>
             <div>
                <div className="text-sm">Line Chart (Garis)</div>
                <div className="text-[10px] opacity-70 mt-1 font-normal">Sangat cocok untuk melihat tren dari waktu ke waktu (Time Series).</div>
             </div>
          </button>

          <button 
             onClick={()=>setChartType("pie")} 
             className={`w-full p-4 flex items-center gap-4 text-left rounded-xl transition-all border ${chartType === 'pie' ? 'bg-amber-900 border-amber-500 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
          >
             <span className="text-2xl">🍕</span>
             <div>
                <div className="text-sm">Pie Chart (Kue)</div>
                <div className="text-[10px] opacity-70 mt-1 font-normal">Digunakan untuk melihat porsi persentase dari keseluruhan (100%).</div>
             </div>
          </button>

        </div>
      </div>
    </div>
  );
}
