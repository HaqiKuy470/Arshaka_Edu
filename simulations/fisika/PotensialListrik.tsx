"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box, Activity, ChevronRight, Flame, Settings, Share2, Lock, Unlock, Magnet, Target, Sparkles, Plus, Minus, Trash2, Eye, EyeOff, Layers } from "lucide-react";
import Link from "next/link";

export default function PotensialListrik() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [q, setQ] = useState(10); // μC
  const [showField, setShowField] = useState(true);
  const [showContours, setShowContours] = useState(true);
  const [probePos, setProbePos] = useState({ x: 100, y: -100 });
  const [isDragging, setIsDragging] = useState(false);

  const k = 8.987e9;

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

      // Draw Voltage Background (Potential Gradient)
      if (Math.abs(q) > 0) {
        const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 600);
        const color = q > 0 ? "239, 68, 68" : "59, 130, 246";
        grad.addColorStop(0, `rgba(${color}, 0.15)`);
        grad.addColorStop(0.5, `rgba(${color}, 0.05)`);
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width - sidebarWidth, canvas.height);
      }

      // Draw Equipotential Contours (V = kQ/r)
      if (showContours && Math.abs(q) > 0) {
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1;
        const color = q > 0 ? "rgba(252, 165, 165, 0.3)" : "rgba(147, 197, 253, 0.3)";
        ctx.strokeStyle = color;
        
        // We want lines at constant V. Since V = kQ/r, then r = kQ/V.
        // We'll just draw circles at specific radii for simplicity in this 1-charge case.
        for (let r = 50; r < 500; r += 50) {
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();
          
          // Label
          const v = (k * q * 1e-6) / (r * 1e-3); // scaled V
          ctx.fillStyle = "rgba(255,255,255,0.2)";
          ctx.font = "bold 9px Inter";
          ctx.fillText(`${(v/1000).toFixed(0)} kV`, cx + r * Math.cos(-Math.PI/4), cy + r * Math.sin(-Math.PI/4));
        }
        ctx.setLineDash([]);
      }

      // Draw Field Lines (Always perpendicular to contours)
      if (showField && Math.abs(q) > 0) {
        const numLines = 16;
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.lineWidth = 1;
        for (let i = 0; i < numLines; i++) {
          const angle = (i * Math.PI * 2) / numLines;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(angle) * 20, cy + Math.sin(angle) * 20);
          ctx.lineTo(cx + Math.cos(angle) * 800, cy + Math.sin(angle) * 800);
          ctx.stroke();

          // Arrow direction
          const arrowR = 150;
          ctx.fillStyle = "rgba(255,255,255,0.3)";
          ctx.beginPath();
          const ax = cx + Math.cos(angle) * arrowR;
          const ay = cy + Math.sin(angle) * arrowR;
          ctx.save();
          ctx.translate(ax, ay);
          ctx.rotate(q > 0 ? angle : angle + Math.PI);
          ctx.moveTo(0, -4); ctx.lineTo(8, 0); ctx.lineTo(0, 4);
          ctx.fill();
          ctx.restore();
        }
      }

      // Draw Charge
      const radius = 25;
      const color = q > 0 ? "#ef4444" : q < 0 ? "#3b82f6" : "#71717a";
      ctx.shadowBlur = 30;
      ctx.shadowColor = color;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "white";
      ctx.font = "bold 18px Inter";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(q > 0 ? "+" : q < 0 ? "-" : "0", cx, cy);

      // Draw Voltmeter Probe
      ctx.fillStyle = "#fbbf24";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#fbbf24";
      ctx.beginPath();
      ctx.arc(cx + probePos.x, cy + probePos.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Probe Line to Center
      ctx.strokeStyle = "rgba(251, 191, 36, 0.2)";
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + probePos.x, cy + probePos.y);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const animate = () => { render(); requestAnimationFrame(animate); };
    const raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [q, showField, showContours, probePos]);

  const handlePointerMove = (e: any) => {
    if (!isDragging) return;
    const sidebarWidth = window.innerWidth >= 1024 ? 320 : 0;
    const cx = (window.innerWidth - sidebarWidth) / 2;
    const cy = window.innerHeight / 2;
    const clientX = e.clientX || e.touches?.[0].clientX;
    const clientY = e.clientY || e.touches?.[0].clientY;
    setProbePos({ x: clientX - cx, y: clientY - cy });
  };

  // Calculate probe data
  const distPixels = Math.sqrt(probePos.x ** 2 + probePos.y ** 2);
  const potential = distPixels < 20 ? 0 : (k * q * 1e-6) / (distPixels * 1e-3);

  return (
    <div 
      className="fixed inset-0 bg-zinc-950 flex flex-col lg:flex-row overflow-hidden font-sans select-none touch-none"
      onPointerMove={handlePointerMove}
      onPointerUp={() => setIsDragging(false)}
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-30 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Link href="/simulasi" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-white transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Potensial Listrik</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Permukaan Ekipotensial • Voltase</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative pointer-events-none flex items-center justify-center">
         {/* Probe Tooltip */}
         <div 
           className="absolute pointer-events-auto cursor-crosshair transition-transform"
           style={{ 
             transform: `translate(${probePos.x}px, ${probePos.y}px)`,
             left: `calc(50% - ${window.innerWidth >= 1024 ? 160 : 0}px)`,
             top: '50%'
           }}
           onPointerDown={() => setIsDragging(true)}
         >
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-zinc-900/90 backdrop-blur border border-amber-500/50 p-2 rounded-lg shadow-2xl min-w-[100px]">
               <div className="text-[8px] font-black text-amber-500 uppercase tracking-widest mb-1">Voltmeter</div>
               <div className="text-lg font-black text-white font-mono leading-none">{(potential/1000).toFixed(1)}<span className="text-[10px] ml-1">kV</span></div>
            </div>
         </div>
      </div>

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           
           {/* Charge Control Card */}
           <div className={`p-6 rounded-3xl border transition-all duration-500 ${q > 0 ? 'bg-rose-500/5 border-rose-500/20' : q < 0 ? 'bg-sky-500/5 border-sky-500/20' : 'bg-white/5 border-white/10'}`}>
              <div className="flex justify-between items-center mb-4">
                 <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Muatan Pusat (Q)</span>
                    <span className={`text-3xl font-black ${q > 0 ? 'text-rose-500' : q < 0 ? 'text-sky-500' : 'text-zinc-500'}`}>{q} μC</span>
                 </div>
                 <Zap className={`w-6 h-6 ${q > 0 ? 'text-rose-500' : q < 0 ? 'text-sky-500' : 'text-zinc-500'}`} />
              </div>
              <input 
                type="range" 
                className={`w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/10 ${q > 0 ? 'accent-rose-500' : 'accent-sky-500'}`} 
                min="-50" max="50" step="5" value={q} 
                onChange={(e) => setQ(parseInt(e.target.value))} 
              />
           </div>

           {/* Visualization Options */}
           <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                 <Settings className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Opsi Visualisasi</span>
              </div>
              <div className="space-y-2">
                 {[
                    { id: 'contours', label: 'Ekipotensial (V)', active: showContours, toggle: () => setShowContours(!showContours), icon: Layers },
                    { id: 'field', label: 'Medan Listrik (E)', active: showField, toggle: () => setShowField(!showField), icon: Magnet }
                 ].map(opt => (
                    <button key={opt.id} onClick={opt.toggle} className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${opt.active ? 'bg-white/5 border-white/20 shadow-inner' : 'bg-transparent border-white/5 opacity-40'}`}>
                       <div className="flex items-center gap-3">
                          <opt.icon className="w-4 h-4 text-zinc-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">{opt.label}</span>
                       </div>
                       <div className={`w-2 h-2 rounded-full ${opt.active ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-zinc-700'}`} />
                    </button>
                 ))}
              </div>
           </div>

           {/* Educational Insight */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                 <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-amber-500" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Analisis Fisika</span>
              </div>
              <div className="space-y-3 text-[10px] text-zinc-500 leading-relaxed">
                 <p>
                    <strong className="text-zinc-300">Hubungan Tegak Lurus:</strong> Perhatikan bahwa garis medan (E) selalu menembus permukaan ekipotensial (V) pada sudut <span className="text-amber-500 font-bold">90 derajat</span>.
                 </p>
                 <p>
                    <strong className="text-zinc-300">Potensial:</strong> Semakin dekat ke muatan, permukaan ekipotensial semakin rapat, menandakan gradien voltase yang lebih curam.
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
                 "Permukaan ekipotensial adalah area imajiner dengan tegangan listrik yang sama rata, garis-garis ini selalu tegak lurus terhadap arah medan listrik."
              </p>
           </div>

           <div className="pt-6 border-t border-white/5 space-y-3">
              <button onClick={() => { setQ(10); setProbePos({x: 100, y: -100}); }} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 transition-all flex items-center justify-center gap-2 text-sm">
                 <RotateCcw className="w-4 h-4" /> Reset Simulasi
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
