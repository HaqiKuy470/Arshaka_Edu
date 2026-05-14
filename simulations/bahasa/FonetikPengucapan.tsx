"use client";

import { useState, useRef } from "react";

export default function FonetikPengucapan() {
  const [activeVowel, setActiveVowel] = useState<string>("a");
  
  // Very simplified vowel quadrilateral mapping
  const vowels = [
    { id: "i", sym: "/i/", name: "Vokal Depan Tertutup", mouth: "Bibir melebar, lidah naik ke depan.", x: 20, y: 20 },
    { id: "u", sym: "/u/", name: "Vokal Belakang Tertutup", mouth: "Bibir membulat maju, lidah naik ke belakang.", x: 80, y: 20 },
    { id: "e", sym: "/e/", name: "Vokal Depan Tengah", mouth: "Bibir sedikit melebar, rahang agak turun.", x: 30, y: 50 },
    { id: "o", sym: "/o/", name: "Vokal Belakang Tengah", mouth: "Bibir membulat rahang agak turun.", x: 70, y: 50 },
    { id: "a", sym: "/a/", name: "Vokal Tengah Terbuka", mouth: "Rahang turun maksimal, mulut terbuka lebar.", x: 50, y: 90 },
    { id: "e_pepet", sym: "/ə/", name: "Vokal Tengah (Pepet)", mouth: "Mulut rileks, lidah di tengah (seperti pada kata 'e-nam').", x: 50, y: 50 }
  ];

  const getActive = () => vowels.find(v => v.id === activeVowel) || vowels[4];

  // Simple mouth visualization state
  const getMouthCSS = () => {
     switch(activeVowel) {
        case "i": return "w-32 h-8 rounded-[100%] bg-red-950 border-4 border-rose-300";
        case "u": return "w-12 h-12 rounded-full bg-red-950 border-4 border-rose-300";
        case "e": return "w-24 h-12 rounded-[50%] bg-red-950 border-4 border-rose-300";
        case "o": return "w-20 h-24 rounded-[40%] bg-red-950 border-4 border-rose-300";
        case "a": return "w-24 h-32 rounded-[40%] bg-red-950 border-4 border-rose-300";
        case "e_pepet": return "w-20 h-8 rounded-[30%] bg-red-950 border-4 border-rose-300";
        default: return "w-24 h-12 rounded-full bg-red-950 border-4 border-rose-300";
     }
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <div className="flex flex-col md:flex-row items-center gap-16">
           
           {/* Phonetic Vowel Chart (Trapesium Vokal) */}
           <div className="relative w-64 h-64 bg-zinc-900 border border-white/20 rounded-xl p-4 shadow-xl">
              <h4 className="text-center text-xs font-bold text-zinc-500 uppercase mb-4">Posisi Lidah</h4>
              
              {/* Trapezoid Background */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 100 100">
                 <polygon points="20,20 80,20 70,90 50,90" fill="none" stroke="white" strokeWidth="2" />
                 <line x1="25" y1="50" x2="75" y2="50" stroke="white" strokeWidth="1" strokeDasharray="2,2"/>
                 <line x1="50" y1="20" x2="50" y2="90" stroke="white" strokeWidth="1" strokeDasharray="2,2"/>
              </svg>

              {/* Labels */}
              <span className="absolute top-2 left-2 text-[10px] text-zinc-500">Depan</span>
              <span className="absolute top-2 right-2 text-[10px] text-zinc-500">Belakang</span>
              <span className="absolute top-1/2 -left-8 text-[10px] text-zinc-500 -rotate-90">Tertutup</span>
              <span className="absolute bottom-4 -left-8 text-[10px] text-zinc-500 -rotate-90">Terbuka</span>

              {/* Vowel Points */}
              <div className="absolute inset-0 top-8 left-4 w-[calc(100%-2rem)] h-[calc(100%-3rem)]">
                 {vowels.map(v => (
                    <div 
                      key={v.id}
                      onClick={() => setActiveVowel(v.id)}
                      className={`absolute w-10 h-10 -ml-5 -mt-5 flex items-center justify-center rounded-full font-serif text-xl cursor-pointer transition-all ${activeVowel === v.id ? 'bg-sky-500 text-white font-bold scale-125 shadow-[0_0_15px_rgba(14,165,233,0.8)] z-10' : 'bg-black text-zinc-400 border border-zinc-700 hover:bg-zinc-800'}`}
                      style={{ left: `${v.x}%`, top: `${v.y}%` }}
                    >
                       {v.sym}
                    </div>
                 ))}
              </div>
           </div>

           {/* Mouth Visualizer */}
           <div className="flex flex-col items-center">
              <div className="w-48 h-64 bg-[#fcd5ce] rounded-[60px] flex flex-col items-center justify-center relative shadow-2xl border-4 border-[#ffb5a7] overflow-hidden">
                 
                 {/* Simple nose hint */}
                 <div className="w-4 h-8 border-b-2 border-r-2 border-[#e5989b] rounded-br-lg absolute top-16" />
                 
                 {/* The Mouth */}
                 <div className="absolute bottom-16 flex justify-center w-full">
                    <div className={`transition-all duration-300 ease-in-out ${getMouthCSS()}`}>
                       {/* Teeth hint */}
                       {(activeVowel === 'i' || activeVowel === 'e') && (
                          <div className="w-full h-2 bg-white rounded-t-sm opacity-80" />
                       )}
                       {/* Tongue hint */}
                       <div className="absolute bottom-0 w-full h-1/2 bg-[#d00000] rounded-b-[100%] opacity-80" />
                    </div>
                 </div>
              </div>
           </div>

        </div>

        {/* Text details */}
        <div className="mt-12 text-center animate-fade-in max-w-md">
           <h3 className="text-3xl font-bold text-white mb-2">{getActive().sym} - {getActive().name}</h3>
           <p className="text-zinc-400 text-lg">{getActive().mouth}</p>
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Fonetik (Bunyi Vokal)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed">
            <p><strong>Fonetik</strong> adalah ilmu yang mempelajari bagaimana bunyi bahasa diproduksi oleh alat ucap manusia (mulut, lidah, pita suara).</p>
            <p>Pada <strong>Bunyi Vokal</strong> (A, I, U, E, O), aliran udara dari paru-paru tidak mengalami hambatan sama sekali di mulut. Bunyi yang keluar murni ditentukan oleh bentuk rahang dan posisi lidah.</p>
            
            <hr className="border-white/10 my-4" />
            
            <h4 className="font-bold text-white mb-2">Cobalah Sendiri:</h4>
            <ol className="list-decimal pl-4 space-y-2 text-zinc-400">
               <li>Ucapkan <strong>/i/</strong> secara terus-menerus. Rasakan bibir Anda melebar dan lidah naik mendekati langit-langit.</li>
               <li>Tanpa menghentikan suara, ubah mulut Anda mengucapkan <strong>/u/</strong>. Rasakan bibir menjadi membulat maju (monyong).</li>
               <li>Ubah lagi menjadi <strong>/a/</strong>. Rasakan rahang Anda turun jauh ke bawah!</li>
            </ol>
          </div>

        </div>
      </div>
    </div>
  );
}
