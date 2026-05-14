"use client";

import { useState } from "react";

const elements = [
  { n: 1, sym: 'H', name: 'Hydrogen', cat: 'nonmetal', row: 1, col: 1, mass: 1.008 },
  { n: 2, sym: 'He', name: 'Helium', cat: 'noble', row: 1, col: 18, mass: 4.002 },
  { n: 3, sym: 'Li', name: 'Lithium', cat: 'alkali', row: 2, col: 1, mass: 6.94 },
  { n: 4, sym: 'Be', name: 'Beryllium', cat: 'alkaline', row: 2, col: 2, mass: 9.012 },
  { n: 5, sym: 'B', name: 'Boron', cat: 'metalloid', row: 2, col: 13, mass: 10.81 },
  { n: 6, sym: 'C', name: 'Carbon', cat: 'nonmetal', row: 2, col: 14, mass: 12.011 },
  { n: 7, sym: 'N', name: 'Nitrogen', cat: 'nonmetal', row: 2, col: 15, mass: 14.007 },
  { n: 8, sym: 'O', name: 'Oxygen', cat: 'nonmetal', row: 2, col: 16, mass: 15.999 },
  { n: 9, sym: 'F', name: 'Fluorine', cat: 'halogen', row: 2, col: 17, mass: 18.998 },
  { n: 10, sym: 'Ne', name: 'Neon', cat: 'noble', row: 2, col: 18, mass: 20.180 },
  { n: 11, sym: 'Na', name: 'Sodium', cat: 'alkali', row: 3, col: 1, mass: 22.990 },
  { n: 12, sym: 'Mg', name: 'Magnesium', cat: 'alkaline', row: 3, col: 2, mass: 24.305 },
  { n: 13, sym: 'Al', name: 'Aluminum', cat: 'post-transition', row: 3, col: 13, mass: 26.982 },
  { n: 14, sym: 'Si', name: 'Silicon', cat: 'metalloid', row: 3, col: 14, mass: 28.085 },
  { n: 15, sym: 'P', name: 'Phosphorus', cat: 'nonmetal', row: 3, col: 15, mass: 30.974 },
  { n: 16, sym: 'S', name: 'Sulfur', cat: 'nonmetal', row: 3, col: 16, mass: 32.06 },
  { n: 17, sym: 'Cl', name: 'Chlorine', cat: 'halogen', row: 3, col: 17, mass: 35.45 },
  { n: 18, sym: 'Ar', name: 'Argon', cat: 'noble', row: 3, col: 18, mass: 39.95 },
];

const catColors: Record<string, string> = {
  'nonmetal': 'bg-green-500/20 border-green-500/50 hover:bg-green-500/40 text-green-300',
  'noble': 'bg-purple-500/20 border-purple-500/50 hover:bg-purple-500/40 text-purple-300',
  'alkali': 'bg-red-500/20 border-red-500/50 hover:bg-red-500/40 text-red-300',
  'alkaline': 'bg-orange-500/20 border-orange-500/50 hover:bg-orange-500/40 text-orange-300',
  'metalloid': 'bg-yellow-500/20 border-yellow-500/50 hover:bg-yellow-500/40 text-yellow-300',
  'halogen': 'bg-cyan-500/20 border-cyan-500/50 hover:bg-cyan-500/40 text-cyan-300',
  'post-transition': 'bg-blue-500/20 border-blue-500/50 hover:bg-blue-500/40 text-blue-300',
};

export default function TabelPeriodik() {
  const [selected, setSelected] = useState(elements[0]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative bg-zinc-950">
      <div className="flex-1 relative flex flex-col items-center justify-center p-8 overflow-auto">
        
        <div className="grid grid-cols-18 gap-1.5 w-full max-w-5xl">
          {/* Fill empty spaces to make the grid align. Grid is 18 cols. */}
          {Array.from({ length: 3 * 18 }).map((_, idx) => {
            const r = Math.floor(idx / 18) + 1;
            const c = (idx % 18) + 1;
            const el = elements.find(e => e.row === r && e.col === c);

            if (el) {
              const colorClass = catColors[el.cat] || 'bg-white/10';
              return (
                <button 
                  key={el.sym}
                  onClick={() => setSelected(el)}
                  className={`aspect-square flex flex-col items-center justify-center rounded-md border cursor-pointer transition-all ${colorClass} ${selected.sym === el.sym ? 'ring-2 ring-white scale-110 z-10' : ''}`}
                >
                  <span className="text-[10px] opacity-70 absolute top-1 left-1">{el.n}</span>
                  <span className="font-bold text-lg">{el.sym}</span>
                </button>
              );
            }
            return <div key={idx} className="aspect-square" />;
          })}
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Detail Unsur</h3></div>
        <div className="p-8 flex-1 overflow-y-auto flex flex-col items-center">
          
          <div className={`w-32 h-32 rounded-2xl border flex flex-col items-center justify-center relative mb-6 shadow-2xl ${catColors[selected.cat]}`}>
            <span className="absolute top-2 left-3 font-mono">{selected.n}</span>
            <span className="absolute top-2 right-3 font-mono text-xs opacity-70">{selected.mass}</span>
            <h2 className="text-5xl font-bold">{selected.sym}</h2>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">{selected.name}</h2>
          <div className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium uppercase tracking-wider mb-8">{selected.cat}</div>

          <div className="w-full space-y-4">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-zinc-400">Nomor Atom</span>
              <span className="font-mono text-white">{selected.n}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-zinc-400">Massa Atom</span>
              <span className="font-mono text-white">{selected.mass} u</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-zinc-400">Golongan</span>
              <span className="font-mono text-white">{selected.col}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-zinc-400">Periode</span>
              <span className="font-mono text-white">{selected.row}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
