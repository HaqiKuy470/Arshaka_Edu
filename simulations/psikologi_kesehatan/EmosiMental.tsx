"use client";

import { useState } from "react";

export default function EmosiMental() {
  const [emotion, setEmotion] = useState<"marah"|"sedih"|"cemas">("cemas");

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center bg-zinc-950 p-4 lg:p-8 overflow-y-auto">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Emosi & Regulasi Diri</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-lg mx-auto">
           Bagaimana emosi negatif mempengaruhi tubuh dan cara meredakannya.
        </p>

        <div className="flex justify-center mb-8 w-full max-w-md">
           <div className="bg-zinc-900 border border-zinc-800 p-1 rounded-xl flex gap-1 shadow-lg w-full">
              <button onClick={() => setEmotion("cemas")} className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${emotion === 'cemas' ? 'bg-amber-600 text-white' : 'text-zinc-400 hover:text-white'}`}>Cemas</button>
              <button onClick={() => setEmotion("marah")} className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${emotion === 'marah' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'}`}>Marah</button>
              <button onClick={() => setEmotion("sedih")} className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${emotion === 'sedih' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'}`}>Sedih</button>
           </div>
        </div>

        <div className="w-full max-w-3xl bg-black border border-white/10 rounded-3xl p-8 shadow-2xl relative min-h-[400px] flex items-center justify-center overflow-hidden">
           
           {/* Human Silhouette / Abstract Body */}
           <div className="relative w-48 h-64 flex flex-col items-center justify-end animate-fade-in">
              
              {/* Head */}
              <div className={`w-16 h-16 rounded-full z-20 transition-all duration-1000 ${emotion === 'cemas' ? 'bg-amber-500 animate-bounce' : emotion === 'marah' ? 'bg-red-500 shadow-[0_0_50px_red]' : 'bg-blue-400 opacity-80 translate-y-4'}`} />
              
              {/* Body */}
              <div className={`w-24 h-32 rounded-t-3xl mt-[-10px] z-10 transition-all duration-1000 overflow-hidden relative ${emotion === 'cemas' ? 'bg-amber-900/50' : emotion === 'marah' ? 'bg-red-900/50' : 'bg-blue-900/50'}`}>
                 
                 {/* Internal Heart Rate / Effects */}
                 {emotion === "cemas" && (
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-8 h-8 bg-amber-400 rounded-full animate-[ping_0.5s_infinite]" />
                 )}
                 {emotion === "marah" && (
                    <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-red-600 to-transparent animate-pulse" />
                 )}
                 {emotion === "sedih" && (
                    <div className="absolute top-0 w-full h-full bg-blue-900 opacity-50" />
                 )}

              </div>
              
           </div>

           {/* Floating elements indicating mental state */}
           {emotion === "cemas" && (
              <div className="absolute inset-0 pointer-events-none opacity-50 flex items-center justify-center">
                 <div className="absolute text-5xl animate-[spin_3s_linear_infinite]" style={{ top: '20%', left: '20%' }}>❓</div>
                 <div className="absolute text-5xl animate-[spin_2s_linear_infinite_reverse]" style={{ top: '30%', right: '25%' }}>⚡</div>
                 <div className="absolute text-5xl animate-[spin_4s_linear_infinite]" style={{ bottom: '20%', left: '30%' }}>🌪️</div>
              </div>
           )}

           {emotion === "marah" && (
              <div className="absolute inset-0 pointer-events-none opacity-50 flex items-center justify-center">
                 <div className="absolute text-6xl animate-pulse" style={{ top: '10%', left: '30%' }}>🔥</div>
                 <div className="absolute text-6xl animate-pulse" style={{ bottom: '20%', right: '20%' }}>🧨</div>
              </div>
           )}

           {emotion === "sedih" && (
              <div className="absolute inset-0 pointer-events-none opacity-50 overflow-hidden">
                 {/* Rain effect */}
                 {Array.from({length: 20}).map((_, i) => (
                    <div key={i} className="absolute w-[2px] h-10 bg-blue-500/50 animate-[slide-down_1s_linear_infinite]" style={{ left: `${Math.random()*100}%`, top: `-${Math.random()*100}%`, animationDelay: `${Math.random()}s` }} />
                 ))}
              </div>
           )}

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Analisis Emosi</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          {emotion === "cemas" && (
             <div className="space-y-4 animate-fade-in">
                <div className="p-4 bg-amber-900/30 rounded-xl border border-amber-500/30">
                   <h4 className="font-bold text-amber-400 mb-2">Kecemasan (Anxiety)</h4>
                   <p className="text-xs text-zinc-300 mb-2">Respons otak terhadap <strong>ancaman masa depan</strong> yang belum tentu terjadi (Overthinking).</p>
                   <div className="text-[10px] text-zinc-400 bg-black/40 p-2 rounded"><strong>Reaksi Tubuh:</strong> Jantung berdebar sangat cepat, keringat dingin, napas pendek, otot tegang (Respons *Fight or Flight*).</div>
                </div>
                <div className="p-4 bg-emerald-900/30 rounded-xl border border-emerald-500/30">
                   <h4 className="font-bold text-emerald-400 text-sm mb-1">Strategi Regulasi (Pereda):</h4>
                   <p className="text-xs text-zinc-300"><strong>Teknik Grounding (5-4-3-2-1):</strong> Sebutkan 5 benda yang dilihat, 4 yang disentuh, 3 yang didengar. Tarik napas perut perlahan.</p>
                </div>
             </div>
          )}

          {emotion === "marah" && (
             <div className="space-y-4 animate-fade-in">
                <div className="p-4 bg-red-900/30 rounded-xl border border-red-500/30">
                   <h4 className="font-bold text-red-400 mb-2">Kemarahan (Anger)</h4>
                   <p className="text-xs text-zinc-300 mb-2">Respons otak terhadap <strong>ketidakadilan atau batasan yang dilanggar</strong>. Emosi dengan energi paling tinggi.</p>
                   <div className="text-[10px] text-zinc-400 bg-black/40 p-2 rounded"><strong>Reaksi Tubuh:</strong> Darah mengalir deras ke otot dan wajah (muka merah), tekanan darah naik, dorongan kuat untuk bertindak agresif.</div>
                </div>
                <div className="p-4 bg-emerald-900/30 rounded-xl border border-emerald-500/30">
                   <h4 className="font-bold text-emerald-400 text-sm mb-1">Strategi Regulasi (Pereda):</h4>
                   <p className="text-xs text-zinc-300"><strong>Time Out:</strong> Tinggalkan sumber masalah sementara. Minum air putih es. Ambil waktu jeda 10 detik sebelum merespons.</p>
                </div>
             </div>
          )}

          {emotion === "sedih" && (
             <div className="space-y-4 animate-fade-in">
                <div className="p-4 bg-blue-900/30 rounded-xl border border-blue-500/30">
                   <h4 className="font-bold text-blue-400 mb-2">Kesedihan (Sadness)</h4>
                   <p className="text-xs text-zinc-300 mb-2">Respons otak terhadap <strong>kehilangan</strong>. Seringkali membuat tubuh masuk mode "hemat energi".</p>
                   <div className="text-[10px] text-zinc-400 bg-black/40 p-2 rounded"><strong>Reaksi Tubuh:</strong> Dada terasa sesak/berat, lemas, tidak ada motivasi, tubuh terasa ditarik ke bawah (slouching), menangis.</div>
                </div>
                <div className="p-4 bg-emerald-900/30 rounded-xl border border-emerald-500/30">
                   <h4 className="font-bold text-emerald-400 text-sm mb-1">Strategi Regulasi (Pereda):</h4>
                   <p className="text-xs text-zinc-300"><strong>Validasi:</strong> Jangan ditahan, biarkan menangis. Cari dukungan sosial (cerita ke orang terpercaya). Lakukan aktivitas kecil perlahan.</p>
                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
