"use client";

import { useState, useEffect, useRef } from "react";

export default function KeseimbanganTorsi() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Left mass (m1) at distance (d1)
  const [m1, setM1] = useState(10); // kg
  const [d1, setD1] = useState(4);  // m
  
  // Right mass (m2) at distance (d2)
  const [m2, setM2] = useState(20); // kg
  const [d2, setD2] = useState(2);  // m

  const g = 9.8;
  const torque1 = m1 * g * d1; // Counter-clockwise (positive)
  const torque2 = m2 * g * d2; // Clockwise (negative)
  
  const netTorque = torque1 - torque2;
  
  // Angle for visual tilting based on net torque
  const maxTilt = 20 * (Math.PI / 180);
  const tiltAngle = Math.max(-maxTilt, Math.min(maxTilt, netTorque * 0.05));

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
      const scale = 30; // px per meter

      // Draw Pivot
      ctx.beginPath();
      ctx.moveTo(cx, cy + 10);
      ctx.lineTo(cx - 20, cy + 50);
      ctx.lineTo(cx + 20, cy + 50);
      ctx.closePath();
      ctx.fillStyle = "#9ca3af"; // zinc-400
      ctx.fill();

      // Transform for tilted plank
      ctx.save();
      ctx.translate(cx, cy + 10);
      ctx.rotate(-tiltAngle); // negative because CCW torque is positive
      
      // Draw Plank
      ctx.fillStyle = "#d97706"; // amber-600
      ctx.fillRect(-240, -10, 480, 10);

      // Draw Markers
      ctx.fillStyle = "white";
      ctx.font = "10px sans-serif";
      for (let i = -8; i <= 8; i++) {
        if (i===0) continue;
        const x = i * scale;
        ctx.fillRect(x, -10, 2, 10);
        ctx.fillText(Math.abs(i).toString(), x - 3, 12);
      }

      // Draw Mass 1 (Left)
      const m1Size = 20 + m1; // visual size
      ctx.fillStyle = "#38bdf8"; // sky-400
      ctx.fillRect(-d1 * scale - m1Size/2, -10 - m1Size, m1Size, m1Size);
      ctx.fillStyle = "white";
      ctx.font = "14px sans-serif";
      ctx.fillText(`${m1}kg`, -d1 * scale - 12, -10 - m1Size/2 + 5);

      // Draw Mass 2 (Right)
      const m2Size = 20 + m2; // visual size
      ctx.fillStyle = "#fb7185"; // rose-400
      ctx.fillRect(d2 * scale - m2Size/2, -10 - m2Size, m2Size, m2Size);
      ctx.fillStyle = "white";
      ctx.font = "14px sans-serif";
      ctx.fillText(`${m2}kg`, d2 * scale - 12, -10 - m2Size/2 + 5);

      ctx.restore();

      // Status text
      ctx.fillStyle = "white";
      ctx.font = "20px monospace";
      ctx.textAlign = "center";
      
      if (Math.abs(netTorque) < 0.1) {
        ctx.fillStyle = "#22c55e";
        ctx.fillText("SEIMBANG (Στ = 0)", cx, cy - 150);
      } else {
        ctx.fillStyle = "#ef4444";
        ctx.fillText(`Torsi Netto: ${Math.abs(netTorque).toFixed(1)} N·m ${netTorque > 0 ? '(Berlawanan Arah Jarum Jam)' : '(Searah Jarum Jam)'}`, cx, cy - 150);
      }
    };

    render();
  }, [m1, d1, m2, d2, tiltAngle, netTorque]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Keseimbangan Torsi</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-8">
          
          <div className="space-y-4 bg-sky-500/10 border border-sky-500/30 p-4 rounded-xl">
            <h4 className="font-bold text-sky-400">Beban Kiri (Berlawanan Jarum Jam)</h4>
            <div>
              <div className="flex justify-between text-xs text-zinc-300 mb-1"><span>Massa (m₁)</span><span>{m1} kg</span></div>
              <input type="range" className="w-full accent-sky-500" min="5" max="50" step="5" value={m1} onChange={(e) => setM1(parseInt(e.target.value))} />
            </div>
            <div>
              <div className="flex justify-between text-xs text-zinc-300 mb-1"><span>Jarak Lengan (d₁)</span><span>{d1} m</span></div>
              <input type="range" className="w-full accent-sky-500" min="1" max="8" step="1" value={d1} onChange={(e) => setD1(parseInt(e.target.value))} />
            </div>
            <div className="text-sm font-mono text-sky-300">τ₁ = {(m1 * 9.8 * d1).toFixed(1)} N·m</div>
          </div>

          <div className="space-y-4 bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl">
            <h4 className="font-bold text-rose-400">Beban Kanan (Searah Jarum Jam)</h4>
            <div>
              <div className="flex justify-between text-xs text-zinc-300 mb-1"><span>Massa (m₂)</span><span>{m2} kg</span></div>
              <input type="range" className="w-full accent-rose-500" min="5" max="50" step="5" value={m2} onChange={(e) => setM2(parseInt(e.target.value))} />
            </div>
            <div>
              <div className="flex justify-between text-xs text-zinc-300 mb-1"><span>Jarak Lengan (d₂)</span><span>{d2} m</span></div>
              <input type="range" className="w-full accent-rose-500" min="1" max="8" step="1" value={d2} onChange={(e) => setD2(parseInt(e.target.value))} />
            </div>
            <div className="text-sm font-mono text-rose-300">τ₂ = {(m2 * 9.8 * d2).toFixed(1)} N·m</div>
          </div>

          <p className="text-xs text-zinc-400">Torsi (τ) = Gaya (F) × Lengan Momen (d). Tuas seimbang jika torsi kiri sama dengan torsi kanan.</p>

        </div>
      </div>
    </div>
  );
}
