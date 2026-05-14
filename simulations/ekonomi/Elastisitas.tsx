"use client";

import { useState } from "react";

export default function Elastisitas() {
  const [productType, setProductType] = useState<"elastis"|"inelastis">("elastis");
  const [priceChange, setPriceChange] = useState<number>(0); // -50 to +50 percent

  // Calculate demand change based on elasticity
  // Elastis (Elastic): Ed > 1 (e.g. 2.0). If price +10%, qty -20%.
  // Inelastis (Inelastic): Ed < 1 (e.g. 0.5). If price +10%, qty -5%.
  const elasticity = productType === "elastis" ? 2.5 : 0.4;
  
  const demandChange = -(priceChange * elasticity);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <div className="w-full max-w-4xl flex flex-col items-center">
           
           <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Elastisitas Harga Permintaan</h2>
           <p className="text-zinc-400 mb-8 text-center max-w-lg">
              Seberapa sensitif pembeli terhadap perubahan harga barang?
           </p>

           <div className="flex w-full gap-8 bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl relative">
              
              {/* Product Selector Context */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-2">
                 <button 
                   onClick={()=>setProductType("elastis")} 
                   className={`px-6 py-3 rounded-full font-bold shadow-lg transition-all border-2 ${productType === 'elastis' ? 'bg-blue-600 text-white border-blue-400 scale-110 z-10' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}
                 >
                    📺 Barang Mewah/Sekunder (Elastis)
                 </button>
                 <button 
                   onClick={()=>setProductType("inelastis")} 
                   className={`px-6 py-3 rounded-full font-bold shadow-lg transition-all border-2 ${productType === 'inelastis' ? 'bg-red-600 text-white border-red-400 scale-110 z-10' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}
                 >
                    🍚 Kebutuhan Pokok (Inelastis)
                 </button>
              </div>

              {/* Price Scale */}
              <div className="flex-1 flex flex-col items-center mt-6">
                 <div className="text-xs font-bold text-zinc-500 uppercase mb-4">Perubahan Harga (Price)</div>
                 
                 <div className="relative w-24 h-48 bg-black/50 border border-zinc-800 rounded-xl flex items-center justify-center overflow-hidden">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-700" />
                    
                    {/* Price Bar */}
                    <div className={`absolute left-0 w-full opacity-80 ${priceChange >= 0 ? 'bottom-1/2 bg-amber-500' : 'top-1/2 bg-emerald-500'}`}
                         style={{ height: `${Math.abs(priceChange)}%` }} />
                 </div>
                 
                 <div className={`mt-4 text-3xl font-black ${priceChange > 0 ? 'text-amber-500' : priceChange < 0 ? 'text-emerald-500' : 'text-white'}`}>
                    {priceChange > 0 ? '+' : ''}{priceChange}%
                 </div>
              </div>

              {/* Action arrow */}
              <div className="flex items-center text-4xl text-zinc-600 mt-6">➔</div>

              {/* Demand Scale */}
              <div className="flex-1 flex flex-col items-center mt-6">
                 <div className="text-xs font-bold text-zinc-500 uppercase mb-4">Perubahan Permintaan (Qty)</div>
                 
                 <div className="relative w-24 h-48 bg-black/50 border border-zinc-800 rounded-xl flex items-center justify-center overflow-hidden">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-700" />
                    
                    {/* Demand Bar */}
                    <div className={`absolute left-0 w-full transition-all duration-300 opacity-80 ${demandChange >= 0 ? 'bottom-1/2 bg-emerald-500' : 'top-1/2 bg-red-500'}`}
                         style={{ height: `${Math.min(100, Math.abs(demandChange))}%` }} />
                 </div>
                 
                 <div className={`mt-4 text-3xl font-black transition-all duration-300 ${demandChange > 0 ? 'text-emerald-500' : demandChange < 0 ? 'text-red-500' : 'text-white'}`}>
                    {demandChange > 0 ? '+' : ''}{demandChange.toFixed(1)}%
                 </div>
              </div>

           </div>

           {/* Explanation Box */}
           <div className="mt-8 bg-black/50 p-6 rounded-2xl border border-white/5 w-full text-center max-w-2xl animate-fade-in min-h-[100px]">
              {productType === "elastis" ? (
                 <p className="text-blue-300">
                    <strong>Sangat Sensitif (Elastis)!</strong> Karena ini barang mewah (TV/Mobil), kenaikan harga sedikit saja membuat pembeli langsung kabur ({demandChange}%). Sebaliknya, diskon sedikit membuat pembeli membludak!
                 </p>
              ) : (
                 <p className="text-red-300">
                    <strong>Tidak Sensitif (Inelastis)!</strong> Karena ini beras atau obat, mau harga naik drastis pun ({priceChange}%), pembeli tetap harus beli sehingga permintaan hanya turun sedikit ({demandChange}%).
                 </p>
              )}
           </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Elastisitas</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div>
            <div className="text-xs font-bold text-amber-400 mb-2 uppercase">Ubah Harga Pasar:</div>
            <input 
              type="range" min="-50" max="50" value={priceChange} 
              onChange={e=>setPriceChange(parseInt(e.target.value))} 
              className="w-full accent-amber-500" 
            />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
               <span>Diskon -50%</span>
               <span>Naik Harga +50%</span>
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Elastisitas</strong> mengukur reaksi pembeli saat terjadi perubahan harga.</p>
            <ul className="space-y-2 mt-2">
               <li><strong className="text-blue-400">Elastis (Ed &gt; 1):</strong> Pembeli sensitif. Contoh: Barang sekunder/mewah, tiket pesawat liburan.</li>
               <li><strong className="text-red-400">Inelastis (Ed &lt; 1):</strong> Pembeli kebal/terpaksa beli. Contoh: Beras, listrik, bensin, obat resep dokter.</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
