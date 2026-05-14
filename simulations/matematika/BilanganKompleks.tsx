"use client";

import { useState, useEffect, useRef } from "react";

export default function BilanganKompleks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // z = a + bi
  const [real, setReal] = useState(3);
  const [imag, setImag] = useState(4);

  // Polar form
  const r = Math.sqrt(real*real + imag*imag);
  let theta = Math.atan2(imag, real) * (180 / Math.PI); // degrees
  if (theta < 0) theta += 360;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const scale = 30; // pixels per unit

      // Draw Polar Circles
      ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 1;
      for (let i=1; i<=10; i++) {
        ctx.beginPath(); ctx.arc(cx, cy, i*scale, 0, Math.PI*2); ctx.stroke();
      }

      // Axes (Argand Plane)
      ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke(); // Real (X)
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke(); // Imaginary (Y)
      
      ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.font = "12px sans-serif";
      ctx.fillText("Re", w - 20, cy + 15); ctx.fillText("Im", cx + 10, 15);

      // Plot point Z
      const px = cx + real * scale;
      const py = cy - imag * scale;

      // Draw line from origin (Modulus)
      ctx.strokeStyle = "#a855f7"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();

      // Draw components (Rectangular)
      ctx.strokeStyle = "rgba(168, 85, 247, 0.3)"; ctx.setLineDash([5,5]); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(px, cy); ctx.lineTo(px, py); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, py); ctx.lineTo(px, py); ctx.stroke();
      ctx.setLineDash([]);

      // Draw Angle Arc (Argument)
      const a_rad = Math.atan2(-imag, real);
      ctx.beginPath();
      if (a_rad < 0) {
        ctx.arc(cx, cy, 40, 0, a_rad, true);
      } else {
        ctx.arc(cx, cy, 40, 0, a_rad, true); // canvas y is inverted, so negative angle is clockwise visually
      }
      ctx.strokeStyle = "#3b82f6"; ctx.lineWidth=2; ctx.stroke();
      
      // Point
      ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI*2);
      ctx.fillStyle = "#a855f7"; ctx.fill(); ctx.strokeStyle = "white"; ctx.stroke();

      // Label
      ctx.fillStyle = "white"; ctx.font = "bold 14px sans-serif";
      ctx.fillText(`z`, px + 10, py - 10);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [real, imag]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Bidang Argand (Bil. Kompleks)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-4">
            {/* Kartesius Form */}
            <div className="bg-black/30 border border-purple-500/30 p-4 rounded-xl text-center shadow-inner">
              <div className="text-[10px] text-purple-300 font-bold mb-1 uppercase tracking-wider">Bentuk Kartesius</div>
              <div className="text-2xl font-mono text-purple-400 font-bold">
                z = {real} {imag >= 0 ? `+ ${imag}i` : `- ${Math.abs(imag)}i`}
              </div>
            </div>

            {/* Polar Form */}
            <div className="bg-black/30 border border-blue-500/30 p-4 rounded-xl text-center shadow-inner">
              <div className="text-[10px] text-blue-300 font-bold mb-1 uppercase tracking-wider">Bentuk Polar</div>
              <div className="text-xl font-mono text-blue-400 font-bold">
                z = {r % 1 === 0 ? r : r.toFixed(2)} ∠ {theta.toFixed(1)}°
              </div>
              <div className="text-xs font-mono text-zinc-400 mt-2">
                z = r(cos θ + i sin θ)
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-rose-400">Bagian Real (Re)</label>
                <span className="font-mono text-rose-400">{real}</span>
              </div>
              <input type="range" className="w-full accent-rose-500" min="-10" max="10" step="1" value={real} onChange={(e) => setReal(parseInt(e.target.value))} />
              <p className="text-[10px] text-zinc-500">Sumbu horizontal X</p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-emerald-400">Bagian Imajiner (Im)</label>
                <span className="font-mono text-emerald-400">{imag}i</span>
              </div>
              <input type="range" className="w-full accent-emerald-500" min="-10" max="10" step="1" value={imag} onChange={(e) => setImag(parseInt(e.target.value))} />
              <p className="text-[10px] text-zinc-500">Sumbu vertikal Y (mengandung akar -1)</p>
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-2 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Bilangan Kompleks</strong> adalah perluasan sistem bilangan riil dengan menambah bilangan imajiner <span className="font-mono">i = √(-1)</span>.</p>
            <p>Bilangan ini tidak bisa direpresentasikan di garis lurus, melainkan butuh sebuah bidang 2D yang disebut <strong>Bidang Argand</strong>.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
