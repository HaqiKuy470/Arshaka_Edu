"use client";

import { useState, useEffect, useRef } from "react";
import { Droplet } from "lucide-react";

export default function TitrasiAsamBasa() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Titration of strong acid (HCl) with strong base (NaOH)
  const volAcid = 50; // mL in flask
  const concAcid = 0.1; // M
  
  const concBase = 0.1; // M in buret
  const [volBaseAdded, setVolBaseAdded] = useState(0); // mL dropped

  // Calculate pH
  const molesAcid = volAcid * concAcid;
  const molesBase = volBaseAdded * concBase;
  const totalVol = volAcid + volBaseAdded;
  
  let pH = 7.0;
  if (molesAcid > molesBase) {
    // Excess acid
    const hConcentration = (molesAcid - molesBase) / totalVol;
    pH = -Math.log10(hConcentration);
  } else if (molesBase > molesAcid) {
    // Excess base
    const ohConcentration = (molesBase - molesAcid) / totalVol;
    const pOH = -Math.log10(ohConcentration);
    pH = 14 - pOH;
  } else {
    // Equivalence point
    pH = 7.0;
  }

  // Indicator Color (Phenolphthalein: colorless < 8.2, pink > 10.0)
  let flaskColor = "rgba(255,255,255,0.1)"; // Clear/White
  if (pH >= 8.2 && pH < 10.0) {
    const intensity = (pH - 8.2) / 1.8;
    flaskColor = `rgba(236, 72, 153, ${0.1 + intensity * 0.4})`; // Pinkish
  } else if (pH >= 10.0) {
    flaskColor = "rgba(219, 39, 119, 0.6)"; // Deep Pink
  }

  // For graph history
  const [graphData, setGraphData] = useState<{v:number, ph:number}[]>([]);

  useEffect(() => {
    // When slider changes, rebuild graph to this point (simplified)
    const newData = [];
    for(let v = 0; v <= volBaseAdded; v+=1) {
      let calcPh = 7.0;
      const mA = volAcid * concAcid;
      const mB = v * concBase;
      const tV = volAcid + v;
      if (mA > mB) calcPh = -Math.log10((mA - mB)/tV);
      else if (mB > mA) calcPh = 14 + Math.log10((mB - mA)/tV);
      newData.push({v, ph: calcPh});
    }
    setGraphData(newData);
  }, [volBaseAdded]);

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

      const cx = canvas.width / 4; // apparatus on left
      const cy = canvas.height / 2;

      // Draw Stand
      ctx.fillStyle = "#52525b"; ctx.fillRect(cx - 80, cy - 200, 10, 400); // pole
      ctx.fillRect(cx - 100, cy + 180, 80, 20); // base
      ctx.fillRect(cx - 80, cy - 50, 60, 10); // clamp

      // Draw Buret (Base NaOH)
      ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx, cy - 200); ctx.lineTo(cx, cy); ctx.moveTo(cx + 20, cy - 200); ctx.lineTo(cx + 20, cy); ctx.stroke();
      // stopcock
      ctx.fillStyle = "white"; ctx.fillRect(cx - 5, cy - 20, 30, 10);
      // Base liquid inside buret (decreases as added)
      const buretFillH = 180 * (1 - volBaseAdded/100); // assume 100ml buret
      ctx.fillStyle = "rgba(186, 230, 253, 0.5)"; // light blue
      ctx.fillRect(cx + 2, cy - 20 - buretFillH, 16, buretFillH);

      // Draw Erlenmeyer Flask (Acid HCl)
      ctx.beginPath();
      ctx.moveTo(cx - 10, cy + 30);
      ctx.lineTo(cx + 30, cy + 30);
      ctx.lineTo(cx + 60, cy + 150);
      ctx.lineTo(cx - 40, cy + 150);
      ctx.closePath();
      ctx.strokeStyle = "rgba(255,255,255,0.8)"; ctx.stroke();
      
      // Liquid inside flask
      const flaskLiquidLevel = cy + 150 - (totalVol * 0.5); // visual scale
      ctx.beginPath();
      ctx.moveTo(cx - 10 - ((flaskLiquidLevel - cy - 30)/(120))*30, flaskLiquidLevel);
      ctx.lineTo(cx + 30 + ((flaskLiquidLevel - cy - 30)/(120))*30, flaskLiquidLevel);
      ctx.lineTo(cx + 58, cy + 148);
      ctx.lineTo(cx - 38, cy + 148);
      ctx.closePath();
      ctx.fillStyle = flaskColor; ctx.fill();

      // Draw Graph (Kurva Titrasi)
      const gw = canvas.width / 2;
      const gh = 300;
      const gx = canvas.width / 2;
      const gy = cy + 100;

      // Axes
      ctx.strokeStyle = "white"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + gw - 20, gy); ctx.stroke(); // X
      ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx, gy - gh); ctx.stroke(); // Y
      
      ctx.fillStyle = "zinc-400"; ctx.font="12px sans-serif";
      ctx.fillText("Vol NaOH (mL)", gx + gw/2 - 30, gy + 20);
      ctx.fillText("pH", gx - 20, gy - gh/2);

      // Plot curve
      if (graphData.length > 0) {
        ctx.strokeStyle = "#f43f5e"; ctx.lineWidth = 3;
        ctx.beginPath();
        graphData.forEach((d, i) => {
          const px = gx + (d.v / 100) * (gw - 20);
          const py = gy - (d.ph / 14) * gh;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        });
        ctx.stroke();

        // Equivalence point line (50mL)
        ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.setLineDash([5,5]); ctx.lineWidth = 1;
        const eqX = gx + (50 / 100) * (gw - 20);
        ctx.beginPath(); ctx.moveTo(eqX, gy); ctx.lineTo(eqX, gy - gh); ctx.stroke();
        ctx.setLineDash([]);
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [volBaseAdded, pH, flaskColor, totalVol, graphData]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Titrasi Asam-Basa</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="bg-black/30 border border-white/10 p-4 rounded-xl text-center shadow-inner">
            <div className="text-[10px] text-zinc-400 font-bold mb-1 uppercase tracking-wider">pH Larutan Saat Ini</div>
            <div className={`text-4xl font-mono font-bold ${pH < 7 ? 'text-red-400' : pH > 7 ? 'text-blue-400' : 'text-emerald-400'}`}>
              {pH.toFixed(2)}
            </div>
            <div className="text-xs text-zinc-500 mt-2 font-bold uppercase tracking-widest">
              {pH < 7 ? "ASAM" : pH > 7 ? "BASA" : "NETRAL"}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl cursor-pointer hover:bg-blue-500/20 transition-colors"
                 onClick={() => setVolBaseAdded(v => Math.min(100, v + 1))}>
              <Droplet className="text-blue-400 w-6 h-6" />
              <div>
                <div className="text-sm font-bold text-blue-400">Teteskan Basa (NaOH)</div>
                <div className="text-xs text-zinc-400">+1 mL</div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-white">Volume NaOH Ditambahkan</label>
                <span className="font-mono text-zinc-400">{volBaseAdded} mL</span>
              </div>
              <input 
                type="range" className="w-full accent-blue-500" 
                min="0" max="100" step="0.5" 
                value={volBaseAdded} 
                onChange={(e) => setVolBaseAdded(parseFloat(e.target.value))} 
              />
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Titik Ekuivalen</strong> tercapai ketika jumlah mol Asam = jumlah mol Basa (Pada 50 mL NaOH).</p>
            <p className="text-pink-400">Indikator <em>Phenolphthalein (PP)</em> berubah warna menjadi merah muda saat pH &gt; 8.2, menandakan Titik Akhir Titrasi.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
