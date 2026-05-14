"use client";

import { useState } from "react";

export default function GerbangLogika() {
  const [gate, setGate] = useState<"AND"|"OR"|"NOT"|"XOR">("AND");
  const [inputA, setInputA] = useState<0|1>(0);
  const [inputB, setInputB] = useState<0|1>(0);

  let output: 0|1 = 0;
  
  if (gate === "AND") output = (inputA === 1 && inputB === 1) ? 1 : 0;
  else if (gate === "OR") output = (inputA === 1 || inputB === 1) ? 1 : 0;
  else if (gate === "NOT") output = (inputA === 1) ? 0 : 1;
  else if (gate === "XOR") output = (inputA !== inputB) ? 1 : 0;

  const getBulbClass = (val: 0|1) => val === 1 ? "bg-amber-400 shadow-[0_0_30px_#facc15]" : "bg-zinc-800";
  const getWireClass = (val: 0|1) => val === 1 ? "bg-amber-400 shadow-[0_0_10px_#facc15]" : "bg-zinc-700";

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Gerbang Logika Dasar</h2>
        <p className="text-zinc-400 mb-12 text-center max-w-lg">Otak di dalam otak prosesor komputer. Kombinasi miliaran gerbang ini menghasilkan komputer yang Anda pakai sekarang.</p>

        {/* Circuit Board */}
        <div className="relative w-full max-w-3xl h-64 bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl flex items-center justify-center px-4 md:px-16 overflow-hidden">
           
           <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

           {/* Input Switches */}
           <div className="flex flex-col gap-16 z-20">
              <div className="flex items-center gap-4">
                 <span className="text-zinc-500 font-bold">A</span>
                 <button 
                   onClick={() => setInputA(inputA === 1 ? 0 : 1)}
                   className={`w-16 h-8 rounded-full relative transition-all duration-300 border-2 ${inputA === 1 ? 'bg-emerald-500 border-emerald-400' : 'bg-zinc-800 border-zinc-600'}`}
                 >
                    <div className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-md ${inputA === 1 ? 'left-8' : 'left-1'}`} />
                 </button>
                 <span className={`font-mono font-black text-2xl ${inputA === 1 ? 'text-emerald-400' : 'text-zinc-600'}`}>{inputA}</span>
              </div>
              
              {gate !== "NOT" && (
                 <div className="flex items-center gap-4">
                    <span className="text-zinc-500 font-bold">B</span>
                    <button 
                      onClick={() => setInputB(inputB === 1 ? 0 : 1)}
                      className={`w-16 h-8 rounded-full relative transition-all duration-300 border-2 ${inputB === 1 ? 'bg-emerald-500 border-emerald-400' : 'bg-zinc-800 border-zinc-600'}`}
                    >
                       <div className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-md ${inputB === 1 ? 'left-8' : 'left-1'}`} />
                    </button>
                    <span className={`font-mono font-black text-2xl ${inputB === 1 ? 'text-emerald-400' : 'text-zinc-600'}`}>{inputB}</span>
                 </div>
              )}
           </div>

           {/* Wiring Left */}
           <div className="flex-1 flex flex-col justify-center relative h-full">
              <div className={`absolute w-full h-1 left-0 top-[35%] -translate-y-1/2 transition-colors duration-300 ${getWireClass(inputA)}`} />
              {gate !== "NOT" && (
                 <div className={`absolute w-full h-1 left-0 top-[65%] -translate-y-1/2 transition-colors duration-300 ${getWireClass(inputB)}`} />
              )}
           </div>

           {/* The Logic Gate Component */}
           <div className="w-32 h-32 bg-zinc-950 border-4 border-blue-500 flex flex-col items-center justify-center rounded-r-full rounded-l-md shadow-[0_0_20px_rgba(59,130,246,0.3)] z-20 relative">
              <span className="text-2xl font-black text-blue-400">{gate}</span>
              {gate === "NOT" && <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-blue-500 bg-zinc-950" />}
           </div>

           {/* Wiring Right */}
           <div className="flex-1 relative h-full">
              <div className={`absolute w-full h-1 left-0 top-1/2 -translate-y-1/2 transition-colors duration-300 ${getWireClass(output)}`} />
           </div>

           {/* Output Bulb */}
           <div className="z-20 flex flex-col items-center gap-4">
              <div className={`w-16 h-16 rounded-full transition-all duration-300 border-2 border-amber-600/50 ${getBulbClass(output)}`} />
              <span className={`font-mono font-black text-4xl ${output === 1 ? 'text-amber-400' : 'text-zinc-600'}`}>{output}</span>
           </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Pilih Gerbang</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          <button onClick={()=>setGate("AND")} className={`w-full p-4 text-left rounded-xl border transition-all ${gate === 'AND' ? 'bg-blue-600 border-blue-400 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
             <div className="text-sm">AND</div>
             <div className="text-[10px] font-normal opacity-80">Nyala HANYA jika A=1 dan B=1</div>
          </button>
          
          <button onClick={()=>setGate("OR")} className={`w-full p-4 text-left rounded-xl border transition-all ${gate === 'OR' ? 'bg-blue-600 border-blue-400 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
             <div className="text-sm">OR</div>
             <div className="text-[10px] font-normal opacity-80">Nyala jika SALAH SATU (A/B) = 1</div>
          </button>

          <button onClick={()=>setGate("NOT")} className={`w-full p-4 text-left rounded-xl border transition-all ${gate === 'NOT' ? 'bg-blue-600 border-blue-400 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
             <div className="text-sm">NOT (Inverter)</div>
             <div className="text-[10px] font-normal opacity-80">Membalikkan input. (1 jadi 0, 0 jadi 1)</div>
          </button>

          <button onClick={()=>setGate("XOR")} className={`w-full p-4 text-left rounded-xl border transition-all ${gate === 'XOR' ? 'bg-blue-600 border-blue-400 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400'}`}>
             <div className="text-sm">XOR (Exclusive OR)</div>
             <div className="text-[10px] font-normal opacity-80">Nyala HANYA jika input BEDA (A≠B)</div>
          </button>

        </div>
      </div>
    </div>
  );
}
