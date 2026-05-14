"use client";

import { useState, useRef } from "react";

export default function SortingVisual() {
  const [array, setArray] = useState<number[]>([45, 12, 88, 34, 67, 9, 56, 23, 78, 91, 15, 62]);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  const generateNewArray = () => {
     if(isSorting) return;
     const newArr = Array.from({length: 12}, () => Math.floor(Math.random() * 90) + 10);
     setArray(newArr);
     setActiveIndices([]);
     setSortedIndices([]);
  };

  const clearTimeouts = () => {
     timeoutRefs.current.forEach(clearTimeout);
     timeoutRefs.current = [];
  };

  // --- Bubble Sort ---
  const bubbleSort = async () => {
     if(isSorting) return;
     setIsSorting(true);
     clearTimeouts();
     setSortedIndices([]);

     let arr = [...array];
     let sorted = [];

     for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
           setActiveIndices([j, j + 1]);
           await new Promise(r => {
              const t = setTimeout(r, 300);
              timeoutRefs.current.push(t);
           });

           if (arr[j] > arr[j + 1]) {
              // Swap
              let temp = arr[j];
              arr[j] = arr[j + 1];
              arr[j + 1] = temp;
              setArray([...arr]);
           }
        }
        sorted.push(arr.length - 1 - i);
        setSortedIndices([...sorted]);
     }
     
     setActiveIndices([]);
     setIsSorting(false);
  };

  // --- Selection Sort ---
  const selectionSort = async () => {
    if(isSorting) return;
    setIsSorting(true);
    clearTimeouts();
    setSortedIndices([]);

    let arr = [...array];
    let sorted = [];

    for (let i = 0; i < arr.length; i++) {
       let minIdx = i;
       
       for (let j = i + 1; j < arr.length; j++) {
          setActiveIndices([minIdx, j]);
          await new Promise(r => {
             const t = setTimeout(r, 200);
             timeoutRefs.current.push(t);
          });

          if (arr[j] < arr[minIdx]) {
             minIdx = j;
          }
       }
       
       if (minIdx !== i) {
          let temp = arr[i];
          arr[i] = arr[minIdx];
          arr[minIdx] = temp;
          setArray([...arr]);
       }
       
       sorted.push(i);
       setSortedIndices([...sorted]);
    }

    setActiveIndices([]);
    setIsSorting(false);
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Visualisasi Algoritma Sorting</h2>
        <p className="text-zinc-400 mb-12 text-center max-w-lg">Bagaimana komputer mengurutkan data acak menjadi rapi?</p>

        {/* Visualization Area */}
        <div className="flex items-end justify-center gap-2 md:gap-4 h-64 w-full max-w-3xl border-b-2 border-zinc-700 pb-2">
           {array.map((val, idx) => {
              const isActive = activeIndices.includes(idx);
              const isSorted = sortedIndices.includes(idx);
              
              let bgColor = "bg-sky-500"; // Default
              if (isActive) bgColor = "bg-rose-500 shadow-[0_0_15px_#e11d48]";
              else if (isSorted) bgColor = "bg-emerald-500";

              return (
                 <div key={idx} className="flex flex-col items-center flex-1 group">
                    <div 
                      className={`w-full rounded-t-md transition-all duration-300 relative ${bgColor}`} 
                      style={{ height: `${val}%` }}
                    >
                       <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 bg-black px-1 rounded">
                          {val}
                       </div>
                    </div>
                 </div>
              );
           })}
        </div>

        {/* Array Values Raw */}
        <div className="mt-8 flex gap-2 flex-wrap justify-center max-w-3xl">
           {array.map((val, idx) => (
              <div key={idx} className={`w-10 h-10 flex items-center justify-center rounded font-mono font-bold text-sm border ${activeIndices.includes(idx) ? 'bg-rose-900 border-rose-500 text-white scale-110 shadow-lg' : sortedIndices.includes(idx) ? 'bg-emerald-900 border-emerald-500 text-emerald-300' : 'bg-zinc-900 border-zinc-700 text-zinc-400'}`}>
                 {val}
              </div>
           ))}
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Kontrol Algoritma</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <button 
             onClick={generateNewArray} 
             disabled={isSorting}
             className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-white text-sm font-bold disabled:opacity-50 transition-all"
          >
             🔀 Acak Data Baru
          </button>

          <div className="space-y-4 border-t border-white/10 pt-6">
             <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Pilih Algoritma:</div>
             
             <button 
                onClick={bubbleSort} 
                disabled={isSorting}
                className="w-full p-4 text-left rounded-xl bg-indigo-900/40 border border-indigo-500/50 hover:bg-indigo-800/60 disabled:opacity-50 transition-all group"
             >
                <div className="font-bold text-indigo-300 mb-1 flex justify-between">
                   <span>🫧 Bubble Sort</span>
                   <span className="opacity-0 group-hover:opacity-100">▶️</span>
                </div>
                <div className="text-xs text-zinc-400">Menukar elemen bersebelahan secara berulang jika urutannya salah. O(n²).</div>
             </button>

             <button 
                onClick={selectionSort} 
                disabled={isSorting}
                className="w-full p-4 text-left rounded-xl bg-amber-900/40 border border-amber-500/50 hover:bg-amber-800/60 disabled:opacity-50 transition-all group"
             >
                <div className="font-bold text-amber-300 mb-1 flex justify-between">
                   <span>🎯 Selection Sort</span>
                   <span className="opacity-0 group-hover:opacity-100">▶️</span>
                </div>
                <div className="text-xs text-zinc-400">Mencari nilai terkecil di sisa array, lalu menaruhnya di ujung kiri. O(n²).</div>
             </button>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-2 text-xs text-zinc-300 mt-4">
             <div className="flex items-center gap-2"><div className="w-3 h-3 bg-sky-500 rounded-sm" /> Belum terurut</div>
             <div className="flex items-center gap-2"><div className="w-3 h-3 bg-rose-500 rounded-sm" /> Sedang dibandingkan / ditukar</div>
             <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-sm" /> Posisi Final (Terkunci)</div>
          </div>

        </div>
      </div>
    </div>
  );
}
