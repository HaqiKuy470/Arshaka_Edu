"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RefreshCw, Undo } from "lucide-react";

interface ProjectileData {
  x: number;
  y: number;
  t: number;
}

export default function GerakProyektil() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  const [velocity, setVelocity] = useState(20); // m/s
  const [angle, setAngle] = useState(45); // degrees
  const [gravity, setGravity] = useState(9.8); // m/s^2
  
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [path, setPath] = useState<ProjectileData[]>([]);
  const [maxStats, setMaxStats] = useState({ height: 0, distance: 0 });

  const resetSimulation = () => {
    setPlaying(false);
    setTime(0);
    setPath([]);
    setMaxStats({ height: 0, distance: 0 });
  };

  const fireProjectile = () => {
    resetSimulation();
    setPlaying(true);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Scale: 1 meter = 10 pixels
      const SCALE = 10;
      const originX = 50;
      const originY = canvas.height - 50;

      // Draw Grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      for (let x = originX; x <= canvas.width; x += SCALE * 5) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = originY; y >= 0; y -= SCALE * 5) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Draw Axes
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(originX, 0);
      ctx.lineTo(originX, canvas.height);
      ctx.moveTo(0, originY);
      ctx.lineTo(canvas.width, originY);
      ctx.stroke();

      // Physics logic
      let currentX = 0;
      let currentY = 0;

      if (playing) {
        setTime(t => t + 0.05); // time step
        
        // Equations of motion
        const theta = (angle * Math.PI) / 180;
        currentX = velocity * Math.cos(theta) * time;
        currentY = (velocity * Math.sin(theta) * time) - (0.5 * gravity * time * time);

        if (currentY >= 0) {
          setPath(p => [...p, { x: currentX, y: currentY, t: time }]);
          setMaxStats({
            height: Math.max(maxStats.height, currentY),
            distance: currentX
          });
        } else {
          // Hit the ground
          currentY = 0;
          setPlaying(false);
        }
      }

      // Draw Path
      if (path.length > 0) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(236, 72, 153, 0.5)"; // Pink dashed
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 2;
        ctx.moveTo(originX + path[0].x * SCALE, originY - path[0].y * SCALE);
        for (let i = 1; i < path.length; i++) {
          ctx.lineTo(originX + path[i].x * SCALE, originY - path[i].y * SCALE);
        }
        if (playing) {
          ctx.lineTo(originX + currentX * SCALE, originY - currentY * SCALE);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw Projectile
      const projX = playing ? currentX : (path.length > 0 ? path[path.length - 1].x : 0);
      const projY = playing ? currentY : (path.length > 0 ? path[path.length - 1].y : 0);

      ctx.beginPath();
      ctx.fillStyle = "#6366f1"; // Indigo
      ctx.arc(originX + projX * SCALE, originY - projY * SCALE, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw Cannon (Launcher)
      ctx.save();
      ctx.translate(originX, originY);
      ctx.rotate(-(angle * Math.PI) / 180);
      ctx.fillStyle = "#a1a1aa";
      ctx.fillRect(0, -10, 40, 20);
      ctx.fillStyle = "#3f3f46";
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationRef.current);
  }, [playing, time, angle, velocity, gravity, path, maxStats]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-crosshair" />
        
        {/* HUD Data */}
        <div className="absolute top-6 right-6 glass-card p-4 rounded-xl border border-white/10 min-w-[200px]">
          <h4 className="text-sm font-bold text-indigo-400 mb-2 uppercase tracking-wider">Telemetri</h4>
          <div className="space-y-1 text-sm text-zinc-300 font-mono">
            <div className="flex justify-between"><span>Waktu:</span> <span>{time.toFixed(2)} s</span></div>
            <div className="flex justify-between"><span>Jarak Maks:</span> <span>{maxStats.distance.toFixed(1)} m</span></div>
            <div className="flex justify-between"><span>Tinggi Maks:</span> <span>{maxStats.height.toFixed(1)} m</span></div>
          </div>
        </div>

        <button 
          onClick={playing ? () => setPlaying(false) : fireProjectile}
          className={`absolute bottom-6 left-6 w-16 h-16 rounded-full text-white flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all z-20 hover:scale-105 ${playing ? 'bg-pink-600 hover:bg-pink-500' : 'bg-indigo-600 hover:bg-indigo-500'}`}
        >
          {playing ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
        </button>
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10">
          <h3 className="font-semibold text-white">Parameter Tembakan</h3>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-300">Kecepatan Awal</label>
              <span className="text-xs text-indigo-400 font-mono">{velocity} m/s</span>
            </div>
            <input 
              type="range" 
              className="w-full accent-indigo-500" 
              min="0" max="50" step="1" 
              value={velocity}
              onChange={(e) => { setVelocity(parseFloat(e.target.value)); resetSimulation(); }}
              disabled={playing}
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-300">Sudut Tembak</label>
              <span className="text-xs text-pink-400 font-mono">{angle}°</span>
            </div>
            <input 
              type="range" 
              className="w-full accent-pink-500" 
              min="0" max="90" step="1" 
              value={angle}
              onChange={(e) => { setAngle(parseFloat(e.target.value)); resetSimulation(); }}
              disabled={playing}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-300">Gravitasi</label>
              <span className="text-xs text-emerald-400 font-mono">{gravity.toFixed(1)} m/s²</span>
            </div>
            <input 
              type="range" 
              className="w-full accent-emerald-500" 
              min="1" max="25" step="0.1" 
              value={gravity}
              onChange={(e) => { setGravity(parseFloat(e.target.value)); resetSimulation(); }}
              disabled={playing}
            />
            <div className="flex gap-2 text-xs">
              <button onClick={() => {setGravity(9.8); resetSimulation();}} className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-zinc-400 border border-white/10">Bumi (9.8)</button>
              <button onClick={() => {setGravity(1.6); resetSimulation();}} className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-zinc-400 border border-white/10">Bulan (1.6)</button>
              <button onClick={() => {setGravity(24.8); resetSimulation();}} className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-zinc-400 border border-white/10">Jupiter (24.8)</button>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-white/10 bg-black/20 flex gap-3">
          <button 
            onClick={fireProjectile}
            disabled={playing}
            className="flex-1 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-current" /> Tembak
          </button>
          <button 
            onClick={resetSimulation}
            className="py-2.5 px-4 bg-zinc-800 text-white font-semibold rounded-lg hover:bg-zinc-700 transition-colors border border-white/10 tooltip-trigger"
            title="Reset"
          >
            <Undo className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
