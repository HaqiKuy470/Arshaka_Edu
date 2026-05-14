"use client";

import { useState, useEffect, useRef } from "react";

export default function MedanMagnet() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strength, setStrength] = useState(50);

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

      // Draw vector field
      const spacing = 40;
      ctx.lineWidth = 1.5;
      
      for (let x = 0; x < canvas.width; x += spacing) {
        for (let y = 0; y < canvas.height; y += spacing) {
          // Magnetic dipole equation approximation
          const dx = x - cx;
          const dy = y - cy;
          const r = Math.sqrt(dx*dx + dy*dy);
          
          if (r < 60) continue; // inside magnet

          // Dipole moment m is along x axis
          const theta = Math.atan2(dy, dx);
          // Br = 2m cos(theta) / r^3
          // Btheta = m sin(theta) / r^3
          const Br = 2 * Math.cos(theta);
          const Btheta = Math.sin(theta);
          
          // Convert back to cartesian
          const Bx = Br * Math.cos(theta) - Btheta * Math.sin(theta);
          const By = Br * Math.sin(theta) + Btheta * Math.cos(theta);

          const angle = Math.atan2(By, Bx);
          
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          
          // Draw compass needle
          const opacity = Math.min(1, (100000 / (r*r*r)) * (strength/50));
          ctx.globalAlpha = opacity;
          
          ctx.beginPath();
          ctx.fillStyle = "#ef4444"; // North (Red)
          ctx.moveTo(0, -3); ctx.lineTo(12, 0); ctx.lineTo(0, 3); ctx.fill();
          
          ctx.beginPath();
          ctx.fillStyle = "#ffffff"; // South (White)
          ctx.moveTo(0, -3); ctx.lineTo(-12, 0); ctx.lineTo(0, 3); ctx.fill();
          
          ctx.restore();
        }
      }

      ctx.globalAlpha = 1;

      // Draw Magnet
      const magW = 120;
      const magH = 40;
      
      // South (Left)
      ctx.fillStyle = "#3b82f6";
      ctx.fillRect(cx - magW/2, cy - magH/2, magW/2, magH);
      ctx.fillStyle = "white";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("S", cx - magW/4 - 6, cy + 7);

      // North (Right)
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(cx, cy - magH/2, magW/2, magH);
      ctx.fillStyle = "white";
      ctx.fillText("N", cx + magW/4 - 6, cy + 7);

      // Outline
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - magW/2, cy - magH/2, magW, magH);
    };

    render();
    window.addEventListener('resize', render);
    return () => window.removeEventListener('resize', render);
  }, [strength]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Medan Magnet</h3></div>
        <div className="p-4 flex-1 overflow-y-auto space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between"><label className="text-sm text-zinc-300">Kekuatan Magnet</label><span className="text-indigo-400">{strength}%</span></div>
            <input type="range" className="w-full accent-indigo-500" min="0" max="100" value={strength} onChange={(e) => setStrength(parseInt(e.target.value))} />
          </div>
        </div>
      </div>
    </div>
  );
}
