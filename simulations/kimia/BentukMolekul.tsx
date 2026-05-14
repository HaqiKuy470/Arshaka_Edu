"use client";

import { useState, useEffect, useRef } from "react";

export default function BentukMolekul() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // VSEPR Theory
  const [bonds, setBonds] = useState(2); // Bonding pairs
  const [lonePairs, setLonePairs] = useState(0); // Lone pairs

  const totalPairs = bonds + lonePairs;
  
  let shapeName = "Linear";
  if (totalPairs === 2) {
    shapeName = "Linear";
  } else if (totalPairs === 3) {
    if (lonePairs === 0) shapeName = "Trigonal Planar";
    else if (lonePairs === 1) shapeName = "Bengkok (V-Shape)";
  } else if (totalPairs === 4) {
    if (lonePairs === 0) shapeName = "Tetrahedral";
    else if (lonePairs === 1) shapeName = "Trigonal Piramida";
    else if (lonePairs === 2) shapeName = "Bengkok (V-Shape)";
  } else if (totalPairs === 5) {
    if (lonePairs === 0) shapeName = "Trigonal Bipiramida";
    else if (lonePairs === 1) shapeName = "Jungkat-jungkit (Seesaw)";
    else if (lonePairs === 2) shapeName = "Bentuk T (T-Shape)";
    else if (lonePairs === 3) shapeName = "Linear";
  } else if (totalPairs === 6) {
    if (lonePairs === 0) shapeName = "Oktahedral";
    else if (lonePairs === 1) shapeName = "Piramida Segiempat";
    else if (lonePairs === 2) shapeName = "Segiempat Datar (Square Planar)";
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let angle = 0;

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // 3D projection helper
      const project = (x: number, y: number, z: number) => {
        // Simple rotation around Y and X axis
        const rotY = angle;
        const rotX = Math.PI / 8; // slight tilt

        // Rot Y
        const x1 = x * Math.cos(rotY) - z * Math.sin(rotY);
        const z1 = x * Math.sin(rotY) + z * Math.cos(rotY);
        
        // Rot X
        const y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
        const z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);

        // Scale
        const scale = 500 / (500 + z2); // pseudo perspective
        return { px: cx + x1 * scale, py: cy + y2 * scale, scale, z: z2 };
      };

      // Define geometry based on total pairs (VSEPR idealized positions)
      let positions: {x:number, y:number, z:number}[] = [];
      const R = 100;

      if (totalPairs === 2) {
        positions = [{x: -R, y: 0, z: 0}, {x: R, y: 0, z: 0}];
      } else if (totalPairs === 3) {
        for(let i=0; i<3; i++) {
          const a = (i * Math.PI * 2) / 3;
          positions.push({x: Math.cos(a)*R, y: Math.sin(a)*R, z: 0});
        }
      } else if (totalPairs === 4) {
        // Tetrahedral
        positions = [
          {x: 0, y: R, z: 0},
          {x: Math.cos(Math.PI*2/3)*R, y: -R/3, z: Math.sin(Math.PI*2/3)*R},
          {x: Math.cos(Math.PI*4/3)*R, y: -R/3, z: Math.sin(Math.PI*4/3)*R},
          {x: Math.cos(0)*R, y: -R/3, z: Math.sin(0)*R}
        ];
      } else if (totalPairs === 5) {
        // Trigonal bipyramidal
        positions = [
          {x: 0, y: R, z: 0}, {x: 0, y: -R, z: 0}, // axial
          {x: R, y: 0, z: 0}, {x: Math.cos(Math.PI*2/3)*R, y: 0, z: Math.sin(Math.PI*2/3)*R}, {x: Math.cos(Math.PI*4/3)*R, y: 0, z: Math.sin(Math.PI*4/3)*R} // equatorial
        ];
        // Note: lone pairs usually occupy equatorial positions first in TBP
        // For simplicity, we just render them in order. True VSEPR sorts them to minimize repulsion.
      } else if (totalPairs === 6) {
        // Octahedral
        positions = [
          {x: 0, y: R, z: 0}, {x: 0, y: -R, z: 0},
          {x: R, y: 0, z: 0}, {x: -R, y: 0, z: 0},
          {x: 0, y: 0, z: R}, {x: 0, y: 0, z: -R}
        ];
      }

      // Draw Bonds and Lone Pairs
      const elementsToDraw = []; // Central atom is implicit
      
      // We will map lone pairs to the last few positions
      for(let i=0; i<totalPairs; i++) {
        const isLonePair = i >= bonds;
        const pos = project(positions[i].x, positions[i].y, positions[i].z);
        elementsToDraw.push({...pos, isLonePair});
      }

      // Sort by Z for depth sorting (painters algorithm)
      elementsToDraw.sort((a, b) => b.z - a.z);

      // Central Atom
      const center = project(0, 0, 0);

      elementsToDraw.forEach(el => {
        if (!el.isLonePair) {
          // Draw Bond (line)
          ctx.beginPath(); ctx.moveTo(center.px, center.py); ctx.lineTo(el.px, el.py);
          ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 4 * el.scale; ctx.stroke();
        } else {
          // Draw Lone Pair (lobe)
          ctx.beginPath();
          ctx.ellipse((center.px + el.px)/2, (center.py + el.py)/2, 30*el.scale, 15*el.scale, Math.atan2(el.py-center.py, el.px-center.px), 0, Math.PI*2);
          ctx.fillStyle = "rgba(250, 204, 21, 0.3)"; ctx.fill();
          ctx.strokeStyle = "rgba(250, 204, 21, 0.6)"; ctx.lineWidth = 2; ctx.stroke();
          // two dots for electrons
          ctx.fillStyle = "white";
          ctx.beginPath(); ctx.arc((center.px*0.4 + el.px*0.6) - 5, (center.py*0.4 + el.py*0.6), 3, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc((center.px*0.4 + el.px*0.6) + 5, (center.py*0.4 + el.py*0.6), 3, 0, Math.PI*2); ctx.fill();
        }
      });

      // Draw Central Atom (always on top of background bonds, behind foreground ones)
      ctx.beginPath(); ctx.arc(center.px, center.py, 20 * center.scale, 0, Math.PI*2);
      ctx.fillStyle = "#ef4444"; ctx.fill();

      // Draw atoms
      elementsToDraw.forEach(el => {
        if (!el.isLonePair) {
          ctx.beginPath(); ctx.arc(el.px, el.py, 15 * el.scale, 0, Math.PI*2);
          ctx.fillStyle = "#3b82f6"; ctx.fill();
        }
      });

      angle += 0.01;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [bonds, lonePairs, totalPairs]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Bentuk Molekul (VSEPR)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="bg-indigo-500/10 border border-indigo-500/30 p-4 rounded-xl text-center shadow-inner">
            <div className="text-[10px] text-indigo-400 font-bold mb-1 uppercase tracking-wider">Geometri Molekul</div>
            <div className="text-lg font-bold text-white">{shapeName}</div>
            <div className="text-[10px] text-zinc-500 mt-2">Tipe: AX<sub>{bonds}</sub>{lonePairs > 0 && `E${lonePairs}`}</div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-blue-400">Pasangan Elektron Ikatan (X)</label>
                <span className="font-mono text-blue-400">{bonds}</span>
              </div>
              <input 
                type="range" className="w-full accent-blue-500" 
                min="2" max={6 - lonePairs} step="1" 
                value={bonds} 
                onChange={(e) => setBonds(parseInt(e.target.value))} 
              />
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-yellow-400">Pasangan Elektron Bebas (E)</label>
                <span className="font-mono text-yellow-400">{lonePairs}</span>
              </div>
              <input 
                type="range" className="w-full accent-yellow-500" 
                min="0" max={Math.min(6 - bonds, 3)} step="1" // limit to max 6 total and 3 lone pairs for logic simplicity
                value={lonePairs} 
                onChange={(e) => setLonePairs(parseInt(e.target.value))} 
              />
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Teori VSEPR:</strong> Pasangan elektron di sekitar atom pusat akan saling tolak-menolak dan mengatur posisinya sejauh mungkin satu sama lain.</p>
            <p className="text-yellow-400">Pasangan Elektron Bebas (PEB) memiliki daya tolak yang <strong>lebih kuat</strong> dibandingkan pasangan elektron ikatan, sehingga menyebabkan sudut ikatan mengecil.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
