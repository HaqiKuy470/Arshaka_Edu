"use client";

import { useState, useEffect, useRef } from "react";

export default function SistemPersamaan() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Line 1: a1 x + b1 y = c1
  const [a1, setA1] = useState(2);
  const [b1, setB1] = useState(1);
  const [c1, setC1] = useState(4);
  
  // Line 2: a2 x + b2 y = c2
  const [a2, setA2] = useState(1);
  const [b2, setB2] = useState(-1);
  const [c2, setC2] = useState(2);

  // Determinant
  const det = a1 * b2 - a2 * b1;
  const hasSolution = det !== 0;

  // Cramer's rule for intersection
  const x = hasSolution ? (c1 * b2 - c2 * b1) / det : 0;
  const y = hasSolution ? (a1 * c2 - a2 * c1) / det : 0;

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

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const scale = 30; // pixels per unit

      // Draw Grid
      ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 1;
      for(let i=0; i<w; i+=scale) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
      for(let i=0; i<h; i+=scale) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

      // Axes
      ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke(); // X
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke(); // Y
      ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.font = "12px sans-serif";
      ctx.fillText("X", w - 15, cy + 15); ctx.fillText("Y", cx + 10, 15);

      // Line drawing helper
      const drawLine = (a: number, b: number, c: number, color: string) => {
        ctx.beginPath();
        if (b === 0) {
          // Vertical line
          const vx = cx + (c/a)*scale;
          ctx.moveTo(vx, 0); ctx.lineTo(vx, h);
        } else {
          // y = (c - ax)/b
          const y1 = (c - a*(-cx/scale))/b;
          const y2 = (c - a*(cx/scale))/b;
          ctx.moveTo(0, cy - y1*scale);
          ctx.lineTo(w, cy - y2*scale);
        }
        ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.stroke();
      };

      // Draw Lines
      drawLine(a1, b1, c1, "#3b82f6"); // Blue
      drawLine(a2, b2, c2, "#ef4444"); // Red

      // Draw Intersection
      if (hasSolution) {
        const px = cx + x * scale;
        const py = cy - y * scale;
        
        // Pulse effect
        const pulse = Math.sin(time * 0.1) * 3;
        ctx.beginPath(); ctx.arc(px, py, 6 + pulse, 0, Math.PI*2);
        ctx.fillStyle = "#10b981"; ctx.fill();
        ctx.strokeStyle = "white"; ctx.lineWidth = 2; ctx.stroke();

        ctx.fillStyle = "white"; ctx.font = "bold 14px sans-serif";
        ctx.fillText(`(${x.toFixed(1)}, ${y.toFixed(1)})`, px + 15, py - 10);
      } else {
        ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.font = "italic 14px sans-serif";
        ctx.fillText(a1*c2 === a2*c1 ? "Garis Berimpit (Solusi Tak Hingga)" : "Garis Sejajar (Tidak Ada Solusi)", 20, 30);
      }

      time++;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [a1, b1, c1, a2, b2, c2, x, y, hasSolution]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Sistem Persamaan Linear</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="bg-black/30 border border-white/10 p-4 rounded-xl text-center shadow-inner">
            <div className="text-[10px] text-zinc-400 font-bold mb-2 uppercase tracking-wider">Titik Potong (Solusi)</div>
            {hasSolution ? (
              <div className="text-3xl font-mono text-emerald-400 font-bold">
                ({x % 1 === 0 ? x : x.toFixed(2)}, {y % 1 === 0 ? y : y.toFixed(2)})
              </div>
            ) : (
              <div className="text-xl font-bold text-rose-400">
                {a1*c2 === a2*c1 ? "Tak Hingga" : "Tidak Ada"}
              </div>
            )}
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            {/* Persamaan 1 */}
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl space-y-2">
              <div className="font-mono text-blue-400 font-bold text-center mb-2">{a1}x + {b1}y = {c1}</div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-blue-300">a₁</label>
                  <input type="number" className="w-full bg-black/50 border border-blue-500/30 rounded p-1 text-white text-center font-mono text-sm" value={a1} onChange={(e)=>setA1(Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-[10px] text-blue-300">b₁</label>
                  <input type="number" className="w-full bg-black/50 border border-blue-500/30 rounded p-1 text-white text-center font-mono text-sm" value={b1} onChange={(e)=>setB1(Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-[10px] text-blue-300">c₁</label>
                  <input type="number" className="w-full bg-black/50 border border-blue-500/30 rounded p-1 text-white text-center font-mono text-sm" value={c1} onChange={(e)=>setC1(Number(e.target.value))} />
                </div>
              </div>
            </div>

            {/* Persamaan 2 */}
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl space-y-2">
              <div className="font-mono text-rose-400 font-bold text-center mb-2">{a2}x + {b2}y = {c2}</div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-rose-300">a₂</label>
                  <input type="number" className="w-full bg-black/50 border border-rose-500/30 rounded p-1 text-white text-center font-mono text-sm" value={a2} onChange={(e)=>setA2(Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-[10px] text-rose-300">b₂</label>
                  <input type="number" className="w-full bg-black/50 border border-rose-500/30 rounded p-1 text-white text-center font-mono text-sm" value={b2} onChange={(e)=>setB2(Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-[10px] text-rose-300">c₂</label>
                  <input type="number" className="w-full bg-black/50 border border-rose-500/30 rounded p-1 text-white text-center font-mono text-sm" value={c2} onChange={(e)=>setC2(Number(e.target.value))} />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-2 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Sistem Persamaan Linear Dua Variabel (SPLDV):</strong> Mencari nilai (x, y) yang memenuhi kedua persamaan sekaligus.</p>
            <p>Secara grafis, solusinya adalah <strong>titik potong</strong> antara kedua garis tersebut pada koordinat Kartesius.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
