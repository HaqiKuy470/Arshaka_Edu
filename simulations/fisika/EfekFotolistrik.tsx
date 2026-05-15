"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, Zap, Move, ShieldAlert, Timer, Ruler, Droplets, Waves, Gauge, Thermometer, Box, Activity, ChevronRight, Flame, Settings, Share2, Lock, Unlock, Magnet, Target, Sparkles, Battery, Lightbulb, RefreshCcw, Sun, Filter, Microscope, ZapOff } from "lucide-react";
import Link from "next/link";

type Metal = { name: string; phi: number; color: string };
const METALS: Metal[] = [
  { name: "Sodium", phi: 2.28, color: "#cbd5e1" },
  { name: "Zinc", phi: 4.33, color: "#94a3b8" },
  { name: "Copper", phi: 4.70, color: "#b45309" },
  { name: "Platinum", phi: 6.35, color: "#e2e8f0" },
];

function nmToRGB(wavelength: number): string {
    let r, g, b;
    if (wavelength >= 380 && wavelength < 440) {
        r = (-(wavelength - 440) / (440 - 380)); g = 0; b = 1;
    } else if (wavelength >= 440 && wavelength < 490) {
        r = 0; g = (wavelength - 440) / (490 - 440); b = 1;
    } else if (wavelength >= 490 && wavelength < 510) {
        r = 0; g = 1; b = (-(wavelength - 510) / (510 - 490));
    } else if (wavelength >= 510 && wavelength < 580) {
        r = (wavelength - 510) / (580 - 510); g = 1; b = 0;
    } else if (wavelength >= 580 && wavelength < 645) {
        r = 1; g = (-(wavelength - 645) / (645 - 580)); b = 0;
    } else if (wavelength >= 645 && wavelength <= 780) {
        r = 1; g = 0; b = 0;
    } else {
        r = 0.5; g = 0.5; b = 1.0; // UV-ish
    }
    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
}

