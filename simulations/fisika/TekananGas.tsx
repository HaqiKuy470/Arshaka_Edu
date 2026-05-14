"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";

export default function TekananGas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  const [volume, setVolume] = useState(100); // % (box size)
  const [temperature, setTemperature] = useState(300); // Kelvin
  
  // N = number of particles, R = constant. 
  // P = (N * T) / V
  const pressure = (50 * temperature) / volume; 

  const numParticles = 50;
  const particlesRef = useRef(
    Array.from({ length: numParticles }).map(() => ({
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
    }))
  );

  const animationRef = useRef(0);

  useEffect(() => {
    if (isRunning) {
      const update = () => {
        // Base speed multiplier off temperature
        // kinetic energy ~ T, so v ~ sqrt(T)
        const speedMult = Math.sqrt(temperature / 300) * 2;
        
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Container bounds
        const boxWidth = (volume / 100) * 300;
        const boxHeight = (volume / 100) * 300;
        const halfW = boxWidth / 2;
        const halfH = boxHeight / 2;

        particlesRef.current.forEach(p => {
          p.x += p.vx * speedMult;
          p.y += p.vy * speedMult;

          // Bounce off walls
          if (p.x > halfW) { p.x = halfW; p.vx *= -1; }
          if (p.x < -halfW) { p.x = -halfW; p.vx *= -1; }
          if (p.y > halfH) { p.y = halfH; p.vy *= -1; }
          if (p.y < -halfH) { p.y = -halfH; p.vy *= -1; }
        });

        animationRef.current = requestAnimationFrame(update);
      };
      animationRef.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, temperature, volume]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      const boxWidth = (volume / 100) * 300;
      const boxHeight = (volume / 100) * 300;

      // Draw Container
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 4;
      ctx.fillStyle = "rgba(239, 68, 68, 0.05)";
      ctx.fillRect(cx - boxWidth/2, cy - boxHeight/2, boxWidth, boxHeight);
      ctx.strokeRect(cx - boxWidth/2, cy - boxHeight/2, boxWidth, boxHeight);

      // Draw Particles
      ctx.fillStyle = "#38bdf8"; // sky-400
      particlesRef.current.forEach(p => {
        // Double check bounds just in case volume changed drastically
        if (p.x > boxWidth/2) p.x = boxWidth/2;
        if (p.x < -boxWidth/2) p.x = -boxWidth/2;
        if (p.y > boxHeight/2) p.y = boxHeight/2;
        if (p.y < -boxHeight/2) p.y = -boxHeight/2;

        ctx.beginPath();
        ctx.arc(cx + p.x, cy + p.y, 4, 0, Math.PI*2);
        ctx.fill();
      });

    };

    if (isRunning) {
      let rAF = 0;
      const loop = () => {
        render();
        rAF = requestAnimationFrame(loop);
      }
      loop();
      return () => cancelAnimationFrame(rAF);
    } else {
      render();
    }
  }, [volume, isRunning]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Teori Kinetik Gas (Gas Ideal)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <button onClick={() => setIsRunning(!isRunning)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
            {isRunning ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>}
            {isRunning ? 'Jeda Simulasi' : 'Jalankan Simulasi'}
          </button>

          <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl text-center shadow-inner">
            <div className="text-xs text-rose-400 font-bold mb-1">Tekanan Gas (P)</div>
            <div className="text-3xl font-mono text-white">{pressure.toFixed(1)} <span className="text-lg text-zinc-400">atm</span></div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between"><label className="text-sm text-zinc-300 font-bold">Volume Wadah (V)</label><span className="text-white font-mono">{volume}%</span></div>
              <input type="range" className="w-full accent-white" min="30" max="100" step="5" value={volume} onChange={(e) => setVolume(parseInt(e.target.value))} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between"><label className="text-sm text-yellow-400 font-bold">Suhu (T)</label><span className="text-yellow-400 font-mono">{temperature} K</span></div>
              <input type="range" className="w-full accent-yellow-500" min="100" max="1000" step="50" value={temperature} onChange={(e) => setTemperature(parseInt(e.target.value))} />
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-2 text-xs text-zinc-400">
            <p><strong>Hukum Gas Ideal (PV = nRT):</strong></p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Jika Volume (V) diperkecil, partikel lebih sering menabrak dinding → Tekanan (P) <span className="text-rose-400">Naik</span>.</li>
              <li>Jika Suhu (T) dinaikkan, partikel bergerak lebih cepat → Tekanan (P) <span className="text-rose-400">Naik</span>.</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
