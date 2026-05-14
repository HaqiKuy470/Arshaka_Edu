"use client";

import { useState } from "react";

export default function KalkulatorIMT() {
  const [berat, setBerat] = useState(60); // kg
  const [tinggi, setTinggi] = useState(165); // cm

  // Calculate IMT (BMI)
  const tinggiM = tinggi / 100;
  const imt = berat / (tinggiM * tinggiM);

  const getCategory = () => {
     if (imt < 18.5) return { name: "Kekurangan Berat Badan", color: "text-blue-400", bg: "bg-blue-500" };
     if (imt >= 18.5 && imt <= 24.9) return { name: "Normal (Sehat)", color: "text-emerald-400", bg: "bg-emerald-500" };
     if (imt >= 25.0 && imt <= 29.9) return { name: "Kelebihan Berat Badan", color: "text-amber-400", bg: "bg-amber-500" };
     return { name: "Obesitas", color: "text-red-500", bg: "bg-red-600" };
  };

  const category = getCategory();

  // Visual scaling (Normal is 1)
  const bodyWidth = imt < 18.5 ? 0.7 : imt > 30 ? 1.5 : imt > 25 ? 1.2 : 1;

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center bg-zinc-950 p-4 lg:p-8 overflow-y-auto">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Kalkulator Indeks Massa Tubuh (IMT)</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-lg mx-auto">
           Mengetahui status gizi dan proporsi berat tubuh ideal.
        </p>

        <div className="w-full max-w-3xl bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative min-h-[400px] flex flex-col md:flex-row items-center justify-center gap-12">
           
           {/* Visual Body Representation */}
           <div className="relative w-32 h-64 flex flex-col items-center justify-end">
              {/* Head */}
              <div className={`w-12 h-12 rounded-full z-20 mb-[-10px] ${category.bg} shadow-lg transition-colors`} />
              {/* Torso */}
              <div 
                 className={`h-24 rounded-3xl z-10 ${category.bg} transition-all duration-500 shadow-lg`} 
                 style={{ width: `${60 * bodyWidth}px` }} 
              />
              {/* Legs */}
              <div className="flex gap-2 -mt-4 z-0">
                 <div className={`w-4 h-20 rounded-b-full ${category.bg} transition-colors`} />
                 <div className={`w-4 h-20 rounded-b-full ${category.bg} transition-colors`} />
              </div>
           </div>

           {/* Input Controls */}
           <div className="flex-1 w-full max-w-sm space-y-8 bg-black/40 p-6 rounded-2xl border border-white/5">
              
              <div>
                 <div className="flex justify-between text-zinc-400 font-bold mb-2 uppercase text-xs">
                    <span>Tinggi Badan (cm)</span>
                    <span className="text-white">{tinggi} cm</span>
                 </div>
                 <input 
                   type="range" min="100" max="220" 
                   value={tinggi} onChange={e=>setTinggi(parseInt(e.target.value))} 
                   className="w-full accent-white" 
                 />
              </div>

              <div>
                 <div className="flex justify-between text-zinc-400 font-bold mb-2 uppercase text-xs">
                    <span>Berat Badan (kg)</span>
                    <span className="text-white">{berat} kg</span>
                 </div>
                 <input 
                   type="range" min="30" max="150" 
                   value={berat} onChange={e=>setBerat(parseInt(e.target.value))} 
                   className="w-full accent-white" 
                 />
              </div>

              <div className="pt-4 border-t border-zinc-800 text-center">
                 <div className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-1">Skor IMT / BMI</div>
                 <div className="text-5xl font-black text-white">{imt.toFixed(1)}</div>
                 <div className={`mt-2 font-bold text-lg ${category.color}`}>{category.name}</div>
              </div>

           </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Analisis Kesehatan</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="p-4 bg-zinc-900 rounded-xl border border-white/5 space-y-4 text-sm text-zinc-300 leading-relaxed">
             <p>IMT dihitung dengan membagi Berat Badan (kg) dengan kuadrat Tinggi Badan (meter).</p>
             <p className="text-[10px] text-zinc-500 italic">*Standar ini berlaku untuk orang dewasa umum, bukan untuk atlet berotot besar atau anak-anak.</p>
          </div>

          <div className="space-y-3">
             <div className={`p-3 rounded border ${imt < 18.5 ? 'bg-blue-900/30 border-blue-500' : 'bg-transparent border-zinc-800 opacity-50'}`}>
                <div className="font-bold text-blue-400 text-xs">&lt; 18.5 : Kurang Berat</div>
                {imt < 18.5 && <div className="text-[10px] text-zinc-300 mt-1">Risiko osteoporosis, anemia, dan sistem imun lemah. Perbanyak protein dan kalori sehat.</div>}
             </div>
             
             <div className={`p-3 rounded border ${imt >= 18.5 && imt <= 24.9 ? 'bg-emerald-900/30 border-emerald-500' : 'bg-transparent border-zinc-800 opacity-50'}`}>
                <div className="font-bold text-emerald-400 text-xs">18.5 - 24.9 : Normal</div>
                {imt >= 18.5 && imt <= 24.9 && <div className="text-[10px] text-zinc-300 mt-1">Sempurna! Pertahankan pola makan gizi seimbang dan olahraga teratur.</div>}
             </div>

             <div className={`p-3 rounded border ${imt >= 25.0 && imt <= 29.9 ? 'bg-amber-900/30 border-amber-500' : 'bg-transparent border-zinc-800 opacity-50'}`}>
                <div className="font-bold text-amber-400 text-xs">25.0 - 29.9 : Kelebihan</div>
                {imt >= 25.0 && imt <= 29.9 && <div className="text-[10px] text-zinc-300 mt-1">Peringatan awal. Kurangi gula dan karbohidrat olahan, tingkatkan aktivitas fisik ringan.</div>}
             </div>

             <div className={`p-3 rounded border ${imt >= 30 ? 'bg-red-900/30 border-red-500' : 'bg-transparent border-zinc-800 opacity-50'}`}>
                <div className="font-bold text-red-500 text-xs">&gt; 30.0 : Obesitas</div>
                {imt >= 30 && <div className="text-[10px] text-zinc-300 mt-1">Risiko tinggi diabetes, penyakit jantung, dan hipertensi. Perlu intervensi diet serius.</div>}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
