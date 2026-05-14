"use client";

import { useState, useEffect } from "react";

export default function InflasiDeflasi() {
  const [moneySupply, setMoneySupply] = useState(100); // Amount of money in circulation
  const [goodsSupply, setGoodsSupply] = useState(100); // Amount of goods available
  
  // Price Level formula: P = (Money * Velocity) / Real GDP (Goods)
  // We assume Velocity is constant 1 for simplicity.
  const priceLevel = moneySupply / goodsSupply;
  
  // Base price is 10,000 IDR when ratio is 1
  const currentPrice = priceLevel * 10000;

  // Determine State
  const state = priceLevel > 1.2 ? "inflasi_tinggi" : priceLevel > 1.05 ? "inflasi" : priceLevel < 0.8 ? "deflasi_tinggi" : priceLevel < 0.95 ? "deflasi" : "stabil";

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <h2 className="text-3xl font-bold text-white mb-8 drop-shadow-lg text-center">Simulasi Nilai Uang (Inflasi/Deflasi)</h2>

        <div className="w-full max-w-3xl flex flex-col md:flex-row items-center gap-8 bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl relative">
           
           {/* Left Scale: Money */}
           <div className="flex-1 flex flex-col items-center w-full">
              <div className="text-xs font-bold text-emerald-400 mb-4 uppercase tracking-widest">Jumlah Uang Beredar</div>
              <div className="relative w-32 h-48 bg-black/50 border border-emerald-900/50 rounded-b-xl rounded-t-sm flex items-end justify-center overflow-hidden">
                 {/* Visual Money Stack */}
                 <div className="w-full bg-emerald-600/50 flex flex-col justify-end transition-all duration-500" style={{ height: `${(moneySupply/300)*100}%` }}>
                    <div className="w-full h-2 bg-emerald-500" />
                 </div>
                 <div className="absolute inset-0 flex items-center justify-center text-4xl">💵</div>
              </div>
              <div className="mt-4 font-mono text-emerald-300 font-bold">{moneySupply} Triliun</div>
           </div>

           {/* Center Balance / Result */}
           <div className="flex-1 flex flex-col items-center justify-center w-full min-w-[200px]">
              <div className="text-xs text-zinc-500 font-bold uppercase mb-2">Harga 1 Porsi Bakso</div>
              <div className={`text-4xl font-black mb-2 transition-all duration-300 ${state.includes('inflasi') ? 'text-red-500 scale-110' : state.includes('deflasi') ? 'text-blue-500 scale-90' : 'text-white'}`}>
                 Rp {Math.round(currentPrice).toLocaleString()}
              </div>
              <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${state.includes('inflasi_tinggi') ? 'bg-red-600 text-white animate-pulse' : state === 'inflasi' ? 'bg-red-900/50 text-red-400' : state.includes('deflasi_tinggi') ? 'bg-blue-600 text-white animate-pulse' : state === 'deflasi' ? 'bg-blue-900/50 text-blue-400' : 'bg-zinc-700 text-white'}`}>
                 Status: {state.replace('_', ' ')}
              </div>
           </div>

           {/* Right Scale: Goods */}
           <div className="flex-1 flex flex-col items-center w-full">
              <div className="text-xs font-bold text-amber-400 mb-4 uppercase tracking-widest">Ketersediaan Barang</div>
              <div className="relative w-32 h-48 bg-black/50 border border-amber-900/50 rounded-b-xl rounded-t-sm flex items-end justify-center overflow-hidden">
                 {/* Visual Goods Stack */}
                 <div className="w-full bg-amber-600/50 flex flex-col justify-end transition-all duration-500" style={{ height: `${(goodsSupply/300)*100}%` }}>
                    <div className="w-full h-2 bg-amber-500" />
                 </div>
                 <div className="absolute inset-0 flex items-center justify-center text-4xl">📦</div>
              </div>
              <div className="mt-4 font-mono text-amber-300 font-bold">{goodsSupply} Juta Ton</div>
           </div>

        </div>

        {/* Info Box */}
        <div className="mt-8 max-w-2xl bg-black/50 border border-white/5 p-6 rounded-2xl text-center animate-fade-in">
           {state.includes("inflasi") && (
              <p className="text-red-300 text-sm">
                 Terlalu banyak uang beredar memperebutkan barang yang sedikit! Harga-harga naik drastis. Nilai uang Anda menurun karena butuh uang lebih banyak untuk membeli barang yang sama.
              </p>
           )}
           {state.includes("deflasi") && (
              <p className="text-blue-300 text-sm">
                 Terlalu banyak barang tapi uang beredar sedikit. Harga-harga turun tajam. Sekilas terlihat bagus untuk pembeli, tapi ini membuat perusahaan rugi, pabrik tutup, dan memicu PHK massal!
              </p>
           )}
           {state === "stabil" && (
              <p className="text-zinc-300 text-sm">
                 Peredaran uang seimbang dengan produksi barang. Harga-harga stabil, daya beli masyarakat terjaga, dan ekonomi berjalan sehat.
              </p>
           )}
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Inflasi & Deflasi</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-6">
             <div>
               <div className="flex justify-between text-xs font-bold text-emerald-400 mb-2 uppercase">
                 <span>Cetak Uang Beredar</span>
               </div>
               <input type="range" min="20" max="300" step="10" value={moneySupply} onChange={e=>setMoneySupply(parseInt(e.target.value))} className="w-full accent-emerald-500" />
               <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">Geser ke kanan mensimulasikan Bank Sentral mencetak terlalu banyak uang baru.</p>
             </div>

             <div>
               <div className="flex justify-between text-xs font-bold text-amber-400 mb-2 uppercase">
                 <span>Produksi Barang (Pabrik)</span>
               </div>
               <input type="range" min="20" max="300" step="10" value={goodsSupply} onChange={e=>setGoodsSupply(parseInt(e.target.value))} className="w-full accent-amber-500" />
               <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">Geser ke kiri mensimulasikan pabrik tutup, gagal panen, atau perang yang membuat barang langka.</p>
             </div>

             <button 
               onClick={() => {setMoneySupply(100); setGoodsSupply(100);}} 
               className="w-full p-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg border border-white/10"
             >
                Kembalikan ke Stabil
             </button>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p>Banyak negara hancur secara ekonomi karena pemerintahnya asal mencetak uang untuk membayar hutang tanpa dibarengi peningkatan produksi barang (Contoh: Zimbabwe, Venezuela).</p>
            <p className="text-red-400 font-bold">Uang hanyalah kertas. Yang memiliki nilai asli adalah barang dan jasa yang bisa dibeli dengan kertas tersebut.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
