"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Info, Settings2, Weight, Move, Zap, Waves , ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function GayaGesek() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  const [mass, setMass] = useState(10); // kg
  const [appliedForce, setAppliedForce] = useState(60); // N
  const [muStatic, setMuStatic] = useState(0.5); 
  const [muKinetic, setMuKinetic] = useState(0.3); 

  const [time, setTime] = useState(0);
  const [pos, setPos] = useState(0);
  const [vel, setVel] = useState(0);

  const animationRef = useRef(0);
  const lastTimeRef = useRef(0);

  const g = 9.8;
  const normalForce = mass * g;
  const maxStaticFriction = muStatic * normalForce;
  const kineticFriction = muKinetic * normalForce;

  useEffect(() => {
    if (isRunning) {
      const update = (timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const dt = (timestamp - lastTimeRef.current) / 1000;
        lastTimeRef.current = timestamp;

        setVel(v => {
          let friction = 0;
          let netF = 0;
          
          if (Math.abs(v) < 0.01) {
            // Check if static friction is overcome
            if (Math.abs(appliedForce) > maxStaticFriction) {
              friction = Math.sign(appliedForce) * kineticFriction;
              netF = appliedForce - friction;
            } else {
              netF = 0;
              setVel(0);
            }
          } else {
            // Kinetic friction
            friction = Math.sign(v) * kineticFriction;
            netF = appliedForce - friction;
            
            // Deceleration logic if appliedForce is small
            if (Math.sign(appliedForce - friction) !== Math.sign(v) && Math.abs(v) < 0.1) {
                // Stop the box if it's very slow and net force opposes motion
            }
          }

          const accel = netF / mass;
          const newV = v + accel * dt;
          
          // Friction should not make it move backwards if it's just stopping
          if (Math.sign(v) !== Math.sign(newV) && Math.abs(appliedForce) < kineticFriction) {
             return 0;
          }

          return newV;
        });

        setPos(p => {
          // Wrap around or just let it go
          return p + vel * dt;
        });

        setTime(t => t + dt);
        animationRef.current = requestAnimationFrame(update);
      };
      animationRef.current = requestAnimationFrame(update);
    } else {
      lastTimeRef.current = 0;
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, appliedForce, mass, muStatic, muKinetic, vel, maxStaticFriction, kineticFriction]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cy = canvas.height * 0.7;
      const scale = 20; // px per meter

      // --- Draw Surface ---
      const surfaceY = cy;
      ctx.fillStyle = "#27272a"; // zinc-800
      ctx.fillRect(0, surfaceY, canvas.width, 300);
      
      // Surface Texture (Roughness based on mu)
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      for(let i=0; i<canvas.width; i+= (10 / (muStatic + 0.1))) {
         ctx.beginPath();
         ctx.moveTo(i, surfaceY);
         ctx.lineTo(i - 5, surfaceY + 10);
         ctx.stroke();
      }

      // --- Draw Crate ---
      const boxSize = 60 + mass; 
      const cx = canvas.width / 2;
      // We'll move the crate relative to the center or keep it at pos?
      // Let's keep box at relative screen center if it goes too far, 
      // but for simplicity let's just move it.
      const visualX = (cx + pos * scale) % (canvas.width + 200) - 100;
      const visualY = surfaceY - boxSize;

      // Shadow
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fillRect(visualX + 5, surfaceY - 5, boxSize, 10);

      // Crate Body
      const gradient = ctx.createLinearGradient(visualX, visualY, visualX + boxSize, visualY + boxSize);
      gradient.addColorStop(0, "#b45309"); // amber-700
      gradient.addColorStop(1, "#78350f"); // amber-900
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(visualX, visualY, boxSize, boxSize, 4);
      ctx.fill();
      
      // Crate Planks
      ctx.strokeStyle = "rgba(0,0,0,0.2)";
      ctx.lineWidth = 2;
      ctx.strokeRect(visualX + 5, visualY + 5, boxSize - 10, boxSize - 10);
      ctx.beginPath();
      ctx.moveTo(visualX, visualY); ctx.lineTo(visualX + boxSize, visualY + boxSize);
      ctx.moveTo(visualX + boxSize, visualY); ctx.lineTo(visualX, visualY + boxSize);
      ctx.stroke();

      // Mass Label
      ctx.fillStyle = "white";
      ctx.font = "bold 14px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${mass} kg`, visualX + boxSize/2, visualY + boxSize/2 + 5);

      // --- Draw Forces ---
      const frictionVal = Math.abs(vel) > 0.01 ? kineticFriction : Math.min(Math.abs(appliedForce), maxStaticFriction);
      const actualFriction = Math.sign(appliedForce || vel) * -frictionVal;

      const drawForce = (force: number, color: string, label: string, yOff: number) => {
        if (Math.abs(force) < 1) return;
        const startX = visualX + boxSize/2;
        const startY = visualY + boxSize/2 + yOff;
        const len = force * 1.5;
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + len, startY);
        ctx.stroke();

        // Arrow head
        ctx.fillStyle = color;
        const dir = Math.sign(force);
        ctx.beginPath();
        ctx.moveTo(startX + len, startY);
        ctx.lineTo(startX + len - dir*10, startY - 6);
        ctx.lineTo(startX + len - dir*10, startY + 6);
        ctx.fill();

        ctx.font = "bold 11px monospace";
        ctx.fillText(`${label}: ${Math.abs(force).toFixed(1)}N`, startX + len/2, startY - 10);
      };

      // Push Force (Cyan)
      drawForce(appliedForce, "#06b6d4", "F Dorong", -20);
      // Friction Force (Red)
      drawForce(actualFriction, "#f43f5e", "f Gesek", 20);

    };

    render();
    window.addEventListener("resize", render);
    return () => window.removeEventListener("resize", render);
  }, [pos, mass, appliedForce, muStatic, muKinetic, vel, maxStaticFriction, kineticFriction]);

  const reset = () => {
    setIsRunning(false);
    setTime(0);
    setPos(0);
    setVel(0);
    lastTimeRef.current = 0;
  };

  return (
    <div ref={containerRef} className="fixed inset-0 bg-zinc-950 flex flex-col overflow-hidden font-sans select-none">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      {/* Physics Insight */}
      <div className="absolute top-20 right-8 w-80 glass-card p-5 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl z-20 pointer-events-none bg-black/40">
        <div className="flex items-center gap-2 mb-2">
           <ShieldAlert className="w-4 h-4 text-amber-400" />
           <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Wawasan Fisika</span>
        </div>
        <p className="text-[10px] text-zinc-400 leading-relaxed italic">
           "Gaya gesek statis menahan benda hingga batas maksimumnya. Setelah bergerak, gaya gesek kinetis yang lebih konstan dan kecil akan melawan arah gerak benda."
        </p>
      </div>


      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-30 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center gap-4">
          <Link href="/simulasi" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-white transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Gaya Gesek</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Dinamika • Fisika</span>
          </div>
        </div>
        
        {/* Motion Status Badge */}
        <div className="flex items-center gap-3">
          {Math.abs(vel) > 0.01 ? (
            <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-full flex items-center gap-2 animate-pulse">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">Benda Bergerak (Kinetis)</span>
            </div>
          ) : appliedForce !== 0 ? (
            <div className="px-4 py-2 bg-amber-500/20 border border-amber-500/50 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b]" />
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">Benda Diam (Statis)</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Floating Status Cards */}
      <div className="absolute top-20 left-8 right-8 flex flex-wrap gap-3 z-10 pointer-events-none">
          <div className="glass-card p-4 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl flex-1 min-w-[150px] flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Weight className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Gaya Normal</div>
              <div className="text-xl font-black text-white font-mono">{normalForce.toFixed(1)}<span className="text-xs ml-1 text-zinc-500">N</span></div>
            </div>
          </div>
          
          <div className="glass-card p-4 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl flex-1 min-w-[150px] flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">F Gesek Maks</div>
              <div className="text-xl font-black text-amber-400 font-mono">{maxStaticFriction.toFixed(1)}<span className="text-xs ml-1 text-zinc-500">N</span></div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl flex-1 min-w-[150px] flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Move className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Kecepatan</div>
              <div className="text-xl font-black text-emerald-400 font-mono">{vel.toFixed(2)}<span className="text-xs ml-1 text-zinc-500">m/s</span></div>
            </div>
          </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-5xl px-8 z-20">
        <div className="glass-card p-5 rounded-[32px] border border-white/10 backdrop-blur-3xl shadow-[0_24px_48px_rgba(0,0,0,0.5)] flex flex-col items-center gap-6">
          
          <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Control Groups */}
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest px-1">Gaya Dorong (F)</label>
              <div className="flex items-center gap-2 bg-white/5 rounded-xl border border-white/10 p-1.5">
                <input type="number" className="bg-transparent w-full text-sm font-black text-cyan-400 font-mono outline-none px-2" value={appliedForce} onChange={(e) => setAppliedForce(parseFloat(e.target.value) || 0)} />
                <span className="text-[9px] font-bold text-zinc-500 pr-2">N</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest px-1">Massa (m)</label>
              <div className="flex items-center gap-2 bg-white/5 rounded-xl border border-white/10 p-1.5">
                <input type="number" className="bg-transparent w-full text-sm font-black text-white font-mono outline-none px-2" value={mass} onChange={(e) => setMass(Math.max(1, parseFloat(e.target.value) || 1))} />
                <span className="text-[9px] font-bold text-zinc-500 pr-2">kg</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest px-1">Koef. Statis (μs)</label>
              <div className="flex items-center gap-2 bg-white/5 rounded-xl border border-white/10 p-1.5">
                <input type="number" className="bg-transparent w-full text-sm font-black text-amber-400 font-mono outline-none px-2" step="0.1" value={muStatic} onChange={(e) => setMuStatic(parseFloat(e.target.value) || 0)} />
                <Waves className="w-3 h-3 text-zinc-600 mr-2" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest px-1">Koef. Kinetis (μk)</label>
              <div className="flex items-center gap-2 bg-white/5 rounded-xl border border-white/10 p-1.5">
                <input type="number" className="bg-transparent w-full text-sm font-black text-rose-400 font-mono outline-none px-2" step="0.1" value={muKinetic} onChange={(e) => setMuKinetic(parseFloat(e.target.value) || 0)} />
                <Waves className="w-3 h-3 text-zinc-600 mr-2" />
              </div>
            </div>
          </div>

          <div className="flex gap-3 w-full justify-center border-t border-white/5 pt-4">
            <button onClick={() => setIsRunning(!isRunning)} className={`flex-1 max-w-[200px] py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${isRunning ? 'bg-zinc-800 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'}`}>
              {isRunning ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4 fill-current"/>}
              {isRunning ? 'Pause' : 'Mulai Simulasi'}
            </button>
            <button onClick={reset} className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-all active:scale-95">
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
