"use client";

import { useState, useEffect, useRef } from "react";

export default function GayaGesek() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [mass, setMass] = useState(10); // kg
  const [appliedForce, setAppliedForce] = useState(0); // N
  const [muStatic, setMuStatic] = useState(0.5); // Static friction coeff
  const [muKinetic, setMuKinetic] = useState(0.3); // Kinetic friction coeff

  const g = 9.8; // m/s^2
  const normalForce = mass * g;
  
  const maxStaticFriction = muStatic * normalForce;
  const kineticFriction = muKinetic * normalForce;

  let frictionForce = 0;
  let netForce = 0;
  let isMoving = false;

  if (Math.abs(appliedForce) <= maxStaticFriction) {
    // Static regime
    frictionForce = appliedForce; // Friction perfectly opposes applied force
    netForce = 0;
    isMoving = false;
  } else {
    // Kinetic regime
    frictionForce = Math.sign(appliedForce) * kineticFriction;
    netForce = appliedForce - frictionForce;
    isMoving = true;
  }

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
      const cy = canvas.height / 2 + 50;

      // Draw Ground
      ctx.beginPath();
      ctx.fillStyle = "#3f3f46"; // zinc-700
      ctx.fillRect(0, cy, canvas.width, canvas.height - cy);
      ctx.strokeStyle = "#52525b"; // zinc-600
      ctx.lineWidth = 2;
      ctx.moveTo(0, cy); ctx.lineTo(canvas.width, cy); ctx.stroke();

      // Draw Box
      const boxSize = 80 + mass; // Visual scale based on mass
      const boxX = cx - boxSize / 2;
      const boxY = cy - boxSize;
      
      ctx.fillStyle = "#d97706"; // amber-600
      ctx.fillRect(boxX, boxY, boxSize, boxSize);
      ctx.strokeStyle = "#b45309";
      ctx.lineWidth = 4;
      ctx.strokeRect(boxX, boxY, boxSize, boxSize);

      ctx.fillStyle = "white";
      ctx.font = "16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${mass} kg`, cx, cy - boxSize/2 + 6);

      // Function to draw arrow
      const drawArrow = (x: number, y: number, force: number, color: string, label: string, yOffset: number) => {
        if (force === 0) return;
        const length = force * 2; // scale
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.moveTo(x, y);
        ctx.lineTo(x + length, y);
        ctx.stroke();
        
        // Arrow head
        ctx.beginPath();
        ctx.fillStyle = color;
        const dir = Math.sign(force);
        ctx.moveTo(x + length, y - 6);
        ctx.lineTo(x + length, y + 6);
        ctx.lineTo(x + length + dir * 10, y);
        ctx.fill();

        ctx.fillStyle = color;
        ctx.font = "14px monospace";
        ctx.fillText(`${label}: ${Math.abs(force).toFixed(1)}N`, x + length/2, y + yOffset);
      };

      // Applied Force (Push)
      drawArrow(cx, cy - boxSize/2 - 20, appliedForce, "#38bdf8", "F Dorong", -10);
      
      // Friction Force
      drawArrow(cx, cy, -frictionForce, "#ef4444", "f Gesek", 20);

      // Motion Indicator
      if (isMoving) {
        ctx.fillStyle = "#22c55e";
        ctx.font = "24px sans-serif";
        ctx.fillText("Benda Bergerak!", cx, cy - boxSize - 40);
        
        // Acceleration arrow
        const a = netForce / mass;
        drawArrow(cx, cy - boxSize - 20, a * 10, "#22c55e", `a = ${Math.abs(a).toFixed(2)} m/s²`, -10);
      } else {
        ctx.fillStyle = "#fbbf24";
        ctx.font = "24px sans-serif";
        ctx.fillText("Benda Diam", cx, cy - boxSize - 40);
      }
    };

    render();
  }, [mass, appliedForce, muStatic, muKinetic, frictionForce, netForce, isMoving]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Gaya Gesek</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-2">
            <div className="flex justify-between"><label className="text-sm text-zinc-300 font-semibold">Gaya Dorong (F)</label><span className="text-sky-400 font-mono">{appliedForce} N</span></div>
            <input type="range" className="w-full accent-sky-500" min="-100" max="100" step="1" value={appliedForce} onChange={(e) => setAppliedForce(parseInt(e.target.value))} />
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between"><label className="text-sm text-zinc-300 font-semibold">Massa Benda (m)</label><span className="text-white font-mono">{mass} kg</span></div>
            <input type="range" className="w-full accent-white" min="1" max="50" step="1" value={mass} onChange={(e) => setMass(parseInt(e.target.value))} />
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between"><label className="text-sm text-zinc-300 font-semibold">Koefisien Statis (μs)</label><span className="text-yellow-400 font-mono">{muStatic.toFixed(2)}</span></div>
            <input type="range" className="w-full accent-yellow-500" min="0" max="1" step="0.05" value={muStatic} onChange={(e) => {setMuStatic(parseFloat(e.target.value)); if(parseFloat(e.target.value) < muKinetic) setMuKinetic(parseFloat(e.target.value));}} />
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between"><label className="text-sm text-zinc-300 font-semibold">Koefisien Kinetis (μk)</label><span className="text-red-400 font-mono">{muKinetic.toFixed(2)}</span></div>
            <input type="range" className="w-full accent-red-500" min="0" max="1" step="0.05" value={muKinetic} onChange={(e) => {if(parseFloat(e.target.value) <= muStatic) setMuKinetic(parseFloat(e.target.value));}} />
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Gaya Normal (N)</span>
              <span className="text-white font-mono">{normalForce.toFixed(1)} N</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Gesekan Statis Maks</span>
              <span className="text-yellow-400 font-mono">{maxStaticFriction.toFixed(1)} N</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Gesekan Kinetis</span>
              <span className="text-red-400 font-mono">{kineticFriction.toFixed(1)} N</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
