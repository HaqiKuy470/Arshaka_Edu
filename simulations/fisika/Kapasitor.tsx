"use client";

import { useState, useEffect, useRef } from "react";
import { Zap, Plug } from "lucide-react";

export default function Kapasitor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [voltage, setVoltage] = useState(5); // Volts (Battery)
  const [area, setArea] = useState(10); // Plate Area (relative)
  const [distance, setDistance] = useState(5); // Plate Separation
  const [dielectric, setDielectric] = useState(1); // K constant (1 = Air, 5 = Glass, etc)
  
  // Capacitance C = K * e0 * A / d
  const capacitance = (dielectric * area) / distance;
  
  // Charge Q = C * V
  const charge = capacitance * voltage;
  
  // Energy U = 0.5 * C * V^2
  const energy = 0.5 * capacitance * voltage * voltage;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw Battery & Wires
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 4;
      
      // Bottom wire to battery
      ctx.beginPath(); ctx.moveTo(cx - 100, cy + 100); ctx.lineTo(cx + 100, cy + 100); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - 100, cy + 100); ctx.lineTo(cx - 100, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + 100, cy + 100); ctx.lineTo(cx + 100, cy); ctx.stroke();

      // Battery Icon at bottom
      ctx.fillStyle = "#18181b"; // zinc-900
      ctx.fillRect(cx - 30, cy + 85, 60, 30);
      ctx.strokeStyle = "white"; ctx.strokeRect(cx - 30, cy + 85, 60, 30);
      ctx.fillStyle = "#ef4444"; ctx.fillRect(cx - 30, cy + 85, 20, 30); // Red + side
      ctx.fillStyle = "white"; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(`${voltage}V`, cx, cy + 105);

      // Draw Capacitor Plates
      const plateHeight = area * 10;
      const separation = distance * 10;
      const leftX = cx - separation/2;
      const rightX = cx + separation/2;

      // Dielectric Material
      if (dielectric > 1) {
        ctx.fillStyle = "rgba(52, 211, 153, 0.3)"; // emerald-400
        ctx.fillRect(leftX, cy - plateHeight/2, separation, plateHeight);
        ctx.fillStyle = "rgba(52, 211, 153, 0.8)";
        ctx.fillText(`K=${dielectric}`, cx, cy - plateHeight/2 - 10);
      }

      // Wires connecting to plates
      ctx.beginPath(); ctx.moveTo(cx - 100, cy); ctx.lineTo(leftX, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + 100, cy); ctx.lineTo(rightX, cy); ctx.stroke();

      // Plates
      ctx.fillStyle = "#94a3b8"; // slate-400
      ctx.fillRect(leftX - 4, cy - plateHeight/2, 8, plateHeight); // Left Plate (Positive)
      ctx.fillRect(rightX - 4, cy - plateHeight/2, 8, plateHeight); // Right Plate (Negative)

      // Draw Charges on Plates (+ on Left, - on Right)
      const numCharges = Math.min(20, Math.floor(charge * 2)); // Visual cap
      if (numCharges > 0 && voltage > 0) {
        ctx.fillStyle = "#ef4444"; // Red +
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold 14px sans-serif";
        
        const spacing = plateHeight / numCharges;
        for (let i = 0; i < numCharges; i++) {
          const py = cy - plateHeight/2 + spacing/2 + i*spacing;
          ctx.fillText("+", leftX - 10, py);
          
          ctx.fillStyle = "#3b82f6"; // Blue -
          ctx.fillText("-", rightX + 10, py);
          ctx.fillStyle = "#ef4444";
        }

        // Draw Electric Field lines between plates
        ctx.strokeStyle = "rgba(239, 68, 68, 0.3)";
        ctx.lineWidth = 1;
        for (let i = 0; i < numCharges; i++) {
          const py = cy - plateHeight/2 + spacing/2 + i*spacing;
          ctx.beginPath();
          ctx.moveTo(leftX + 4, py);
          ctx.lineTo(rightX - 4, py);
          ctx.stroke();

          // Animate arrow
          const arrowX = leftX + 4 + ((time*2 + i*10) % (separation - 8));
          ctx.fillStyle = "rgba(239, 68, 68, 0.5)";
          ctx.beginPath();
          ctx.moveTo(arrowX, py - 3); ctx.lineTo(arrowX + 5, py); ctx.lineTo(arrowX, py + 3); ctx.fill();
        }
      }

      time++;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [voltage, area, distance, dielectric, charge]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Kapasitor Keping Sejajar</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-2 rounded-xl">
              <div className="text-[10px] text-emerald-400 font-bold">Kapasitansi (C)</div>
              <div className="text-xl font-mono text-white mt-1">{capacitance.toFixed(1)} <span className="text-[10px] text-zinc-400">μF</span></div>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 p-2 rounded-xl">
              <div className="text-[10px] text-yellow-400 font-bold">Energi (U)</div>
              <div className="text-xl font-mono text-white mt-1">{energy.toFixed(1)} <span className="text-[10px] text-zinc-400">μJ</span></div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <div className="flex justify-between"><label className="text-sm text-rose-400 font-bold">Voltase Baterai (V)</label><span className="text-rose-400 font-mono">{voltage} V</span></div>
              <input type="range" className="w-full accent-rose-500" min="0" max="12" step="1" value={voltage} onChange={(e) => setVoltage(parseInt(e.target.value))} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between"><label className="text-sm text-sky-400 font-bold">Luas Penampang (A)</label><span className="text-sky-400 font-mono">{area} cm²</span></div>
              <input type="range" className="w-full accent-sky-500" min="5" max="20" step="1" value={area} onChange={(e) => setArea(parseInt(e.target.value))} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between"><label className="text-sm text-zinc-300 font-bold">Jarak Antar Keping (d)</label><span className="text-zinc-300 font-mono">{distance} mm</span></div>
              <input type="range" className="w-full accent-white" min="2" max="15" step="1" value={distance} onChange={(e) => setDistance(parseInt(e.target.value))} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between"><label className="text-sm text-emerald-400 font-bold">Dielektrik (K)</label><span className="text-emerald-400 font-mono">{dielectric}</span></div>
              <input type="range" className="w-full accent-emerald-500" min="1" max="10" step="1" value={dielectric} onChange={(e) => setDielectric(parseInt(e.target.value))} />
              <div className="text-[10px] text-zinc-500 flex justify-between">
                <span>Vakum (1)</span>
                <span>Kaca (5)</span>
                <span>Keramik (10)</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-2 text-xs text-zinc-400 leading-relaxed">
            <p><strong>Kapasitansi (C)</strong>: Kemampuan menyimpan muatan. Berbanding lurus dengan Luas (A) dan konstanta Dielektrik (K), tapi berbanding terbalik dengan jarak (d).</p>
            <div className="font-mono text-white mt-2">C = K · ε₀ · A / d</div>
            <div className="font-mono text-white">Q = C · V</div>
          </div>

        </div>
      </div>
    </div>
  );
}
