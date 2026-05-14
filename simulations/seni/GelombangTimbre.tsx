"use client";

import { useState } from "react";

export default function GelombangTimbre() {
  const [instrument, setInstrument] = useState<"sine"|"violin"|"trumpet">("sine");

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 p-4 lg:p-8 overflow-y-auto">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Timbre (Warna Suara)</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-lg mx-auto">
           Kenapa Piano dan Gitar terdengar berbeda meski memainkan nada yang sama?
        </p>

        <div className="w-full max-w-3xl bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative min-h-[400px] flex items-center justify-center overflow-hidden">
           
           <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-10 pointer-events-none">
              {Array.from({length: 100}).map((_, i) => <div key={i} className="border border-emerald-500" />)}
           </div>

           <div className="relative w-full h-48 border-b border-l border-emerald-500/50 bg-black shadow-[0_0_30px_rgba(16,185,129,0.1)] flex items-center overflow-hidden">
              
              <div className="absolute top-2 left-2 text-xs font-mono text-emerald-500">Oscilloscope (Gelombang Suara)</div>

              {/* Sine Wave (Pure tone) */}
              {instrument === "sine" && (
                 <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M0,50 Q12.5,10 25,50 T50,50 T75,50 T100,50" fill="none" stroke="#3b82f6" strokeWidth="2" className="animate-[slide-left_2s_linear_infinite]" />
                    <path d="M100,50 Q112.5,10 125,50 T150,50 T175,50 T200,50" fill="none" stroke="#3b82f6" strokeWidth="2" className="animate-[slide-left_2s_linear_infinite]" />
                 </svg>
              )}

              {/* Violin (Sawtooth-like complex) */}
              {instrument === "violin" && (
                 <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    {/* Complex wave looking like a sharp mountain range */}
                    <path d="M0,50 L5,20 L10,30 L15,10 L25,80 L30,60 L35,90 L40,50 L45,20 L50,30 L55,10 L65,80 L70,60 L75,90 L80,50 L85,20 L90,30 L95,10 L105,80" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-[slide-left_2s_linear_infinite]" />
                 </svg>
              )}

              {/* Trumpet (Square-like complex) */}
              {instrument === "trumpet" && (
                 <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    {/* Brassy square-ish but chaotic wave */}
                    <path d="M0,50 L5,50 L10,15 L20,15 L25,30 L30,20 L35,80 L45,80 L50,50 L55,50 L60,15 L70,15 L75,30 L80,20 L85,80 L95,80 L100,50" fill="none" stroke="#f43f5e" strokeWidth="2" className="animate-[slide-left_2s_linear_infinite]" />
                 </svg>
              )}
           </div>

           <div className="absolute bottom-4 left-0 right-0 text-center">
              <span className={`px-4 py-1 rounded text-xs font-bold text-white uppercase tracking-widest shadow-lg ${instrument === 'sine' ? 'bg-blue-600' : instrument === 'violin' ? 'bg-amber-600' : 'bg-rose-600'}`}>
                 {instrument === 'sine' ? 'Nada Murni (Komputer)' : instrument === 'violin' ? 'Biola (Gesek)' : 'Terompet (Tiup)'}
              </span>
           </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Spektrum Timbre</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          <button 
             onClick={()=>setInstrument("sine")} 
             className={`w-full p-4 text-left rounded-xl transition-all border ${instrument === 'sine' ? 'bg-blue-900 border-blue-500 text-white shadow-lg' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
          >
             <div className="font-bold text-sm">Sine Wave (Nada Murni)</div>
             <div className="text-[10px] opacity-80 mt-1">Gelombang bulat sempurna. Tidak ada di alam bebas, hanya dihasilkan oleh osilator komputer. Terdengar seperti suara "Tiiit" tes alat pendengaran.</div>
          </button>
          
          <button 
             onClick={()=>setInstrument("violin")} 
             className={`w-full p-4 text-left rounded-xl transition-all border ${instrument === 'violin' ? 'bg-amber-900 border-amber-500 text-white shadow-lg' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
          >
             <div className="font-bold text-sm">Biola (Alat Gesek)</div>
             <div className="text-[10px] opacity-80 mt-1">Bentuk gelombang tajam dan bergerigi (Sawtooth). Mengandung banyak "Overtones" sehingga terdengar kaya, hangat, dan mengiris hati.</div>
          </button>

          <button 
             onClick={()=>setInstrument("trumpet")} 
             className={`w-full p-4 text-left rounded-xl transition-all border ${instrument === 'trumpet' ? 'bg-rose-900 border-rose-500 text-white shadow-lg' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
          >
             <div className="font-bold text-sm">Terompet (Alat Tiup Logam)</div>
             <div className="text-[10px] opacity-80 mt-1">Gelombang berbentuk kotak asimetris. Terdengar sangat terang, keras, menusuk (Brassy), dan bersemangat.</div>
          </button>

          <div className="p-4 bg-zinc-900 rounded-xl border border-white/5 mt-8 text-xs text-zinc-300 leading-relaxed">
             <p className="font-bold text-white mb-2">Mengapa bentuknya beda?</p>
             <p>Saat senar gitar dipetik, ia tidak hanya bergetar pada satu frekuensi utama, tapi juga menghasilkan getaran-getaran kecil tambahan yang disebut <strong>Harmonik (Overtones)</strong>. Gabungan inilah yang membuat setiap instrumen memiliki "Warna" unik.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
