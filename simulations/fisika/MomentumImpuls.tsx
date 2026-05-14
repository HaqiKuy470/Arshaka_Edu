"use client";

import { useState, useEffect, useRef } from "react";
import { Play, RotateCcw } from "lucide-react";

export default function MomentumImpuls() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  const [mass, setMass] = useState(2); // kg
  const [vInitial, setVInitial] = useState(10); // m/s
  const [contactTime, setContactTime] = useState(0.5); // seconds (duration of impact)

  // Simulation state
  const [pos, setPos] = useState(-200);
  const [vel, setVel] = useState(vInitial);
  const [impulseForce, setImpulseForce] = useState(0);
  
  const animationRef = useRef(0);
  const lastTimeRef = useRef(0);
  const impactTimerRef = useRef(0);

  // Derived values
  // Impulse J = delta P = m(v_final - v_initial)
  // Assume elastic collision with wall (v_final = -v_initial)
  const vFinal = -vInitial;
  const deltaP = mass * (vFinal - vInitial);
  // Average Force = delta P / delta t
  const avgForce = Math.abs(deltaP / contactTime);

  useEffect(() => {
    if (!isRunning) {
      setVel(vInitial);
    }
  }, [vInitial, isRunning]);

  useEffect(() => {
    if (isRunning) {
      const update = (timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const dt = (timestamp - lastTimeRef.current) / 1000;
        lastTimeRef.current = timestamp;

        setPos(p => {
          let nextP = p + vel * dt * 30; // visual speed scale
          
          // Hit the wall (wall is at x = 100)
          if (nextP >= 80 && vel > 0) { // 80 is wall position minus ball radius
            if (impactTimerRef.current === 0) {
              impactTimerRef.current = timestamp; // Start impact
              setImpulseForce(avgForce);
            }

            const elapsedImpact = (timestamp - impactTimerRef.current) / 1000;
            
            if (elapsedImpact >= contactTime) {
              // Finish impact, bounce back
              setVel(vFinal);
              setImpulseForce(0);
              nextP = 79; // move slightly left to escape hit box
            } else {
              // During impact, compress (slow down visually)
              nextP = 80; // stuck to wall
            }
          }
          
          return nextP;
        });

        animationRef.current = requestAnimationFrame(update);
      };
      animationRef.current = requestAnimationFrame(update);
    } else {
      lastTimeRef.current = 0;
      impactTimerRef.current = 0;
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, vel, contactTime, vFinal, avgForce]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw Ground
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 2;
      ctx.moveTo(0, cy + 20);
      ctx.lineTo(canvas.width, cy + 20);
      ctx.stroke();

      // Draw Wall
      ctx.fillStyle = "#3f3f46"; // zinc-700
      ctx.fillRect(cx + 100, cy - 100, 40, 120);
      
      // Draw Ball
      const ballX = cx + pos;
      const radius = 20;
      ctx.beginPath();
      ctx.arc(ballX, cy, radius, 0, Math.PI*2);
      ctx.fillStyle = "#f59e0b"; // amber-500
      ctx.fill();

      // Draw Force Vector if during impact
      if (impulseForce > 0) {
        ctx.beginPath();
        ctx.strokeStyle = "#ef4444"; // Red
        ctx.lineWidth = 4;
        ctx.moveTo(ballX, cy);
        const fLength = Math.min(100, impulseForce); // cap visual length
        ctx.lineTo(ballX - fLength, cy);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.fillStyle = "#ef4444";
        ctx.moveTo(ballX - fLength, cy - 6);
        ctx.lineTo(ballX - fLength, cy + 6);
        ctx.lineTo(ballX - fLength - 10, cy);
        ctx.fill();

        ctx.fillStyle = "#ef4444";
        ctx.font = "14px monospace";
        ctx.fillText(`F = ${impulseForce.toFixed(0)} N`, ballX - fLength/2 - 20, cy - 20);
      }

    };
    render();
  }, [pos, impulseForce]);

  const reset = () => {
    setIsRunning(false);
    setPos(-200);
    setVel(vInitial);
    setImpulseForce(0);
    lastTimeRef.current = 0;
    impactTimerRef.current = 0;
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        
        <div className="absolute top-6 left-6 right-6 flex gap-4">
          <div className="glass-card p-4 rounded-xl border border-white/10 flex-1">
            <div className="text-xs text-zinc-400">Momentum Awal (p)</div>
            <div className="text-xl font-mono text-white">{(mass * vInitial).toFixed(1)} kg·m/s</div>
          </div>
          <div className="glass-card p-4 rounded-xl border border-white/10 flex-1">
            <div className="text-xs text-zinc-400">Impuls (I = Δp)</div>
            <div className="text-xl font-mono text-emerald-400">{Math.abs(deltaP).toFixed(1)} N·s</div>
          </div>
          <div className="glass-card p-4 rounded-xl border border-white/10 flex-1">
            <div className="text-xs text-zinc-400">Gaya Rata-rata (F)</div>
            <div className="text-xl font-mono text-red-400">{avgForce.toFixed(1)} N</div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Momentum & Impuls</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="flex gap-2">
            <button onClick={() => setIsRunning(true)} disabled={isRunning} className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${isRunning ? 'bg-zinc-700 text-zinc-400' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}>
              <Play className="w-4 h-4"/> Lempar Bola
            </button>
            <button onClick={reset} className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors">
              <RotateCcw className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-zinc-300 font-bold mb-1"><span>Massa Bola (m)</span><span>{mass} kg</span></div>
              <input type="range" className="w-full accent-white" min="1" max="10" step="1" value={mass} onChange={(e) => setMass(parseInt(e.target.value))} disabled={isRunning}/>
            </div>
            
            <div>
              <div className="flex justify-between text-xs text-zinc-300 font-bold mb-1"><span>Kecepatan Awal (v₀)</span><span>{vInitial} m/s</span></div>
              <input type="range" className="w-full accent-sky-500" min="5" max="30" step="1" value={vInitial} onChange={(e) => {setVInitial(parseInt(e.target.value)); if(!isRunning) setVel(parseInt(e.target.value));}} disabled={isRunning}/>
            </div>

            <div>
              <div className="flex justify-between text-xs text-zinc-300 font-bold mb-1"><span>Waktu Kontak Tembok (Δt)</span><span>{contactTime} s</span></div>
              <input type="range" className="w-full accent-red-500" min="0.1" max="2.0" step="0.1" value={contactTime} onChange={(e) => setContactTime(parseFloat(e.target.value))} disabled={isRunning}/>
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-2 text-xs text-zinc-400">
            <p><strong>Impuls</strong> adalah perubahan momentum. Semakin cepat waktu kontak (Δt kecil), semakin besar gaya (F) yang dihasilkan pada saat tabrakan.</p>
            <div className="font-mono text-emerald-400 mt-2">I = F · Δt = m(v' - v)</div>
          </div>

        </div>
      </div>
    </div>
  );
}
