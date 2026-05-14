"use client";

import { useState, useEffect, useRef } from "react";

export default function Kesebangunan() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [scale, setScale] = useState(1.5); // scale factor k
  const [shape, setShape] = useState<"triangle"|"rect">("triangle");

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

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw Grid
      ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 1;
      for(let i=0; i<canvas.width; i+=40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke(); }
      for(let i=0; i<canvas.height; i+=40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke(); }

      const baseSize = 80;

      // Object 1 (Original) - Left
      const o1x = cx - 150;
      const o1y = cy;

      // Object 2 (Scaled) - Right
      const o2x = cx + 150;
      const o2y = cy;

      const drawShape = (x: number, y: number, k: number, color: string) => {
        ctx.beginPath();
        if (shape === "triangle") {
          ctx.moveTo(x - (baseSize*k)/2, y + (baseSize*k)/2);
          ctx.lineTo(x + (baseSize*k)/2, y + (baseSize*k)/2);
          ctx.lineTo(x, y - (baseSize*k)/2);
        } else {
          ctx.rect(x - (baseSize*k)/2, y - (baseSize*k)/2, baseSize*k, baseSize*k);
        }
        ctx.closePath();
        ctx.fillStyle = `${color}33`; // 20% opacity
        ctx.fill();
        ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.stroke();
      };

      // Draw projection lines
      ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.setLineDash([5, 5]); ctx.lineWidth = 1;
      
      const drawProjection = () => {
        ctx.beginPath();
        if (shape === "triangle") {
          ctx.moveTo(o1x - baseSize/2, o1y + baseSize/2); ctx.lineTo(o2x - (baseSize*scale)/2, o2y + (baseSize*scale)/2);
          ctx.moveTo(o1x + baseSize/2, o1y + baseSize/2); ctx.lineTo(o2x + (baseSize*scale)/2, o2y + (baseSize*scale)/2);
          ctx.moveTo(o1x, o1y - baseSize/2); ctx.lineTo(o2x, o2y - (baseSize*scale)/2);
        } else {
          ctx.moveTo(o1x - baseSize/2, o1y - baseSize/2); ctx.lineTo(o2x - (baseSize*scale)/2, o2y - (baseSize*scale)/2);
          ctx.moveTo(o1x + baseSize/2, o1y - baseSize/2); ctx.lineTo(o2x + (baseSize*scale)/2, o2y - (baseSize*scale)/2);
          ctx.moveTo(o1x - baseSize/2, o1y + baseSize/2); ctx.lineTo(o2x - (baseSize*scale)/2, o2y + (baseSize*scale)/2);
          ctx.moveTo(o1x + baseSize/2, o1y + baseSize/2); ctx.lineTo(o2x + (baseSize*scale)/2, o2y + (baseSize*scale)/2);
        }
        ctx.stroke();
      };
      drawProjection();
      ctx.setLineDash([]);

      drawShape(o1x, o1y, 1, "#3b82f6"); // Original Blue
      drawShape(o2x, o2y, scale, "#f59e0b"); // Scaled Amber

      // Labels
      ctx.fillStyle = "white"; ctx.font = "14px sans-serif"; ctx.textAlign="center";
      ctx.fillText("Bangun Asal (k = 1)", o1x, o1y + baseSize/2 + 30);
      ctx.fillText(`Bangun Hasil (k = ${scale})`, o2x, o2y + (baseSize*scale)/2 + 30);

      // Area info
      ctx.font = "12px sans-serif"; ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillText("Luas = L", o1x, o1y + baseSize/2 + 50);
      ctx.fillText(`Luas = ${(scale*scale).toFixed(2)}L`, o2x, o2y + (baseSize*scale)/2 + 50);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [scale, shape]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Kesebangunan & Kekongruenan</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="bg-black/30 border border-white/10 p-4 rounded-xl text-center shadow-inner">
            <div className={`text-2xl font-bold ${scale === 1 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {scale === 1 ? "Kongruen" : "Sebangun"}
            </div>
            <div className="text-xs text-zinc-400 mt-2">
              {scale === 1 ? "Bentuk & Ukuran SAMA" : "Bentuk SAMA, Ukuran BERBEDA"}
            </div>
          </div>

          <div className="flex gap-2 p-1 bg-zinc-900 rounded-xl border border-white/10">
            <button onClick={() => setShape("triangle")} className={`flex-1 py-2 rounded-lg text-sm font-bold ${shape === "triangle" ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"}`}>Segitiga</button>
            <button onClick={() => setShape("rect")} className={`flex-1 py-2 rounded-lg text-sm font-bold ${shape === "rect" ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"}`}>Persegi</button>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-amber-400">Faktor Skala (k)</label>
                <span className="font-mono text-amber-400">{scale}</span>
              </div>
              <input 
                type="range" className="w-full accent-amber-500" 
                min="0.5" max="3" step="0.1" 
                value={scale} 
                onChange={(e) => setScale(parseFloat(e.target.value))} 
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={()=>setScale(1)} className="flex-1 py-1 bg-zinc-800 text-xs rounded border border-white/10 hover:bg-zinc-700">Set k = 1</button>
              <button onClick={()=>setScale(2)} className="flex-1 py-1 bg-zinc-800 text-xs rounded border border-white/10 hover:bg-zinc-700">Set k = 2</button>
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-2 text-xs text-zinc-300 leading-relaxed mt-4">
            <ul className="list-disc pl-4 space-y-1">
              <li><strong className="text-emerald-400">Kongruen (k = 1):</strong> Sama persis. Sudut sama, panjang sisi sama.</li>
              <li><strong className="text-amber-400">Sebangun (k ≠ 1):</strong> Sudut sama besar, tetapi panjang sisi sebanding (diperbesar/diperkecil).</li>
            </ul>
            <p className="mt-2 text-blue-300 bg-blue-500/10 p-2 rounded">Jika sisi diperbesar <strong>k</strong> kali, maka Luas diperbesar <strong>k²</strong> kali!</p>
          </div>

        </div>
      </div>
    </div>
  );
}
