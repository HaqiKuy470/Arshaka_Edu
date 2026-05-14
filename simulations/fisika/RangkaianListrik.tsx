"use client";

import { useState } from "react";
import { Zap, Power } from "lucide-react";

export default function RangkaianListrik() {
  const [voltage, setVoltage] = useState(9);
  const [resistance, setResistance] = useState(10);
  const [closed, setClosed] = useState(false);

  const current = closed ? (voltage / resistance).toFixed(2) : "0.00";
  const power = closed ? ((voltage * voltage) / resistance).toFixed(1) : "0.0";
  
  // Bulb brightness opacity
  const brightness = closed ? Math.min(1, (voltage * voltage / resistance) / 20) : 0;

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <div className="relative w-full max-w-md aspect-video border-4 border-zinc-600 rounded-xl flex items-center justify-center mt-12">
          {/* Top Wire */}
          <div className="absolute top-0 w-full h-1 bg-amber-500 -mt-1" />
          {/* Bottom Wire */}
          <div className="absolute bottom-0 w-full h-1 bg-amber-500 -mb-1" />
          {/* Left Wire */}
          <div className="absolute left-0 h-full w-1 bg-amber-500 -ml-1" />
          {/* Right Wire */}
          <div className="absolute right-0 h-full w-1 bg-amber-500 -mr-1" />

          {/* Battery Component */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center bg-zinc-950 p-2">
            <div className="w-8 h-16 border-2 border-white flex flex-col rounded-sm overflow-hidden bg-zinc-800">
              <div className="h-1/4 bg-yellow-500 flex items-center justify-center text-black font-bold text-xs">+</div>
              <div className="flex-1 text-center mt-1 text-xs">{voltage}V</div>
              <div className="h-1/4 bg-zinc-700 flex items-center justify-center text-white font-bold text-xs">-</div>
            </div>
          </div>

          {/* Switch Component */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-zinc-950 px-4">
            <button 
              onClick={() => setClosed(!closed)}
              className={`w-16 h-8 rounded-full flex items-center px-1 transition-colors ${closed ? 'bg-green-500' : 'bg-red-500'}`}
            >
              <div className={`w-6 h-6 rounded-full bg-white transition-transform ${closed ? 'translate-x-8' : ''}`} />
            </button>
            <div className="text-center mt-2 text-xs text-zinc-400">Saklar</div>
          </div>

          {/* Lightbulb Component */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-zinc-950 p-4">
            <div className="relative w-16 h-20 flex flex-col items-center">
              {/* Glow */}
              <div 
                className="absolute top-0 w-24 h-24 rounded-full bg-yellow-300 blur-xl transition-opacity duration-300"
                style={{ opacity: brightness }}
              />
              <div className="w-12 h-12 rounded-full border-2 border-white/30 z-10 bg-white/5 flex items-center justify-center">
                <Zap className={`w-6 h-6 ${closed ? 'text-yellow-400' : 'text-zinc-600'}`} />
              </div>
              <div className="w-6 h-6 bg-zinc-400 rounded-b-md z-10" />
            </div>
            <div className="text-center mt-2 text-xs text-zinc-400">{resistance} Ω</div>
          </div>
        </div>

        <div className="mt-16 flex gap-8">
          <div className="glass-card px-6 py-4 rounded-xl text-center border border-white/10">
            <div className="text-zinc-400 text-sm mb-1">Arus (I)</div>
            <div className="text-3xl font-bold text-sky-400 font-mono">{current} A</div>
          </div>
          <div className="glass-card px-6 py-4 rounded-xl text-center border border-white/10">
            <div className="text-zinc-400 text-sm mb-1">Daya (P)</div>
            <div className="text-3xl font-bold text-yellow-400 font-mono">{power} W</div>
          </div>
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Hukum Ohm</h3></div>
        <div className="p-4 flex-1 overflow-y-auto space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between"><label className="text-sm text-zinc-300">Tegangan (V)</label><span className="text-green-400">{voltage} Volt</span></div>
            <input type="range" className="w-full accent-green-500" min="0" max="24" step="1" value={voltage} onChange={(e) => setVoltage(parseInt(e.target.value))} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between"><label className="text-sm text-zinc-300">Hambatan (R)</label><span className="text-red-400">{resistance} Ohm</span></div>
            <input type="range" className="w-full accent-red-500" min="1" max="100" value={resistance} onChange={(e) => setResistance(parseInt(e.target.value))} />
          </div>
        </div>
      </div>
    </div>
  );
}
