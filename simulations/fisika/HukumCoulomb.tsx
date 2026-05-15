"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box, Activity, ChevronRight, Flame, Settings, Share2, Lock, Unlock, Magnet, Target, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HukumCoulomb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [q1, setQ1] = useState(5); // μC
  const [q2, setQ2] = useState(-5); // μC
  
  // Charge positions (relative to canvas center)
  const [pos1, setPos1] = useState({ x: -150, y: 0 });
  const [pos2, setPos2] = useState({ x: 150, y: 0 });
  
  const [isDragging, setIsDragging] = useState<number | null>(null);
  const [showField, setShowField] = useState(true);

  // Constants
  const k = 8.987e9; // N·m²/C²
  
  // Calculate physics
  const dx = pos2.x - pos1.x;
  const dy = pos2.y - pos1.y;
  const rPixels = Math.sqrt(dx * dx + dy * dy);
  const rMeters = rPixels / 1000; // Scale: 1000px = 1m
  
  const force = (k * Math.abs(q1 * 1e-6) * Math.abs(q2 * 1e-6)) / Math.pow(rMeters, 2);
  const isAttract = (q1 * q2) < 0;

  const animationRef = useRef(0);

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

      // --- Draw Field Lines (Subtle Grid) ---
      if (showField) {
        ctx.lineWidth = 1;
        const step = 40;
        for (let x = 0; x < canvas.width - sidebarWidth; x += step) {
          for (let y = 0; y < canvas.height; y += step) {
            const rx1 = x - (cx + pos1.x);
            const ry1 = y - (cy + pos1.y);
            const r1sq = rx1 * rx1 + ry1 * ry1;
            
            const rx2 = x - (cx + pos2.x);
            const ry2 = y - (cy + pos2.y);
            const r2sq = rx2 * rx2 + ry2 * ry2;

            // Simple vector sum of field E = kQ/r^2
            const Ex = (q1 * rx1 / Math.pow(r1sq, 1.5)) + (q2 * rx2 / Math.pow(r2sq, 1.5));
            const Ey = (q1 * ry1 / Math.pow(r1sq, 1.5)) + (q2 * ry2 / Math.pow(r2sq, 1.5));
            const Emag = Math.sqrt(Ex * Ex + Ey * Ey);
            
            if (Emag > 0) {
              const angle = Math.atan2(Ey, Ex);
              ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(0.2, Emag * 1e8)})`;
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(x + Math.cos(angle) * 10, y + Math.sin(angle) * 10);
              ctx.stroke();
            }
          }
        }
      }

      // --- Draw Force Vectors (Arrows) ---
      const angle = Math.atan2(dy, dx);
      const forceScale = Math.log10(force + 1) * 20;
      
      const drawForceArrow = (startX: number, startY: number, dir: number, color: string) => {
        const endX = startX + Math.cos(angle) * forceScale * dir;
        const endY = startY + Math.sin(angle) * forceScale * dir;
        
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Arrow head
        const headSize = 8;
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - headSize * Math.cos(angle - Math.PI/6) * dir, endY - headSize * Math.sin(angle - Math.PI/6) * dir);
        ctx.lineTo(endX - headSize * Math.cos(angle + Math.PI/6) * dir, endY - headSize * Math.sin(angle + Math.PI/6) * dir);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.shadowBlur = 0;
      };

      if (force > 0.001) {
        const color = isAttract ? "#10b981" : "#ef4444";
        const dir1 = isAttract ? 1 : -1;
        const dir2 = isAttract ? -1 : 1;
        drawForceArrow(cx + pos1.x, cy + pos1.y, dir1, color);
        drawForceArrow(cx + pos2.x, cy + pos2.y, dir2, color);
      }

      // --- Draw Distance Line ---
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.beginPath();
      ctx.moveTo(cx + pos1.x, cy + pos1.y);
      ctx.lineTo(cx + pos2.x, cy + pos2.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // --- Draw Charges ---
      const drawCharge = (p: { x: number, y: number }, q: number, label: string) => {
        const radius = 25;
        const color = q > 0 ? "#ef4444" : q < 0 ? "#3b82f6" : "#71717a";
        
        ctx.shadowBlur = 20;
        ctx.shadowColor = color;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(cx + p.x, cy + p.y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.font = "bold 16px Inter";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(q > 0 ? "+" : q < 0 ? "-" : "0", cx + p.x, cy + p.y);
        
        ctx.font = "bold 9px Inter";
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.fillText(label, cx + p.x, cy + p.y + radius + 15);
      };

      drawCharge(pos1, q1, `q1: ${q1} μC`);
      drawCharge(pos2, q2, `q2: ${q2} μC`);
    };

    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [q1, q2, pos1, pos2, showField, force, isAttract]);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const sidebarWidth = window.innerWidth >= 1024 ? 320 : 0;
    const cx = (window.innerWidth - sidebarWidth) / 2;
    const cy = window.innerHeight / 2;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const mx = clientX - cx;
    const my = clientY - cy;
    
    if (Math.sqrt((mx - pos1.x)**2 + (my - pos1.y)**2) < 30) setIsDragging(1);
    else if (Math.sqrt((mx - pos2.x)**2 + (my - pos2.y)**2) < 30) setIsDragging(2);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    
    const sidebarWidth = window.innerWidth >= 1024 ? 320 : 0;
    const cx = (window.innerWidth - sidebarWidth) / 2;
    const cy = window.innerHeight / 2;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const nextPos = { x: clientX - cx, y: clientY - cy };
    
    if (isDragging === 1) setPos1(nextPos);
    else setPos2(nextPos);
  };

  const reset = () => {
    setQ1(5);
    setQ2(-5);
    setPos1({ x: -150, y: 0 });
    setPos2({ x: 150, y: 0 });
  };

  return (
    <div 
      className="fixed inset-0 bg-zinc-950 flex flex-col lg:flex-row overflow-hidden font-sans select-none touch-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={() => setIsDragging(null)}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={() => setIsDragging(null)}
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-30 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Link href="/simulasi" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-white transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Hukum Coulomb</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Interaksi Muatan Listrik • Gaya Statis</span>
          </div>
        </div>
        <div className="pointer-events-auto">
           <button onClick={() => setShowField(!showField)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${showField ? 'bg-sky-500/20 border-sky-500/50 text-sky-400' : 'bg-white/5 border-white/10 text-zinc-500'}`}>
              Field Lines: {showField ? 'ON' : 'OFF'}
           </button>
        </div>
      </div>

      <div className="flex-1 relative pointer-events-none" />

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           
           {/* Force Card */}
           <div className="bg-black/40 border border-white/10 p-6 rounded-3xl text-center shadow-inner relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">Gaya Coulomb (F)</div>
              <div className={`text-4xl font-black transition-colors duration-500 ${isAttract ? 'text-emerald-400' : 'text-rose-400'}`}>
                {force < 0.1 ? "0.00" : force.toFixed(2)}<span className="text-xl ml-1">N</span>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                 <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${isAttract ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'}`}>
                    {force < 0.1 ? "Netral" : isAttract ? "Tarik Menarik" : "Tolak Menolak"}
                 </div>
              </div>
           </div>

           {/* Analysis Card */}
           <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                 <ShieldAlert className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Analisis Vektor</span>
              </div>
              <div className="glass-card p-4 rounded-2xl border border-white/5 bg-white/5 space-y-4 font-mono">
                 <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Jarak (r)</span>
                       <span className="text-xl font-black text-white">{(rPixels / 10).toFixed(1)} <span className="text-[10px] text-zinc-500">cm</span></span>
                    </div>
                    <Ruler className="w-5 h-5 text-zinc-500/50" />
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Konstanta (k)</span>
                       <span className="text-xl font-black text-amber-500">9.0 <span className="text-[10px] text-zinc-500">x 10⁹</span></span>
                    </div>
                    <Sparkles className="w-5 h-5 text-amber-500/50" />
                 </div>
              </div>
           </div>

           {/* Charge Controls */}
           <div className="space-y-6 pt-2">
              <div className="flex items-center gap-2 mb-1">
                 <Zap className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Magnitude Muatan</span>
              </div>
              
              <div className="space-y-4">
                 <div className="bg-rose-500/5 p-4 rounded-2xl border border-rose-500/10">
                    <div className="flex justify-between items-center mb-2">
                       <label className="text-[9px] font-bold text-rose-400 uppercase tracking-widest">Muatan 1 (q1)</label>
                       <span className="text-xs font-mono text-rose-400">{q1} μC</span>
                    </div>
                    <input 
                      type="range" 
                      className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-500" 
                      min="-10" max="10" step="1" value={q1} 
                      onChange={(e) => setQ1(parseInt(e.target.value))} 
                    />
                 </div>

                 <div className="bg-sky-500/5 p-4 rounded-2xl border border-sky-500/10">
                    <div className="flex justify-between items-center mb-2">
                       <label className="text-[9px] font-bold text-sky-400 uppercase tracking-widest">Muatan 2 (q2)</label>
                       <span className="text-xs font-mono text-sky-400">{q2} μC</span>
                    </div>
                    <input 
                      type="range" 
                      className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-sky-400" 
                      min="-10" max="10" step="1" value={q2} 
                      onChange={(e) => setQ2(parseInt(e.target.value))} 
                    />
                 </div>
              </div>
           </div>

           <div className="pt-6 border-t border-white/5 space-y-3">
              <button onClick={reset} className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg border border-white/5">
                 <RotateCcw className="w-4 h-4" /> Reset Posisi & Muatan
              </button>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[9px] text-zinc-500 leading-relaxed space-y-2">
                 <p className="font-bold text-zinc-400 uppercase tracking-widest border-b border-white/5 pb-1 mb-2 text-center">Petunjuk</p>
                 <p className="text-center italic">"Gunakan mouse atau sentuhan untuk menggeser muatan secara langsung di layar."</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
