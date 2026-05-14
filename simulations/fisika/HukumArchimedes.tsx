"use client";

import { useState, useEffect, useRef } from "react";

export default function HukumArchimedes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [fluidDensity, setFluidDensity] = useState(1000); // kg/m^3
  const [objectDensity, setObjectDensity] = useState(800); // kg/m^3
  const [volume, setVolume] = useState(1); // m^3

  const g = 9.8;
  
  // Weight of object W = rho_obj * V * g
  const weight = objectDensity * volume * g;
  
  // Buoyant force F_b = rho_fluid * V_submerged * g
  // In equilibrium, F_b = W (if it floats)
  // V_sub = W / (rho_fluid * g) = (rho_obj * V * g) / (rho_fluid * g) = V * (rho_obj / rho_fluid)
  let vSubmerged = volume * (objectDensity / fluidDensity);
  
  // Cap submerged volume to max total volume (if it sinks)
  if (vSubmerged > volume) vSubmerged = volume;
  
  const buoyantForce = fluidDensity * vSubmerged * g;
  const netForce = buoyantForce - weight; // positive means floats up, negative means sinks

  let status = "Melayang (Seimbang)";
  let statusColor = "text-yellow-400";
  if (objectDensity < fluidDensity) {
    status = "Mengapung";
    statusColor = "text-emerald-400";
  } else if (objectDensity > fluidDensity) {
    status = "Tenggelam";
    statusColor = "text-red-400";
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
      const cy = canvas.height / 2;
      
      const waterLevelY = cy;
      const boxSize = 80 + volume * 10; // visual size

      // Draw Container
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.fillRect(cx - 150, cy - 50, 300, 250);
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(cx - 150, cy - 50); ctx.lineTo(cx - 150, cy + 200); ctx.lineTo(cx + 150, cy + 200); ctx.lineTo(cx + 150, cy - 50); ctx.stroke();

      // Draw Water
      ctx.fillStyle = "rgba(56, 189, 248, 0.4)"; // sky-400
      ctx.fillRect(cx - 148, waterLevelY, 296, 200 - (waterLevelY - cy));

      // Calculate Box Position
      let boxY = 0;
      if (objectDensity < fluidDensity) {
        // Floating: submerged ratio determines how deep it sits
        const subRatio = vSubmerged / volume;
        // The bottom of the box is subRatio * boxSize below water line
        boxY = waterLevelY - boxSize + (subRatio * boxSize);
      } else if (objectDensity === fluidDensity) {
        // Suspended exactly in middle
        boxY = waterLevelY + 50; 
      } else {
        // Sunk to bottom
        boxY = cy + 200 - boxSize;
      }

      // Draw Box
      ctx.fillStyle = "#d97706"; // amber-600
      ctx.fillRect(cx - boxSize/2, boxY, boxSize, boxSize);
      ctx.strokeStyle = "#fcd34d";
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - boxSize/2, boxY, boxSize, boxSize);

      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.font = "14px sans-serif";
      ctx.fillText(`${objectDensity} kg/m³`, cx, boxY + boxSize/2 + 5);

      // Force Vectors
      // Weight (down)
      ctx.beginPath(); ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 3;
      ctx.moveTo(cx - 20, boxY + boxSize/2); ctx.lineTo(cx - 20, boxY + boxSize/2 + 50); ctx.stroke();
      ctx.beginPath(); ctx.fillStyle = "#ef4444"; ctx.moveTo(cx - 20, boxY + boxSize/2 + 50); ctx.lineTo(cx - 25, boxY + boxSize/2 + 40); ctx.lineTo(cx - 15, boxY + boxSize/2 + 40); ctx.fill();
      
      // Buoyancy (up)
      ctx.beginPath(); ctx.strokeStyle = "#22c55e"; ctx.lineWidth = 3;
      ctx.moveTo(cx + 20, boxY + boxSize/2); ctx.lineTo(cx + 20, boxY + boxSize/2 - 50); ctx.stroke();
      ctx.beginPath(); ctx.fillStyle = "#22c55e"; ctx.moveTo(cx + 20, boxY + boxSize/2 - 50); ctx.lineTo(cx + 25, boxY + boxSize/2 - 40); ctx.lineTo(cx + 15, boxY + boxSize/2 - 40); ctx.fill();

    };
    render();
  }, [fluidDensity, objectDensity, volume, vSubmerged]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        
        <div className="absolute top-6 font-bold text-2xl tracking-wider">
          Status: <span className={statusColor}>{status}</span>
        </div>
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Hukum Archimedes</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between"><label className="text-sm text-sky-400 font-bold">Massa Jenis Cairan (ρ_c)</label><span className="text-sky-400 font-mono">{fluidDensity}</span></div>
              <input type="range" className="w-full accent-sky-500" min="500" max="2000" step="50" value={fluidDensity} onChange={(e) => setFluidDensity(parseInt(e.target.value))} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between"><label className="text-sm text-amber-400 font-bold">Massa Jenis Benda (ρ_b)</label><span className="text-amber-400 font-mono">{objectDensity}</span></div>
              <input type="range" className="w-full accent-amber-500" min="200" max="2500" step="50" value={objectDensity} onChange={(e) => setObjectDensity(parseInt(e.target.value))} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between"><label className="text-sm text-zinc-300 font-bold">Volume Benda (V)</label><span className="text-white font-mono">{volume} m³</span></div>
              <input type="range" className="w-full accent-white" min="0.5" max="5" step="0.5" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} />
            </div>
          </div>

          <div className="bg-black/30 p-4 rounded-xl border border-white/5 space-y-3 mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-red-400">Berat Benda (W)</span>
              <span className="text-red-400 font-mono">{(weight).toFixed(0)} N</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-green-400">Gaya Apung (Fa)</span>
              <span className="text-green-400 font-mono">{(buoyantForce).toFixed(0)} N</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
