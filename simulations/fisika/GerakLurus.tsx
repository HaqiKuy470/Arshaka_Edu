"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Info, Settings2, Gauge, Activity, Maximize, Minimize , ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function GerakLurus() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [initialV, setInitialV] = useState(10);
  const [accel, setAccel] = useState(2);
  
  const [time, setTime] = useState(0);
  const [pos, setPos] = useState(0);
  const [vel, setVel] = useState(10);

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
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = 100; // starting x padding
      const cy = canvas.height * 0.7; // Road position
      const scale = 15; // px per meter (bigger scale for full page)

      // --- Draw Road ---
      ctx.fillStyle = "#18181b"; // zinc-900
      ctx.fillRect(0, cy, canvas.width, 200);
      
      // Road Lines
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.setLineDash([40, 40]);
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, cy + 100);
      ctx.lineTo(canvas.width, cy + 100);
      ctx.stroke();
      ctx.setLineDash([]);

      // --- Draw Grid / Distance markers ---
      if (showGrid) {
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.font = "bold 12px Inter, sans-serif";
        for(let i=0; i<1000; i+=10) {
          const drawX = cx + i * scale - (pos * scale);
          
          if (drawX > -100 && drawX < canvas.width + 100) {
             ctx.beginPath();
             ctx.strokeStyle = "rgba(255,255,255,0.1)";
             ctx.moveTo(drawX, cy);
             ctx.lineTo(drawX, cy + 20);
             ctx.stroke();
             ctx.fillText(`${i}m`, drawX - 10, cy + 40);
          }
        }
      }

      // --- Draw Car ---
      // We'll fix the car at a relative screen position if it goes too far, 
      // or just let it drive off. Let's let it drive.
      const carX = cx; // Keeping car at cx and moving world is often cooler, 
      // but the user said "fix the display", let's move the car until it nears edge then maybe scroll
      
      const visualCarX = cx + (pos * scale);

      // Car shadow
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.beginPath();
      ctx.ellipse(visualCarX + 40, cy + 5, 50, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Car Body (Stylized Sports Car)
      ctx.fillStyle = "#6366f1"; // Indigo 500
      
      // Main chassis
      ctx.beginPath();
      ctx.roundRect(visualCarX, cy - 25, 90, 25, [10, 20, 5, 5]);
      ctx.fill();

      // Cabin / Roof
      ctx.fillStyle = "#4f46e5"; // Indigo 600
      ctx.beginPath();
      ctx.roundRect(visualCarX + 20, cy - 45, 45, 25, [15, 15, 0, 0]);
      ctx.fill();

      // Windows
      ctx.fillStyle = "#93c5fd"; // Blue 300
      ctx.beginPath();
      ctx.roundRect(visualCarX + 25, cy - 40, 15, 15, [5, 2, 0, 0]);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(visualCarX + 45, cy - 40, 15, 15, [2, 5, 0, 0]);
      ctx.fill();

      // Wheels
      const wheelRotate = (pos * 5); // simple rotation based on distance
      
      const drawWheel = (x: number, y: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(wheelRotate);
        
        // Tire
        ctx.fillStyle = "#09090b"; // zinc-950
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Rim
        ctx.strokeStyle = "#71717a"; // zinc-400
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.stroke();
        
        // Spokes
        ctx.beginPath();
        ctx.moveTo(-7, 0); ctx.lineTo(7, 0);
        ctx.moveTo(0, -7); ctx.lineTo(0, 7);
        ctx.stroke();
        
        ctx.restore();
      };

      drawWheel(visualCarX + 20, cy);
      drawWheel(visualCarX + 70, cy);

      // --- Draw Vectors ---
      // Velocity Vector (Green)
      if (Math.abs(vel) > 0) {
        ctx.beginPath();
        ctx.strokeStyle = "#10b981"; // Emerald 500
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.moveTo(visualCarX + 90, cy - 15);
        const vLength = Math.min(vel * 3, 150);
        ctx.lineTo(visualCarX + 90 + vLength, cy - 15);
        ctx.stroke();
        // Head
        ctx.fillStyle = "#10b981";
        ctx.beginPath();
        ctx.moveTo(visualCarX + 90 + vLength, cy - 15);
        ctx.lineTo(visualCarX + 90 + vLength - 10, cy - 22);
        ctx.lineTo(visualCarX + 90 + vLength - 10, cy - 8);
        ctx.fill();
      }

      // Acceleration Vector (Red)
      if (Math.abs(accel) > 0) {
        ctx.beginPath();
        ctx.strokeStyle = "#f43f5e"; // Rose 500
        ctx.lineWidth = 3;
        ctx.moveTo(visualCarX + 45, cy - 60);
        const aLength = accel * 10;
        ctx.lineTo(visualCarX + 45 + aLength, cy - 60);
        ctx.stroke();
        // Head
        ctx.fillStyle = "#f43f5e";
        ctx.beginPath();
        ctx.moveTo(visualCarX + 45 + aLength, cy - 60);
        ctx.lineTo(visualCarX + 45 + aLength - 7, cy - 65);
        ctx.lineTo(visualCarX + 45 + aLength - 7, cy - 55);
        ctx.fill();
      }
    };

    render();
    window.addEventListener("resize", render);
    return () => window.removeEventListener("resize", render);
  }, [pos, vel, accel]);

  const reset = () => {
    setIsRunning(false);
    setTime(0);
    setPos(0);
    setVel(initialV);
    lastTimeRef.current = 0;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div ref={containerRef} className="fixed inset-0 bg-zinc-950 flex flex-col overflow-hidden font-sans select-none">
      
      {/* Background canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      {/* Physics Insight */}
      <div className="absolute top-20 right-8 w-80 glass-card p-5 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl z-20 pointer-events-none bg-black/40">
        <div className="flex items-center gap-2 mb-2">
           <ShieldAlert className="w-4 h-4 text-amber-400" />
           <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Wawasan Fisika</span>
        </div>
        <p className="text-[10px] text-zinc-400 leading-relaxed italic">
           "Gerak Lurus Beraturan (GLB) bergerak dengan kecepatan konstan. Gerak Lurus Berubah Beraturan (GLBB) bergerak dengan percepatan/perlambatan konstan."
        </p>
      </div>


      {/* Top Header Bar */}
      <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-30 pointer-events-none bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Link href="/simulasi" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-white transition-all active:scale-95">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Gerak Lurus</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Kinematika • Fisika</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
           {/* Buttons removed as requested */}
        </div>
      </div>

      {/* Info Overlay */}
      {showInfo && (
        <div className="absolute inset-0 z-40 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
           <div className="glass-card max-w-lg w-full p-8 rounded-[32px] border border-white/10 shadow-2xl relative">
              <button onClick={() => setShowInfo(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white">
                <RotateCcw className="w-5 h-5 rotate-45" />
              </button>
              <h2 className="text-2xl font-black text-white mb-4">Gerak Lurus</h2>
              <div className="space-y-4 text-zinc-300 text-sm leading-relaxed">
                <p>
                  <strong className="text-white">Gerak Lurus Beraturan (GLB)</strong> adalah gerak benda pada lintasan lurus dengan kecepatan tetap (percepatan = 0).
                </p>
                <p>
                  <strong className="text-white">Gerak Lurus Berubah Beraturan (GLBB)</strong> adalah gerak benda pada lintasan lurus dengan percepatan tetap. Kecepatan benda berubah secara teratur setiap detiknya.
                </p>
                <div className="p-4 bg-white/5 rounded-2xl font-mono text-xs text-indigo-300 space-y-1">
                  <div>v = v₀ + at</div>
                  <div>x = v₀t + ½at²</div>
                </div>
              </div>
              <button onClick={() => setShowInfo(false)} className="w-full mt-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all">
                Saya Mengerti
              </button>
           </div>
        </div>
      )}

      {/* Floating Status Cards */}
      <div className="absolute top-20 left-8 right-8 flex flex-col md:flex-row gap-3 z-10 pointer-events-none">
          <div className="glass-card p-4 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl flex-1 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Waktu (t)</div>
              <div className="text-xl font-black text-white font-mono">{time.toFixed(2)}<span className="text-xs ml-1 text-zinc-500">s</span></div>
            </div>
          </div>
          
          <div className="glass-card p-4 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl flex-1 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Jarak (x)</div>
              <div className="text-xl font-black text-blue-400 font-mono">{pos.toFixed(1)}<span className="text-xs ml-1 text-zinc-500">m</span></div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl flex-1 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Gauge className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Kecepatan (v)</div>
              <div className="text-xl font-black text-emerald-400 font-mono">{vel.toFixed(1)}<span className="text-xs ml-1 text-zinc-500">m/s</span></div>
            </div>
          </div>
      </div>

      {/* Floating Bottom Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-8 z-20">
        <div className="glass-card p-5 rounded-[32px] border border-white/10 backdrop-blur-3xl shadow-[0_24px_48px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center gap-6">
          
          <div className="flex gap-3">
            <button 
              onClick={() => setIsRunning(!isRunning)} 
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90 ${isRunning ? 'bg-zinc-800 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
            >
              {isRunning ? <Pause className="w-6 h-6 fill-current"/> : <Play className="w-6 h-6 fill-current ml-0.5"/>}
            </button>
            <button 
              onClick={reset} 
              className="w-14 h-14 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Kecepatan Awal</label>
                <span className="text-sm font-black text-emerald-400 font-mono">{initialV} m/s</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 rounded-xl border border-white/10 p-1.5 focus-within:border-indigo-500/50 transition-all">
                <input 
                  type="number" 
                  className="bg-transparent w-full text-base font-black text-emerald-400 font-mono outline-none px-2" 
                  value={initialV} 
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    setInitialV(val); 
                    if(!isRunning && time===0) {
                      setVel(val);
                    }
                  }} 
                  disabled={time > 0} 
                />
                <span className="text-[9px] font-bold text-zinc-500 uppercase pr-2">m/s</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Percepatan</label>
                <span className="text-sm font-black text-rose-500 font-mono">{accel} m/s²</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 rounded-xl border border-white/10 p-1.5 focus-within:border-indigo-500/50 transition-all">
                <input 
                  type="number" 
                  className="bg-transparent w-full text-base font-black text-rose-500 font-mono outline-none px-2" 
                  value={accel} 
                  onChange={(e) => setAccel(parseFloat(e.target.value) || 0)} 
                />
                <span className="text-[9px] font-bold text-zinc-500 uppercase pr-2">m/s²</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Formula hint */}
      <div className="absolute bottom-10 right-12 hidden xl:block animate-fade-in opacity-50 hover:opacity-100 transition-opacity">
         <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-2 text-right">Fisika Kinematika</div>
         <div className="space-y-1 text-right">
            <div className="text-sm font-bold text-white font-mono">v = v₀ + at</div>
            <div className="text-sm font-bold text-white font-mono">x = v₀t + ½at²</div>
         </div>
      </div>

    </div>
  );
}

// Simple icons not found in lucide
function Clock(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  );
}
