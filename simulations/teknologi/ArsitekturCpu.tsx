"use client";

import { useState, useEffect } from "react";

export default function ArsitekturCpu() {
  const [cycle, setCycle] = useState<"IDLE"|"FETCH"|"DECODE"|"EXECUTE">("IDLE");
  const [instruction, setInstruction] = useState("ADD R1, R2");
  const [isAuto, setIsAuto] = useState(false);

  useEffect(() => {
     let timer: NodeJS.Timeout;
     if (isAuto) {
        timer = setTimeout(() => {
           if (cycle === "IDLE") setCycle("FETCH");
           else if (cycle === "FETCH") setCycle("DECODE");
           else if (cycle === "DECODE") setCycle("EXECUTE");
           else if (cycle === "EXECUTE") setCycle("FETCH");
        }, 1500);
     }
     return () => clearTimeout(timer);
  }, [isAuto, cycle]);

  const stepNext = () => {
     setIsAuto(false);
     if (cycle === "IDLE") setCycle("FETCH");
     else if (cycle === "FETCH") setCycle("DECODE");
     else if (cycle === "DECODE") setCycle("EXECUTE");
     else if (cycle === "EXECUTE") setCycle("IDLE");
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col bg-zinc-950 p-4 lg:p-8 overflow-y-auto">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Arsitektur CPU (Siklus Mesin)</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-lg mx-auto">Siklus berulang yang dilakukan prosesor miliaran kali per detik (GHz).</p>

        {/* The CPU Board */}
        <div className="w-full max-w-4xl mx-auto bg-zinc-900 border-8 border-zinc-800 rounded-3xl p-8 shadow-2xl relative">
           
           <h3 className="absolute top-4 left-6 text-zinc-500 font-black tracking-widest text-xl">CENTRAL PROCESSING UNIT</h3>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 relative">
              
              {/* RAM (Memory) - External but put here for visualization */}
              <div className={`col-span-1 md:col-span-2 p-4 border-2 border-dashed rounded-xl transition-all duration-300 ${cycle === 'FETCH' ? 'bg-emerald-950/30 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-black/30 border-zinc-700'}`}>
                 <h4 className="text-sm font-bold text-emerald-400 mb-2 uppercase">1. RAM (Main Memory)</h4>
                 <div className="flex justify-between items-center bg-black p-2 rounded border border-zinc-800">
                    <span className="text-zinc-500 text-xs">Alamat: 0x00A1</span>
                    <span className={`font-mono font-bold ${cycle === 'FETCH' ? 'text-emerald-400 animate-pulse' : 'text-zinc-400'}`}>[{instruction}]</span>
                 </div>
              </div>

              {/* Control Unit */}
              <div className={`p-6 border-2 rounded-xl transition-all duration-300 ${cycle === 'DECODE' ? 'bg-blue-950/30 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'bg-black/30 border-zinc-700'}`}>
                 <h4 className="text-sm font-bold text-blue-400 mb-4 uppercase">2. Control Unit (Decode)</h4>
                 <div className="bg-black p-4 rounded border border-zinc-800 flex flex-col items-center justify-center min-h-[100px]">
                    <span className={`text-xs text-zinc-500 mb-2 ${cycle === 'DECODE' ? 'hidden' : 'block'}`}>Menunggu Instuksi...</span>
                    {cycle === 'DECODE' && (
                       <div className="text-center animate-fade-in">
                          <div className="text-[10px] text-zinc-500">Menerjemahkan: {instruction}</div>
                          <div className="font-mono text-blue-400 font-bold mt-1">➔ OP: TAMBAH</div>
                          <div className="font-mono text-zinc-400 text-xs">➔ LOK: Reg1, Reg2</div>
                       </div>
                    )}
                 </div>
              </div>

              {/* ALU */}
              <div className={`p-6 border-2 rounded-xl transition-all duration-300 ${cycle === 'EXECUTE' ? 'bg-rose-950/30 border-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.2)]' : 'bg-black/30 border-zinc-700'}`}>
                 <h4 className="text-sm font-bold text-rose-400 mb-4 uppercase">3. ALU (Arithmetic Logic Unit)</h4>
                 <div className="bg-black p-4 rounded border border-zinc-800 flex flex-col items-center justify-center min-h-[100px]">
                    <span className={`text-xs text-zinc-500 mb-2 ${cycle === 'EXECUTE' ? 'hidden' : 'block'}`}>Idle...</span>
                    {cycle === 'EXECUTE' && (
                       <div className="text-center animate-fade-in">
                          <div className="text-2xl mb-1">⚙️</div>
                          <div className="font-mono text-rose-400 font-bold">MENGHITUNG HASIL</div>
                       </div>
                    )}
                 </div>
              </div>

           </div>

           {/* Data Bus visualization */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-20 pointer-events-none">
              <span className="text-9xl">🔄</span>
           </div>
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Siklus Mesin</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="flex gap-2">
             <button 
                onClick={stepNext}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl border border-zinc-600 transition-all text-sm"
             >
                Langkah (Step)
             </button>
             <button 
                onClick={() => setIsAuto(!isAuto)}
                className={`flex-1 font-bold py-3 rounded-xl transition-all text-sm ${isAuto ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}
             >
                {isAuto ? 'Stop Auto' : 'Auto Play'}
             </button>
          </div>

          <div className="space-y-4">
             <div className={`p-3 rounded-xl border transition-all ${cycle === 'FETCH' ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-100' : 'bg-black/30 border-white/5 text-zinc-500'}`}>
                <h4 className="font-bold text-sm mb-1">1. FETCH (Ambil)</h4>
                <p className="text-xs">CPU mengambil instruksi selanjutnya dari RAM ke dalam memori CPU (Register).</p>
             </div>
             
             <div className={`p-3 rounded-xl border transition-all ${cycle === 'DECODE' ? 'bg-blue-950/50 border-blue-500/50 text-blue-100' : 'bg-black/30 border-white/5 text-zinc-500'}`}>
                <h4 className="font-bold text-sm mb-1">2. DECODE (Terjemah)</h4>
                <p className="text-xs">Control Unit memecah bahasa mesin (biner) menjadi perintah yang dipahami hardware (contoh: Operasi Tambah).</p>
             </div>

             <div className={`p-3 rounded-xl border transition-all ${cycle === 'EXECUTE' ? 'bg-rose-950/50 border-rose-500/50 text-rose-100' : 'bg-black/30 border-white/5 text-zinc-500'}`}>
                <h4 className="font-bold text-sm mb-1">3. EXECUTE (Eksekusi)</h4>
                <p className="text-xs">ALU melakukan perhitungan matematika/logika fisik, lalu menyimpan hasilnya kembali.</p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
