"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Zap, Move, Flame, Settings, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EnergiSkatePark() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [showControls, setShowControls] = useState(true);
  
  // Settings
  const [mass, setMass] = useState(60);
  const [friction, setFriction] = useState(0.01);
  const [gravity, setGravity] = useState(9.8);

  // State
  const [theta, setTheta] = useState(-Math.PI / 4);
  const [omega, setOmega] = useState(0);
  const [thermalEnergy, setThermalEnergy] = useState(0);
  
  const radius = 200;
  const animationRef = useRef(0);
  const lastTimeRef = useRef(0);

  const meterScale = 50;
  const rMeters = radius / meterScale;

  useEffect(() => {
    if (isRunning) {
      const update = (timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
        lastTimeRef.current = timestamp;

        const alpha = -(gravity / rMeters) * Math.sin(theta);
        
        setOmega(w => {
           const frictionLoss = w * friction * dt * 5;
           const nextW = w + alpha * dt - frictionLoss;
           const currentKE = 0.5 * mass * Math.pow(w * rMeters, 2);
           const nextKE = 0.5 * mass * Math.pow(nextW * rMeters, 2);
           if (currentKE > nextKE) {
             setThermalEnergy(te => te + Math.max(0, currentKE - nextKE));
           }
           return nextW;
        });

        setTheta(t => t + omega * dt);
        animationRef.current = requestAnimationFrame(update);
      };
      animationRef.current = requestAnimationFrame(update);
    } else {
      lastTimeRef.current = 0;
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, theta, omega, gravity, rMeters, friction, mass]);

  const height = rMeters * (1 - Math.cos(theta));
  const PE = mass * gravity * height;
  const v = Math.abs(omega * rMeters);
  const KE = 0.5 * mass * v * v;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2 - 50;
      const responsiveRadius = Math.min(radius, canvas.width * 0.4);

      // Track
      ctx.beginPath();
      ctx.arc(cx, cy, responsiveRadius, 0, Math.PI, false);
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 12;
      ctx.lineCap = "round";
      ctx.stroke();

      // Skater
      const drawAngle = Math.PI / 2 + theta;
      const bx = cx + Math.cos(drawAngle) * responsiveRadius;
      const by = cy + Math.sin(drawAngle) * responsiveRadius;

      ctx.save();
      ctx.translate(bx, by - 12);
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    };

    render();
    window.addEventListener("resize", render);
    return () => window.removeEventListener("resize", render);
  }, [theta, radius]);

  const reset = () => {
    setTheta(-Math.PI / 3);
    setOmega(0);
    setThermalEnergy(0);
    lastTimeRef.current = 0;
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-[#050505]">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Stats Overlay (Responsive) */}
      <div className="absolute top-6 left-6 right-6 grid grid-cols-1 sm:grid-cols-3 gap-3 z-10 pointer-events-none">
          {[
            { label: "Kinetik", val: KE, color: "text-blue-400", bg: "bg-blue-500/10", icon: Zap },
            { label: "Potensial", val: PE, color: "text-emerald-400", bg: "bg-emerald-500/10", icon: Move },
            { label: "Termal", val: thermalEnergy, color: "text-amber-400", bg: "bg-amber-500/10", icon: Flame }
          ].map(stat => (
            <div key={stat.label} className="glass-card p-4 rounded-2xl border border-white/10 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <div className="text-[8px] text-zinc-500 font-black uppercase tracking-wider">{stat.label}</div>
                <div className={`text-lg font-black ${stat.color} font-mono`}>{stat.val.toFixed(0)}J</div>
              </div>
            </div>
          ))}
      </div>

      {/* Controls Overlay */}
      <div className="absolute bottom-6 left-0 right-0 px-6 z-20">
        <AnimatePresence>
          {showControls && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="max-w-3xl mx-auto glass-card p-6 rounded-[32px] border border-white/10 backdrop-blur-3xl shadow-2xl space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Massa", val: mass, unit: "kg", min: 20, max: 150, step: 5, setter: setMass, accent: "accent-white" },
                  { label: "Gesekan", val: (friction*100).toFixed(0), unit: "%", min: 0, max: 0.1, step: 0.01, setter: setFriction, accent: "accent-amber-500" },
                  { label: "Gravitasi", val: gravity.toFixed(1), unit: "m/s²", min: 0, max: 25, step: 0.5, setter: setGravity, accent: "accent-indigo-500" }
                ].map(param => (
                  <div key={param.label} className="space-y-3">
                    <div className="flex justify-between px-1">
                      <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{param.label}</span>
                      <span className="text-[10px] font-mono text-white">{param.val}{param.unit}</span>
                    </div>
                    <input 
                      type="range" 
                      className={`w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer ${param.accent}`}
                      min={param.min} max={param.max} step={param.step} value={param.label === "Gesekan" ? friction : param.val} 
                      onChange={(e) => param.setter(parseFloat(e.target.value))} 
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button onClick={() => setIsRunning(!isRunning)} className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 ${isRunning ? 'bg-zinc-800 text-white' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'}`}>
                  {isRunning ? 'Pause' : 'Mulai'}
                </button>
                <button onClick={reset} className="p-3 bg-zinc-800 text-white rounded-xl active:scale-95 transition-all"><RotateCcw className="w-5 h-5" /></button>
                <button onClick={() => setShowControls(false)} className="md:hidden p-3 bg-zinc-800 text-white rounded-xl"><X className="w-5 h-5" /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!showControls && (
          <button 
            onClick={() => setShowControls(true)}
            className="md:hidden mx-auto block p-4 bg-indigo-600 rounded-full text-white shadow-xl"
          >
            <Settings className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}
