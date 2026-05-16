"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Dna, 
  Zap, 
  Wind, 
  Box, 
  Shield, 
  Activity, 
  ChevronLeft,
  Info,
  Layers,
  Leaf,
  Dog
} from "lucide-react";
import Link from "next/link";

// --- Types ---
type CellType = "animal" | "plant";

type Organelle = {
  id: string;
  name: string;
  analogy: string;
  desc: string;
  type: "both" | "animal" | "plant";
  color: string;
  icon: React.ReactNode;
  shape: string;
  position: { x: string; y: string };
  size: string;
};

// --- Data ---
const ORGANELLES: Organelle[] = [
  {
    id: "nucleus",
    name: "Nukleus (Inti Sel)",
    analogy: "Otak / Pusat Komando",
    desc: "Menyimpan informasi genetik (DNA) dan mengontrol seluruh aktivitas sel, mulai dari pertumbuhan hingga reproduksi.",
    type: "both",
    color: "bg-indigo-500",
    icon: <Dna className="w-5 h-5 text-indigo-200" />,
    shape: "rounded-full",
    position: { x: "50%", y: "45%" },
    size: "w-28 h-28"
  },
  {
    id: "mitochondria",
    name: "Mitokondria",
    analogy: "Pembangkit Listrik",
    desc: "Tempat respirasi seluler yang mengubah nutrisi menjadi energi (ATP) yang dibutuhkan sel untuk beraktivitas.",
    type: "both",
    color: "bg-orange-500",
    icon: <Zap className="w-4 h-4 text-orange-200" />,
    shape: "rounded-[40%_60%_70%_30%]",
    position: { x: "25%", y: "60%" },
    size: "w-16 h-10"
  },
  {
    id: "chloroplast",
    name: "Kloroplas",
    analogy: "Panel Surya",
    desc: "Hanya pada tumbuhan. Mengandung klorofil untuk menangkap cahaya matahari dan melakukan fotosintesis menghasilkan makanan.",
    type: "plant",
    color: "bg-emerald-500",
    icon: <Leaf className="w-4 h-4 text-emerald-200" />,
    shape: "rounded-[30%_70%_40%_60%]",
    position: { x: "75%", y: "30%" },
    size: "w-16 h-12"
  },
  {
    id: "ribosome",
    name: "Ribosom",
    analogy: "Pabrik Protein",
    desc: "Partikel kecil tempat sintesis protein dilakukan berdasarkan instruksi dari kode genetik.",
    type: "both",
    color: "bg-pink-500",
    icon: <Activity className="w-3 h-3 text-pink-200" />,
    shape: "rounded-full",
    position: { x: "65%", y: "25%" },
    size: "w-4 h-4"
  },
  {
    id: "golgi",
    name: "Badan Golgi",
    analogy: "Pusat Logistik / JNE",
    desc: "Menyortir, memproses, dan mengemas protein untuk dikirim ke tujuan akhirnya di dalam atau luar sel.",
    type: "both",
    color: "bg-amber-400",
    icon: <Box className="w-4 h-4 text-amber-900" />,
    shape: "rounded-lg skew-x-12",
    position: { x: "70%", y: "65%" },
    size: "w-16 h-8"
  },
  {
    id: "vacuole-plant",
    name: "Vakuola Besar",
    analogy: "Tangki Air / Gudang",
    desc: "Pada tumbuhan, vakuola sangat besar untuk menyimpan air dan menjaga tekanan sel agar tetap tegak.",
    type: "plant",
    color: "bg-sky-400/40",
    icon: <Layers className="w-5 h-5 text-sky-200" />,
    shape: "rounded-[20%_80%_80%_20%]",
    position: { x: "40%", y: "65%" },
    size: "w-40 h-32"
  },
  {
    id: "cell-wall",
    name: "Dinding Sel",
    analogy: "Benteng / Pagar Besi",
    desc: "Struktur kaku di luar membran sel tumbuhan yang memberikan dukungan mekanis dan perlindungan.",
    type: "plant",
    color: "bg-emerald-800/40",
    icon: <Shield className="w-4 h-4 text-emerald-200" />,
    shape: "rounded-[10px]",
    position: { x: "50%", y: "50%" },
    size: "w-[98%] h-[98%]"
  },
  {
    id: "membrane",
    name: "Membran Sel",
    analogy: "Satpam / Gerbang Tol",
    desc: "Lapisan tipis yang mengelilingi sel, mengatur keluar masuknya zat agar kondisi sel tetap stabil.",
    type: "both",
    color: "bg-emerald-500/10",
    icon: <Shield className="w-4 h-4 text-emerald-200" />,
    shape: "rounded-[40%]",
    position: { x: "50%", y: "50%" },
    size: "w-[92%] h-[92%]"
  }
];