export default function EfekFotolistrik() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  
  // Parameters
  const [wavelength, setWavelength] = useState(400); // nm
  const [intensity, setIntensity] = useState(50); // %
  const [voltage, setVoltage] = useState(0); // V
  const [metal, setMetal] = useState(METALS[0]);

  const photonsRef = useRef<{x: number, y: number, vx: number, vy: number}[]>([]);
  const electronsRef = useRef<{x: number, y: number, vx: number, vy: number, life: number}[]>([]);
  const animationRef = useRef(0);
  const timeRef = useRef(0);

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

      if (isRunning) timeRef.current += 1;

      // Physics Constants
      const h_eV_s = 4.135e-15;
      const c = 3e8;
      const E_photon = 1240 / wavelength; // eV
      const K_max = E_photon - metal.phi;
      const isEmissionPossible = K_max > 0;

      // --- Draw Vacuum Tube ---
      const tubeW = 400;
      const tubeH = 200;
      const tubeX = cx - tubeW/2;
      const tubeY = cy - tubeH/2;

      const tubeGrad = ctx.createLinearGradient(tubeX, tubeY, tubeX, tubeY + tubeH);
      tubeGrad.addColorStop(0, "rgba(255, 255, 255, 0.05)");
      tubeGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.1)");
      tubeGrad.addColorStop(1, "rgba(255, 255, 255, 0.05)");
      ctx.fillStyle = tubeGrad;
      ctx.roundRect(tubeX, tubeY, tubeW, tubeH, 40);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"; ctx.lineWidth = 2; ctx.stroke();

      // Electrodes
      const cathX = tubeX + 40;
      const anodeX = tubeX + tubeW - 40;
      
      // Cathode (Metal Plate)
      ctx.fillStyle = metal.color;
      ctx.shadowBlur = 10; ctx.shadowColor = metal.color;
      ctx.roundRect(cathX - 10, cy - 60, 20, 120, 4);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Anode (Target)
      ctx.fillStyle = "#52525b";
      ctx.roundRect(anodeX - 10, cy - 60, 20, 120, 4);
      ctx.fill();

      // --- Emission Logic ---
      if (isRunning) {
         // Emit Photons
         if (timeRef.current % Math.floor(11 - intensity/10) === 0) {
            photonsRef.current.push({
               x: cx - 300,
               y: cy - 150 + Math.random() * 50,
               vx: 4,
               vy: 2
            });
         }

         // Update Photons
         photonsRef.current = photonsRef.current.filter(p => {
            p.x += p.vx; p.y += p.vy;
            // Check hit cathode
            if (p.x >= cathX - 10 && p.x <= cathX + 10 && p.y >= cy - 60 && p.y <= cy + 60) {
               if (isEmissionPossible) {
                  // Emit Electron
                  const speed = Math.sqrt(K_max) * 5;
                  electronsRef.current.push({
                     x: cathX + 10,
                     y: p.y,
                     vx: speed,
                     vy: (Math.random() - 0.5) * 1,
                     life: 1.0
                  });
               }
               return false;
            }
            return p.x < arenaW && p.y < arenaH;
         });

         // Update Electrons
         electronsRef.current = electronsRef.current.filter(e => {
            // Apply E-field force (acceleration = V/d)
            const accel = voltage * 0.05;
            e.vx += accel;
            e.x += e.vx;
            e.y += e.vy;
            
            if (e.x >= anodeX - 10) return false; // Hit anode
            if (e.x <= cathX - 10) return false; // Hit cathode back
            return e.x < arenaW && e.x > 0;
         });
      }

      // --- Draw Particles ---
      // Photons
      const photonColor = nmToRGB(wavelength);
      photonsRef.current.forEach(p => {
         ctx.shadowBlur = 10; ctx.shadowColor = photonColor;
         ctx.fillStyle = photonColor;
         ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fill();
      });
      ctx.shadowBlur = 0;

      // Electrons
      electronsRef.current.forEach(e => {
         ctx.shadowBlur = 15; ctx.shadowColor = "#38bdf8";
         ctx.fillStyle = "#38bdf8"; // sky-400
         ctx.beginPath(); ctx.arc(e.x, e.y, 3, 0, Math.PI * 2); ctx.fill();
      });
      ctx.shadowBlur = 0;

      // --- Draw Circuit ---
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cathX, cy + 60); ctx.lineTo(cathX, cy + 180); ctx.lineTo(anodeX, cy + 180); ctx.lineTo(anodeX, cy + 60);
      ctx.stroke();

      // Ammeter
      const currentActive = isEmissionPossible && electronsRef.current.length > 0;
      ctx.fillStyle = "#18181b";
      ctx.beginPath(); ctx.arc(cx, cy + 180, 25, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = currentActive ? "#4ade80" : "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = currentActive ? "#4ade80" : "#52525b";
      ctx.font = "bold 10px Inter"; ctx.textAlign = "center";
      ctx.fillText("A", cx, cy + 184);

      // --- Labels ---
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.font = "bold 9px Inter";
      ctx.textAlign = "left";
      ctx.fillText("SUMBER FOTON", cx - 300, cy - 160);
      ctx.textAlign = "center";
      ctx.fillText("TABUNG VACUUM", cx, cy - 110);
    };

    const animate = () => { render(); animationRef.current = requestAnimationFrame(animate); };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, wavelength, intensity, voltage, metal]);

  const reset = () => {
    setWavelength(400);
    setIntensity(50);
    setVoltage(0);
    setMetal(METALS[0]);
    photonsRef.current = [];
    electronsRef.current = [];
  };

  const E_photon = (1240 / wavelength).toFixed(2);
  const K_max = (parseFloat(E_photon) - metal.phi).toFixed(2);
  const currentActive = parseFloat(E_photon) > metal.phi && (voltage > -parseFloat(K_max));

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
             <h1 className="text-lg font-bold text-white tracking-tight leading-none">Efek Fotolistrik</h1>
             <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Dualisme Partikel • Einstein • Vacuum Tube</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative pointer-events-none" />

      {/* SIDEBAR PANEL */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-6 pt-20">
           
           {/* Status Card */}
           <div className={`p-6 rounded-3xl border transition-all duration-500 text-center relative overflow-hidden ${currentActive ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">Aliran Arus</div>
              <div className={`text-2xl font-black ${currentActive ? 'text-emerald-400' : 'text-rose-500'}`}>
                 {currentActive ? 'MENGALIR' : 'NOL'}
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                 {currentActive ? <Activity className="w-4 h-4 text-emerald-400 animate-pulse" /> : <ZapOff className="w-4 h-4 text-rose-500" />}
                 <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                   {currentActive ? 'Elektron Terdeteksi' : 'Potensial Terhenti'}
                 </span>
              </div>
           </div>

           {/* Energy HUD */}
           <div className="bg-white/5 border border-white/10 p-5 rounded-3xl grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                 <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest mb-1">E Foton (hf)</span>
                 <span className="text-sm font-black text-white">{E_photon} eV</span>
              </div>
              <div className="flex flex-col text-right">
                 <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest mb-1">K.E. Max</span>
                 <span className="text-sm font-black text-sky-400">{Math.max(0, parseFloat(K_max)).toFixed(2)} eV</span>
              </div>
           </div>

           {/* Controls */}
           <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 mb-1">
                 <Settings className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Konfigurasi Eksperimen</span>
              </div>
              
              <div className="bg-white/5 p-4 rounded-3xl border border-white/10 space-y-5">
                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Panjang Gelombang (λ)</label>
                       <span className="text-xs font-mono" style={{ color: nmToRGB(wavelength) }}>{wavelength} nm</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer" min="200" max="750" value={wavelength} onChange={(e) => setWavelength(parseInt(e.target.value))} />
                 </div>

                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Intensitas (Jumlah Foton)</label>
                       <span className="text-xs font-mono text-amber-400">{intensity}%</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-amber-500" min="0" max="100" step="10" value={intensity} onChange={(e) => setIntensity(parseInt(e.target.value))} />
                 </div>

                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Tegangan (Voltase)</label>
                       <span className="text-xs font-mono text-rose-400">{voltage.toFixed(1)} V</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-rose-500" min="-5" max="5" step="0.1" value={voltage} onChange={(e) => setVoltage(parseFloat(e.target.value))} />
                 </div>
              </div>
           </div>

           {/* Metal Selection */}
           <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                 <Filter className="w-4 h-4 text-zinc-500" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pilih Logam Katoda</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                 {METALS.map(m => (
                   <button key={m.name} onClick={() => setMetal(m)} className={`py-3 rounded-xl text-[9px] font-black uppercase transition-all border ${metal.name === m.name ? 'bg-white/10 border-white/30 text-white shadow-lg' : 'bg-transparent border-white/5 text-zinc-600'}`}>
                      {m.name} ({m.phi}eV)
                   </button>
                 ))}
              </div>
           </div>

           {/* Physics Insight */}
           <div className="p-5 bg-black/30 rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                 <Sun className="w-4 h-4 text-amber-400" />
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Wawasan Einstein</span>
              </div>
              <div className="space-y-3 text-[10px] text-zinc-500 leading-relaxed italic">
                 <p>
                    <strong className="text-zinc-300">Dualisme:</strong> Elektron hanya akan lepas jika <span className="text-white">E Foton &gt; Fungsi Kerja</span>. Menaikkan intensitas hanya menambah jumlah elektron, tapi tidak menambah kecepatannya.
                 </p>
                 <p>
                    <strong className="text-zinc-300">Stopping Potential:</strong> Tegangan negatif dapat menghentikan laju elektron tercepat sekalipun.
                 </p>
              </div>
           </div>

           <div className="pt-6 border-t border-white/5">
              <button onClick={reset} className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg border border-white/5">
                 <RotateCcw className="w-4 h-4" /> Reset Eksperimen
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
