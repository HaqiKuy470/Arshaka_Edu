"use client";

import { useState, useEffect, useRef } from "react";

export default function GrafikFungsi() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);

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
      const scale = 20; // pixels per unit

      // Draw Grid
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += scale) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += scale) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Draw Axes
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, canvas.height); ctx.stroke(); // Y
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(canvas.width, cy); ctx.stroke(); // X

      // Draw Function y = ax^2 + bx + c
      ctx.beginPath();
      ctx.strokeStyle = "#10b981"; // Emerald
      ctx.lineWidth = 3;
      let first = true;
      
      for (let px = 0; px < canvas.width; px++) {
        // Convert screen X to math X
        const mx = (px - cx) / scale;
        // Calculate math Y
        const my = a * mx * mx + b * mx + c;
        // Convert math Y to screen Y
        const py = cy - (my * scale);
        
        if (first) {
          ctx.moveTo(px, py);
          first = false;
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();

      // Draw vertex (titik puncak)
      // x = -b / 2a
      if (a !== 0) {
        const vx = -b / (2 * a);
        const vy = a * vx * vx + b * vx + c;
        const pvx = cx + vx * scale;
        const pvy = cy - vy * scale;
        
        ctx.beginPath();
        ctx.arc(pvx, pvy, 5, 0, Math.PI*2);
        ctx.fillStyle = "#ef4444";
        ctx.fill();
        
        ctx.fillStyle = "white";
        ctx.font = "12px sans-serif";
        ctx.fillText(`(${vx.toFixed(1)}, ${vy.toFixed(1)})`, pvx + 10, pvy - 10);
      }
    };

    render();
    window.addEventListener('resize', render);
    return () => window.removeEventListener('resize', render);
  }, [a, b, c]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Fungsi Kuadrat</h3></div>
        <div className="p-4 flex-1 overflow-y-auto space-y-6">
          <div className="text-center font-mono text-xl text-emerald-400 py-4 bg-black/20 rounded-xl border border-white/5">
            y = {a}x² + {b}x + {c}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between"><label className="text-sm text-zinc-300">Koefisien a</label><span className="text-white">{a}</span></div>
            <input type="range" className="w-full accent-emerald-500" min="-5" max="5" step="0.5" value={a} onChange={(e) => setA(parseFloat(e.target.value))} />
            <p className="text-xs text-zinc-500">Mengatur kelebaran & arah kurva</p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between"><label className="text-sm text-zinc-300">Koefisien b</label><span className="text-white">{b}</span></div>
            <input type="range" className="w-full accent-emerald-500" min="-10" max="10" step="1" value={b} onChange={(e) => setB(parseInt(e.target.value))} />
            <p className="text-xs text-zinc-500">Menggeser puncak secara horizontal</p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between"><label className="text-sm text-zinc-300">Konstanta c</label><span className="text-white">{c}</span></div>
            <input type="range" className="w-full accent-emerald-500" min="-10" max="10" step="1" value={c} onChange={(e) => setC(parseInt(e.target.value))} />
            <p className="text-xs text-zinc-500">Titik potong sumbu Y</p>
          </div>
        </div>
        <div className="p-4 border-t border-white/10 bg-black/20">
          <button onClick={() => {setA(1); setB(0); setC(0);}} className="w-full py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200">Reset</button>
        </div>
      </div>
    </div>
  );
}
