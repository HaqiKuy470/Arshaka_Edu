"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box, Activity, ChevronRight, Flame, Settings, Share2, Lock, Unlock, Magnet, Target, Sparkles, Battery, Lightbulb, RefreshCcw, Sun, Filter, Microscope, Power } from "lucide-react";
import Link from "next/link";

interface Electron {
  pos: number; // 0 to 1 along the circuit path
}

export default function RangkaianListrik() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Parameters
  const [voltage, setVoltage] = useState(12);
  const [resistance, setResistance] = useState(10);
  const [isClosed, setIsClosed] = useState(false);
  const [showElectrons, setShowElectrons] = useState(true);

  const animationRef = useRef(0);
  const electronsRef = useRef<Electron[]>([]);
  const timeRef = useRef(0);

  // Derived Values
  const current = isClosed ? voltage / resistance : 0;
  const power = isClosed ? (voltage * voltage) / resistance : 0;

  useEffect(() => {
    // Init electrons
    const e: Electron[] = [];
    for (let i = 0; i < 40; i++) {
       e.push({ pos: i / 40 });
    }
    electronsRef.current = e;
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

      // Update Electrons
      if (isClosed) {
         timeRef.current += current * 0.05;
         electronsRef.current.forEach(e => {
            e.pos = (e.pos + current * 0.005) % 1;
         });
      }

      // --- Draw Circuit Path (Rectangular) ---
      const rectW = 400;
      const rectH = 250;
      const rx = cx - rectW / 2;
      const ry = cy - rectH / 2;

      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 4;
      ctx.strokeRect(rx, ry, rectW, rectH);

      if (isClosed) {
         ctx.strokeStyle = "rgba(56, 189, 248, 0.3)";
         ctx.lineWidth = 6;
         ctx.shadowBlur = 10; ctx.shadowColor = "#38bdf8";
         ctx.strokeRect(rx, ry, rectW, rectH);
         ctx.shadowBlur = 0;
      }

      // --- Components ---
      
      // 1. Battery (Left)
      const batY = cy;
      const batX = rx;
      ctx.fillStyle = "#18181b";
      ctx.fillRect(batX - 15, batY - 30, 30, 60);
      ctx.strokeStyle = "white"; ctx.lineWidth = 2;
      ctx.strokeRect(batX - 15, batY - 30, 30, 60);
      ctx.fillStyle = "#eab308"; ctx.fillRect(batX - 15, batY - 30, 30, 15);
      ctx.fillStyle = "white"; ctx.font = "bold 10px Inter"; ctx.textAlign = "center";
      ctx.fillText(`${voltage}V`, batX, batY + 5);

      // 2. Resistor (Top)
      const resX = cx;
      const resY = ry;
      ctx.fillStyle = "#d4d4d8";
      ctx.fillRect(resX - 30, resY - 10, 60, 20);
      // Resistor bands
      ctx.fillStyle = "#ef4444"; ctx.fillRect(resX - 20, resY - 10, 5, 20);
      ctx.fillStyle = "#3b82f6"; ctx.fillRect(resX - 5, resY - 10, 5, 20);
      ctx.fillStyle = "#eab308"; ctx.fillRect(resX + 10, resY - 10, 5, 20);
      ctx.fillStyle = "white"; ctx.fillText(`${resistance}Ω`, resX, resY - 15);

      // 3. Bulb (Right)
      const bulbX = rx + rectW;
      const bulbY = cy;
      const glow = Math.min(1, power / 50);
      if (isClosed) {
         ctx.shadowBlur = 30 * glow; ctx.shadowColor = "#fde047";
         ctx.fillStyle = `rgba(253, 224, 71, ${0.2 + glow * 0.8})`;
         ctx.beginPath(); ctx.arc(bulbX, bulbY, 25, 0, Math.PI * 2); ctx.fill();
         ctx.shadowBlur = 0;
      }
      ctx.strokeStyle = "white"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(bulbX, bulbY, 20, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = "#3f3f46"; ctx.fillRect(bulbX - 10, bulbY + 20, 20, 15);

      // 4. Switch (Bottom)
      const swX = cx;
      const swY = ry + rectH;
      ctx.strokeStyle = "white"; ctx.lineWidth = 4;
      if (isClosed) {
         ctx.beginPath(); ctx.moveTo(swX - 20, swY); ctx.lineTo(swX + 20, swY); ctx.stroke();
      } else {
         ctx.beginPath(); ctx.moveTo(swX - 20, swY); ctx.lineTo(swX + 20, swY - 20); ctx.stroke();
      }
      ctx.fillStyle = "#ef4444";
      ctx.beginPath(); ctx.arc(swX - 20, swY, 4, 0, Math.PI * 2); ctx.arc(swX + 20, swY, 4, 0, Math.PI * 2); ctx.fill();

      // --- Electrons ---
      if (showElectrons && isClosed) {
         electronsRef.current.forEach(e => {
            const p = e.pos;
            let ex, ey;
            // Map 0-1 to rectangle perimeter
            const perim = 2 * (rectW + rectH);
            const dist = p * perim;
            if (dist < rectW) { // Top
               ex = rx + dist; ey = ry;
            } else if (dist < rectW + rectH) { // Right
               ex = rx + rectW; ey = ry + (dist - rectW);
            } else if (dist < 2 * rectW + rectH) { // Bottom
               ex = rx + rectW - (dist - (rectW + rectH)); ey = ry + rectH;
            } else { // Left
               ex = rx; ey = ry + rectH - (dist - (2 * rectW + rectH));
            }
            
            ctx.fillStyle = "#38bdf8";
            ctx.shadowBlur = 5; ctx.shadowColor = "#38bdf8";
            ctx.beginPath(); ctx.arc(ex, ey, 2, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
         });
      }
    };

    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isClosed, voltage, resistance, showElectrons, current, power]);

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
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Rangkaian Listrik DC</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Hukum Ohm • Arus Searah • Daya Listrik</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative pointer-events-none" />

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           
           {/* Circuit HUD */}
           <div className="bg-white/5 border border-white/10 p-5 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                 <Activity className="w-4 h-4 text-sky-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Analisis Sirkuit</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest mb-1">Arus (I)</span>
                    <span className="text-sm font-black text-white">{current.toFixed(2)} A</span>
                 </div>
                 <div className="flex flex-col text-right">
                    <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest mb-1">Daya (P)</span>
                    <span className="text-sm font-black text-amber-400">{power.toFixed(1)} W</span>
                 </div>
              </div>
           </div>

           {/* Parameters */}
           <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 mb-1">
                 <Settings className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Komponen Aktif</span>
              </div>
              
              <div className="bg-white/5 p-5 rounded-3xl border border-white/10 space-y-6">
                 <div className="space-y-3">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Tegangan (V)</label>
                       <span className="text-xs font-black text-emerald-400">{voltage} V</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-400" min="0" max="48" step="1" value={voltage} onChange={(e) => setVoltage(parseInt(e.target.value))} />
                 </div>

                 <div className="space-y-3">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Hambatan (R)</label>
                       <span className="text-xs font-black text-rose-400">{resistance} Ω</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-400" min="1" max="100" step="1" value={resistance} onChange={(e) => setResistance(parseInt(e.target.value))} />
                 </div>
              </div>
           </div>

           {/* Toggle Electrons */}
           <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <Sparkles className="w-4 h-4 text-zinc-500" />
                 <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">Aliran Elektron</span>
              </div>
              <button onClick={() => setShowElectrons(!showElectrons)} className={`w-10 h-5 rounded-full relative transition-all ${showElectrons ? 'bg-sky-500' : 'bg-zinc-700'}`}>
                 <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${showElectrons ? 'right-1' : 'left-1'}`} />
              </button>
           </div>

           {/* Physics Insight */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-amber-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Hukum Ohm</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                 "Besar arus listrik (I) yang mengalir melalui sebuah penghantar berbanding lurus dengan beda potensial (V) dan berbanding terbalik dengan hambatan (R)."
              </p>
           </div>

           <div className="pt-6 border-t border-white/5 flex gap-2">
              <button onClick={() => setIsClosed(!isClosed)} className={`flex-1 py-4 font-black rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg ${isClosed ? 'bg-rose-500 hover:bg-rose-400 text-white' : 'bg-emerald-500 hover:bg-emerald-400 text-white'}`}>
                 <Power className="w-4 h-4" />
                 {isClosed ? "OPEN SWITCH" : "CLOSE SWITCH"}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
