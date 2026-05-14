"use client";

import { useState, useEffect, useRef } from "react";

export default function MatriksTransformasi() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [m00, setM00] = useState(1);
  const [m01, setM01] = useState(0);
  const [m10, setM10] = useState(0);
  const [m11, setM11] = useState(1);

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
      const scale = 50;

      // Draw Grid
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 1;
      for (let i = -20; i <= 20; i++) {
        ctx.beginPath(); ctx.moveTo(0, cy + i * scale); ctx.lineTo(canvas.width, cy + i * scale); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + i * scale, 0); ctx.lineTo(cx + i * scale, canvas.height); ctx.stroke();
      }
      
      // Main Axes
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(canvas.width, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, canvas.height); ctx.stroke();

      // Original Square Vertices (0,0), (1,0), (1,1), (0,1)
      const pts = [[0,0], [1,0], [1,1], [0,1]];
      
      // Draw Original (Dashed)
      ctx.beginPath();
      ctx.strokeStyle = "rgba(161, 161, 170, 0.5)"; // zinc-400
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 2;
      pts.forEach((pt, i) => {
        const px = cx + pt[0] * scale;
        const py = cy - pt[1] * scale;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]);

      // Transform Points:
      // x' = x*m00 + y*m01
      // y' = x*m10 + y*m11
      const tPts = pts.map(pt => [
        pt[0] * m00 + pt[1] * m01,
        pt[0] * m10 + pt[1] * m11
      ]);

      // Draw Transformed Shape
      ctx.beginPath();
      ctx.fillStyle = "rgba(139, 92, 246, 0.4)"; // violet-500
      ctx.strokeStyle = "#8b5cf6";
      ctx.lineWidth = 3;
      tPts.forEach((pt, i) => {
        const px = cx + pt[0] * scale;
        const py = cy - pt[1] * scale;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Draw Basis Vectors i (red) and j (green)
      const drawVector = (x: number, y: number, color: string) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + x * scale, cy - y * scale);
        ctx.stroke();
        // Arrowhead
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(cx + x * scale, cy - y * scale, 4, 0, Math.PI*2);
        ctx.fill();
      };

      drawVector(m00, m10, "#ef4444"); // Transformed i-hat
      drawVector(m01, m11, "#22c55e"); // Transformed j-hat
    };

    render();
    window.addEventListener('resize', render);
    return () => window.removeEventListener('resize', render);
  }, [m00, m01, m10, m11]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Transformasi Matriks</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-8">
          
          <div className="flex justify-center">
            <div className="grid grid-cols-2 gap-2 text-2xl font-mono p-4 border-l-2 border-r-2 border-white/50 rounded-xl bg-black/20">
              <input type="number" value={m00} onChange={(e) => setM00(parseFloat(e.target.value)||0)} className="w-16 bg-transparent text-center text-red-400 outline-none" step="0.5" />
              <input type="number" value={m01} onChange={(e) => setM01(parseFloat(e.target.value)||0)} className="w-16 bg-transparent text-center text-green-400 outline-none" step="0.5" />
              <input type="number" value={m10} onChange={(e) => setM10(parseFloat(e.target.value)||0)} className="w-16 bg-transparent text-center text-red-400 outline-none" step="0.5" />
              <input type="number" value={m11} onChange={(e) => setM11(parseFloat(e.target.value)||0)} className="w-16 bg-transparent text-center text-green-400 outline-none" step="0.5" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => {setM00(1); setM01(0); setM10(0); setM11(1);}} className="py-2 bg-white/10 rounded hover:bg-white/20 text-xs">Identitas</button>
            <button onClick={() => {setM00(2); setM01(0); setM10(0); setM11(2);}} className="py-2 bg-white/10 rounded hover:bg-white/20 text-xs">Skala 2x</button>
            <button onClick={() => {setM00(1); setM01(1); setM10(0); setM11(1);}} className="py-2 bg-white/10 rounded hover:bg-white/20 text-xs">Geser X (Shear)</button>
            <button onClick={() => {setM00(0); setM01(-1); setM10(1); setM11(0);}} className="py-2 bg-white/10 rounded hover:bg-white/20 text-xs">Rotasi 90°</button>
          </div>

          <div className="text-xs text-zinc-400 space-y-2">
            <p><span className="text-red-400 font-bold">Merah</span>: Ke mana vektor <i>i</i> (1,0) mendarat.</p>
            <p><span className="text-green-400 font-bold">Hijau</span>: Ke mana vektor <i>j</i> (0,1) mendarat.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
