"use client";

import { useState } from "react";

export default function HukumGasIdeal() {
  const [law, setLaw] = useState<"boyle" | "charles" | "gay-lussac">("boyle");
  
  // Boyle: P x V = k (T konstan) -> P = k/V
  // Charles: V / T = k (P konstan) -> V = k*T
  // Gay-Lussac: P / T = k (V konstan) -> P = k*T

  const [sliderVal, setSliderVal] = useState(50); // 10 to 100

  // Derived values based on chosen law
  let P = 1;
  let V = 1;
  let T = 1;

  if (law === "boyle") {
    // T is constant. We control V via slider. P = 100 / V
    T = 300; // constant
    V = sliderVal; 
    P = 1000 / V; // inverse
  } else if (law === "charles") {
    // P is constant. We control T via slider. V = T / 10
    P = 1; // constant
    T = sliderVal * 4; // 40 to 400 K
    V = T / 4; 
  } else if (law === "gay-lussac") {
    // V is constant. We control T via slider. P = T / 100
    V = 50; // constant
    T = sliderVal * 4;
    P = T / 50;
  }

  // Generate chart data points
  const generateGraphPaths = () => {
    let points = [];
    if (law === "boyle") {
      // P vs V curve (inverse)
      for (let v = 10; v <= 100; v += 5) {
        let p = 1000 / v;
        points.push(`${v * 2},${150 - (p * 5)}`); // scale for SVG
      }
    } else if (law === "charles") {
      // V vs T straight line
      for (let t = 40; t <= 400; t += 20) {
        let v = t / 4;
        points.push(`${(t/4) * 2},${150 - (v)}`);
      }
    } else if (law === "gay-lussac") {
      // P vs T straight line
      for (let t = 40; t <= 400; t += 20) {
        let p = t / 50;
        points.push(`${(t/4) * 2},${150 - (p * 10)}`);
      }
    }
    return points.join(" ");
  };

  // Current dot position on graph
  let currentDot = { cx: 0, cy: 0 };
  if (law === "boyle") currentDot = { cx: V * 2, cy: 150 - (P * 5) };
  if (law === "charles") currentDot = { cx: (T/4) * 2, cy: 150 - (V) };
  if (law === "gay-lussac") currentDot = { cx: (T/4) * 2, cy: 150 - (P * 10) };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 p-6 min-h-[50vh] lg:min-h-0 gap-8">
        
        {/* Animated Container (Piston) */}
        <div className="relative w-48 h-64 border-4 border-t-0 border-white/20 rounded-b-xl flex flex-col justify-end bg-zinc-900 overflow-hidden">
          {/* Piston head */}
          <div 
            className="w-full bg-zinc-400 border-b-4 border-zinc-600 absolute transition-all duration-300 z-10" 
            style={{ 
              height: '20px', 
              top: `${100 - V}%`, 
              transform: 'translateY(-100%)' 
            }} 
          />
          {/* Piston rod */}
          <div 
            className="w-4 bg-zinc-500 absolute left-1/2 -ml-2 transition-all duration-300 z-0" 
            style={{ 
              bottom: `${V}%`, 
              top: '-100px' 
            }} 
          />

          {/* Gas Area */}
          <div 
            className="w-full transition-all duration-300 relative flex flex-col justify-end" 
            style={{ 
              height: `${V}%`, 
              backgroundColor: `rgba(239, 68, 68, ${Math.min(1, P / 15)})` // Red gets darker if pressure is high
            }}
          >
            {/* Visual Temperature (Fire) */}
            {T > 100 && (
              <div className="absolute -bottom-8 left-0 w-full flex justify-center text-rose-500/50">
                <span className="text-4xl animate-pulse">♨</span>
              </div>
            )}
            {/* Visual pressure indicators inside */}
            {P > 5 && (
              <div className="absolute inset-0 flex items-center justify-center text-white/20 font-bold text-2xl animate-bounce">
                ↑↑ P ↑↑
              </div>
            )}
          </div>
        </div>

        {/* Graph SVG */}
        <div className="w-full max-w-[300px] h-48 bg-zinc-900 border border-white/10 rounded-xl relative p-4">
          <div className="absolute text-[10px] text-zinc-500 top-2 left-2">
            {law === "boyle" ? "P (Tekanan)" : law === "charles" ? "V (Volume)" : "P (Tekanan)"}
          </div>
          <div className="absolute text-[10px] text-zinc-500 bottom-2 right-2">
            {law === "boyle" ? "V (Volume)" : "T (Suhu)"}
          </div>
          <svg viewBox="0 0 200 150" className="w-full h-full overflow-visible">
            {/* Axes */}
            <polyline points="0,0 0,150 200,150" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
            {/* Graph Line */}
            <polyline points={generateGraphPaths()} fill="none" stroke="#38bdf8" strokeWidth="3" />
            {/* Current State Dot */}
            <circle cx={currentDot.cx} cy={currentDot.cy} r="6" fill="#ef4444" className="transition-all duration-300" />
            
            {/* Helper lines */}
            <line x1={currentDot.cx} y1="150" x2={currentDot.cx} y2={currentDot.cy} stroke="rgba(239,68,68,0.5)" strokeDasharray="4" className="transition-all duration-300" />
            <line x1="0" y1={currentDot.cy} x2={currentDot.cx} y2={currentDot.cy} stroke="rgba(239,68,68,0.5)" strokeDasharray="4" className="transition-all duration-300" />
          </svg>
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Hukum Gas Ideal</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-zinc-300">Pilih Hukum Termodinamika</h4>
            <div className="flex flex-col gap-2">
              <button onClick={() => {setLaw("boyle"); setSliderVal(50);}} className={`py-2 rounded border text-sm ${law === 'boyle' ? 'bg-sky-500/20 border-sky-500/50 text-sky-400' : 'border-white/10 text-zinc-400 hover:bg-white/5'}`}>Hukum Boyle (Suhu Konstan)</button>
              <button onClick={() => {setLaw("charles"); setSliderVal(50);}} className={`py-2 rounded border text-sm ${law === 'charles' ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' : 'border-white/10 text-zinc-400 hover:bg-white/5'}`}>Hukum Charles (Tekanan Konstan)</button>
              <button onClick={() => {setLaw("gay-lussac"); setSliderVal(50);}} className={`py-2 rounded border text-sm ${law === 'gay-lussac' ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 'border-white/10 text-zinc-400 hover:bg-white/5'}`}>Hukum Gay-Lussac (Vol Konstan)</button>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-zinc-300 font-bold">
                  {law === "boyle" ? "Ubah Volume (V)" : "Ubah Suhu (T)"}
                </label>
              </div>
              <input type="range" className="w-full accent-white" min="10" max="100" step="1" value={sliderVal} onChange={(e) => setSliderVal(parseInt(e.target.value))} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            <div className={`p-2 rounded-xl border ${law === 'charles' || law === 'gay-lussac' ? 'bg-zinc-800 border-zinc-700 text-zinc-500' : 'bg-red-500/10 border-red-500/30'}`}>
              <div className="text-[10px]">Tekanan (P)</div>
              <div className="font-mono font-bold text-red-400">{P.toFixed(1)}</div>
            </div>
            <div className={`p-2 rounded-xl border ${law === 'gay-lussac' ? 'bg-zinc-800 border-zinc-700 text-zinc-500' : 'bg-blue-500/10 border-blue-500/30'}`}>
              <div className="text-[10px]">Volume (V)</div>
              <div className="font-mono font-bold text-blue-400">{V.toFixed(0)}</div>
            </div>
            <div className={`p-2 rounded-xl border ${law === 'boyle' ? 'bg-zinc-800 border-zinc-700 text-zinc-500' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
              <div className="text-[10px]">Suhu (T)</div>
              <div className="font-mono font-bold text-yellow-400">{T.toFixed(0)}</div>
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-2 text-xs text-zinc-400 leading-relaxed">
            {law === "boyle" && <p><strong>Hukum Boyle (Isotermal):</strong> Jika Suhu tetap, Tekanan berbanding terbalik dengan Volume. <br/> (P₁V₁ = P₂V₂)</p>}
            {law === "charles" && <p><strong>Hukum Charles (Isobarik):</strong> Jika Tekanan tetap, Volume berbanding lurus dengan Suhu Mutlak. <br/> (V₁/T₁ = V₂/T₂)</p>}
            {law === "gay-lussac" && <p><strong>Hukum Gay-Lussac (Isokhorik):</strong> Jika Volume tetap, Tekanan berbanding lurus dengan Suhu Mutlak. <br/> (P₁/T₁ = P₂/T₂)</p>}
          </div>

        </div>
      </div>
    </div>
  );
}
