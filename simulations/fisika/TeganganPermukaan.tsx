"use client";

import { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Magnet, FlaskConical } from "lucide-react";
import Link from "next/link";

export default function TeganganPermukaan() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Settings
  const [liquid, setLiquid] = useState<"water" | "soap" | "mercury">("water");
  const [objectMass, setObjectMass] = useState(5); // grams

  // Physics Data
  const gammaValues = {
    water: 72,   // mN/m
    soap: 25,    // mN/m
    mercury: 485 // mN/m
  };

  const gamma = gammaValues[liquid];
  const maxMass = gamma / 5; // Simplified threshold for visual
  const isFloating = objectMass <= maxMass;

  // Animation Refs
  const currentYRef = useRef(0);
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

      // Tank Dimensions
      const tankW = 340;
      const tankH = 300;
      const tx = cx - tankW / 2;
      const ty = cy - tankH / 4;
      const waterLevel = ty + 80;

      // --- Draw Tank Background ---
      ctx.fillStyle = "rgba(255,255,255,0.02)";
      ctx.fillRect(tx, ty, tankW, tankH);

      // Liquid Colors
      let liquidColor = "rgba(14, 165, 233, 0.3)"; // Water
      let surfaceColor = "#38bdf8";
      if (liquid === 'soap') { liquidColor = "rgba(232, 121, 249, 0.2)"; surfaceColor = "#e879f9"; }
      if (liquid === 'mercury') { liquidColor = "rgba(113, 113, 122, 0.7)"; surfaceColor = "#a1a1aa"; }

      // --- Draw Liquid Body ---
      ctx.fillStyle = liquidColor;
      ctx.fillRect(tx, waterLevel, tankW, tankH - 80);

      // --- Draw Molecular Grid (Subtle Cohesion) ---
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      for (let x = tx + 10; x < tx + tankW; x += 20) {
        for (let y = waterLevel + 20; y < ty + tankH; y += 20) {
           ctx.beginPath();
           ctx.arc(x, y, 1, 0, Math.PI * 2);
           ctx.fill();
        }
      }

      // --- Target Position for Object ---
      const targetY = isFloating ? waterLevel + objectMass * 1.5 : ty + tankH - 10;
      const diff = targetY - currentYRef.current;
      currentYRef.current += diff * 0.08;

      // --- Draw Flexible Surface Membrane ---
      ctx.beginPath();
      ctx.strokeStyle = surfaceColor;
      ctx.lineWidth = 3;
      ctx.moveTo(tx, waterLevel);
      
      if (isFloating) {
        const indentWidth = 80;
        ctx.lineTo(cx - indentWidth, waterLevel);
        ctx.bezierCurveTo(cx - indentWidth/2, waterLevel, cx - 40, currentYRef.current + 5, cx, currentYRef.current + 5);
        ctx.bezierCurveTo(cx + 40, currentYRef.current + 5, cx + indentWidth/2, waterLevel, cx + indentWidth, waterLevel);
        ctx.lineTo(tx + tankW, waterLevel);
      } else {
        // Surface is broken
        ctx.lineTo(cx - 30, waterLevel);
        ctx.moveTo(cx + 30, waterLevel);
        ctx.lineTo(tx + tankW, waterLevel);
      }
      ctx.stroke();

      // --- Draw Object (Needle/Paperclip) ---
      const objW = 60;
      const ox = cx - objW / 2;
      const oy = currentYRef.current;

      ctx.save();
      ctx.shadowBlur = 15;
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.fillStyle = "#fbbf24"; // Amber/Gold metallic
      ctx.beginPath();
      ctx.roundRect(ox, oy - 2, objW, 4, 2);
      ctx.fill();
      
      // Metallic sheen
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fillRect(ox + 5, oy - 1, objW - 10, 1);
      ctx.restore();

      // --- Forces Visualization ---
      if (isFloating) {
        const arrowX = cx;
        const wLen = 15 + objectMass * 2;
        
        // Weight Vector (Down)
        ctx.strokeStyle = "#f43f5e";
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(arrowX - 10, oy); ctx.lineTo(arrowX - 10, oy + wLen); ctx.stroke();
        ctx.fillStyle = "#f43f5e";
        ctx.beginPath(); ctx.moveTo(arrowX - 10, oy + wLen); ctx.lineTo(arrowX - 14, oy + wLen - 5); ctx.lineTo(arrowX - 6, oy + wLen - 5); ctx.fill();
        ctx.font = "bold 9px Inter";
        ctx.fillText("W", arrowX - 10, oy + wLen + 10);

        // Surface Tension Forces (Upwards at the edges of contact)
        ctx.strokeStyle = "#10b981";
        ctx.beginPath(); ctx.moveTo(arrowX + 10, oy); ctx.lineTo(arrowX + 10, oy - wLen); ctx.stroke();
        ctx.fillStyle = "#10b981";
        ctx.beginPath(); ctx.moveTo(arrowX + 10, oy - wLen); ctx.lineTo(arrowX + 6, oy - wLen + 5); ctx.lineTo(arrowX + 14, oy - wLen + 5); ctx.fill();
        ctx.fillText("Fγ", arrowX + 10, oy - wLen - 5);
      }

      // --- Tank Border ---
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 2;
      ctx.strokeRect(tx, ty, tankW, tankH);

      // Status Badge (Over Object)
      if (!isFloating && currentYRef.current > waterLevel + 20) {
         ctx.fillStyle = "#f43f5e";
         ctx.font = "bold 10px Inter";
         ctx.textAlign = "center";
         ctx.fillText("SELAPUT PECAH", cx, waterLevel - 20);
      }
    };

    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [liquid, objectMass, isFloating]);

  const reset = () => {
    setLiquid("water");
    setObjectMass(5);
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
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Tegangan Permukaan</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Kohesi Molekul • Fisika</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative" />

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           
           {/* Analysis Section */}
           <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                 <ShieldAlert className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Analisis Gaya</span>
              </div>
              <div className="glass-card p-4 rounded-2xl border border-white/5 bg-white/5 space-y-4 font-mono">
                 <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Koefisien (γ)</span>
                       <span className="text-xl font-black text-white">{gamma} <span className="text-[10px] text-zinc-500 font-bold">mN/m</span></span>
                    </div>
                    <Waves className={`w-5 h-5 ${isFloating ? 'text-emerald-500/50' : 'text-rose-500/50'}`} />
                 </div>
                 <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Massa Benda</span>
                       <span className="text-xl font-black text-amber-400">{objectMass} <span className="text-[10px] text-zinc-500 font-bold">gram</span></span>
                    </div>
                    <Move className="w-5 h-5 text-amber-500/50" />
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-zinc-500 uppercase font-bold">Kapasitas Maks</span>
                       <span className="text-xl font-black text-sky-400">{maxMass.toFixed(1)} <span className="text-[10px] text-zinc-500 font-bold">gram</span></span>
                    </div>
                    <Gauge className="w-5 h-5 text-sky-500/50" />
                 </div>
              </div>
           </div>

           {/* Input Section */}
           <div className="space-y-6 pt-2">
              <div className="flex items-center gap-2 mb-2">
                 <FlaskConical className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Jenis Cairan</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                 {[
                   { id: 'water', name: 'Air Murni', val: 72, color: 'text-sky-400' },
                   { id: 'soap', name: 'Air Sabun', val: 25, color: 'text-fuchsia-400' },
                   { id: 'mercury', name: 'Raksa', val: 485, color: 'text-zinc-400' }
                 ].map(l => (
                   <button key={l.id} onClick={() => setLiquid(l.id as any)} className={`p-4 rounded-2xl border transition-all text-left group ${liquid === l.id ? 'bg-white/10 border-white/20' : 'bg-transparent border-white/5 hover:bg-white/5'}`}>
                      <div className="flex justify-between items-center">
                         <span className={`text-xs font-bold ${l.color}`}>{l.name}</span>
                         <span className="text-[9px] text-zinc-500 font-mono">γ={l.val}</span>
                      </div>
                   </button>
                 ))}
              </div>

              <div className="space-y-3">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Massa Benda: {objectMass} g</label>
                 </div>
                 <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-amber-500" min="1" max="150" step="1" value={objectMass} onChange={(e) => setObjectMass(parseInt(e.target.value))} />
              </div>
           </div>

                      {/* Physics Insight */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-amber-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Wawasan Fisika</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                 "Gaya kohesi tarik-menarik antar molekul di lapisan permukaan cairan akan menciptakan sejenis selaput elastis yang mampu menahan objek bermassa ringan."
              </p>
           </div>

           <div className="pt-6 border-t border-white/5 space-y-3">
              <button onClick={reset} className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg border border-white/5">
                 <RotateCcw className="w-4 h-4" /> Reset Simulasi
              </button>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                 <p className="text-[9px] text-zinc-500 leading-relaxed text-center italic">
                    "Tegangan permukaan terjadi karena molekul di permukaan cairan tertarik lebih kuat ke dalam oleh molekul di bawahnya."
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
