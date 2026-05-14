"use client";

import { useState } from "react";

export default function RekursiVisual() {
  const [number, setNumber] = useState<number>(4);
  const [steps, setSteps] = useState<{level: number, text: string, result: number|null}[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Calculates factorial and generates step-by-step trace
  const runRecursion = async () => {
     if(isAnimating) return;
     setIsAnimating(true);
     setSteps([]);

     const trace: {level: number, text: string, result: number|null}[] = [];
     
     // The recursive function simulation
     const factorial = async (n: number, level: number): Promise<number> => {
        // CALL phase
        trace.push({ level, text: `Faktorial(${n}) dipanggil.`, result: null });
        setSteps([...trace]);
        await new Promise(r => setTimeout(r, 600));

        // Base case
        if (n <= 1) {
           trace.push({ level, text: `Kondisi Dasar! Faktorial(1) = 1. Return 1.`, result: 1 });
           setSteps([...trace]);
           await new Promise(r => setTimeout(r, 600));
           return 1;
        }

        // Recursive case
        trace.push({ level, text: `Menunggu Faktorial(${n-1})...`, result: null });
        setSteps([...trace]);
        await new Promise(r => setTimeout(r, 600));
        
        const childResult = await factorial(n - 1, level + 1);

        // RETURN phase
        const myResult = n * childResult;
        trace.push({ level, text: `Menerima ${childResult}. Hitung: ${n} * ${childResult} = ${myResult}. Return ${myResult}.`, result: myResult });
        setSteps([...trace]);
        await new Promise(r => setTimeout(r, 600));

        return myResult;
     };

     await factorial(number, 0);
     setIsAnimating(false);
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col bg-zinc-950 p-4 lg:p-8 overflow-y-auto custom-scrollbar">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Visualisasi Rekursi (Faktorial)</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-lg mx-auto">
           Fungsi yang memanggil dirinya sendiri sampai menemukan Base Case.
        </p>

        <div className="w-full max-w-3xl mx-auto space-y-4 pb-12">
           {steps.length === 0 && !isAnimating && (
              <div className="text-center text-zinc-600 italic py-12 border border-dashed border-zinc-800 rounded-3xl">
                 Tekan "Mulai Simulasi" untuk melihat Call Stack Rekursi.
              </div>
           )}

           {steps.map((step, idx) => {
              const isReturn = step.result !== null;
              
              return (
                 <div 
                   key={idx} 
                   className={`p-4 rounded-xl border flex items-center gap-4 transition-all animate-slide-up shadow-lg`}
                   style={{ 
                      marginLeft: `${step.level * 2}rem`,
                      backgroundColor: isReturn ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                      borderColor: isReturn ? 'rgba(16, 185, 129, 0.3)' : 'rgba(59, 130, 246, 0.3)'
                   }}
                 >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${isReturn ? 'bg-emerald-600' : 'bg-blue-600'}`}>
                       {isReturn ? '↑' : '↓'}
                    </div>
                    <div className="flex-1">
                       <p className={`font-mono text-sm md:text-base ${isReturn ? 'text-emerald-400 font-bold' : 'text-blue-300'}`}>
                          {step.text}
                       </p>
                    </div>
                    {isReturn && (
                       <div className="text-xl font-black text-white bg-black/50 px-3 py-1 rounded shadow">
                          {step.result}
                       </div>
                    )}
                 </div>
              );
           })}
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Call Stack Memory</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div>
            <div className="text-xs font-bold text-zinc-500 mb-2 uppercase">Hitung Faktorial (n!):</div>
            <div className="flex gap-2">
               <input 
                 type="number" min="1" max="6"
                 value={number} 
                 onChange={e=>setNumber(Math.min(6, Math.max(1, parseInt(e.target.value)||1)))} 
                 disabled={isAnimating}
                 className="bg-zinc-900 border border-zinc-700 text-white px-4 py-2 rounded-xl outline-none focus:border-purple-500 w-20 text-center text-xl font-bold"
               />
               <button 
                  onClick={runRecursion}
                  disabled={isAnimating}
                  className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl disabled:opacity-50 transition-all"
               >
                  ▶️ Mulai
               </button>
            </div>
            <p className="text-[10px] text-zinc-500 mt-2">Maksimal N=6 agar memori browser stabil.</p>
          </div>

          <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-700 space-y-2 font-mono text-xs overflow-hidden">
             <div className="text-pink-400">function <span className="text-blue-400">factorial</span>(n) {"{"}</div>
             <div className="pl-4 text-emerald-400">// Base Case</div>
             <div className="pl-4 text-white">if (n &lt;= 1) return 1;</div>
             <div className="pl-4 mt-2 text-rose-400">// Rekursi</div>
             <div className="pl-4 text-white">return n * <span className="text-blue-400">factorial</span>(n - 1);</div>
             <div className="text-pink-400">{"}"}</div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Kenapa butuh Base Case?</strong></p>
            <p>Jika tidak ada Base Case (kondisi berhenti), fungsi akan memanggil dirinya terus menerus tanpa henti sampai memori komputer penuh/jebol yang disebut <strong>Stack Overflow!</strong></p>
          </div>

        </div>
      </div>
    </div>
  );
}
