"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, FlaskConical, Beaker, Flame, Snowflake, Sun, Coffee, Wind, Radio, Activity, Box } from "lucide-react";
import Link from "next/link";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
}

export default function PerubahanWujudZat() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Simulation State
  const [temp, setTemp] = useState(-20); // Celsius
  const [heatInput, setHeatInput] = useState(0); // -10 (cooling) to 10 (heating)
  const [totalHeat, setTotalHeat] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  // Constants
  const m = 100; // mass
  const cIce = 2.1; 
  const cWater = 4.18;
  const cSteam = 2.0;
  const lFuse = 334; // Latent heat of fusion
  const lVap = 2260; // Latent heat of vaporization

  // Derived state
  const isMelting = temp === 0 && totalHeat > 4200 && totalHeat < (4200 + m * lFuse);
  const isBoiling = temp === 100 && totalHeat > (4200 + m * lFuse + 41800) && totalHeat < (4200 + m * lFuse + 41800 + m * lVap);

  // Particles
  const particles = useRef<Particle[]>([]);
  const animationRef = useRef(0);

  useEffect(() => {
    // Generate grid for solid state
    const p: Particle[] = [];
    const rows = 8;
    const cols = 8;
    const spacing = 15;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const bx = j * spacing - (cols * spacing) / 2;
        const by = i * spacing - (rows * spacing) / 2;
        p.push({
          x: bx,
          y: by,
          baseX: bx,
          baseY: by,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2
        });
      }
    }
    particles.current = p;
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
      const cx = (canvas.width - sidebarWidth) / 2;
      const cy = canvas.height / 2;

      // --- Physics Update ---
      if (isRunning && heatInput !== 0) {
        const dQ = heatInput * 20; // Heat per frame
        setTotalHeat(prev => {
          const nextQ = prev + dQ;
          
          // Simplified phase logic
          // 0 - 4200: Heating Ice (-20 to 0)
          // 4200 - 37600: Melting
          // 37600 - 79400: Heating Water (0 to 100)
          // 79400 - 305400: Boiling
          // 305400+: Heating Steam
          
          if (nextQ < 4200) {
            setTemp(-20 + nextQ / (m * cIce));
          } else if (nextQ < 37600) {
            setTemp(0);
          } else if (nextQ < 79400) {
            setTemp((nextQ - 37600) / (m * cWater));
          } else if (nextQ < 305400) {
            setTemp(100);
          } else {
            setTemp(100 + (nextQ - 305400) / (m * cSteam));
          }
          
          return Math.max(0, nextQ);
        });
      }

      // --- Chamber Visual ---
      const boxSize = 250;
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - boxSize/2, cy - boxSize/2, boxSize, boxSize);
      ctx.fillStyle = "rgba(255,255,255,0.02)";
      ctx.fillRect(cx - boxSize/2, cy - boxSize/2, boxSize, boxSize);

      // --- Particle Simulation ---
      const vibration = Math.max(0.5, (temp + 30) / 20);
      const isGas = temp >= 100 && !isBoiling;
      const isLiquid = (temp > 0 && temp < 100) || isMelting || isBoiling;
      const isSolid = temp <= 0;

      particles.current.forEach(p => {
        if (isSolid && !isMelting) {
          // Lattice vibration
          p.x = p.baseX + (Math.random() - 0.5) * vibration;
          p.y = p.baseY + (Math.random() - 0.5) * vibration;
        } else if (isGas) {
          // Free movement
          p.x += p.vx * vibration * 0.5;
          p.y += p.vy * vibration * 0.5;
          if (Math.abs(p.x) > boxSize/2 - 5) { p.vx *= -1; p.x = Math.sign(p.x) * (boxSize/2 - 5); }
          if (Math.abs(p.y) > boxSize/2 - 5) { p.vy *= -1; p.y = Math.sign(p.y) * (boxSize/2 - 5); }
        } else {
          // Liquid-like (cluster at bottom)
          p.x += p.vx * vibration * 0.2;
          p.y += p.vy * vibration * 0.2;
          
          const gravity = 0.5;
          p.vy += gravity;
          
          const floorY = boxSize/2 - 10;
          if (p.y > floorY) { p.y = floorY; p.vy *= -0.5; }
          if (Math.abs(p.x) > boxSize/2 - 10) { p.vx *= -1; p.x = Math.sign(p.x) * (boxSize/2 - 10); }
        }

        // Color based on temperature
        const hue = 200 - (temp + 20) * 1.5;
        ctx.fillStyle = `hsla(${hue}, 80%, 70%, 0.8)`;
        ctx.beginPath();
        ctx.arc(cx + p.x, cy + p.y, isGas ? 2 : 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // --- Labels ---
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "bold 10px Inter";
      ctx.textAlign = "center";
      ctx.fillText(temp <= 0 ? "PADAT (ES)" : temp >= 100 ? "GAS (UAP)" : "CAIR (AIR)", cx, cy + boxSize/2 + 30);
    };

    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [temp, isRunning, heatInput, totalHeat, isMelting, isBoiling]);

  const reset = () => {
    setTemp(-20);
    setTotalHeat(0);
    setHeatInput(0);
  };

  return (
    <div ref={containerRef} className="fixed inset-0 bg-zinc-950 flex flex-col lg:flex-row overflow-hidden font-sans select-none">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-30 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Link href="/simulasi" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-white transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Perubahan Wujud Zat</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Teori Molekular • Kalor Laten</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative" />

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           
           {/* Phase Card */}
           <div className="bg-black/40 border border-white/10 p-6 rounded-3xl text-center shadow-inner relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">Termometer Digital</div>
              <div className={`text-5xl font-black transition-colors duration-500 ${temp <= 0 ? 'text-sky-400' : temp >= 100 ? 'text-rose-400' : 'text-blue-400'}`}>
                {temp.toFixed(1)}<span className="text-xl">°C</span>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                 <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${isMelting || isBoiling ? 'bg-amber-500/20 text-amber-500 animate-pulse' : 'bg-white/5 text-zinc-400'}`}>
                    {isMelting ? "Sedang Mencair" : isBoiling ? "Sedang Mendidih" : temp <= 0 ? "Fase Padat" : temp >= 100 ? "Fase Gas" : "Fase Cair"}
                 </div>
              </div>
           </div>

           {/* Analysis Section */}
           <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                 <ShieldAlert className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Energi Termal</span>
              </div>
              <div className="glass-card p-4 rounded-2xl border border-white/5 bg-white/5 space-y-4 font-mono">
                 <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Kalor Total (Q)</span>
                       <span className="text-xl font-black text-white">{(totalHeat / 1000).toFixed(1)} <span className="text-[10px] text-zinc-500">kJ</span></span>
                    </div>
                    <Zap className="w-5 h-5 text-amber-500/50" />
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Laju Energi</span>
                       <span className="text-xl font-black text-rose-400">{heatInput * 20} <span className="text-[10px] text-zinc-500">J/frame</span></span>
                    </div>
                    <Activity className="w-5 h-5 text-rose-500/50" />
                 </div>
              </div>
           </div>

           {/* Thermal Controls */}
           <div className="space-y-6 pt-2">
              <div className="flex items-center gap-2 mb-1">
                 <Flame className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Kontrol Pembakar</span>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Input Kalor: {heatInput > 0 ? `+${heatInput}` : heatInput}</label>
                 </div>
                 <input 
                   type="range" 
                   className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-500" 
                   min="-10" max="10" step="1" value={heatInput} 
                   onChange={(e) => setHeatInput(parseInt(e.target.value))} 
                 />
                 <div className="flex justify-between text-[8px] font-bold text-zinc-600 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Snowflake className="w-2 h-2"/> Dinginkan</span>
                    <span>Netral</span>
                    <span className="flex items-center gap-1">Panaskan <Flame className="w-2 h-2"/></span>
                 </div>
              </div>
           </div>

                      {/* Physics Insight */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-amber-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Wawasan Fisika</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                 "Energi panas yang ditambahkan pada fase transisi (misal es mencair) hanya murni digunakan untuk memutus ikatan molekul, sehingga suhu tidak akan naik (panas laten)."
              </p>
           </div>

           <div className="pt-6 border-t border-white/5 space-y-3">
              <button onClick={reset} className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg border border-white/5">
                 <RotateCcw className="w-4 h-4" /> Reset ke Es (-20°C)
              </button>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[9px] text-zinc-500 leading-relaxed space-y-2">
                 <p className="font-bold text-zinc-400 uppercase tracking-widest border-b border-white/5 pb-1 mb-2">Info Kalor Laten</p>
                 <p>Perhatikan bahwa suhu berhenti di <span className="text-white">0°C</span> dan <span className="text-white">100°C</span>. Pada titik ini, energi digunakan untuk mengubah susunan molekul, bukan menaikkan suhu.</p>
              </div>
        </div>
      </div>
    </div>
  </div>
  );
}