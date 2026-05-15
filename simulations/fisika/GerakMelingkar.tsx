"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Info, Settings2, Target, Move, Zap, Timer , ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function GerakMelingkar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  const [radius, setRadius] = useState(150); // meters
  const [velocity, setVelocity] = useState(30); // tangential velocity
  
  const [angle, setAngle] = useState(0);
  const animationRef = useRef(0);
  const lastTimeRef = useRef(0);

  // Constants & Formulas
  const omega = velocity / radius; // rad/s
  const centripetalAcc = (velocity * velocity) / radius; // v^2 / r
  const period = (2 * Math.PI) / omega; // 2pi / omega
  const frequency = 1 / period; // Hz

  useEffect(() => {
    if (isRunning) {
      const update = (timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const dt = (timestamp - lastTimeRef.current) / 1000;
        lastTimeRef.current = timestamp;

        setAngle(a => (a + omega * dt) % (Math.PI * 2));
        animationRef.current = requestAnimationFrame(update);
      };
      animationRef.current = requestAnimationFrame(update);
    } else {
      lastTimeRef.current = 0;
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, omega]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // We shift the center a bit to the left to account for the right panel
      const cx = (window.innerWidth - 320) / 2; 
      const cy = window.innerHeight / 2;
      
      // --- Radial Grid ---
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth = 1;
      for (let r = 50; r < 400; r += 50) {
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      }
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * 400, cy + Math.sin(a) * 400); ctx.stroke();
      }

      // --- Orbit Path ---
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // --- Center Pivot ---
      const pivotGrad = ctx.createRadialGradient(cx-2, cy-2, 0, cx, cy, 10);
      pivotGrad.addColorStop(0, "#ffffff");
      pivotGrad.addColorStop(1, "#3f3f46");
      ctx.fillStyle = pivotGrad;
      ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI * 2); ctx.fill();

      // --- Moving Object ---
      const px = cx + Math.cos(angle) * radius;
      const py = cy + Math.sin(angle) * radius;

      // Connecting String
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();

      // Object Body (Glassy Sphere)
      const objGrad = ctx.createRadialGradient(px - 5, py - 5, 0, px, py, 16);
      objGrad.addColorStop(0, "#60a5fa");
      objGrad.addColorStop(1, "#1e40af");
      ctx.fillStyle = objGrad;
      ctx.beginPath(); ctx.arc(px, py, 16, 0, Math.PI * 2); ctx.fill();

      // --- Vector Arrows ---
      const drawArrow = (x: number, y: number, ang: number, len: number, color: string, label: string) => {
        const targetX = x + Math.cos(ang) * len;
        const targetY = y + Math.sin(ang) * len;
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(targetX, targetY); ctx.stroke();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(targetX, targetY);
        ctx.lineTo(targetX - Math.cos(ang - 0.5) * 12, targetY - Math.sin(ang - 0.5) * 12);
        ctx.lineTo(targetX - Math.cos(ang + 0.5) * 12, targetY - Math.sin(ang + 0.5) * 12);
        ctx.fill();
        ctx.font = "bold 11px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(label, targetX + Math.cos(ang) * 15, targetY + Math.sin(ang) * 15);
      };

      drawArrow(px, py, angle + Math.PI/2, velocity * 2, "#10b981", "v");
      drawArrow(px, py, angle + Math.PI, centripetalAcc * 1.5, "#f43f5e", "ac");
    };

    render();
    window.addEventListener("resize", render);
    return () => window.removeEventListener("resize", render);
  }, [radius, velocity, angle, centripetalAcc]);

  const reset = () => {
    setAngle(0);
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
           "Gaya sentripetal selalu menarik benda menuju pusat lingkaran untuk mempertahankan lintasan melengkung, menghasilkan percepatan arah radial."
        </p>
      </div>


      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-30 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Link href="/simulasi" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-white transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Gerak Melingkar</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Kinematika Rotasi • Fisika</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Stats & Controls */}
      <div className="absolute top-20 right-6 bottom-6 w-80 z-20 flex flex-col gap-4">
        
        {/* Stats Section */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 backdrop-blur-3xl shadow-2xl space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Acc. Sentripetal</div>
              <div className="text-xl font-black text-rose-400 font-mono">{centripetalAcc.toFixed(1)}<span className="text-xs ml-1 text-zinc-500">m/s²</span></div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Move className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Kecepatan Sudut</div>
              <div className="text-xl font-black text-emerald-400 font-mono">{omega.toFixed(2)}<span className="text-xs ml-1 text-zinc-500">rad/s</span></div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Timer className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Periode (T)</div>
              <div className="text-xl font-black text-blue-400 font-mono">{period.toFixed(2)}<span className="text-xs ml-1 text-zinc-500">s</span></div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="glass-card flex-1 p-6 rounded-3xl border border-white/10 backdrop-blur-3xl shadow-2xl flex flex-col gap-8">
          
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Kecepatan (v)</label>
                <span className="text-sm font-black text-emerald-400 font-mono">{velocity} m/s</span>
              </div>
              <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500" min="10" max="100" step="1" value={velocity} onChange={(e) => setVelocity(parseInt(e.target.value))} />
              <div className="flex justify-end">
                <input type="number" className="bg-white/5 w-16 text-center py-1 rounded-lg border border-white/10 text-emerald-400 font-mono text-xs outline-none" value={velocity} onChange={(e) => setVelocity(parseInt(e.target.value) || 0)} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Jari-jari (r)</label>
                <span className="text-sm font-black text-blue-400 font-mono">{radius} m</span>
              </div>
              <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500" min="50" max="300" step="10" value={radius} onChange={(e) => setRadius(parseInt(e.target.value))} />
              <div className="flex justify-end">
                <input type="number" className="bg-white/5 w-16 text-center py-1 rounded-lg border border-white/10 text-blue-400 font-mono text-xs outline-none" value={radius} onChange={(e) => setRadius(parseInt(e.target.value) || 0)} />
              </div>
            </div>
          </div>

          <div className="mt-auto space-y-3">
            <button onClick={() => setIsRunning(!isRunning)} className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 ${isRunning ? 'bg-zinc-800 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-500/20'}`}>
              {isRunning ? <Pause className="w-5 h-5"/> : <Play className="w-5 h-5 fill-current"/>}
              {isRunning ? 'Jeda Putaran' : 'Mulai Putaran'}
            </button>
            <button onClick={reset} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 transition-all flex items-center justify-center gap-2 text-sm">
              <RotateCcw className="w-4 h-4" /> Reset Posisi
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
