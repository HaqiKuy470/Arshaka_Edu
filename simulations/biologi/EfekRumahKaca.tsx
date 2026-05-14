"use client";

import { useState, useEffect, useRef } from "react";

export default function EfekRumahKaca() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [co2Level, setCo2Level] = useState(300); // ppm
  const [temperature, setTemperature] = useState(14); // Celsius base

  useEffect(() => {
    // Math logic based on CO2
    // base 300 ppm -> 14 C
    // 400 ppm -> 15 C
    // 800 ppm -> 18 C
    const newTemp = 14 + (co2Level - 300) / 100 * 1.0;
    setTemperature(newTemp);
  }, [co2Level]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    
    // Photons
    const photons: {x:number, y:number, isHeat:boolean, vx:number, vy:number}[] = [];
    
    // CO2 molecules
    const co2Mols: {x:number, y:number}[] = [];
    
    const updateCo2 = () => {
      co2Mols.length = 0;
      const count = Math.floor(co2Level / 10);
      for(let i=0; i<count; i++) {
        co2Mols.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.7 // Atmosphere
        });
      }
    };
    // init
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    updateCo2();

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;

      // Draw Sky/Atmosphere (color changes based on temp)
      const r = Math.min(255, 135 + (temperature-14)*10);
      const g = Math.max(100, 206 - (temperature-14)*5);
      const b = Math.max(100, 235 - (temperature-14)*15);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(0, 0, w, h);

      // Draw Earth (Ground)
      const groundY = h * 0.8;
      ctx.fillStyle = temperature > 16 ? "#b45309" : "#4ade80"; // Turn brown if hot
      ctx.fillRect(0, groundY, w, h - groundY);

      // Draw Sun
      ctx.fillStyle = "#facc15";
      ctx.beginPath(); ctx.arc(80, 80, 40, 0, Math.PI*2); ctx.fill();
      ctx.shadowColor = "#fef08a"; ctx.shadowBlur = 30; ctx.fill(); ctx.shadowBlur = 0;

      // CO2 Molecules
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      co2Mols.forEach(m => {
        ctx.beginPath(); ctx.arc(m.x, m.y, 4, 0, Math.PI*2); ctx.fill();
        // small wiggle
        m.x += (Math.random()-0.5); m.y += (Math.random()-0.5);
      });

      // Spawn Photons
      if (Math.random() > 0.8) {
        // Light photon from sun
        photons.push({ x: 80, y: 80, isHeat: false, vx: 3, vy: 4 });
      }

      // Update & Draw Photons
      for (let i = photons.length - 1; i >= 0; i--) {
        const p = photons[i];
        p.x += p.vx;
        p.y += p.vy;

        if (!p.isHeat) {
          // Sunlight (Yellow)
          ctx.fillStyle = "#fef08a";
          ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI*2); ctx.fill();

          // Hit ground -> turn to Heat (Infrared)
          if (p.y >= groundY) {
            p.isHeat = true;
            p.vx = (Math.random() - 0.5) * 4;
            p.vy = -Math.random() * 3 - 1; // bounce up
          }
        } else {
          // Heat/Infrared (Red)
          ctx.fillStyle = "#ef4444";
          ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI*2); ctx.fill();

          // Check collision with CO2
          let hitCo2 = false;
          for(let m of co2Mols) {
            const dx = p.x - m.x; const dy = p.y - m.y;
            if (dx*dx + dy*dy < 100) { hitCo2 = true; break; }
          }

          if (hitCo2) {
            // Greenhouse effect! Bounce back down
            p.vy = Math.abs(p.vy); 
            p.vx = (Math.random()-0.5)*4;
          }

          // Escaped to space
          if (p.y < -10) {
            photons.splice(i, 1);
          }
          // Absorbed by ground again
          if (p.y > h) {
            photons.splice(i, 1);
          }
        }
      }

      // Heat waves visual on ground if hot
      if (temperature > 15) {
        ctx.strokeStyle = "rgba(239, 68, 68, 0.3)"; ctx.lineWidth=2;
        for(let x=0; x<w; x+=40) {
          ctx.beginPath(); ctx.moveTo(x, groundY); 
          ctx.lineTo(x + Math.sin(Date.now()/200 + x)*10, groundY - 20); 
          ctx.stroke();
        }
      }

      animationId = requestAnimationFrame(render);
    };

    updateCo2();
    render();
    
    return () => cancelAnimationFrame(animationId);
  }, [co2Level, temperature]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        
        <div className="absolute top-8 right-8 text-right font-mono font-bold">
          <div className="text-4xl text-white drop-shadow-md">{temperature.toFixed(1)} °C</div>
          <div className="text-xl text-zinc-800 drop-shadow-md">{co2Level} ppm CO₂</div>
        </div>
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Efek Rumah Kaca & Iklim</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-zinc-300">Konsentrasi CO₂ (ppm)</label>
                <span className="font-mono text-zinc-300">{co2Level}</span>
              </div>
              <input 
                type="range" className="w-full accent-zinc-500" 
                min="200" max="1000" step="10" 
                value={co2Level} 
                onChange={(e) => setCo2Level(parseInt(e.target.value))} 
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <button onClick={()=>setCo2Level(280)} className="py-2 bg-blue-500/20 text-blue-300 border border-blue-500/50 rounded text-xs font-bold hover:bg-blue-500/30">Pra-Revolusi Industri (280 ppm)</button>
              <button onClick={()=>setCo2Level(420)} className="py-2 bg-amber-500/20 text-amber-300 border border-amber-500/50 rounded text-xs font-bold hover:bg-amber-500/30">Masa Kini (~420 ppm)</button>
              <button onClick={()=>setCo2Level(800)} className="py-2 bg-red-500/20 text-red-300 border border-red-500/50 rounded text-xs font-bold hover:bg-red-500/30">Skenario Terburuk (800 ppm)</button>
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Efek Rumah Kaca (Greenhouse Effect)</strong> sebenarnya proses alami yang menghangatkan Bumi. Tanpanya, Bumi akan membeku (-18°C).</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Cahaya Matahari (kuning) menembus atmosfer dan memanaskan permukaan bumi.</li>
              <li>Bumi melepaskan panas dalam bentuk radiasi Inframerah (merah).</li>
              <li>Gas Rumah Kaca seperti CO₂ (hitam) memerangkap radiasi merah tersebut dan memantulkannya kembali ke bumi.</li>
            </ol>
            <p className="text-red-400 font-bold mt-2">Masalah: Aktivitas manusia menambah terlalu banyak CO₂, membuat bumi terlalu panas (Pemanasan Global).</p>
          </div>

        </div>
      </div>
    </div>
  );
}
