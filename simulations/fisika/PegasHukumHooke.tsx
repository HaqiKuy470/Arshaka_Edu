"use client";

import { useState, useEffect, useRef } from "react";

export default function PegasHukumHooke() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [mass, setMass] = useState(0); // kg (0 means no mass hanging)
  const [k, setK] = useState(50); // N/m (Spring constant)

  const g = 9.8;
  const F = mass * g; // Force applied by gravity
  const deltaX = F / k; // Hooke's Law: F = k * deltaX (in meters)

  const visualScale = 100; // pixels per meter
  const equilibriumY = 100; // y-coord of un-stretched spring end
  const currentY = equilibriumY + deltaX * visualScale;

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

      // Draw Ceiling
      ctx.fillStyle = "#52525b"; // zinc-600
      ctx.fillRect(cx - 100, 0, 200, 20);

      // Draw Spring
      ctx.beginPath();
      ctx.strokeStyle = "#9ca3af"; // zinc-400
      ctx.lineWidth = 4;
      
      const numCoils = 10;
      const coilHeight = currentY / numCoils;
      
      ctx.moveTo(cx, 20);
      for (let i = 1; i <= numCoils; i++) {
        const y = 20 + i * coilHeight;
        const xOffset = i % 2 === 0 ? 20 : -20;
        ctx.lineTo(cx + (i === numCoils ? 0 : xOffset), y);
      }
      ctx.stroke();

      // Draw Mass Object
      if (mass > 0) {
        const boxSize = 20 + mass * 0.5; // Visual size relative to mass
        ctx.fillStyle = "#f59e0b"; // amber-500
        ctx.fillRect(cx - boxSize/2, currentY + 20, boxSize, boxSize);
        
        ctx.fillStyle = "white";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${mass} kg`, cx, currentY + 20 + boxSize/2 + 4);
      }

      // Draw Equilibrium Line
      ctx.beginPath();
      ctx.strokeStyle = "rgba(34, 197, 94, 0.5)"; // Green dashed
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 2;
      ctx.moveTo(cx - 150, equilibriumY + 20);
      ctx.lineTo(cx + 150, equilibriumY + 20);
      ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.fillStyle = "#22c55e";
      ctx.fillText("Posisi Setimbang", cx - 100, equilibriumY + 15);

      // Draw Stretch Measurement Vector
      if (deltaX > 0) {
        const mX = cx + 80; // measurement X position
        ctx.beginPath();
        ctx.strokeStyle = "#ef4444"; // Red
        ctx.lineWidth = 2;
        // Vertical line
        ctx.moveTo(mX, equilibriumY + 20);
        ctx.lineTo(mX, currentY + 20);
        ctx.stroke();
        
        // Top and bottom ticks
        ctx.moveTo(mX - 10, equilibriumY + 20); ctx.lineTo(mX + 10, equilibriumY + 20); ctx.stroke();
        ctx.moveTo(mX - 10, currentY + 20); ctx.lineTo(mX + 10, currentY + 20); ctx.stroke();

        ctx.fillStyle = "#ef4444";
        ctx.fillText(`Δx = ${deltaX.toFixed(2)} m`, mX + 40, equilibriumY + 20 + (deltaX * visualScale) / 2);
      }

    };
    render();
  }, [mass, k, currentY, deltaX]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Pegas & Hukum Hooke</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-8">
          
          <div className="space-y-2">
            <div className="flex justify-between"><label className="text-sm text-zinc-300 font-bold">Massa Beban (m)</label><span className="text-white font-mono">{mass} kg</span></div>
            <input type="range" className="w-full accent-white" min="0" max="50" step="5" value={mass} onChange={(e) => setMass(parseInt(e.target.value))} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between"><label className="text-sm text-sky-400 font-bold">Konstanta Pegas (k)</label><span className="text-sky-400 font-mono">{k} N/m</span></div>
            <input type="range" className="w-full accent-sky-500" min="10" max="200" step="10" value={k} onChange={(e) => setK(parseInt(e.target.value))} />
          </div>

          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-red-300">Gaya Berat (F)</span>
              <span className="text-red-400 font-bold font-mono">{F.toFixed(1)} N</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-red-300">Pertambahan Panjang (Δx)</span>
              <span className="text-red-400 font-bold font-mono">{deltaX.toFixed(2)} m</span>
            </div>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Hukum Hooke menyatakan gaya yang bekerja pada pegas sebanding dengan pertambahan panjangnya.
            <br/><br/>
            <strong className="text-white">F = k · Δx</strong>
          </p>

        </div>
      </div>
    </div>
  );
}
