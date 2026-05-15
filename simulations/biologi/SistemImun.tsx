"use client";

import { useState, useEffect, useRef } from "react";

export default function SistemImun() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [bacteriaCount, setBacteriaCount] = useState(10);
  const [macrophageCount, setMacrophageCount] = useState(2);
  const [antibodyActive, setAntibodyActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const entities: any[] = [];
    
    // Spawn Bacteria
    for(let i=0; i<bacteriaCount; i++) {
       entities.push({ type: 'bacteria', x: Math.random()*600+50, y: Math.random()*400+50, vx: (Math.random()-0.5)*2, vy: (Math.random()-0.5)*2, dead: false });
    }
    // Spawn Macrophages (White blood cells)
    for(let i=0; i<macrophageCount; i++) {
       entities.push({ type: 'macrophage', x: Math.random()*600+50, y: Math.random()*400+50, vx: (Math.random()-0.5), vy: (Math.random()-0.5), target: null, scale: 1 });
    }

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;

      // Draw background blood vessel
      ctx.fillStyle = "#4c0519"; // Deep red
      ctx.fillRect(0, 0, w, h);

      // Antibodies effect
      if (antibodyActive) {
         ctx.fillStyle = "rgba(168, 85, 247, 0.2)"; // Purple tint
         ctx.fillRect(0,0,w,h);
      }

      // Arrays by type
      const bacs = entities.filter(e => e.type === 'bacteria' && !e.dead);
      const macros = entities.filter(e => e.type === 'macrophage');

      // Update and draw Bacteria
      bacs.forEach(b => {
         // Antibodies slow them down drastically
         const speedMult = antibodyActive ? 0.2 : 1;
         b.x += b.vx * speedMult;
         b.y += b.vy * speedMult;
         
         // Bounce walls
         if(b.x < 10 || b.x > w-10) b.vx *= -1;
         if(b.y < 10 || b.y > h-10) b.vy *= -1;

         // Draw Bacteria (Green pill)
         ctx.fillStyle = antibodyActive ? "#8b5cf6" : "#22c55e"; // Turn purple if tagged by antibody
         ctx.beginPath(); ctx.ellipse(b.x, b.y, 8, 4, Math.atan2(b.vy, b.vx), 0, Math.PI*2); ctx.fill();
         
         if (antibodyActive) {
           // Draw 'Y' shape antibody on it
           ctx.strokeStyle = "white"; ctx.lineWidth = 1;
           ctx.beginPath(); ctx.moveTo(b.x, b.y-10); ctx.lineTo(b.x, b.y-5); ctx.stroke();
           ctx.beginPath(); ctx.moveTo(b.x-3, b.y-13); ctx.lineTo(b.x, b.y-10); ctx.lineTo(b.x+3, b.y-13); ctx.stroke();
         }
      });

      // Update and draw Macrophages
      macros.forEach(m => {
         // Chase nearest bacteria
         let nearest: any = null;
         let minDist = 9999;
         bacs.forEach(b => {
            const d = Math.hypot(b.x - m.x, b.y - m.y);
            if (d < minDist) { minDist = d; nearest = b; }
         });

         if (nearest) {
            const dx = nearest.x - m.x; const dy = nearest.y - m.y;
            const mag = Math.hypot(dx, dy);
            // Move faster if antibodies are active (Opsonization)
            const chaseSpeed = antibodyActive ? 2 : 1;
            m.vx = (dx/mag) * chaseSpeed;
            m.vy = (dy/mag) * chaseSpeed;

            // Eat (Phagocytosis)
            if (minDist < 20 * m.scale) {
               nearest.dead = true;
               m.scale = Math.min(2, m.scale + 0.1); // Grow a bit when eating
            }
         } else {
            // Wander
            m.vx += (Math.random()-0.5)*0.5; m.vy += (Math.random()-0.5)*0.5;
         }

         m.x += m.vx; m.y += m.vy;
         if(m.x < 20 || m.x > w-20) m.vx *= -1;
         if(m.y < 20 || m.y > h-20) m.vy *= -1;

         // Draw Macrophage (White, blobby)
         ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
         ctx.beginPath();
         // draw wavy circle
         for(let i=0; i<Math.PI*2; i+=0.5) {
            const r = 20 * m.scale + Math.sin(i*3 + Date.now()/200) * 3;
            ctx.lineTo(m.x + Math.cos(i)*r, m.y + Math.sin(i)*r);
         }
         ctx.closePath(); ctx.fill();
         ctx.fillStyle = "#94a3b8"; ctx.beginPath(); ctx.arc(m.x, m.y, 6*m.scale, 0, Math.PI*2); ctx.fill(); // Nucleus
      });

      // UI
      ctx.fillStyle = "white"; ctx.font = "bold 16px sans-serif";
      ctx.fillText(`Bakteri Tersisa: ${bacs.length}`, 20, 30);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [bacteriaCount, macrophageCount, antibodyActive]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-pointer" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Sistem Imun (Pertahanan)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-3">
             <button onClick={()=>{setBacteriaCount(30); setMacrophageCount(2); setAntibodyActive(false);}} className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold">
                🦠 Infeksi Bakteri Baru
             </button>
             
             <button onClick={()=>setMacrophageCount(m => m + 1)} className="w-full py-3 bg-white hover:bg-zinc-200 text-black rounded-xl font-bold">
                ⚪ Tambah Makrofag (Sel Darah Putih)
             </button>

             <button onClick={()=>setAntibodyActive(true)} className={`w-full py-3 rounded-xl font-bold transition-all ${antibodyActive ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.5)]' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800'}`}>
                Y Lepaskan Antibodi (Sel B)
             </button>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Makrofag:</strong> Sel darah putih raksasa yang menelan patogen (Fagositosis). Pertahanan garis depan.</p>
            <p><strong>Antibodi:</strong> Protein berbentuk 'Y' yang menempel spesifik pada bakteri. Efeknya:</p>
            <ul className="list-disc pl-4">
               <li>Melumpuhkan / melambatkan bakteri.</li>
               <li>Memberi tanda (*Tagging*) agar Makrofag lebih cepat mengejar dan memakannya (Opsonisasi).</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
