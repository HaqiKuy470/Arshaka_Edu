"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function GerakLurus() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  const [initialV, setInitialV] = useState(0);
  const [accel, setAccel] = useState(2);
  
  const [time, setTime] = useState(0);
  const [pos, setPos] = useState(0);
  const [vel, setVel] = useState(0);

  const animationRef = useRef(0);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    if (isRunning) {
      const update = (timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const dt = (timestamp - lastTimeRef.current) / 1000; // in seconds
        lastTimeRef.current = timestamp;

        setTime(t => {
          const newT = t + dt;
          
          // v = v0 + at
          const currentV = initialV + accel * newT;
          setVel(currentV);
          
          // x = v0*t + 0.5*a*t^2
          const currentPos = (initialV * newT) + (0.5 * accel * newT * newT);
          setPos(currentPos);
          
          return newT;
        });

        animationRef.current = requestAnimationFrame(update);
      };
      animationRef.current = requestAnimationFrame(update);
    } else {
      lastTimeRef.current = 0;
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, initialV, accel]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = 50; // starting x padding
      const cy = canvas.height / 2;
      const scale = 5; // px per meter

      // Draw Ground
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 2;
      ctx.moveTo(0, cy + 20);
      ctx.lineTo(canvas.width, cy + 20);
      ctx.stroke();

      // Draw Grid / Distance markers
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.font = "10px sans-serif";
      for(let i=0; i<100; i+=10) {
        const x = cx + i * scale;
        ctx.beginPath(); ctx.moveTo(x, cy + 20); ctx.lineTo(x, cy + 25); ctx.stroke();
        ctx.fillText(`${i}m`, x - 10, cy + 40);
      }

      const boxX = cx + pos * scale;

      // Draw Box
      ctx.fillStyle = "#3b82f6"; // Blue
      ctx.fillRect(boxX - 20, cy - 20, 40, 40);

      // Draw Velocity Vector
      if (Math.abs(vel) > 0) {
        ctx.beginPath();
        ctx.strokeStyle = "#22c55e"; // Green
        ctx.lineWidth = 3;
        ctx.moveTo(boxX, cy);
        const vLength = vel * 2; // visual scaling
        ctx.lineTo(boxX + vLength, cy);
        ctx.stroke();
        // Arrow head
        ctx.beginPath();
        ctx.fillStyle = "#22c55e";
        ctx.arc(boxX + vLength, cy, 4, 0, Math.PI*2);
        ctx.fill();
      }

      // Draw Acceleration Vector
      if (Math.abs(accel) > 0) {
        ctx.beginPath();
        ctx.strokeStyle = "#ef4444"; // Red
        ctx.lineWidth = 2;
        ctx.moveTo(boxX, cy - 30);
        const aLength = accel * 5; // visual scaling
        ctx.lineTo(boxX + aLength, cy - 30);
        ctx.stroke();
        ctx.beginPath();
        ctx.fillStyle = "#ef4444";
        ctx.arc(boxX + aLength, cy - 30, 3, 0, Math.PI*2);
        ctx.fill();
      }
    };

    render();
  }, [pos, vel, accel]);

  const reset = () => {
    setIsRunning(false);
    setTime(0);
    setPos(0);
    setVel(initialV);
    lastTimeRef.current = 0;
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        
        <div className="absolute top-6 left-6 right-6 flex gap-4">
          <div className="glass-card p-4 rounded-xl border border-white/10 flex-1">
            <div className="text-xs text-zinc-400">Waktu (t)</div>
            <div className="text-2xl font-mono text-white">{time.toFixed(1)} s</div>
          </div>
          <div className="glass-card p-4 rounded-xl border border-white/10 flex-1">
            <div className="text-xs text-zinc-400">Posisi (x)</div>
            <div className="text-2xl font-mono text-blue-400">{pos.toFixed(1)} m</div>
          </div>
          <div className="glass-card p-4 rounded-xl border border-white/10 flex-1">
            <div className="text-xs text-zinc-400">Kecepatan (v)</div>
            <div className="text-2xl font-mono text-green-400">{vel.toFixed(1)} m/s</div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Gerak Lurus (GLB & GLBB)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="flex gap-2">
            <button onClick={() => setIsRunning(!isRunning)} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
              {isRunning ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>}
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button onClick={reset} className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors">
              <RotateCcw className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between"><label className="text-sm text-zinc-300 font-semibold">Kecepatan Awal (v₀)</label><span className="text-green-400 font-mono">{initialV} m/s</span></div>
              <input type="range" className="w-full accent-green-500" min="-20" max="20" step="1" value={initialV} onChange={(e) => {setInitialV(parseFloat(e.target.value)); if(!isRunning && time===0) setVel(parseFloat(e.target.value));}} disabled={time > 0} />
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between"><label className="text-sm text-zinc-300 font-semibold">Percepatan (a)</label><span className="text-red-400 font-mono">{accel} m/s²</span></div>
              <input type="range" className="w-full accent-red-500" min="-10" max="10" step="1" value={accel} onChange={(e) => setAccel(parseFloat(e.target.value))} />
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-2 mt-4">
            <div className="text-xs text-zinc-500 font-mono">Rumus Kinematika:</div>
            <div className="text-sm text-white font-mono">v = v₀ + at</div>
            <div className="text-sm text-white font-mono">x = x₀ + v₀t + ½at²</div>
          </div>
        </div>
      </div>
    </div>
  );
}
