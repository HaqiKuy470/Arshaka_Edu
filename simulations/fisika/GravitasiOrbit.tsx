"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RefreshCw } from "lucide-react";

export default function GravitasiOrbit() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  const [playing, setPlaying] = useState(true);
  const [starMass, setStarMass] = useState(100); 
  const [planetMass, setPlanetMass] = useState(10);
  const [velocity, setVelocity] = useState(2.0);
  const [showPath, setShowPath] = useState(true);
  const [showForces, setShowForces] = useState(true);

  // Simulation state
  const stateRef = useRef({
    planet: { x: 200, y: 0, vx: 0, vy: velocity },
    path: [] as {x: number, y: number}[],
  });

  const resetSimulation = () => {
    stateRef.current = {
      planet: { x: 200, y: 0, vx: 0, vy: velocity },
      path: [],
    };
    if (!playing) setPlaying(true);
  };

  // Sync initial velocity when slider changes (only if it resets)
  useEffect(() => {
    stateRef.current.planet.vy = velocity;
    stateRef.current.path = [];
  }, [velocity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const G = 0.5; // Gravitational constant for simulation scale

    const render = () => {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw background stars
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      for(let i=0; i<50; i++) {
        // Pseudo-random static stars
        const sx = Math.sin(i*123) * cx + cx;
        const sy = Math.cos(i*321) * cy + cy;
        ctx.fillRect(sx, sy, 1, 1);
      }

      const p = stateRef.current.planet;

      if (playing) {
        // Calculate gravitational force
        const dx = -p.x;
        const dy = -p.y;
        const distSq = dx*dx + dy*dy;
        const dist = Math.sqrt(distSq);
        
        // F = G * m1 * m2 / r^2
        const force = (G * starMass * planetMass) / distSq;
        const ax = (force * dx / dist) / planetMass;
        const ay = (force * dy / dist) / planetMass;

        p.vx += ax;
        p.vy += ay;
        p.x += p.vx;
        p.y += p.vy;

        // Record path
        if (showPath) {
          stateRef.current.path.push({x: p.x, y: p.y});
          if (stateRef.current.path.length > 300) {
            stateRef.current.path.shift();
          }
        }
      }

      // Draw Path
      if (showPath && stateRef.current.path.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(139, 92, 246, 0.4)";
        ctx.lineWidth = 2;
        ctx.moveTo(cx + stateRef.current.path[0].x, cy + stateRef.current.path[0].y);
        for (let i = 1; i < stateRef.current.path.length; i++) {
          ctx.lineTo(cx + stateRef.current.path[i].x, cy + stateRef.current.path[i].y);
        }
        ctx.stroke();
      }

      // Draw Star (Sun)
      ctx.beginPath();
      ctx.fillStyle = "#facc15"; // Yellow
      const starRadius = 20 + (starMass / 10);
      ctx.arc(cx, cy, starRadius, 0, Math.PI * 2);
      ctx.shadowColor = "#facc15";
      ctx.shadowBlur = 40;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Planet
      ctx.beginPath();
      ctx.fillStyle = "#38bdf8"; // Light blue
      const planetRadius = 8 + (planetMass / 5);
      ctx.arc(cx + p.x, cy + p.y, planetRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw Force Vector
      if (showForces) {
        ctx.beginPath();
        ctx.strokeStyle = "#ef4444"; // Red for gravity
        ctx.lineWidth = 2;
        ctx.moveTo(cx + p.x, cy + p.y);
        
        const dx = -p.x;
        const dy = -p.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const forceLength = 50 * (starMass / 100);
        
        ctx.lineTo(cx + p.x + (dx/dist)*forceLength, cy + p.y + (dy/dist)*forceLength);
        
        // Arrow head
        const angle = Math.atan2(dy, dx);
        ctx.lineTo(cx + p.x + (dx/dist)*forceLength - 10*Math.cos(angle - Math.PI/6), cy + p.y + (dy/dist)*forceLength - 10*Math.sin(angle - Math.PI/6));
        ctx.stroke();

        // Velocity vector
        ctx.beginPath();
        ctx.strokeStyle = "#22c55e"; // Green for velocity
        ctx.moveTo(cx + p.x, cy + p.y);
        ctx.lineTo(cx + p.x + p.vx * 15, cy + p.y + p.vy * 15);
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationRef.current);
  }, [playing, starMass, planetMass, showPath, showForces]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-[#0a0a0f] min-h-[50vh] lg:min-h-0 overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-crosshair" />
        
        {/* HUD */}
        <div className="absolute top-6 left-6 glass-card px-4 py-3 rounded-xl border border-white/10 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs text-zinc-300">Gaya Gravitasi</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-zinc-300">Kecepatan Vektor</span>
          </div>
        </div>

        <button 
          onClick={() => setPlaying(!playing)}
          className="absolute bottom-6 left-6 w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all z-20 hover:scale-105"
        >
          {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </button>
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10">
          <h3 className="font-semibold text-white">Mekanika Orbital</h3>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-300">Massa Bintang</label>
              <span className="text-xs text-yellow-400 font-mono">{starMass}x</span>
            </div>
            <input 
              type="range" 
              className="w-full accent-yellow-500" 
              min="10" max="300" step="10" 
              value={starMass}
              onChange={(e) => setStarMass(parseFloat(e.target.value))}
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-300">Massa Planet</label>
              <span className="text-xs text-sky-400 font-mono">{planetMass}x</span>
            </div>
            <input 
              type="range" 
              className="w-full accent-sky-500" 
              min="1" max="50" step="1" 
              value={planetMass}
              onChange={(e) => setPlanetMass(parseFloat(e.target.value))}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-300">Kecepatan Awal</label>
              <span className="text-xs text-green-400 font-mono">{velocity.toFixed(1)}</span>
            </div>
            <input 
              type="range" 
              className="w-full accent-green-500" 
              min="0.5" max="5.0" step="0.1" 
              value={velocity}
              onChange={(e) => setVelocity(parseFloat(e.target.value))}
            />
            <p className="text-[10px] text-zinc-500">Mengubah kecepatan awal akan me-reset orbit.</p>
          </div>

          <div className="space-y-4 pt-6 border-t border-white/10">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={showPath}
                  onChange={(e) => setShowPath(e.target.checked)}
                />
                <div className="w-10 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
              </div>
              <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">Tampilkan Jejak Orbit</span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={showForces}
                  onChange={(e) => setShowForces(e.target.checked)}
                />
                <div className="w-10 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500"></div>
              </div>
              <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">Tampilkan Vektor Gaya</span>
            </label>
          </div>
        </div>
        
        <div className="p-4 border-t border-white/10 bg-black/20">
          <button 
            onClick={resetSimulation}
            className="w-full py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Reset Posisi
          </button>
        </div>
      </div>
    </div>
  );
}
