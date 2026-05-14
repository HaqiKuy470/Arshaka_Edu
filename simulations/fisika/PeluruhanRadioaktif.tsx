"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function PeluruhanRadioaktif() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  const [halfLife, setHalfLife] = useState(5); // seconds
  const totalParticles = 400;

  // 0 = Undecayed (Red), 1 = Decayed (Blue)
  const particlesRef = useRef<{x: number, y: number, state: number}[]>([]);
  const timeRef = useRef(0);
  const [undecayedCount, setUndecayedCount] = useState(totalParticles);

  useEffect(() => {
    // Init particles
    reset();
  }, []);

  const reset = () => {
    setIsRunning(false);
    timeRef.current = 0;
    const newParticles = [];
    for(let i=0; i<totalParticles; i++) {
      newParticles.push({
        x: Math.random() * 280 + 10,
        y: Math.random() * 180 + 10,
        state: 0
      });
    }
    particlesRef.current = newParticles;
    setUndecayedCount(totalParticles);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let lastTime = performance.now();

    const render = (timeNow: number) => {
      const dt = (timeNow - lastTime) / 1000; // seconds
      lastTime = timeNow;

      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isRunning) {
        timeRef.current += dt;

        // Probability of decay in dt: P = lambda * dt
        // lambda = ln(2) / T_half
        const lambda = 0.693 / halfLife;
        const pDecay = lambda * dt;

        let uCount = 0;
        particlesRef.current.forEach(p => {
          if (p.state === 0) {
            if (Math.random() < pDecay) {
              p.state = 1; // Decayed
            } else {
              uCount++;
            }
          }
        });
        setUndecayedCount(uCount);
      }

      // Draw Particles
      particlesRef.current.forEach(p => {
        ctx.beginPath();
        // small jitter for alive ones
        const jitterX = p.state === 0 ? (Math.random()-0.5)*2 : 0;
        const jitterY = p.state === 0 ? (Math.random()-0.5)*2 : 0;
        
        ctx.arc(p.x + jitterX, p.y + jitterY, 4, 0, Math.PI*2);
        ctx.fillStyle = p.state === 0 ? "#ef4444" : "#3b82f6"; // Red to Blue
        ctx.fill();
      });

      // Draw Graph line historical (approx curve)
      // N(t) = N0 * e^(-lambda * t)
      const gx = 20;
      const gy = canvas.height - 40;
      const gw = canvas.width - 40;
      const gh = 60;

      ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx+gw, gy); ctx.moveTo(gx, gy); ctx.lineTo(gx, gy-gh); ctx.stroke();

      ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 2;
      ctx.beginPath();
      for(let x=0; x<gw; x++) {
        // x represents time axis from 0 to 3 half lives
        const tScale = (x / gw) * (halfLife * 3);
        const y = totalParticles * Math.exp(-(0.693/halfLife) * tScale);
        const plotY = gy - (y/totalParticles)*gh;
        if (x===0) ctx.moveTo(gx+x, plotY); else ctx.lineTo(gx+x, plotY);
      }
      ctx.stroke();

      // Draw current time marker on graph
      const currX = gx + (timeRef.current / (halfLife * 3)) * gw;
      if (currX <= gx+gw) {
        ctx.fillStyle = "white"; ctx.beginPath(); ctx.arc(currX, gy - (undecayedCount/totalParticles)*gh, 4, 0, Math.PI*2); ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [isRunning, halfLife]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Peluruhan Radioaktif</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="flex gap-2">
            <button onClick={() => setIsRunning(!isRunning)} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
              <Play className="w-4 h-4"/> {isRunning ? 'Jeda' : 'Mulai'}
            </button>
            <button onClick={reset} className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors">
              <RotateCcw className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center mt-4">
            <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl">
              <div className="text-[10px] text-red-400 font-bold mb-1">Inti Induk (Belum Luruh)</div>
              <div className="text-2xl font-mono text-white">{undecayedCount}</div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-xl">
              <div className="text-[10px] text-blue-400 font-bold mb-1">Inti Anak (Sudah Luruh)</div>
              <div className="text-2xl font-mono text-white">{totalParticles - undecayedCount}</div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-zinc-300 font-bold">Waktu Paruh (T½)</label>
                <span className="text-zinc-300 font-mono">{halfLife} detik</span>
              </div>
              <input 
                type="range" className="w-full accent-white" 
                min="1" max="20" step="1" 
                value={halfLife} onChange={(e) => {setHalfLife(parseInt(e.target.value)); reset();}} 
              />
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Waktu Paruh</strong> adalah waktu yang dibutuhkan agar separuh dari jumlah inti atom radioaktif awal meluruh menjadi atom yang lebih stabil.</p>
            <div className="font-mono text-center text-white mt-2 border border-zinc-700 rounded p-2 bg-zinc-900">
              N(t) = N₀ · (½)^(t/T½)
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
