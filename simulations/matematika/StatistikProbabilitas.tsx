"use client";

import { useState } from "react";
import { Dices, RefreshCcw } from "lucide-react";

export default function StatistikProbabilitas() {
  const [rolls, setRolls] = useState<number[]>([]);
  const [isRolling, setIsRolling] = useState(false);

  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  rolls.forEach(r => counts[r as keyof typeof counts]++);
  
  const total = rolls.length;
  const maxCount = Math.max(...Object.values(counts), 1); // prevent division by zero

  const rollDice = (times: number) => {
    setIsRolling(true);
    // Simulate slight delay for single rolls for effect
    setTimeout(() => {
      const newRolls = Array.from({ length: times }, () => Math.floor(Math.random() * 6) + 1);
      setRolls(prev => [...prev, ...newRolls]);
      setIsRolling(false);
    }, times === 1 ? 300 : 0);
  };

  const reset = () => setRolls([]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative bg-zinc-950">
      <div className="flex-1 relative flex flex-col items-center justify-end p-8 pb-16">
        
        {/* Histogram */}
        <div className="w-full max-w-2xl h-80 flex items-end justify-between gap-2 border-b-2 border-white/20 pb-1 relative">
          
          {/* Y-axis indicator */}
          <div className="absolute -left-12 top-0 h-full flex flex-col justify-between text-zinc-500 text-xs font-mono">
            <span>{maxCount}</span>
            <span>{Math.floor(maxCount/2)}</span>
            <span>0</span>
          </div>

          {[1, 2, 3, 4, 5, 6].map(num => {
            const count = counts[num as keyof typeof counts];
            const heightPct = (count / maxCount) * 100;
            const expectedPct = total > 0 ? (total / 6 / maxCount) * 100 : 0;
            
            return (
              <div key={num} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full h-full relative flex items-end">
                  {/* Expected line */}
                  <div className="absolute w-full border-t border-dashed border-white/20" style={{ bottom: `${expectedPct}%` }} />
                  
                  {/* Bar */}
                  <div 
                    className="w-full bg-indigo-500 hover:bg-indigo-400 transition-all duration-500 rounded-t-sm relative"
                    style={{ height: `${heightPct}%` }}
                  >
                    <div className="absolute -top-6 w-full text-center text-xs font-mono text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      {count}
                    </div>
                  </div>
                </div>
                <div className="text-xl">🎲 {num}</div>
                <div className="text-xs text-zinc-500 font-mono">
                  {total > 0 ? ((count / total) * 100).toFixed(1) : "0"}%
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-8 text-zinc-400">Total Lemparan: <span className="font-mono text-white font-bold">{total}</span></div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Probabilitas Dadu</h3></div>
        <div className="p-6 flex-1 overflow-y-auto flex flex-col items-center gap-6">
          
          <div className={`w-32 h-32 bg-white rounded-3xl flex items-center justify-center text-black shadow-[0_0_30px_rgba(255,255,255,0.2)] ${isRolling ? 'animate-spin' : ''}`}>
            {total > 0 ? (
              <span className="text-6xl">{rolls[rolls.length - 1]}</span>
            ) : (
              <Dices className="w-16 h-16 text-zinc-300" />
            )}
          </div>

          <div className="w-full space-y-3">
            <button onClick={() => rollDice(1)} disabled={isRolling} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-all">Lempar 1x</button>
            <button onClick={() => rollDice(10)} disabled={isRolling} className="w-full py-3 bg-indigo-700 hover:bg-indigo-600 rounded-xl font-bold transition-all">Lempar 10x</button>
            <button onClick={() => rollDice(100)} disabled={isRolling} className="w-full py-3 bg-indigo-900 hover:bg-indigo-800 rounded-xl font-bold transition-all border border-indigo-500/30">Lempar 100x</button>
          </div>

          <div className="w-full p-4 bg-white/5 rounded-xl text-xs text-zinc-400 mt-auto">
            Hukum Bilangan Besar: Semakin banyak dadu dilempar, persentase kemunculan setiap angka akan mendekati probabilitas teoretis (16.6%).
          </div>
        </div>
        <div className="p-4 border-t border-white/10 bg-black/20">
          <button onClick={reset} className="w-full py-2.5 bg-zinc-800 text-white font-semibold rounded-lg hover:bg-zinc-700 flex items-center justify-center gap-2"><RefreshCcw className="w-4 h-4" /> Reset Data</button>
        </div>
      </div>
    </div>
  );
}
