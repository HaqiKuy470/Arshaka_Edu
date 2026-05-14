"use client";

import { useState } from "react";

export default function TekananHidrostatis() {
  const [depth, setDepth] = useState(5); // meters
  const [density, setDensity] = useState(1000); // kg/m^3 (Water default)

  const g = 9.8;
  // P = P_atm + rho * g * h. Let's just calculate the hydrostatic pressure
  const pressure = density * g * depth; 
  // Convert to kPa for easier reading
  const pressureKPa = pressure / 1000;

  // Atmosphere pressure = 101.325 kPa
  const totalPressureKPa = pressureKPa + 101.325;

  // Visual scale
  const visualDepth = depth * 30; // pixels

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 p-6 min-h-[50vh] lg:min-h-0">
        
        {/* Pool / Container */}
        <div className="w-80 h-[400px] border-4 border-t-0 border-white/20 rounded-b-xl relative overflow-hidden bg-zinc-900">
          
          {/* Liquid */}
          <div 
            className="absolute bottom-0 w-full transition-all duration-300" 
            style={{ 
              height: '350px', 
              backgroundColor: density > 1100 ? '#10b981' : density < 900 ? '#f59e0b' : '#3b82f6',
              opacity: 0.6 
            }} 
          />

          {/* Liquid surface wave decoration */}
          <div className="absolute w-full h-4 border-t border-white/30" style={{ top: '50px' }} />

          {/* Depth Gauge / Sensor */}
          <div 
            className="absolute left-1/2 -ml-2 w-4 bg-zinc-500 rounded-full transition-all duration-300 z-10"
            style={{ top: '0', height: `${50 + visualDepth}px` }}
          >
            {/* Sensor Head */}
            <div className="absolute -bottom-4 -left-3 w-10 h-10 bg-red-500 rounded-full border-4 border-white flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.8)]">
              <div className="w-2 h-2 bg-white rounded-full animate-ping" />
            </div>
          </div>

          {/* Ruler */}
          <div className="absolute right-0 top-[50px] bottom-0 w-8 border-l border-white/20 flex flex-col justify-between py-2 items-center text-[10px] text-zinc-500">
            <span>0m</span>
            <span>2m</span>
            <span>4m</span>
            <span>6m</span>
            <span>8m</span>
            <span>10m</span>
          </div>
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Tekanan Hidrostatis</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="bg-sky-500/10 border border-sky-500/30 p-4 rounded-xl text-center shadow-inner">
            <div className="text-xs text-sky-400 font-bold mb-1">Tekanan Hidrostatis (P_h)</div>
            <div className="text-3xl font-mono text-white">{pressureKPa.toFixed(1)} <span className="text-lg text-zinc-400">kPa</span></div>
          </div>

          <div className="bg-zinc-800 p-3 rounded-xl text-center">
            <div className="text-xs text-zinc-400 mb-1">Total Tekanan (+ Atmosfer)</div>
            <div className="text-xl font-mono text-white">{totalPressureKPa.toFixed(1)} kPa</div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between"><label className="text-sm text-zinc-300 font-bold">Kedalaman (h)</label><span className="text-white font-mono">{depth.toFixed(1)} m</span></div>
              <input type="range" className="w-full accent-white" min="0" max="10" step="0.5" value={depth} onChange={(e) => setDepth(parseFloat(e.target.value))} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between"><label className="text-sm text-zinc-300 font-bold">Massa Jenis Cairan (ρ)</label><span className="text-white font-mono">{density} kg/m³</span></div>
              <input type="range" className="w-full accent-blue-500" min="700" max="1300" step="50" value={density} onChange={(e) => setDensity(parseInt(e.target.value))} />
              <div className="text-[10px] text-zinc-500 flex justify-between">
                <span>Bensin (700)</span>
                <span>Air (1000)</span>
                <span>Madu (1300)</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Tekanan zat cair bertambah besar jika kedalaman bertambah. Rumus: <br/>
            <strong className="text-white">P = ρ × g × h</strong>
          </p>

        </div>
      </div>
    </div>
  );
}
