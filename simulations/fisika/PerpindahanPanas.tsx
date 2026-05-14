"use client";

import { useState } from "react";
import { Flame, Sun, Coffee } from "lucide-react";

export default function PerpindahanPanas() {
  const [method, setMethod] = useState<"conduction" | "convection" | "radiation">("conduction");

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 p-6 min-h-[50vh] lg:min-h-0">
        
        {/* Main Visuals based on method */}
        <div className="w-full max-w-2xl h-80 relative flex items-center justify-center">
          
          {method === "conduction" && (
            <div className="relative flex items-center animate-in fade-in duration-500">
              {/* Fire on left */}
              <div className="absolute -left-16 text-red-500 animate-bounce">
                <Flame size={64} />
              </div>
              
              {/* Metal Rod */}
              <div className="w-64 h-8 bg-gradient-to-r from-red-500 via-orange-400 to-zinc-600 rounded-full" />
              
              {/* Hand on right */}
              <div className="absolute -right-16 text-4xl">
                🖐️
              </div>
              
              {/* Heat flow arrows */}
              <div className="absolute top-12 left-0 w-full flex justify-around text-red-400 font-bold">
                <span className="animate-[slide-right_1.5s_infinite]">➔</span>
                <span className="animate-[slide-right_1.5s_infinite_0.5s]">➔</span>
                <span className="animate-[slide-right_1.5s_infinite_1s]">➔</span>
              </div>
              <style jsx>{`
                @keyframes slide-right {
                  0% { transform: translateX(-10px); opacity: 0; }
                  50% { opacity: 1; }
                  100% { transform: translateX(10px); opacity: 0; }
                }
              `}</style>
            </div>
          )}

          {method === "convection" && (
            <div className="relative animate-in fade-in duration-500 flex flex-col items-center">
              {/* Pot of water */}
              <div className="w-40 h-32 border-4 border-t-0 border-zinc-400 rounded-b-3xl bg-blue-500/20 relative overflow-hidden">
                {/* Convection currents */}
                <div className="absolute inset-0 flex justify-around items-center opacity-80">
                  <div className="w-6 h-20 border-2 border-red-500 rounded-[50%] animate-[spin_3s_linear_infinite]" />
                  <div className="w-6 h-20 border-2 border-blue-400 rounded-[50%] animate-[spin_3s_linear_infinite_reverse]" />
                </div>
              </div>
              
              {/* Stove / Fire */}
              <div className="text-red-500 mt-2 flex">
                <Flame size={32} className="animate-pulse" />
                <Flame size={32} className="animate-pulse delay-75" />
                <Flame size={32} className="animate-pulse delay-150" />
              </div>
              
              {/* Steam */}
              <div className="absolute -top-12 text-zinc-400 opacity-50 font-bold text-2xl flex gap-4">
                <span className="animate-bounce">♨</span>
                <span className="animate-bounce delay-100">♨</span>
              </div>
            </div>
          )}

          {method === "radiation" && (
            <div className="relative animate-in fade-in duration-500 flex flex-col items-center justify-center w-full h-full">
              {/* Sun */}
              <div className="absolute top-0 left-10 text-yellow-400 animate-[spin_10s_linear_infinite]">
                <Sun size={80} />
              </div>
              
              {/* Earth/Person */}
              <div className="absolute bottom-10 right-10 text-6xl">
                🌍
              </div>
              
              {/* Electromagnetic waves */}
              <div className="absolute top-20 left-24 w-64 h-32 flex flex-col gap-4 transform rotate-12 origin-top-left">
                <div className="w-full h-px border-t-2 border-yellow-500/50 border-dashed animate-pulse" />
                <div className="w-full h-px border-t-2 border-yellow-500/50 border-dashed animate-pulse delay-75" />
                <div className="w-full h-px border-t-2 border-yellow-500/50 border-dashed animate-pulse delay-150" />
              </div>
            </div>
          )}

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Cara Perpindahan Panas</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          <button 
            onClick={() => setMethod("conduction")} 
            className={`w-full p-4 rounded-xl flex items-center gap-4 transition-colors border text-left ${method === 'conduction' ? 'bg-red-500/20 border-red-500/50' : 'bg-transparent border-white/10 hover:bg-white/5'}`}
          >
            <div className={`p-2 rounded-lg ${method === 'conduction' ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}><Coffee size={24} /></div>
            <div>
              <div className={`font-bold ${method === 'conduction' ? 'text-red-400' : 'text-zinc-300'}`}>Konduksi</div>
              <div className="text-xs text-zinc-500">Zat Padat (Tanpa pindah materi)</div>
            </div>
          </button>

          <button 
            onClick={() => setMethod("convection")} 
            className={`w-full p-4 rounded-xl flex items-center gap-4 transition-colors border text-left ${method === 'convection' ? 'bg-blue-500/20 border-blue-500/50' : 'bg-transparent border-white/10 hover:bg-white/5'}`}
          >
            <div className={`p-2 rounded-lg ${method === 'convection' ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}><Flame size={24} /></div>
            <div>
              <div className={`font-bold ${method === 'convection' ? 'text-blue-400' : 'text-zinc-300'}`}>Konveksi</div>
              <div className="text-xs text-zinc-500">Zat Cair/Gas (Materi ikut pindah)</div>
            </div>
          </button>

          <button 
            onClick={() => setMethod("radiation")} 
            className={`w-full p-4 rounded-xl flex items-center gap-4 transition-colors border text-left ${method === 'radiation' ? 'bg-yellow-500/20 border-yellow-500/50' : 'bg-transparent border-white/10 hover:bg-white/5'}`}
          >
            <div className={`p-2 rounded-lg ${method === 'radiation' ? 'bg-yellow-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}><Sun size={24} /></div>
            <div>
              <div className={`font-bold ${method === 'radiation' ? 'text-yellow-400' : 'text-zinc-300'}`}>Radiasi</div>
              <div className="text-xs text-zinc-500">Tanpa medium (Gelombang elektromagnetik)</div>
            </div>
          </button>

          <div className="w-full h-px bg-white/10 my-4" />

          {method === "conduction" && <p className="text-sm text-zinc-400 leading-relaxed">Contoh: Ujung sendok logam akan terasa panas saat ujung lainnya dipanaskan di atas api.</p>}
          {method === "convection" && <p className="text-sm text-zinc-400 leading-relaxed">Contoh: Air mendidih berputar karena air panas di bawah naik (massa jenis ringan) dan air dingin di atas turun.</p>}
          {method === "radiation" && <p className="text-sm text-zinc-400 leading-relaxed">Contoh: Panas matahari sampai ke bumi melewati ruang hampa udara, atau duduk di dekat api unggun.</p>}

        </div>
      </div>
    </div>
  );
}
