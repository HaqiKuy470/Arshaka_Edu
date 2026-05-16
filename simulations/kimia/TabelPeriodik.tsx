"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  Atom,
  Search,
  Zap,
  Info,
  RefreshCcw,
  Waves,
  Wind,
  Box,
  Settings,
  X
} from "lucide-react";

interface Element {
  n: number;
  sym: string;
  name: string;
  cat: string;
  row: number;
  col: number;
  mass: number;
  config: string;
  shells: number[];
  state: "gas" | "liquid" | "solid";
  desc: string;
}

const ELEMENTS: Element[] = [
  { n: 1, sym: 'H', name: `Hidrogen`, cat: 'nonmetal', row: 1, col: 1, mass: 1.008, config: '1s1', shells: [1], state: 'gas', desc: `Hidrogen adalah unsur teringan dan paling melimpah di alam semesta. Pada kondisi standar, ia berupa gas diatomik yang tidak berwarna dan tidak berbau.` },
  { n: 2, sym: 'He', name: `Helium`, cat: 'noble', row: 1, col: 18, mass: 4.0026, config: '1s2', shells: [2], state: 'gas', desc: `Helium adalah gas mulia yang tidak berwarna, tidak berbau, dan tidak berasa. Ini adalah unsur kedua teringan dan kedua paling melimpah di alam semesta.` },
  { n: 3, sym: 'Li', name: `Litium`, cat: 'alkali', row: 2, col: 1, mass: 6.94, config: '1s2 2s1', shells: [2, 1], state: 'solid', desc: `Litium adalah logam alkali lunak berwarna putih perak. Ini adalah logam teringan dan elemen padat paling tidak padat.` },
  { n: 4, sym: 'Be', name: `Berilium`, cat: 'alkaline', row: 2, col: 2, mass: 9.012, config: '1s2 2s2', shells: [2, 2], state: 'solid', desc: `Berilium adalah logam alkali tanah yang kuat, ringan, dan memiliki titik leleh yang tinggi. Digunakan dalam berbagai aplikasi industri dan luar angkasa.` },
  { n: 5, sym: 'B', name: `Boron`, cat: 'metalloid', row: 2, col: 13, mass: 10.81, config: '1s2 2s2 2p1', shells: [2, 3], state: 'solid', desc: `Boron adalah metaloid yang ditemukan dalam senyawa borat. Memiliki struktur kristal yang sangat keras dan tahan panas.` },
  { n: 6, sym: 'C', name: `Karbon`, cat: 'nonmetal', row: 2, col: 14, mass: 12.011, config: '1s2 2s2 2p2', shells: [2, 4], state: 'solid', desc: `Karbon adalah dasar dari semua kehidupan organik. Memiliki kemampuan unik untuk membentuk ikatan kimia yang kompleks.` },
  { n: 7, sym: 'N', name: `Nitrogen`, cat: 'nonmetal', row: 2, col: 15, mass: 14.007, config: '1s2 2s2 2p3', shells: [2, 5], state: 'gas', desc: `Nitrogen membentuk sekitar 78% atmosfer Bumi. Merupakan komponen penting dalam protein dan asam nukleat.` },
  { n: 8, sym: 'O', name: `Oksigen`, cat: 'nonmetal', row: 2, col: 16, mass: 15.999, config: '1s2 2s2 2p4', shells: [2, 6], state: 'gas', desc: `Oksigen sangat penting untuk pernapasan sebagian besar makhluk hidup. Merupakan agen pengoksidasi yang kuat.` },
  { n: 9, sym: 'F', name: `Fluor`, cat: 'nonmetal', row: 2, col: 17, mass: 18.998, config: '1s2 2s2 2p5', shells: [2, 7], state: 'gas', desc: `Fluor adalah halogen yang paling reaktif dan elektronegatif. Membentuk senyawa dengan hampir semua elemen lainnya.` },
  { n: 10, sym: 'Ne', name: `Neon`, cat: 'noble', row: 2, col: 18, mass: 20.180, config: '1s2 2s2 2p6', shells: [2, 8], state: 'gas', desc: `Neon adalah gas mulia yang dikenal karena cahaya kemerahannya saat digunakan dalam tabung pembuangan gas.` },
  { n: 11, sym: 'Na', name: `Natrium`, cat: 'alkali', row: 3, col: 1, mass: 22.990, config: '[Ne] 3s1', shells: [2, 8, 1], state: 'solid', desc: `Natrium adalah logam alkali yang sangat reaktif. Ditemukan secara melimpah dalam garam meja sebagai natrium klorida.` },
  { n: 12, sym: 'Mg', name: `Magnesium`, cat: 'alkaline', row: 3, col: 2, mass: 24.305, config: '[Ne] 3s2', shells: [2, 8, 2], state: 'solid', desc: `Magnesium adalah logam yang ringan dan kuat. Penting untuk banyak proses biologis dalam tubuh manusia.` },
  { n: 13, sym: 'Al', name: `Aluminium`, cat: 'transition', row: 3, col: 13, mass: 26.982, config: '[Ne] 3s2 3p1', shells: [2, 8, 3], state: 'solid', desc: `Aluminium adalah logam pasca-transisi yang tahan korosi dan ringan. Unsur paling melimpah ketiga di kerak Bumi.` },
  { n: 14, sym: 'Si', name: `Silikon`, cat: 'metalloid', row: 3, col: 14, mass: 28.085, config: '[Ne] 3s2 3p2', shells: [2, 8, 4], state: 'solid', desc: `Silikon adalah metaloid semikonduktor yang merupakan dasar dari sebagian besar perangkat elektronik modern.` },
  { n: 15, sym: 'P', name: `Fosfor`, cat: 'nonmetal', row: 3, col: 15, mass: 30.974, config: '[Ne] 3s2 3p3', shells: [2, 8, 5], state: 'solid', desc: `Fosfor adalah non-logam yang penting dalam ATP dan membran sel. Memiliki beberapa bentuk alotropi seperti putih dan merah.` },
  { n: 16, sym: 'S', name: `Belerang`, cat: 'nonmetal', row: 3, col: 16, mass: 32.06, config: '[Ne] 3s2 3p4', shells: [2, 8, 6], state: 'solid', desc: `Belerang adalah non-logam berwarna kuning cerah. Digunakan secara luas dalam pembuatan asam sulfat.` },
  { n: 17, sym: 'Cl', name: `Klorin`, cat: 'nonmetal', row: 3, col: 17, mass: 35.45, config: '[Ne] 3s2 3p5', shells: [2, 8, 7], state: 'gas', desc: `Klorin adalah halogen yang digunakan sebagai disinfektan dan pemutih. Pada kondisi standar berupa gas kuning-hijau.` },
  { n: 18, sym: 'Ar', name: `Argon`, cat: 'noble', row: 3, col: 18, mass: 39.948, config: '[Ne] 3s2 3p6', shells: [2, 8, 8], state: 'gas', desc: `Argon adalah gas mulia ketiga paling melimpah di atmosfer Bumi. Digunakan dalam lampu pijar dan pengelasan.` },
];

