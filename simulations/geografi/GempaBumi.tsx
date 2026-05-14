"use client";

import { useState, useEffect, useRef } from "react";

export default function GempaBumi() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [magnitude, setMagnitude] = useState(5); // 1-10
  const [depth, setDepth] = useState(10); // 0-100 km
  const [isQuake, setIsQuake] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    
    // Wave variables
    let waves: {r: number, type: 'P'|'S', opacity: number}[] = [];

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const cy = h * 0.4; // Ground level

      // Earthquake epicenter/hypocenter coordinates
      const hypoX = w / 2;
      const hypoY = cy + (depth / 100) * (h - cy - 20) + 20;

      // Draw Sky
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, w, cy);

      // Camera Shake (if quaking)
      let shakeX = 0;
      let shakeY = 0;
      if (isQuake && time < 100) {
         // Shake intensity based on magnitude and depth (shallower = stronger surface shake)
         const intensity = (magnitude * magnitude) / Math.max(depth, 5); 
         shakeX = (Math.random() - 0.5) * intensity;
         shakeY = (Math.random() - 0.5) * intensity;
      } else if (time >= 100) {
         setIsQuake(false);
         waves = []; // clear waves after quake
      }

      ctx.save();
      ctx.translate(shakeX, shakeY);

      // Draw Ground
      ctx.fillStyle = "#166534"; // grass
      ctx.fillRect(0, cy, w, 20);
      ctx.fillStyle = "#78350f"; // dirt
      ctx.fillRect(0, cy + 20, w, h);
      ctx.fillStyle = "#451a03"; // deeper dirt
      ctx.fillRect(0, cy + 100, w, h);

      // Draw Fault Line
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(hypoX + 50, cy); ctx.lineTo(hypoX - 50, h); ctx.stroke();

      // Draw City
      ctx.fillStyle = "#64748b";
      ctx.fillRect(hypoX - 80, cy - 80, 40, 80);
      ctx.fillStyle = "#94a3b8";
      ctx.fillRect(hypoX - 20, cy - 120, 50, 120);
      ctx.fillStyle = "#cbd5e1";
      ctx.fillRect(hypoX + 50, cy - 60, 40, 60);

      // Draw Hypocenter (Focus)
      ctx.fillStyle = "#ef4444";
      ctx.beginPath(); ctx.arc(hypoX, hypoY, 10, 0, Math.PI*2); ctx.fill();
      
      // Draw Epicenter (Surface)
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath(); ctx.arc(hypoX, cy, 6, 0, Math.PI*2); ctx.fill();

      // Labels
      ctx.fillStyle = "white"; ctx.font = "12px sans-serif";
      ctx.fillText("Episentrum", hypoX + 15, cy - 10);
      ctx.fillText("Hiposentrum", hypoX + 15, hypoY);

      // Draw Waves if quaking
      if (isQuake) {
         if (time % 10 === 0 && time < 50) {
            waves.push({r: 0, type: 'P', opacity: 1}); // Primary wave (fast)
            if (time % 20 === 0) {
               waves.push({r: 0, type: 'S', opacity: 1}); // Secondary wave (slow)
            }
         }

         for (let i=0; i<waves.length; i++) {
            const w = waves[i];
            const speed = w.type === 'P' ? 8 : 4;
            w.r += speed;
            w.opacity -= 0.01;

            if (w.opacity > 0) {
               ctx.strokeStyle = w.type === 'P' ? `rgba(59, 130, 246, ${w.opacity})` : `rgba(239, 68, 68, ${w.opacity})`;
               ctx.lineWidth = w.type === 'P' ? 2 : 4;
               ctx.beginPath(); ctx.arc(hypoX, hypoY, w.r, 0, Math.PI*2); ctx.stroke();
            }
         }
      }

      ctx.restore();

      // UI Text
      ctx.fillStyle = "rgba(255,255,255,0.8)"; ctx.font = "10px sans-serif";
      ctx.fillText("Biru: Gelombang P (Cepat, merambat lewat padat/cair)", 10, 20);
      ctx.fillText("Merah: Gelombang S (Lambat, merusak, padat saja)", 10, 35);

      if (isQuake) time++;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [isQuake, magnitude, depth]);

  const triggerQuake = () => {
    setIsQuake(false);
    setTimeout(() => setIsQuake(true), 50); // reset
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Gempa & Gelombang Seismik</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-4">
             <div>
               <div className="flex justify-between text-xs font-bold text-zinc-300 mb-2 uppercase">
                 <span>Kekuatan (Magnitudo)</span>
                 <span className="text-red-400">{magnitude} SR</span>
               </div>
               <input type="range" min="1" max="10" step="0.5" value={magnitude} onChange={e=>setMagnitude(parseFloat(e.target.value))} className="w-full accent-red-500" disabled={isQuake} />
             </div>

             <div>
               <div className="flex justify-between text-xs font-bold text-zinc-300 mb-2 uppercase">
                 <span>Kedalaman Pusat (Hiposentrum)</span>
                 <span className="text-amber-400">{depth} km</span>
               </div>
               <input type="range" min="0" max="100" step="1" value={depth} onChange={e=>setDepth(parseInt(e.target.value))} className="w-full accent-amber-500" disabled={isQuake} />
               <div className="text-[10px] text-zinc-500 mt-1">Lebih dangkal = Lebih merusak di permukaan.</div>
             </div>

             <button 
               onClick={triggerQuake} 
               disabled={isQuake}
               className={`w-full p-4 rounded-xl font-bold uppercase tracking-widest transition-all ${isQuake ? 'bg-zinc-800 text-zinc-500' : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'}`}
             >
               {isQuake ? "Gempa Berlangsung..." : "Picu Gempa!"}
             </button>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Hiposentrum</strong> adalah titik pusat terjadinya gempa di dalam tanah. <strong>Episentrum</strong> adalah titik di permukaan bumi yang berada tepat di atasnya.</p>
            <p>Gempa menghasilkan dua gelombang utama di dalam bumi:</p>
            <ul className="list-disc pl-4 space-y-2 text-zinc-400">
               <li><strong className="text-blue-400">Gelombang Primer (P)</strong>: Paling cepat, tiba lebih dulu di Seismograf. Merambat longitudinal lewat batuan padat maupun magma cair.</li>
               <li><strong className="text-red-400">Gelombang Sekunder (S)</strong>: Lebih lambat, tapi pergerakannya naik-turun (transversal) sehingga <strong>sangat merusak bangunan</strong>. Tidak bisa menembus cairan (magma/inti luar bumi).</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
