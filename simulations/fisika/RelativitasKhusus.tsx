"use client";

import { useState, useEffect, useRef } from "react";

export default function RelativitasKhusus() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [velocityPercent, setVelocityPercent] = useState(50); // % of c (speed of light)
  const v = (velocityPercent / 100); // 0 to 0.99c

  // Lorentz Factor (Gamma)
  // gamma = 1 / sqrt(1 - v^2/c^2)
  const gamma = 1 / Math.sqrt(1 - v * v);

  // Time Dilation: t = t0 * gamma
  // Length Contraction: L = L0 / gamma

  const [t0] = useState(1); // 1 tick proper time
  const tExpanded = t0 * gamma; // Time relative to stationary observer

  const [L0] = useState(100); // 100px proper length
  const LContracted = L0 / gamma;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let frame = 0;

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const w = canvas.width;

      // 1. Stationary Observer (Top Half)
      ctx.fillStyle = "white"; ctx.font = "14px sans-serif";
      ctx.fillText("Pengamat Diam (Di Bumi)", 20, 30);
      
      // Moving Ship seen by stationary observer
      const shipSpeed = v * 5; // visual speed
      const xPos = (frame * shipSpeed) % (w + 200) - 100;
      
      ctx.fillStyle = "#3b82f6"; // Blue ship
      // Ship length is contracted
      ctx.fillRect(xPos, 60, LContracted, 30);
      // Windows
      ctx.fillStyle = "white";
      ctx.fillRect(xPos + 5, 70, LContracted*0.2, 10);
      ctx.fillRect(xPos + LContracted*0.75, 70, LContracted*0.2, 10);

      // Light clock in moving ship (seen from Earth) -> diagonal path
      ctx.strokeStyle = "#fcd34d"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(xPos, 50); ctx.lineTo(xPos - 50, 50); ctx.stroke(); // visual trail just for fun

      // 2. Observer Inside Ship (Bottom Half)
      ctx.fillStyle = "white"; ctx.font = "14px sans-serif";
      ctx.fillText("Pengamat Bergerak (Di Pesawat)", 20, cy + 30);
      
      ctx.fillStyle = "#ef4444"; // Red stationary ship relative to himself
      // Ship length is proper length (L0)
      ctx.fillRect(w/2 - L0/2, cy + 60, L0, 30);
      ctx.fillStyle = "white";
      ctx.fillRect(w/2 - L0/2 + 5, cy + 70, L0*0.2, 10);
      ctx.fillRect(w/2 - L0/2 + L0*0.75, cy + 70, L0*0.2, 10);

      // Clock visualizations
      // Ticking rate: Inside ship = normal. Outside ship = slow.
      const tickInside = (frame % 60) / 60; // 0 to 1 every 60 frames
      const tickOutside = (frame % (60 * gamma)) / (60 * gamma); 

      // Draw clocks
      const drawClock = (x: number, y: number, progress: number, label: string) => {
        ctx.beginPath(); ctx.arc(x, y, 20, 0, Math.PI*2); ctx.strokeStyle="white"; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.sin(progress*Math.PI*2)*15, y - Math.cos(progress*Math.PI*2)*15); ctx.strokeStyle="#ef4444"; ctx.stroke();
        ctx.fillStyle = "white"; ctx.fillText(label, x - 20, y + 35);
      }

      drawClock(w - 100, 70, tickOutside, "Jam Pesawat (dilihat dari Bumi)");
      drawClock(w - 100, cy + 70, tickInside, "Jam Pesawat (dilihat Pilot)");

      frame++;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [v, LContracted, gamma, L0]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Relativitas Khusus (Einstein)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-2 pt-2">
            <div className="flex justify-between">
              <label className="text-sm font-bold text-sky-400">Kecepatan Pesawat (v)</label>
              <span className="font-mono text-sky-400">{v.toFixed(2)} c</span>
            </div>
            <input 
              type="range" className="w-full accent-sky-500" 
              min="0" max="99" step="1" 
              value={velocityPercent} 
              onChange={(e) => setVelocityPercent(parseInt(e.target.value))} 
            />
            <p className="text-[10px] text-zinc-500 text-right">c = Kecepatan Cahaya</p>
          </div>

          <div className="bg-black/40 border border-white/10 p-4 rounded-xl shadow-inner mt-4 space-y-4">
            <div className="flex justify-between items-center text-xs font-bold text-zinc-300">
              <span>Faktor Lorentz (γ)</span>
              <span className="font-mono text-lg text-white">{gamma.toFixed(2)}</span>
            </div>
            
            <div className="pt-2 border-t border-zinc-800">
              <div className="text-[10px] uppercase text-zinc-500 mb-1">Kontraksi Panjang (Length Contraction)</div>
              <div className="flex justify-between items-end">
                <span>Panjang Pesawat:</span>
                <span className="font-mono text-rose-400 text-lg">{LContracted.toFixed(0)} <span className="text-sm">m</span></span>
              </div>
              <div className="text-[10px] text-right text-zinc-600">(Asli: 100 m)</div>
            </div>

            <div className="pt-2 border-t border-zinc-800">
              <div className="text-[10px] uppercase text-zinc-500 mb-1">Dilatasi Waktu (Time Dilation)</div>
              <div className="flex justify-between items-end">
                <span>1 Tahun di Pesawat =</span>
                <span className="font-mono text-emerald-400 text-lg">{tExpanded.toFixed(2)} <span className="text-sm">Tahun Bumi</span></span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Postulat Relativitas Khusus:</strong> Kecepatan cahaya (c) selalu konstan bagi semua pengamat.</p>
            <p>Akibatnya, jika sesuatu bergerak mendekati kecepatan cahaya, maka waktu akan berjalan lebih lambat (Dilatasi Waktu) dan panjang benda akan terlihat menyusut (Kontraksi Panjang) bagi pengamat yang diam.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
