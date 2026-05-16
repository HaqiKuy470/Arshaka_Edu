"use client";

import { useState, useEffect } from "react";
import { 
  RefreshCcw, 
  CheckCircle2, 
  ChevronLeft, 
  ShieldAlert, 
  ChevronRight, 
  Zap, 
  RotateCcw,
  Scale,
  Atom,
  Info
} from "lucide-react";
import Link from "next/link";

interface Molecule {
  formula: string;
  atoms: Record<string, number>;
  color: string;
}

interface Reaction {
  id: string;
  name: string;
  reactants: Molecule[];
  products: Molecule[];
  description: string;
}

const REACTIONS: Reaction[] = [
  {
    id: "water",
    name: "Sintesis Air",
    reactants: [
      { formula: "H₂", atoms: { H: 2 }, color: "text-sky-400" },
      { formula: "O₂", atoms: { O: 2 }, color: "text-red-400" }
    ],
    products: [
      { formula: "H₂O", atoms: { H: 2, O: 1 }, color: "text-blue-400" }
    ],
    description: "Reaksi antara gas Hidrogen dan Oksigen menghasilkan air."
  },
  {
    id: "ammonia",
    name: "Proses Haber (Amonia)",
    reactants: [
      { formula: "N₂", atoms: { N: 2 }, color: "text-indigo-400" },
      { formula: "H₂", atoms: { H: 2 }, color: "text-sky-400" }
    ],
    products: [
      { formula: "NH₃", atoms: { N: 1, H: 3 }, color: "text-emerald-400" }
    ],
    description: "Sintesis industri amonia dari nitrogen dan hidrogen."
  },
  {
    id: "methane",
    name: "Pembakaran Metana",
    reactants: [
      { formula: "CH₄", atoms: { C: 1, H: 4 }, color: "text-orange-400" },
      { formula: "O₂", atoms: { O: 2 }, color: "text-red-400" }
    ],
    products: [
      { formula: "CO₂", atoms: { C: 1, O: 2 }, color: "text-zinc-300" },
      { formula: "H₂O", atoms: { H: 2, O: 1 }, color: "text-blue-400" }
    ],
    description: "Reaksi oksidasi metana menghasilkan karbon dioksida dan uap air."
  }
];

