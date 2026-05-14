"use client";

import { useState, useEffect, useRef } from "react";

export default function PenawaranPermintaan() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Base constants
  const pMax = 100;
  const qMax = 100;

  // Supply curve (S): P = cS + mS * Q -> mS is positive slope
  const [supplyShift, setSupplyShift] = useState(0); // -40 to 40 (shifts curve left/right conceptually, but we implement as price intercept shift)
  
  // Demand curve (D): P = cD + mD * Q -> mD is negative slope
  const [demandShift, setDemandShift] = useState(0); // -40 to 40

  // Calculate Equilibrium (E) where Supply = Demand
  // S: P = (10 + supplyShift) + 0.8 * Q
  // D: P = (90 + demandShift) - 0.8 * Q
  // 10 + s + 0.8Q = 90 + d - 0.8Q
  // 1.6Q = 80 + d - s
  // Q* = (80 + d - s) / 1.6
  // P* = (10 + s) + 0.8 * Q*
  const qEq = (80 + demandShift - supplyShift) / 1.6;
  const pEq = (10 + supplyShift) + 0.8 * qEq;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;
    
    const margin = 50;
    const graphW = w - margin * 2;
    const graphH = h - margin * 2;

    const getX = (q: number) => margin + (q / qMax) * graphW;
    const getY = (p: number) => h - margin - (p / pMax) * graphH;

    // Draw Grid & Axes
    ctx.strokeStyle = "rgba(255,255,255,0.1)"; ctx.lineWidth = 1;
    for(let i=0; i<=10; i++) {
       ctx.beginPath(); ctx.moveTo(margin, getY(i*10)); ctx.lineTo(w-margin, getY(i*10)); ctx.stroke();
       ctx.beginPath(); ctx.moveTo(getX(i*10), margin); ctx.lineTo(getX(i*10), h-margin); ctx.stroke();
    }
    
    // Axis Lines
    ctx.strokeStyle = "white"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(margin, margin); ctx.lineTo(margin, h-margin); ctx.lineTo(w-margin, h-margin); ctx.stroke();
    
    ctx.fillStyle = "white"; ctx.font = "bold 14px sans-serif";
    ctx.fillText("Harga (P)", margin - 20, margin - 10);
    ctx.fillText("Kuantitas (Q)", w - margin + 10, h - margin + 5);

    // Draw Demand Curve (D)
    ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(90 + demandShift));
    ctx.lineTo(getX(100), getY(90 + demandShift - 80)); // at Q=100, P = 90+d - 80
    ctx.stroke();
    ctx.fillStyle = "#3b82f6"; ctx.fillText("D", getX(90), getY(90 + demandShift - 72) + 20);

    // Draw Supply Curve (S)
    ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(10 + supplyShift));
    ctx.lineTo(getX(100), getY(10 + supplyShift + 80));
    ctx.stroke();
    ctx.fillStyle = "#ef4444"; ctx.fillText("S", getX(90), getY(10 + supplyShift + 72) - 10);

    // Draw Equilibrium Point (E)
    if (qEq >= 0 && qEq <= 100 && pEq >= 0 && pEq <= 100) {
       ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.setLineDash([5,5]); ctx.lineWidth = 2;
       ctx.beginPath(); ctx.moveTo(getX(qEq), getY(pEq)); ctx.lineTo(getX(qEq), h-margin); ctx.stroke();
       ctx.beginPath(); ctx.moveTo(getX(qEq), getY(pEq)); ctx.lineTo(margin, getY(pEq)); ctx.stroke();
       ctx.setLineDash([]);

       ctx.fillStyle = "#f59e0b";
       ctx.beginPath(); ctx.arc(getX(qEq), getY(pEq), 8, 0, Math.PI*2); ctx.fill();
       ctx.fillStyle = "white"; ctx.font = "bold 16px sans-serif";
       ctx.fillText("E", getX(qEq) + 10, getY(pEq) - 10);
    }

  }, [supplyShift, demandShift, pEq, qEq]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-4">
        
        <h2 className="text-2xl font-bold text-white mb-4">Hukum Penawaran & Permintaan</h2>
        <div className="relative w-full max-w-2xl aspect-[4/3] bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl">
           <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
           
           {/* Floating HUD for Equilibrium */}
           <div className="absolute top-4 right-4 bg-black/80 border border-amber-500/50 p-4 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <div className="text-xs text-amber-500 font-bold uppercase mb-2">Titik Keseimbangan (E)</div>
              <div className="text-white font-mono">P* = Rp {Math.round(pEq * 100).toLocaleString()}</div>
              <div className="text-white font-mono">Q* = {Math.round(qEq)} unit</div>
           </div>
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Supply & Demand</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-4">
             <div>
               <div className="flex justify-between text-xs font-bold text-blue-400 mb-2 uppercase">
                 <span>Geser Permintaan (Demand)</span>
               </div>
               <input type="range" min="-40" max="40" value={demandShift} onChange={e=>setDemandShift(parseInt(e.target.value))} className="w-full accent-blue-500" />
               <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                 <span>Turun (Kiri)</span>
                 <span>Naik (Kanan)</span>
               </div>
             </div>

             <div>
               <div className="flex justify-between text-xs font-bold text-red-400 mb-2 uppercase">
                 <span>Geser Penawaran (Supply)</span>
               </div>
               <input type="range" min="-40" max="40" value={-supplyShift} onChange={e=>setSupplyShift(-parseInt(e.target.value))} className="w-full accent-red-500" />
               <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                 <span>Turun (Kiri)</span>
                 <span>Naik (Kanan)</span>
               </div>
             </div>

             <button 
               onClick={() => {setDemandShift(0); setSupplyShift(0);}} 
               className="w-full p-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg border border-white/10"
             >
                Reset Kurva
             </button>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Permintaan (Biru):</strong> Sudut pandang Pembeli. Jika harga turun, pembeli mau beli lebih banyak (Hukum Permintaan).</p>
            <p><strong>Penawaran (Merah):</strong> Sudut pandang Penjual. Jika harga naik, penjual mau jual lebih banyak untuk untung besar (Hukum Penawaran).</p>
            <hr className="border-white/10 my-2" />
            <p className="text-amber-400 font-bold">Kasus Nyata:</p>
            <ul className="list-disc pl-4 space-y-1">
               <li>Mendekati Lebaran, pembeli daging meningkat tajam (Geser Biru ke Kanan) ➔ Harga (P) naik drastis!</li>
               <li>Panen raya beras membuat stok melimpah (Geser Merah ke Kanan) ➔ Harga (P) beras anjlok turun!</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
