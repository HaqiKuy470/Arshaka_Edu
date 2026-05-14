"use client";

import { useState, useEffect, useRef } from "react";

export default function FungsiKuadrat() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // y = ax^2 + bx + c
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [c, setC] = useState(-4);

  const d = b*b - 4*a*c; // Diskriminan
  const xv = -b / (2*a); // Vertex X
  const yv = a*xv*xv + b*xv + c; // Vertex Y

  // Roots
  let root1 = null;
  let root2 = null;
  if (d >= 0 && a !== 0) {
    root1 = (-b + Math.sqrt(d)) / (2*a);
    root2 = (-b - Math.sqrt(d)) / (2*a);
  }

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
      const scale = 40; // 40px per unit

      // Draw Grid
      ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 1;
      for(let i=cx; i<w; i+=scale) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
      for(let i=cx; i>0; i-=scale) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
      for(let i=cy; i<h; i+=scale) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }
      for(let i=cy; i>0; i-=scale) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

      // Axes
      ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke(); // X
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke(); // Y
      ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.font = "12px sans-serif";
      ctx.fillText("X", w - 15, cy + 15); ctx.fillText("Y", cx + 10, 15);

      // Plot Function
      ctx.beginPath();
      ctx.strokeStyle = "#10b981"; // Emerald
      ctx.lineWidth = 3;
      
      for(let px=0; px<w; px++) {
        // screen x to math x
        const mathX = (px - cx) / scale;
        // calculate math y
        const mathY = a*mathX*mathX + b*mathX + c;
        // math y to screen y
        const py = cy - mathY * scale;
        
        if (px === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Plot Vertex
      if (a !== 0) {
        const pvx = cx + xv * scale;
        const pvy = cy - yv * scale;
        
        // Axis of symmetry
        ctx.beginPath(); ctx.moveTo(pvx, 0); ctx.lineTo(pvx, h);
        ctx.strokeStyle = "rgba(168, 85, 247, 0.4)"; ctx.setLineDash([5,5]); ctx.lineWidth=2; ctx.stroke(); ctx.setLineDash([]);
        
        ctx.beginPath(); ctx.arc(pvx, pvy, 6, 0, Math.PI*2);
        ctx.fillStyle = "#a855f7"; ctx.fill(); ctx.strokeStyle = "white"; ctx.stroke();
      }

      // Plot Roots
      if (root1 !== null && root2 !== null) {
        const pr1x = cx + root1 * scale;
        const pr2x = cx + root2 * scale;
        
        ctx.beginPath(); ctx.arc(pr1x, cy, 5, 0, Math.PI*2); ctx.fillStyle = "#ef4444"; ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(pr2x, cy, 5, 0, Math.PI*2); ctx.fillStyle = "#ef4444"; ctx.fill(); ctx.stroke();
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [a, b, c, xv, yv, root1, root2]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Fungsi Kuadrat & Parabola</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="bg-black/30 border border-white/10 p-4 rounded-xl text-center shadow-inner">
            <div className="text-xl font-mono text-emerald-400 font-bold mb-2">
              f(x) = {a}x² {b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}x {c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`}
            </div>
            <div className="flex justify-between text-xs mt-2 border-t border-white/10 pt-2">
              <div className="text-purple-400 text-left">
                Puncak (Vertex):<br/><span className="font-mono">({xv.toFixed(1)}, {yv.toFixed(1)})</span>
              </div>
              <div className="text-red-400 text-right">
                Diskriminan (D):<br/><span className="font-mono">{d.toFixed(1)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-emerald-400">Koefisien a</label>
                <span className="font-mono text-emerald-400">{a}</span>
              </div>
              <input type="range" className="w-full accent-emerald-500" min="-5" max="5" step="0.1" value={a} onChange={(e) => setA(parseFloat(e.target.value))} />
              <p className="text-[10px] text-zinc-500">Membuka ke atas (+) atau bawah (-).</p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-emerald-400">Koefisien b</label>
                <span className="font-mono text-emerald-400">{b}</span>
              </div>
              <input type="range" className="w-full accent-emerald-500" min="-10" max="10" step="1" value={b} onChange={(e) => setB(parseFloat(e.target.value))} />
              <p className="text-[10px] text-zinc-500">Menggeser puncak ke kiri/kanan.</p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-emerald-400">Konstanta c</label>
                <span className="font-mono text-emerald-400">{c}</span>
              </div>
              <input type="range" className="w-full accent-emerald-500" min="-10" max="10" step="1" value={c} onChange={(e) => setC(parseFloat(e.target.value))} />
              <p className="text-[10px] text-zinc-500">Titik potong dengan sumbu Y.</p>
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-2 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Akar-Akar (Titik Merah):</strong> Nilai x di mana grafik memotong sumbu X.</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>D &gt; 0 : Memotong di dua titik</li>
              <li>D = 0 : Menyinggung sumbu X</li>
              <li>D &lt; 0 : Menggantung (Definit), tidak ada akar real.</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
