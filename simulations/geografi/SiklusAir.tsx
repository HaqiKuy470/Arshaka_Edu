"use client";

import { useState, useEffect, useRef } from "react";

export default function SiklusAir() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [temp, setTemp] = useState(30); // Temperature affects evaporation speed

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let offset = 0;

    const particles: {x:number, y:number, state:'vapor'|'rain'|'river', life:number}[] = [];

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // Draw Sky
      ctx.fillStyle = "#bae6fd"; ctx.fillRect(0,0,w,h);

      // Draw Sun
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath(); ctx.arc(w - 80, 80, 40 + (temp/100)*20, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = `rgba(251, 191, 36, ${temp/100})`;
      ctx.beginPath(); ctx.arc(w - 80, 80, 80 + (temp/100)*40, 0, Math.PI*2); ctx.fill();

      // Draw Mountains / Land
      ctx.fillStyle = "#4d7c0f"; // Dark green mountain
      ctx.beginPath(); ctx.moveTo(0, h); ctx.lineTo(0, h/3); ctx.lineTo(w/2, h); ctx.fill();
      
      ctx.fillStyle = "#65a30d"; // Light green land
      ctx.fillRect(0, h*0.8, w, h*0.2);

      // Draw Ocean
      ctx.fillStyle = "#0284c7";
      ctx.fillRect(w/2, h*0.7, w/2, h*0.3);

      // Draw Cloud (Kondensasi)
      const cloudX = w/4 + Math.sin(offset*0.05)*20;
      ctx.fillStyle = "white";
      ctx.beginPath(); ctx.arc(cloudX, 100, 40, 0, Math.PI*2); 
      ctx.arc(cloudX+40, 100, 50, 0, Math.PI*2); 
      ctx.arc(cloudX+80, 100, 40, 0, Math.PI*2); ctx.fill();

      // Draw Cloud above ocean (forming)
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.beginPath(); ctx.arc(w*0.75, 150, 30, 0, Math.PI*2); ctx.arc(w*0.75+30, 150, 40, 0, Math.PI*2); ctx.fill();

      // Labels
      ctx.fillStyle = "white"; ctx.font = "bold 14px sans-serif";
      ctx.fillText("Kondensasi", cloudX + 10, 100);
      ctx.fillStyle = "black";
      ctx.fillText("Evaporasi", w*0.75, h*0.6);
      ctx.fillText("Presipitasi", w/4, h*0.6);
      ctx.fillText("Infiltrasi / Runoff", w/4, h*0.85);

      // Particle Logic
      // 1. Evaporation from ocean
      const evapRate = temp / 20; // higher temp = more vapor
      for(let i=0; i<evapRate; i++) {
         if (Math.random() > 0.5) {
            particles.push({x: w*0.6 + Math.random()*(w*0.4), y: h*0.7, state: 'vapor', life: 1});
         }
      }

      // 2. Rain from cloud
      if (Math.random() > 0.2) {
         particles.push({x: cloudX - 20 + Math.random()*120, y: 130, state: 'rain', life: 1});
      }

      // 3. River run-off
      if (Math.random() > 0.5) {
         particles.push({x: w/4 + Math.random()*20, y: h*0.8, state: 'river', life: 1});
      }

      // Update and draw particles
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      for (let i = particles.length - 1; i >= 0; i--) {
         const p = particles[i];
         
         if (p.state === 'vapor') {
            p.y -= 1 + (temp/50);
            p.x -= 0.5; // Wind blowing to land
            ctx.fillStyle = `rgba(255,255,255,${p.life})`;
            ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI*2); ctx.fill();
            if (p.y < 150) p.life -= 0.02;
         } 
         else if (p.state === 'rain') {
            p.y += 5;
            ctx.fillStyle = "#38bdf8";
            ctx.fillRect(p.x, p.y, 2, 8);
            if (p.y > h*0.8) p.life = 0;
         }
         else if (p.state === 'river') {
            p.x += 2;
            ctx.fillStyle = "#0284c7";
            ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI*2); ctx.fill();
            if (p.x > w/2) p.life = 0; // reaches ocean
         }

         if (p.life <= 0) particles.splice(i, 1);
      }

      offset++;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [temp]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Siklus Air (Hidrologi)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-4">
             <div>
               <div className="flex justify-between text-xs font-bold text-zinc-300 mb-2 uppercase">
                 <span>Suhu Udara</span>
                 <span className="text-amber-400">{temp}°C</span>
               </div>
               <input type="range" min="10" max="50" step="1" value={temp} onChange={e=>setTemp(parseInt(e.target.value))} className="w-full accent-amber-500" />
               <div className="text-[10px] text-zinc-500 mt-1">Suhu tinggi mempercepat penguapan (Evaporasi).</div>
             </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <h4 className="text-sm font-bold text-white mb-2">Tahapan Siklus Air:</h4>
            <ol className="list-decimal pl-4 space-y-2">
               <li><strong className="text-amber-400">Evaporasi:</strong> Air laut atau danau menguap menjadi gas karena panas matahari. (Jika dari tumbuhan disebut <em>Transpirasi</em>).</li>
               <li><strong className="text-white">Kondensasi:</strong> Uap air naik ke tempat dingin dan berubah kembali menjadi titik-titik air, membentuk awan.</li>
               <li><strong className="text-blue-400">Presipitasi:</strong> Awan yang terlalu berat akan jatuh ke bumi sebagai hujan, salju, atau hujan es.</li>
               <li><strong className="text-emerald-400">Infiltrasi / Run-off:</strong> Air meresap ke dalam tanah (air tanah) atau mengalir di permukaan (sungai) untuk kembali ke laut. Siklus berulang!</li>
            </ol>
            <div className="mt-4 p-2 bg-zinc-900 rounded border border-zinc-700">
               <strong>Fakta Unik:</strong> Jumlah air di Bumi selalu tetap! Air yang Anda minum hari ini mungkin adalah air yang sama yang diminum dinosaurus jutaan tahun lalu.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
