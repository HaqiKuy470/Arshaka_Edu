"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";

export default function BandulSederhana() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  const [length, setLength] = useState(1); // meters
  const [gravity, setGravity] = useState(9.8); // m/s^2 (Earth)
  
  const [theta, setTheta] = useState(Math.PI / 4); // Initial angle 45 deg
  const [omega, setOmega] = useState(0);
  
  const animationRef = useRef(0);
  const lastTimeRef = useRef(0);

  // Period formula T = 2 * PI * sqrt(L/g)
  const period = 2 * Math.PI * Math.sqrt(length / gravity);

  useEffect(() => {
    if (isRunning) {
      const update = (timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
        lastTimeRef.current = timestamp;

        // Pendulum equation: alpha = -(g/L) * sin(theta)
        const alpha = -(gravity / length) * Math.sin(theta);
        
        setOmega(w => w + alpha * dt);
        setTheta(t => t + omega * dt);

        animationRef.current = requestAnimationFrame(update);
      };
      animationRef.current = requestAnimationFrame(update);
    } else {
      lastTimeRef.current = 0;
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, theta, omega, length, gravity]);

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
      const cy = 50; // Pivot at top
      const visualScale = 150; // pixels per meter
      const visualLength = length * visualScale;

      // Draw Pivot
      ctx.beginPath();
      ctx.fillStyle = "#52525b"; // zinc-600
      ctx.fillRect(cx - 30, cy - 10, 60, 10);
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI*2);
      ctx.fillStyle = "white";
      ctx.fill();

      // Draw equilibrium dashed line
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.setLineDash([5, 5]);
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx, cy + 300);
      ctx.stroke();
      ctx.setLineDash([]);

      const px = cx + Math.sin(theta) * visualLength;
      const py = cy + Math.cos(theta) * visualLength;

      // Draw String
      ctx.beginPath();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.moveTo(cx, cy);
      ctx.lineTo(px, py);
      ctx.stroke();

      // Draw Bob
      ctx.beginPath();
      ctx.arc(px, py, 20, 0, Math.PI*2);
      ctx.fillStyle = "#f59e0b"; // amber-500
      ctx.fill();
    };

    render();
  }, [theta, length]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Bandul Sederhana</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <button onClick={() => setIsRunning(!isRunning)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
            {isRunning ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>}
            {isRunning ? 'Jeda Simulasi' : 'Mulai Simulasi'}
          </button>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between"><label className="text-sm text-sky-400 font-bold">Panjang Tali (L)</label><span className="text-sky-400 font-mono">{length.toFixed(1)} m</span></div>
              <input type="range" className="w-full accent-sky-500" min="0.5" max="2.0" step="0.1" value={length} onChange={(e) => setLength(parseFloat(e.target.value))} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between"><label className="text-sm text-rose-400 font-bold">Gravitasi (g)</label><span className="text-rose-400 font-mono">{gravity.toFixed(1)} m/s²</span></div>
              <input type="range" className="w-full accent-rose-500" min="1.6" max="20" step="0.1" value={gravity} onChange={(e) => setGravity(parseFloat(e.target.value))} />
              <div className="text-[10px] text-zinc-500 flex justify-between">
                <span>Bulan (1.6)</span>
                <span>Bumi (9.8)</span>
                <span>Jupiter (24)</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl mt-4 text-center">
            <div className="text-xs text-emerald-400 font-bold mb-1">Periode Ayunan (T)</div>
            <div className="text-3xl font-mono text-white">{period.toFixed(2)} s</div>
            <p className="text-[10px] text-zinc-400 mt-2">Waktu untuk 1 kali ayunan bolak-balik.</p>
          </div>

          <p className="text-xs text-zinc-500">Periode bandul hanya dipengaruhi oleh Panjang Tali dan Gravitasi. Massa beban tidak memengaruhi cepat lambatnya ayunan.</p>

        </div>
      </div>
    </div>
  );
}
