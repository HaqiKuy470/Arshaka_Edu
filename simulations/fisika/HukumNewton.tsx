"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RefreshCw } from "lucide-react";

export default function HukumNewton() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  const [mass, setMass] = useState(10); // kg
  const [appliedForce, setAppliedForce] = useState(50); // N
  const [frictionCoef, setFrictionCoef] = useState(0.2); // mu
  
  const [playing, setPlaying] = useState(false);
  const stateRef = useRef({ x: 0, v: 0 });

  const resetSimulation = () => {
    stateRef.current = { x: 0, v: 0 };
    setPlaying(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gravity = 9.8;

    const render = () => {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 100; // ground level

      // Physics logic
      let frictionForce = frictionCoef * mass * gravity;
      let netForce = 0;
      let accel = 0;

      // Simplistic friction logic: if applied force overcomes friction
      if (appliedForce > frictionForce) {
        netForce = appliedForce - frictionForce;
      } else if (appliedForce < -frictionForce) {
        netForce = appliedForce + frictionForce;
      } else {
        // Friction cancels applied force if static
        if (Math.abs(stateRef.current.v) < 0.1) {
          netForce = 0;
          stateRef.current.v = 0;
          frictionForce = Math.abs(appliedForce); // Static friction matches force
        } else {
          // Kinetic friction slows it down
          netForce = stateRef.current.v > 0 ? -frictionForce : frictionForce;
        }
      }

      accel = netForce / mass;

      if (playing) {
        stateRef.current.v += accel * 0.05;
        stateRef.current.x += stateRef.current.v * 0.05;
        
        // Wrap around screen for infinite scrolling illusion
        if (stateRef.current.x > 500) stateRef.current.x = -500;
        if (stateRef.current.x < -500) stateRef.current.x = 500;
      }

      // Draw Ground
      ctx.fillStyle = "#27272a";
      ctx.fillRect(0, cy, canvas.width, canvas.height - cy);
      ctx.strokeStyle = "#3f3f46";
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(canvas.width, cy); ctx.stroke();

      // Draw Box
      const boxSize = 80 + (mass * 2); // Box size scales with mass slightly
      const boxX = cx + stateRef.current.x * 10 - boxSize / 2;
      const boxY = cy - boxSize;

      ctx.fillStyle = "#8b5cf6"; // Violet box
      ctx.fillRect(boxX, boxY, boxSize, boxSize);
      ctx.strokeStyle = "#a78bfa";
      ctx.lineWidth = 2;
      ctx.strokeRect(boxX, boxY, boxSize, boxSize);

      // Draw Mass Text
      ctx.fillStyle = "white";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${mass} kg`, boxX + boxSize/2, boxY + boxSize/2);

      // Draw Force Vectors
      const drawArrow = (x: number, y: number, length: number, color: string, label: string) => {
        if (Math.abs(length) < 1) return;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 4;
        ctx.moveTo(x, y);
        ctx.lineTo(x + length, y);
        ctx.stroke();
        
        // Arrow head
        const dir = length > 0 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(x + length, y);
        ctx.lineTo(x + length - 10*dir, y - 6);
        ctx.lineTo(x + length - 10*dir, y + 6);
        ctx.fill();

        ctx.font = "14px sans-serif";
        ctx.fillText(label, x + length/2, y - 10);
      };

      // Applied Force (Green)
      if (appliedForce !== 0) {
        drawArrow(boxX + boxSize/2, boxY + boxSize/2 - 20, appliedForce * 2, "#22c55e", `Fa = ${appliedForce} N`);
      }
      
      // Friction Force (Red)
      const actualFriction = (stateRef.current.v > 0 || (stateRef.current.v === 0 && appliedForce > 0)) ? -frictionForce : frictionForce;
      if (actualFriction !== 0 && (playing || appliedForce !== 0)) {
        drawArrow(boxX + boxSize/2, boxY + boxSize, actualFriction * 2, "#ef4444", `Fk = ${Math.abs(frictionForce).toFixed(1)} N`);
      }

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationRef.current);
  }, [mass, appliedForce, frictionCoef, playing]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        
        <div className="absolute top-6 left-6 glass-card p-4 rounded-xl border border-white/10">
          <div className="space-y-1 text-sm text-zinc-300 font-mono">
            <div className="flex justify-between gap-4"><span>Kecepatan:</span> <span className="text-indigo-400">{stateRef.current.v.toFixed(2)} m/s</span></div>
            <div className="flex justify-between gap-4"><span>Percepatan:</span> <span className="text-pink-400">{((Math.abs(appliedForce) > frictionCoef*mass*9.8) ? (appliedForce - Math.sign(appliedForce)*frictionCoef*mass*9.8)/mass : 0).toFixed(2)} m/s²</span></div>
          </div>
        </div>

        <button onClick={() => setPlaying(!playing)} className={`absolute bottom-6 left-6 w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg transition-all z-20 ${playing ? 'bg-pink-600' : 'bg-indigo-600'}`}>
          {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </button>
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Hukum II Newton</h3></div>
        <div className="p-4 flex-1 overflow-y-auto space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between"><label className="text-sm text-zinc-300">Gaya Dorong (N)</label><span className="text-green-400">{appliedForce} N</span></div>
            <input type="range" className="w-full accent-green-500" min="-100" max="100" value={appliedForce} onChange={(e) => setAppliedForce(parseInt(e.target.value))} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between"><label className="text-sm text-zinc-300">Massa Benda (kg)</label><span className="text-indigo-400">{mass} kg</span></div>
            <input type="range" className="w-full accent-indigo-500" min="1" max="50" value={mass} onChange={(e) => setMass(parseInt(e.target.value))} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between"><label className="text-sm text-zinc-300">Koef. Gesek (μ)</label><span className="text-red-400">{frictionCoef}</span></div>
            <input type="range" className="w-full accent-red-500" min="0" max="1" step="0.05" value={frictionCoef} onChange={(e) => setFrictionCoef(parseFloat(e.target.value))} />
          </div>
        </div>
        <div className="p-4 border-t border-white/10 bg-black/20">
          <button onClick={resetSimulation} className="w-full py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4" /> Reset Posisi</button>
        </div>
      </div>
    </div>
  );
}
