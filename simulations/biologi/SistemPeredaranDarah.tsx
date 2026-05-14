"use client";

import { useState, useEffect, useRef } from "react";
import { Activity } from "lucide-react";

export default function SistemPeredaranDarah() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [bpm, setBpm] = useState(70);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    
    // Blood cells
    const bloodCells: {x:number, y:number, isOxygenated:boolean, progress:number}[] = [];
    
    for(let i=0; i<30; i++) {
       bloodCells.push({
         x: 0, y: 0, 
         isOxygenated: Math.random() > 0.5,
         progress: Math.random() * 100 // 0 to 100% along the path
       });
    }

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // Heartbeat pulse logic
      const beatCycle = (Date.now() / (60000 / bpm)) % 1;
      const heartScale = 1 + Math.sin(beatCycle * Math.PI) * 0.15;

      // Draw Lungs (Top)
      ctx.fillStyle = "#fbcfe8"; // Pink lungs
      ctx.beginPath(); ctx.ellipse(cx - 60, cy - 120, 40, 50, 0, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx + 60, cy - 120, 40, 50, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = "#ec4899"; ctx.font = "bold 14px sans-serif"; ctx.textAlign="center";
      ctx.fillText("Paru-paru", cx, cy - 180);

      // Draw Body Tissue (Bottom)
      ctx.fillStyle = "#fed7aa"; // Orange body
      ctx.fillRect(cx - 100, cy + 100, 200, 60);
      ctx.fillStyle = "#ea580c";
      ctx.fillText("Jaringan Tubuh", cx, cy + 180);

      // Draw Vessels Paths
      ctx.lineWidth = 15;
      
      // Pulmonary Artery (Heart to Lungs) - Blue (Deoxygenated)
      ctx.strokeStyle = "rgba(59, 130, 246, 0.3)";
      ctx.beginPath(); ctx.moveTo(cx - 20, cy); ctx.lineTo(cx - 60, cy - 120); ctx.stroke();
      
      // Pulmonary Vein (Lungs to Heart) - Red (Oxygenated)
      ctx.strokeStyle = "rgba(239, 68, 68, 0.3)";
      ctx.beginPath(); ctx.moveTo(cx + 60, cy - 120); ctx.lineTo(cx + 20, cy); ctx.stroke();

      // Aorta (Heart to Body) - Red
      ctx.strokeStyle = "rgba(239, 68, 68, 0.3)";
      ctx.beginPath(); ctx.moveTo(cx + 20, cy); ctx.lineTo(cx + 80, cy + 130); ctx.stroke();

      // Vena Cava (Body to Heart) - Blue
      ctx.strokeStyle = "rgba(59, 130, 246, 0.3)";
      ctx.beginPath(); ctx.moveTo(cx - 80, cy + 130); ctx.lineTo(cx - 20, cy); ctx.stroke();

      // Move and Draw Blood Cells
      const speed = bpm / 60 * 0.5; // faster if bpm high
      
      bloodCells.forEach(cell => {
         cell.progress += speed;
         if (cell.progress >= 100) cell.progress = 0;
         
         let px = 0, py = 0;
         
         // 0-25%: Body to Heart (Vena Cava - Blue)
         if (cell.progress < 25) {
            cell.isOxygenated = false;
            const t = cell.progress / 25;
            px = (cx - 80) + t * 60;
            py = (cy + 130) - t * 130;
         }
         // 25-50%: Heart to Lungs (Pulmonary Artery - Blue)
         else if (cell.progress < 50) {
            const t = (cell.progress - 25) / 25;
            px = (cx - 20) - t * 40;
            py = cy - t * 120;
         }
         // 50-75%: Lungs to Heart (Pulmonary Vein - Red)
         else if (cell.progress < 75) {
            cell.isOxygenated = true; // Gets O2 in lungs!
            const t = (cell.progress - 50) / 25;
            px = (cx + 60) - t * 40;
            py = (cy - 120) + t * 120;
         }
         // 75-100%: Heart to Body (Aorta - Red)
         else {
            const t = (cell.progress - 75) / 25;
            px = (cx + 20) + t * 60;
            py = cy + t * 130;
         }

         ctx.fillStyle = cell.isOxygenated ? "#ef4444" : "#3b82f6";
         ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI*2); ctx.fill();
      });

      // Draw Heart
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(heartScale, heartScale);
      
      // Heart background
      ctx.fillStyle = "#991b1b";
      ctx.beginPath(); ctx.arc(-20, -10, 30, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(20, -10, 30, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-45, 5); ctx.lineTo(0, 50); ctx.lineTo(45, 5); ctx.fill();
      
      // Chambers
      ctx.fillStyle = "rgba(59, 130, 246, 0.8)"; // Right side (Blue)
      ctx.fillRect(-35, -20, 30, 30); // Atrium
      ctx.fillRect(-40, 15, 35, 30); // Ventricle
      
      ctx.fillStyle = "rgba(239, 68, 68, 0.8)"; // Left side (Red)
      ctx.fillRect(5, -20, 30, 30); // Atrium
      ctx.fillRect(5, 15, 35, 30); // Ventricle
      
      ctx.restore();
      
      ctx.fillStyle = "white"; ctx.font = "bold 16px sans-serif";
      ctx.fillText("Jantung", cx, cy + 70);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [bpm]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Sistem Peredaran Darah</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-rose-950/30 p-4 rounded-xl border border-rose-500/30">
              <div className="flex items-center gap-2 text-rose-400 font-bold">
                <Activity className="w-5 h-5 animate-pulse" /> Detak Jantung
              </div>
              <div className="text-2xl font-mono text-white">{bpm} <span className="text-sm text-zinc-400">bpm</span></div>
            </div>

            <div className="space-y-2">
              <input type="range" className="w-full accent-rose-500" min="40" max="180" step="1" value={bpm} onChange={(e) => setBpm(parseInt(e.target.value))} />
              <div className="flex justify-between text-[10px] text-zinc-500 font-bold uppercase">
                <span>Istirahat</span>
                <span>Olahraga</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <h4 className="text-rose-400 font-bold uppercase text-[10px]">Sirkulasi Ganda Manusia</h4>
            <ul className="space-y-2 pl-4 list-disc">
               <li><strong className="text-blue-400">Sirkulasi Pulmonal (Kecil):</strong> Jantung ➞ Paru-paru ➞ Jantung. Membawa darah kotor (kaya CO₂) untuk ditukar dengan Oksigen.</li>
               <li><strong className="text-red-400">Sirkulasi Sistemik (Besar):</strong> Jantung ➞ Seluruh Tubuh ➞ Jantung. Mengedarkan darah bersih (kaya Oksigen) untuk sel-sel tubuh.</li>
            </ul>
            <p className="mt-2 bg-white/5 p-2 rounded">
               *Sisi kanan jantung selalu berisi darah kotor (Biru), Sisi kiri berisi darah bersih (Merah).
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
