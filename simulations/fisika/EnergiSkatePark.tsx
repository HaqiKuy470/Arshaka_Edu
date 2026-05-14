"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";

export default function EnergiSkatePark() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  const [mass, setMass] = useState(60); // kg
  
  // Simulation physics
  const g = 9.8;
  const [theta, setTheta] = useState(-Math.PI / 4); // Starting angle on the half-pipe
  const [omega, setOmega] = useState(0); // Angular velocity
  
  const radius = 150; // Ramp radius for visual and physics math
  const animationRef = useRef(0);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    if (isRunning) {
      const update = (timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05); // cap dt
        lastTimeRef.current = timestamp;

        // Pendulum-like motion for the half-pipe
        // a = -(g/R) * sin(theta)
        const alpha = -(g / (radius/100)) * Math.sin(theta); // scale radius for realistic speed
        
        setOmega(w => w + alpha * dt);
        setTheta(t => t + omega * dt);

        animationRef.current = requestAnimationFrame(update);
      };
      animationRef.current = requestAnimationFrame(update);
    } else {
      lastTimeRef.current = 0;
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, theta, omega]);

  // Calculate Energies
  const height = radius * (1 - Math.cos(theta)); // from bottom = 0
  const PE = mass * g * (height / 100); // scaled height
  const v = Math.abs(omega * (radius/100)); // v = omega * r
  const KE = 0.5 * mass * v * v;
  const TE = PE + KE;

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
      const cy = canvas.height / 2 - 50; // pivot point

      // Draw Track (Half pipe)
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI, false);
      ctx.strokeStyle = "#94a3b8"; // slate-400
      ctx.lineWidth = 10;
      ctx.stroke();

      // Skater position
      // theta = 0 is straight down (Math.PI/2 in canvas terms)
      const drawAngle = Math.PI/2 + theta;
      const px = cx + Math.cos(drawAngle) * radius;
      const py = cy + Math.sin(drawAngle) * radius;

      // Draw Skater
      ctx.beginPath();
      ctx.arc(px, py - 15, 15, 0, Math.PI*2);
      ctx.fillStyle = "#ef4444"; // red
      ctx.fill();
      
      // Draw Skateboard
      ctx.fillStyle = "#f59e0b"; // amber
      ctx.fillRect(px - 15, py, 30, 5);

    };
    render();
  }, [theta]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 p-6 min-h-[50vh] lg:min-h-0">
        
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        
        {/* Bar Charts for Energy */}
        <div className="absolute bottom-6 left-6 right-6 lg:left-12 lg:right-auto flex items-end gap-6 h-48 glass-card p-6 rounded-2xl border border-white/10">
          
          <div className="flex flex-col items-center justify-end h-full w-16">
            <div className="w-full bg-blue-500 transition-all duration-75 rounded-t-sm" style={{ height: `${Math.min(100, (KE / TE) * 100)}%` }} />
            <div className="text-[10px] text-zinc-400 mt-2 font-bold text-center">Kinetik</div>
            <div className="text-xs text-white font-mono">{KE.toFixed(0)}J</div>
          </div>

          <div className="flex flex-col items-center justify-end h-full w-16">
            <div className="w-full bg-green-500 transition-all duration-75 rounded-t-sm" style={{ height: `${Math.min(100, (PE / TE) * 100)}%` }} />
            <div className="text-[10px] text-zinc-400 mt-2 font-bold text-center">Potensial</div>
            <div className="text-xs text-white font-mono">{PE.toFixed(0)}J</div>
          </div>

          <div className="flex flex-col items-center justify-end h-full w-16 border-l border-white/20 pl-6 ml-2">
            <div className="w-full bg-yellow-500 transition-all duration-75 rounded-t-sm" style={{ height: '100%' }} />
            <div className="text-[10px] text-zinc-400 mt-2 font-bold text-center">Total</div>
            <div className="text-xs text-white font-mono">{TE.toFixed(0)}J</div>
          </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Hukum Kekekalan Energi Mekanik</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <button onClick={() => setIsRunning(!isRunning)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
            {isRunning ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>}
            {isRunning ? 'Pause Simulasi' : 'Lanjut Simulasi'}
          </button>

          <div className="space-y-2 pt-4">
            <div className="flex justify-between"><label className="text-sm text-zinc-300 font-bold">Massa Skater (m)</label><span className="text-white font-mono">{mass} kg</span></div>
            <input type="range" className="w-full accent-white" min="20" max="100" step="5" value={mass} onChange={(e) => setMass(parseInt(e.target.value))} />
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-2 text-xs text-zinc-400 mt-4 leading-relaxed">
            <p><strong className="text-green-400">Energi Potensial (EP)</strong> paling besar saat skater berada di posisi tertinggi (diam sejenak sebelum turun).</p>
            <p><strong className="text-blue-400">Energi Kinetik (EK)</strong> paling besar saat skater meluncur cepat di titik terbawah lintasan.</p>
            <p className="mt-2 text-yellow-400">Total Energi selalu tetap konstan (Em = EP + EK).</p>
          </div>

        </div>
      </div>
    </div>
  );
}
