"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft,
  Crown,
  Map,
  Clock,
  Zap,
  ArrowRight,
  TrendingUp,
  Globe,
  Info,
  History,
  Compass,
  Scroll,
  MousePointer2,
  Gem
} from "lucide-react";
import Link from "next/link";

// --- Types ---
type ReligionType = "Hindu" | "Buddha" | "Hindu-Buddha" | "Islam";

type Kingdom = {
  id: string;
  name: string;
  religion: ReligionType;
  location: string;
  century: number;
  centuryLabel: string;
  leader: string;
  description: string;
  legacy: string;
  color: string;
  pos: { x: number; y: number };
};

// --- Data ---
const KINGDOMS: Kingdom[] = [
  {
    id: "kutai",
    name: "Kerajaan Kutai",
    religion: "Hindu",
    location: "Kalimantan Timur (Sungai Mahakam)",
    century: 4,
    centuryLabel: "Abad ke-4 M",
    leader: "Raja Mulawarman",
    description: "Kerajaan tertua di Nusantara. Mulawarman terkenal sangat dermawan dengan menyumbangkan 20.000 ekor sapi kepada kaum Brahmana.",
    legacy: "7 Prasasti Yupa (Huruf Pallawa, Bahasa Sanskerta).",
    color: "bg-amber-600",
    pos: { x: 60, y: 35 }
  },
  {
    id: "tarumanegara",
    name: "Kerajaan Tarumanegara",
    religion: "Hindu",
    location: "Jawa Barat (Sungai Citarum)",
    century: 5,
    centuryLabel: "Abad ke-5 M",
    leader: "Raja Purnawarman",
    description: "Purnawarman membangun proyek irigasi Sungai Gomati sepanjang 11 km untuk mencegah banjir dan memajukan pertanian.",
    legacy: "Prasasti Ciaruteun (Tapak Kaki Dewa Wisnu).",
    color: "bg-orange-500",
    pos: { x: 35, y: 65 }
  },
  {
    id: "sriwijaya",
    name: "Kedatuan Sriwijaya",
    religion: "Buddha",
    location: "Sumatra Selatan (Palembang)",
    century: 7,
    centuryLabel: "Abad ke-7 - 13 M",
    leader: "Dapunta Hyang / Balaputradewa",
    description: "Kerajaan maritim terbesar yang menguasai jalur perdagangan Selat Malaka dan menjadi pusat pendidikan Buddha se-Asia Tenggara.",
    legacy: "Prasasti Kedukan Bukit, Penguasaan Jalur Sutra Laut.",
    color: "bg-emerald-500",
    pos: { x: 25, y: 55 }
  },
  {
    id: "mataram",
    name: "Mataram Kuno",
    religion: "Hindu-Buddha",
    location: "Jawa Tengah (Medang)",
    century: 8,
    centuryLabel: "Abad ke-8 - 10 M",
    leader: "Rakai Panangkaran",
    description: "Puncak kerukunan beragama. Wangsa Sanjaya (Hindu) dan Syailendra (Buddha) membangun candi-candi megah berdampingan.",
    legacy: "Candi Borobudur & Candi Prambanan.",
    color: "bg-indigo-500",
    pos: { x: 45, y: 70 }
  },
  {
    id: "majapahit",
    name: "Kemaharajaan Majapahit",
    religion: "Hindu-Buddha",
    location: "Jawa Timur (Trowulan)",
    century: 13,
    centuryLabel: "Abad ke-13 - 15 M",
    leader: "Hayam Wuruk & Gajah Mada",
    description: "Kemaharajaan terbesar yang menyatukan seluruh Nusantara. Terkenal dengan Sumpah Palapa Gajah Mada untuk menyatukan kepulauan.",
    legacy: "Kitab Negarakertagama, Wilayah Kekuasaan Seluruh Nusantara.",
    color: "bg-rose-600",
    pos: { x: 55, y: 72 }
  },
  {
    id: "samudera-pasai",
    name: "Samudera Pasai",
    religion: "Islam",
    location: "Aceh Utara",
    century: 13,
    centuryLabel: "Abad ke-13 M",
    leader: "Sultan Malik as-Saleh",
    description: "Kerajaan Islam pertama di Nusantara. Menjadi pusat perdagangan lada dan pintu masuk utama penyebaran Islam dari Gujarat.",
    legacy: "Dirham (Mata Uang Emas), Penyebaran Islam di Sumatera.",
    color: "bg-teal-600",
    pos: { x: 10, y: 30 }
  },
  {
    id: "demak",
    name: "Kesultanan Demak",
    religion: "Islam",
    location: "Jawa Tengah (Demak)",
    century: 15,
    centuryLabel: "Abad ke-15 M",
    leader: "Raden Patah",
    description: "Kesultanan Islam pertama di Pulau Jawa yang didirikan atas dukungan Wali Songo, sekaligus menggantikan hegemoni Majapahit.",
    legacy: "Masjid Agung Demak, Peran Wali Songo.",
    color: "bg-emerald-600",
    pos: { x: 48, y: 68 }
  },
  {
    id: "ternate-tidore",
    name: "Ternate & Tidore",
    religion: "Islam",
    location: "Maluku Utara",
    century: 15,
    centuryLabel: "Abad ke-15 M",
    leader: "Sultan Baabullah",
    description: "Penguasa 'Spice Islands' (Kepulauan Rempah). Menjadi rebutan bangsa Eropa karena kekayaan cengkeh dan palanya.",
    legacy: "Benteng Kalamata, Eksistensi Jalur Rempah Dunia.",
    color: "bg-amber-500",
    pos: { x: 85, y: 45 }
  }
];

