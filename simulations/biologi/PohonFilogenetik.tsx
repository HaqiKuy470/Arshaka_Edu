"use client";

import { useState } from "react";

export default function PohonFilogenetik() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Data represents a simplified evolutionary tree (Cladogram)
  const treeData = [
    { id: "vertebrata", name: "Vertebrata (Bertulang Belakang)", desc: "Nenek moyang awal yang memiliki tulang punggung.", trait: "Tulang Belakang" },
    { id: "ikan", name: "Ikan (Pisces)", desc: "Bernapas dengan insang, hidup di air penuh.", trait: "Insang, Sirip" },
    { id: "tetrapoda", name: "Tetrapoda (Berkaki Empat)", desc: "Nenek moyang hewan darat pertama yang memiliki 4 anggota gerak.", trait: "Empat Anggota Gerak" },
    { id: "amfibi", name: "Amfibi", desc: "Bisa hidup di air dan darat, namun telur tidak bercangkang keras.", trait: "Metamorfosis, Kulit Lembab" },
    { id: "amniota", name: "Amniota", desc: "Bertelur dengan cangkang / selaput amnion. Bisa berkembang biak murni di darat.", trait: "Telur Amnion" },
    { id: "reptil", name: "Reptil & Burung", desc: "Bulu pada burung sebenarnya adalah evolusi dari sisik reptil.", trait: "Sisik / Bulu" },
    { id: "mamalia", name: "Mamalia", desc: "Hewan yang memiliki kelenjar susu dan rambut.", trait: "Rambut, Kelenjar Susu" },
  ];

  const getNodeData = (id: string) => treeData.find(t => t.id === id);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        {/* Tree Canvas/HTML */}
        <div className="relative w-full max-w-4xl h-[600px]">
          
          {/* Base Trunk */}
          <div className="absolute bottom-0 left-8 w-4 h-32 bg-emerald-700 rounded-t-lg" />
          <div 
            onClick={() => setSelectedNode("vertebrata")}
            className="absolute bottom-32 left-0 w-20 p-2 text-center text-[10px] font-bold bg-emerald-900 border border-emerald-500 rounded cursor-pointer hover:bg-emerald-700 transition-colors"
          >
            Leluhur Bersama
          </div>

          {/* Branch to Fish */}
          <div className="absolute bottom-[160px] left-10 w-24 h-2 bg-emerald-600 origin-left -rotate-45" />
          <div 
            onClick={() => setSelectedNode("ikan")}
            className="absolute bottom-[230px] left-28 p-2 bg-blue-900 border border-blue-500 rounded-xl font-bold cursor-pointer hover:bg-blue-800 transition-colors"
          >
            🐟 Ikan
          </div>

          {/* Main stem continues (Tetrapod trait) */}
          <div className="absolute bottom-[160px] left-[42px] w-4 h-32 bg-emerald-600 rounded-t-lg" />
          <div className="absolute bottom-[220px] left-[55px] text-xs font-bold text-amber-500 bg-black/50 px-2 rounded">+ 4 Kaki</div>

          {/* Branch to Amphibian */}
          <div className="absolute bottom-[280px] left-[44px] w-24 h-2 bg-emerald-500 origin-left -rotate-45" />
          <div 
            onClick={() => setSelectedNode("amfibi")}
            className="absolute bottom-[350px] left-24 p-2 bg-teal-900 border border-teal-500 rounded-xl font-bold cursor-pointer hover:bg-teal-800 transition-colors"
          >
            🐸 Amfibi
          </div>

          {/* Main stem continues (Amniote trait) */}
          <div className="absolute bottom-[280px] left-[44px] w-4 h-32 bg-emerald-500 rounded-t-lg" />
          <div className="absolute bottom-[340px] left-[55px] text-xs font-bold text-amber-500 bg-black/50 px-2 rounded">+ Telur Amnion</div>

          {/* Branch to Reptiles/Birds */}
          <div className="absolute bottom-[400px] left-[46px] w-32 h-2 bg-emerald-400 origin-left -rotate-45" />
          <div 
            onClick={() => setSelectedNode("reptil")}
            className="absolute bottom-[490px] left-32 p-2 bg-red-900 border border-red-500 rounded-xl font-bold cursor-pointer hover:bg-red-800 transition-colors"
          >
            🦎 Reptil & 🦅 Burung
          </div>

          {/* Branch to Mammals (Hair trait) */}
          <div className="absolute bottom-[400px] left-[46px] w-4 h-24 bg-emerald-400 rounded-t-lg" />
          <div className="absolute bottom-[440px] left-[55px] text-xs font-bold text-amber-500 bg-black/50 px-2 rounded">+ Rambut & Susu</div>
          
          <div 
            onClick={() => setSelectedNode("mamalia")}
            className="absolute bottom-[500px] left-[16px] p-2 bg-orange-900 border border-orange-500 rounded-xl font-bold cursor-pointer hover:bg-orange-800 transition-colors"
          >
            🐒 Mamalia
          </div>

          {/* Trait indicator logic lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 100 100">
             <line x1="10" y1="90" x2="90" y2="90" stroke="white" strokeWidth="0.5" strokeDasharray="2,2"/>
             <text x="95" y="91" fill="white" fontSize="2">WAKTU (Jutaan Tahun Lalu ➔ Masa Kini)</text>
          </svg>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Pohon Filogenetik (Kladogram)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          {selectedNode ? (
            <div className="bg-emerald-950/50 p-4 rounded-2xl border border-emerald-500/50 space-y-4 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <h4 className="text-xl font-bold text-white">{getNodeData(selectedNode)?.name}</h4>
              
              <div className="bg-black/40 p-3 rounded-lg">
                <div className="text-[10px] text-emerald-400 font-bold uppercase mb-1">Ciri Khas Baru (Derivasi)</div>
                <div className="font-bold text-amber-400">{getNodeData(selectedNode)?.trait}</div>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed">
                {getNodeData(selectedNode)?.desc}
              </p>
            </div>
          ) : (
            <div className="text-center p-8 bg-white/5 rounded-xl border border-white/10 border-dashed text-zinc-500 font-bold">
              Klik salah satu cabang pada pohon untuk melihat detail evolusinya.
            </div>
          )}

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Pohon Filogenetik</strong> menunjukkan hubungan kekerabatan antar makhluk hidup berdasarkan sejarah evolusi.</p>
            <p>Titik percabangan (Node) merepresentasikan <strong>Nenek Moyang Bersama</strong> (Common Ancestor).</p>
            <p className="text-yellow-400">Semakin dekat titik cabangnya, semakin dekat hubungan kekerabatan kedua spesies tersebut!</p>
          </div>

        </div>
      </div>
    </div>
  );
}
