"use client";

import { useState, useEffect, useRef } from "react";

export default function TransporMembran() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [mode, setMode] = useState<"difusi"|"osmosis"|"aktif">("difusi");
  
  // Particles state
  const particlesRef = useRef<{x:number, y:number, type:string, vx:number, vy:number}[]>([]);

  useEffect(() => {
    particlesRef.current = [];
    const p = particlesRef.current;
    
    if (mode === "difusi") {
      // High concentration on left, empty on right
      for (let i = 0; i < 100; i++) {
        p.push({ x: Math.random()*300 + 50, y: Math.random()*400 + 100, type: "solute", vx: (Math.random()-0.5)*2, vy: (Math.random()-0.5)*2 });
      }
    } else if (mode === "osmosis") {
      // Water molecules (blue) everywhere
      for (let i = 0; i < 150; i++) {
        p.push({ x: Math.random()*700 + 50, y: Math.random()*400 + 100, type: "water", vx: (Math.random()-0.5)*3, vy: (Math.random()-0.5)*3 });
      }
      // Solute (red) only on right side
      for (let i = 0; i < 50; i++) {
        p.push({ x: Math.random()*300 + 450, y: Math.random()*400 + 100, type: "solute_big", vx: (Math.random()-0.5), vy: (Math.random()-0.5) });
      }
    } else if (mode === "aktif") {
      // Low concentration outside (left), high inside (right)
      for (let i = 0; i < 20; i++) {
        p.push({ x: Math.random()*300 + 50, y: Math.random()*400 + 100, type: "ion", vx: (Math.random()-0.5)*2, vy: (Math.random()-0.5)*2 });
      }
      for (let i = 0; i < 80; i++) {
        p.push({ x: Math.random()*300 + 450, y: Math.random()*400 + 100, type: "ion", vx: (Math.random()-0.5)*2, vy: (Math.random()-0.5)*2 });
      }
    }
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let pumpTimer = 0;

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;

      // Draw Membrane
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(cx - 20, 0, 40, h);
      
      // Membrane phospholipids
      for(let y=0; y<h; y+=20) {
        // Left layer
        ctx.beginPath(); ctx.arc(cx - 15, y, 6, 0, Math.PI*2); ctx.fillStyle = "#fbbf24"; ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx - 10, y-2); ctx.lineTo(cx, y-4); ctx.strokeStyle = "#fcd34d"; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx - 10, y+2); ctx.lineTo(cx, y+4); ctx.stroke();
        
        // Right layer
        ctx.beginPath(); ctx.arc(cx + 15, y, 6, 0, Math.PI*2); ctx.fillStyle = "#fbbf24"; ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx + 10, y-2); ctx.lineTo(cx, y-4); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + 10, y+2); ctx.lineTo(cx, y+4); ctx.stroke();
      }

      // Draw Pump if active transport
      if (mode === "aktif") {
        pumpTimer++;
        const pY = h/2;
        ctx.fillStyle = "#8b5cf6"; // Purple protein pump
        ctx.fillRect(cx - 25, pY - 40, 50, 80);
        ctx.fillStyle = "white"; ctx.font="10px sans-serif"; ctx.textAlign="center";
        ctx.fillText("ATP Pump", cx, pY);
        
        if (pumpTimer % 100 < 50) {
           ctx.fillStyle = "rgba(239, 68, 68, 0.8)";
           ctx.beginPath(); ctx.arc(cx - 10, pY + 20, 5, 0, Math.PI*2); ctx.fill(); // ATP binding
           ctx.fillText("ATP", cx - 20, pY + 25);
        }
      }

      // Update & Draw Particles
      const p = particlesRef.current;
      p.forEach(particle => {
        // Move
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Brownian jitter
        particle.vx += (Math.random() - 0.5) * 0.5;
        particle.vy += (Math.random() - 0.5) * 0.5;
        // Limit speed
        const speed = Math.sqrt(particle.vx**2 + particle.vy**2);
        if (speed > 3) { particle.vx *= 0.9; particle.vy *= 0.9; }

        // Bounds (walls)
        if (particle.x < 10) { particle.x = 10; particle.vx *= -1; }
        if (particle.x > w - 10) { particle.x = w - 10; particle.vx *= -1; }
        if (particle.y < 10) { particle.y = 10; particle.vy *= -1; }
        if (particle.y > h - 10) { particle.y = h - 10; particle.vy *= -1; }

        // Membrane interaction
        if (mode === "difusi") {
          // Semi-permeable to small solute
          // Random chance to pass through
          if (particle.x > cx - 25 && particle.x < cx + 25) {
            if (Math.random() > 0.8) {
              particle.vx *= -1; // Bounce back
            }
          }
        } else if (mode === "osmosis") {
          // Membrane permeable to water, NOT to large solute
          if (particle.x > cx - 25 && particle.x < cx + 25) {
            if (particle.type === "solute_big") {
              particle.vx *= -1; // Bounce
              if (particle.x < cx) particle.x = cx - 26; else particle.x = cx + 26;
            } else if (particle.type === "water") {
              // Water passes freely, maybe slight resistance
              if (Math.random() > 0.9) particle.vx *= -1;
            }
          }
        } else if (mode === "aktif") {
          // Ions cannot pass membrane directly
          if (particle.x > cx - 25 && particle.x < cx + 25) {
            // Check if hits pump
            const pY = h/2;
            if (particle.y > pY - 40 && particle.y < pY + 40 && particle.x < cx) {
              // Capture and pump to right!
              if (pumpTimer % 100 > 50) {
                particle.x = cx + 30; // teleport to right
                particle.vx = 2; // shoot right
              } else {
                particle.vx *= -1; // Wait for pump to open
              }
            } else {
              particle.vx *= -1; // bounce off normal membrane
            }
          }
        }

        // Draw
        ctx.beginPath();
        if (particle.type === "solute") {
          ctx.arc(particle.x, particle.y, 4, 0, Math.PI*2);
          ctx.fillStyle = "#ef4444";
        } else if (particle.type === "water") {
          ctx.arc(particle.x, particle.y, 3, 0, Math.PI*2);
          ctx.fillStyle = "#3b82f6";
        } else if (particle.type === "solute_big") {
          ctx.arc(particle.x, particle.y, 10, 0, Math.PI*2);
          ctx.fillStyle = "#10b981";
        } else if (particle.type === "ion") {
          ctx.arc(particle.x, particle.y, 5, 0, Math.PI*2);
          ctx.fillStyle = "#eab308";
        }
        ctx.fill();
      });

      // Labels
      ctx.fillStyle = "white"; ctx.font = "bold 16px sans-serif";
      ctx.fillText("Luar Sel", 50, 30);
      ctx.fillText("Dalam Sel", w - 120, 30);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [mode]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Transpor Membran Sel</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="flex flex-col gap-2 p-2 bg-zinc-900 rounded-xl border border-white/10">
            <button onClick={() => setMode("difusi")} className={`py-3 rounded-lg text-sm font-bold transition-all ${mode === "difusi" ? "bg-red-500/80 text-white shadow-lg shadow-red-500/20" : "text-zinc-500 hover:bg-white/5"}`}>
              Difusi Sederhana
            </button>
            <button onClick={() => setMode("osmosis")} className={`py-3 rounded-lg text-sm font-bold transition-all ${mode === "osmosis" ? "bg-blue-500/80 text-white shadow-lg shadow-blue-500/20" : "text-zinc-500 hover:bg-white/5"}`}>
              Osmosis
            </button>
            <button onClick={() => setMode("aktif")} className={`py-3 rounded-lg text-sm font-bold transition-all ${mode === "aktif" ? "bg-purple-500/80 text-white shadow-lg shadow-purple-500/20" : "text-zinc-500 hover:bg-white/5"}`}>
              Transpor Aktif (Pompa ATP)
            </button>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-sm text-zinc-300 leading-relaxed">
            {mode === "difusi" && (
              <>
                <h4 className="text-red-400 font-bold uppercase text-xs">Difusi</h4>
                <p>Perpindahan partikel dari konsentrasi <strong>Tinggi</strong> ke konsentrasi <strong>Rendah</strong>.</p>
                <p className="text-xs text-zinc-500 mt-2">Partikel merah menyebar melintasi membran fosfolipid lapis ganda hingga seimbang secara alami tanpa energi.</p>
              </>
            )}
            {mode === "osmosis" && (
              <>
                <h4 className="text-blue-400 font-bold uppercase text-xs">Osmosis</h4>
                <p>Perpindahan partikel <strong>Air (Biru)</strong> melewati membran semi-permeabel.</p>
                <p className="text-xs text-zinc-500 mt-2">Air bergerak menuju area dengan konsentrasi zat terlarut (Hijau) yang lebih tinggi karena molekul hijau terlalu besar untuk melewati membran.</p>
              </>
            )}
            {mode === "aktif" && (
              <>
                <h4 className="text-purple-400 font-bold uppercase text-xs">Transpor Aktif</h4>
                <p>Perpindahan partikel <strong>melawan</strong> gradien konsentrasi (Rendah ke Tinggi).</p>
                <p className="text-xs text-zinc-500 mt-2">Membutuhkan <strong>Energi (ATP)</strong> dan Protein Pompa khusus untuk memaksa ion masuk/keluar sel.</p>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
