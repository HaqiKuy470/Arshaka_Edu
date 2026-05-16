"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Rotate3d, 
  RotateCcw, 
  ChevronLeft, 
  ShieldAlert, 
  Atom,
  Zap,
  Info,
  Maximize2,
  Settings,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

interface MoleculeShape {
  name: string;
  type: string;
  angle: string;
  examples: string[];
  description: string;
}

const SHAPES: Record<string, MoleculeShape> = {
  "2-0": { name: "Linear", type: "AX₂", angle: "180°", examples: ["BeCl₂", "CO₂"], description: "Dua pasangan elektron ikatan menolak sejauh mungkin." },
  "3-0": { name: "Trigonal Planar", type: "AX₃", angle: "120°", examples: ["BF₃", "SO₃"], description: "Tiga pasangan elektron ikatan pada bidang datar." },
  "2-1": { name: "Bengkok (V-Shape)", type: "AX₂E", angle: "< 120°", examples: ["SO₂", "O₃"], description: "Satu pasangan elektron bebas mendorong ikatan mendekat." },
  "4-0": { name: "Tetrahedral", type: "AX₄", angle: "109.5°", examples: ["CH₄", "SiCl₄"], description: "Empat pasangan elektron ikatan dalam ruang 3D." },
  "3-1": { name: "Trigonal Piramida", type: "AX₃E", angle: "107.3°", examples: ["NH₃", "PH₃"], description: "Satu PEB di puncak menyebabkan piramida." },
  "2-2": { name: "Bengkok (V-Shape)", type: "AX₂E₂", angle: "104.5°", examples: ["H₂O", "H₂S"], description: "Dua PEB memberikan desakan kuat pada ikatan." },
  "5-0": { name: "Trigonal Bipiramida", type: "AX₅", angle: "90°, 120°", examples: ["PCl₅", "PF₅"], description: "Tiga posisi ekuatorial dan dua posisi aksial." },
  "4-1": { name: "Jungkat-jungkit (Seesaw)", type: "AX₄E", angle: "< 90°, < 120°", examples: ["SF₄"], description: "Satu PEB menempati posisi ekuatorial." },
  "3-2": { name: "Bentuk T (T-Shape)", type: "AX₃E₂", angle: "< 90°", examples: ["ClF₃"], description: "Dua PEB menempati posisi ekuatorial." },
  "2-3": { name: "Linear", type: "AX₂E₃", angle: "180°", examples: ["XeF₂", "I₃⁻"], description: "Tiga PEB di posisi ekuatorial menyeimbangkan satu sama lain." },
  "6-0": { name: "Oktahedral", type: "AX₆", angle: "90°", examples: ["SF₆"], description: "Enam pasangan elektron menunjuk ke sudut-sudut oktahedron." },
  "5-1": { name: "Piramida Segiempat", type: "AX₅E", angle: "< 90°", examples: ["BrF₅"], description: "Satu PEB di posisi aksial." },
  "4-2": { name: "Segiempat Datar", type: "AX₄E₂", angle: "90°", examples: ["XeF₄"], description: "Dua PEB di posisi aksial yang berlawanan." },
};

