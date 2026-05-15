"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box, Activity, ChevronRight, Flame, Settings, Share2, Lock, Unlock, Magnet, Target, Sparkles, Plus, Minus, Trash2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

interface Charge {
  id: string;
  x: number;
  y: number;
  q: number; // in nC
}

export default function MuatanMedanListrik() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [charges, setCharges] = useState<Charge[]>([
    { id: '1', x: -100, y: 0, q: 1 },
    { id: '2', x: 100, y: 0, q: -1 }
  ]);
  
  const [showField, setShowField] = useState(true);
  const [showVoltage, setShowVoltage] = useState(true);
  const [sensorPos, setSensorPos] = useState({ x: 0, y: -100 });
  
  const [isDragging, setIsDragging] = useState<string | 'sensor' | null>(null);

  const k = 8.987e9; // N·m²/C²

  const addCharge = (q: number) => {
    const newCharge: Charge = {
      id: Math.random().toString(36).substr(2, 9),
      x: (Math.random() - 0.5) * 100,
      y: (Math.random() - 0.5) * 100,
      q
    };
    setCharges([...charges, newCharge]);
  };

  const clearCharges = () => setCharges([]);

  // Physics Helpers
  const getFieldAt = (x: number, y: number) => {
    let Ex = 0;
    let Ey = 0;
    charges.forEach(c => {
      const dx = x - c.x;
      const dy = y - c.y;
      const r2 = dx * dx + dy * dy;
      const r = Math.sqrt(r2);
      if (r < 5) return;
      const E = (k * c.q * 1e-9) / (r2 * 1e-6); // scaled for display
      Ex += E * (dx / r);
      Ey += E * (dy / r);
    });
    return { Ex, Ey, Emag: Math.sqrt(Ex * Ex + Ey * Ey) };
  };

  const getVoltageAt = (x: number, y: number) => {
    let V = 0;
    charges.forEach(c => {
      const dx = x - c.x;
      const dy = y - c.y;
      const r = Math.sqrt(dx * dx + dy * dy);
      if (r < 5) return;
      V += (k * c.q * 1e-9) / (r * 1e-3); // scaled
    });
    return V;
  };

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

      // --- Draw Voltage Heatmap (Background) ---
      if (showVoltage && charges.length > 0) {
        const step = 20;
        for (let x = 0; x < canvas.width - sidebarWidth; x += step) {
          for (let y = 0; y < canvas.height; y += step) {
            const V = getVoltageAt(x - cx, y - cy);
            const alpha = Math.min(0.15, Math.abs(V) / 500000);
            ctx.fillStyle = V > 0 ? `rgba(239, 68, 68, ${alpha})` : `rgba(59, 130, 246, ${alpha})`;
            ctx.fillRect(x, y, step, step);
          }
        }
      }

      // --- Draw Field Lines (Streamlines) ---
      if (showField && charges.length > 0) {
        ctx.lineWidth = 1;
        charges.forEach(c => {
          if (c.q <= 0) return; // Start streamlines from positive charges
          const numSeeds = 12;
          for (let i = 0; i < numSeeds; i++) {
            const angle = (i * Math.PI * 2) / numSeeds;
            let sx = c.x + Math.cos(angle) * 20;
            let sy = c.y + Math.sin(angle) * 20;
            
            ctx.beginPath();
            ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
            ctx.moveTo(cx + sx, cy + sy);
            
            for (let step = 0; step < 50; step++) {
              const field = getFieldAt(sx, sy);
              if (field.Emag < 0.1) break;
              sx += (field.Ex / field.Emag) * 10;
              sy += (field.Ey / field.Emag) * 10;
              ctx.lineTo(cx + sx, cy + sy);
              
              // Stop if hits a negative charge or boundary
              let hitNegative = false;
              charges.forEach(target => {
                if (target.q < 0 && Math.sqrt((sx - target.x)**2 + (sy - target.y)**2) < 20) hitNegative = true;
              });
              if (hitNegative) break;
              if (Math.abs(sx) > 1000 || Math.abs(sy) > 1000) break;
            }
            ctx.stroke();
          }
        });
      }

      // --- Draw Charges ---
      charges.forEach(c => {
        const radius = 20;
        const color = c.q > 0 ? "#ef4444" : "#3b82f6";
        
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(cx + c.x, cy + c.y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.font = "bold 14px Inter";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(c.q > 0 ? "+" : "-", cx + c.x, cy + c.y);
      });

      // --- Draw Sensor ---
      const sField = getFieldAt(sensorPos.x, sensorPos.y);
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(cx + sensorPos.x, cy + sensorPos.y, 8, 0, Math.PI * 2);
      ctx.fill();
      
      if (sField.Emag > 0.1) {
        ctx.strokeStyle = "#fbbf24";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx + sensorPos.x, cy + sensorPos.y);
        ctx.lineTo(cx + sensorPos.x + (sField.Ex / sField.Emag) * 40, cy + sensorPos.y + (sField.Ey / sField.Emag) * 40);
        ctx.stroke();
      }
    };

    const animate = () => { render(); requestAnimationFrame(animate); };
    const raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [charges, showField, showVoltage, sensorPos]);

  const handlePointerDown = (e: any) => {
    const sidebarWidth = window.innerWidth >= 1024 ? 320 : 0;
    const cx = (window.innerWidth - sidebarWidth) / 2;
    const cy = window.innerHeight / 2;
    const clientX = e.clientX || e.touches?.[0].clientX;
    const clientY = e.clientY || e.touches?.[0].clientY;
    const mx = clientX - cx;
    const my = clientY - cy;

    if (Math.sqrt((mx - sensorPos.x)**2 + (my - sensorPos.y)**2) < 20) {
      setIsDragging('sensor');
      return;
    }

    const hit = charges.find(c => Math.sqrt((mx - c.x)**2 + (my - c.y)**2) < 25);
    if (hit) setIsDragging(hit.id);
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging) return;
    const sidebarWidth = window.innerWidth >= 1024 ? 320 : 0;
    const cx = (window.innerWidth - sidebarWidth) / 2;
    const cy = window.innerHeight / 2;
    const clientX = e.clientX || e.touches?.[0].clientX;
    const clientY = e.clientY || e.touches?.[0].clientY;
    const nx = clientX - cx;
    const ny = clientY - cy;

    if (isDragging === 'sensor') {
      setSensorPos({ x: nx, y: ny });
    } else {
      setCharges(charges.map(c => c.id === isDragging ? { ...c, x: nx, y: ny } : c));
    }
  };

  const sensorVoltage = getVoltageAt(sensorPos.x, sensorPos.y);
  const sensorField = getFieldAt(sensorPos.x, sensorPos.y);

  return (
    <div 
      className="fixed inset-0 bg-zinc-950 flex flex-col lg:flex-row overflow-hidden font-sans select-none touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={() => setIsDragging(null)}
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-30 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Link href="/simulasi" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-white transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Muatan & Medan Listrik</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Sandbox Elektrostatis • Potensial</span>
          </div>
        </div>
        <div className="flex gap-2 pointer-events-auto">
           <button onClick={() => setShowField(!showField)} className={`p-2.5 rounded-xl border transition-all ${showField ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/5 text-zinc-600'}`}>
              {showField ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
           </button>
           <button onClick={() => setShowVoltage(!showVoltage)} className={`p-2.5 rounded-xl border transition-all ${showVoltage ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' : 'bg-transparent border-white/5 text-zinc-600'}`}>
              <Waves className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="flex-1 relative pointer-events-none" />

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           
           {/* Sensor Card */}
           <div className="bg-amber-500/5 border border-amber-500/10 p-6 rounded-3xl shadow-inner relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              <div className="text-[10px] text-amber-500 font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Target className="w-3 h-3" /> Sensor Bacaan
              </div>
              <div className="space-y-4 font-mono">
                 <div className="flex justify-between items-end border-b border-white/5 pb-2">
                    <span className="text-[8px] text-zinc-500 uppercase font-bold tracking-widest leading-none mb-1">Potensial (V)</span>
                    <span className="text-2xl font-black text-white leading-none">{(sensorVoltage / 1000).toFixed(1)} <span className="text-xs text-zinc-500">kV</span></span>
                 </div>
                 <div className="flex justify-between items-end">
                    <span className="text-[8px] text-zinc-500 uppercase font-bold tracking-widest leading-none mb-1">Medan (E)</span>
                    <span className="text-2xl font-black text-amber-400 leading-none">{(sensorField.Emag / 1000).toFixed(2)} <span className="text-xs text-zinc-500">V/m</span></span>
                 </div>
              </div>
           </div>

           {/* Toolbox */}
           <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                 <Box className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Alat & Muatan</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                 <button onClick={() => addCharge(1)} className="flex items-center justify-center gap-2 py-4 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all font-bold">
                    <Plus className="w-5 h-5" /> 1 nC
                 </button>
                 <button onClick={() => addCharge(-1)} className="flex items-center justify-center gap-2 py-4 bg-sky-500/10 border border-sky-500/30 text-sky-500 rounded-2xl hover:bg-sky-500 hover:text-white transition-all font-bold">
                    <Minus className="w-5 h-5" /> 1 nC
                 </button>
              </div>
              <button onClick={clearCharges} className="w-full py-3 bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 text-zinc-400 rounded-xl transition-all border border-white/5 flex items-center justify-center gap-2 text-xs font-bold mt-2">
                 <Trash2 className="w-4 h-4" /> Bersihkan Kanvas
              </button>
           </div>

           {/* Settings Toggle */}
           <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 mb-1">
                 <Settings className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Opsi Tampilan</span>
              </div>
              <div className="space-y-2">
                 {[
                    { label: "Voltage Map", active: showVoltage, toggle: () => setShowVoltage(!showVoltage), icon: Waves },
                    { label: "Electric Field Lines", active: showField, toggle: () => setShowField(!showField), icon: Eye }
                 ].map(opt => (
                    <button key={opt.label} onClick={opt.toggle} className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${opt.active ? 'bg-white/5 border-white/20' : 'bg-transparent border-white/5 opacity-50'}`}>
                       <div className="flex items-center gap-3">
                          <opt.icon className="w-4 h-4 text-zinc-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">{opt.label}</span>
                       </div>
                       <div className={`w-2 h-2 rounded-full ${opt.active ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-zinc-700'}`} />
                    </button>
                 ))}
              </div>
           </div>

                      {/* Physics Insight */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-amber-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Wawasan Fisika</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                 "Medan listrik menyebar keluar dari muatan positif dan masuk ke muatan negatif. Kerapatan garis medan secara visual merepresentasikan kuat medan di area tersebut."
              </p>
           </div>

           <div className="pt-6 border-t border-white/5 space-y-3">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[9px] text-zinc-500 leading-relaxed space-y-2">
                 <p className="font-bold text-zinc-400 uppercase tracking-widest border-b border-white/5 pb-1 mb-2 text-center text-[8px]">Teori Dasar</p>
                 <p className="italic text-center">"Garis medan keluar dari muatan positif dan masuk ke muatan negatif. Kerapatan garis menunjukkan kuat medan listrik."</p>
              </div>
              <p className="text-[8px] text-zinc-600 text-center uppercase tracking-tighter">Drag muatan atau sensor kuning untuk memantau data.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
