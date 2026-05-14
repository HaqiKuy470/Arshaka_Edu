"use client";

import { useState, useEffect, useRef } from "react";
import { Wind } from "lucide-react";

export default function SistemPernapasan() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [breatheRate, setBreatheRate] = useState(15); // breaths per min
  
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

      // Breathing Cycle (-1 to 1)
      // 1 = Inhale (expanded), -1 = Exhale (contracted)
      const cycle = Math.sin((time * breatheRate) / 600);
      
      const lungExpansion = 1 + cycle * 0.15;
      const diaphragmY = cy + 120 + cycle * 20;

      // Draw Trachea
      ctx.fillStyle = "#fbcfe8";
      ctx.fillRect(cx - 15, cy - 150, 30, 80);
      // Cartilage rings
      ctx.strokeStyle = "#db2777"; ctx.lineWidth = 2;
      for(let y=cy-140; y<cy-70; y+=10) {
        ctx.beginPath(); ctx.moveTo(cx-15, y); ctx.lineTo(cx+15, y); ctx.stroke();
      }

      // Draw Bronchi
      ctx.lineWidth = 15; ctx.strokeStyle = "#fbcfe8";
      ctx.beginPath(); ctx.moveTo(cx, cy - 70); ctx.lineTo(cx - 50, cy - 30); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy - 70); ctx.lineTo(cx + 50, cy - 30); ctx.stroke();

      // Draw Lungs
      ctx.save();
      ctx.translate(cx - 70, cy + 20);
      ctx.scale(lungExpansion, lungExpansion);
      ctx.fillStyle = "rgba(244, 114, 182, 0.6)"; // Pink lungs
      ctx.beginPath(); ctx.ellipse(0, 0, 50, 80, 0, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = "rgba(219, 39, 119, 0.8)"; ctx.lineWidth=2; ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.translate(cx + 70, cy + 20);
      ctx.scale(lungExpansion, lungExpansion);
      ctx.fillStyle = "rgba(244, 114, 182, 0.6)";
      ctx.beginPath(); ctx.ellipse(0, 0, 50, 80, 0, 0, Math.PI*2); ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Draw Diaphragm (Muscle below lungs)
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.moveTo(cx - 150, cy + 120);
      ctx.quadraticCurveTo(cx, diaphragmY, cx + 150, cy + 120);
      ctx.lineTo(cx + 150, cy + 140);
      ctx.lineTo(cx - 150, cy + 140);
      ctx.fill();
      
      ctx.fillStyle = "white"; ctx.font="12px sans-serif"; ctx.textAlign="center";
      ctx.fillText("Diafragma", cx, diaphragmY + 15);

      // Gas particles flow
      const inhale = cycle > 0;
      for(let i=0; i<5; i++) {
         const yPos = cy - 150 + ((time + i*20) % 100);
         if (inhale && yPos < cy - 70) {
            // O2 entering
            ctx.fillStyle = "#3b82f6";
            ctx.beginPath(); ctx.arc(cx + (Math.random()-0.5)*10, yPos, 3, 0, Math.PI*2); ctx.fill();
         } else if (!inhale && yPos < cy - 70) {
            // CO2 exiting (reverse yPos)
            ctx.fillStyle = "#64748b";
            const exitY = cy - 70 - ((time + i*20) % 100);
            ctx.beginPath(); ctx.arc(cx + (Math.random()-0.5)*10, exitY, 3, 0, Math.PI*2); ctx.fill();
         }
      }

      // Alveolus Zoom UI
      ctx.fillStyle = "rgba(0,0,0,0.8)";
      ctx.fillRect(w - 220, h - 220, 200, 200);
      ctx.strokeStyle = "white"; ctx.strokeRect(w - 220, h - 220, 200, 200);
      ctx.fillStyle = "white"; ctx.fillText("Zoom: Alveolus", w - 120, h - 200);
      
      // Draw Alveolus
      ctx.fillStyle = "#fbcfe8";
      ctx.beginPath(); ctx.arc(w - 120, h - 120, 50, 0, Math.PI*2); ctx.fill();
      // Capillary
      ctx.strokeStyle = "#ef4444"; ctx.lineWidth=10;
      ctx.beginPath(); ctx.arc(w - 120, h - 120, 55, Math.PI, Math.PI*2); ctx.stroke();
      
      // O2 / CO2 exchange animation
      if (inhale) {
         ctx.fillStyle = "#3b82f6"; // O2 into blood
         ctx.fillText("O₂ ⬇", w - 120, h - 120);
      } else {
         ctx.fillStyle = "#64748b"; // CO2 out of blood
         ctx.fillText("CO₂ ⬆", w - 120, h - 120);
      }


      time++;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [breatheRate]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Sistem Pernapasan</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-sky-950/30 p-4 rounded-xl border border-sky-500/30">
              <div className="flex items-center gap-2 text-sky-400 font-bold">
                <Wind className="w-5 h-5 animate-pulse" /> Laju Napas
              </div>
              <div className="text-2xl font-mono text-white">{breatheRate} <span className="text-sm text-zinc-400">x/mnt</span></div>
            </div>

            <div className="space-y-2">
              <input type="range" className="w-full accent-sky-500" min="5" max="40" step="1" value={breatheRate} onChange={(e) => setBreatheRate(parseInt(e.target.value))} />
              <div className="flex justify-between text-[10px] text-zinc-500 font-bold uppercase">
                <span>Rileks</span>
                <span>Terengah</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <h4 className="text-sky-400 font-bold uppercase text-[10px]">Mekanisme Pernapasan Perut</h4>
            <ul className="space-y-2 pl-4 list-disc">
               <li><strong className="text-emerald-400">Inspirasi (Tarik Napas):</strong> Otot Diafragma berkontraksi (mendatar/turun). Rongga dada membesar, tekanan udara turun, udara (O₂) masuk.</li>
               <li><strong className="text-rose-400">Ekspirasi (Buang Napas):</strong> Otot Diafragma relaksasi (melengkung ke atas). Rongga dada mengecil, tekanan naik, udara (CO₂) terdorong keluar.</li>
            </ul>
            <p className="mt-2 text-yellow-300">Pertukaran gas sesungguhnya terjadi di gelembung mikroskopis bernama <strong>Alveolus</strong> di dalam paru-paru.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
