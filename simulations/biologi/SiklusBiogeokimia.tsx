"use client";

import { useState, useEffect, useRef } from "react";

export default function SiklusBiogeokimia() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [cycle, setCycle] = useState<"karbon"|"nitrogen"|"air">("karbon");

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
      const cy = h * 0.7; // Ground level

      // Sky
      ctx.fillStyle = cycle === "air" ? "#bae6fd" : "#e0f2fe";
      ctx.fillRect(0, 0, w, cy);

      // Ground
      ctx.fillStyle = "#84cc16"; // Grass
      ctx.fillRect(0, cy, w, 20);
      ctx.fillStyle = "#a16207"; // Soil
      ctx.fillRect(0, cy+20, w, h-cy-20);

      const drawArrow = (x1:number, y1:number, x2:number, y2:number, color:string, label:string, dashed=false) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        // Simple curve if it's horizontalish
        if (Math.abs(x2-x1) > 100) {
           ctx.quadraticCurveTo((x1+x2)/2, Math.min(y1, y2) - 50, x2, y2);
        } else {
           ctx.lineTo(x2, y2);
        }
        
        ctx.strokeStyle = color; ctx.lineWidth = 3;
        if(dashed) ctx.setLineDash([5,5]); else ctx.setLineDash([]);
        ctx.stroke();
        
        // Arrow head logic simplified
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(x2, y2, 6, 0, Math.PI*2); ctx.fill();

        ctx.font = "bold 12px sans-serif";
        ctx.fillText(label, (x1+x2)/2, (y1+y2)/2 - 10);
        ctx.setLineDash([]);
      };

      if (cycle === "karbon") {
         // Tree (Photosynthesis)
         ctx.fillStyle = "#8b4513"; ctx.fillRect(w/4 - 10, cy - 80, 20, 80);
         ctx.fillStyle = "#22c55e"; ctx.beginPath(); ctx.arc(w/4, cy - 100, 50, 0, Math.PI*2); ctx.fill();
         
         // Factory (Emissions)
         ctx.fillStyle = "#475569"; ctx.fillRect(w*0.75 - 30, cy - 100, 60, 100);
         ctx.fillRect(w*0.75 + 10, cy - 140, 10, 40); // chimney

         // Animal
         ctx.fillStyle = "#f59e0b"; ctx.fillRect(w/2 - 20, cy - 30, 40, 30);

         // Arrows
         drawArrow(w/2, cy-30, w/4, cy-100, "#ef4444", "Respirasi (CO₂ Out)");
         drawArrow(w/2, cy, w/2, cy+50, "#8b4513", "Dekomposisi", true);
         drawArrow(w*0.75+15, cy-140, w/2, 50, "#ef4444", "Pembakaran Fosil");
         
         // CO2 in air
         ctx.fillStyle = "black"; ctx.font="20px sans-serif"; ctx.fillText("CO₂ di Atmosfer", w/2 - 50, 40);
         
         // Photosynthesis arrow
         drawArrow(w/2 - 50, 50, w/4, cy-100, "#3b82f6", "Fotosintesis (CO₂ In)");

      } else if (cycle === "nitrogen") {
         
         // Plant
         ctx.fillStyle = "#22c55e"; ctx.beginPath(); ctx.moveTo(w/2, cy); ctx.lineTo(w/2-20, cy-60); ctx.lineTo(w/2+20, cy-60); ctx.fill();
         // Roots (Nodules)
         ctx.strokeStyle = "#a3e635"; ctx.lineWidth=3;
         ctx.beginPath(); ctx.moveTo(w/2, cy); ctx.lineTo(w/2-30, cy+50); ctx.stroke();
         ctx.beginPath(); ctx.moveTo(w/2, cy); ctx.lineTo(w/2+30, cy+60); ctx.stroke();
         ctx.fillStyle = "#facc15"; ctx.beginPath(); ctx.arc(w/2-15, cy+25, 4, 0, Math.PI*2); ctx.fill(); // bacteria

         ctx.fillStyle = "black"; ctx.font="20px sans-serif"; ctx.fillText("N₂ di Atmosfer (78%)", w/2 - 80, 40);

         drawArrow(w/2-80, 50, w/2-30, cy+50, "#ef4444", "Fiksasi (Bakteri)");
         drawArrow(w/2-30, cy+50, w/2, cy-20, "#3b82f6", "Asimilasi (Akar -> Tumbuhan)");
         drawArrow(w/2, cy+60, w/2+80, 50, "#f59e0b", "Denitrifikasi (Kembali ke Udara)", true);

      } else if (cycle === "air") {
         
         // Ocean
         ctx.fillStyle = "#3b82f6"; ctx.fillRect(w*0.6, cy-20, w*0.4, h-cy+20);
         
         // Mountain
         ctx.fillStyle = "#94a3b8";
         ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(100, cy-150); ctx.lineTo(w*0.5, cy); ctx.fill();

         // Cloud
         ctx.fillStyle = "white"; ctx.beginPath(); ctx.arc(w/4, 60, 30, 0, Math.PI*2); ctx.arc(w/4+30, 60, 40, 0, Math.PI*2); ctx.arc(w/4+60, 60, 30, 0, Math.PI*2); ctx.fill();

         drawArrow(w*0.7, cy-20, w/4+60, 60, "#ef4444", "Evaporasi (Menguap)");
         drawArrow(w/4, 80, 100, cy-100, "#3b82f6", "Presipitasi (Hujan)", true);
         drawArrow(100, cy, w*0.6, cy-10, "#0ea5e9", "Aliran Sungai (Run-off)");
      }

      time++;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [cycle]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full bg-white" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Siklus Biogeokimia</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-3">
             <button onClick={()=>setCycle("karbon")} className={`w-full py-3 rounded-xl font-bold transition-all ${cycle === 'karbon' ? 'bg-zinc-700 text-white shadow-lg' : 'bg-black/30 border border-white/10 text-zinc-400'}`}>
                Siklus Karbon (CO₂)
             </button>
             <button onClick={()=>setCycle("nitrogen")} className={`w-full py-3 rounded-xl font-bold transition-all ${cycle === 'nitrogen' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-black/30 border border-white/10 text-zinc-400'}`}>
                Siklus Nitrogen (N₂)
             </button>
             <button onClick={()=>setCycle("air")} className={`w-full py-3 rounded-xl font-bold transition-all ${cycle === 'air' ? 'bg-blue-500 text-white shadow-lg' : 'bg-black/30 border border-white/10 text-zinc-400'}`}>
                Siklus Air (H₂O)
             </button>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            {cycle === "karbon" && (
              <p>Karbon berputar dari udara (CO₂) diserap oleh tanaman melalui <strong>Fotosintesis</strong>. Hewan memakannya. Keduanya bernapas (Respirasi) dan mengembalikan CO₂ ke udara. Jika mati, tubuhnya membusuk menjadi fosil, yang jika dibakar pabrik/mobil, mengembalikan CO₂ besar-besaran.</p>
            )}
            {cycle === "nitrogen" && (
              <p>78% udara adalah Nitrogen, tapi tanaman tidak bisa menghisapnya langsung! Butuh <strong>Bakteri Fiksasi Nitrogen</strong> (di akar tanaman polong-polongan) untuk mengubah udara menjadi pupuk alami (Nitrat/Amonia) di dalam tanah.</p>
            )}
            {cycle === "air" && (
              <p>Siklus Hidrologi: Air laut menguap karena panas matahari (<strong>Evaporasi</strong>). Uap air membentuk awan (<strong>Kondensasi</strong>). Jatuh sebagai hujan/salju (<strong>Presipitasi</strong>) di gunung, lalu mengalir kembali ke laut.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
