"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";

export default function Resonansi() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  const [drivingFreq, setDrivingFreq] = useState(2.0); // Hz
  const naturalFreq = 2.0; // Natural frequency of the system
  
  const [damping, setDamping] = useState(0.05);

  const timeRef = useRef(0);
  const posRef = useRef(0);
  const velRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = 50; // top attachment point
      const dt = 0.05;

      if (isRunning) {
        timeRef.current += dt;
        
        // Equation of motion for driven harmonic oscillator:
        // m*x'' + c*x' + k*x = F0 * cos(wd * t)
        // Assume m=1. Then wn^2 = k.  c = damping.
        const k = naturalFreq * naturalFreq * (2 * Math.PI) * (2 * Math.PI);
        const wd = drivingFreq * (2 * Math.PI);
        const F0 = 500; // Driving force amplitude

        const acceleration = F0 * Math.cos(wd * timeRef.current) - k * posRef.current - damping * 100 * velRef.current;
        
        velRef.current += acceleration * dt;
        posRef.current += velRef.current * dt;
      }

      // Draw Support
      ctx.fillStyle = "#52525b"; // zinc-600
      ctx.fillRect(cx - 50, cy - 20, 100, 20);

      const massY = cy + 150 + posRef.current;

      // Draw Spring
      ctx.strokeStyle = "#a1a1aa"; // zinc-400
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      
      const numCoils = 15;
      const springLength = massY - cy - 20;
      const coilSpacing = springLength / numCoils;
      
      for(let i=1; i<=numCoils; i++) {
        const xOffset = i % 2 === 0 ? 20 : -20;
        ctx.lineTo(cx + xOffset, cy + i * coilSpacing);
      }
      ctx.lineTo(cx, massY - 20);
      ctx.stroke();

      // Draw Mass
      ctx.fillStyle = "#f43f5e"; // rose-500
      ctx.beginPath();
      ctx.arc(cx, massY, 30, 0, Math.PI*2);
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "white"; ctx.font = "bold 14px sans-serif"; ctx.textAlign="center"; ctx.fillText("m", cx, massY + 5);

      // Driving Force indicator
      const driveY = Math.cos(drivingFreq * 2 * Math.PI * timeRef.current) * 20;
      ctx.fillStyle = "#3b82f6"; // blue
      ctx.beginPath();
      ctx.moveTo(cx - 40, cy - 10 + driveY);
      ctx.lineTo(cx - 30, cy - 15 + driveY);
      ctx.lineTo(cx - 30, cy - 5 + driveY);
      ctx.fill();
      ctx.fillText("F", cx - 45, cy - 5 + driveY);

      // Amplitude Bar (Max observed amplitude visual)
      const absPos = Math.abs(posRef.current);
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.fillRect(cx + 60, cy, 10, 300);
      ctx.fillStyle = absPos > 100 ? "#ef4444" : "#22c55e";
      const barH = Math.min(300, absPos * 2);
      ctx.fillRect(cx + 60, cy + 150 - barH/2, 10, barH);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [isRunning, drivingFreq, damping, naturalFreq]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Resonansi</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <button onClick={() => setIsRunning(!isRunning)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
            {isRunning ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>}
            {isRunning ? 'Jeda' : 'Jalankan'}
          </button>

          <div className="space-y-4 pt-4 border-t border-white/10">
            
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-center">
              <div className="text-[10px] text-emerald-400 font-bold mb-1">Frekuensi Alami (f₀)</div>
              <div className="font-mono font-bold text-white text-xl">{naturalFreq.toFixed(1)} Hz</div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <label className="text-sm text-sky-400 font-bold">Frekuensi Penggetar (f)</label>
                <span className="text-sky-400 font-mono">{drivingFreq.toFixed(1)} Hz</span>
              </div>
              <input 
                type="range" 
                className="w-full accent-sky-500" 
                min="0.5" max="4.0" step="0.1" 
                value={drivingFreq} 
                onChange={(e) => setDrivingFreq(parseFloat(e.target.value))} 
              />
              <p className="text-[10px] text-zinc-500">Frekuensi gaya eksternal yang mendorong pegas.</p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <label className="text-sm text-amber-400 font-bold">Redaman (Damping)</label>
              </div>
              <input 
                type="range" 
                className="w-full accent-amber-500" 
                min="0.01" max="0.5" step="0.01" 
                value={damping} 
                onChange={(e) => setDamping(parseFloat(e.target.value))} 
              />
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Resonansi</strong> terjadi ketika frekuensi gaya dari luar (f) sama dengan frekuensi alami benda (f₀).</p>
            <p className="text-rose-400 font-bold">Cobalah atur Frekuensi Penggetar menjadi 2.0 Hz! Amplitudo (simpangan) akan melonjak sangat tinggi karena energi terserap secara maksimal.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
