"use client";

import { useState, useEffect, useRef } from "react";

export default function GugusFungsi() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [moleculeId, setMoleculeId] = useState(0);

  const molecules = [
    {
      id: 0, name: "Alkohol (Alkanol)", formula: "R-OH", example: "Etanol (C₂H₅OH)",
      group: "Hidroksil", suffix: "-ol", color: "#3b82f6",
      struct: [
        { c: 'C', x: -40, y: 0 }, { c: 'C', x: 0, y: 0 }, { c: 'O', x: 40, y: 0, isGroup: true }, { c: 'H', x: 70, y: 0, isGroup: true },
        // hydrogens for C1
        { c: 'H', x: -40, y: -30 }, { c: 'H', x: -40, y: 30 }, { c: 'H', x: -70, y: 0 },
        // hydrogens for C2
        { c: 'H', x: 0, y: -30 }, { c: 'H', x: 0, y: 30 }
      ],
      bonds: [
        [0,1], [1,2], [2,3],
        [0,4], [0,5], [0,6],
        [1,7], [1,8]
      ]
    },
    {
      id: 1, name: "Eter (Alkoksi Alkana)", formula: "R-O-R'", example: "Dimetil Eter (CH₃-O-CH₃)",
      group: "Eter", suffix: "eter / alkoksi-", color: "#8b5cf6",
      struct: [
        { c: 'C', x: -40, y: 0 }, { c: 'O', x: 0, y: 0, isGroup: true }, { c: 'C', x: 40, y: 0 },
        { c: 'H', x: -40, y: -30 }, { c: 'H', x: -40, y: 30 }, { c: 'H', x: -70, y: 0 },
        { c: 'H', x: 40, y: -30 }, { c: 'H', x: 40, y: 30 }, { c: 'H', x: 70, y: 0 }
      ],
      bonds: [
        [0,1], [1,2],
        [0,3], [0,4], [0,5],
        [2,6], [2,7], [2,8]
      ]
    },
    {
      id: 2, name: "Aldehida (Alkanal)", formula: "R-CHO", example: "Etanal (CH₃CHO)",
      group: "Karbonil (Ujung)", suffix: "-al", color: "#ec4899",
      struct: [
        { c: 'C', x: -30, y: 0 }, { c: 'C', x: 20, y: 0, isGroup: true }, { c: 'O', x: 50, y: -30, isGroup: true, db: true }, { c: 'H', x: 50, y: 30, isGroup: true },
        { c: 'H', x: -30, y: -30 }, { c: 'H', x: -30, y: 30 }, { c: 'H', x: -60, y: 0 }
      ],
      bonds: [
        [0,1], [1,2, true], [1,3],
        [0,4], [0,5], [0,6]
      ]
    },
    {
      id: 3, name: "Keton (Alkanon)", formula: "R-CO-R'", example: "Propanon / Aseton (CH₃COCH₃)",
      group: "Karbonil (Tengah)", suffix: "-on", color: "#f59e0b",
      struct: [
        { c: 'C', x: -40, y: 0 }, { c: 'C', x: 0, y: 0, isGroup: true }, { c: 'O', x: 0, y: -40, isGroup: true, db: true }, { c: 'C', x: 40, y: 0 },
        { c: 'H', x: -40, y: -30 }, { c: 'H', x: -40, y: 30 }, { c: 'H', x: -70, y: 0 },
        { c: 'H', x: 40, y: -30 }, { c: 'H', x: 40, y: 30 }, { c: 'H', x: 70, y: 0 }
      ],
      bonds: [
        [0,1], [1,2, true], [1,3],
        [0,4], [0,5], [0,6],
        [3,7], [3,8], [3,9]
      ]
    },
    {
      id: 4, name: "Asam Karboksilat", formula: "R-COOH", example: "Asam Etanoat / Cuka (CH₃COOH)",
      group: "Karboksil", suffix: "asam -oat", color: "#10b981",
      struct: [
        { c: 'C', x: -30, y: 0 }, { c: 'C', x: 20, y: 0, isGroup: true }, { c: 'O', x: 40, y: -30, isGroup: true, db: true }, { c: 'O', x: 50, y: 20, isGroup: true }, { c: 'H', x: 80, y: 20, isGroup: true },
        { c: 'H', x: -30, y: -30 }, { c: 'H', x: -30, y: 30 }, { c: 'H', x: -60, y: 0 }
      ],
      bonds: [
        [0,1], [1,2, true], [1,3], [3,4],
        [0,5], [0,6], [0,7]
      ]
    }
  ];

  const m = molecules[moleculeId];

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

      ctx.save();
      ctx.translate(cx, cy);
      // Gentle floating animation
      ctx.translate(0, Math.sin(angle) * 10);
      
      const scale = 2; // zoom in

      // Draw Bonds
      m.bonds.forEach(b => {
        const p1 = m.struct[b[0] as number];
        const p2 = m.struct[b[1] as number];
        const isDouble = b[2] === true;

        ctx.strokeStyle = "rgba(255,255,255,0.4)";
        if (isDouble) {
          ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(p1.x*scale - 4, p1.y*scale - 4); ctx.lineTo(p2.x*scale - 4, p2.y*scale - 4); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(p1.x*scale + 4, p1.y*scale + 4); ctx.lineTo(p2.x*scale + 4, p2.y*scale + 4); ctx.stroke();
        } else {
          ctx.lineWidth = 4;
          ctx.beginPath(); ctx.moveTo(p1.x*scale, p1.y*scale); ctx.lineTo(p2.x*scale, p2.y*scale); ctx.stroke();
        }
      });

      // Draw Atoms
      m.struct.forEach(a => {
        let radius = 10;
        let color = "#64748b"; // C
        if (a.c === 'O') { color = "#ef4444"; radius = 12; }
        else if (a.c === 'H') { color = "#e2e8f0"; radius = 6; }

        ctx.beginPath(); ctx.arc(a.x*scale, a.y*scale, radius*scale*0.6, 0, Math.PI*2);
        ctx.fillStyle = color; ctx.fill();

        // Highlight functional group
        if (a.isGroup) {
          ctx.beginPath(); ctx.arc(a.x*scale, a.y*scale, radius*scale*0.8, 0, Math.PI*2);
          ctx.strokeStyle = m.color; ctx.lineWidth = 2; ctx.stroke();
          // subtle glow
          ctx.shadowColor = m.color; ctx.shadowBlur = 15; ctx.fill(); ctx.shadowBlur = 0;
        }

        ctx.fillStyle = (a.c === 'H') ? "black" : "white";
        ctx.font = "bold 12px sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle";
        ctx.fillText(a.c, a.x*scale, a.y*scale);
      });

      ctx.restore();

      angle += 0.02;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [moleculeId, m]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Gugus Fungsi Karbon</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="grid grid-cols-1 gap-2">
            {molecules.map(mol => (
              <button 
                key={mol.id}
                onClick={() => setMoleculeId(mol.id)}
                className={`p-3 rounded-xl border text-left transition-all ${moleculeId === mol.id ? 'bg-black/40 border-white/30 shadow-inner' : 'bg-transparent border-white/5 hover:bg-white/5'}`}
                style={{ borderLeftColor: moleculeId === mol.id ? mol.color : '', borderLeftWidth: moleculeId === mol.id ? '4px' : '1px' }}
              >
                <div className="font-bold text-white text-sm">{mol.name}</div>
                <div className="text-xs font-mono mt-1 text-zinc-400">{mol.formula}</div>
              </button>
            ))}
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="p-4 rounded-xl border" style={{ backgroundColor: `${m.color}20`, borderColor: `${m.color}50` }}>
              <div className="text-[10px] font-bold uppercase mb-1" style={{ color: m.color }}>Detail Gugus Fungsi</div>
              
              <div className="space-y-2 mt-3">
                <div>
                  <div className="text-xs text-zinc-400">Nama Gugus</div>
                  <div className="font-bold text-white">{m.group}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-400">Contoh Molekul</div>
                  <div className="font-bold text-white">{m.example}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-400">Tata Nama (IUPAC)</div>
                  <div className="font-bold text-white">Akhiran <span className="font-mono bg-black/50 px-1 rounded text-yellow-400">{m.suffix}</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Gugus Fungsi</strong> adalah atom atau kelompok atom yang memberikan sifat kimia khas pada suatu senyawa organik.</p>
            <p>Bagian yang menyala melingkar pada visualisasi adalah <em>pusat kereaktifan</em> dari senyawa tersebut!</p>
          </div>

        </div>
      </div>
    </div>
  );
}
