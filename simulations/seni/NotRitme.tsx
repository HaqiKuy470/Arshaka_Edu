"use client";

import { useState, useEffect } from "react";

export default function NotRitme() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [beat, setBeat] = useState(0);

  // Time signature 4/4
  const totalBeats = 16; // 4 measures of 4 beats

  useEffect(() => {
     let interval: NodeJS.Timeout;
     if (isPlaying) {
        // Calculate ms per beat (quarter note)
        const msPerBeat = 60000 / bpm;
        
        interval = setInterval(() => {
           setBeat(prev => (prev + 1) % totalBeats);
        }, msPerBeat);
     } else {
        setBeat(0);
     }
     return () => clearInterval(interval);
  }, [isPlaying, bpm]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col bg-zinc-950 p-4 lg:p-8 overflow-y-auto">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Notasi & Ritme Musik (4/4)</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-lg mx-auto">
           Memahami nilai ketukan (Beat) dalam sebuah birama.
        </p>

        <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
           
           {/* Metronome Bar */}
           <div className="bg-zinc-900 border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col items-center">
              <div className="text-zinc-500 font-bold mb-4 uppercase tracking-widest text-sm">Metronome Indicator</div>
              <div className="flex w-full h-8 bg-black rounded-lg overflow-hidden border border-zinc-800">
                 {Array.from({length: 16}).map((_, i) => (
                    <div 
                      key={i} 
                      className={`flex-1 border-r border-zinc-800 last:border-0 transition-all duration-75 ${beat === i && isPlaying ? (i % 4 === 0 ? 'bg-rose-500 shadow-[0_0_20px_#e11d48] scale-110 z-10' : 'bg-emerald-500') : 'bg-transparent'}`}
                    />
                 ))}
              </div>
              <div className="flex w-full mt-2 px-2 text-[10px] text-zinc-600 font-bold justify-between">
                 <span>1</span><span>2</span><span>3</span><span>4</span>
                 <span>1</span><span>2</span><span>3</span><span>4</span>
                 <span>1</span><span>2</span><span>3</span><span>4</span>
                 <span>1</span><span>2</span><span>3</span><span>4</span>
              </div>
           </div>

           {/* Note Values Comparison */}
           <div className="space-y-4">
              
              {/* Whole Note (1) */}
              <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-center gap-6">
                 <div className="w-32 flex flex-col items-center shrink-0">
                    <span className="text-4xl text-white">𝅝</span>
                    <span className="font-bold text-emerald-400 mt-2">Penuh (Whole)</span>
                    <span className="text-xs text-zinc-500">4 Ketuk</span>
                 </div>
                 <div className="flex-1 flex gap-2 w-full h-12 bg-black rounded border border-zinc-800 relative">
                    <div className={`absolute left-0 top-0 bottom-0 bg-emerald-500/30 transition-all border-r-2 border-emerald-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`} style={{ width: `${((Math.floor(beat/4)*4 + 4) / 16) * 100}%` }} />
                 </div>
              </div>

              {/* Half Note (1/2) */}
              <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-center gap-6">
                 <div className="w-32 flex flex-col items-center shrink-0">
                    <span className="text-4xl text-white">𝅗𝅥</span>
                    <span className="font-bold text-blue-400 mt-2">Setengah (Half)</span>
                    <span className="text-xs text-zinc-500">2 Ketuk</span>
                 </div>
                 <div className="flex-1 flex w-full h-12 bg-black rounded border border-zinc-800 relative">
                    <div className="w-1/2 border-r border-zinc-800" />
                    <div className={`absolute left-0 top-0 bottom-0 bg-blue-500/30 transition-all border-r-2 border-blue-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`} style={{ width: `${((Math.floor(beat/2)*2 + 2) / 16) * 100}%` }} />
                 </div>
              </div>

              {/* Quarter Note (1/4) */}
              <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-center gap-6">
                 <div className="w-32 flex flex-col items-center shrink-0">
                    <span className="text-4xl text-white">♩</span>
                    <span className="font-bold text-amber-400 mt-2">Seperempat</span>
                    <span className="text-xs text-zinc-500">1 Ketuk (1 Beat)</span>
                 </div>
                 <div className="flex-1 flex w-full h-12 bg-black rounded border border-zinc-800 relative">
                    {Array.from({length: 4}).map((_, i) => <div key={i} className="flex-1 border-r border-zinc-800 last:border-0" />)}
                    <div className={`absolute left-0 top-0 bottom-0 bg-amber-500/30 transition-all border-r-2 border-amber-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`} style={{ width: `${((beat + 1) / 16) * 100}%` }} />
                 </div>
              </div>

           </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Kontrol Metronome</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <button 
             onClick={()=>setIsPlaying(!isPlaying)}
             className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all ${isPlaying ? 'bg-rose-600 hover:bg-rose-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}
          >
             {isPlaying ? '⏹️ Hentikan' : '▶️ Mainkan Ritme'}
          </button>

          <div className="pt-4 border-t border-white/10">
            <div className="text-xs font-bold text-zinc-400 mb-4 uppercase">Tempo (BPM: Beats Per Minute)</div>
            <div className="flex items-center gap-4">
               <span className="text-sm font-mono text-zinc-500">60</span>
               <input 
                 type="range" min="60" max="200" step="10" 
                 value={bpm} 
                 onChange={e=>setBpm(parseInt(e.target.value))} 
                 className="w-full accent-blue-500" 
               />
               <span className="text-sm font-mono text-zinc-500">200</span>
            </div>
            <div className="text-center mt-2 text-2xl font-black text-white">{bpm}</div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p><strong>Apa itu Birama 4/4?</strong></p>
            <p>Artinya dalam 1 ruas birama (kotak measure) terdapat 4 buah ketukan, dan masing-masing ketukan bernilai 1/4 (Quarter Note). Ini adalah birama paling umum dalam musik pop/rock.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
