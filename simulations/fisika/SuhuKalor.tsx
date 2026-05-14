"use client";

import { useState } from "react";

export default function SuhuKalor() {
  // Asas Black: Q_lepas = Q_terima
  // m1 * c1 * (T1 - Tc) = m2 * c2 * (Tc - T2)
  // Tc = (m1*c1*T1 + m2*c2*T2) / (m1*c1 + m2*c2)
  
  const [m1, setM1] = useState(100); // mass of hot water (grams)
  const [t1, setT1] = useState(90);  // temp of hot water (Celsius)
  
  const [m2, setM2] = useState(100); // mass of cold water (grams)
  const [t2, setT2] = useState(20);  // temp of cold water (Celsius)

  // Specific heat of water c1 = c2 = 1. So they cancel out.
  const tCampuran = (m1 * t1 + m2 * t2) / (m1 + m2);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 p-6 min-h-[50vh] lg:min-h-0">
        
        {/* Visual Mixing */}
        <div className="flex items-end gap-12 w-full max-w-2xl justify-center">
          
          {/* Hot Water Beaker */}
          <div className="relative w-24 h-40 border-4 border-t-0 border-white/20 rounded-b-xl overflow-hidden flex flex-col justify-end">
            <div 
              className="w-full bg-rose-500 transition-all duration-300 opacity-80" 
              style={{ height: `${(m1 / 500) * 100}%` }} 
            />
            <div className="absolute inset-0 flex items-center justify-center text-rose-200 font-bold drop-shadow-md">
              {t1}°C
            </div>
            {/* Steam animation */}
            <div className="absolute -top-10 left-1/2 -ml-2 text-rose-500/50 animate-pulse font-bold text-2xl">♨</div>
          </div>

          <div className="text-4xl text-white/50 mb-10">+</div>

          {/* Cold Water Beaker */}
          <div className="relative w-24 h-40 border-4 border-t-0 border-white/20 rounded-b-xl overflow-hidden flex flex-col justify-end">
            <div 
              className="w-full bg-blue-500 transition-all duration-300 opacity-80" 
              style={{ height: `${(m2 / 500) * 100}%` }} 
            />
            <div className="absolute inset-0 flex items-center justify-center text-blue-200 font-bold drop-shadow-md">
              {t2}°C
            </div>
          </div>

          <div className="text-4xl text-white/50 mb-10">=</div>

          {/* Mixed Water Beaker */}
          <div className="relative w-32 h-48 border-4 border-t-0 border-white/20 rounded-b-xl overflow-hidden flex flex-col justify-end shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <div 
              className="w-full transition-all duration-500 opacity-90" 
              style={{ 
                height: `${((m1+m2) / 1000) * 100}%`,
                // interpolate color from blue to red based on temperature
                backgroundColor: `rgb(${Math.floor((tCampuran / 100) * 255)}, 100, ${Math.floor((1 - tCampuran / 100) * 255)})`
              }} 
            />
            <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold drop-shadow-md">
              {tCampuran.toFixed(1)}°C
            </div>
          </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Suhu & Kalor (Asas Black)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-4 bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl">
            <h4 className="font-bold text-rose-400">Air Panas</h4>
            <div>
              <div className="flex justify-between text-xs text-zinc-300 mb-1"><span>Massa (m₁)</span><span>{m1} g</span></div>
              <input type="range" className="w-full accent-rose-500" min="50" max="500" step="10" value={m1} onChange={(e) => setM1(parseInt(e.target.value))} />
            </div>
            <div>
              <div className="flex justify-between text-xs text-zinc-300 mb-1"><span>Suhu (T₁)</span><span>{t1}°C</span></div>
              <input type="range" className="w-full accent-rose-500" min="50" max="100" step="1" value={t1} onChange={(e) => setT1(parseInt(e.target.value))} />
            </div>
          </div>

          <div className="space-y-4 bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl">
            <h4 className="font-bold text-blue-400">Air Dingin</h4>
            <div>
              <div className="flex justify-between text-xs text-zinc-300 mb-1"><span>Massa (m₂)</span><span>{m2} g</span></div>
              <input type="range" className="w-full accent-blue-500" min="50" max="500" step="10" value={m2} onChange={(e) => setM2(parseInt(e.target.value))} />
            </div>
            <div>
              <div className="flex justify-between text-xs text-zinc-300 mb-1"><span>Suhu (T₂)</span><span>{t2}°C</span></div>
              <input type="range" className="w-full accent-blue-500" min="0" max="40" step="1" value={t2} onChange={(e) => setT2(parseInt(e.target.value))} />
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-2 text-xs text-zinc-400 leading-relaxed">
            <p><strong>Asas Black:</strong> Kalor yang dilepas oleh benda panas sama dengan kalor yang diserap benda dingin (Q_lepas = Q_terima).</p>
            <div className="font-mono text-white mt-2">m₁·c·(T₁ - Tc) = m₂·c·(Tc - T₂)</div>
          </div>

        </div>
      </div>
    </div>
  );
}
