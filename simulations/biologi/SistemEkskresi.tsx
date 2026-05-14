"use client";

import { useState } from "react";

export default function SistemEkskresi() {
  const [fluidLevel, setFluidLevel] = useState(50); // Blood water volume
  const [toxinLevel, setToxinLevel] = useState(80); // Toxins in blood

  // Kidney logic
  const filterToxins = () => {
    setToxinLevel(prev => Math.max(0, prev - 20));
    setFluidLevel(prev => Math.max(10, prev - 5)); // Filtering uses some water (urine)
  };

  const drinkWater = () => {
    setFluidLevel(prev => Math.min(100, prev + 20));
  };

  // Urine color based on hydration (fluidLevel)
  const getUrineColor = () => {
    if (fluidLevel > 80) return "bg-yellow-100"; // Clear
    if (fluidLevel > 40) return "bg-yellow-300"; // Normal
    return "bg-amber-600"; // Dehydrated (Dark)
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        {/* Kidney Visual */}
        <div className="relative w-64 h-96 flex flex-col items-center">
           
           {/* Blood Vessels entering Kidney */}
           <div className="flex gap-4 mb-2 z-0">
             <div className="w-4 h-24 bg-red-500" /> {/* Renal Artery */}
             <div className="w-4 h-24 bg-blue-500" /> {/* Renal Vein */}
           </div>

           {/* The Kidney Shape */}
           <div className="w-48 h-64 bg-rose-800 rounded-[100px] border-4 border-rose-900 flex items-center justify-center relative shadow-2xl z-10">
              
              {/* Internal Medulla pyramids */}
              <div className="absolute left-6 top-10 w-10 h-10 bg-rose-700 rotate-45 rounded-sm" />
              <div className="absolute left-6 top-24 w-10 h-10 bg-rose-700 rotate-45 rounded-sm" />
              <div className="absolute left-6 top-38 w-10 h-10 bg-rose-700 rotate-45 rounded-sm" />

              <div className="text-white font-bold opacity-50 uppercase tracking-widest absolute right-4 rotate-90">Ginjal</div>
           </div>

           {/* Ureter (Tube to Bladder) */}
           <div className="w-6 h-32 bg-amber-100/50 absolute bottom-[-50px] right-20 z-0">
              {/* Urine flowing animation block */}
              <div className={`w-full transition-all duration-1000 ${getUrineColor()}`} style={{ height: `${(100-fluidLevel) * 0.5}%`, marginTop: 'auto' }} />
           </div>

           {/* Bladder (Kandung Kemih) */}
           <div className="w-32 h-24 bg-rose-300/30 rounded-full absolute bottom-[-130px] right-6 border-2 border-rose-300/50 overflow-hidden">
              {/* Urine filling */}
              <div className={`absolute bottom-0 w-full transition-all duration-1000 ${getUrineColor()}`} style={{ height: `${100 - fluidLevel}%` }} />
           </div>
           
        </div>

        {/* Dashboard Panels */}
        <div className="absolute top-8 left-8 flex flex-col gap-4">
           {/* Blood Toxins */}
           <div className="bg-black/50 border border-white/10 p-4 rounded-xl w-48">
             <div className="text-xs font-bold text-zinc-400 mb-2 uppercase">Kadar Racun (Urea)</div>
             <div className="w-full h-4 bg-zinc-800 rounded-full overflow-hidden">
               <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${toxinLevel}%` }} />
             </div>
             <div className="text-right text-xs mt-1 text-white font-mono">{toxinLevel}%</div>
           </div>

           {/* Hydration */}
           <div className="bg-black/50 border border-white/10 p-4 rounded-xl w-48">
             <div className="text-xs font-bold text-zinc-400 mb-2 uppercase">Level Hidrasi Tubuh</div>
             <div className="w-full h-4 bg-zinc-800 rounded-full overflow-hidden">
               <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${fluidLevel}%` }} />
             </div>
             <div className="text-right text-xs mt-1 text-white font-mono">{fluidLevel}%</div>
           </div>
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Sistem Ekskresi (Ginjal)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-3">
             <button onClick={filterToxins} className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                ⚙️ Ginjal Menyaring Darah
             </button>
             
             <button onClick={drinkWater} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                💧 Minum Air (Hidrasi)
             </button>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Ginjal</strong> berfungsi membuang zat sisa metabolisme (seperti Urea/Urine) dari dalam darah.</p>
            <p>Di dalam ginjal terdapat jutaan unit penyaring bernama <strong>Nefron</strong>.</p>
            <hr className="border-white/10"/>
            <p className="text-amber-400 font-bold">Analisis Warna Urine:</p>
            <ul className="space-y-1">
               <li><span className="inline-block w-3 h-3 bg-yellow-100 border border-black rounded-full mr-2"/> Jernih: Sangat terhidrasi.</li>
               <li><span className="inline-block w-3 h-3 bg-yellow-300 border border-black rounded-full mr-2"/> Kuning Muda: Normal sehat.</li>
               <li><span className="inline-block w-3 h-3 bg-amber-600 border border-black rounded-full mr-2"/> Kuning Tua / Coklat: Dehidrasi berat! Ginjal menghemat air.</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
