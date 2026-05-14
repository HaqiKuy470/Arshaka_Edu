"use client";

import { useState } from "react";

export default function Semikonduktor() {
  const [bias, setBias] = useState<"forward" | "reverse">("forward");
  const [voltage, setVoltage] = useState(2); // Volts

  // Dioda P-N Junction logic
  // Forward bias: Current flows if V > 0.7V (Silicon)
  // Reverse bias: No current flows (Depletion region expands)

  const isConducting = bias === "forward" && voltage >= 0.7;
  
  // Depletion region width
  let depletionWidth = 20; // base px
  if (bias === "reverse") {
    depletionWidth = 20 + voltage * 15; // expands
  } else if (bias === "forward") {
    depletionWidth = Math.max(0, 20 - voltage * 25); // shrinks, disappears > 0.7V
  }

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 p-6 min-h-[50vh] lg:min-h-0 gap-8">
        
        {/* Circuit Diagram */}
        <div className="relative w-full max-w-xl h-64">
          
          {/* Wires */}
          <div className="absolute top-1/2 left-0 w-full h-2 bg-zinc-600 -translate-y-1/2" />
          <div className="absolute bottom-0 left-10 w-[calc(100%-80px)] h-2 bg-zinc-600" />
          <div className="absolute top-1/2 left-10 w-2 h-[calc(50%+2px)] bg-zinc-600" />
          <div className="absolute top-1/2 right-10 w-2 h-[calc(50%+2px)] bg-zinc-600" />

          {/* Battery */}
          <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 flex items-center bg-zinc-950 px-4">
            <div className={`w-16 h-8 flex ${bias === 'reverse' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className="w-1/2 h-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">+</div>
              <div className="w-1/2 h-full bg-black border-2 border-zinc-700 text-white text-[10px] font-bold flex items-center justify-center">-</div>
            </div>
            <div className="ml-4 font-mono text-zinc-300">{voltage.toFixed(1)}V</div>
          </div>

          {/* P-N Junction Diode */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center bg-zinc-950 px-2">
            
            <div className="flex border-4 border-zinc-700 h-24 w-64 relative overflow-hidden">
              
              {/* P-Type (Holes) */}
              <div className="flex-1 bg-red-500/20 relative flex flex-wrap p-2 gap-2 content-center justify-center">
                <div className="absolute top-1 left-2 text-xs font-bold text-red-400">Tipe P (Holes +)</div>
                {Array.from({length: 12}).map((_, i) => (
                   <div key={`p-${i}`} className="w-4 h-4 rounded-full border-2 border-red-500 text-red-500 flex items-center justify-center text-[8px]">+</div>
                ))}
              </div>

              {/* Depletion Region */}
              <div 
                className="h-full bg-zinc-800 transition-all duration-300 z-10 flex flex-col justify-center items-center text-[8px] text-zinc-500 text-center px-1"
                style={{ width: `${depletionWidth}px` }}
              >
                {depletionWidth > 15 && "Area Deplesi"}
              </div>

              {/* N-Type (Electrons) */}
              <div className="flex-1 bg-blue-500/20 relative flex flex-wrap p-2 gap-2 content-center justify-center">
                <div className="absolute top-1 right-2 text-xs font-bold text-blue-400">Tipe N (Elektron -)</div>
                {Array.from({length: 12}).map((_, i) => (
                   <div key={`n-${i}`} className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">-</div>
                ))}
              </div>

            </div>

          </div>

          {/* Current Flow Animation */}
          {isConducting && (
             <div className="absolute top-1/2 left-1/4 -translate-y-1/2 text-yellow-400 font-bold text-2xl animate-[slide-right_1s_infinite]">➔</div>
          )}
          {isConducting && (
             <div className="absolute top-1/2 right-1/4 -translate-y-1/2 text-yellow-400 font-bold text-2xl animate-[slide-right_1s_infinite]">➔</div>
          )}
          <style jsx>{`
            @keyframes slide-right {
              0% { transform: translate(-10px, -50%); opacity: 0; }
              50% { opacity: 1; }
              100% { transform: translate(10px, -50%); opacity: 0; }
            }
          `}</style>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Dioda Semikonduktor (P-N Junction)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className={`p-4 rounded-xl text-center border-2 transition-all ${isConducting ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-red-500/20 border-red-500/50 text-red-400'}`}>
            <div className="text-xs uppercase tracking-wider mb-1">Status Arus</div>
            <div className="text-2xl font-bold">{isConducting ? "MENGALIR" : "TERBLOKIR"}</div>
          </div>

          <div className="space-y-3 pt-4">
            <h4 className="font-bold text-sm text-zinc-300">Arah Baterai (Bias)</h4>
            <div className="flex gap-2">
              <button 
                onClick={() => setBias("forward")} 
                className={`flex-1 py-3 rounded-xl font-bold border transition-all text-xs ${bias === 'forward' ? 'bg-sky-500/20 border-sky-500/50 text-sky-400' : 'bg-transparent border-white/10 text-zinc-500 hover:bg-white/5'}`}
              >
                Forward Bias<br/>(+ ke P, - ke N)
              </button>
              <button 
                onClick={() => setBias("reverse")} 
                className={`flex-1 py-3 rounded-xl font-bold border transition-all text-xs ${bias === 'reverse' ? 'bg-orange-500/20 border-orange-500/50 text-orange-400' : 'bg-transparent border-white/10 text-zinc-500 hover:bg-white/5'}`}
              >
                Reverse Bias<br/>(- ke P, + ke N)
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <div className="flex justify-between"><label className="text-sm font-bold text-white">Tegangan (V)</label><span className="font-mono text-zinc-400">{voltage.toFixed(1)} V</span></div>
            <input 
              type="range" 
              className="w-full accent-white" 
              min="0" max="5" step="0.1" 
              value={voltage} 
              onChange={(e) => setVoltage(parseFloat(e.target.value))} 
            />
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Dioda</strong> berfungsi seperti katup satu arah untuk arus listrik.</p>
            <ul className="list-disc pl-4 space-y-2">
              <li><strong className="text-sky-400">Forward Bias:</strong> Jika V &gt; 0.7V, Area Deplesi menipis dan hilang. Elektron menyeberang dan arus mengalir.</li>
              <li><strong className="text-orange-400">Reverse Bias:</strong> Area Deplesi semakin lebar. Arus terblokir sepenuhnya.</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
