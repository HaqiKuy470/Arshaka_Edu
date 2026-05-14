"use client";

import { useState } from "react";

export default function SistemHormon() {
  const [gland, setGland] = useState<"pituitari"|"tiroid"|"adrenal"|"pankreas">("pankreas");
  const [sugarLevel, setSugarLevel] = useState(90);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        {/* Human Body Outline with Glands */}
        <div className="relative w-[300px] h-[600px] bg-zinc-900/50 rounded-full border border-white/10 flex flex-col items-center pt-8">
           <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/4/4b/Human_body_silhouette.svg')] bg-contain bg-center bg-no-repeat" />

           {/* Pituitary Gland (Brain) */}
           <div 
             onClick={()=>setGland("pituitari")}
             className={`absolute top-16 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all ${gland === 'pituitari' ? 'bg-purple-500 scale-125 shadow-[0_0_20px_rgba(168,85,247,0.8)] z-10' : 'bg-purple-900 border-2 border-purple-500 opacity-60'}`}
           >🧠</div>

           {/* Thyroid Gland (Neck) */}
           <div 
             onClick={()=>setGland("tiroid")}
             className={`absolute top-32 w-10 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all ${gland === 'tiroid' ? 'bg-emerald-500 scale-125 shadow-[0_0_20px_rgba(16,185,129,0.8)] z-10' : 'bg-emerald-900 border-2 border-emerald-500 opacity-60'}`}
           >🦋</div>

           {/* Adrenal Glands (Kidneys) */}
           <div 
             onClick={()=>setGland("adrenal")}
             className={`absolute top-72 w-16 h-8 flex justify-between cursor-pointer transition-all ${gland === 'adrenal' ? 'scale-125 z-10' : 'opacity-60'}`}
           >
              <div className={`w-6 h-6 rounded-t-full ${gland==='adrenal' ? 'bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.8)]' : 'bg-amber-900 border-2 border-amber-500'}`} />
              <div className={`w-6 h-6 rounded-t-full ${gland==='adrenal' ? 'bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.8)]' : 'bg-amber-900 border-2 border-amber-500'}`} />
           </div>

           {/* Pancreas (Stomach area) */}
           <div 
             onClick={()=>setGland("pankreas")}
             className={`absolute top-80 w-20 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all ${gland === 'pankreas' ? 'bg-rose-500 scale-125 shadow-[0_0_20px_rgba(244,63,94,0.8)] z-10' : 'bg-rose-900 border-2 border-rose-500 opacity-60'}`}
           >🍃</div>
        </div>

        {/* Interactive Element (Only for Pancreas demo) */}
        {gland === "pankreas" && (
           <div className="absolute right-10 bottom-10 glass-card p-6 rounded-2xl w-64 border-t-4 border-rose-500">
             <div className="text-sm font-bold text-white mb-4">Simulasi Gula Darah</div>
             <div className="text-2xl font-mono text-white mb-2">{sugarLevel} mg/dL</div>
             <input type="range" className="w-full accent-rose-500" min="40" max="200" value={sugarLevel} onChange={(e)=>setSugarLevel(parseInt(e.target.value))} />
             <div className="mt-4 text-xs font-bold p-2 rounded bg-black/50 text-center">
                {sugarLevel > 120 ? (
                  <span className="text-blue-400">Pankreas merilis INSULIN (Menyimpan gula)</span>
                ) : sugarLevel < 70 ? (
                  <span className="text-amber-400">Pankreas merilis GLUKAGON (Melepas gula)</span>
                ) : (
                  <span className="text-emerald-400">Normal (Homeostasis)</span>
                )}
             </div>
           </div>
        )}

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Sistem Endokrin (Hormon)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          {gland === "pituitari" && (
             <div className="bg-purple-950/50 border border-purple-500/30 p-4 rounded-xl">
               <h4 className="text-lg font-bold text-purple-400 mb-2">Kelenjar Pituitari (Hipofisis)</h4>
               <p className="text-sm text-zinc-300">Dikenal sebagai "Master Gland" (Kelenjar Induk) karena hormon yang dihasilkannya mengontrol kelenjar endokrin lain.</p>
               <div className="mt-4 text-xs bg-black/40 p-2 rounded"><strong>Hormon Utama:</strong> Growth Hormone (GH), TSH, Oksitosin.</div>
             </div>
          )}

          {gland === "tiroid" && (
             <div className="bg-emerald-950/50 border border-emerald-500/30 p-4 rounded-xl">
               <h4 className="text-lg font-bold text-emerald-400 mb-2">Kelenjar Tiroid</h4>
               <p className="text-sm text-zinc-300">Terletak di leher berbentuk seperti kupu-kupu. Mengontrol seberapa cepat tubuh membakar energi (Metabolisme).</p>
               <div className="mt-4 text-xs bg-black/40 p-2 rounded"><strong>Hormon Utama:</strong> Tiroksin (T4), Triiodotironin (T3). Membutuhkan Yodium.</div>
             </div>
          )}

          {gland === "adrenal" && (
             <div className="bg-amber-950/50 border border-amber-500/30 p-4 rounded-xl">
               <h4 className="text-lg font-bold text-amber-400 mb-2">Kelenjar Adrenal</h4>
               <p className="text-sm text-zinc-300">Terletak di atas ginjal. Sangat aktif saat kita merasa stres, takut, atau bersemangat (Respon Fight or Flight).</p>
               <div className="mt-4 text-xs bg-black/40 p-2 rounded"><strong>Hormon Utama:</strong> Adrenalin (Epinefrin), Kortisol.</div>
             </div>
          )}

          {gland === "pankreas" && (
             <div className="bg-rose-950/50 border border-rose-500/30 p-4 rounded-xl">
               <h4 className="text-lg font-bold text-rose-400 mb-2">Pankreas</h4>
               <p className="text-sm text-zinc-300">Berfungsi ganda sebagai organ pencernaan dan endokrin. Sangat krusial untuk mengatur kadar gula dalam darah.</p>
               <div className="mt-4 text-xs bg-black/40 p-2 rounded"><strong>Hormon Utama:</strong> Insulin (Menurunkan gula), Glukagon (Menaikkan gula).</div>
             </div>
          )}

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-2 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Hormon</strong> adalah pembawa pesan kimiawi tubuh. Mereka bergerak melalui aliran darah menuju jaringan atau organ tertentu.</p>
            <p>Berbeda dengan sistem saraf yang bekerja dalam hitungan milidetik, hormon bekerja secara lambat namun efeknya bertahan sangat lama.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
