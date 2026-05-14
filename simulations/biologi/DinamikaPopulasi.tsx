"use client";

import { useState, useEffect, useRef } from "react";

export default function DinamikaPopulasi() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [model, setModel] = useState<"eksponensial"|"logistik"|"predator">("logistik");
  const [time, setTime] = useState(0);
  const [history, setHistory] = useState<{t:number, val:number, pred?:number}[]>([]);

  // Simulation parameters
  const r = 0.1; // Growth rate
  const K = 800; // Carrying capacity

  useEffect(() => {
    // Reset simulation when model changes
    setTime(0);
    setHistory([{ t: 0, val: 50, pred: 20 }]);
  }, [model]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(t => {
        const nextT = t + 1;
        setHistory(prev => {
          const last = prev[prev.length - 1];
          let nextVal = last.val;
          let nextPred = last.pred || 0;

          if (model === "eksponensial") {
            // dN/dt = rN
            nextVal = last.val + (r * last.val);
          } 
          else if (model === "logistik") {
            // dN/dt = rN * (K - N)/K
            nextVal = last.val + (r * last.val * ((K - last.val) / K));
          }
          else if (model === "predator") {
            // Lotka-Volterra Equations (simplified discrete)
            const alpha = 0.005; // Predation rate
            const gamma = 0.05; // Predator mortality
            const delta = 0.002; // Predator growth per prey eaten

            // Prey (Kelinci) growth
            nextVal = last.val + (r * last.val) - (alpha * last.val * last.pred!);
            // Predator (Rubah) growth
            nextPred = last.pred! - (gamma * last.pred!) + (delta * last.val * last.pred!);
            
            // Prevent negatives
            nextVal = Math.max(0, nextVal);
            nextPred = Math.max(0, nextPred);
          }

          // keep history manageable
          const newHist = [...prev, { t: nextT, val: nextVal, pred: nextPred }];
          if (newHist.length > 200) newHist.shift(); // sliding window
          return newHist;
        });
        return nextT;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [model]);

  // Draw Graph
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

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.1)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(40, 20); ctx.lineTo(40, h-40); ctx.lineTo(w-20, h-40); ctx.stroke();

    // Carrying Capacity Line (Logistik)
    if (model === "logistik") {
       const kY = h - 40 - (K / 1000) * (h - 60);
       ctx.strokeStyle = "rgba(234, 179, 8, 0.5)"; ctx.setLineDash([5,5]);
       ctx.beginPath(); ctx.moveTo(40, kY); ctx.lineTo(w-20, kY); ctx.stroke(); ctx.setLineDash([]);
       ctx.fillStyle = "#eab308"; ctx.font = "10px sans-serif";
       ctx.fillText("Carrying Capacity (K)", 50, kY - 5);
    }

    if (history.length < 2) return;

    // Max X scale is 200 units, Max Y scale is 1000 for standard, maybe dynamic for predator
    const maxVal = model === "predator" ? 300 : 1000;
    
    const getX = (t: number) => 40 + ((t - history[0].t) / 200) * (w - 60);
    const getY = (v: number) => h - 40 - (v / maxVal) * (h - 60);

    // Draw Prey / Main Population Line
    ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(getX(history[0].t), getY(history[0].val));
    history.forEach(pt => ctx.lineTo(getX(pt.t), getY(pt.val)));
    ctx.stroke();

    // Draw Predator Line
    if (model === "predator") {
      ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(getX(history[0].t), getY(history[0].pred!));
      history.forEach(pt => ctx.lineTo(getX(pt.t), getY(pt.pred!)));
      ctx.stroke();
    }

    // Current value display
    const current = history[history.length - 1];
    ctx.fillStyle = "white"; ctx.font = "bold 14px sans-serif";
    if (model === "predator") {
       ctx.fillStyle = "#3b82f6"; ctx.fillText(`Mangsa (Kelinci): ${Math.round(current.val)}`, 60, 40);
       ctx.fillStyle = "#ef4444"; ctx.fillText(`Predator (Rubah): ${Math.round(current.pred!)}`, 60, 60);
    } else {
       ctx.fillText(`Populasi: ${Math.round(current.val)}`, 60, 40);
    }

  }, [history, model]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Dinamika Populasi</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-3">
             <button onClick={()=>setModel("eksponensial")} className={`w-full p-3 text-left rounded-xl border transition-all ${model === 'eksponensial' ? 'bg-purple-600 border-purple-400 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
                📈 Eksponensial (J-Curve)
             </button>
             <button onClick={()=>setModel("logistik")} className={`w-full p-3 text-left rounded-xl border transition-all ${model === 'logistik' ? 'bg-emerald-600 border-emerald-400 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
                📉 Logistik (S-Curve)
             </button>
             <button onClick={()=>setModel("predator")} className={`w-full p-3 text-left rounded-xl border transition-all ${model === 'predator' ? 'bg-rose-600 border-rose-400 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
                🐺 Predator-Prey (Lotka-Volterra)
             </button>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            {model === "eksponensial" && (
              <p>Populasi meledak tanpa batas! Ini hanya terjadi jika sumber daya (makanan, tempat) tidak terbatas. Tidak realistis di alam liar untuk waktu lama.</p>
            )}
            {model === "logistik" && (
              <>
                <p>Pertumbuhan yang realistis. Pada awalnya cepat, tapi perlahan melambat saat populasi mendekati <strong>Daya Dukung Lingkungan (Carrying Capacity / K)</strong>.</p>
                <p>Garis Kuning (K) adalah batas maksimum individu yang bisa bertahan hidup dengan sumber daya yang ada.</p>
              </>
            )}
            {model === "predator" && (
              <p>Grafik bergelombang! Saat Kelinci (Biru) bertambah, Rubah (Merah) punya banyak makanan dan ikut bertambah. Tapi karena Rubah terlalu banyak, kelinci habis dimakan, sehingga kelinci turun drastis. Karena kelinci habis, rubah ikut mati kelaparan, dan siklus berulang.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
