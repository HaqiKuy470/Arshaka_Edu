"use client";

import { useState, useEffect, useRef } from "react";

export default function TeganganPermukaan() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Liquids: Air (Water), Sabun (Soap water), Raksa (Mercury)
  const [liquid, setLiquid] = useState<"water" | "soap" | "mercury">("water");
  const [objectMass, setObjectMass] = useState(1); // grams (Silet/Paperclip)

  // Surface tension coefficients (gamma) in N/m (scaled for visual)
  const gammaValues = {
    water: 72,
    soap: 25,
    mercury: 485
  };

  const gamma = gammaValues[liquid];
  
  // Downward force = mg.
  // Upward force max = 2 * L * gamma.
  // We'll just abstract it: if objectMass > gamma / 10, it breaks the surface.
  const maxMassSupported = gamma / 10;
  const isFloating = objectMass <= maxMassSupported;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let animationId: number;

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw Beaker / Container
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx - 150, cy - 100);
      ctx.lineTo(cx - 150, cy + 150);
      ctx.lineTo(cx + 150, cy + 150);
      ctx.lineTo(cx + 150, cy - 100);
      ctx.stroke();

      // Colors
      let colorStr = "rgba(56, 189, 248, 0.5)"; // sky-400 (Water)
      if (liquid === 'soap') colorStr = "rgba(244, 114, 182, 0.5)"; // pink-400
      if (liquid === 'mercury') colorStr = "rgba(161, 161, 170, 0.8)"; // zinc-400

      // Draw Liquid
      ctx.fillStyle = colorStr;
      ctx.fillRect(cx - 148, cy, 296, 148);

      // Draw Surface "Skin" effect
      ctx.beginPath();
      ctx.moveTo(cx - 148, cy);
      // Curve if floating
      if (isFloating) {
        ctx.bezierCurveTo(cx - 50, cy, cx - 40, cy + objectMass * 3, cx, cy + objectMass * 3);
        ctx.bezierCurveTo(cx + 40, cy + objectMass * 3, cx + 50, cy, cx + 148, cy);
      } else {
        ctx.lineTo(cx + 148, cy);
      }
      ctx.strokeStyle = "rgba(255,255,255,0.8)";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw Object (Paperclip/Silet representation)
      ctx.fillStyle = "#fbbf24"; // amber-400
      let objY = cy + objectMass * 3 - 5;
      if (!isFloating) {
        // Sinking animation
        objY = cy + 130; // hit bottom
      }
      
      ctx.fillRect(cx - 20, objY, 40, 6);

      // Draw text
      if (!isFloating) {
        ctx.fillStyle = "#ef4444";
        ctx.font = "20px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Tenggelam! Tegangan Permukaan Patah", cx, cy - 50);
      } else {
        ctx.fillStyle = "#22c55e";
        ctx.font = "20px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Mengapung karena Tegangan Permukaan", cx, cy - 50);
      }

      frame++;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [liquid, objectMass, isFloating]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Tegangan Permukaan</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-zinc-300">Pilih Cairan</h4>
            <div className="flex flex-col gap-2">
              <button onClick={() => setLiquid("water")} className={`py-2 rounded border ${liquid === 'water' ? 'bg-sky-500/20 border-sky-500/50 text-sky-400' : 'border-white/10 text-zinc-400 hover:bg-white/5'}`}>Air Murni (γ = 72 mN/m)</button>
              <button onClick={() => setLiquid("soap")} className={`py-2 rounded border ${liquid === 'soap' ? 'bg-pink-500/20 border-pink-500/50 text-pink-400' : 'border-white/10 text-zinc-400 hover:bg-white/5'}`}>Air Sabun (γ = 25 mN/m)</button>
              <button onClick={() => setLiquid("mercury")} className={`py-2 rounded border ${liquid === 'mercury' ? 'bg-zinc-500/20 border-zinc-500/50 text-zinc-300' : 'border-white/10 text-zinc-400 hover:bg-white/5'}`}>Raksa (γ = 485 mN/m)</button>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <div className="flex justify-between"><label className="text-sm text-amber-400 font-bold">Massa Jarum/Silet (m)</label><span className="text-amber-400 font-mono">{objectMass} g</span></div>
            <input type="range" className="w-full accent-amber-500" min="1" max="50" step="1" value={objectMass} onChange={(e) => setObjectMass(parseInt(e.target.value))} />
            <div className="text-[10px] text-zinc-500">Batas beban: {maxMassSupported.toFixed(1)} g</div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-2 text-xs text-zinc-400 leading-relaxed">
            <p><strong>Tegangan Permukaan (γ)</strong> terjadi karena gaya kohesi antar molekul cairan di permukaan menarik ke dalam, membentuk "selaput tipis" pelindung.</p>
            <p>Air sabun menurunkan tegangan permukaan, sehingga benda lebih mudah menembus/tenggelam (berguna untuk mencuci pakaian).</p>
          </div>

        </div>
      </div>
    </div>
  );
}
