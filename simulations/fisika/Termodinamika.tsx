"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box, Activity, ChevronRight, Flame, Settings, Share2, Lock, Unlock, Magnet, Target, Sparkles, Battery, Lightbulb, RefreshCcw, Sun, Filter, Microscope } from "lucide-react";
import Link from "next/link";

interface Particle { x: number; y: number; vx: number; vy: number; }
interface StatePoint { p: number; v: number; }

export default function Termodinamika() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  // Thermodynamic State (Ideal Gas Law: PV = nRT)
  const [temp, setTemp] = useState(300); // Kelvin
  const [volume, setVolume] = useState(40); // L
  const [process, setProcess] = useState<"manual" | "isothermal" | "isobaric" | "isochoric">("manual");

  const particlesRef = useRef<Particle[]>([]);
  const pathRef = useRef<StatePoint[]>([]);
  const animationRef = useRef(0);

  useEffect(() => {
    // Init particles
    const p: Particle[] = [];
    for (let i = 0; i < 120; i++) {
       p.push({
          x: Math.random(),
          y: Math.random(),
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2
       });
    }
    particlesRef.current = p;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const sidebarWidth = window.innerWidth >= 1024 ? 320 : 0;
      const arenaW = canvas.width - sidebarWidth;
      const arenaH = canvas.height;
      
      const cx = arenaW / 2;
      const cy = arenaH / 2;

      // Pressure calculation P = nRT/V (Simplified)
      const pressure = (temp / volume) * 10;

      if (isRunning) {
         pathRef.current.push({ p: pressure, v: volume });
         if (pathRef.current.length > 200) pathRef.current.shift();
      }

      // --- Drawing Grid ---
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      for (let i = 0; i < arenaW; i += 50) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, arenaH); ctx.stroke(); }
      for (let i = 0; i < arenaH; i += 50) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(arenaW, i); ctx.stroke(); }

      // --- Draw P-V Graph (Top Left) ---
      const graphW = 180;
      const graphH = 140;
      const gx = 60, gy = 80;
      
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.strokeRect(gx, gy, graphW, graphH);
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.font = "bold 8px Inter";
      ctx.fillText("V", gx + graphW + 10, gy + graphH);
      ctx.fillText("P", gx - 15, gy - 5);

      if (pathRef.current.length > 1) {
         ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 2;
         ctx.beginPath();
         pathRef.current.forEach((pt, i) => {
            const px = gx + (pt.v / 100) * graphW;
            const py = gy + graphH - (pt.p / 150) * graphH;
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
         });
         ctx.stroke();
         // Current point
         const last = pathRef.current[pathRef.current.length - 1];
         ctx.fillStyle = "#fff";
         ctx.beginPath();
         ctx.arc(gx + (last.v / 100) * graphW, gy + graphH - (last.p / 150) * graphH, 4, 0, Math.PI * 2);
         ctx.fill();
      }

      // --- Draw Thermodynamics Cylinder ---
      const cylW = 240;
      const cylH = 300;
      const cylX = cx - cylW / 2;
      const cylY = cy - cylH / 2;
      const pistonY = cylY + (1 - volume / 100) * (cylH - 40);

      // Glass Cylinder
      ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
      ctx.fillRect(cylX, cylY, cylW, cylH);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"; ctx.lineWidth = 2;
      ctx.strokeRect(cylX, cylY, cylW, cylH);

      // Heat Burner (Base)
      const heatIntensity = (temp - 100) / 900;
      const grad = ctx.createLinearGradient(cylX, cylY + cylH, cylX, cylY + cylH + 40);
      grad.addColorStop(0, `rgba(244, 63, 94, ${0.2 + heatIntensity * 0.8})`);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(cylX, cylY + cylH, cylW, 40);

      // Piston
      ctx.fillStyle = "#3f3f46";
      ctx.shadowBlur = 10; ctx.shadowColor = "black";
      ctx.fillRect(cylX - 10, pistonY, cylW + 20, 20);
      ctx.strokeRect(cylX - 10, pistonY, cylW + 20, 20);
      ctx.shadowBlur = 0;

      // Particles
      const speed = Math.sqrt(temp / 100);
      particlesRef.current.forEach(p => {
         if (isRunning) {
            p.x += p.vx * speed * 0.02;
            p.y += p.vy * speed * 0.02;
            
            // Bounces
            if (p.x < 0 || p.x > 1) p.vx *= -1;
            if (p.y < 0) p.vy *= -1;
            // Piston bounce
            const pistonRel = (pistonY - cylY) / cylH;
            if (p.y > 1 - (1 - (pistonY - cylY) / cylH)) {
               p.y = 1 - (1 - (pistonY - cylY) / cylH);
               p.vy *= -1;
            }
            if (p.y > 1) p.vy *= -1;
         }

         const px = cylX + p.x * cylW;
         const py = pistonY + (p.y * (cylY + cylH - pistonY));
         
         const pColor = `hsl(${Math.max(0, 240 - temp / 4)}, 70%, 60%)`;
         ctx.fillStyle = pColor;
         ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2); ctx.fill();
      });
      
      // Indicators
      ctx.fillStyle = "white"; ctx.font = "bold 10px Inter"; ctx.textAlign = "center";
      ctx.fillText(`P = ${pressure.toFixed(1)} atm`, cx, cylY - 20);
    };

    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, temp, volume, process]);

  const reset = () => {
    setTemp(300);
    setVolume(40);
    pathRef.current = [];
  };

  const handleTempChange = (v: number) => {
    setTemp(v);
    if (process === "isobaric") {
       // V = nRT/P => V is proportional to T
       setVolume(Math.min(100, (v / 300) * 40));
    } else if (process === "isothermal") {
       // P is adjusted, T stays constant. Slider shouldn't move T if isothermal, 
       // but here we just handle manual logic.
    }
  };

  const handleVolChange = (v: number) => {
    setVolume(v);
    if (process === "isothermal") {
       // P = nRT/V => T stays constant, P adjusts (handled in render)
    } else if (process === "isochoric") {
       // V doesn't change
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-950 flex flex-col lg:flex-row overflow-hidden font-sans select-none touch-none text-white">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-30 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Link href="/simulasi" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-white transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Termodinamika</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Hukum Gas Ideal • Usaha • Kalor • Energi Dalam</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative pointer-events-none" />

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           
           {/* Energy HUD */}
           <div className="bg-white/5 border border-white/10 p-5 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                 <Activity className="w-4 h-4 text-sky-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Kesetimbangan Energi</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest mb-1">Internal (U)</span>
                    <span className="text-sm font-black text-white">{(temp * 1.5).toFixed(0)} J</span>
                 </div>
                 <div className="flex flex-col text-right">
                    <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest mb-1">Usaha (W)</span>
                    <span className="text-sm font-black text-emerald-400">{(volume * 2).toFixed(0)} J</span>
                 </div>
              </div>
           </div>

           {/* Process Selector */}
           <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                 <Filter className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Mode Proses</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                 {["manual", "isothermal", "isobaric", "isochoric"].map((m) => (
                    <button key={m} onClick={() => setProcess(m as any)} className={`py-3 px-2 rounded-xl text-[8px] font-black uppercase transition-all border ${process === m ? 'bg-white/10 border-white/30 text-white' : 'bg-transparent border-white/5 text-zinc-600'}`}>
                       {m}
                    </button>
                 ))}
              </div>
           </div>

           {/* Parameters */}
           <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 mb-1">
                 <Settings className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Variabel Gas</span>
              </div>
              
              <div className="bg-white/5 p-5 rounded-3xl border border-white/10 space-y-6">
                 <div className="space-y-3">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Suhu (T)</label>
                       <span className="text-xs font-black text-rose-400">{temp} K</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-400" min="100" max="1000" step="10" value={temp} onChange={(e) => handleTempChange(parseInt(e.target.value))} />
                 </div>

                 <div className="space-y-3">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Volume (V)</label>
                       <span className="text-xs font-black text-sky-400">{volume} L</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-sky-400" min="10" max="100" step="1" value={volume} onChange={(e) => handleVolChange(parseInt(e.target.value))} />
                 </div>
              </div>
           </div>

           {/* Physics Insight */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-amber-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Hukum I Termo</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                 "Energi tidak dapat diciptakan atau dimusnahkan, hanya dapat diubah bentuknya. Perubahan energi dalam ($\Delta U$) adalah selisih antara kalor ($Q$) yang masuk dan usaha ($W$) yang dilakukan gas."
              </p>
           </div>

           <div className="pt-6 border-t border-white/5 flex gap-2">
              <button onClick={() => setIsRunning(!isRunning)} className="flex-1 py-4 bg-white hover:bg-zinc-200 text-black font-black rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg">
                 {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                 {isRunning ? "PAUSE" : "START"}
              </button>
              <button onClick={reset} className="p-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl border border-white/5 transition-all">
                 <RotateCcw className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
