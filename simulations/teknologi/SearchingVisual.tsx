"use client";

import { useState, useRef } from "react";

export default function SearchingVisual() {
  // Sorted array for binary search
  const baseArray = [5, 12, 18, 24, 31, 38, 42, 55, 63, 71, 79, 85, 90, 94];
  const [target, setTarget] = useState<number>(42);
  
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [foundIdx, setFoundIdx] = useState<number | null>(null);
  const [range, setRange] = useState<{low: number, high: number} | null>(null);
  
  const [isSearching, setIsSearching] = useState(false);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  const clearTimeouts = () => {
     timeoutRefs.current.forEach(clearTimeout);
     timeoutRefs.current = [];
  };

  const resetState = () => {
     clearTimeouts();
     setActiveIdx(null);
     setFoundIdx(null);
     setRange(null);
     setIsSearching(false);
  };

  // --- Linear Search ---
  const linearSearch = async () => {
     if(isSearching) return;
     resetState();
     setIsSearching(true);

     for (let i = 0; i < baseArray.length; i++) {
        setActiveIdx(i);
        
        await new Promise(r => {
           const t = setTimeout(r, 400);
           timeoutRefs.current.push(t);
        });

        if (baseArray[i] === target) {
           setFoundIdx(i);
           setIsSearching(false);
           return;
        }
     }
     
     // Not found
     setActiveIdx(null);
     setIsSearching(false);
  };

  // --- Binary Search ---
  const binarySearch = async () => {
     if(isSearching) return;
     resetState();
     setIsSearching(true);

     let low = 0;
     let high = baseArray.length - 1;

     while (low <= high) {
        setRange({low, high});
        
        // Wait for visual update of range
        await new Promise(r => {
           const t = setTimeout(r, 600);
           timeoutRefs.current.push(t);
        });

        let mid = Math.floor((low + high) / 2);
        setActiveIdx(mid);

        await new Promise(r => {
           const t = setTimeout(r, 800);
           timeoutRefs.current.push(t);
        });

        if (baseArray[mid] === target) {
           setFoundIdx(mid);
           setIsSearching(false);
           return;
        } else if (baseArray[mid] < target) {
           low = mid + 1;
        } else {
           high = mid - 1;
        }
     }

     // Not found
     setRange(null);
     setActiveIdx(null);
     setIsSearching(false);
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Visualisasi Searching</h2>
        <p className="text-zinc-400 mb-12 text-center max-w-lg">Bagaimana komputer mencari sebuah data spesifik dalam ribuan data?</p>

        <div className="flex items-center gap-4 mb-8 bg-zinc-900 border border-white/10 p-4 rounded-xl shadow-lg">
           <span className="text-zinc-400 font-bold">Data yang dicari (Target):</span>
           <div className="text-3xl font-black text-white bg-black px-4 py-2 rounded-lg border border-zinc-700">
              {target}
           </div>
        </div>

        {/* Array Visualization */}
        <div className="flex flex-wrap justify-center gap-2 max-w-4xl relative">
           {baseArray.map((val, idx) => {
              const isTarget = val === target;
              const isFound = foundIdx === idx;
              const isActive = activeIdx === idx;
              
              // Binary search range dims outside bounds
              const inRange = range ? (idx >= range.low && idx <= range.high) : true;

              let btnClasses = "w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-xl font-mono text-xl font-bold transition-all duration-300 border-2 ";
              
              if (isFound) {
                 btnClasses += "bg-emerald-600 border-emerald-400 text-white scale-125 shadow-[0_0_20px_#10b981] z-20";
              } else if (isActive) {
                 btnClasses += "bg-rose-600 border-rose-400 text-white scale-110 shadow-lg z-10";
              } else if (!inRange) {
                 btnClasses += "bg-black border-zinc-800 text-zinc-700 opacity-30 scale-90";
              } else {
                 btnClasses += "bg-zinc-800 border-zinc-600 text-zinc-300";
              }

              return (
                 <div key={idx} className="relative flex flex-col items-center">
                    <div className={btnClasses}>
                       {val}
                    </div>
                    {/* Index Indicator */}
                    <span className="text-[10px] text-zinc-600 mt-1 font-mono">[{idx}]</span>
                    
                    {/* Range Pointers (Binary Search) */}
                    {range && range.low === idx && !isFound && <div className="absolute -bottom-6 text-xs text-blue-400 font-bold animate-bounce">Low</div>}
                    {range && range.high === idx && !isFound && <div className="absolute -bottom-6 text-xs text-amber-400 font-bold animate-bounce">High</div>}
                    {isActive && !isFound && range && <div className="absolute -top-6 text-xs text-rose-400 font-bold animate-bounce">Mid</div>}
                 </div>
              );
           })}
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Kontrol Pencarian</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div>
            <div className="text-xs font-bold text-zinc-500 mb-2 uppercase">Ubah Target Pencarian:</div>
            <select 
               value={target} 
               onChange={(e) => {setTarget(Number(e.target.value)); resetState();}}
               disabled={isSearching}
               className="w-full bg-zinc-900 border border-zinc-700 text-white p-3 rounded-lg outline-none focus:border-emerald-500"
            >
               {baseArray.map(n => <option key={n} value={n}>{n}</option>)}
               <option value={99}>99 (Tidak Ada)</option>
            </select>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-6">
             
             <button 
                onClick={linearSearch} 
                disabled={isSearching}
                className="w-full p-4 text-left rounded-xl bg-sky-900/40 border border-sky-500/50 hover:bg-sky-800/60 disabled:opacity-50 transition-all group"
             >
                <div className="font-bold text-sky-300 mb-1 flex justify-between">
                   <span>🚶 Linear Search</span>
                   <span className="opacity-0 group-hover:opacity-100">▶️</span>
                </div>
                <div className="text-xs text-zinc-400">Mencari satu per satu dari paling depan hingga ketemu. Cocok untuk data acak. O(n).</div>
             </button>

             <button 
                onClick={binarySearch} 
                disabled={isSearching}
                className="w-full p-4 text-left rounded-xl bg-purple-900/40 border border-purple-500/50 hover:bg-purple-800/60 disabled:opacity-50 transition-all group"
             >
                <div className="font-bold text-purple-300 mb-1 flex justify-between">
                   <span>✂️ Binary Search</span>
                   <span className="opacity-0 group-hover:opacity-100">▶️</span>
                </div>
                <div className="text-xs text-zinc-400">Membelah data menjadi dua secara terus menerus (tengah/mid). Syarat: Data WAJIB terurut! O(log n).</div>
             </button>
             
          </div>

        </div>
      </div>
    </div>
  );
}
