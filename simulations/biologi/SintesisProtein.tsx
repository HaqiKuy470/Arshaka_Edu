"use client";

import { useState } from "react";
import { Play } from "lucide-react";

export default function SintesisProtein() {
  const [dnaSeq] = useState("TACGCCTAGATT");
  const [step, setStep] = useState<0|1|2|3>(0);
  
  // Step 0: DNA
  // Step 1: Transcription (mRNA)
  // Step 2: Ribosome mapping
  // Step 3: Translation (Amino Acids)

  const getMRNA = (dna: string) => {
    return dna.split('').map(char => {
      if (char === 'T') return 'A';
      if (char === 'A') return 'U'; // RNA uses Uracil
      if (char === 'C') return 'G';
      if (char === 'G') return 'C';
      return char;
    }).join('');
  };

  const mRNASeq = getMRNA(dnaSeq);

  const getAminoAcids = (mrna: string) => {
    const codons = mrna.match(/.{1,3}/g) || [];
    return codons.map(codon => {
      if (codon === 'AUG') return 'Met (Start)';
      if (codon === 'CGG') return 'Arg';
      if (codon === 'AUC') return 'Ile';
      if (codon === 'UAA' || codon === 'UAG' || codon === 'UGA') return 'STOP';
      return 'AA'; // Generic
    });
  };

  const aminos = getAminoAcids(mRNASeq);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center p-8 bg-zinc-950 overflow-y-auto">
        
        <div className="w-full max-w-3xl space-y-8">
          
          {/* Inti Sel (Nukleus) */}
          <div className="p-6 rounded-2xl border-2 border-indigo-500/30 bg-indigo-900/10 relative">
            <div className="absolute -top-3 left-6 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Nukleus</div>
            
            <div className="space-y-6">
              {/* DNA */}
              <div>
                <div className="text-zinc-500 text-sm font-bold mb-2">DNA Template Strand</div>
                <div className="flex gap-1">
                  {dnaSeq.split('').map((base, i) => (
                    <div key={i} className="w-10 h-12 flex items-center justify-center font-bold text-xl rounded bg-zinc-800 text-white border-b-4 border-indigo-500">
                      {base}
                    </div>
                  ))}
                </div>
              </div>

              {/* mRNA Transcription */}
              {step >= 1 && (
                <div className="animate-fade-in">
                  <div className="text-rose-400 text-sm font-bold mb-2 flex items-center gap-2">
                    mRNA <span className="bg-rose-500/20 text-rose-300 text-[10px] px-2 py-0.5 rounded">Transkripsi</span>
                  </div>
                  <div className="flex gap-1">
                    {mRNASeq.split('').map((base, i) => (
                      <div key={i} className="w-10 h-12 flex items-center justify-center font-bold text-xl rounded bg-rose-950 text-rose-400 border-t-4 border-rose-500 shadow-lg">
                        {base}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sitoplasma & Ribosom */}
          <div className={`p-6 rounded-2xl border-2 border-emerald-500/30 bg-emerald-900/10 relative transition-all duration-1000 ${step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="absolute -top-3 left-6 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Sitoplasma (Ribosom)</div>
            
            <div className="space-y-6 pt-4">
              {/* mRNA arrives */}
              {step >= 2 && (
                <div className="flex gap-1 bg-white/5 p-4 rounded-xl border border-white/10 relative">
                  
                  {/* Ribosome highlight graphic */}
                  <div className="absolute top-0 bottom-0 left-4 w-32 bg-emerald-500/20 border-x-2 border-emerald-500/50 rounded pointer-events-none" />

                  {mRNASeq.split('').map((base, i) => (
                    <div key={i} className={`w-10 h-10 flex items-center justify-center font-bold rounded ${i % 3 === 0 ? 'ml-2' : ''} bg-rose-900/50 text-rose-300 border border-rose-500/30`}>
                      {base}
                    </div>
                  ))}
                </div>
              )}

              {/* Translation to Protein */}
              {step >= 3 && (
                <div className="animate-fade-in pt-4">
                  <div className="text-amber-400 text-sm font-bold mb-4 flex items-center gap-2">
                    Rantai Polipeptida (Protein) <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded">Translasi</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {aminos.map((aa, i) => (
                      <div key={i} className="flex items-center">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xs text-center border-4 shadow-lg ${aa === 'STOP' ? 'bg-red-500 border-red-700 text-white' : 'bg-amber-400 border-amber-600 text-black'}`}>
                          {aa}
                        </div>
                        {i < aminos.length - 1 && (
                          <div className="w-12 h-2 bg-zinc-600 rounded-full mx-1" /> // Peptide bond
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Sintesis Protein</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-3">
            <button onClick={()=>setStep(0)} className={`w-full text-left p-3 rounded-xl border transition-all ${step === 0 ? 'bg-indigo-500 border-indigo-400 text-white font-bold shadow-lg' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
              1. DNA Template
            </button>
            <button onClick={()=>setStep(1)} className={`w-full text-left p-3 rounded-xl border transition-all ${step === 1 ? 'bg-rose-500 border-rose-400 text-white font-bold shadow-lg' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
              2. Transkripsi (mRNA)
            </button>
            <button onClick={()=>setStep(2)} className={`w-full text-left p-3 rounded-xl border transition-all ${step === 2 ? 'bg-emerald-500 border-emerald-400 text-white font-bold shadow-lg' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
              3. mRNA ke Ribosom
            </button>
            <button onClick={()=>setStep(3)} className={`w-full text-left p-3 rounded-xl border transition-all ${step === 3 ? 'bg-amber-500 border-amber-400 text-black font-bold shadow-lg' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
              4. Translasi (Protein)
            </button>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">Aturan Pasangan Basa</h4>
            <ul className="grid grid-cols-2 gap-2 font-mono bg-black/50 p-2 rounded">
              <li>DNA C ➞ RNA G</li>
              <li>DNA G ➞ RNA C</li>
              <li>DNA T ➞ RNA A</li>
              <li className="text-rose-400 font-bold">DNA A ➞ RNA U*</li>
            </ul>
            <p className="mt-2">*RNA tidak memiliki Timin (T), melainkan diganti dengan Urasil (U).</p>
            <hr className="border-white/10" />
            <p>Setiap 3 basa pada mRNA disebut <strong>Kodon</strong>. Setiap Kodon akan memanggil satu Asam Amino spesifik untuk disambung menjadi Protein.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