const CAT_COLORS: Record<string, { label: string; color: string }> = {
  'nonmetal': { label: 'Non-Logam', color: '#4ade80' },
  'noble': { label: 'Gas Mulia', color: '#c084fc' },
  'alkali': { label: 'Alkali', color: '#f87171' },
  'alkaline': { label: 'Alkali Tanah', color: '#fb923c' },
  'metalloid': { label: 'Metaloid', color: '#facc15' },
  'transition': { label: 'Logam', color: '#94a3b8' },
  'unknown': { label: 'Lainnya', color: '#52525b' },
};

export default function TabelPeriodik() {
  const [selectedSym, setSelectedSym] = useState('H');
  const [filter, setFilter] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(true);

  const selected = useMemo(() => ELEMENTS.find(e => e.sym === selectedSym) || ELEMENTS[0], [selectedSym]);

  return (
    <div className="flex-1 flex flex-col lg:flex-row bg-[#050505] text-white relative overflow-hidden">
      
      {/* --- Main View: Table Area --- */}
      <div className="flex-1 flex flex-col overflow-hidden order-2 lg:order-1">
        
        {/* Category Filters (Scrollable) */}
        <div className="shrink-0 p-4 border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl flex gap-2 overflow-x-auto no-scrollbar">
           <button onClick={() => setFilter(null)} className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all shrink-0 ${!filter ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-zinc-500'}`}>Semua</button>
           {Object.entries(CAT_COLORS).map(([id, cfg]) => (
             <button key={id} onClick={() => setFilter(id)} className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all shrink-0 ${filter === id ? 'bg-white/10' : 'bg-white/5 border-white/5 text-zinc-500'}`} style={{ color: filter === id ? cfg.color : '', borderColor: filter === id ? cfg.color : '' }}>{cfg.label}</button>
           ))}
        </div>

        {/* Periodic Grid (Zoomable/Scrollable) */}
        <div className="flex-1 overflow-auto p-4 md:p-8 flex items-start justify-center">
           <div className="grid grid-cols-18 gap-1 md:gap-1.5 min-w-[700px] md:min-w-0">
              {Array.from({ length: 3 * 18 }).map((_, idx) => {
                 const r = Math.floor(idx / 18) + 1;
                 const c = (idx % 18) + 1;
                 const el = ELEMENTS.find(e => e.row === r && e.col === c);
                 
                 if (el) {
                   const isFiltered = filter && el.cat !== filter;
                   const isSelected = selectedSym === el.sym;
                   const cfg = CAT_COLORS[el.cat] || CAT_COLORS['unknown'];

                   return (
                     <button
                       key={el.sym}
                       onClick={() => setSelectedSym(el.sym)}
                       className={`aspect-square flex flex-col items-center justify-center rounded-lg border transition-all ${isSelected ? 'bg-white text-black ring-2 ring-white ring-offset-2 ring-offset-black scale-110 z-10' : 'bg-white/5 border-white/10'} ${isFiltered ? 'opacity-20 grayscale' : 'opacity-100'}`}
                       style={{ color: isSelected ? '' : cfg.color, borderColor: isSelected ? 'white' : '' }}
                     >
                        <span className="text-[6px] font-bold opacity-50 mb-0.5">{el.n}</span>
                        <span className="text-[11px] md:text-sm font-black">{el.sym}</span>
                     </button>
                   );
                 }
                 return <div key={idx} className="aspect-square" />;
              })}
           </div>
        </div>

        {/* Mobile Detail Toggle */}
        <button onClick={() => setShowDetails(!showDetails)} className="lg:hidden absolute bottom-6 right-6 p-4 bg-indigo-600 rounded-full shadow-2xl text-white z-40">
           {showDetails ? <X className="w-6 h-6" /> : <Settings className="w-6 h-6" />}
        </button>
      </div>

      {/* --- Sidebar: Element Details --- */}
      <AnimatePresence>
        {showDetails && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed inset-y-0 right-0 w-full sm:w-80 lg:relative lg:inset-auto lg:w-80 z-30 flex flex-col bg-zinc-950/95 backdrop-blur-3xl border-l border-white/5 overflow-y-auto"
          >
            <div className="p-8 space-y-8">
               <div className="text-center relative py-12">
                  <div className="absolute inset-0 bg-indigo-500/10 blur-[80px] rounded-full" style={{ backgroundColor: (CAT_COLORS[selected.cat] || CAT_COLORS['unknown']).color + '20' }} />
                  <div className="relative">
                    <span className="text-sm font-black text-white/20 font-mono absolute top-0 left-0">{selected.n}</span>
                    <h2 className="text-8xl font-black tracking-tighter" style={{ color: (CAT_COLORS[selected.cat] || CAT_COLORS['unknown']).color }}>{selected.sym}</h2>
                    <h3 className="text-2xl font-black text-white mt-2">{selected.name}</h3>
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mt-1">Massa: {selected.mass}</p>
                  </div>
               </div>

               {/* Stats */}
               <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                     <span className="text-[8px] text-zinc-500 uppercase font-black block mb-1">State</span>
                     <div className="flex items-center gap-2">
                        {selected.state === 'gas' ? <Wind className="w-3.5 h-3.5 text-blue-400" /> : <Box className="w-3.5 h-3.5 text-zinc-400" />}
                        <span className="text-xs font-bold capitalize">{selected.state}</span>
                     </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                     <span className="text-[8px] text-zinc-500 uppercase font-black block mb-1">Konfigurasi</span>
                     <span className="text-xs font-bold text-indigo-400">{selected.config}</span>
                  </div>
               </div>

               {/* Description */}
               <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-400">
                     <Info className="w-4 h-4" />
                     <span className="text-[9px] font-black uppercase tracking-widest">Wawasan</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed italic">"{selected.desc}"</p>
               </div>

               {/* Bohr Model Mini */}
               <div className="aspect-square w-full rounded-3xl bg-black/40 border border-white/5 flex items-center justify-center overflow-hidden">
                  <div className="relative w-full h-full scale-75">
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-indigo-500 shadow-[0_0_20px_indigo]" />
                        {selected.shells.map((count, i) => (
                           <div key={i} className="absolute border border-white/5 rounded-full" style={{ width: (i+1)*40, height: (i+1)*40 }} />
                        ))}
                     </div>
                  </div>
               </div>

               <button onClick={() => setSelectedSym('H')} className="w-full py-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest">
                  <RefreshCcw className="w-4 h-4" /> Reset Pilihan
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
