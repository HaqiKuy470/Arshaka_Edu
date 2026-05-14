"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";

export default function GerakMelingkar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  const [radius, setRadius] = useState(100); // meters (scaled for display)
  const [velocity, setVelocity] = useState(20); // tangential velocity
  
  const [angle, setAngle] = useState(0);
  const animationRef = useRef(0);
  const lastTimeRef = useRef(0);

  // a_c = v^2 / r
  const centripetalAcc = (velocity * velocity) / radius;

  useEffect(() => {
    if (isRunning) {
      const update = (timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const dt = (timestamp - lastTimeRef.current) / 1000;
        lastTimeRef.current = timestamp;

        setAngle(a => {
          // angular velocity omega = v / r
          const omega = velocity / radius;
          return (a + omega * dt) % (Math.PI * 2);
        });

        animationRef.current = requestAnimationFrame(update);
      };
      animationRef.current = requestAnimationFrame(update);
    } else {
      lastTimeRef.current = 0;
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, velocity, radius]);

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
      const visualRadius = radius * 1.5;

      // Draw Orbit Path
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.arc(cx, cy, visualRadius, 0, Math.PI*2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Center Pivot
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI*2);
      ctx.fillStyle = "white";
      ctx.fill();

      // Object position
      const px = cx + Math.cos(angle) * visualRadius;
      const py = cy + Math.sin(angle) * visualRadius;

      // String connecting center to object
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 2;
      ctx.moveTo(cx, cy);
      ctx.lineTo(px, py);
      ctx.stroke();

      // Draw Object
      ctx.beginPath();
      ctx.arc(px, py, 15, 0, Math.PI*2);
      ctx.fillStyle = "#3b82f6"; // Blue
      ctx.fill();

      // Draw Velocity Vector (Tangential)
      const vLength = velocity * 3;
      const vx = px - Math.sin(angle) * vLength;
      const vy = py + Math.cos(angle) * vLength;
      
      ctx.beginPath();
      ctx.strokeStyle = "#22c55e"; // Green
      ctx.lineWidth = 3;
      ctx.moveTo(px, py);
      ctx.lineTo(vx, vy);
      ctx.stroke();
      // Arrow head for V
      ctx.beginPath();
      ctx.fillStyle = "#22c55e";
      ctx.arc(vx, vy, 4, 0, Math.PI*2);
      ctx.fill();

      // Draw Centripetal Acceleration Vector (Inward)
      const aLength = centripetalAcc * 2;
      const ax = px - Math.cos(angle) * aLength;
      const ay = py - Math.sin(angle) * aLength;

      ctx.beginPath();
      ctx.strokeStyle = "#ef4444"; // Red
      ctx.lineWidth = 3;
      ctx.moveTo(px, py);
      ctx.lineTo(ax, ay);
      ctx.stroke();
      // Arrow head for A
      ctx.beginPath();
      ctx.fillStyle = "#ef4444";
      ctx.arc(ax, ay, 4, 0, Math.PI*2);
      ctx.fill();

    };

    render();
  }, [radius, velocity, angle, centripetalAcc]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Gerak Melingkar Beraturan</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <button onClick={() => setIsRunning(!isRunning)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
            {isRunning ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>}
            {isRunning ? 'Jeda Simulasi' : 'Mulai Simulasi'}
          </button>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between"><label className="text-sm text-green-400 font-bold">Kecepatan Tangensial (v)</label><span className="text-green-400 font-mono">{velocity} m/s</span></div>
              <input type="range" className="w-full accent-green-500" min="5" max="50" step="1" value={velocity} onChange={(e) => setVelocity(parseInt(e.target.value))} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between"><label className="text-sm text-zinc-300 font-bold">Jari-jari (r)</label><span className="text-white font-mono">{radius} m</span></div>
              <input type="range" className="w-full accent-white" min="50" max="200" step="10" value={radius} onChange={(e) => setRadius(parseInt(e.target.value))} />
            </div>
          </div>

          <div className="bg-black/30 p-4 rounded-xl border border-white/5 space-y-4 mt-4">
            <div>
              <div className="text-xs text-red-400 font-bold mb-1">Percepatan Sentripetal (a_c)</div>
              <div className="text-2xl font-mono text-red-400">{centripetalAcc.toFixed(1)} m/s²</div>
              <div className="text-[10px] text-zinc-500 mt-1">Rumus: a = v² / r</div>
            </div>
            
            <div className="w-full h-px bg-white/10" />

            <div className="text-xs text-zinc-400 leading-relaxed">
              <span className="text-green-400 font-bold">Panah Hijau</span>: Vektor kecepatan selalu menyinggung lintasan bundar (tangensial).<br/><br/>
              <span className="text-red-400 font-bold">Panah Merah</span>: Vektor percepatan sentripetal selalu mengarah ke pusat putaran.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