export default function SelOrganel() {
  const [cellType, setCellType] = useState<CellType>("animal");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredOrganelles = useMemo(() => {
    const list = ORGANELLES.filter(o => o.type === "both" || o.type === cellType);
    // Sort so structural elements (large ones) are rendered first (back)
    const orderMap: Record<string, number> = {
      "cell-wall": 0,
      "membrane": 1,
      "vacuole-plant": 2,
      "nucleus": 3,
      "golgi": 4,
      "mitochondria": 5,
      "chloroplast": 6,
      "ribosome": 7
    };
    return [...list].sort((a, b) => (orderMap[a.id] ?? 5) - (orderMap[b.id] ?? 5));
  }, [cellType]);

  const activeOrganelle = useMemo(() => 
    ORGANELLES.find(o => o.id === (selectedId || hoveredId))
  , [selectedId, hoveredId]);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#050505] text-zinc-300 overflow-hidden font-sans">
      
      {/* --- Left Sidebar: Info & Selection --- */}
      <div className="w-full lg:w-[400px] flex flex-col border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl z-20 overflow-y-auto no-scrollbar">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/simulasi" className="p-2 hover:bg-white/5 rounded-xl border border-white/10 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Anatomi Sel</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">Eksplorasi Unit Kehidupan</p>
            </div>
          </div>

          {/* Cell Type Toggle */}
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
            <button 
              onClick={() => { setCellType("animal"); setSelectedId(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${cellType === "animal" ? "bg-indigo-500 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              <Dog className="w-4 h-4" /> Sel Hewan
            </button>
            <button 
              onClick={() => { setCellType("plant"); setSelectedId(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${cellType === "plant" ? "bg-emerald-500 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              <Leaf className="w-4 h-4" /> Sel Tumbuhan
            </button>
          </div>
        </div>

        {/* Details Panel */}
        <div className="flex-1 p-8 space-y-8">
           <AnimatePresence mode="wait">
             {activeOrganelle ? (
               <motion.div 
                 key={activeOrganelle.id}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-6"
               >
                 <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl ${activeOrganelle.color} border border-white/20`}>
                      {activeOrganelle.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white tracking-tight leading-tight">{activeOrganelle.name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Activity className="w-3 h-3 text-indigo-400" />
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{activeOrganelle.analogy}</span>
                      </div>
                    </div>
                 </div>

                 <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {activeOrganelle.desc}
                    </p>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                       <span className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Terdapat di</span>
                       <span className="text-xs font-bold text-white uppercase">{activeOrganelle.type === 'both' ? 'Hewan & Tumbuhan' : activeOrganelle.type}</span>
                    </div>
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                       <span className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Status</span>
                       <span className="text-xs font-bold text-emerald-400 uppercase">Aktif</span>
                    </div>
                 </div>
               </motion.div>
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
                    <Layers className="w-10 h-10 text-zinc-700" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-500">Pilih Organel</h3>
                  <p className="text-xs text-zinc-600 max-w-[200px] mt-2">
                    Gunakan mikroskop untuk mengeksplorasi struktur internal sel.
                  </p>
               </div>
             )}
           </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="p-8 border-t border-white/5 bg-black/20">
           <div className="flex items-center gap-3 text-indigo-400 mb-4">
              <Info className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Informasi Tambahan</span>
           </div>
           <p className="text-[10px] text-zinc-500 leading-relaxed italic">
             {cellType === "animal" 
               ? "Sel hewan cenderung berbentuk bulat tidak beraturan karena tidak memiliki dinding sel yang kaku."
               : "Sel tumbuhan memiliki bentuk tetap dan kaku berkat adanya dinding sel dan vakuola pusat yang besar."}
           </p>
        </div>
      </div>

      {/* --- Center: Simulation Area --- */}
      <div className="flex-1 relative flex items-center justify-center p-12 bg-[#080808] overflow-hidden">
        
        {/* Environment Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-[120px] rounded-full transition-colors duration-1000 ${cellType === 'animal' ? 'bg-indigo-500/5' : 'bg-emerald-500/5'}`} />
        </div>

        {/* Cell Container */}
        <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
           
           {/* Cell Cytoplasm (Fluid Backdrop) */}
           <motion.div 
             animate={{ 
               scale: [1, 1.02, 1],
               borderRadius: cellType === "animal" ? ["40%", "45%", "40%"] : ["10%", "12%", "10%"]
             }}
             transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
             className={`absolute inset-4 transition-all duration-1000 ${cellType === 'animal' ? 'bg-indigo-950/20 border-4 border-indigo-500/5' : 'bg-emerald-950/20 border-4 border-emerald-500/5'}`}
           />

           {/* Organelles Layout */}
           <div className="relative w-full h-full">
              {filteredOrganelles.map((org, index) => (
                <motion.button
                  key={org.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onMouseEnter={() => setHoveredId(org.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => setSelectedId(org.id)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${org.size} ${org.shape} ${org.color} border border-white/10 shadow-2xl flex items-center justify-center group
                    ${(selectedId === org.id || hoveredId === org.id) ? "ring-2 ring-white/50 z-50" : "opacity-80 hover:opacity-100"}
                  `}
                  style={{ 
                    left: org.position.x, 
                    top: org.position.y,
                    zIndex: (selectedId === org.id || hoveredId === org.id) ? 100 : index 
                  }}
                >
                   {/* Tooltip on Hover */}
                   <AnimatePresence>
                     {hoveredId === org.id && (
                       <motion.div 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="absolute -top-12 bg-white text-black text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl z-[110]"
                       >
                         {org.name}
                       </motion.div>
                     )}
                   </AnimatePresence>
                   
                   {/* Particle Ambience inside organelles */}
                   <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                      <div className="w-full h-full animate-pulse bg-gradient-to-br from-white/20 to-transparent" />
                   </div>
                </motion.button>
              ))}

              {/* Floating Cytoplasm Particles */}
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ 
                    x: [0, (Math.random() - 0.5) * 100, 0],
                    y: [0, (Math.random() - 0.5) * 100, 0],
                    opacity: [0.1, 0.3, 0.1]
                  }}
                  transition={{ duration: 10 + Math.random() * 10, repeat: Infinity }}
                  className={`absolute w-1 h-1 rounded-full pointer-events-none ${cellType === 'animal' ? 'bg-indigo-400' : 'bg-emerald-400'}`}
                  style={{ 
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                    zIndex: 2
                  }}
                />
              ))}
           </div>
        </div>

        {/* Interaction Hint */}
        <div className="absolute bottom-10 px-8 py-3 bg-white/5 backdrop-blur-xl border border-white/5 rounded-full flex items-center gap-3 text-zinc-500">
           <Activity className="w-4 h-4 animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-widest">Klik organel untuk bedah fungsinya</span>
        </div>
      </div>

    </div>
  );
}
