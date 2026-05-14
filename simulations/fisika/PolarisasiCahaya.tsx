"use client";

import { useState, useEffect, useRef } from "react";

export default function PolarisasiCahaya() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [angle1, setAngle1] = useState(0); // Polarizer 1
  const [angle2, setAngle2] = useState(90); // Polarizer 2 (Analyzer)

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
      const w = canvas.width;

      // Malus's Law: I = I0 * cos^2(theta)
      // theta is angle difference between the two polarizers
      const thetaDiffRad = ((angle2 - angle1) * Math.PI) / 180;
      const intensity = Math.pow(Math.cos(thetaDiffRad), 2); // 0.0 to 1.0

      // Draw Unpolarized Light (Left)
      ctx.strokeStyle = "white"; ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(50 + Math.cos(a)*20, cy + Math.sin(a)*20);
        ctx.lineTo(50 - Math.cos(a)*20, cy - Math.sin(a)*20);
        ctx.stroke();
      }
      ctx.fillStyle = "white"; ctx.font = "12px sans-serif"; ctx.textAlign="center"; ctx.fillText("Cahaya Acak", 50, cy + 40);

      // Draw Light ray (Horizontal line)
      ctx.beginPath(); ctx.moveTo(50, cy); ctx.lineTo(w - 50, cy); ctx.strokeStyle="rgba(255,255,255,0.3)"; ctx.stroke();

      // Draw Polarizer 1
      const p1x = cx - 100;
      ctx.fillStyle = "rgba(56, 189, 248, 0.2)"; ctx.fillRect(p1x - 10, cy - 80, 20, 160);
      ctx.strokeStyle = "#38bdf8"; ctx.strokeRect(p1x - 10, cy - 80, 20, 160);
      // Grid lines
      ctx.beginPath();
      const a1Rad = (angle1 * Math.PI) / 180;
      ctx.moveTo(p1x + Math.sin(a1Rad)*40, cy - Math.cos(a1Rad)*40);
      ctx.lineTo(p1x - Math.sin(a1Rad)*40, cy + Math.cos(a1Rad)*40);
      ctx.stroke();
      ctx.fillStyle = "#38bdf8"; ctx.fillText(`Pol 1 (${angle1}°)`, p1x, cy + 100);

      // Light between P1 and P2 (Linearly Polarized)
      // Draw sine wave tilted at angle1
      ctx.beginPath(); ctx.strokeStyle = "#eab308"; ctx.lineWidth = 3;
      for (let x = p1x + 10; x < cx + 100 - 10; x++) {
        const dx = x - p1x;
        const wave = Math.sin(dx * 0.1 - time * 0.1) * 30; // amplitude 30
        const wy = cy - wave * Math.cos(a1Rad);
        // It should technically project on y and z, but 2D canvas we just tilt it vertically
        if (x === p1x + 10) ctx.moveTo(x, wy); else ctx.lineTo(x, wy);
      }
      ctx.stroke();

      // Draw Polarizer 2 (Analyzer)
      const p2x = cx + 100;
      ctx.fillStyle = "rgba(244, 63, 94, 0.2)"; ctx.fillRect(p2x - 10, cy - 80, 20, 160);
      ctx.strokeStyle = "#f43f5e"; ctx.strokeRect(p2x - 10, cy - 80, 20, 160);
      // Grid lines
      ctx.beginPath();
      const a2Rad = (angle2 * Math.PI) / 180;
      ctx.moveTo(p2x + Math.sin(a2Rad)*40, cy - Math.cos(a2Rad)*40);
      ctx.lineTo(p2x - Math.sin(a2Rad)*40, cy + Math.cos(a2Rad)*40);
      ctx.stroke();
      ctx.fillStyle = "#f43f5e"; ctx.fillText(`Pol 2 (${angle2}°)`, p2x, cy + 100);

      // Light after P2
      // Amplitude scaled by cos(theta)
      const finalAmp = Math.cos(thetaDiffRad) * 30;
      ctx.beginPath(); ctx.strokeStyle = `rgba(234, 179, 8, ${intensity})`; ctx.lineWidth = 3;
      for (let x = p2x + 10; x < w - 20; x++) {
        const dx = x - p1x; // keep same phase
        const wave = Math.sin(dx * 0.1 - time * 0.1) * finalAmp;
        const wy = cy - wave * Math.cos(a2Rad); // now tilted at a2
        if (x === p2x + 10) ctx.moveTo(x, wy); else ctx.lineTo(x, wy);
      }
      ctx.stroke();

      // Eye
      ctx.fillStyle = "white"; ctx.font = "30px sans-serif"; ctx.fillText("👁️", w - 40, cy + 10);

      // Box Intensity
      ctx.fillStyle = "#18181b"; ctx.fillRect(cx - 50, 20, 100, 40);
      ctx.strokeStyle = "#52525b"; ctx.strokeRect(cx - 50, 20, 100, 40);
      ctx.fillStyle = intensity > 0.1 ? "#22c55e" : "#ef4444";
      ctx.fillText(`I = ${(intensity * 100).toFixed(0)}%`, cx, 48);

      time += 1;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [angle1, angle2]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Polarisasi Cahaya</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-sky-400 font-bold">Rotasi Polarisator 1</label>
                <span className="text-sky-400 font-mono">{angle1}°</span>
              </div>
              <input 
                type="range" className="w-full accent-sky-500" 
                min="0" max="180" step="15" 
                value={angle1} 
                onChange={(e) => setAngle1(parseInt(e.target.value))} 
              />
            </div>

            <div className="space-y-2 pt-4">
              <div className="flex justify-between">
                <label className="text-sm text-rose-400 font-bold">Rotasi Polarisator 2 (Analisator)</label>
                <span className="text-rose-400 font-mono">{angle2}°</span>
              </div>
              <input 
                type="range" className="w-full accent-rose-500" 
                min="0" max="180" step="15" 
                value={angle2} onChange={(e) => setAngle2(parseInt(e.target.value))} 
              />
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Cahaya tak terpolarisasi</strong> (misal dari Matahari/Lampu) bergetar ke segala arah.</p>
            <p>Filter Polarisator pertama akan menyaring dan hanya meloloskan getaran dalam satu bidang lurus.</p>
            <p><strong>Hukum Malus:</strong> Jika polarisator ke-2 diputar 90° tegak lurus (Crossed Polarizers), Intensitas cahaya yang lolos menjadi <strong className="text-red-500">NOL</strong> (gelap gulita).</p>
          </div>

        </div>
      </div>
    </div>
  );
}
