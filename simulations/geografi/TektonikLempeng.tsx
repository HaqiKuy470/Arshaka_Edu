"use client";

import { useState, useEffect, useRef } from "react";

export default function TektonikLempeng() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [movement, setMovement] = useState<"divergen"|"konvergen"|"transform">("divergen");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let offset = 0;

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // Draw Mantle (Magma)
      ctx.fillStyle = "#c2410c"; // Dark orange
      ctx.fillRect(0, cy + 50, w, h);
      
      // Convection currents
      ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.lineWidth = 4;
      ctx.setLineDash([10, 10]);
      if (movement === "divergen") {
         // Currents moving up and outwards
         ctx.beginPath(); ctx.arc(cx - 100, cy + 150, 60, Math.PI*1.5, Math.PI*2.5, false); ctx.stroke();
         ctx.beginPath(); ctx.arc(cx + 100, cy + 150, 60, Math.PI*0.5, Math.PI*1.5, false); ctx.stroke();
      } else if (movement === "konvergen") {
         // Currents moving down and inwards
         ctx.beginPath(); ctx.arc(cx - 100, cy + 150, 60, Math.PI*0.5, Math.PI*1.5, true); ctx.stroke();
         ctx.beginPath(); ctx.arc(cx + 100, cy + 150, 60, Math.PI*1.5, Math.PI*2.5, true); ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.font = "14px sans-serif"; ctx.textAlign="center";
      ctx.fillText("Arus Konveksi Magma", cx, cy + 150);

      // Animation offset
      offset = (offset + 0.5) % 100;
      const shift = (offset / 100) * 40;

      if (movement === "divergen") {
         // Moving Apart
         // Left Plate
         ctx.fillStyle = "#71717a"; ctx.fillRect(0, cy - 20, cx - 10 - shift, 70);
         // Right Plate
         ctx.fillStyle = "#52525b"; ctx.fillRect(cx + 10 + shift, cy - 20, w, 70);
         
         // New magma rising in middle
         ctx.fillStyle = "#ea580c"; ctx.beginPath(); ctx.moveTo(cx, cy + 50); ctx.lineTo(cx - 20, cy - 10); ctx.lineTo(cx + 20, cy - 10); ctx.fill();

         // Arrows
         ctx.fillStyle = "white"; ctx.font="24px sans-serif";
         ctx.fillText("⬅", cx - 50 - shift, cy + 15);
         ctx.fillText("➡", cx + 50 + shift, cy + 15);

         // Label
         ctx.fillStyle = "#fbbf24"; ctx.font="16px bold sans-serif";
         ctx.fillText("Punggung Samudra", cx, cy - 30);

      } else if (movement === "konvergen") {
         // Colliding
         // Left Plate (Oceanic - Denser, subducts)
         ctx.fillStyle = "#4b5563"; 
         ctx.beginPath(); ctx.moveTo(0, cy - 20); ctx.lineTo(cx + shift, cy - 20); 
         ctx.lineTo(cx + 100 + shift, cy + 100); ctx.lineTo(0, cy + 100); ctx.fill();

         // Right Plate (Continental - Lighter, crumbles up)
         ctx.fillStyle = "#52525b"; 
         ctx.beginPath(); ctx.moveTo(w, cy - 20); ctx.lineTo(cx - 50 + shift, cy - 20); 
         ctx.lineTo(cx - 50 + shift, cy + 50); ctx.lineTo(w, cy + 50); ctx.fill();

         // Mountains forming on right
         ctx.fillStyle = "#71717a";
         ctx.beginPath(); ctx.moveTo(cx - 50 + shift, cy - 20); ctx.lineTo(cx + 20 + shift, cy - 80); ctx.lineTo(cx + 100 + shift, cy - 20); ctx.fill();
         ctx.beginPath(); ctx.moveTo(cx + 50 + shift, cy - 20); ctx.lineTo(cx + 120 + shift, cy - 100); ctx.lineTo(cx + 200 + shift, cy - 20); ctx.fill();

         // Arrows
         ctx.fillStyle = "white"; ctx.font="24px sans-serif";
         ctx.fillText("➡", cx - 100, cy + 15);
         ctx.fillText("⬅", cx + 150, cy + 15);
         
         // Labels
         ctx.fillStyle = "#fbbf24"; ctx.font="16px bold sans-serif";
         ctx.fillText("Palung", cx, cy - 30);
         ctx.fillText("Pegunungan/Gunung Api", cx + 100, cy - 120);

      } else if (movement === "transform") {
         // Sliding past each other (Top-down view abstraction)
         // Actually let's draw it from top down
         ctx.fillStyle = "#1e3a8a"; ctx.fillRect(0,0,w,h); // Ocean
         
         // Left plate moving UP
         ctx.fillStyle = "#52525b"; ctx.fillRect(0, -shift, cx - 5, h + 100);
         // Right plate moving DOWN
         ctx.fillStyle = "#71717a"; ctx.fillRect(cx + 5, shift - 50, w, h + 100);

         // Fault line friction
         ctx.fillStyle = "#ef4444";
         for(let y=0; y<h; y+=30) {
            if (Math.random() > 0.8) {
               ctx.beginPath(); ctx.arc(cx, y + (Math.random()*20), 5 + Math.random()*10, 0, Math.PI*2); ctx.fill();
            }
         }

         // Arrows
         ctx.fillStyle = "white"; ctx.font="24px sans-serif";
         ctx.fillText("⬆", cx - 40, cy);
         ctx.fillText("⬇", cx + 40, cy);

         ctx.fillStyle = "#fbbf24"; ctx.font="16px bold sans-serif";
         ctx.fillText("Sesar (Patahan)", cx, cy - 50);
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [movement]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Pergerakan Lempeng Tektonik</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-3">
             <button onClick={()=>setMovement("divergen")} className={`w-full p-3 text-left rounded-xl border transition-all ${movement === 'divergen' ? 'bg-blue-600 border-blue-400 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
                ⬅ ➡ Divergen (Menjauh)
             </button>
             <button onClick={()=>setMovement("konvergen")} className={`w-full p-3 text-left rounded-xl border transition-all ${movement === 'konvergen' ? 'bg-red-600 border-red-400 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
                ➡ ⬅ Konvergen (Bertabrakan)
             </button>
             <button onClick={()=>setMovement("transform")} className={`w-full p-3 text-left rounded-xl border transition-all ${movement === 'transform' ? 'bg-amber-600 border-amber-400 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
                ⬆ ⬇ Transform (Berpapasan)
             </button>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-sm text-zinc-300 leading-relaxed mt-4">
            {movement === "divergen" && (
              <>
                <p>Lempeng bergerak <strong>saling menjauh</strong>. Celah yang terbuka akan diisi oleh magma yang naik dari mantel bumi, mendingin, dan membentuk kerak bumi baru.</p>
                <p className="text-xs text-blue-400 font-bold">Contoh: Punggung Tengah Samudra Atlantik (Mid-Atlantic Ridge).</p>
              </>
            )}
            {movement === "konvergen" && (
              <>
                <p>Lempeng bergerak <strong>saling mendekat dan bertabrakan</strong>. Salah satu lempeng (biasanya samudra yang lebih berat) akan menyusup ke bawah lempeng lain (Subduksi).</p>
                <p>Proses ini melelehkan lempeng bawah menjadi magma, yang naik membentuk Gunung Berapi, atau melipat kerak membentuk Pegunungan raksasa.</p>
                <p className="text-xs text-red-400 font-bold">Contoh: Pegunungan Himalaya, Cincin Api Pasifik.</p>
              </>
            )}
            {movement === "transform" && (
              <>
                <p>Lempeng bergerak <strong>bergesekan berlawanan arah</strong> sejajar satu sama lain. Gesekan ini menyebabkan energi tersendat.</p>
                <p>Saat energi yang tertahan tiba-tiba terlepas, terjadilah <strong>Gempa Bumi</strong> yang sangat merusak karena dangkal.</p>
                <p className="text-xs text-amber-400 font-bold">Contoh: Sesar San Andreas di California, AS.</p>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