export default function PenyeimbanganPersamaan() {
  const [level, setLevel] = useState(0);
  const [coeffs, setCoeffs] = useState<number[]>([]);
  const [isBalanced, setIsBalanced] = useState(false);

  const currentReaction = REACTIONS[level];
  const numReactants = currentReaction.reactants.length;
  const numProducts = currentReaction.products.length;

  // Initialize coefficients
  useEffect(() => {
    setCoeffs(new Array(numReactants + numProducts).fill(1));
    setIsBalanced(false);
  }, [level, numReactants, numProducts]);

  const updateCoeff = (index: number, val: number) => {
    const newCoeffs = [...coeffs];
    newCoeffs[index] = Math.max(1, Math.min(9, val));
    setCoeffs(newCoeffs);
  };

  // Calculate atom counts
  const getAtomCounts = () => {
    const reactantCounts: Record<string, number> = {};
    const productCounts: Record<string, number> = {};

    currentReaction.reactants.forEach((mol, i) => {
      Object.entries(mol.atoms).forEach(([atom, count]) => {
        reactantCounts[atom] = (reactantCounts[atom] || 0) + count * (coeffs[i] || 1);
      });
    });

    currentReaction.products.forEach((mol, i) => {
      Object.entries(mol.atoms).forEach(([atom, count]) => {
        productCounts[atom] = (productCounts[atom] || 0) + count * (coeffs[numReactants + i] || 1);
      });
    });

    return { reactantCounts, productCounts };
  };

  const { reactantCounts, productCounts } = getAtomCounts();
  const allAtoms = Array.from(new Set([
    ...Object.keys(reactantCounts),
    ...Object.keys(productCounts)
  ]));

  // Check if balanced
  useEffect(() => {
    if (coeffs.length === 0) return;
    const balanced = allAtoms.every(atom => reactantCounts[atom] === productCounts[atom]);
    setIsBalanced(balanced);
  }, [coeffs, reactantCounts, productCounts, allAtoms]);

  const reset = () => {
    setCoeffs(new Array(numReactants + numProducts).fill(1));
  };

  const nextLevel = () => {
    setLevel((level + 1) % REACTIONS.length);
  };

  const renderFormula = (formula: string) => {
    return formula.split(/(\d+)/).map((part, i) => 
      /\d+/.test(part) ? <sub key={i} className="text-sm opacity-70">{part}</sub> : part
    );
  };

  return (
    <div className="fixed inset-0 bg-zinc-950 flex flex-col lg:flex-row overflow-hidden font-sans select-none text-white">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/20 blur-[120px] rounded-full" />
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
              <h1 className="text-lg font-bold tracking-tight leading-none">Penyetaraan Persamaan</h1>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Hukum Kekekalan Massa • Kimia</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setLevel((l) => (l === 0 ? REACTIONS.length - 1 : l - 1))}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <span className="text-xs font-bold px-3 py-1 bg-white/10 rounded-full border border-white/10">
              Misi {level + 1} / {REACTIONS.length}
            </span>
            <button 
              onClick={nextLevel}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 transition-all"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Level Indicator Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
            {currentReaction.name}
          </h2>
          <p className="text-zinc-400 text-sm max-w-md mx-auto">{currentReaction.description}</p>
        </div>

        {/* The Equation */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-8 mb-20 text-4xl md:text-5xl font-mono">
          {/* Reactants */}
          {currentReaction.reactants.map((mol, i) => (
            <div key={`r-${i}`} className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-2">
                <div className="flex flex-col">
                  <button onClick={() => updateCoeff(i, (coeffs[i] || 1) + 1)} className="p-1 hover:text-indigo-400 transition-colors"><ChevronLeft className="w-4 h-4 rotate-90" /></button>
                  <div className="w-16 h-16 bg-white/5 border-2 border-white/10 rounded-2xl flex items-center justify-center text-3xl font-black text-indigo-400 shadow-inner">
                    {coeffs[i] || 1}
                  </div>
                  <button onClick={() => updateCoeff(i, (coeffs[i] || 1) - 1)} className="p-1 hover:text-indigo-400 transition-colors"><ChevronLeft className="w-4 h-4 -rotate-90" /></button>
                </div>
              </div>
              <span className={mol.color}>{renderFormula(mol.formula)}</span>
              {i < numReactants - 1 && <span className="text-zinc-600 px-2">+</span>}
            </div>
          ))}

          <span className="text-zinc-500 mx-4 font-sans">→</span>

          {/* Products */}
          {currentReaction.products.map((mol, i) => (
            <div key={`p-${i}`} className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-2">
                <div className="flex flex-col">
                  <button onClick={() => updateCoeff(numReactants + i, (coeffs[numReactants + i] || 1) + 1)} className="p-1 hover:text-emerald-400 transition-colors"><ChevronLeft className="w-4 h-4 rotate-90" /></button>
                  <div className="w-16 h-16 bg-white/5 border-2 border-white/10 rounded-2xl flex items-center justify-center text-3xl font-black text-emerald-400 shadow-inner">
                    {coeffs[numReactants + i] || 1}
                  </div>
                  <button onClick={() => updateCoeff(numReactants + i, (coeffs[numReactants + i] || 1) - 1)} className="p-1 hover:text-emerald-400 transition-colors"><ChevronLeft className="w-4 h-4 -rotate-90" /></button>
                </div>
              </div>
              <span className={mol.color}>{renderFormula(mol.formula)}</span>
              {i < numProducts - 1 && <span className="text-zinc-600 px-2">+</span>}
            </div>
          ))}
        </div>

        {/* Visual Balance Meters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
          {allAtoms.map(atom => {
            const rCount = reactantCounts[atom] || 0;
            const pCount = productCounts[atom] || 0;
            const isMatch = rCount === pCount;
            
            return (
              <div key={atom} className="glass-card p-5 rounded-3xl border border-white/10 bg-white/5 overflow-hidden group hover:border-white/20 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                      <Atom className="w-4 h-4 text-indigo-400" />
                    </div>
                    <span className="font-bold text-lg text-white">Atom {atom}</span>
                  </div>
                  {isMatch && <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-in zoom-in" />}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    <span>Reaktan: {rCount}</span>
                    <span>Produk: {pCount}</span>
                  </div>
                  
                  <div className="relative h-2 bg-black/40 rounded-full overflow-hidden">
                    {/* Reactant Side (Left) */}
                    <div 
                      className="absolute left-0 top-0 h-full bg-indigo-500 transition-all duration-500 ease-out"
                      style={{ width: `${Math.min(50, (rCount / 10) * 50)}%` }}
                    />
                    {/* Product Side (Right) */}
                    <div 
                      className="absolute right-0 top-0 h-full bg-emerald-500 transition-all duration-500 ease-out"
                      style={{ width: `${Math.min(50, (pCount / 10) * 50)}%` }}
                    />
                    {/* Center Divider */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/20 -translate-x-1/2" />
                  </div>

                  <div className="text-center">
                    {rCount > pCount ? (
                      <span className="text-[9px] text-indigo-400 font-bold">Kelebihan di Reaktan</span>
                    ) : rCount < pCount ? (
                      <span className="text-[9px] text-emerald-400 font-bold">Kelebihan di Produk</span>
                    ) : (
                      <span className="text-[9px] text-zinc-500 font-bold">Atom Setimbang</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Success Overlay */}
        {isBalanced && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-500 p-4">
            <div className="glass-card p-12 rounded-[40px] border border-white/20 text-center space-y-6 shadow-2xl max-w-sm mx-auto">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-4xl font-black text-white">Luar Biasa!</h2>
              <p className="text-zinc-400">Kamu berhasil menyetarakan persamaan ini dengan sempurna.</p>
              <div className="pt-4 flex flex-col gap-3">
                <button 
                  onClick={nextLevel}
                  className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                >
                  Misi Berikutnya <ChevronRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setIsBalanced(false)}
                  className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Controls */}
      <div className="w-full lg:w-80 z-20 flex flex-col bg-zinc-900/50 backdrop-blur-3xl border-l border-white/10 overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="p-6 space-y-8 pt-24">
          
          {/* Reaction Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-zinc-500" />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Status Setara</span>
            </div>
            
            <div className="glass-card p-5 rounded-3xl border border-white/5 bg-white/5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex flex-col">
                  <span className="text-[8px] text-zinc-500 uppercase font-bold tracking-tighter">Status Reaksi</span>
                  <span className={`text-sm font-black transition-colors ${isBalanced ? 'text-emerald-400' : 'text-zinc-400'}`}>
                    {isBalanced ? "SETARA" : "BELUM SETARA"}
                  </span>
                </div>
                <div className={`p-2 rounded-lg ${isBalanced ? 'bg-emerald-500/20' : 'bg-zinc-800'}`}>
                  {isBalanced ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Info className="w-5 h-5 text-zinc-600" />}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[8px] text-zinc-500 uppercase font-bold">Petunjuk</span>
                <p className="text-[10px] text-zinc-400 leading-relaxed italic">
                  "Jumlah setiap jenis atom di sebelah kiri panah harus sama dengan jumlah di sebelah kanan panah."
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
             <button 
               onClick={reset}
               className="w-full py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl"
             >
                <RotateCcw className="w-4 h-4" /> Reset Koefisien
             </button>
             <button 
               onClick={nextLevel}
               className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-indigo-500/20"
             >
                <Zap className="w-4 h-4" /> Ganti Reaksi
             </button>
          </div>

          {/* Physics Insight */}
          <div className="p-6 bg-indigo-500/10 rounded-[32px] border border-indigo-500/20 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Wawasan Kimia</span>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white">Hukum Lavoisier</h4>
              <p className="text-[10px] text-indigo-200/60 leading-relaxed italic">
                "Massa zat sebelum dan sesudah reaksi adalah sama. Dalam persamaan kimia, ini berarti jumlah atom setiap elemen tidak boleh berubah."
              </p>
              <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                <code className="text-[10px] text-emerald-400 font-mono block text-center">
                  ∑ Atom Reaktan = ∑ Atom Produk
                </code>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
