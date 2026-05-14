"use client";

import { useState, useEffect, useRef } from "react";

export default function AljabarLinear() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Line 1: y = m1*x + c1
  const [m1, setM1] = useState(1);
  const [c1, setC1] = useState(2);
  
  // Line 2: y = m2*x + c2
  const [m2, setM2] = useState(-1);
  const [c2, setC2] = useState(4);

  // Intersection logic
  let interX = 0;
  let interY = 0;
  let isParallel = false;

  if (m1 === m2) {
    isParallel = true;
  } else {
    interX = (c2 - c1) / (m1 - m2);
    interY = m1 * interX + c1;
  }

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
      const scale = 30;

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
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, canvas.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(canvas.width, cy); ctx.stroke();

      // Function to draw line
      const drawLine = (m: number, c: number, color: string) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        
        // Find y for x=-20 and x=20
        const xStart = -20;
        const yStart = m * xStart + c;
        const pxStart = cx + xStart * scale;
        const pyStart = cy - yStart * scale;

        const xEnd = 20;
        const yEnd = m * xEnd + c;
        const pxEnd = cx + xEnd * scale;
        const pyEnd = cy - yEnd * scale;

        ctx.moveTo(pxStart, pyStart);
        ctx.lineTo(pxEnd, pyEnd);
        ctx.stroke();
      };

      drawLine(m1, c1, "#38bdf8"); // Sky
      drawLine(m2, c2, "#fb7185"); // Rose

      // Draw Intersection point
      if (!isParallel) {
        const px = cx + interX * scale;
        const py = cy - interY * scale;
        
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI*2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    };

    render();
    window.addEventListener('resize', render);
    return () => window.removeEventListener('resize', render);
  }, [m1, c1, m2, c2, interX, interY, isParallel]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Sistem Persamaan Linear</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-8">
          
          {/* Line 1 */}
          <div className="space-y-4">
            <div className="text-sky-400 font-mono font-bold text-lg bg-sky-500/10 p-2 rounded">
              y = {m1}x + {c1}
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1 text-zinc-400"><span>Gradien (m₁)</span><span>{m1}</span></div>
              <input type="range" className="w-full accent-sky-500" min="-5" max="5" step="0.5" value={m1} onChange={(e) => setM1(parseFloat(e.target.value))} />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1 text-zinc-400"><span>Intersep (c₁)</span><span>{c1}</span></div>
              <input type="range" className="w-full accent-sky-500" min="-10" max="10" step="1" value={c1} onChange={(e) => setC1(parseFloat(e.target.value))} />
            </div>
          </div>

          <div className="w-full h-px bg-white/10" />

          {/* Line 2 */}
          <div className="space-y-4">
            <div className="text-rose-400 font-mono font-bold text-lg bg-rose-500/10 p-2 rounded">
              y = {m2}x + {c2}
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1 text-zinc-400"><span>Gradien (m₂)</span><span>{m2}</span></div>
              <input type="range" className="w-full accent-rose-500" min="-5" max="5" step="0.5" value={m2} onChange={(e) => setM2(parseFloat(e.target.value))} />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1 text-zinc-400"><span>Intersep (c₂)</span><span>{c2}</span></div>
              <input type="range" className="w-full accent-rose-500" min="-10" max="10" step="1" value={c2} onChange={(e) => setC2(parseFloat(e.target.value))} />
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-sm font-bold text-white mb-2">Titik Potong (Solusi)</h4>
            {isParallel ? (
              <span className="text-yellow-400 font-mono">Garis Sejajar (Tidak ada solusi)</span>
            ) : (
              <span className="text-green-400 font-mono text-xl">(x: {interX.toFixed(2)}, y: {interY.toFixed(2)})</span>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
