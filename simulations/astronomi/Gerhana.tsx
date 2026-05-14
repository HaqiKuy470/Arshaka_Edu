"use client";

import { useState } from "react";

export default function Gerhana() {
  const [eclipseType, setEclipseType] = useState<"matahari"|"bulan">("matahari");
  const [alignment, setAlignment] = useState(50); // 0 to 100, 50 is perfect alignment

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center bg-zinc-950 p-4 lg:p-8 overflow-y-auto">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Gerhana Matahari & Bulan</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-lg mx-auto">
           Fenomena saat tiga benda langit sejajar sempurna (Syzygy).
        </p>

        <div className="flex justify-center mb-8 w-full max-w-sm">
           <div className="bg-zinc-900 border border-zinc-800 p-1 rounded-xl flex gap-1 shadow-lg w-full">
              <button onClick={() => setEclipseType("matahari")} className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${eclipseType === 'matahari' ? 'bg-amber-600 text-white' : 'text-zinc-400 hover:text-white'}`}>Gerhana Matahari</button>
              <button onClick={() => setEclipseType("bulan")} className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${eclipseType === 'bulan' ? 'bg-rose-600 text-white' : 'text-zinc-400 hover:text-white'}`}>Gerhana Bulan</button>
           </div>
        </div>

        <div className="w-full max-w-4xl bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative min-h-[400px] flex flex-col items-center justify-center overflow-hidden">
           
           {/* Space Background */}
           <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: 'radial-gradient(1px 1px at 20% 30%, white, transparent), radial-gradient(1px 1px at 70% 60%, white, transparent), radial-gradient(2px 2px at 50% 80%, white, transparent)',
              backgroundSize: '150px 150px'
           }} />

           <div className="relative w-full h-64 flex items-center justify-between px-8 md:px-20 z-10">
              
              {/* Sun (Fixed on Left) */}
              <div className="w-24 h-24 md:w-32 md:h-32 bg-yellow-500 rounded-full shadow-[0_0_60px_rgba(234,179,8,0.8)] z-10 shrink-0" />

              {/* Light rays cone */}
              <svg className="absolute left-32 md:left-40 right-0 h-full z-0 opacity-20 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                 <polygon points="0,20 100,0 100,100 0,80" fill="yellow" />
              </svg>

              {eclipseType === "matahari" ? (
                 <>
                    {/* Sun -> Moon -> Earth */}
                    {/* Moon (Moves up and down based on alignment) */}
                    <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 md:w-12 md:h-12 bg-zinc-500 rounded-full z-20 shadow-inner" style={{ top: `${alignment}%`, transform: `translate(-50%, -50%)` }} />
                    
                    {/* Earth (Fixed on Right) */}
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-500 rounded-full shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.8)] z-10 shrink-0 border-2 border-blue-400 relative overflow-hidden">
                       <div className="absolute top-2 left-4 w-10 h-6 bg-emerald-500 rounded-full opacity-80" />
                       <div className="absolute bottom-2 right-2 w-8 h-8 bg-emerald-500 rounded-full opacity-80" />
                       
                       {/* Eclipse Shadow on Earth */}
                       {Math.abs(alignment - 50) < 15 && (
                          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-black rounded-full shadow-[0_0_10px_black] -translate-x-1/2 -translate-y-1/2" style={{ transform: `translate(-50%, calc(-50% + ${(alignment-50)*2}px))` }} />
                       )}
                    </div>
                 </>
              ) : (
                 <>
                    {/* Sun -> Earth -> Moon */}
                    {/* Earth (Fixed in middle) */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-20 h-20 md:w-24 md:h-24 bg-blue-500 rounded-full shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.8)] z-10 shrink-0 border-2 border-blue-400 overflow-hidden">
                       <div className="absolute top-2 left-4 w-10 h-6 bg-emerald-500 rounded-full opacity-80" />
                    </div>

                    {/* Earth's Shadow Cone (Umbra) */}
                    <svg className="absolute left-1/2 right-0 top-1/2 -translate-y-1/2 h-24 z-0 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                       <polygon points="0,0 100,30 100,70 0,100" fill="rgba(0,0,0,0.8)" />
                    </svg>

                    {/* Moon (Moves up and down based on alignment, on Right) */}
                    <div 
                      className={`w-8 h-8 md:w-12 md:h-12 rounded-full z-20 transition-colors duration-500 ${Math.abs(alignment - 50) < 10 ? 'bg-red-800 shadow-[0_0_10px_#7f1d1d]' : Math.abs(alignment - 50) < 20 ? 'bg-zinc-700' : 'bg-zinc-300'}`} 
                      style={{ marginTop: `calc(${alignment - 50}px * 2)` }} 
                    />
                 </>
              )}

           </div>

           <div className="mt-8 text-center bg-black/50 px-6 py-2 rounded-full border border-white/10">
              <span className="font-bold text-amber-400">Status: </span>
              <span className="text-white">
                 {Math.abs(alignment - 50) < 5 ? "Gerhana Total (Syzygy Sempurna)" : Math.abs(alignment - 50) < 20 ? "Gerhana Sebagian (Parsial)" : "Tidak Terjadi Gerhana"}
              </span>
           </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Kontrol Orbit</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-4">
             <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Kemiringan Orbit Bulan</div>
             <input 
               type="range" min="0" max="100" step="1" 
               value={alignment} 
               onChange={e=>setAlignment(parseInt(e.target.value))} 
               className="w-full accent-amber-500" 
             />
             <div className="text-xs text-zinc-500 leading-relaxed">Geser slider ke tengah (50) untuk membuat ketiganya sejajar sempurna dalam satu garis lurus.</div>
          </div>

          <div className="p-4 bg-zinc-900 rounded-xl border border-white/5 space-y-4 text-sm text-zinc-300 leading-relaxed mt-8">
             {eclipseType === "matahari" ? (
                <>
                   <h4 className="font-bold text-amber-500 border-b border-zinc-700 pb-2">Gerhana Matahari</h4>
                   <p>Terjadi di siang hari saat fase <strong>Bulan Baru</strong>. Bulan menghalangi cahaya Matahari jatuh ke Bumi.</p>
                   <p className="text-xs text-zinc-500">Meskipun Bulan sangat kecil, jaraknya sangat dekat dengan Bumi sehingga tampak seukuran dengan Matahari di langit (Perspektif).</p>
                </>
             ) : (
                <>
                   <h4 className="font-bold text-rose-500 border-b border-zinc-700 pb-2">Gerhana Bulan</h4>
                   <p>Terjadi di malam hari saat fase <strong>Bulan Purnama</strong>. Bumi menghalangi cahaya Matahari jatuh ke Bulan.</p>
                   <p className="text-xs text-rose-400/80">Saat gerhana total, bulan tampak merah muda/darah (Blood Moon) karena pembiasan cahaya matahari oleh atmosfer bumi (Hamburan Rayleigh).</p>
                </>
             )}
          </div>

        </div>
      </div>
    </div>
  );
}
