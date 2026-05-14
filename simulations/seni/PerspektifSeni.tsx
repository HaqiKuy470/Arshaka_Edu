"use client";

import { useState } from "react";

export default function PerspektifSeni() {
  const [vanishingPoints, setVanishingPoints] = useState<1|2|3>(1);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center bg-zinc-950 p-4 lg:p-8 overflow-y-auto">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Perspektif Seni Rupa</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-lg mx-auto">
           Bagaimana menggambar objek 3D di atas kertas 2D (ilusi kedalaman).
        </p>

        <div className="w-full max-w-4xl bg-zinc-900 border border-white/10 rounded-3xl p-4 shadow-2xl relative min-h-[400px] flex items-center justify-center overflow-hidden">
           
           {/* Canvas Container */}
           <div className="relative w-full aspect-video max-w-3xl border border-zinc-700 bg-zinc-950 overflow-hidden">
              
              {/* Horizon Line (Garis Cakrawala) */}
              <div className={`absolute left-0 right-0 border-t-2 border-red-500/50 ${vanishingPoints === 3 ? 'top-[20%]' : 'top-1/2'}`} />
              <span className={`absolute text-[10px] text-red-500 font-bold left-4 ${vanishingPoints === 3 ? 'top-[20%]' : 'top-1/2'} -translate-y-4`}>Garis Cakrawala (Mata Pengamat)</span>

              {/* 1 POINT PERSPECTIVE */}
              {vanishingPoints === 1 && (
                 <>
                    {/* Vanishing Point (Center) */}
                    <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2 z-20 shadow-[0_0_10px_red]" />
                    
                    {/* Perspective Lines */}
                    <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" preserveAspectRatio="none">
                       <line x1="0" y1="0" x2="50%" y2="50%" stroke="#3b82f6" strokeWidth="1" strokeDasharray="5,5" />
                       <line x1="100%" y1="0" x2="50%" y2="50%" stroke="#3b82f6" strokeWidth="1" strokeDasharray="5,5" />
                       <line x1="0" y1="100%" x2="50%" y2="50%" stroke="#3b82f6" strokeWidth="1" strokeDasharray="5,5" />
                       <line x1="100%" y1="100%" x2="50%" y2="50%" stroke="#3b82f6" strokeWidth="1" strokeDasharray="5,5" />
                    </svg>

                    {/* Objects: Box Front Facing */}
                    <div className="absolute bottom-[20%] left-[20%] w-24 h-24 border-2 border-emerald-500 bg-emerald-950/50 z-10" />
                    {/* Perspective Depth Lines for Box 1 */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                       <line x1="20%" y1="80%" x2="50%" y2="50%" stroke="#10b981" strokeWidth="1" />
                       <line x1="20%" y1="56%" x2="50%" y2="50%" stroke="#10b981" strokeWidth="1" />
                       <line x1="32%" y1="80%" x2="50%" y2="50%" stroke="#10b981" strokeWidth="1" />
                       <line x1="32%" y1="56%" x2="50%" y2="50%" stroke="#10b981" strokeWidth="1" />
                    </svg>
                 </>
              )}

              {/* 2 POINT PERSPECTIVE */}
              {vanishingPoints === 2 && (
                 <>
                    {/* Vanishing Points (Left & Right) */}
                    <div className="absolute top-1/2 left-[10%] w-3 h-3 bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2 z-20 shadow-[0_0_10px_red]" />
                    <div className="absolute top-1/2 right-[10%] w-3 h-3 bg-red-500 rounded-full translate-x-1/2 -translate-y-1/2 z-20 shadow-[0_0_10px_red]" />
                    
                    {/* Perspective Lines */}
                    <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" preserveAspectRatio="none">
                       {/* From Left VP */}
                       <line x1="10%" y1="50%" x2="50%" y2="80%" stroke="#3b82f6" strokeWidth="1" strokeDasharray="5,5" />
                       <line x1="10%" y1="50%" x2="50%" y2="20%" stroke="#3b82f6" strokeWidth="1" strokeDasharray="5,5" />
                       {/* From Right VP */}
                       <line x1="90%" y1="50%" x2="50%" y2="80%" stroke="#f59e0b" strokeWidth="1" strokeDasharray="5,5" />
                       <line x1="90%" y1="50%" x2="50%" y2="20%" stroke="#f59e0b" strokeWidth="1" strokeDasharray="5,5" />
                    </svg>

                    {/* Center Vertical Edge of Building */}
                    <div className="absolute left-1/2 top-[30%] bottom-[30%] border-l-4 border-emerald-500 -translate-x-1/2 z-10 shadow-[0_0_10px_#10b981]" />
                    
                    {/* Building Walls */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                       <polygon points="50%,30% 50%,70% 30%,60% 30%,40%" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="2" />
                       <polygon points="50%,30% 50%,70% 70%,60% 70%,40%" fill="rgba(16, 185, 129, 0.4)" stroke="#10b981" strokeWidth="2" />
                    </svg>
                 </>
              )}

              {/* 3 POINT PERSPECTIVE */}
              {vanishingPoints === 3 && (
                 <>
                    {/* Vanishing Points */}
                    <div className="absolute top-[20%] left-[10%] w-3 h-3 bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2 z-20 shadow-[0_0_10px_red]" />
                    <div className="absolute top-[20%] right-[10%] w-3 h-3 bg-red-500 rounded-full translate-x-1/2 -translate-y-1/2 z-20 shadow-[0_0_10px_red]" />
                    <div className="absolute bottom-[5%] left-1/2 w-3 h-3 bg-red-500 rounded-full -translate-x-1/2 translate-y-1/2 z-20 shadow-[0_0_10px_red]" />
                    
                    {/* Box / Skyscraper looking down */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                       {/* Guide lines to bottom VP */}
                       <line x1="50%" y1="95%" x2="40%" y2="30%" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="5,5" opacity="0.3" />
                       <line x1="50%" y1="95%" x2="60%" y2="30%" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="5,5" opacity="0.3" />
                       
                       {/* Building Left Wall */}
                       <polygon points="50%,80% 43%,45% 50%,35% 50%,80%" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="2" />
                       {/* Building Right Wall */}
                       <polygon points="50%,80% 57%,45% 50%,35% 50%,80%" fill="rgba(16, 185, 129, 0.4)" stroke="#10b981" strokeWidth="2" />
                       {/* Building Roof */}
                       <polygon points="50%,35% 43%,45% 50%,55% 57%,45%" fill="rgba(16, 185, 129, 0.6)" stroke="#10b981" strokeWidth="2" />
                    </svg>
                 </>
              )}

           </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Titik Lenyap (Vanishing Point)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          <button 
             onClick={()=>setVanishingPoints(1)} 
             className={`w-full p-4 flex flex-col gap-2 text-left rounded-xl transition-all border ${vanishingPoints === 1 ? 'bg-blue-900 border-blue-500 text-white shadow-lg' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
          >
             <div className="font-bold">1 Titik Lenyap</div>
             <div className="text-[10px] opacity-80 leading-relaxed">Cocok untuk menggambar objek lurus dari depan (seperti lorong, rel kereta api, jalan raya). Semua garis kedalaman menuju 1 titik di tengah.</div>
          </button>
          
          <button 
             onClick={()=>setVanishingPoints(2)} 
             className={`w-full p-4 flex flex-col gap-2 text-left rounded-xl transition-all border ${vanishingPoints === 2 ? 'bg-emerald-900 border-emerald-500 text-white shadow-lg' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
          >
             <div className="font-bold">2 Titik Lenyap</div>
             <div className="text-[10px] opacity-80 leading-relaxed">Cocok untuk menggambar sudut bangunan/gedung (melihat dari pojok). Garis vertikal tetap lurus, namun sisi kiri dan kanan menyempit ke dua titik lenyap berbeda.</div>
          </button>

          <button 
             onClick={()=>setVanishingPoints(3)} 
             className={`w-full p-4 flex flex-col gap-2 text-left rounded-xl transition-all border ${vanishingPoints === 3 ? 'bg-amber-900 border-amber-500 text-white shadow-lg' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
          >
             <div className="font-bold">3 Titik Lenyap</div>
             <div className="text-[10px] opacity-80 leading-relaxed">Sangat dramatis! Biasanya dipakai untuk sudut pandang Mata Burung (Bird's eye) melihat ke bawah dari helikopter, atau Mata Cacing (Worm's eye) melihat gedung pencakar langit dari bawah.</div>
          </button>

        </div>
      </div>
    </div>
  );
}