export default function BentukMolekul() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bonds, setBonds] = useState(2);
  const [lonePairs, setLonePairs] = useState(0);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(true);

  const totalPairs = bonds + lonePairs;
  const currentShapeKey = `${bonds}-${lonePairs}`;
  const shape = SHAPES[currentShapeKey] || { name: "Tidak Diketahui", type: "AXE", angle: "-", examples: [], description: "-" };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let angleY = rotation.y;
    let angleX = rotation.x;

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const R = Math.min(canvas.width, canvas.height) * 0.25;

      if (autoRotate) {
        angleY += 0.01;
        angleX = Math.sin(angleY * 0.5) * 0.2;
      }

      const project = (x: number, y: number, z: number) => {
        // Y rotation
        let x1 = x * Math.cos(angleY) - z * Math.sin(angleY);
        let z1 = x * Math.sin(angleY) + z * Math.cos(angleY);
        // X rotation
        let y2 = y * Math.cos(angleX) - z1 * Math.sin(angleX);
        let z2 = y * Math.sin(angleX) + z1 * Math.cos(angleX);

        const scale = 600 / (600 + z2);
        return { px: cx + x1 * scale, py: cy + y2 * scale, scale, z: z2 };
      };

      // VSEPR Geometry Calculation
      let positions: {x:number, y:number, z:number}[] = [];
      if (totalPairs === 2) {
        positions = [{x: -R, y: 0, z: 0}, {x: R, y: 0, z: 0}];
      } else if (totalPairs === 3) {
        for(let i=0; i<3; i++) {
          const a = (i * Math.PI * 2) / 3;
          positions.push({x: Math.cos(a)*R, y: Math.sin(a)*R, z: 0});
        }
      } else if (totalPairs === 4) {
        positions = [
          {x: 0, y: R, z: 0},
          {x: Math.cos(0)*R, y: -R/3, z: Math.sin(0)*R},
          {x: Math.cos(Math.PI*2/3)*R, y: -R/3, z: Math.sin(Math.PI*2/3)*R},
          {x: Math.cos(Math.PI*4/3)*R, y: -R/3, z: Math.sin(Math.PI*4/3)*R},
        ];
      } else if (totalPairs === 5) {
        positions = [
          {x: 0, y: R, z: 0}, {x: 0, y: -R, z: 0}, // axial
          {x: R, y: 0, z: 0}, 
          {x: Math.cos(Math.PI*2/3)*R, y: 0, z: Math.sin(Math.PI*2/3)*R}, 
          {x: Math.cos(Math.PI*4/3)*R, y: 0, z: Math.sin(Math.PI*4/3)*R}
        ];
      } else if (totalPairs === 6) {
        positions = [
          {x: 0, y: R, z: 0}, {x: 0, y: -R, z: 0},
          {x: R, y: 0, z: 0}, {x: -R, y: 0, z: 0},
          {x: 0, y: 0, z: R}, {x: 0, y: 0, z: -R}
        ];
      }

      // Draw Depth Sorting
      const items = [];
      const center = project(0, 0, 0);

      for (let i = 0; i < totalPairs; i++) {
        const isLonePair = i >= bonds;
        const pos = project(positions[i].x, positions[i].y, positions[i].z);
        items.push({ ...pos, isLonePair });
      }

      items.sort((a, b) => b.z - a.z);

      // Render
      items.forEach(el => {
        if (!el.isLonePair) {
          // Bond
          ctx.beginPath();
          ctx.moveTo(center.px, center.py);
          ctx.lineTo(el.px, el.py);
          ctx.strokeStyle = "rgba(255,255,255,0.2)";
          ctx.lineWidth = 12 * el.scale;
          ctx.lineCap = "round";
          ctx.stroke();
          // Inner line
          ctx.strokeStyle = "rgba(255,255,255,0.5)";
          ctx.lineWidth = 2 * el.scale;
          ctx.stroke();
        } else {
          // Lone Pair Lobe
          const angle = Math.atan2(el.py - center.py, el.px - center.px);
          const dist = 0.6; // multiplier
          const lx = center.px + (el.px - center.px) * dist;
          const ly = center.py + (el.py - center.py) * dist;

          const grad = ctx.createRadialGradient(lx, ly, 0, lx, ly, 40 * el.scale);
          grad.addColorStop(0, "rgba(250, 204, 21, 0.4)");
          grad.addColorStop(1, "rgba(250, 204, 21, 0)");

          ctx.beginPath();
          ctx.ellipse(lx, ly, 45 * el.scale, 20 * el.scale, angle, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
          
          // Electron dots
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          const dotDist = 8 * el.scale;
          ctx.beginPath(); ctx.arc(lx + Math.cos(angle + Math.PI/2) * dotDist, ly + Math.sin(angle + Math.PI/2) * dotDist, 2.5 * el.scale, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(lx - Math.cos(angle + Math.PI/2) * dotDist, ly - Math.sin(angle + Math.PI/2) * dotDist, 2.5 * el.scale, 0, Math.PI*2); ctx.fill();
        }
      });

      // Central Atom
      const centerGrad = ctx.createRadialGradient(center.px - 5, center.py - 5, 2, center.px, center.py, 25 * center.scale);
      centerGrad.addColorStop(0, "#fb923c");
      centerGrad.addColorStop(1, "#ea580c");
      ctx.beginPath(); ctx.arc(center.px, center.py, 25 * center.scale, 0, Math.PI*2);
      ctx.fillStyle = centerGrad;
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.stroke();

      // Outer Atoms
      items.forEach(el => {
        if (!el.isLonePair) {
          const atomGrad = ctx.createRadialGradient(el.px - 3, el.py - 3, 2, el.px, el.py, 18 * el.scale);
          atomGrad.addColorStop(0, "#60a5fa");
          atomGrad.addColorStop(1, "#2563eb");
          ctx.beginPath(); ctx.arc(el.px, el.py, 18 * el.scale, 0, Math.PI*2);
          ctx.fillStyle = atomGrad;
          ctx.fill();
          ctx.strokeStyle = "rgba(255,255,255,0.2)";
          ctx.stroke();
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [bonds, lonePairs, totalPairs, rotation, autoRotate]);

  return (
    <div className="fixed inset-0 bg-zinc-950 flex flex-col lg:flex-row overflow-hidden font-sans select-none text-white">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Main Simulation Area */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto">
        {/* Header Navigation */}
        <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-30 bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex items-center gap-4">
            <Link href="/simulasi" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 transition-all">
              <ChevronLeft className="w-5 h-5 text-white" />
            </Link>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold tracking-tight leading-none">Bentuk Molekul (VSEPR)</h1>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Geometri Molekuler • Kimia</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setAutoRotate(!autoRotate)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${autoRotate ? 'bg-white/10 border-white/20 text-white' : 'bg-black/40 border-white/5 text-zinc-500'}`}
            >
              <Rotate3d className={`w-4 h-4 ${autoRotate && 'animate-spin'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest">Auto Rotasi</span>
            </button>
          </div>
        </div>

        {/* Shape Identity HUD */}
        <div className="absolute top-24 left-8 animate-in fade-in slide-in-from-left duration-700">
           <div className="glass-card p-6 rounded-[32px] border border-white/10 bg-white/5 space-y-2">
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Nama Geometri</div>
              <h2 className="text-3xl font-black text-white leading-none">{shape.name}</h2>
              <div className="flex items-center gap-3 pt-2">
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-orange-400">{shape.type}</span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-blue-400">{shape.angle}</span>
              </div>
           </div>
        </div>

        {/* Interactive Canvas */}
        <div className="flex-1 w-full relative flex items-center justify-center">
          <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        </div>

        {/* Example HUD */}
        <div className="absolute bottom-8 left-8 right-8 lg:right-auto flex flex-col gap-4 max-w-sm">
           <div className="glass-card p-6 rounded-[32px] border border-white/10 bg-white/5 space-y-4">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-zinc-500" />
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Contoh Molekul</span>
              </div>
              <div className="flex gap-2">
                 {shape.examples.map(ex => (
                   <div key={ex} className="px-4 py-2 bg-black/40 border border-white/5 rounded-xl font-mono text-lg font-bold">
                     {ex.split(/(\d+)/).map((p, i) => /\d+/.test(p) ? <sub key={i} className="text-xs">{p}</sub> : p)}
                   </div>
                 ))}
              </div>
              <p className="text-[10px] text-zinc-400 leading-relaxed italic">
                 "{shape.description}"
              </p>
           </div>
        </div>
      </div>

      {/* Sidebar Controls */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-8 pt-24">
          
          {/* Valence Pairs Control */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Atom className="w-4 h-4 text-zinc-500" />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Konfigurasi Elektron</span>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Domain Ikatan (X)</label>
                  <span className="text-sm font-black text-white">{bonds}</span>
                </div>
                <input 
                  type="range" className="w-full accent-blue-500" 
                  min="2" max={6 - lonePairs} step="1" 
                  value={bonds} 
                  onChange={(e) => setBonds(parseInt(e.target.value))} 
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest">Domain Bebas (E)</label>
                  <span className="text-sm font-black text-white">{lonePairs}</span>
                </div>
                <input 
                  type="range" className="w-full accent-yellow-500" 
                  min="0" max={Math.min(6 - bonds, 3)} step="1" 
                  value={lonePairs} 
                  onChange={(e) => setLonePairs(parseInt(e.target.value))} 
                />
              </div>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="glass-card p-5 rounded-3xl border border-white/5 bg-white/5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex flex-col">
                <span className="text-[8px] text-zinc-500 uppercase font-bold tracking-tighter">Total Domain</span>
                <span className="text-xl font-black text-white">{totalPairs}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                 <Maximize2 className="w-5 h-5 text-indigo-400" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[8px] text-zinc-500 uppercase font-bold">Status Repulsi</span>
              <p className="text-[10px] text-zinc-400 leading-relaxed">
                Repulsi terbesar terjadi antar <span className="text-yellow-400 font-bold">PEB-PEB</span>, diikuti PEB-PEI, dan terkecil PEI-PEI.
              </p>
            </div>
          </div>

          {/* Chemistry Insight */}
          <div className="p-6 bg-orange-500/10 rounded-[32px] border border-orange-500/20 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-orange-400" />
              <span className="text-[10px] font-black text-orange-300 uppercase tracking-widest">Wawasan VSEPR</span>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white">Kenapa Molekul Bengkok?</h4>
              <p className="text-[10px] text-orange-200/60 leading-relaxed italic">
                "Pasangan elektron bebas (PEB) menempati ruang lebih besar daripada pasangan elektron ikatan (PEI). Hal ini mendorong atom-atom di sekitarnya sehingga sudut ikatan menjadi lebih kecil."
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
