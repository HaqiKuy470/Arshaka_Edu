"use client";

import { useState, useEffect, useRef } from "react";
import { Play, RotateCcw } from "lucide-react";

export default function Polimer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  const [polymerType, setPolymerType] = useState<"adisi"|"kondensasi">("adisi");
  
  // State for rendering monomers combining
  // Adisi: Double bond breaks to form single bond chain (e.g. Ethene -> Polyethylene)
  // Kondensasi: Two different monomers join, releasing small molecule (H2O) (e.g. Nylon, PET)

  const monomersRef = useRef<{x:number, y:number, linked:boolean, id:number, type:number}[]>([]);
  const chainsRef = useRef<{m1:number, m2:number}[]>([]); // Links

  const initMonomers = () => {
    setIsRunning(false);
    monomersRef.current = [];
    chainsRef.current = [];
    const count = polymerType === "adisi" ? 15 : 14; // 14 for even pairs
    
    for(let i=0; i<count; i++) {
      monomersRef.current.push({
        x: Math.random() * 600 + 100,
        y: Math.random() * 400 + 100,
        linked: false,
        id: i,
        type: polymerType === "adisi" ? 1 : (i%2 === 0 ? 1 : 2) // Type 1 and 2 for condensation
      });
    }
  };

  useEffect(() => {
    initMonomers();
  }, [polymerType]);

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

      const w = canvas.width;
      const h = canvas.height;
      const mons = monomersRef.current;

      if (isRunning) {
        // Find nearest unlinked and pull them
        for (let i = 0; i < mons.length; i++) {
          const m1 = mons[i];
          
          // Random drift
          m1.x += (Math.random() - 0.5) * 2;
          m1.y += (Math.random() - 0.5) * 2;

          // Check for polymerization collisions
          // Simplified logic: just chain them up sequentially to form one long chain
          // Find if I'm at the end of a chain
          const myLinks = chainsRef.current.filter(c => c.m1 === i || c.m2 === i).length;
          
          if (myLinks < 2) {
            // Can bond
            for (let j = i + 1; j < mons.length; j++) {
              const m2 = mons[j];
              const theirLinks = chainsRef.current.filter(c => c.m1 === j || c.m2 === j).length;
              
              if (theirLinks < 2) {
                // Compatible check
                const isCompat = polymerType === "adisi" ? true : (m1.type !== m2.type);
                
                if (isCompat) {
                  const dx = m2.x - m1.x;
                  const dy = m2.y - m1.y;
                  const dist = Math.sqrt(dx*dx + dy*dy);
                  
                  if (dist < 80) {
                    // Pull
                    m1.x += (dx/dist) * 2; m1.y += (dy/dist) * 2;
                    m2.x -= (dx/dist) * 2; m2.y -= (dy/dist) * 2;
                  }
                  
                  if (dist < 40) {
                    // Bond!
                    // Make sure we don't form a loop (simple hack: check if already in same chain, hard to do fast, just accept loops for now visually or check)
                    const linkExists = chainsRef.current.some(c => (c.m1===i && c.m2===j) || (c.m1===j && c.m2===i));
                    if (!linkExists) {
                      chainsRef.current.push({m1: i, m2: j});
                      m1.linked = true; m2.linked = true;
                      
                      // If kondensasi, spawn a water droplet visual (just particle effect, ignore for simple 2D)
                      if (polymerType === "kondensasi") {
                        // Splash effect
                        ctx.fillStyle = "rgba(59, 130, 246, 0.8)";
                        ctx.beginPath(); ctx.arc(m1.x + dx/2, m1.y + dy/2, 10, 0, Math.PI*2); ctx.fill();
                        ctx.fillStyle = "white"; ctx.font="10px sans-serif"; ctx.fillText("-H₂O", m1.x + dx/2, m1.y + dy/2 - 15);
                      }
                    }
                  }
                }
              }
            }
          }

          // Spring forces for linked monomers
          chainsRef.current.forEach(c => {
            if (c.m1 === i || c.m2 === i) {
              const otherIdx = c.m1 === i ? c.m2 : c.m1;
              const m2 = mons[otherIdx];
              const dx = m2.x - m1.x;
              const dy = m2.y - m1.y;
              const dist = Math.sqrt(dx*dx + dy*dy);
              const targetDist = 40;
              
              const force = (dist - targetDist) * 0.05;
              m1.x += dx * force;
              m1.y += dy * force;
            }
          });

          // Bounds
          if (m1.x < 20) m1.x = 20; if (m1.x > w-20) m1.x = w-20;
          if (m1.y < 20) m1.y = 20; if (m1.y > h-20) m1.y = h-20;
        }
      }

      // Draw Bonds
      ctx.strokeStyle = "rgba(255,255,255,0.8)";
      ctx.lineWidth = 4;
      chainsRef.current.forEach(c => {
        const m1 = mons[c.m1]; const m2 = mons[c.m2];
        ctx.beginPath(); ctx.moveTo(m1.x, m1.y); ctx.lineTo(m2.x, m2.y); ctx.stroke();
      });

      // Draw Monomers
      mons.forEach(m => {
        ctx.beginPath();
        if (polymerType === "adisi") {
          // Ethene (looks like pill)
          ctx.ellipse(m.x, m.y, 15, 10, m.x*0.01, 0, Math.PI*2);
          ctx.fillStyle = "#3b82f6";
          ctx.fill();
          // Draw double bond inside if not linked much
          const links = chainsRef.current.filter(c => c.m1 === m.id || c.m2 === m.id).length;
          if (links === 0) {
            ctx.strokeStyle = "white"; ctx.lineWidth=2;
            ctx.beginPath(); ctx.moveTo(m.x-5, m.y-3); ctx.lineTo(m.x+5, m.y-3); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(m.x-5, m.y+3); ctx.lineTo(m.x+5, m.y+3); ctx.stroke();
          } else {
            ctx.fillStyle = "white"; ctx.font="10px sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText("-C-C-", m.x, m.y);
          }
        } else {
          // Kondensasi (Diamine & Dicarboxylic acid)
          ctx.arc(m.x, m.y, 14, 0, Math.PI*2);
          if (m.type === 1) {
            ctx.fillStyle = "#ec4899"; // Pink (Acid)
            ctx.fill(); ctx.fillStyle="white"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.font="12px sans-serif"; ctx.fillText("A", m.x, m.y);
          } else {
            ctx.fillStyle = "#10b981"; // Green (Amine/Alcohol)
            ctx.fill(); ctx.fillStyle="white"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.font="12px sans-serif"; ctx.fillText("B", m.x, m.y);
          }
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [isRunning, polymerType]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Reaksi Polimerisasi</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="flex gap-2">
            <button onClick={() => setIsRunning(true)} disabled={isRunning} className="flex-1 py-3 bg-indigo-600 disabled:bg-indigo-600/50 hover:bg-indigo-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
              <Play className="w-4 h-4"/> Mulai Reaksi
            </button>
            <button onClick={initMonomers} className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors">
              <RotateCcw className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="space-y-2 pt-4 border-t border-white/10">
            <label className="text-sm font-bold text-white">Jenis Polimerisasi</label>
            <div className="grid grid-cols-1 gap-2">
              <button 
                className={`py-2 px-4 rounded-xl border ${polymerType==='adisi' ? 'bg-blue-500/30 border-blue-400 text-blue-300 font-bold' : 'bg-black/30 border-white/10 text-zinc-400'} transition-all`}
                onClick={() => setPolymerType('adisi')}
              >
                Adisi (Pemutusan Ikatan Rangkap)
              </button>
              <button 
                className={`py-2 px-4 rounded-xl border ${polymerType==='kondensasi' ? 'bg-pink-500/30 border-pink-400 text-pink-300 font-bold' : 'bg-black/30 border-white/10 text-zinc-400'} transition-all`}
                onClick={() => setPolymerType('kondensasi')}
              >
                Kondensasi (Melepas Molekul Kecil)
              </button>
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            {polymerType === "adisi" ? (
              <>
                <p className="text-blue-400 font-bold">Polimerisasi Adisi</p>
                <p>Monomer dengan ikatan rangkap (seperti Etena) bergabung dengan membuka ikatan rangkapnya menjadi rantai panjang (Polietilena / Plastik PE).</p>
                <p className="font-mono text-[10px] mt-2">n(CH₂=CH₂) → [-CH₂-CH₂-]n</p>
              </>
            ) : (
              <>
                <p className="text-pink-400 font-bold">Polimerisasi Kondensasi</p>
                <p>Dua jenis monomer (A dan B) bergabung dengan ujung fungsionalnya dan melepaskan molekul kecil, biasanya Air (H₂O). Contoh: Nilon, PET (Botol Plastik).</p>
                <p className="font-mono text-[10px] mt-2">n(A) + n(B) → [-A-B-]n + 2n(H₂O)</p>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
