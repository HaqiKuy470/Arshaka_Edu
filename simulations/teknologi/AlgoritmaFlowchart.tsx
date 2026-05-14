"use client";

import { useState, useEffect } from "react";

export default function AlgoritmaFlowchart() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [variables, setVariables] = useState({ air: 0, kopi: 0, gula: 0, status: "Belum Siap" });

  const flowchartSteps = [
    { id: 0, type: "terminal", label: "Mulai", action: () => setVariables({ air: 0, kopi: 0, gula: 0, status: "Persiapan" }) },
    { id: 1, type: "process", label: "Rebus Air hingga mendidih", action: () => setVariables(v => ({...v, air: 100})) },
    { id: 2, type: "io", label: "Masukkan 1 sendok Kopi", action: () => setVariables(v => ({...v, kopi: 1})) },
    { id: 3, type: "decision", label: "Suka Manis?", isDecision: true },
    { id: 4, type: "io", label: "Masukkan 2 sendok Gula", action: () => setVariables(v => ({...v, gula: 2})), branch: "YA" },
    { id: 5, type: "process", label: "Aduk hingga rata", action: () => setVariables(v => ({...v, status: "Diaduk..."})) },
    { id: 6, type: "io", label: "Tuang air panas", action: () => setVariables(v => ({...v, status: "Diseduh"})) },
    { id: 7, type: "terminal", label: "Kopi Siap Diminum", action: () => setVariables(v => ({...v, status: "☕ Kopi Selesai!"})) }
  ];

  // Execution path logic (if like sweet: 0->1->2->3->4->5->6->7, if not: 0->1->2->3->5->6->7)
  const executionPathYes = [0, 1, 2, 3, 4, 6, 5, 7];
  const executionPathNo = [0, 1, 2, 3, 6, 5, 7]; // skipping sugar

  const [path, setPath] = useState(executionPathYes);
  const [pathIdx, setPathIdx] = useState(0);
  const [likeSweet, setLikeSweet] = useState(true);

  useEffect(() => {
     let timer: NodeJS.Timeout;
     if (isPlaying) {
        timer = setTimeout(() => {
           if (pathIdx < path.length - 1) {
              const nextStepId = path[pathIdx + 1];
              setPathIdx(p => p + 1);
              setStep(nextStepId);
              if (flowchartSteps[nextStepId].action) {
                 flowchartSteps[nextStepId].action!();
              }
           } else {
              setIsPlaying(false);
           }
        }, 1500);
     }
     return () => clearTimeout(timer);
  }, [isPlaying, pathIdx, path, flowchartSteps]);

  const handleReset = () => {
     setIsPlaying(false);
     setPathIdx(0);
     setStep(0);
     setVariables({ air: 0, kopi: 0, gula: 0, status: "Belum Siap" });
     setPath(likeSweet ? executionPathYes : executionPathNo);
  };

  const toggleSweet = () => {
     const newVal = !likeSweet;
     setLikeSweet(newVal);
     setPath(newVal ? executionPathYes : executionPathNo);
     setPathIdx(0);
     setStep(0);
     setVariables({ air: 0, kopi: 0, gula: 0, status: "Belum Siap" });
  };

  const getShapeClasses = (type: string, isActive: boolean) => {
     const base = `flex items-center justify-center p-4 text-center text-sm font-bold transition-all duration-300 relative border-2 shadow-lg w-48 z-10`;
     const color = isActive ? "bg-emerald-500 text-white border-emerald-300 scale-110 shadow-[0_0_20px_rgba(16,185,129,0.8)]" : "bg-zinc-800 text-zinc-300 border-zinc-600";
     
     switch(type) {
        case "terminal": return `${base} ${color} rounded-full`; // Oval
        case "process": return `${base} ${color} rounded`; // Rectangle
        case "io": return `${base} ${color} transform -skew-x-12`; // Parallelogram
        case "decision": return `${base} ${color} rotate-45 aspect-square w-32`; // Diamond
        default: return `${base} ${color}`;
     }
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center bg-zinc-950 p-4 lg:p-8 overflow-y-auto">
        
        <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-8 items-start">
           
           {/* Flowchart Visualizer */}
           <div className="flex-1 flex flex-col items-center relative">
              <h2 className="text-2xl font-bold text-white mb-8">Flowchart Membuat Kopi</h2>

              {/* Central Line */}
              <div className="absolute top-[80px] bottom-[40px] left-1/2 w-1 bg-zinc-700 -translate-x-1/2 z-0" />

              <div className="flex flex-col items-center gap-8 relative z-10">
                 {/* Step 0 */}
                 <div className={getShapeClasses("terminal", step === 0)}>{flowchartSteps[0].label}</div>
                 
                 {/* Step 1 */}
                 <div className={getShapeClasses("process", step === 1)}>{flowchartSteps[1].label}</div>
                 
                 {/* Step 2 */}
                 <div className={getShapeClasses("io", step === 2)}>
                    <div className="skew-x-12">{flowchartSteps[2].label}</div>
                 </div>

                 {/* Step 3 (Decision) */}
                 <div className="relative mt-4 mb-4">
                    <div className={getShapeClasses("decision", step === 3)}>
                       <div className="-rotate-45">{flowchartSteps[3].label}</div>
                    </div>
                    {/* YES Branch */}
                    <div className={`absolute top-1/2 -right-32 w-32 h-1 -translate-y-1/2 ${step===3 && likeSweet ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-zinc-700'}`}>
                       <span className={`absolute -top-6 left-1/2 -translate-x-1/2 font-bold text-xs ${step===3 && likeSweet ? 'text-emerald-400' : 'text-zinc-500'}`}>YA</span>
                    </div>
                    {/* NO Branch */}
                    <div className={`absolute top-full left-1/2 h-16 w-1 -translate-x-1/2 ${step===3 && !likeSweet ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-zinc-700'}`}>
                       <span className={`absolute top-2 -right-8 font-bold text-xs ${step===3 && !likeSweet ? 'text-emerald-400' : 'text-zinc-500'}`}>TIDAK</span>
                    </div>
                 </div>

                 {/* Flex row for branches */}
                 <div className="flex gap-16 relative">
                    {/* Step 6 & 5 (Main Line - No Sugar) */}
                    <div className="flex flex-col items-center gap-8 mt-4">
                       <div className={getShapeClasses("io", step === 6)}>
                          <div className="skew-x-12">{flowchartSteps[6].label}</div>
                       </div>
                       <div className={getShapeClasses("process", step === 5)}>{flowchartSteps[5].label}</div>
                    </div>

                    {/* Step 4 (Yes Sugar Branch) */}
                    <div className="absolute -top-4 -right-12 translate-x-full">
                       <div className={getShapeClasses("io", step === 4)}>
                          <div className="skew-x-12">{flowchartSteps[4].label}</div>
                       </div>
                       {/* Line back to main */}
                       <div className={`absolute top-full left-1/2 h-16 w-1 -translate-x-1/2 ${step===4 ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-zinc-700'}`} />
                       <div className={`absolute top-[calc(100%+4rem)] right-1/2 w-48 h-1 ${step===4 ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-zinc-700'}`} />
                    </div>
                 </div>

                 {/* Step 7 (End) */}
                 <div className={getShapeClasses("terminal", step === 7)}>{flowchartSteps[7].label}</div>
              </div>

           </div>

           {/* Execution Memory / State */}
           <div className="w-full lg:w-80 flex flex-col gap-6 sticky top-8">
              
              <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl shadow-xl">
                 <h3 className="font-bold text-white mb-4 border-b border-white/10 pb-2">Status Variabel (Memori)</h3>
                 <div className="space-y-4 font-mono text-sm">
                    <div className="flex justify-between items-center">
                       <span className="text-blue-400">Air:</span>
                       <span className="text-white bg-black px-2 py-1 rounded">{variables.air}°C</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-amber-700">Kopi:</span>
                       <span className="text-white bg-black px-2 py-1 rounded">{variables.kopi} Sdk</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-white">Gula:</span>
                       <span className="text-white bg-black px-2 py-1 rounded">{variables.gula} Sdk</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10 text-center">
                       <span className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Kondisi Saat Ini:</span>
                       <span className={`font-bold text-lg ${step === 7 ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`}>{variables.status}</span>
                    </div>
                 </div>
              </div>

              {/* Controls */}
              <div className="flex gap-2">
                 {!isPlaying && pathIdx === 0 && (
                    <button onClick={() => { setIsPlaying(true); flowchartSteps[0].action!(); }} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all">
                       ▶️ Jalankan
                    </button>
                 )}
                 {(isPlaying || pathIdx > 0) && (
                    <button onClick={handleReset} className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all">
                       ⏹️ Reset
                    </button>
                 )}
              </div>

              {/* Inputs */}
              <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl shadow-xl">
                 <h3 className="font-bold text-white mb-4 border-b border-white/10 pb-2">Input User</h3>
                 <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-300">Mau pakai Gula?</span>
                    <button 
                      onClick={toggleSweet} 
                      disabled={isPlaying || pathIdx > 0}
                      className={`px-4 py-1 rounded-full text-xs font-bold transition-all disabled:opacity-50 ${likeSweet ? 'bg-emerald-600 text-white' : 'bg-zinc-700 text-zinc-400'}`}
                    >
                       {likeSweet ? 'YA' : 'TIDAK'}
                    </button>
                 </div>
              </div>

           </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Logika Pemrograman</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed">
            <p><strong>Algoritma</strong> adalah urutan langkah logis untuk menyelesaikan suatu masalah.</p>
            <p>Sedangkan <strong>Flowchart</strong> adalah representasi visual dari algoritma tersebut menggunakan simbol-simbol standar.</p>
          </div>

          <div className="space-y-2 mt-4">
             <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Simbol Flowchart:</div>
             <div className="flex items-center gap-3 text-xs">
                <div className="w-10 h-6 bg-zinc-700 rounded-full flex-shrink-0" />
                <span className="text-zinc-300"><strong>Terminal:</strong> Mulai / Selesai</span>
             </div>
             <div className="flex items-center gap-3 text-xs">
                <div className="w-10 h-6 bg-zinc-700 rounded flex-shrink-0" />
                <span className="text-zinc-300"><strong>Proses:</strong> Eksekusi / Hitung</span>
             </div>
             <div className="flex items-center gap-3 text-xs">
                <div className="w-10 h-6 bg-zinc-700 transform -skew-x-12 flex-shrink-0" />
                <span className="text-zinc-300"><strong>I/O:</strong> Input atau Output</span>
             </div>
             <div className="flex items-center gap-3 text-xs">
                <div className="w-6 h-6 bg-zinc-700 rotate-45 mx-2 flex-shrink-0" />
                <span className="text-zinc-300"><strong>Decision:</strong> Percabangan (IF/ELSE)</span>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
