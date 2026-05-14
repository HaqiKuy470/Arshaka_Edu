"use client";

import { useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";

export default function MesinCarnot() {
  const [isRunning, setIsRunning] = useState(true);
  
  const [Th, setTh] = useState(600); // K (Hot reservoir)
  const [Tc, setTc] = useState(300); // K (Cold reservoir)

  // Efficiency of Carnot Engine = 1 - (Tc / Th)
  const efficiency = 1 - (Tc / Th);
  
  // Animation State (0 to 4 phases)
  // 1. Isothermal Expansion (Hot)
  // 2. Adiabatic Expansion (Cooling)
  // 3. Isothermal Compression (Cold)
  // 4. Adiabatic Compression (Heating)
  
  const [phase, setPhase] = useState(0); 

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setPhase(p => (p + 0.05) % 4); // smooth progression
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Determine current active stroke (0, 1, 2, 3)
  const stroke = Math.floor(phase);
  
  // Calculate P and V for the graph (just representative curves)
  // Let's just animate a dot around a representative P-V path
  let currentV = 0;
  let currentP = 0;
  
  if (stroke === 0) { // Iso-Expansion: V increases, P decreases slowly
    const t = phase % 1;
    currentV = 20 + t * 40; // 20 to 60
    currentP = 100 - t * 30; // 100 to 70
  } else if (stroke === 1) { // Adia-Expansion: V increases, P drops fast
    const t = phase % 1;
    currentV = 60 + t * 20; // 60 to 80
    currentP = 70 - t * 40; // 70 to 30
  } else if (stroke === 2) { // Iso-Compression: V decreases, P increases slowly
    const t = phase % 1;
    currentV = 80 - t * 40; // 80 to 40
    currentP = 30 + t * 20; // 30 to 50
  } else if (stroke === 3) { // Adia-Compression: V decreases, P spikes fast
    const t = phase % 1;
    currentV = 40 - t * 20; // 40 to 20
    currentP = 50 + t * 50; // 50 to 100
  }

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 p-6 min-h-[50vh] lg:min-h-0 gap-8">
        
        {/* Piston Animation */}
        <div className="flex items-end gap-4 h-64">
          <div className="relative w-32 h-64 border-4 border-t-0 border-white/20 rounded-b-xl flex flex-col justify-end overflow-hidden bg-zinc-900">
            {/* Piston Head */}
            <div 
              className="w-full bg-zinc-300 h-6 border-b-4 border-zinc-500 absolute transition-all" 
              style={{ bottom: `${currentV}%` }} 
            />
            {/* Heat Source Indication */}
            <div 
              className="w-full absolute bottom-0 h-4 transition-colors duration-300"
              style={{ 
                backgroundColor: stroke === 0 ? '#ef4444' : stroke === 2 ? '#3b82f6' : 'transparent',
                opacity: stroke === 0 || stroke === 2 ? 1 : 0
              }}
            />
            {/* Gas Color */}
            <div 
              className="w-full transition-all"
              style={{ 
                height: `${currentV}%`,
                backgroundColor: currentP > 60 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'
              }}
            />
          </div>

          <div className="flex flex-col gap-2 w-48 text-xs text-zinc-400">
            <div className={`p-2 rounded border ${stroke === 0 ? 'bg-red-500/20 border-red-500 text-red-400' : 'border-white/10'}`}>
              <strong>1. Ekspansi Isotermal</strong><br/>Menyerap Kalor (Qh) dari T_tinggi. Piston naik.
            </div>
            <div className={`p-2 rounded border ${stroke === 1 ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' : 'border-white/10'}`}>
              <strong>2. Ekspansi Adiabatik</strong><br/>Tanpa kalor masuk/keluar. Suhu gas turun.
            </div>
            <div className={`p-2 rounded border ${stroke === 2 ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'border-white/10'}`}>
              <strong>3. Kompresi Isotermal</strong><br/>Melepas Kalor (Qc) ke T_rendah. Piston turun.
            </div>
            <div className={`p-2 rounded border ${stroke === 3 ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'border-white/10'}`}>
              <strong>4. Kompresi Adiabatik</strong><br/>Ditekan tanpa kalor. Suhu gas naik kembali ke T_tinggi.
            </div>
          </div>
        </div>

        {/* P-V Diagram */}
        <div className="w-full max-w-[300px] h-48 bg-black/50 border border-white/10 rounded-xl relative p-4 mt-8">
          <div className="absolute text-[10px] text-zinc-500 top-2 left-2">P (Tekanan)</div>
          <div className="absolute text-[10px] text-zinc-500 bottom-2 right-2">V (Volume)</div>
          
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            {/* Axes */}
            <polyline points="0,0 0,100 100,100" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            
            {/* Carnot Cycle Outline */}
            <path d="M 20 0 Q 40 15 60 30 Q 70 50 80 70 Q 60 60 40 50 Q 30 25 20 0" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            
            {/* Live Dot */}
            <circle cx={currentV} cy={100 - currentP} r="4" fill="#22c55e" />
          </svg>
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Siklus Mesin Carnot</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <button onClick={() => setIsRunning(!isRunning)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
            {isRunning ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>}
            {isRunning ? 'Jeda Siklus' : 'Mulai Siklus'}
          </button>

          <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-center shadow-inner mt-4">
            <div className="text-xs text-emerald-400 font-bold mb-1">Efisiensi Maksimal (η)</div>
            <div className="text-4xl font-mono text-white">{(efficiency * 100).toFixed(1)}<span className="text-xl text-zinc-400">%</span></div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between"><label className="text-sm text-rose-400 font-bold">Suhu Reservoir Panas (Th)</label><span className="text-rose-400 font-mono">{Th} K</span></div>
              <input type="range" className="w-full accent-rose-500" min="400" max="1000" step="10" value={Th} onChange={(e) => {if(parseInt(e.target.value) > Tc) setTh(parseInt(e.target.value))}} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between"><label className="text-sm text-blue-400 font-bold">Suhu Reservoir Dingin (Tc)</label><span className="text-blue-400 font-mono">{Tc} K</span></div>
              <input type="range" className="w-full accent-blue-500" min="100" max="500" step="10" value={Tc} onChange={(e) => {if(parseInt(e.target.value) < Th) setTc(parseInt(e.target.value))}} />
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-2 text-xs text-zinc-400 leading-relaxed">
            <p><strong>Mesin Carnot</strong> adalah mesin kalor teoretis dengan efisiensi paling tinggi yang mungkin dicapai.</p>
            <p>Efisiensi 100% mustahil dicapai karena Suhu Dingin (Tc) tidak akan pernah mencapai 0 Kelvin (Hukum ke-3 Termodinamika).</p>
            <div className="font-mono text-white mt-2">η = 1 - (Tc / Th)</div>
          </div>

        </div>
      </div>
    </div>
  );
}
