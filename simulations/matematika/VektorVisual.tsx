"use client";

import { useState, useEffect, useRef } from "react";

export default function VektorVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Vector U
  const [ux, setUx] = useState(3);
  const [uy, setUy] = useState(2);
  
  // Vector V
  const [vx, setVx] = useState(-1);
  const [vy, setVy] = useState(4);

  // Operations
  const [operation, setOperation] = useState<"add"|"sub"|"dot">("add");

  // Result vector (for add/sub)
  const rx = operation === "add" ? ux + vx : ux - vx;
  const ry = operation === "add" ? uy + vy : uy - vy;

  // Dot product
  const dotProduct = ux*vx + uy*vy;
  const magU = Math.sqrt(ux*ux + uy*uy);
  const magV = Math.sqrt(vx*vx + vy*vy);
  let theta = Math.acos(dotProduct / (magU * magV)) * (180 / Math.PI);
  if (isNaN(theta)) theta = 0;

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

      // Draw Grid
      ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 1;
      for(let i=cx%scale; i<w; i+=scale) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
      for(let i=cy%scale; i<h; i+=scale) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

      // Axes
      ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke(); // X
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke(); // Y
      ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.font = "12px sans-serif";
      ctx.fillText("X", w - 15, cy + 15); ctx.fillText("Y", cx + 10, 15);

      const drawArrow = (x1: number, y1: number, x2: number, y2: number, color: string, label: string) => {
        const headlen = 10;
        const dx = x2 - x1;
        const dy = y2 - y1;
        const angle = Math.atan2(dy, dx);

        ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();

        // Label
        ctx.font = "bold 14px sans-serif";
        ctx.fillText(label, x2 + 5, y2 - 5);
      };

      // Coordinate mapping
      const toScrn = (x: number, y: number) => ({ x: cx + x*scale, y: cy - y*scale });

      const p0 = toScrn(0,0);
      const pu = toScrn(ux, uy);
      const pv = toScrn(vx, vy);

      if (operation === "add") {
        // U + V (Parallelogram rule)
        const pr = toScrn(rx, ry);
        
        // Ghost projections
        ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.setLineDash([5,5]); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(pu.x, pu.y); ctx.lineTo(pr.x, pr.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pv.x, pv.y); ctx.lineTo(pr.x, pr.y); ctx.stroke();
        ctx.setLineDash([]);

        drawArrow(p0.x, p0.y, pu.x, pu.y, "#3b82f6", "u"); // Blue
        drawArrow(p0.x, p0.y, pv.x, pv.y, "#ef4444", "v"); // Red
        drawArrow(p0.x, p0.y, pr.x, pr.y, "#10b981", "u+v"); // Green

      } else if (operation === "sub") {
        // U - V
        const pr = toScrn(rx, ry);
        const nV = toScrn(-vx, -vy);

        // Draw negative V ghost
        ctx.strokeStyle = "rgba(239, 68, 68, 0.3)"; ctx.setLineDash([5,5]); ctx.lineWidth = 2;
        drawArrow(p0.x, p0.y, nV.x, nV.y, "rgba(239, 68, 68, 0.5)", "-v");
        ctx.beginPath(); ctx.moveTo(pu.x, pu.y); ctx.lineTo(pr.x, pr.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(nV.x, nV.y); ctx.lineTo(pr.x, pr.y); ctx.stroke();
        ctx.setLineDash([]);

        drawArrow(p0.x, p0.y, pu.x, pu.y, "#3b82f6", "u"); // Blue
        drawArrow(p0.x, p0.y, pv.x, pv.y, "#ef4444", "v"); // Red
        drawArrow(p0.x, p0.y, pr.x, pr.y, "#f59e0b", "u-v"); // Amber

      } else {
        // Dot Product Visualization
        drawArrow(p0.x, p0.y, pu.x, pu.y, "#3b82f6", "u"); // Blue
        drawArrow(p0.x, p0.y, pv.x, pv.y, "#ef4444", "v"); // Red

        // Draw Angle Arc
        const a1 = Math.atan2(-uy, ux); // negative y because canvas y is inverted
        const a2 = Math.atan2(-vy, vx);
        ctx.beginPath();
        ctx.arc(cx, cy, 30, Math.min(a1, a2), Math.max(a1, a2), Math.abs(a1-a2) > Math.PI);
        ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth=2; ctx.stroke();
        ctx.fillStyle = "white"; ctx.font="12px sans-serif";
        ctx.fillText(`θ ≈ ${theta.toFixed(1)}°`, cx + 35, cy - 35);
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [ux, uy, vx, vy, operation, rx, ry, theta]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Vektor 2D</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="flex gap-2 p-1 bg-zinc-900 rounded-xl border border-white/10">
            <button onClick={() => setOperation("add")} className={`flex-1 py-2 rounded-lg text-sm font-bold font-mono ${operation === "add" ? "bg-emerald-500 text-white" : "text-zinc-500 hover:text-zinc-300"}`}>u + v</button>
            <button onClick={() => setOperation("sub")} className={`flex-1 py-2 rounded-lg text-sm font-bold font-mono ${operation === "sub" ? "bg-amber-500 text-white" : "text-zinc-500 hover:text-zinc-300"}`}>u - v</button>
            <button onClick={() => setOperation("dot")} className={`flex-1 py-2 rounded-lg text-sm font-bold font-mono ${operation === "dot" ? "bg-purple-500 text-white" : "text-zinc-500 hover:text-zinc-300"}`}>u • v</button>
          </div>

          <div className="bg-black/30 border border-white/10 p-4 rounded-xl shadow-inner space-y-2">
            {operation === "add" && (
              <>
                <div className="text-[10px] text-zinc-400 font-bold uppercase">Hasil Penjumlahan</div>
                <div className="text-xl font-mono text-emerald-400 font-bold">
                  [{rx}, {ry}]
                </div>
              </>
            )}
            {operation === "sub" && (
              <>
                <div className="text-[10px] text-zinc-400 font-bold uppercase">Hasil Pengurangan</div>
                <div className="text-xl font-mono text-amber-400 font-bold">
                  [{rx}, {ry}]
                </div>
              </>
            )}
            {operation === "dot" && (
              <>
                <div className="text-[10px] text-zinc-400 font-bold uppercase">Dot Product (Skalar)</div>
                <div className="text-xl font-mono text-purple-400 font-bold">
                  u • v = {dotProduct}
                </div>
                <div className="text-xs text-zinc-400 mt-2">
                  |u| = {magU.toFixed(2)}, |v| = {magV.toFixed(2)}<br/>
                  θ = {theta.toFixed(1)}°
                </div>
              </>
            )}
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            {/* Vektor U */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-blue-400">Vektor u = [{ux}, {uy}]</label>
              <div className="flex gap-2">
                <input type="range" className="w-full accent-blue-500" min="-10" max="10" step="1" value={ux} onChange={(e)=>setUx(Number(e.target.value))} />
                <input type="range" className="w-full accent-blue-500" min="-10" max="10" step="1" value={uy} onChange={(e)=>setUy(Number(e.target.value))} />
              </div>
            </div>

            {/* Vektor V */}
            <div className="space-y-2 pt-2">
              <label className="text-sm font-bold text-rose-400">Vektor v = [{vx}, {vy}]</label>
              <div className="flex gap-2">
                <input type="range" className="w-full accent-rose-500" min="-10" max="10" step="1" value={vx} onChange={(e)=>setVx(Number(e.target.value))} />
                <input type="range" className="w-full accent-rose-500" min="-10" max="10" step="1" value={vy} onChange={(e)=>setVy(Number(e.target.value))} />
              </div>
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-2 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Vektor</strong> memiliki Nilai (panjang) dan Arah.</p>
            {operation === "add" && <p>Penjumlahan vektor menggunakan aturan <strong>Jajargenjang</strong> atau metode Ujung-ke-Pangkal (Poligon).</p>}
            {operation === "sub" && <p>Pengurangan u - v sama dengan menjumlahkan u dengan vektor negatif v (arah dibalik).</p>}
            {operation === "dot" && <p><strong>Dot Product</strong> menghasilkan sebuah angka (skalar). Jika sudut antar vektor = 90°, maka Dot Product = 0.</p>}
          </div>

        </div>
      </div>
    </div>
  );
}
