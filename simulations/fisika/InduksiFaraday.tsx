"use client";

import { useState, useEffect, useRef } from "react";

export default function InduksiFaraday() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [magnetX, setMagnetX] = useState(0); // position from -200 to 200
  const [speed, setSpeed] = useState(0); // velocity of magnet

  // EMF (Voltage) is proportional to speed of magnet entering/leaving coil
  // If magnet is inside coil (around x=0), the flux is high. 
  // dFlux/dt is highest when magnet is entering or exiting the edge.
  // Simplified logic for visual:

  const inCoilRegion = Math.abs(magnetX) < 80;
  const edgeDist = 80 - Math.abs(magnetX);
  // Voltage spikes when edgeDist is near 0
  let emf = 0;
  if (Math.abs(magnetX) > 20 && Math.abs(magnetX) < 120) {
    // Gradient region
    emf = speed * (magnetX > 0 ? -1 : 1);
  }

  // Cap EMF visual
  const needleAngle = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, emf * 0.05));

  // Store previous X to calculate speed manually
  const lastXRef = useRef(magnetX);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Calculate speed based on slider movement delta
    const dX = magnetX - lastXRef.current;
    lastXRef.current = magnetX;
    setSpeed(dX * 2); // sensitivity

    // Decay speed back to 0 if user stops sliding
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSpeed(0);
    }, 100);

    return () => clearTimeout(timerRef.current);
  }, [magnetX]);

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

      // Draw Wire Circuit
      ctx.strokeStyle = "#52525b"; // zinc-600
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(cx - 150, cy);
      ctx.lineTo(cx - 150, cy - 120);
      ctx.lineTo(cx + 150, cy - 120);
      ctx.lineTo(cx + 150, cy);
      ctx.stroke();

      // Draw Galvanometer (Top Middle)
      const gx = cx;
      const gy = cy - 120;
      ctx.fillStyle = "#18181b"; // zinc-900
      ctx.beginPath(); ctx.arc(gx, gy, 40, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 4; ctx.stroke();

      // Galvanometer ticks
      ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(gx, gy - 35); ctx.lineTo(gx, gy - 25); ctx.stroke(); // 0
      ctx.beginPath(); ctx.moveTo(gx - 25, gy - 25); ctx.lineTo(gx - 18, gy - 18); ctx.stroke(); // Left
      ctx.beginPath(); ctx.moveTo(gx + 25, gy - 25); ctx.lineTo(gx + 18, gy - 18); ctx.stroke(); // Right

      ctx.fillStyle = "white"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("G", gx, gy + 20);

      // Galvanometer Needle
      ctx.beginPath();
      ctx.translate(gx, gy + 10);
      ctx.rotate(needleAngle);
      ctx.moveTo(0, 0); ctx.lineTo(0, -35);
      ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 3; ctx.stroke();
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      // Lightbulb indicator (Brightness based on EMF)
      const brightness = Math.min(1, Math.abs(emf) / 30);
      ctx.fillStyle = `rgba(250, 204, 21, ${brightness})`; // yellow
      ctx.beginPath(); ctx.arc(cx - 150, cy - 60, 20, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#fcd34d"; ctx.stroke();

      // Draw Solenoid (Coil) at center
      ctx.strokeStyle = "#f59e0b"; // amber-500 (copper)
      ctx.lineWidth = 8;
      ctx.beginPath();
      for (let i = -80; i <= 80; i += 10) {
        ctx.moveTo(cx + i, cy - 40);
        ctx.lineTo(cx + i, cy + 40);
      }
      ctx.stroke();

      // Draw Magnet
      const mX = cx + magnetX;
      ctx.fillStyle = "#ef4444"; // N Red
      ctx.fillRect(mX - 50, cy - 20, 50, 40);
      ctx.fillStyle = "white"; ctx.fillText("N", mX - 25, cy + 5);

      ctx.fillStyle = "#3b82f6"; // S Blue
      ctx.fillRect(mX, cy - 20, 50, 40);
      ctx.fillStyle = "white"; ctx.fillText("S", mX + 25, cy + 5);

      // Magnet Field lines
      if (Math.abs(speed) === 0) {
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(mX - 50, cy, 30, Math.PI / 2, Math.PI * 1.5); ctx.stroke();
        ctx.beginPath(); ctx.arc(mX - 50, cy, 50, Math.PI / 2, Math.PI * 1.5); ctx.stroke();
      }

    };

    // Render loop continuously just in case
    let rAF = requestAnimationFrame(function loop() {
      render();
      rAF = requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(rAF);
  }, [magnetX, needleAngle, emf, speed]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Induksi Elektromagnetik (Hukum Faraday)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">

          <div className="bg-amber-500/10 border border-amber-500/30 p-6 rounded-xl text-center shadow-inner">
            <div className="text-xs text-amber-400 font-bold mb-1 uppercase tracking-widest">GGL Induksi (V)</div>
            <div className="text-4xl font-mono text-white">{Math.abs(emf).toFixed(1)} <span className="text-xl text-zinc-400">mV</span></div>
            <div className={`text-[10px] mt-2 font-bold ${Math.abs(emf) > 5 ? 'text-emerald-400 animate-pulse' : 'text-zinc-500'}`}>
              {Math.abs(emf) > 5 ? "Arus Mengalir!" : "Tidak Ada Arus"}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="space-y-2">
              <div className="flex justify-between"><label className="text-sm text-white font-bold">Geser Magnet</label></div>
              <input
                type="range"
                className="w-full accent-red-500 cursor-ew-resize"
                min="-200" max="200" step="2"
                value={magnetX}
                onChange={(e) => setMagnetX(parseInt(e.target.value))}
              />
              <p className="text-[10px] text-zinc-500 text-center">Geser slider dengan cepat maju-mundur!</p>
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Hukum Faraday:</strong> Arus listrik (GGL Induksi) hanya muncul ketika ada <strong>Perubahan Fluks Magnetik</strong> terhadap waktu (saat magnet bergerak menembus kumparan).</p>
            <p className="text-red-400 font-bold">Jika magnet diam di dalam kumparan, arus akan bernilai 0!</p>
            <div className="font-mono text-white text-center mt-2">ε = -N · (ΔΦ / Δt)</div>
          </div>

        </div>
      </div>
    </div>
  );
}
