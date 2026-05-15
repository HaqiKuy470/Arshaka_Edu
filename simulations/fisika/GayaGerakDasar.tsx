"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Info, Settings2, Users, ArrowRightLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function GayaGerakDasar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  const [leftForce, setLeftForce] = useState(150);
  const [rightForce, setRightForce] = useState(150);
  
  const [pos, setPos] = useState(0); 
  const [vel, setVel] = useState(0);

  const animationRef = useRef(0);
  const lastTimeRef = useRef(0);

  const mass = 50; // kg

  // Physics Update Loop
  useEffect(() => {
    if (isRunning) {
      const update = (timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const dt = (timestamp - lastTimeRef.current) / 1000;
        lastTimeRef.current = timestamp;

        const netForce = rightForce - leftForce;
        const accel = netForce / mass;

        setVel(v => {
           const newV = v + accel * dt;
           // Add a bit of air resistance to make it stop eventually
           return newV * 0.99; 
        });

        setPos(p => {
           let nextP = p + vel * dt * 20; // scale for visual
           
           // Collision bounds
           const bound = window.innerWidth / 40;
           if (Math.abs(nextP) > bound) {
             setIsRunning(false);
             setVel(0);
             return Math.sign(nextP) * bound;
           }
           return nextP;
        });

        animationRef.current = requestAnimationFrame(update);
      };
      animationRef.current = requestAnimationFrame(update);
    } else {
      lastTimeRef.current = 0;
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, leftForce, rightForce, vel]);

  // Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height * 0.6; // Moved up from 0.7
      const scale = 20;

      // --- Draw Ground ---
      const groundY = cy;
      const groundGrad = ctx.createLinearGradient(0, groundY, 0, canvas.height);
      groundGrad.addColorStop(0, "#18181b"); // zinc-900
      groundGrad.addColorStop(1, "#09090b"); // zinc-950
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
      
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(canvas.width, groundY); ctx.stroke();

      const cartX = cx + pos * scale;

      // --- Draw Cart ---
      // Shadow
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fillRect(cartX - 45, cy - 5, 90, 10);

      // Cart Body
      const gradient = ctx.createLinearGradient(cartX - 50, cy - 60, cartX + 50, cy - 20);
      gradient.addColorStop(0, "#8b5cf6"); // violet-500
      gradient.addColorStop(1, "#6d28d9"); // violet-700
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(cartX - 50, cy - 50, 100, 35, 8);
      ctx.fill();
      
      // Cart Detail (Railing)
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cartX - 40, cy - 50); ctx.lineTo(cartX - 40, cy - 60);
      ctx.lineTo(cartX + 40, cy - 60); ctx.lineTo(cartX + 40, cy - 50);
      ctx.stroke();

      // Wheels
      const drawWheel = (x: number) => {
        ctx.fillStyle = "#27272a";
        ctx.beginPath(); ctx.arc(x, cy - 5, 12, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#52525b";
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(x, cy - 5, 12, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = "white";
        ctx.beginPath(); ctx.arc(x, cy - 5, 4, 0, Math.PI * 2); ctx.fill();
      };
      drawWheel(cartX - 30);
      drawWheel(cartX + 30);

      // --- Draw Teams (Stick Figures) ---
      const drawTeam = (side: 'left' | 'right', force: number) => {
        const dir = side === 'left' ? -1 : 1;
        const color = side === 'left' ? "#0ea5e9" : "#f43f5e";
        const count = Math.ceil(force / 50);
        
        for (let i = 0; i < count; i++) {
          const personX = cartX + (dir * (70 + i * 35));
          const personY = cy;
          
          ctx.strokeStyle = color;
          ctx.lineWidth = 3;
          ctx.lineCap = "round";

          // Head
          ctx.beginPath(); ctx.arc(personX, personY - 65, 8, 0, Math.PI * 2); ctx.stroke();
          // Body
          ctx.beginPath(); ctx.moveTo(personX, personY - 57); ctx.lineTo(personX - dir * 10, personY - 25); ctx.stroke();
          // Legs
          ctx.beginPath(); ctx.moveTo(personX - dir * 10, personY - 25); ctx.lineTo(personX - dir * 20, personY); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(personX - dir * 10, personY - 25); ctx.lineTo(personX, personY); ctx.stroke();
          // Arms (Pulling)
          ctx.beginPath();
          ctx.moveTo(personX - dir * 5, personY - 45);
          ctx.lineTo(cartX + dir * 50, personY - 35); // Rope line
          ctx.stroke();
        }

        // Draw Rope
        ctx.strokeStyle = "#71717a";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(cartX + dir * 50, cy - 35);
        ctx.lineTo(cartX + dir * (70 + (count-1) * 35), cy - 35);
        ctx.stroke();
        ctx.setLineDash([]);
      };

      drawTeam('left', leftForce);
      drawTeam('right', rightForce);

      // --- Resultant Force Arrow ---
      const netForce = rightForce - leftForce;
      if (Math.abs(netForce) > 0) {
         const arrowY = 120;
         const arrowLen = Math.min(Math.abs(netForce) * 2, 300);
         const arrowDir = Math.sign(netForce);
         
         ctx.strokeStyle = arrowDir > 0 ? "#f43f5e" : "#0ea5e9";
         ctx.lineWidth = 6;
         ctx.beginPath();
         ctx.moveTo(cx - (arrowLen/2) * arrowDir, arrowY);
         ctx.lineTo(cx + (arrowLen/2) * arrowDir, arrowY);
         ctx.stroke();
         
         // Arrow head
         ctx.fillStyle = arrowDir > 0 ? "#f43f5e" : "#0ea5e9";
         ctx.beginPath();
         ctx.moveTo(cx + (arrowLen/2) * arrowDir, arrowY);
         ctx.lineTo(cx + (arrowLen/2) * arrowDir - arrowDir * 15, arrowY - 10);
         ctx.lineTo(cx + (arrowLen/2) * arrowDir - arrowDir * 15, arrowY + 10);
         ctx.fill();
      }
    };

    render();
    window.addEventListener("resize", render);
    return () => window.removeEventListener("resize", render);
  }, [pos, leftForce, rightForce]);

  const reset = () => {
    setIsRunning(false);
    setPos(0);
    setVel(0);
    lastTimeRef.current = 0;
  };

  return (
    <div ref={containerRef} className="fixed inset-0 bg-zinc-950 flex flex-col overflow-hidden font-sans select-none">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-30 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center gap-4">
          <Link href="/simulasi" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-white transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Gaya & Gerak Dasar</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Hukum Newton • Fisika</span>
          </div>
        </div>

        {/* Resultant Badge */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-2 backdrop-blur-md">
             <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Resultan Gaya:</span>
             <span className={`text-sm font-black font-mono ${rightForce > leftForce ? 'text-rose-500' : leftForce > rightForce ? 'text-sky-400' : 'text-white'}`}>
                {Math.abs(rightForce - leftForce)} N {rightForce > leftForce ? '➡️' : leftForce > rightForce ? '⬅️' : '—'}
             </span>
          </div>
        </div>
      </div>

      {/* Floating Status Cards */}
      <div className="absolute top-20 left-8 right-8 flex flex-wrap gap-3 z-10 pointer-events-none">
          <div className="glass-card p-4 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl flex-1 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Tim Kiri</div>
              <div className="text-xl font-black text-sky-400 font-mono">{leftForce}<span className="text-xs ml-1 text-zinc-500">N</span></div>
            </div>
          </div>
          
          <div className="glass-card p-4 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl flex-1 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Tim Kanan</div>
              <div className="text-xl font-black text-rose-400 font-mono">{rightForce}<span className="text-xs ml-1 text-zinc-500">N</span></div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl flex-1 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Kecepatan</div>
              <div className="text-xl font-black text-indigo-400 font-mono">{vel.toFixed(1)}<span className="text-xs ml-1 text-zinc-500">m/s</span></div>
            </div>
          </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-8 z-20">
        <div className="glass-card p-4 rounded-[24px] border border-white/10 backdrop-blur-3xl shadow-[0_24px_48px_rgba(0,0,0,0.5)] flex flex-col items-center gap-4">
          
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Gaya Tim Kiri</label>
                <span className="text-xs font-black text-sky-400 font-mono">{leftForce} N</span>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="range" 
                  className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-sky-500" 
                  min="0" max="500" step="50" 
                  value={leftForce} 
                  onChange={(e) => setLeftForce(parseInt(e.target.value))} 
                />
                <input 
                  type="number" 
                  className="bg-white/5 w-16 text-center py-1 rounded-lg border border-white/10 text-sky-400 font-mono text-[11px] outline-none"
                  value={leftForce}
                  onChange={(e) => setLeftForce(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Gaya Tim Kanan</label>
                <span className="text-xs font-black text-rose-400 font-mono">{rightForce} N</span>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="range" 
                  className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-500" 
                  min="0" max="500" step="50" 
                  value={rightForce} 
                  onChange={(e) => setRightForce(parseInt(e.target.value))} 
                />
                <input 
                  type="number" 
                  className="bg-white/5 w-16 text-center py-1 rounded-lg border border-white/10 text-rose-400 font-mono text-[11px] outline-none"
                  value={rightForce}
                  onChange={(e) => setRightForce(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 w-full justify-center border-t border-white/5 pt-4">
            <button 
              onClick={() => setIsRunning(!isRunning)} 
              className={`flex-1 max-w-[200px] py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${isRunning ? 'bg-zinc-800 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'}`}
            >
              {isRunning ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4 fill-current"/>}
              {isRunning ? 'Pause' : 'Mulai Tarik Tambang'}
            </button>
            <button onClick={reset} className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-all active:scale-95" title="Reset Posisi">
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
