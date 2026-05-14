"use client";

import { useState } from "react";

export default function TeleskopSpektrum() {
  const [lensType, setLensType] = useState<"visible"|"infrared"|"xray">("visible");

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center bg-zinc-950 p-4 lg:p-8 overflow-y-auto">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Spektrum Cahaya & Teleskop</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-lg mx-auto">
           Mata manusia hanya melihat secuil kecil dari alam semesta. Teleskop membuka tabir sisanya.
        </p>

        <div className="flex justify-center mb-8 w-full max-w-md">
           <div className="bg-zinc-900 border border-zinc-800 p-1 rounded-xl flex gap-1 shadow-lg w-full">
              <button onClick={() => setLensType("visible")} className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${lensType === 'visible' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}>Visible (Optik)</button>
              <button onClick={() => setLensType("infrared")} className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${lensType === 'infrared' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'}`}>Inframerah (Panas)</button>
              <button onClick={() => setLensType("xray")} className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${lensType === 'xray' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'}`}>Sinar-X (Energi Tinggi)</button>
           </div>
        </div>

        <div className="w-full max-w-4xl bg-black border border-white/10 rounded-3xl p-4 shadow-2xl relative min-h-[400px] flex items-center justify-center overflow-hidden">
           
           {/* Background Stars / Base Nebula */}
           <div className="absolute inset-0 bg-black overflow-hidden flex items-center justify-center">
              
              {/* The Object (A Supernova Remnant / Nebula) */}
              {lensType === "visible" && (
                 <div className="relative w-64 h-64 animate-fade-in flex items-center justify-center">
                    <div className="absolute w-full h-full bg-white/10 rounded-full blur-xl" />
                    <div className="absolute w-40 h-40 bg-pink-500/20 rounded-full blur-2xl mix-blend-screen" />
                    <div className="absolute w-32 h-32 bg-blue-500/20 rounded-full blur-2xl mix-blend-screen" />
                    <div className="absolute w-10 h-10 bg-white rounded-full shadow-[0_0_20px_white] blur-[2px]" />
                    {/* Dust obscuring */}
                    <div className="absolute w-full h-full bg-black/60 rotate-45" style={{ clipPath: 'polygon(0 40%, 100% 40%, 100% 60%, 0 60%)', filter: 'blur(10px)' }} />
                    <div className="absolute bottom-4 text-xs text-white/50 bg-black/50 px-2 rounded">Teleskop Optik (Hubble)</div>
                 </div>
              )}

              {lensType === "infrared" && (
                 <div className="relative w-64 h-64 animate-fade-in flex items-center justify-center">
                    {/* Infrared sees through dust to the warm gas and hidden stars */}
                    <div className="absolute w-full h-full bg-red-600/40 rounded-full blur-3xl mix-blend-screen" />
                    <div className="absolute w-48 h-48 bg-orange-500/50 rounded-full blur-xl mix-blend-screen" />
                    <div className="absolute w-20 h-20 bg-yellow-400 rounded-full blur-md" />
                    <div className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_20px_yellow]" />
                    <div className="absolute bottom-4 text-xs text-white/50 bg-black/50 px-2 rounded">Teleskop Inframerah (James Webb)</div>
                 </div>
              )}

              {lensType === "xray" && (
                 <div className="relative w-64 h-64 animate-fade-in flex items-center justify-center">
                    {/* X-Ray only sees super high energy core (Neutron star / Black hole disk) */}
                    <div className="absolute w-32 h-32 bg-purple-600/80 rounded-full blur-xl mix-blend-screen" />
                    <div className="absolute w-16 h-16 bg-cyan-400/80 rounded-full blur-md mix-blend-screen" />
                    <div className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_30px_cyan]" />
                    <div className="absolute bottom-4 text-xs text-white/50 bg-black/50 px-2 rounded">Teleskop Sinar-X (Chandra)</div>
                 </div>
              )}

           </div>

           {/* Electromagnetic Spectrum Bar */}
           <div className="absolute bottom-0 left-0 right-0 h-16 bg-zinc-900/80 backdrop-blur border-t border-zinc-700 flex flex-col justify-center px-8">
              <div className="w-full h-4 rounded-full overflow-hidden flex shadow-inner">
                 <div className="flex-[2] bg-gradient-to-r from-red-900 to-red-500 relative">
                    {lensType === 'infrared' && <div className="absolute inset-0 border-2 border-white" />}
                 </div>
                 <div className="flex-1 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 relative">
                    {lensType === 'visible' && <div className="absolute inset-0 border-2 border-white shadow-[0_0_10px_white]" />}
                 </div>
                 <div className="flex-[2] bg-gradient-to-r from-purple-500 to-indigo-900 relative">
                    {lensType === 'xray' && <div className="absolute inset-0 border-2 border-white" />}
                 </div>
              </div>
              <div className="flex justify-between text-[10px] text-zinc-400 mt-1 font-bold">
                 <span>Gelombang Radio / Inframerah</span>
                 <span>Cahaya Tampak (Pelangi)</span>
                 <span>UV / Sinar-X / Gamma</span>
              </div>
           </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Membedah Spektrum</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="p-4 bg-zinc-900 rounded-xl border border-white/5 text-sm text-zinc-300 leading-relaxed">
             <p>Cahaya yang bisa dilihat mata kita (Merah hingga Ungu) hanyalah bagian sangat kecil dari total <strong>Spektrum Elektromagnetik</strong> di alam semesta.</p>
          </div>

          <div className="space-y-4">
             <div className="p-3 border-l-4 border-white bg-white/5">
                <h4 className="font-bold text-white text-sm">Visible Light (Tampak)</h4>
                <p className="text-xs text-zinc-400 mt-1">Sama seperti mata kita. Seringkali terhalang oleh debu kosmik (awan gelap di angkasa).</p>
             </div>
             
             <div className="p-3 border-l-4 border-red-500 bg-red-900/10">
                <h4 className="font-bold text-red-400 text-sm">Inframerah (Panas)</h4>
                <p className="text-xs text-zinc-400 mt-1">Bisa "menembus" awan debu gelap, memungkinkan kita melihat bayi bintang yang baru lahir atau planet yang memancarkan sisa panas.</p>
             </div>

             <div className="p-3 border-l-4 border-purple-500 bg-purple-900/10">
                <h4 className="font-bold text-purple-400 text-sm">Sinar-X</h4>
                <p className="text-xs text-zinc-400 mt-1">Hanya memancar dari kejadian ekstrim dan sangat panas (jutaan derajat), seperti gas yang dihisap Lubang Hitam atau sisa ledakan Supernova.</p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
