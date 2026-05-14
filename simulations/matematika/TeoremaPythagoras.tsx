"use client";

import { useState, useEffect, useRef } from "react";

export default function TeoremaPythagoras() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [sideA, setSideA] = useState(3);
  const [sideB, setSideB] = useState(4);

  // Calculate hypotenuse
  const sideC_sq = sideA*sideA + sideB*sideB;
  const sideC = Math.sqrt(sideC_sq);
  
  // Is it a perfect pythagorean triple?
  const isTriple = Number.isInteger(sideC);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Unit size in pixels
    const unit = 25;
    
    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2 + 50;
      const cy = canvas.height / 2 + 50;

      // Draw Grid
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      for(let x=0; x<canvas.width; x+=unit) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); ctx.stroke(); }
      for(let y=0; y<canvas.height; y+=unit) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); ctx.stroke(); }

      // Triangle Vertices
      // Right angle at (cx, cy)
      // A goes up (cx, cy - a*unit)
      // B goes left (cx - b*unit, cy)
      const pRight = {x: cx, y: cy};
      const pTop = {x: cx, y: cy - sideA*unit};
      const pLeft = {x: cx - sideB*unit, y: cy};

      // Draw Triangle
      ctx.beginPath();
      ctx.moveTo(pRight.x, pRight.y);
      ctx.lineTo(pTop.x, pTop.y);
      ctx.lineTo(pLeft.x, pLeft.y);
      ctx.closePath();
      ctx.fillStyle = "rgba(59, 130, 246, 0.2)"; ctx.fill();
      ctx.strokeStyle = "white"; ctx.lineWidth = 3; ctx.stroke();

      // Draw right angle square
      ctx.beginPath();
      ctx.moveTo(cx - 15, cy); ctx.lineTo(cx - 15, cy - 15); ctx.lineTo(cx, cy - 15);
      ctx.strokeStyle = "white"; ctx.lineWidth = 2; ctx.stroke();

      // Draw Squares on sides
      // Square A (right/up)
      ctx.fillStyle = "rgba(239, 68, 68, 0.4)"; // Red
      ctx.fillRect(cx, cy - sideA*unit, sideA*unit, sideA*unit);
      ctx.strokeStyle = "#ef4444"; ctx.strokeRect(cx, cy - sideA*unit, sideA*unit, sideA*unit);
      
      // Grid inside Square A
      ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth=1;
      for(let i=1; i<sideA; i++) {
        ctx.beginPath(); ctx.moveTo(cx + i*unit, cy - sideA*unit); ctx.lineTo(cx + i*unit, cy); ctx.stroke(); // v
        ctx.beginPath(); ctx.moveTo(cx, cy - i*unit); ctx.lineTo(cx + sideA*unit, cy - i*unit); ctx.stroke(); // h
      }

      // Square B (bottom/left)
      ctx.fillStyle = "rgba(16, 185, 129, 0.4)"; // Green
      ctx.fillRect(cx - sideB*unit, cy, sideB*unit, sideB*unit);
      ctx.strokeStyle = "#10b981"; ctx.strokeRect(cx - sideB*unit, cy, sideB*unit, sideB*unit);
      
      // Grid inside Square B
      for(let i=1; i<sideB; i++) {
        ctx.beginPath(); ctx.moveTo(cx - sideB*unit + i*unit, cy); ctx.lineTo(cx - sideB*unit + i*unit, cy + sideB*unit); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx - sideB*unit, cy + i*unit); ctx.lineTo(cx, cy + i*unit); ctx.stroke();
      }

      // Square C (Hypotenuse)
      // Angle of hypotenuse
      const angle = Math.atan2(pTop.y - pLeft.y, pTop.x - pLeft.x);
      ctx.save();
      ctx.translate(pLeft.x, pLeft.y);
      ctx.rotate(angle);
      // Now x axis goes along hypotenuse. We draw square going "up" (negative y in local space)
      ctx.fillStyle = "rgba(168, 85, 247, 0.4)"; // Purple
      ctx.fillRect(0, -sideC*unit, sideC*unit, sideC*unit);
      ctx.strokeStyle = "#a855f7"; ctx.lineWidth = 2; ctx.strokeRect(0, -sideC*unit, sideC*unit, sideC*unit);
      
      // Grid inside Square C (if perfect integer)
      if (isTriple) {
        ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth=1;
        for(let i=1; i<sideC; i++) {
          ctx.beginPath(); ctx.moveTo(i*unit, -sideC*unit); ctx.lineTo(i*unit, 0); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(0, -i*unit); ctx.lineTo(sideC*unit, -i*unit); ctx.stroke();
        }
      }
      ctx.restore();

      // Labels
      ctx.fillStyle = "white"; ctx.font = "bold 16px sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.fillText(`a = ${sideA}`, cx + 20, cy - (sideA*unit)/2);
      ctx.fillText(`b = ${sideB}`, cx - (sideB*unit)/2, cy + 20);
      
      ctx.translate(pLeft.x + (pTop.x-pLeft.x)/2, pLeft.y + (pTop.y-pLeft.y)/2);
      ctx.rotate(angle);
      ctx.fillText(`c = ${sideC % 1 === 0 ? sideC : sideC.toFixed(2)}`, 0, 20);
      ctx.restore();

    };

    // Render loop or single frame
    render();
    
    // Window resize handler
    const handleResize = () => render();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sideA, sideB, sideC, isTriple]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Teorema Pythagoras</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="bg-black/30 border border-white/10 p-4 rounded-xl text-center shadow-inner">
            <div className="text-lg font-mono font-bold text-white mb-2">a² + b² = c²</div>
            <div className="text-sm font-mono text-zinc-400">
              <span className="text-red-400">{sideA}²</span> + <span className="text-emerald-400">{sideB}²</span> = <span className="text-purple-400">c²</span>
            </div>
            <div className="text-sm font-mono text-zinc-400">
              {sideA*sideA} + {sideB*sideB} = {sideC_sq}
            </div>
            <div className="text-xl font-mono text-purple-400 font-bold mt-2">
              c = {isTriple ? sideC : sideC.toFixed(2)}
            </div>
            {isTriple && (
              <div className="mt-2 text-[10px] uppercase font-bold bg-purple-500/20 text-purple-300 px-2 py-1 rounded inline-block">
                Tripel Pythagoras ✨
              </div>
            )}
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-red-400">Sisi Tegak (a)</label>
                <span className="font-mono text-red-400">{sideA}</span>
              </div>
              <input type="range" className="w-full accent-red-500" min="1" max="15" step="1" value={sideA} onChange={(e) => setSideA(parseInt(e.target.value))} />
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-emerald-400">Sisi Alas (b)</label>
                <span className="font-mono text-emerald-400">{sideB}</span>
              </div>
              <input type="range" className="w-full accent-emerald-500" min="1" max="15" step="1" value={sideB} onChange={(e) => setSideB(parseInt(e.target.value))} />
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-2 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Teorema Pythagoras:</strong> Pada segitiga siku-siku, luas persegi pada sisi miring (hipotenusa) sama dengan jumlah luas persegi pada kedua sisi siku-sikunya.</p>
            <p>Visualisasi di samping membuktikan secara visual bahwa <span className="text-red-400">Kotak Merah</span> + <span className="text-emerald-400">Kotak Hijau</span> = <span className="text-purple-400">Kotak Ungu</span>.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
