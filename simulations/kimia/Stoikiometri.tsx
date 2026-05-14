"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function Stoikiometri() {
  const [massA, setMassA] = useState(10); // grams of reactant A
  const [molarMassA, setMolarMassA] = useState(2.0); // g/mol (H2)
  const [molarMassB, setMolarMassB] = useState(32.0); // g/mol (O2)
  const [molarMassC, setMolarMassC] = useState(18.0); // g/mol (H2O)
  
  // Reaction: 2 H2 + 1 O2 -> 2 H2O
  // Coeffs
  const cA = 2;
  const cB = 1;
  const cC = 2;

  // Calculations
  const molA = massA / molarMassA;
  
  // Stoichiometry ratios
  const molB = molA * (cB / cA);
  const molC = molA * (cC / cA);

  const massB = molB * molarMassB;
  const massC = molC * molarMassC;

  const particlesC = molC * 6.022e23;

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        {/* Equation Display */}
        <div className="text-3xl md:text-5xl font-mono font-bold text-white mb-12 flex items-center gap-4">
          <div className="text-rose-400">
            <span className="text-xl mr-1">{cA}</span>A
          </div>
          <span className="text-zinc-500">+</span>
          <div className="text-sky-400">
            <span className="text-xl mr-1">{cB}</span>B
          </div>
          <ArrowRight className="w-10 h-10 text-zinc-400" />
          <div className="text-emerald-400">
            <span className="text-xl mr-1">{cC}</span>C
          </div>
        </div>

        {/* Visual blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
          
          {/* Reactant A */}
          <div className="glass-card rounded-2xl p-6 border-t-4 border-rose-500 relative">
            <h3 className="text-rose-400 font-bold text-xl mb-4 text-center">Zat A (Reaktan)</h3>
            <div className="space-y-4">
              <div className="bg-black/30 rounded-xl p-3 border border-rose-500/20">
                <div className="text-xs text-zinc-400">Massa (Diketahui)</div>
                <div className="text-2xl font-mono text-white">{massA.toFixed(2)} g</div>
              </div>
              <div className="bg-black/30 rounded-xl p-3 border border-rose-500/20">
                <div className="text-xs text-zinc-400">Massa Molar (Ar/Mr)</div>
                <div className="text-lg font-mono text-white">{molarMassA.toFixed(2)} g/mol</div>
              </div>
              <div className="bg-rose-500/20 rounded-xl p-3 border border-rose-500/50">
                <div className="text-xs text-rose-300 font-bold">Jumlah Mol = Massa / Mr</div>
                <div className="text-2xl font-mono text-rose-400 font-bold">{molA.toFixed(2)} mol</div>
              </div>
            </div>
          </div>

          {/* Reactant B */}
          <div className="glass-card rounded-2xl p-6 border-t-4 border-sky-500 relative opacity-80">
            <h3 className="text-sky-400 font-bold text-xl mb-4 text-center">Zat B (Reaktan)</h3>
            <div className="space-y-4">
              <div className="bg-black/30 rounded-xl p-3 border border-sky-500/20">
                <div className="text-xs text-zinc-400">Dibutuhkan (Teoritis)</div>
                <div className="text-2xl font-mono text-white">{massB.toFixed(2)} g</div>
              </div>
              <div className="bg-black/30 rounded-xl p-3 border border-sky-500/20">
                <div className="text-xs text-zinc-400">Massa Molar (Ar/Mr)</div>
                <div className="text-lg font-mono text-white">{molarMassB.toFixed(2)} g/mol</div>
              </div>
              <div className="bg-sky-500/20 rounded-xl p-3 border border-sky-500/50">
                <div className="text-xs text-sky-300 font-bold">Mol B = (Koef B / Koef A) × Mol A</div>
                <div className="text-2xl font-mono text-sky-400 font-bold">{molB.toFixed(2)} mol</div>
              </div>
            </div>
          </div>

          {/* Product C */}
          <div className="glass-card rounded-2xl p-6 border-t-4 border-emerald-500 relative">
            <h3 className="text-emerald-400 font-bold text-xl mb-4 text-center">Zat C (Produk)</h3>
            <div className="space-y-4">
              <div className="bg-black/30 rounded-xl p-3 border border-emerald-500/20">
                <div className="text-xs text-zinc-400">Massa (Hasil)</div>
                <div className="text-2xl font-mono text-white">{massC.toFixed(2)} g</div>
              </div>
              <div className="bg-emerald-500/20 rounded-xl p-3 border border-emerald-500/50">
                <div className="text-xs text-emerald-300 font-bold">Mol C = (Koef C / Koef A) × Mol A</div>
                <div className="text-2xl font-mono text-emerald-400 font-bold">{molC.toFixed(2)} mol</div>
              </div>
              <div className="bg-amber-500/10 rounded-xl p-3 border border-amber-500/30">
                <div className="text-xs text-amber-400 font-bold">Jumlah Partikel (× Bil. Avogadro)</div>
                <div className="text-sm font-mono text-amber-300 break-all">{particlesC.toExponential(4)} molekul</div>
              </div>
            </div>
          </div>

        </div>
        
        {/* Law of Conservation of Mass Check */}
        <div className="mt-12 p-4 rounded-xl border border-zinc-700 bg-zinc-900 text-center text-sm text-zinc-400">
          <span className="font-bold text-white">Hukum Kekekalan Massa (Lavoisier):</span><br/>
          Massa Reaktan (A + B) = {(massA + massB).toFixed(2)} g <br/>
          Massa Produk (C) = {massC.toFixed(2)} g
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Kalkulator Stoikiometri</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-bold text-rose-400">Massa Zat A (g)</label>
              <span className="font-mono text-rose-400">{massA} g</span>
            </div>
            <input 
              type="range" className="w-full accent-rose-500" 
              min="1" max="100" step="1" 
              value={massA} 
              onChange={(e) => setMassA(parseFloat(e.target.value))} 
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="text-sm font-bold text-white">Atur Massa Molar (Mr)</div>
            
            <div className="space-y-1">
              <label className="text-xs text-rose-300">Zat A (Misal: H₂ = 2)</label>
              <input type="number" className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-white font-mono" value={molarMassA} onChange={(e) => setMolarMassA(parseFloat(e.target.value) || 1)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-sky-300">Zat B (Misal: O₂ = 32)</label>
              <input type="number" className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-white font-mono" value={molarMassB} onChange={(e) => setMolarMassB(parseFloat(e.target.value) || 1)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-emerald-300">Zat C (Misal: H₂O = 18)</label>
              <input type="number" className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-white font-mono" value={molarMassC} onChange={(e) => setMolarMassC(parseFloat(e.target.value) || 1)} />
            </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Konsep Mol:</strong> Jembatan perhitungan kimia.</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Ubah massa zat diketahui ke Mol.</li>
              <li>Gunakan perbandingan koefisien reaksi untuk mencari mol zat yang ditanya.</li>
              <li>Ubah mol zat yang ditanya kembali menjadi massa / partikel / volume.</li>
            </ol>
          </div>

        </div>
      </div>
    </div>
  );
}
