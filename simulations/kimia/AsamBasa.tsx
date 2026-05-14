"use client";

import { useState } from "react";
import { Droplet } from "lucide-react";

export default function AsamBasa() {
  const [acidDrops, setAcidDrops] = useState(0);
  const [baseDrops, setBaseDrops] = useState(0);

  // Simple pH calculation
  // Neutral is 7. Each acid drop lowers pH, each base drop raises pH.
  const netDrops = baseDrops - acidDrops;
  
  // Map netDrops (-10 to 10) to pH (0 to 14) roughly
  const ph = Math.max(0, Math.min(14, 7 + netDrops * 0.7)).toFixed(1);
  const numPh = parseFloat(ph);

  // Background color based on pH
  let bgColor = "from-green-900 to-emerald-950"; // Neutral
  let liquidColor = "bg-green-500/40";
  if (numPh < 6.5) {
    bgColor = "from-red-900 to-rose-950"; // Acid
    liquidColor = "bg-red-500/40";
  } else if (numPh > 7.5) {
    bgColor = "from-blue-900 to-indigo-950"; // Base
    liquidColor = "bg-blue-500/40";
  }

  const reset = () => { setAcidDrops(0); setBaseDrops(0); };

  return (
    <div className={`flex flex-col lg:flex-row flex-1 overflow-hidden relative bg-gradient-to-br ${bgColor} transition-colors duration-1000`}>
      <div className="flex-1 relative flex flex-col items-center justify-center p-8">
        
        {/* pH Meter */}
        <div className="absolute top-8 left-8 glass-card p-4 rounded-2xl flex items-center gap-4">
          <div className="text-zinc-400 font-medium">pH</div>
          <div className="text-4xl font-bold font-mono text-white">{ph}</div>
        </div>

        {/* Beaker */}
        <div className="relative w-64 h-80 border-4 border-t-0 border-white/30 rounded-b-3xl flex items-end justify-center overflow-hidden glass shadow-2xl">
          <div className={`absolute bottom-0 w-full h-3/4 ${liquidColor} transition-colors duration-1000 border-t border-white/20 relative`}>
            {/* Liquid surface wave */}
            <div className="absolute top-0 w-full h-4 bg-white/10 rounded-full -mt-2"></div>
            
            {/* Bubbles */}
            {Array.from({ length: 10 }).map((_, i) => (
              <div 
                key={i} 
                className="absolute bg-white/20 rounded-full animate-float"
                style={{
                  width: Math.random() * 10 + 5 + 'px',
                  height: Math.random() * 10 + 5 + 'px',
                  left: Math.random() * 100 + '%',
                  bottom: Math.random() * 100 + '%',
                  animationDuration: (Math.random() * 3 + 2) + 's',
                  animationDelay: Math.random() * 2 + 's'
                }}
              />
            ))}
          </div>
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Titrasi & pH</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-8">
          
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={() => setAcidDrops(a => a + 1)}
              className="w-full py-4 bg-red-600 hover:bg-red-500 rounded-xl flex items-center justify-center gap-2 font-bold transition-all active:scale-95"
            >
              <Droplet className="w-5 h-5 fill-current" /> Tambah Asam (H⁺)
            </button>
            <div className="text-zinc-400 text-sm">{acidDrops} tetes ditambahkan</div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={() => setBaseDrops(b => b + 1)}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center justify-center gap-2 font-bold transition-all active:scale-95"
            >
              <Droplet className="w-5 h-5 fill-current" /> Tambah Basa (OH⁻)
            </button>
            <div className="text-zinc-400 text-sm">{baseDrops} tetes ditambahkan</div>
          </div>

          <div className="pt-8 border-t border-white/10">
            <h4 className="text-sm font-medium text-zinc-300 mb-4">Skala pH</h4>
            <div className="h-4 w-full rounded-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500 relative">
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-2 h-6 bg-white border border-black transition-all duration-1000"
                style={{ left: `${(numPh / 14) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-zinc-400 mt-2">
              <span>0 (Asam)</span>
              <span>7 (Netral)</span>
              <span>14 (Basa)</span>
            </div>
          </div>

        </div>
        <div className="p-4 border-t border-white/10 bg-black/20">
          <button onClick={reset} className="w-full py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200">Kosongkan Wadah</button>
        </div>
      </div>
    </div>
  );
}
