"use client";

import { useState, useEffect, useRef } from "react";
import { Play } from "lucide-react";

export default function FisiFusiNuklir() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [mode, setMode] = useState<"fission" | "fusion">("fission");
  const [trigger, setTrigger] = useState(0);

  // Fission: Neutron hits Uranium-235 -> Ba + Kr + 3 Neutrons + Energy
  // Fusion: Deuterium + Tritium -> Helium + Neutron + Energy

  const entitiesRef = useRef<any[]>([]);

  useEffect(() => {
    // Reset entities
    entitiesRef.current = [];
    const cx = 200; // rough middle
    const cy = 150;
    
    if (mode === "fission") {
      // Big U-235 nucleus at center
      entitiesRef.current.push({ type: "U235", x: cx, y: cy, vx: 0, vy: 0, active: true });
      // Incoming Neutron
      entitiesRef.current.push({ type: "Neutron_In", x: 10, y: cy, vx: 4, vy: 0, active: true });
    } else {
      // Deuterium and Tritium moving towards each other
      entitiesRef.current.push({ type: "Deuterium", x: cx - 100, y: cy, vx: 2, vy: 0, active: true });
      entitiesRef.current.push({ type: "Tritium", x: cx + 100, y: cy, vx: -2, vy: 0, active: true });
    }
  }, [mode, trigger]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const ents = entitiesRef.current;

      // Logic
      if (mode === "fission") {
        const u235 = ents.find(e => e.type === "U235");
        const nIn = ents.find(e => e.type === "Neutron_In");

        if (u235 && nIn && nIn.active && u235.active) {
          // Collision check
          if (Math.abs(nIn.x - u235.x) < 20) {
            nIn.active = false;
            u235.active = false; // Splitting!
            
            // Create products
            ents.push({ type: "Barium", x: u235.x, y: u235.y, vx: -2, vy: -3, active: true });
            ents.push({ type: "Krypton", x: u235.x, y: u235.y, vx: 2, vy: 3, active: true });
            ents.push({ type: "Neutron_Out", x: u235.x, y: u235.y, vx: 5, vy: 0, active: true });
            ents.push({ type: "Neutron_Out", x: u235.x, y: u235.y, vx: 4, vy: 4, active: true });
            ents.push({ type: "Neutron_Out", x: u235.x, y: u235.y, vx: 4, vy: -4, active: true });
            ents.push({ type: "Energy", x: u235.x, y: u235.y, radius: 10, active: true });
          }
        }
      } else {
        // Fusion
        const deut = ents.find(e => e.type === "Deuterium");
        const trit = ents.find(e => e.type === "Tritium");

        if (deut && trit && deut.active && trit.active) {
          if (Math.abs(deut.x - trit.x) < 20) {
            deut.active = false;
            trit.active = false;

            // Products
            ents.push({ type: "Helium", x: deut.x, y: deut.y, vx: 0, vy: 2, active: true });
            ents.push({ type: "Neutron_Out", x: deut.x, y: deut.y, vx: 0, vy: -5, active: true });
            ents.push({ type: "Energy", x: deut.x, y: deut.y, radius: 10, active: true });
          }
        }
      }

      // Draw and update
      ents.forEach(e => {
        if (!e.active) return;
        
        if (e.vx !== undefined) e.x += e.vx;
        if (e.vy !== undefined) e.y += e.vy;

        ctx.beginPath();
        if (e.type.includes("Neutron")) {
          ctx.arc(e.x, e.y, 5, 0, Math.PI*2); ctx.fillStyle = "#94a3b8"; ctx.fill();
        } else if (e.type === "U235") {
          ctx.arc(e.x, e.y, 25, 0, Math.PI*2); ctx.fillStyle = "#ef4444"; ctx.fill();
          ctx.fillStyle="white"; ctx.font="10px sans-serif"; ctx.fillText("U-235", e.x-15, e.y+3);
        } else if (e.type === "Barium") {
          ctx.arc(e.x, e.y, 18, 0, Math.PI*2); ctx.fillStyle = "#f59e0b"; ctx.fill();
          ctx.fillStyle="white"; ctx.fillText("Ba", e.x-7, e.y+3);
        } else if (e.type === "Krypton") {
          ctx.arc(e.x, e.y, 15, 0, Math.PI*2); ctx.fillStyle = "#8b5cf6"; ctx.fill();
          ctx.fillStyle="white"; ctx.fillText("Kr", e.x-6, e.y+3);
        } else if (e.type === "Deuterium") {
          ctx.arc(e.x, e.y, 15, 0, Math.PI*2); ctx.fillStyle = "#3b82f6"; ctx.fill();
          ctx.fillStyle="white"; ctx.fillText("D(2)", e.x-10, e.y+3);
        } else if (e.type === "Tritium") {
          ctx.arc(e.x, e.y, 18, 0, Math.PI*2); ctx.fillStyle = "#06b6d4"; ctx.fill();
          ctx.fillStyle="white"; ctx.fillText("T(3)", e.x-10, e.y+3);
        } else if (e.type === "Helium") {
          ctx.arc(e.x, e.y, 20, 0, Math.PI*2); ctx.fillStyle = "#22c55e"; ctx.fill();
          ctx.fillStyle="white"; ctx.fillText("He(4)", e.x-12, e.y+3);
        } else if (e.type === "Energy") {
          e.radius += 2;
          ctx.arc(e.x, e.y, e.radius, 0, Math.PI*2);
          ctx.fillStyle = `rgba(250, 204, 21, ${Math.max(0, 1 - e.radius/100)})`;
          ctx.fill();
          if (e.radius < 50) {
            ctx.fillStyle = "white"; ctx.font="bold 20px sans-serif"; ctx.fillText("ENERGI!", e.x-30, e.y);
          }
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [mode, trigger]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Fisi & Fusi Nuklir</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-3">
            <div className="flex gap-2">
              <button 
                onClick={() => {setMode("fission"); setTrigger(t=>t+1);}} 
                className={`flex-1 py-2 rounded-xl font-bold border text-sm ${mode === 'fission' ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-transparent border-white/10 text-zinc-500 hover:bg-white/5'}`}
              >
                Fisi Nuklir
              </button>
              <button 
                onClick={() => {setMode("fusion"); setTrigger(t=>t+1);}} 
                className={`flex-1 py-2 rounded-xl font-bold border text-sm ${mode === 'fusion' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-transparent border-white/10 text-zinc-500 hover:bg-white/5'}`}
              >
                Fusi Nuklir
              </button>
            </div>
            
            <button onClick={() => setTrigger(t=>t+1)} className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
              <Play className="w-4 h-4"/> Mulai Reaksi
            </button>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            {mode === "fission" ? (
              <>
                <p><strong>Fisi Nuklir (Pembelahan Inti):</strong> Terjadi di Reaktor Nuklir & Bom Atom.</p>
                <p>Sebuah neutron ditembakkan lambat ke inti Uranium-235 yang tidak stabil. Inti membelah menjadi Barium dan Kripton, melepaskan energi besar dan 3 neutron baru (Reaksi Berantai).</p>
              </>
            ) : (
              <>
                <p><strong>Fusi Nuklir (Penggabungan Inti):</strong> Terjadi di Matahari & Bintang.</p>
                <p>Dua inti ringan (Deuterium & Tritium) bertabrakan pada suhu ekstrem hingga bergabung menjadi Helium, melepaskan neutron dan energi yang jauh lebih dahsyat dari Fisi.</p>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
