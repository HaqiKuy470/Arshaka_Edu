"use client";

import { useState } from "react";

export default function KomposisiDesain() {
  const [activePrinciple, setActivePrinciple] = useState<"keseimbangan"|"kontras"|"ritme">("keseimbangan");
  
  // Interactions
  const [isBalanced, setIsBalanced] = useState(true);
  const [contrastHigh, setContrastHigh] = useState(false);
  const [rhythmOn, setRhythmOn] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center bg-zinc-950 p-4 lg:p-8 overflow-y-auto">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Komposisi & Prinsip Desain</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-lg mx-auto">
           Apa yang membedakan desain acak-acakan dengan mahakarya yang enak dipandang?
        </p>

        <div className="flex justify-center mb-8 w-full max-w-2xl">
           <div className="bg-zinc-900 border border-zinc-800 p-1 rounded-xl flex gap-1 shadow-lg w-full">
              <button onClick={() => setActivePrinciple("keseimbangan")} className={`flex-1 py-3 rounded-lg font-bold text-xs transition-all ${activePrinciple === 'keseimbangan' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'}`}>⚖️ Keseimbangan</button>
              <button onClick={() => setActivePrinciple("kontras")} className={`flex-1 py-3 rounded-lg font-bold text-xs transition-all ${activePrinciple === 'kontras' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'}`}>🌓 Kontras</button>
              <button onClick={() => setActivePrinciple("ritme")} className={`flex-1 py-3 rounded-lg font-bold text-xs transition-all ${activePrinciple === 'ritme' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'}`}>🌊 Ritme</button>
           </div>
        </div>

        <div className="w-full max-w-3xl bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative min-h-[400px] flex items-center justify-center">
           
           {activePrinciple === "keseimbangan" && (
              <div className="w-full flex flex-col items-center animate-fade-in">
                 
                 {/* The Seesaw visualization */}
                 <div className="relative w-80 h-40 flex flex-col items-center justify-end pb-12">
                    
                    <div 
                      className={`w-full h-2 bg-white transition-all duration-700 origin-center relative flex items-end justify-between px-4 ${isBalanced ? 'rotate-0' : 'rotate-[15deg]'}`}
                    >
                       {/* Heavy Element Left */}
                       <div className="w-16 h-16 bg-blue-500 rounded mb-2 shadow-lg" />
                       
                       {/* Element Right */}
                       <div className={`transition-all duration-500 mb-2 shadow-lg flex gap-2 ${isBalanced ? 'opacity-100' : 'opacity-0 scale-50'}`}>
                          <div className="w-8 h-8 bg-blue-400 rounded-full" />
                          <div className="w-8 h-8 bg-emerald-400 rounded-full" />
                       </div>
                    </div>
                    
                    {/* Seesaw Fulcrum */}
                    <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[30px] border-b-zinc-600 absolute bottom-4" />

                 </div>

                 <button 
                    onClick={() => setIsBalanced(!isBalanced)}
                    className="mt-8 bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-full font-bold transition-all text-sm"
                 >
                    {isBalanced ? "Ubah Jadi Asimetris (Tidak Seimbang)" : "Buat Seimbang Secara Visual"}
                 </button>

              </div>
           )}

           {activePrinciple === "kontras" && (
              <div className="w-full flex flex-col items-center animate-fade-in">
                 
                 {/* Contrast Display */}
                 <div className={`w-80 h-48 flex items-center justify-center transition-all duration-700 rounded-2xl ${contrastHigh ? 'bg-zinc-950 border border-zinc-800' : 'bg-zinc-400'}`}>
                    
                    <h3 className={`text-3xl font-black transition-all duration-700 ${contrastHigh ? 'text-white' : 'text-zinc-500'}`}>
                       BACA SAYA
                    </h3>

                 </div>

                 <button 
                    onClick={() => setContrastHigh(!contrastHigh)}
                    className="mt-8 bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-full font-bold transition-all text-sm"
                 >
                    {contrastHigh ? "Turunkan Kontras" : "Tingkatkan Kontras"}
                 </button>

              </div>
           )}

           {activePrinciple === "ritme" && (
              <div className="w-full flex flex-col items-center animate-fade-in overflow-hidden">
                 
                 {/* Rhythm Display */}
                 <div className="w-full h-48 flex items-center justify-center gap-4 relative">
                    
                    {[1,2,3,4,5,6].map((i) => (
                       <div 
                         key={i} 
                         className={`bg-rose-500 rounded-full transition-all duration-500 shadow-lg ${rhythmOn ? 'animate-bounce' : ''}`}
                         style={{
                            width: rhythmOn ? `${20 + (i * 10)}px` : '40px',
                            height: rhythmOn ? `${20 + (i * 10)}px` : '40px',
                            animationDelay: `${i * 0.1}s`,
                            opacity: rhythmOn ? 1 - (i * 0.1) : 1
                         }}
                       />
                    ))}

                 </div>

                 <button 
                    onClick={() => setRhythmOn(!rhythmOn)}
                    className="mt-8 bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-full font-bold transition-all text-sm"
                 >
                    {rhythmOn ? "Matikan Ritme" : "Nyalakan Ritme Bergerak"}
                 </button>

              </div>
           )}

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Penjelasan Prinsip</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          {activePrinciple === "keseimbangan" && (
             <div className="text-zinc-300 text-sm leading-relaxed space-y-4">
                <p><strong>Keseimbangan Visual (Balance)</strong></p>
                <p>Desain tidak boleh "berat sebelah". Keseimbangan bisa bersifat <em>Simetris</em> (kiri dan kanan persis sama seperti cermin) atau <em>Asimetris</em> (berbeda bentuk tapi secara bobot visual dirasa seimbang).</p>
                <div className="p-3 bg-blue-900/30 rounded border border-blue-500/30 text-xs">Contoh: 1 kotak besar di kiri bisa diimbangi oleh 2 lingkaran kecil di kanan.</div>
             </div>
          )}

          {activePrinciple === "kontras" && (
             <div className="text-zinc-300 text-sm leading-relaxed space-y-4">
                <p><strong>Kontras (Contrast)</strong></p>
                <p>Menciptakan perbedaan yang tegas antar elemen agar mata tahu mana yang harus dibaca lebih dulu (Focal Point).</p>
                <div className="p-3 bg-zinc-800 rounded border border-white/10 text-xs">Teks abu-abu di atas latar abu-abu membuat mata sakit dan lelah (Low Contrast). Hitam di atas Putih adalah High Contrast.</div>
             </div>
          )}

          {activePrinciple === "ritme" && (
             <div className="text-zinc-300 text-sm leading-relaxed space-y-4">
                <p><strong>Ritme & Pengulangan (Rhythm/Repetition)</strong></p>
                <p>Mengulang elemen visual secara teratur untuk menciptakan ilusi pergerakan atau konsistensi tema, layaknya ketukan drum dalam musik.</p>
                <div className="p-3 bg-rose-900/30 rounded border border-rose-500/30 text-xs">Pengecilan ukuran secara bertahap memberikan kesan elemen bergerak menjauh atau mendekat.</div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
