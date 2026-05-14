"use client";

import { useState } from "react";

export default function MachineLearning() {
  const [epochs, setEpochs] = useState(0);
  const [accuracy, setAccuracy] = useState(10); // Start 10%
  const [isTraining, setIsTraining] = useState(false);

  const trainModel = () => {
     if(isTraining) return;
     setIsTraining(true);
     
     let currentEpoch = epochs;
     let currentAcc = accuracy;

     const interval = setInterval(() => {
        currentEpoch += 10;
        // Asymptotic curve to 98%
        currentAcc = currentAcc + (98 - currentAcc) * 0.15;
        
        setEpochs(currentEpoch);
        setAccuracy(currentAcc);

        if (currentEpoch >= 150) {
           clearInterval(interval);
           setIsTraining(false);
        }
     }, 200);
  };

  const reset = () => {
     setEpochs(0);
     setAccuracy(10);
     setIsTraining(false);
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col bg-zinc-950 p-4 lg:p-8 overflow-y-auto">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Neural Network (Machine Learning)</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-lg mx-auto">
           Bagaimana AI belajar membedakan gambar Kucing vs Anjing?
        </p>

        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
           
           {/* The Neural Network Visual */}
           <div className="w-full bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative mb-8 flex items-center justify-between overflow-hidden">
              <div className={`absolute inset-0 bg-blue-500/5 transition-opacity duration-300 ${isTraining ? 'opacity-100' : 'opacity-0'}`} />

              {/* Input Layer */}
              <div className="flex flex-col gap-4 z-10">
                 <span className="text-xs font-bold text-zinc-500 uppercase text-center mb-2">Input Image</span>
                 <div className="w-16 h-16 bg-black border-2 border-zinc-700 rounded text-3xl flex items-center justify-center">🐈</div>
                 <div className="w-16 h-16 bg-black border-2 border-zinc-700 rounded text-3xl flex items-center justify-center opacity-30">🐕</div>
              </div>

              {/* Hidden Layers (Abstract Lines) */}
              <div className="flex-1 px-8 relative h-48 flex items-center justify-center z-10">
                 {isTraining && (
                    <svg className="absolute inset-0 w-full h-full animate-pulse" preserveAspectRatio="none">
                       {/* Random crazy connections to simulate deep learning */}
                       <path d="M0,50 Q100,0 200,50 T400,50" stroke="rgba(59,130,246,0.3)" fill="none" strokeWidth="2" />
                       <path d="M0,150 Q100,200 200,150 T400,150" stroke="rgba(16,185,129,0.3)" fill="none" strokeWidth="2" />
                       <path d="M0,100 L400,100" stroke="rgba(245,158,11,0.3)" fill="none" strokeWidth="2" strokeDasharray="5,5" />
                       <path d="M0,50 L400,150" stroke="rgba(225,29,72,0.3)" fill="none" strokeWidth="1" />
                       <path d="M0,150 L400,50" stroke="rgba(168,85,247,0.3)" fill="none" strokeWidth="1" />
                    </svg>
                 )}
                 <div className="bg-black/80 px-4 py-2 rounded-lg border border-zinc-800 text-zinc-400 font-mono text-sm shadow-xl relative z-20">
                    {isTraining ? (
                       <span className="text-blue-400 animate-pulse">Adjusting Weights...</span>
                    ) : (
                       <span>Hidden Layers</span>
                    )}
                 </div>
              </div>

              {/* Output Layer */}
              <div className="flex flex-col gap-4 z-10">
                 <span className="text-xs font-bold text-zinc-500 uppercase text-center mb-2">Prediction</span>
                 <div className={`w-24 h-12 rounded flex flex-col items-center justify-center transition-all ${accuracy > 80 ? 'bg-emerald-600 border border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-zinc-800 border-zinc-700'}`}>
                    <span className="text-xs text-white/70">Kucing</span>
                    <span className="font-bold text-white">{accuracy > 80 ? accuracy.toFixed(1) : (100 - accuracy).toFixed(1)}%</span>
                 </div>
                 <div className={`w-24 h-12 rounded flex flex-col items-center justify-center transition-all ${accuracy <= 80 && accuracy > 20 ? 'bg-rose-600 border border-rose-400' : 'bg-zinc-800 border-zinc-700'}`}>
                    <span className="text-xs text-white/70">Anjing</span>
                    <span className="font-bold text-white">{accuracy <= 80 ? accuracy.toFixed(1) : (100 - accuracy).toFixed(1)}%</span>
                 </div>
              </div>

           </div>

           {/* Metrics Grid */}
           <div className="grid grid-cols-2 gap-6 w-full max-w-md">
              <div className="bg-zinc-900 border border-white/5 p-4 rounded-2xl text-center">
                 <div className="text-zinc-500 text-xs font-bold uppercase mb-1">Epochs (Siklus)</div>
                 <div className="text-3xl font-black text-amber-400 font-mono">{epochs}</div>
              </div>
              <div className="bg-zinc-900 border border-white/5 p-4 rounded-2xl text-center">
                 <div className="text-zinc-500 text-xs font-bold uppercase mb-1">Akurasi</div>
                 <div className={`text-3xl font-black font-mono ${accuracy > 80 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {accuracy.toFixed(1)}%
                 </div>
              </div>
           </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Training Process</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="flex gap-2">
             <button 
                onClick={trainModel}
                disabled={isTraining || epochs >= 150}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 text-white font-bold py-3 rounded-xl transition-all text-sm"
             >
                ▶️ Train AI
             </button>
             <button 
                onClick={reset}
                className="px-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl transition-all"
             >
                🔄
             </button>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed">
            <p>Berbeda dengan program tradisional yang harus ditulis kodenya (IF Kucing THEN...), Machine Learning dibiarkan "Menebak" sendiri.</p>
            <p>Di awal <strong>(Epoch 0)</strong>, AI akan menebak secara acak. Saat tebakannya salah, ia akan dihukum secara matematis (Loss Function) sehingga ia memperbaiki jaringan bobotnya (Weights).</p>
            <p className="text-blue-400 font-bold mt-2">Setelah ribuan siklus, AI akhirnya bisa mengenali pola kumis atau telinga kucing tanpa diajari langsung oleh manusia!</p>
          </div>

        </div>
      </div>
    </div>
  );
}
