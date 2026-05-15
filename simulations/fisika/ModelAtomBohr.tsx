"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box, Activity, ChevronRight, Flame, Settings, Share2, Lock, Unlock, Magnet, Target, Sparkles, Battery, Lightbulb, RefreshCcw, Sun, Filter, Microscope } from "lucide-react";
import Link from "next/link";

interface Photon {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  active: boolean;
  type: "emit" | "absorb";
}

export default function ModelAtomBohr() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  // Parameters
  const [n, setN] = useState(2);
  const [targetN, setTargetN] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const animationRef = useRef(0);
  const timeRef = useRef(0);
  const electronPosRef = useRef({ r: 60, theta: 0 });
  const photonsRef = useRef<Photon[]>([]);

  // Energy levels: E_n = -13.6 / n^2
  const getEnergy = (level: number) => -13.6 / (level * level);

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

      if (isRunning) timeRef.current += 0.02;
      const t = timeRef.current;

      // --- Draw Orbits ---
      for (let i = 1; i <= 5; i++) {
        const radius = i * 50;
        ctx.strokeStyle = i === n ? "rgba(56, 189, 248, 0.4)" : "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = i === n ? 2 : 1;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.font = "9px Inter";
        ctx.fillText(`n=${i}`, cx + radius + 5, cy + 5);
      }

      // --- Draw Nucleus ---
      // Proton/Neutron cluster
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#ef4444";
      const clusterRadius = 15;
      for (let i = 0; i < 6; i++) {
         const angle = (i * Math.PI * 2) / 6 + t;
         const nx = cx + Math.cos(angle) * 6;
         const ny = cy + Math.sin(angle) * 6;
         ctx.fillStyle = i % 2 === 0 ? "#ef4444" : "#71717a";
         ctx.beginPath(); ctx.arc(nx, ny, 8, 0, Math.PI * 2); ctx.fill();
      }
      ctx.shadowBlur = 0;

      // --- Transition Logic ---
      const currentR = n * 50;
      const targetR = targetN * 50;

      if (isTransitioning) {
         const dr = (targetR - electronPosRef.current.r) * 0.1;
         electronPosRef.current.r += dr;
         if (Math.abs(targetR - electronPosRef.current.r) < 1) {
            electronPosRef.current.r = targetR;
            
            // Emit/Absorb Photon Effect
            if (targetN < n) { // Emission
               photonsRef.current.push({
                  x: cx + Math.cos(electronPosRef.current.theta) * targetR,
                  y: cy + Math.sin(electronPosRef.current.theta) * targetR,
                  vx: Math.cos(electronPosRef.current.theta) * 5,
                  vy: Math.sin(electronPosRef.current.theta) * 5,
                  color: targetN === 2 ? "#38bdf8" : "#f43f5e",
                  active: true,
                  type: "emit"
               });
            }
            
            setN(targetN);
            setIsTransitioning(false);
         }
      } else {
         electronPosRef.current.r = n * 50;
      }

      // --- Update & Draw Electron ---
      // Speed decreases with n (v ~ 1/n)
      const angularVel = 0.05 / Math.sqrt(n);
      if (isRunning) electronPosRef.current.theta += angularVel;
      
      const ex = cx + Math.cos(electronPosRef.current.theta) * electronPosRef.current.r;
      const ey = cy + Math.sin(electronPosRef.current.theta) * electronPosRef.current.r;

      ctx.shadowBlur = 15;
      ctx.shadowColor = "#38bdf8";
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath(); ctx.arc(ex, ey, 6, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "white"; ctx.lineWidth = 1; ctx.stroke();
      ctx.shadowBlur = 0;

      // --- Update & Draw Photons ---
      photonsRef.current = photonsRef.current.filter(p => {
         p.x += p.vx; p.y += p.vy;
         
         ctx.strokeStyle = p.color;
         ctx.lineWidth = 2;
         ctx.beginPath();
         // Squiggly photon wave
         for (let i = 0; i < 30; i += 2) {
            const px = p.x - (p.vx/5) * i;
            const py = p.y - (p.vy/5) * i;
            const perpX = -p.vy / 5;
            const perpY = p.vx / 5;
            const wave = Math.sin(i * 0.5 - t * 10) * 10;
            if (i === 0) ctx.moveTo(px + perpX * wave, py + perpY * wave);
            else ctx.lineTo(px + perpX * wave, py + perpY * wave);
         }
         ctx.stroke();

         return Math.abs(p.x - cx) < 1000 && Math.abs(p.y - cy) < 1000;
      });

      // --- Energy Level Diagram ---
      const dx = 60;
      const dy = arenaH - 100;
      const dw = 100;
      
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.beginPath(); ctx.moveTo(dx, dy); ctx.lineTo(dx, dy - 250); ctx.stroke();
      
      for (let i = 1; i <= 5; i++) {
         const energy = getEnergy(i);
         const ey_pos = dy + energy * 15; // Scaling energy to pixels
         
         ctx.strokeStyle = i === n ? "#38bdf8" : "rgba(255, 255, 255, 0.2)";
         ctx.lineWidth = i === n ? 3 : 1;
         ctx.beginPath(); ctx.moveTo(dx, ey_pos); ctx.lineTo(dx + dw, ey_pos); ctx.stroke();
         
         ctx.fillStyle = i === n ? "#38bdf8" : "rgba(255, 255, 255, 0.4)";
         ctx.font = "bold 9px Inter";
         ctx.textAlign = "right";
         ctx.fillText(`${energy.toFixed(2)} eV`, dx - 10, ey_pos + 4);
      }

      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.textAlign = "center";
      ctx.fillText("DIAGRAM ENERGI", dx + dw/2, dy + 20);
    };

    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, n, targetN, isTransitioning]);

  const triggerJump = (newN: number) => {
    if (newN === n || isTransitioning) return;
    setTargetN(newN);
    setIsTransitioning(true);
    
    // Absorption Photon (coming from outside)
    if (newN > n) {
       const arenaW = window.innerWidth - (window.innerWidth >= 1024 ? 320 : 0);
       const angle = Math.random() * Math.PI * 2;
       photonsRef.current.push({
          x: (arenaW/2) + Math.cos(angle) * 800,
          y: (window.innerHeight/2) + Math.sin(angle) * 800,
          vx: -Math.cos(angle) * 15,
          vy: -Math.sin(angle) * 15,
          color: "#eab308",
          active: true,
          type: "absorb"
       });
    }
  };

  const deltaE = Math.abs(getEnergy(targetN) - getEnergy(n)).toFixed(2);
  const wavelength = (1240 / parseFloat(deltaE)).toFixed(0);

  return (
    <div className="fixed inset-0 bg-zinc-950 flex flex-col lg:flex-row overflow-hidden font-sans select-none touch-none">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-30 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Link href="/simulasi" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-white transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Model Atom Bohr</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Struktur Atom • Transisi Elektron • Foton</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative pointer-events-none" />

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           
           {/* Transition Series Card */}
           <div className={`p-6 rounded-3xl border transition-all duration-500 text-center relative overflow-hidden ${targetN < n ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">
                 {targetN < n ? 'Emisi Energi' : 'Absorpsi Energi'}
              </div>
              <div className={`text-2xl font-black ${targetN < n ? 'text-emerald-400' : 'text-amber-400'}`}>
                 {targetN === 1 ? 'LYMAN' : targetN === 2 ? 'BALMER' : targetN === 3 ? 'PASCHEN' : 'SERIES'}
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                 <Zap className={`w-4 h-4 ${targetN < n ? 'text-emerald-400' : 'text-amber-400'}`} />
                 <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                   {targetN < n ? 'Melepas Foton' : 'Menyerap Foton'}
                 </span>
              </div>
           </div>

           {/* Analysis HUD */}
           <div className="bg-white/5 border border-white/10 p-5 rounded-3xl grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                 <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest mb-1">Selisih Energi (ΔE)</span>
                 <span className="text-sm font-black text-white">{deltaE} eV</span>
              </div>
              <div className="flex flex-col text-right">
                 <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest mb-1">Wavelength (λ)</span>
                 <span className="text-sm font-black text-sky-400">{wavelength} nm</span>
              </div>
           </div>

           {/* Controls */}
           <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 mb-1">
                 <Target className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Lompatan Kuantum</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                 {[1, 2, 3, 4, 5].map(level => (
                   <button key={level} onClick={() => triggerJump(level)} className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all border ${n === level && !isTransitioning ? 'bg-white/10 border-white/30 text-white shadow-lg' : 'bg-transparent border-white/5 text-zinc-600'}`}>
                      n = {level}
                   </button>
                 ))}
              </div>
           </div>

           {/* Physics Insight */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <Activity className="w-4 h-4 text-sky-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Postulat Bohr</span>
              </div>
              <div className="space-y-3 text-[10px] text-zinc-500 leading-relaxed italic">
                 <p>
                    <strong className="text-zinc-300">Lintasan Stasioner:</strong> Elektron hanya mengorbit pada level energi tertentu tanpa memancarkan energi secara terus-menerus.
                 </p>
                 <p>
                    <strong className="text-zinc-300">Quantum Leap:</strong> Perpindahan antar kulit ($n$) selalu disertai dengan pelepasan atau penyerapan energi dalam bentuk foton tunggal.
                 </p>
              </div>
           </div>

                      {/* Physics Insight */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-amber-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Wawasan Fisika</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                 "Elektron mengorbit inti pada tingkat energi kuantisasi tertentu. Foton diserap atau dipancarkan hanya saat elektron berpindah lintasan orbit."
              </p>
           </div>

           <div className="pt-6 border-t border-white/5">
              <button onClick={() => setIsRunning(!isRunning)} className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg border border-white/5">
                 {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                 {isRunning ? "Pause Orbit" : "Resume Orbit"}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
