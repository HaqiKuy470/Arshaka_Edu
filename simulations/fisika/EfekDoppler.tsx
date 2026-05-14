"use client";

import { useState, useEffect, useRef } from "react";

export default function EfekDoppler() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [vSource, setVSource] = useState(0); // Velocity of source (ambulance)
  const vSound = 340; // Speed of sound roughly
  
  // Wave rings array: { x, y, radius }
  const ringsRef = useRef<{x: number, y: number, radius: number}[]>([]);
  const ambulanceXRef = useRef(100);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let frame = 0;

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Update Ambulance position
      // It moves horizontally back and forth
      ambulanceXRef.current += vSource * 0.1; 
      if (ambulanceXRef.current > canvas.width + 50) ambulanceXRef.current = -50;
      if (ambulanceXRef.current < -50) ambulanceXRef.current = canvas.width + 50;

      // Emit new wave ring every X frames
      if (frame % 20 === 0) {
        ringsRef.current.push({ x: ambulanceXRef.current, y: cy, radius: 0 });
      }

      // Draw and expand rings
      ctx.lineWidth = 2;
      for (let i = ringsRef.current.length - 1; i >= 0; i--) {
        const ring = ringsRef.current[i];
        ring.radius += 3; // speed of sound visually
        
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI*2);
        // Fade out as it expands
        const opacity = Math.max(0, 1 - (ring.radius / 400));
        ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`;
        ctx.stroke();

        if (opacity === 0) {
          ringsRef.current.splice(i, 1);
        }
      }

      // Draw Observers (Pendengar)
      ctx.fillStyle = "white";
      ctx.font = "24px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🧍‍♂️", 50, cy - 20);
      ctx.fillText("🧍‍♀️", canvas.width - 50, cy - 20);

      ctx.font = "12px sans-serif";
      // Calculate observed frequency roughly (Fs = 1000Hz base)
      // fp = fs * (v / (v +- vs))
      const fBase = 1000;
      let fLeft = 1000;
      let fRight = 1000;

      if (vSource > 0) {
        fLeft = fBase * (vSound / (vSound + vSource*10)); // moving away from left
        fRight = fBase * (vSound / (vSound - vSource*10)); // moving towards right
      } else if (vSource < 0) {
        fLeft = fBase * (vSound / (vSound - Math.abs(vSource*10))); // moving towards left
        fRight = fBase * (vSound / (vSound + Math.abs(vSource*10))); // moving away from right
      }

      ctx.fillStyle = fLeft > 1000 ? "#22c55e" : fLeft < 1000 ? "#ef4444" : "white";
      ctx.fillText(`${fLeft.toFixed(0)} Hz`, 50, cy + 10);
      
      ctx.fillStyle = fRight > 1000 ? "#22c55e" : fRight < 1000 ? "#ef4444" : "white";
      ctx.fillText(`${fRight.toFixed(0)} Hz`, canvas.width - 50, cy + 10);

      // Draw Ambulance
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(ambulanceXRef.current - 20, cy - 10, 40, 20);
      ctx.fillStyle = "white";
      ctx.fillRect(ambulanceXRef.current - 5, cy - 15, 10, 5); // siren

      frame++;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [vSource]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Efek Doppler</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-rose-400 font-bold">Kecepatan Sumber Bunyi (Ambulans)</label>
              </div>
              <input 
                type="range" 
                className="w-full accent-rose-500" 
                min="-15" max="15" step="1" 
                value={vSource} 
                onChange={(e) => setVSource(parseInt(e.target.value))} 
              />
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>&larr; Bergerak ke Kiri</span>
                <span>Diam</span>
                <span>Bergerak ke Kanan &rarr;</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Efek Doppler:</strong> Perubahan frekuensi atau nada yang terdengar oleh pendengar karena pergerakan sumber bunyi.</p>
            <ul className="list-disc pl-4 space-y-2">
              <li>Jika ambulans <strong>mendekati</strong> pendengar, gelombang memadat ➔ Frekuensi makin <strong className="text-green-400">Tinggi</strong> (Melengking).</li>
              <li>Jika ambulans <strong>menjauhi</strong> pendengar, gelombang merenggang ➔ Frekuensi makin <strong className="text-red-400">Rendah</strong> (Mengecil).</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
