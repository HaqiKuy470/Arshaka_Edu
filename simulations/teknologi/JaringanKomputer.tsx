"use client";

import { useState, useEffect } from "react";

export default function JaringanKomputer() {
  const [activeNetwork, setActiveNetwork] = useState<"lan"|"wan">("lan");
  const [packets, setPackets] = useState<{id: number, from: string, to: string, progress: number}[]>([]);

  // Simulation loop for packets
  useEffect(() => {
     const interval = setInterval(() => {
        setPackets(prev => {
           // Move packets
           const moved = prev.map(p => ({ ...p, progress: p.progress + 5 }));
           // Remove finished
           return moved.filter(p => p.progress < 100);
        });
     }, 100);
     return () => clearInterval(interval);
  }, []);

  const sendPacketLAN = (from: string, to: string) => {
     setPackets(prev => [...prev, { id: Date.now(), from, to, progress: 0 }]);
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Topologi & Jaringan Komputer</h2>
        <p className="text-zinc-400 mb-12 text-center max-w-lg">Bagaimana komputer saling berbicara bertukar data?</p>

        {activeNetwork === "lan" && (
           <div className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative animate-fade-in flex flex-col items-center">
              <h3 className="text-emerald-400 font-bold text-xl mb-8 uppercase tracking-widest">LAN (Local Area Network)</h3>
              
              <div className="relative w-full h-64 flex flex-col items-center justify-center">
                 
                 {/* The Switch (Center) */}
                 <div className="w-24 h-16 bg-zinc-800 border-2 border-emerald-500 rounded-lg flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    SWITCH
                 </div>

                 {/* Computers (Nodes) */}
                 {/* Top */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer group z-20" onClick={() => sendPacketLAN('top', 'bottom')}>
                    <div className="text-4xl">💻</div>
                    <div className="text-[10px] text-zinc-500 font-bold mt-1 group-hover:text-white">PC A (192.168.1.2)</div>
                    <div className="absolute top-8 w-1 h-20 bg-zinc-700 -z-10" />
                    {packets.filter(p=>p.from==='top').map(p => (
                       <div key={p.id} className="absolute w-3 h-3 bg-emerald-400 rounded-full animate-ping" style={{top: `${30 + (p.progress * 0.7)}%`}} />
                    ))}
                 </div>

                 {/* Bottom */}
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer group z-20" onClick={() => sendPacketLAN('bottom', 'left')}>
                    <div className="absolute bottom-10 w-1 h-20 bg-zinc-700 -z-10" />
                    <div className="text-4xl">💻</div>
                    <div className="text-[10px] text-zinc-500 font-bold mt-1 group-hover:text-white">PC C (192.168.1.4)</div>
                 </div>

                 {/* Left */}
                 <div className="absolute top-1/2 left-0 -translate-y-1/2 flex flex-col items-center cursor-pointer group z-20" onClick={() => sendPacketLAN('left', 'top')}>
                    <div className="text-4xl">💻</div>
                    <div className="text-[10px] text-zinc-500 font-bold mt-1 group-hover:text-white">PC B (192.168.1.3)</div>
                    <div className="absolute left-10 top-1/2 w-28 h-1 bg-zinc-700 -translate-y-1/2 -z-10" />
                 </div>

                 {/* Right (Server) */}
                 <div className="absolute top-1/2 right-0 -translate-y-1/2 flex flex-col items-center cursor-pointer group z-20">
                    <div className="text-4xl">🗄️</div>
                    <div className="text-[10px] text-zinc-500 font-bold mt-1 group-hover:text-white">Local Server</div>
                    <div className="absolute right-10 top-1/2 w-28 h-1 bg-zinc-700 -translate-y-1/2 -z-10" />
                 </div>

              </div>

              <p className="text-zinc-400 text-sm mt-8 text-center max-w-lg">Klik PC mana saja untuk mensimulasikan pengiriman paket data! Dalam LAN, komputer terhubung ke satu pusat (Switch/Router) dalam radius dekat (kantor/rumah).</p>
           </div>
        )}

        {activeNetwork === "wan" && (
           <div className="w-full max-w-4xl bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative animate-fade-in flex flex-col items-center overflow-hidden">
              <h3 className="text-blue-400 font-bold text-xl mb-12 uppercase tracking-widest">WAN (Wide Area Network / Internet)</h3>
              
              <div className="relative w-full h-64 flex justify-between items-center px-12">
                 
                 {/* Cloud Internet */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-blue-900/30 rounded-[100px] blur-xl z-0 animate-pulse" />
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl z-10 text-white/50 font-black tracking-widest border-4 border-dashed border-white/20 p-8 rounded-full">INTERNET</div>

                 {/* LAN Indonesia */}
                 <div className="flex flex-col items-center z-20">
                    <div className="w-20 h-16 bg-zinc-800 border-2 border-rose-500 rounded-lg flex flex-col items-center justify-center font-bold text-white mb-4">
                       <span className="text-[10px] text-zinc-400 mb-1">Router</span>
                       <span>🔴 ID</span>
                    </div>
                    <div className="flex gap-2">
                       <span className="text-2xl">💻</span>
                       <span className="text-2xl">📱</span>
                    </div>
                    <div className="text-[10px] font-bold text-zinc-500 mt-2">LAN Kantor Jakarta</div>
                 </div>

                 {/* Fiber Optic Undersea Cable Simulation */}
                 <div className="absolute top-1/2 left-32 right-32 h-1 bg-gradient-to-r from-rose-500 via-blue-500 to-emerald-500 -z-10 overflow-hidden">
                    <div className="w-1/4 h-full bg-white shadow-[0_0_10px_white] animate-[slide-right_2s_linear_infinite]" />
                 </div>

                 {/* Server USA */}
                 <div className="flex flex-col items-center z-20">
                    <div className="w-20 h-16 bg-zinc-800 border-2 border-emerald-500 rounded-lg flex flex-col items-center justify-center font-bold text-white mb-4">
                       <span className="text-[10px] text-zinc-400 mb-1">Router</span>
                       <span>🇺🇸 US</span>
                    </div>
                    <div className="flex gap-2">
                       <span className="text-3xl">🗄️</span>
                       <span className="text-3xl">🗄️</span>
                    </div>
                    <div className="text-[10px] font-bold text-zinc-500 mt-2">Data Center Google</div>
                 </div>

              </div>

              <p className="text-zinc-400 text-sm mt-12 text-center max-w-lg">WAN adalah jaringan skala raksasa antar benua. Jaringan LAN dari seluruh dunia dihubungkan oleh kabel serat optik bawah laut membentuk sebuah jaring laba-laba global (Web).</p>
           </div>
        )}

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Skala Jaringan</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          <button 
             onClick={()=>setActiveNetwork("lan")} 
             className={`w-full p-4 flex items-center gap-4 text-left rounded-xl transition-all border ${activeNetwork === 'lan' ? 'bg-emerald-900 border-emerald-500 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
          >
             <span className="text-3xl">🏠</span>
             <div>
                <div className="text-sm">LAN</div>
                <div className="text-[10px] opacity-70 mt-1 font-normal">Satu gedung / ruangan</div>
             </div>
          </button>
          
          <button 
             onClick={()=>setActiveNetwork("wan")} 
             className={`w-full p-4 flex items-center gap-4 text-left rounded-xl transition-all border ${activeNetwork === 'wan' ? 'bg-blue-900 border-blue-500 text-white font-bold' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
          >
             <span className="text-3xl">🌍</span>
             <div>
                <div className="text-sm">WAN (Internet)</div>
                <div className="text-[10px] opacity-70 mt-1 font-normal">Antar negara / global</div>
             </div>
          </button>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-8">
            <p><strong>Bagaimana komputer tahu tujuan paket data?</strong></p>
            <p>Setiap perangkat (HP, Laptop) memiliki <strong>IP Address</strong> (Alamat IP) layaknya alamat rumah. Contoh: 192.168.1.5. Router dan Switch bertugas sebagai 'Pak Pos' yang membaca alamat ini dan mengarahkan paket ke jalan yang benar.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
