"use client";

import { useState, useEffect, useRef } from "react";

export default function GunungBerapi() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [pressure, setPressure] = useState(0); // 0 to 100
  const [isErupting, setIsErupting] = useState(false);
  const [magmaViscosity, setMagmaViscosity] = useState<"encer"|"kental">("kental");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isErupting) {
       timer = setInterval(() => {
         setPressure(p => {
           if (p >= 100) {
             setIsErupting(true);
             return 100;
           }
           return p + (magmaViscosity === "kental" ? 5 : 2); // viscous builds pressure faster
         });
       }, 500);
    } else {
       timer = setInterval(() => {
         setPressure(p => {
           if (p <= 0) {
             setIsErupting(false);
             return 0;
           }
           return p - 2;
         });
       }, 100);
    }
    return () => clearInterval(timer);
  }, [isErupting, magmaViscosity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: {x:number, y:number, vx:number, vy:number, life:number, color:string, size:number}[] = [];

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // Sky
      ctx.fillStyle = isErupting && magmaViscosity === "kental" ? "#475569" : "#bae6fd"; // Dark sky if explosive
      ctx.fillRect(0, 0, w, h);

      // Ground
      ctx.fillStyle = "#65a30d"; // Grass
      ctx.fillRect(0, cy + 100, w, h);

      // Volcano Base
      ctx.fillStyle = "#52525b"; // Gray rock
      ctx.beginPath();
      if (magmaViscosity === "encer") {
         // Shield volcano (Landai)
         ctx.moveTo(cx - 250, cy + 100);
         ctx.lineTo(cx - 60, cy);
         ctx.lineTo(cx + 60, cy);
         ctx.lineTo(cx + 250, cy + 100);
      } else {
         // Stratovolcano (Curam)
         ctx.moveTo(cx - 150, cy + 100);
         ctx.lineTo(cx - 30, cy - 50);
         ctx.lineTo(cx + 30, cy - 50);
         ctx.lineTo(cx + 150, cy + 100);
      }
      ctx.fill();

      // Magma Chamber (Bawah tanah)
      ctx.fillStyle = "#9a3412"; ctx.fillRect(cx - 50, cy + 100, 100, h);
      ctx.fillStyle = "#ea580c"; 
      const magmaLevel = cy + 100 + (100 - pressure) * 2;
      ctx.fillRect(cx - 40, magmaLevel, 80, h);

      // Main Pipe (Pipa Kepundan)
      const topY = magmaViscosity === "encer" ? cy : cy - 50;
      const pipeW = magmaViscosity === "encer" ? 40 : 20;
      ctx.fillStyle = "#ea580c";
      if (pressure > 50 || isErupting) {
         const pLvl = isErupting ? topY : cy + 100 - (pressure - 50) * 2;
         ctx.fillRect(cx - pipeW/2, pLvl, pipeW, cy + 100 - pLvl);
      }

      // Eruption Particles
      if (isErupting) {
         // Spawn particles
         const spawnRate = magmaViscosity === "kental" ? 20 : 5;
         for(let i=0; i<spawnRate; i++) {
            if (magmaViscosity === "kental") {
               // Explosive (Ash, bombs)
               particles.push({
                 x: cx + (Math.random()-0.5)*30,
                 y: topY,
                 vx: (Math.random()-0.5)*10,
                 vy: -Math.random()*15 - 5,
                 life: 1.0,
                 color: Math.random() > 0.5 ? "#1e293b" : "#94a3b8", // Ash gray/black
                 size: Math.random()*10 + 5
               });
            } else {
               // Effusive (Lava fountain)
               particles.push({
                 x: cx + (Math.random()-0.5)*20,
                 y: topY,
                 vx: (Math.random()-0.5)*4,
                 vy: -Math.random()*8 - 2,
                 life: 1.0,
                 color: Math.random() > 0.3 ? "#ef4444" : "#f59e0b", // Red/orange lava
                 size: Math.random()*5 + 3
               });
            }
         }
      }

      // Update & Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
         const p = particles[i];
         p.x += p.vx;
         p.y += p.vy;
         p.vy += 0.5; // Gravity
         p.life -= 0.01;

         if (p.y >= cy + 100 && magmaViscosity === "encer") {
            p.vx = 0; p.vy = 0; p.life -= 0.05; // Pools on ground
         }

         ctx.globalAlpha = Math.max(0, p.life);
         ctx.fillStyle = p.color;
         ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
         ctx.globalAlpha = 1.0;

         if (p.life <= 0) particles.splice(i, 1);
      }

      // UI
      if (!isErupting) {
         // Tremor lines based on pressure
         ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth=2;
         ctx.beginPath();
         for(let x=10; x<100; x+=5) {
            ctx.lineTo(x, 50 + (Math.random()-0.5) * (pressure/5));
         }
         ctx.stroke();
         ctx.fillStyle="white"; ctx.font="12px sans-serif"; ctx.fillText("Seismograf", 10, 30);
      } else {
         ctx.fillStyle="#ef4444"; ctx.font="bold 24px sans-serif"; ctx.fillText("ERUPSI!", 10, 50);
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [pressure, isErupting, magmaViscosity]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        
        {/* Pressure Bar UI */}
        <div className="absolute right-8 bottom-8 w-12 h-64 bg-black/50 border border-white/20 rounded-full overflow-hidden flex flex-col justify-end">
           <div className={`w-full transition-all duration-300 ${isErupting ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`} style={{ height: `${pressure}%` }} />
           <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white -rotate-90">Tekanan</div>
        </div>
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Gunung Berapi & Erupsi</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-2">
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Sifat Magma</div>
            
            <button onClick={()=>{setMagmaViscosity('kental'); setPressure(0); setIsErupting(false);}} className={`w-full p-3 text-left rounded-xl border transition-all ${magmaViscosity === 'kental' ? 'bg-red-600 border-red-400 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
              🌋 Magma Kental (Eksplosif)
            </button>
            <button onClick={()=>{setMagmaViscosity('encer'); setPressure(0); setIsErupting(false);}} className={`w-full p-3 text-left rounded-xl border transition-all ${magmaViscosity === 'encer' ? 'bg-orange-600 border-orange-400 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
              🌋 Magma Encer (Efusif)
            </button>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            {magmaViscosity === "kental" && (
              <>
                <h4 className="text-red-400 font-bold uppercase text-[10px]">Tipe Strato (Kerucut)</h4>
                <p>Magma sangat kental dan kaya gas. Karena kental, gas sulit keluar, menyebabkan tekanan menumpuk sangat tinggi.</p>
                <p><strong>Hasil:</strong> Erupsi sangat dahsyat (Eksplosif), menyemburkan abu vulkanik, batu (bom), dan awan panas tinggi ke angkasa.</p>
                <p className="text-zinc-500">Contoh: G. Merapi, G. Krakatau.</p>
              </>
            )}
            {magmaViscosity === "encer" && (
              <>
                <h4 className="text-orange-400 font-bold uppercase text-[10px]">Tipe Perisai (Shield)</h4>
                <p>Magma encer (seperti sirup panas) dan miskin gas. Tekanan gas mudah lepas tanpa ledakan besar.</p>
                <p><strong>Hasil:</strong> Erupsi meleleh (Efusif). Lava mengalir jauh membentuk gunung yang landai dan luas seperti perisai.</p>
                <p className="text-zinc-500">Contoh: Gunung di Kepulauan Hawaii (Mauna Loa).</p>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
