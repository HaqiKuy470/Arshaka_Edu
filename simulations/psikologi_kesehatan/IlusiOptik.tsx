"use client";

import { useState } from "react";

export default function IlusiOptik() {
  const [activeIllusion, setActiveIllusion] = useState<"muller"|"ebbinghaus"|"ponzo">("muller");
  const [showHelper, setShowHelper] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center bg-zinc-950 p-4 lg:p-8 overflow-y-auto">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Persepsi Visual & Ilusi Optik</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-lg mx-auto">
           Bagaimana otak kita bisa ditipu oleh mata kita sendiri.
        </p>

        <div className="flex justify-center mb-8 w-full max-w-lg">
           <div className="bg-zinc-900 border border-zinc-800 p-1 rounded-xl flex gap-1 shadow-lg w-full">
              <button onClick={() => {setActiveIllusion("muller"); setShowHelper(false)}} className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${activeIllusion === 'muller' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'}`}>Müller-Lyer</button>
              <button onClick={() => {setActiveIllusion("ebbinghaus"); setShowHelper(false)}} className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${activeIllusion === 'ebbinghaus' ? 'bg-emerald-600 text-white' : 'text-zinc-400 hover:text-white'}`}>Ebbinghaus</button>
              <button onClick={() => {setActiveIllusion("ponzo"); setShowHelper(false)}} className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${activeIllusion === 'ponzo' ? 'bg-amber-600 text-white' : 'text-zinc-400 hover:text-white'}`}>Ponzo</button>
           </div>
        </div>

        <div className="w-full max-w-3xl bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative min-h-[400px] flex flex-col items-center justify-center">
           
           {activeIllusion === "muller" && (
              <div className="w-full flex flex-col items-center gap-12 animate-fade-in relative">
                 <div className="text-center font-bold text-indigo-400 mb-4">Garis mana yang lebih panjang?</div>
                 
                 {/* Top Line */}
                 <div className="relative w-64 h-2 bg-white">
                    {/* Arrow heads pointing IN */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full border-[10px] border-transparent border-r-white" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full border-[10px] border-transparent border-l-white" />
                 </div>

                 {/* Bottom Line */}
                 <div className="relative w-64 h-2 bg-white mt-8">
                    {/* Arrow heads pointing OUT */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 border-[10px] border-transparent border-l-white" style={{ marginLeft: '-10px' }} />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 border-[10px] border-transparent border-r-white" style={{ marginRight: '-10px' }} />
                 </div>

                 {/* Helper Lines */}
                 {showHelper && (
                    <div className="absolute inset-0 pointer-events-none">
                       <div className="absolute left-[calc(50%-8rem)] top-16 bottom-16 w-[2px] bg-red-500 border-l border-dashed border-red-500" />
                       <div className="absolute right-[calc(50%-8rem)] top-16 bottom-16 w-[2px] bg-red-500 border-r border-dashed border-red-500" />
                    </div>
                 )}
              </div>
           )}

           {activeIllusion === "ebbinghaus" && (
              <div className="w-full flex flex-col items-center gap-8 animate-fade-in">
                 <div className="text-center font-bold text-emerald-400 mb-4">Lingkaran oranye mana yang lebih besar?</div>
                 
                 <div className="flex flex-col md:flex-row gap-16 md:gap-32 items-center justify-center">
                    
                    {/* Left (Surrounded by big circles) */}
                    <div className="relative w-48 h-48 flex items-center justify-center">
                       {/* Center Circle */}
                       <div className="absolute w-12 h-12 bg-orange-500 rounded-full z-10" />
                       {/* Surrounding Big Circles */}
                       {[0, 60, 120, 180, 240, 300].map(deg => (
                          <div key={deg} className="absolute w-16 h-16 bg-zinc-600 rounded-full" style={{ transform: `rotate(${deg}deg) translateY(-40px)` }} />
                       ))}
                    </div>

                    {/* Right (Surrounded by small circles) */}
                    <div className="relative w-48 h-48 flex items-center justify-center">
                       {/* Center Circle */}
                       <div className="absolute w-12 h-12 bg-orange-500 rounded-full z-10" />
                       {/* Surrounding Small Circles */}
                       {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                          <div key={deg} className="absolute w-6 h-6 bg-zinc-600 rounded-full" style={{ transform: `rotate(${deg}deg) translateY(-25px)` }} />
                       ))}
                    </div>

                 </div>

                 {/* Helper Line */}
                 {showHelper && (
                    <div className="absolute top-1/2 left-[15%] right-[15%] h-[2px] bg-red-500 pointer-events-none -translate-y-1/2 border-y border-dashed border-red-500 z-20" />
                 )}
              </div>
           )}

           {activeIllusion === "ponzo" && (
              <div className="w-full flex flex-col items-center animate-fade-in relative">
                 <div className="text-center font-bold text-amber-400 mb-8">Balok kuning mana yang lebih panjang?</div>
                 
                 <div className="relative w-64 h-80 flex items-center justify-center bg-zinc-800 rounded-xl overflow-hidden">
                    {/* Perspective Track Lines */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                       <line x1="20" y1="100" x2="45" y2="0" stroke="#52525b" strokeWidth="2" />
                       <line x1="80" y1="100" x2="55" y2="0" stroke="#52525b" strokeWidth="2" />
                       {/* Horizontal ties */}
                       <line x1="25" y1="80" x2="75" y2="80" stroke="#52525b" strokeWidth="1" />
                       <line x1="30" y1="60" x2="70" y2="60" stroke="#52525b" strokeWidth="1" />
                       <line x1="35" y1="40" x2="65" y2="40" stroke="#52525b" strokeWidth="1" />
                       <line x1="40" y1="20" x2="60" y2="20" stroke="#52525b" strokeWidth="1" />
                    </svg>

                    {/* Top Bar */}
                    <div className="absolute top-10 w-16 h-4 bg-yellow-400 rounded-sm shadow-md z-10" />
                    
                    {/* Bottom Bar */}
                    <div className="absolute bottom-10 w-16 h-4 bg-yellow-400 rounded-sm shadow-md z-10" />

                    {/* Helper Lines */}
                    {showHelper && (
                       <div className="absolute inset-0 pointer-events-none z-20 flex justify-center">
                          <div className="w-16 h-full border-x-2 border-red-500 border-dashed" />
                       </div>
                    )}
                 </div>
              </div>
           )}

        </div>

        <button 
           onClick={() => setShowHelper(!showHelper)}
           className={`mt-8 px-8 py-3 rounded-xl font-bold shadow-lg transition-all ${showHelper ? 'bg-red-600 text-white' : 'bg-white text-black hover:bg-zinc-200'}`}
        >
           {showHelper ? "Sembunyikan Garis Bantuan" : "Buktikan dengan Garis Bantuan!"}
        </button>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Psikologi Persepsi</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="p-4 bg-zinc-900 rounded-xl border border-white/5 space-y-4 text-sm text-zinc-300 leading-relaxed">
             <h4 className="font-bold text-white border-b border-zinc-700 pb-2">Mengapa Otak Kita Tertipu?</h4>
             <p>Mata kita melihat gambar, tetapi <strong>Otak</strong> yang menerjemahkan gambar tersebut berdasarkan <em>pengalaman masa lalu</em> (konteks).</p>
          </div>

          {activeIllusion === "muller" && (
             <div className="p-4 bg-indigo-900/20 rounded-xl border border-indigo-500/30 text-xs text-indigo-200/80 leading-relaxed">
                <p className="font-bold text-indigo-400 mb-1">Ilusi Müller-Lyer</p>
                <p>Kedua garis memiliki panjang yang sama. Ujung panah ke dalam membuat garis tampak seperti "sudut luar bangunan" (terasa dekat dan pendek). Ujung panah ke luar tampak seperti "sudut dalam ruangan" (terasa jauh dan panjang).</p>
             </div>
          )}

          {activeIllusion === "ebbinghaus" && (
             <div className="p-4 bg-emerald-900/20 rounded-xl border border-emerald-500/30 text-xs text-emerald-200/80 leading-relaxed">
                <p className="font-bold text-emerald-400 mb-1">Ilusi Ebbinghaus</p>
                <p>Kedua lingkaran oranye berukuran sama persis. Otak kita selalu <strong>membandingkan</strong> suatu objek dengan lingkungan sekitarnya. Jika dikelilingi benda besar, ia terasa kecil, dan sebaliknya.</p>
             </div>
          )}

          {activeIllusion === "ponzo" && (
             <div className="p-4 bg-amber-900/20 rounded-xl border border-amber-500/30 text-xs text-amber-200/80 leading-relaxed">
                <p className="font-bold text-amber-400 mb-1">Ilusi Ponzo</p>
                <p>Garis menyempit memberikan efek perspektif 3D (jarak). Karena otak mengira balok kuning di atas berada "lebih jauh", otak secara otomatis memperbesar persepsi ukurannya agar sesuai dengan kenyataan.</p>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
