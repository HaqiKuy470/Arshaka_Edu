"use client";

import { useState, useEffect, useRef } from "react";

export default function Kubus() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sisi, setSisi] = useState(10);
  const animationRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let angleY = 0;

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const scale = 15; // px per unit
      const size = sisi * scale;
      const half = size / 2;

      // 8 Vertices of a cube
      const nodes = [
        [-half, -half, -half], [half, -half, -half], [half, half, -half], [-half, half, -half],
        [-half, -half, half], [half, -half, half], [half, half, half], [-half, half, half]
      ];

      // Edges connecting vertices
      const edges = [
        [0,1], [1,2], [2,3], [3,0], // back face
        [4,5], [5,6], [6,7], [7,4], // front face
        [0,4], [1,5], [2,6], [3,7]  // connecting edges
      ];

      const angleX = 0.5; // Fixed slightly tilted down
      angleY += 0.01; // Spinning

      // Project 3D to 2D
      const project = (x: number, y: number, z: number) => {
        // Rotate Y
        let rx = x * Math.cos(angleY) - z * Math.sin(angleY);
        let rz = x * Math.sin(angleY) + z * Math.cos(angleY);
        // Rotate X
        let ry = y * Math.cos(angleX) - rz * Math.sin(angleX);
        return { px: cx + rx, py: cy + ry };
      };

      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 3;
      ctx.lineJoin = "round";

      edges.forEach(edge => {
        const p1 = project(nodes[edge[0]][0], nodes[edge[0]][1], nodes[edge[0]][2]);
        const p2 = project(nodes[edge[1]][0], nodes[edge[1]][1], nodes[edge[1]][2]);
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.stroke();
      });

      // Fill nodes
      nodes.forEach(node => {
        const p = project(node[0], node[1], node[2]);
        ctx.beginPath();
        ctx.arc(p.px, p.py, 4, 0, Math.PI*2);
        ctx.fillStyle = "white";
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [sisi]);

  const volume = Math.pow(sisi, 3);
  const area = 6 * Math.pow(sisi, 2);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        <div className="absolute top-6 left-6 glass-card p-6 rounded-xl border border-white/10 w-64 space-y-4">
          <div><div className="text-zinc-400 text-sm">Volume (V = s³)</div><div className="text-3xl font-bold text-sky-400 font-mono">{volume}</div></div>
          <div className="w-full h-px bg-white/10" />
          <div><div className="text-zinc-400 text-sm">Luas Permukaan (L = 6s²)</div><div className="text-3xl font-bold text-pink-400 font-mono">{area}</div></div>
        </div>
      </div>
      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Geometri 3D: Kubus</h3></div>
        <div className="p-4 flex-1 overflow-y-auto space-y-6 pt-8">
          <div className="space-y-3">
            <div className="flex justify-between"><label className="text-sm text-zinc-300">Panjang Sisi (s)</label><span className="text-white font-mono">{sisi}</span></div>
            <input type="range" className="w-full accent-sky-500" min="1" max="25" value={sisi} onChange={(e) => setSisi(parseInt(e.target.value))} />
          </div>
        </div>
      </div>
    </div>
  );
}
