"use client";

import { useState } from "react";

export default function MutasiGenetik() {
  const [originalSeq] = useState("AUG-CUA-GGC-UAC-UAA"); 
  const [mutatedSeq, setMutatedSeq] = useState("AUG-CUA-GGC-UAC-UAA");
  const [mutationType, setMutationType] = useState("normal");

  const getAmino = (codon: string) => {
    switch(codon) {
      case "AUG": return { name: "Met", color: "bg-emerald-500" };
      case "CUA": return { name: "Leu", color: "bg-blue-500" };
      case "GGC": return { name: "Gly", color: "bg-purple-500" };
      case "UAC": return { name: "Tyr", color: "bg-pink-500" };
      case "UAA": 
      case "UAG": 
      case "UGA": return { name: "STOP", color: "bg-red-500" };
      // Mutated codons
      case "CGA": return { name: "Arg", color: "bg-cyan-500" }; // Missense
      case "UAG": return { name: "STOP", color: "bg-red-500" }; // Nonsense
      case "CUG": return { name: "Leu", color: "bg-blue-500" }; // Silent
      default: return { name: "???", color: "bg-zinc-600" }; // Frameshift garbage
    }
  };

  const applyMutation = (type: string) => {
    setMutationType(type);
    if (type === "normal") setMutatedSeq("AUG-CUA-GGC-UAC-UAA");
    else if (type === "silent") setMutatedSeq("AUG-CUG-GGC-UAC-UAA"); // CUA -> CUG (Still Leu)
    else if (type === "missense") setMutatedSeq("AUG-CGA-GGC-UAC-UAA"); // CUA -> CGA (Leu -> Arg)
    else if (type === "nonsense") setMutatedSeq("AUG-CUA-UAG-UAC-UAA"); // GGC -> UAG (Gly -> STOP early)
    else if (type === "insertion") setMutatedSeq("AUG-CCU-AGG-CUA-CUA"); // Insert C at pos 4 -> Frameshift
    else if (type === "deletion") setMutatedSeq("AUG-CAG-GCU-ACU-AA"); // Delete U at pos 5 -> Frameshift
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <div className="w-full max-w-4xl space-y-12">
          
          {/* Normal DNA/RNA */}
          <div className="glass-card p-6 rounded-2xl relative">
            <div className="absolute -top-3 left-4 bg-zinc-700 text-white text-xs px-3 py-1 rounded-full font-bold">DNA/RNA Normal (Wild-Type)</div>
            
            <div className="flex flex-col items-center gap-4 pt-4">
              <div className="flex gap-2">
                {originalSeq.split("-").map((codon, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="bg-zinc-800 border border-zinc-600 px-3 py-2 rounded text-zinc-300 font-mono text-lg font-bold">
                      {codon}
                    </div>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${getAmino(codon).color}`}>
                      {getAmino(codon).name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mutated */}
          <div className={`glass-card p-6 rounded-2xl relative border-2 ${mutationType !== 'normal' ? 'border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.2)]' : 'border-transparent'}`}>
            <div className={`absolute -top-3 left-4 text-white text-xs px-3 py-1 rounded-full font-bold transition-colors ${mutationType !== 'normal' ? 'bg-rose-600' : 'bg-zinc-700'}`}>
              {mutationType === 'normal' ? 'Mutasi Belum Terjadi' : `Terjadi Mutasi: ${mutationType.toUpperCase()}`}
            </div>
            
            <div className="flex flex-col items-center gap-4 pt-4">
              <div className="flex gap-2 flex-wrap justify-center">
                {mutatedSeq.split("-").map((codon, i) => {
                  const origCodon = originalSeq.split("-")[i] || "";
                  const isMutated = codon !== origCodon && mutationType !== "normal";
                  const amino = getAmino(codon);
                  
                  return (
                    <div key={i} className="flex flex-col items-center gap-2 relative">
                      <div className={`px-3 py-2 rounded font-mono text-lg font-bold transition-colors ${isMutated ? 'bg-rose-950 text-rose-400 border border-rose-500' : 'bg-zinc-800 border border-zinc-600 text-zinc-300'}`}>
                        {codon}
                      </div>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg transition-all ${isMutated && amino.name === "STOP" ? 'ring-4 ring-rose-500/50' : ''} ${amino.color}`}>
                        {amino.name}
                      </div>
                      {isMutated && mutationType !== 'silent' && (
                        <div className="absolute -bottom-6 text-[10px] font-bold text-rose-400 whitespace-nowrap">Berubah!</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Mutasi Genetik</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-2">
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Pilih Jenis Mutasi</div>
            
            <button onClick={()=>applyMutation('normal')} className={`w-full text-left p-3 rounded-xl border transition-all ${mutationType === 'normal' ? 'bg-emerald-500 border-emerald-400 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
              🔄 Normal (Wild-Type)
            </button>
            <button onClick={()=>applyMutation('silent')} className={`w-full text-left p-3 rounded-xl border transition-all ${mutationType === 'silent' ? 'bg-blue-500 border-blue-400 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
              Mutasi Diam (Silent)
            </button>
            <button onClick={()=>applyMutation('missense')} className={`w-full text-left p-3 rounded-xl border transition-all ${mutationType === 'missense' ? 'bg-amber-500 border-amber-400 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
              Mutasi Salah Arti (Missense)
            </button>
            <button onClick={()=>applyMutation('nonsense')} className={`w-full text-left p-3 rounded-xl border transition-all ${mutationType === 'nonsense' ? 'bg-red-500 border-red-400 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
              Mutasi Tanpa Arti (Nonsense)
            </button>
            <button onClick={()=>applyMutation('insertion')} className={`w-full text-left p-3 rounded-xl border transition-all ${mutationType === 'insertion' ? 'bg-rose-600 border-rose-400 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
              Insersi (Frameshift)
            </button>
            <button onClick={()=>applyMutation('deletion')} className={`w-full text-left p-3 rounded-xl border transition-all ${mutationType === 'deletion' ? 'bg-purple-600 border-purple-400 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
              Delesi (Frameshift)
            </button>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            {mutationType === "normal" && <p>Urutan basa Nitrogen normal yang menghasilkan protein yang berfungsi dengan baik.</p>}
            {mutationType === "silent" && <p>Basa nitrogen berubah, tetapi <strong>asam amino yang dihasilkan tetap sama</strong> (karena 1 asam amino bisa dikodekan oleh beberapa kodon). Protein tetap berfungsi.</p>}
            {mutationType === "missense" && <p>Perubahan basa menyebabkan <strong>satu asam amino berubah</strong>. Bisa mengubah fungsi protein (contoh: Anemia Sel Sabit).</p>}
            {mutationType === "nonsense" && <p>Mutasi mengubah kodon menjadi <strong>Kodon STOP</strong> terlalu dini. Protein terpotong dan biasanya tidak berfungsi (rusak).</p>}
            {(mutationType === "insertion" || mutationType === "deletion") && (
              <p>Penambahan atau pengurangan 1 basa menyebabkan <strong>Frameshift (Pergeseran Kerangka Baca)</strong>. Semua asam amino setelah titik mutasi akan berubah total! Sangat fatal.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