export default function KerajaanNusantara() {
  const [activeId, setActiveId] = useState<string>("majapahit");
  const [timelineCentury, setTimelineCentury] = useState(15);

  const activeKingdom = useMemo(() => 
    KINGDOMS.find(k => k.id === activeId)!
  , [activeId]);

  const visibleKingdoms = useMemo(() => 
    KINGDOMS.filter(k => k.century <= timelineCentury)
  , [timelineCentury]);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#050505] text-zinc-300 overflow-hidden font-sans">
      
      {/* --- Left Sidebar: Royal Archives --- */}
      <div className="w-full lg:w-[400px] flex flex-col border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl z-20 overflow-y-auto no-scrollbar">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/simulasi" className="p-2 hover:bg-white/5 rounded-xl border border-white/10 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight leading-tight">Kerajaan Nusantara</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">Arsip Sejarah Indonesia</p>
            </div>
          </div>

          {/* Timeline Slider */}
          <div className="space-y-4">
             <div className="flex justify-between items-end px-1">
                <div className="flex items-center gap-2 text-zinc-500">
                   <Clock className="w-3 h-3" />
                   <span className="text-[9px] font-black uppercase tracking-widest">Garis Waktu (Abad)</span>
                </div>
                <span className="text-lg font-black text-white">Abad ke-{timelineCentury}</span>
             </div>
             <input 
               type="range" min="4" max="15" step="1" 
               value={timelineCentury} onChange={(e) => setTimelineCentury(parseInt(e.target.value))}
               className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-amber-500"
             />
             <div className="flex justify-between text-[8px] font-black text-zinc-600 uppercase tracking-widest">
               <span>Kutai (4M)</span>
               <span>Majapahit (15M)</span>
             </div>
          </div>
        </div>

        {/* Detailed Info Panel */}
        <div className="flex-1 p-8 space-y-8">
           <AnimatePresence mode="wait">
             <motion.div 
               key={activeKingdom.id}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="space-y-6"
             >
               <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl ${activeKingdom.color} border border-white/20 text-white`}>
                    <Crown className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight leading-none mb-1">{activeKingdom.name}</h2>
                    <div className="flex items-center gap-2">
                      <Gem className="w-3 h-3 text-zinc-500" />
                      <span className={`text-[9px] font-black uppercase tracking-widest ${activeKingdom.color.replace('bg-', 'text-')}`}>Corak {activeKingdom.religion}</span>
                    </div>
                  </div>
               </div>

               <div className="p-6 bg-white/5 rounded-[32px] border border-white/5 space-y-4">
                  <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                    {activeKingdom.description}
                  </p>
                  <div className="pt-4 border-t border-white/5">
                     <span className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Peninggalan Utama:</span>
                     <p className="text-xs font-bold text-zinc-200">{activeKingdom.legacy}</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center gap-3 text-amber-400 px-2">
                     <Scroll className="w-4 h-4" />
                     <h3 className="text-[10px] font-black uppercase tracking-widest">Tokoh Penting:</h3>
                  </div>
                  <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                     <p className="text-sm font-black text-white uppercase tracking-wider italic">
                       {activeKingdom.leader}
                     </p>
                  </div>
               </div>

               <div className="p-6 bg-gradient-to-br from-zinc-900 to-transparent rounded-[32px] border border-white/5 flex items-center justify-between">
                  <div>
                     <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Pusat Wilayah:</span>
                     <span className="text-[10px] font-bold text-white uppercase tracking-tight">{activeKingdom.location}</span>
                  </div>
                  <Compass className="w-6 h-6 text-zinc-800" />
               </div>
             </motion.div>
           </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="p-8 border-t border-white/5 bg-black/20 mt-auto">
           <div className="flex items-center gap-3 text-zinc-500 mb-4">
              <TrendingUp className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Dinamika Nusantara</span>
           </div>
           <p className="text-[9px] text-zinc-600 leading-relaxed uppercase tracking-wider font-bold">
             Nusantara adalah pusat peradaban maritim dunia yang menghubungkan jalur perdagangan timur dan barat.
           </p>
        </div>
      </div>

      {/* --- Center: Simulation Area --- */}
      <div className="flex-1 relative flex items-center justify-center p-12 bg-[#080808] overflow-hidden">
        
        {/* Environment Aura */}
        <div className="absolute inset-0 pointer-events-none">
           <AnimatePresence>
              <motion.div 
                key={activeId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`absolute inset-0 bg-gradient-to-b ${activeKingdom.color.replace('bg-', 'from-')}/10 to-transparent`}
              />
           </AnimatePresence>
        </div>

        {/* Archipelago Map Container */}
        <div className="relative w-full max-w-5xl aspect-[2/1] bg-zinc-900/40 rounded-[48px] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-sm">
           
           {/* Abstract Map Background (SVG) */}
           <svg viewBox="0 0 1000 500" className="w-full h-full opacity-20" preserveAspectRatio="none">
              {/* Sumatra */}
              <path d="M 50 150 Q 150 200 250 350 Q 200 400 100 250 Z" fill="#64748b" />
              {/* Java */}
              <path d="M 280 380 Q 400 400 600 420 Q 550 450 300 420 Z" fill="#64748b" />
              {/* Kalimantan */}
              <path d="M 350 150 Q 500 50 650 200 Q 550 300 400 250 Z" fill="#64748b" />
              {/* Sulawesi */}
              <path d="M 680 200 L 750 150 L 780 250 L 700 350 Z" fill="#64748b" />
              {/* Papua */}
              <path d="M 850 300 Q 950 250 1000 350 Q 900 450 850 400 Z" fill="#64748b" />
              {/* Spice Route Line */}
              <motion.path 
                d="M0 200 Q 200 250 400 300 Q 600 350 1000 300" 
                fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" strokeDasharray="10 10"
                animate={{ strokeDashoffset: [0, -100] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
           </svg>

           {/* Interactive Kingdom Markers */}
           <div className="absolute inset-0 pointer-events-none">
              {visibleKingdoms.map(kingdom => {
                const isActive = activeId === kingdom.id;
                return (
                  <motion.button
                    key={kingdom.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    onClick={() => setActiveId(kingdom.id)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`absolute group pointer-events-auto z-30 transition-all duration-300
                      ${isActive ? `${kingdom.color} shadow-[0_0_30px_rgba(255,255,255,0.3)] scale-125` : "bg-white/10 backdrop-blur-md border border-white/20"}
                      rounded-full p-3
                    `}
                    style={{ top: `${kingdom.pos.y}%`, left: `${kingdom.pos.x}%` }}
                  >
                     <div className={isActive ? "text-white" : "text-zinc-400 group-hover:text-white"}>
                        {kingdom.religion === "Hindu" ? "🛕" : kingdom.religion === "Buddha" ? "☸️" : kingdom.religion === "Hindu-Buddha" ? "🕉️" : "🕌"}
                     </div>
                     
                     {/* Pulsing Aura if active */}
                     {isActive && (
                       <motion.div 
                         animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                         transition={{ duration: 2, repeat: Infinity }}
                         className={`absolute inset-0 rounded-full ${kingdom.color}`}
                       />
                     )}

                     {/* Label on Hover */}
                     <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white text-black text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-2xl">
                        {kingdom.name}
                     </div>
                  </motion.button>
                );
              })}
           </div>

           {/* Chronology Header Overlay */}
           <div className="absolute top-10 left-10 flex items-center gap-4 bg-black/40 backdrop-blur-xl border border-white/5 p-4 px-6 rounded-full shadow-2xl">
              <div className={`w-3 h-3 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_currentColor]`} />
              <div>
                 <span className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Nusantara Chronology Active</span>
                 <h3 className="text-sm font-black text-white uppercase tracking-tight">Abad ke-{timelineCentury} M</h3>
              </div>
           </div>
        </div>

        {/* Interaction Hint */}
        <div className="absolute bottom-12 px-8 py-3 bg-white/5 backdrop-blur-xl border border-white/5 rounded-full flex items-center gap-3 text-zinc-500 shadow-2xl">
           <MousePointer2 className="w-4 h-4 animate-bounce text-indigo-400" />
           <span className="text-[10px] font-black uppercase tracking-widest">Gunakan Slider Garis Waktu untuk Melihat Kejayaan Kerajaan Nusantara</span>
        </div>
      </div>

    </div>
  );
}
