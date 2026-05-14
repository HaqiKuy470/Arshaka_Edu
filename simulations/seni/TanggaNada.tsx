"use client";

import { useState } from "react";

export default function TanggaNada() {
  const [scaleType, setScaleType] = useState<"mayor"|"minor"|"pentatonic">("mayor");
  const [activeNote, setActiveNote] = useState<number|null>(null);

  // Piano keys base (C Major scale)
  const keys = [
    { id: 1, note: "C", type: "white" },
    { id: 2, note: "C#", type: "black" },
    { id: 3, note: "D", type: "white" },
    { id: 4, note: "D#", type: "black" },
    { id: 5, note: "E", type: "white" },
    { id: 6, note: "F", type: "white" },
    { id: 7, note: "F#", type: "black" },
    { id: 8, note: "G", type: "white" },
    { id: 9, note: "G#", type: "black" },
    { id: 10, note: "A", type: "white" },
    { id: 11, note: "A#", type: "black" },
    { id: 12, note: "B", type: "white" },
    { id: 13, note: "C5", type: "white" }, // Next octave
  ];

  // Scale formulas (indices 1-based matching IDs)
  // Major: W-W-H-W-W-W-H (C-D-E-F-G-A-B-C) => 1,3,5,6,8,10,12,13
  const majorScale = [1, 3, 5, 6, 8, 10, 12, 13];
  
  // Minor (Natural): W-H-W-W-H-W-W (A-B-C-D-E-F-G-A relative minor, let's just do C minor for mapping: C-D-Eb-F-G-Ab-Bb-C)
  // C-D-D#-F-G-G#-A#-C => 1, 3, 4, 6, 8, 9, 11, 13
  const minorScale = [1, 3, 4, 6, 8, 9, 11, 13];

  // Pentatonic Major: 1,2,3,5,6 of major scale (C-D-E-G-A) => 1, 3, 5, 8, 10, 13
  const pentatonicScale = [1, 3, 5, 8, 10, 13];

  const getActiveScale = () => {
     if (scaleType === "mayor") return majorScale;
     if (scaleType === "minor") return minorScale;
     return pentatonicScale;
  };

  const playNote = (id: number) => {
     setActiveNote(id);
     setTimeout(() => setActiveNote(null), 300);
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center bg-zinc-950 p-4 lg:p-8 overflow-y-auto">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Tangga Nada (Scales)</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-lg mx-auto">
           Kumpulan nada yang disusun berjenjang untuk membangun sebuah lagu.
        </p>

        <div className="w-full max-w-4xl bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative min-h-[400px] flex flex-col justify-center overflow-hidden">
           
           <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-emerald-400 capitalize">C {scaleType === 'pentatonic' ? 'Pentatonik Mayor' : scaleType}</h3>
              <p className="text-zinc-400 mt-2 font-mono">
                 Jarak Nada: 
                 {scaleType === "mayor" && " 1 - 1 - 1/2 - 1 - 1 - 1 - 1/2"}
                 {scaleType === "minor" && " 1 - 1/2 - 1 - 1 - 1/2 - 1 - 1"}
                 {scaleType === "pentatonic" && " Hanya 5 Nada Utama (Tanpa F dan B)"}
              </p>
           </div>

           {/* Piano Keyboard Visual */}
           <div className="relative h-64 flex justify-center isolate">
              
              {/* White Keys */}
              <div className="flex h-full border-t-8 border-x-8 border-zinc-800 rounded-t-lg overflow-hidden bg-black gap-[2px] p-[2px]">
                 {keys.filter(k => k.type === "white").map(key => {
                    const isInScale = getActiveScale().includes(key.id);
                    const isPressed = activeNote === key.id;
                    return (
                       <div 
                         key={key.id}
                         onClick={() => playNote(key.id)}
                         className={`w-12 sm:w-16 h-full rounded-b border border-zinc-800 relative cursor-pointer transition-all ${isPressed ? 'bg-zinc-300 shadow-inner' : isInScale ? 'bg-white shadow-md' : 'bg-zinc-700 opacity-30'} flex flex-col justify-end pb-4 items-center`}
                       >
                          {isInScale && <div className={`w-3 h-3 rounded-full mb-2 ${scaleType === 'mayor' ? 'bg-blue-500' : scaleType === 'minor' ? 'bg-rose-500' : 'bg-amber-500'}`} />}
                          <span className={`font-bold ${isPressed ? 'text-zinc-800' : isInScale ? 'text-zinc-400' : 'text-zinc-900'}`}>{key.note}</span>
                       </div>
                    );
                 })}
              </div>

              {/* Black Keys (Absolute positioned over white keys) */}
              <div className="absolute top-0 flex justify-center pointer-events-none w-full" style={{ paddingLeft: '2px', paddingRight: '2px' }}>
                 {/* This layout mapping is tricky. In C-scale: C(w), C#(b), D(w), D#(b), E(w), F(w), F#(b), G(w), G#(b), A(w), A#(b), B(w), C5(w) */}
                 {/* We'll manually place them using absolute positioning relative to their surrounding white keys. */}
                 {/* For a generic approach, we iterate through all keys and calculate left offset. */}
                 {keys.map((key, index) => {
                    if (key.type === "white") return null;
                    const isInScale = getActiveScale().includes(key.id);
                    const isPressed = activeNote === key.id;
                    
                    // Count how many white keys came BEFORE this black key to calculate position
                    let whiteCountBefore = 0;
                    for (let i = 0; i < index; i++) {
                       if (keys[i].type === "white") whiteCountBefore++;
                    }
                    
                    // w-12 sm:w-16 = 48px or 64px width. +2px gap.
                    // For simplicity, we use CSS classes based on standard piano layout.
                    
                    return (
                       <div 
                         key={key.id}
                         onClick={() => playNote(key.id)}
                         className={`absolute top-0 w-8 sm:w-10 h-40 rounded-b border border-zinc-900 pointer-events-auto cursor-pointer transition-all z-10 flex flex-col justify-end pb-4 items-center ${isPressed ? 'bg-zinc-800 shadow-inner' : isInScale ? 'bg-zinc-950 shadow-md border-b-2 border-b-zinc-700' : 'bg-black opacity-30'}`}
                         style={{ 
                            left: `calc(50% - ${(8 * 32)}px + ${(whiteCountBefore * 64) - 20}px)` // Rough math for sm breakpoint
                         }}
                       >
                          {isInScale && <div className={`w-2 h-2 rounded-full mb-1 ${scaleType === 'mayor' ? 'bg-blue-500' : scaleType === 'minor' ? 'bg-rose-500' : 'bg-amber-500'}`} />}
                          <span className={`text-[10px] font-bold ${isInScale ? 'text-zinc-500' : 'text-zinc-800'}`}>{key.note}</span>
                       </div>
                    );
                 })}
              </div>

           </div>

           <div className="mt-8 text-center text-zinc-500 text-sm">
              Klik pada tuts piano (yang terang) untuk melihat letak nada dalam tangga nada tersebut.
           </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Jenis Tangga Nada</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          <button 
             onClick={()=>setScaleType("mayor")} 
             className={`w-full p-4 flex flex-col gap-2 text-left rounded-xl transition-all border ${scaleType === 'mayor' ? 'bg-blue-900 border-blue-500 text-white shadow-lg' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
          >
             <div className="font-bold text-sm">Mayor (Diatonis)</div>
             <div className="text-[10px] opacity-80 leading-relaxed">Berjumlah 7 nada. Terdengar ceria, terang, bersemangat, dan bahagia. Contoh: Lagu kebangsaan, lagu anak.</div>
          </button>
          
          <button 
             onClick={()=>setScaleType("minor")} 
             className={`w-full p-4 flex flex-col gap-2 text-left rounded-xl transition-all border ${scaleType === 'minor' ? 'bg-rose-900 border-rose-500 text-white shadow-lg' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
          >
             <div className="font-bold text-sm">Minor (Diatonis)</div>
             <div className="text-[10px] opacity-80 leading-relaxed">Berjumlah 7 nada. Terdengar sedih, gelap, melankolis, atau heroik. Contoh: Syukur, Gugur Bunga, lagu patah hati.</div>
          </button>

          <button 
             onClick={()=>setScaleType("pentatonic")} 
             className={`w-full p-4 flex flex-col gap-2 text-left rounded-xl transition-all border ${scaleType === 'pentatonic' ? 'bg-amber-900 border-amber-500 text-white shadow-lg' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
          >
             <div className="font-bold text-sm">Pentatonik (Tradisional)</div>
             <div className="text-[10px] opacity-80 leading-relaxed">Penta = 5. Hanya menggunakan 5 nada dasar. Terdengar berbau etnik, Tiongkok, atau gamelan Jawa/Sunda (Pelog/Slendro).</div>
          </button>

        </div>
      </div>
    </div>
  );
}
