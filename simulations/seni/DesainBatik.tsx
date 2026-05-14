"use client";

import { useState } from "react";

export default function DesainBatik() {
  const [motif, setMotif] = useState<"kawung"|"parang"|"megamendung">("kawung");
  const [primaryColor, setPrimaryColor] = useState("#8b5cf6"); // Purple
  const [secondaryColor, setSecondaryColor] = useState("#fcd34d"); // Gold
  const [scale, setScale] = useState(1);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center bg-zinc-950 p-4 lg:p-8 overflow-y-auto">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Pola Batik Nusantara</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-lg mx-auto">
           Mengenal bentuk repetitif seni tradisional batik dan filosofinya.
        </p>

        {/* The Batik Canvas */}
        <div className="w-full max-w-2xl aspect-square md:aspect-video bg-zinc-900 border border-zinc-700 shadow-2xl relative overflow-hidden flex items-center justify-center">
           
           <div 
             className="absolute inset-0 opacity-80"
             style={{
                backgroundColor: primaryColor,
                backgroundImage: 
                  motif === "kawung" ? `radial-gradient(circle at 0 0, transparent 40%, ${secondaryColor} 40%, ${secondaryColor} 60%, transparent 60%), radial-gradient(circle at 100% 0, transparent 40%, ${secondaryColor} 40%, ${secondaryColor} 60%, transparent 60%), radial-gradient(circle at 0 100%, transparent 40%, ${secondaryColor} 40%, ${secondaryColor} 60%, transparent 60%), radial-gradient(circle at 100% 100%, transparent 40%, ${secondaryColor} 40%, ${secondaryColor} 60%, transparent 60%)` 
                  : motif === "parang" ? `repeating-linear-gradient(-45deg, ${primaryColor}, ${primaryColor} 20px, ${secondaryColor} 20px, ${secondaryColor} 40px)` 
                  : `radial-gradient(circle at center, ${secondaryColor} 0%, transparent 50%), radial-gradient(circle at 20px 20px, ${secondaryColor} 0%, transparent 50%)`, // Simulating cloud bumps for Megamendung
                backgroundSize: motif === "kawung" ? `${60 * scale}px ${60 * scale}px` : motif === "parang" ? `${80 * scale}px ${80 * scale}px` : `${100 * scale}px ${50 * scale}px`,
                backgroundPosition: motif === "kawung" ? `0 0` : `0 0, 50px 25px`
             }}
           />

           {motif === "megamendung" && (
              <div className="absolute inset-0" style={{
                 backgroundColor: 'transparent',
                 backgroundImage: `radial-gradient(ellipse at center, ${primaryColor} 30%, transparent 70%)`,
                 backgroundSize: `${80 * scale}px ${40 * scale}px`,
                 backgroundPosition: '40px 20px',
                 mixBlendMode: 'overlay'
              }} />
           )}

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Eksplorasi Motif</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div>
             <div className="text-xs font-bold text-zinc-500 mb-2 uppercase">Pilih Motif Dasar</div>
             <select 
               value={motif} onChange={e=>setMotif(e.target.value as any)}
               className="w-full bg-zinc-900 border border-zinc-700 text-white p-3 rounded-lg outline-none focus:border-emerald-500"
             >
                <option value="kawung">Kawung (Yogyakarta/Solo)</option>
                <option value="parang">Parang (Kerajaan Mataram)</option>
                <option value="megamendung">Mega Mendung (Cirebon)</option>
             </select>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-4">
             <div className="text-xs font-bold text-zinc-500 uppercase">Warna Kain (Dasar)</div>
             <input type="color" value={primaryColor} onChange={e=>setPrimaryColor(e.target.value)} className="w-full h-10 rounded cursor-pointer" />
             
             <div className="text-xs font-bold text-zinc-500 uppercase">Warna Malam (Lilin/Motif)</div>
             <input type="color" value={secondaryColor} onChange={e=>setSecondaryColor(e.target.value)} className="w-full h-10 rounded cursor-pointer" />
          </div>

          <div className="pt-4 border-t border-white/10">
             <div className="text-xs font-bold text-zinc-500 mb-2 uppercase">Skala Pengulangan</div>
             <input type="range" min="0.5" max="3" step="0.1" value={scale} onChange={e=>setScale(parseFloat(e.target.value))} className="w-full accent-amber-500" />
          </div>

          <div className="p-4 bg-amber-950/30 rounded-xl border border-amber-900/50 mt-4 text-xs text-amber-200">
             {motif === "kawung" && "Batik Kawung berpola bulatan mirip buah kawung (sejenis kelapa/kolang-kaling). Melambangkan kesucian dan umur panjang."}
             {motif === "parang" && "Batik Parang menyerupai ombak lautan yang tak pernah berhenti bergerak. Melambangkan semangat pantang menyerah."}
             {motif === "megamendung" && "Batik Mega Mendung (awan mendung) dipengaruhi oleh budaya Tiongkok. Melambangkan kesejukan dan ketenangan."}
          </div>

        </div>
      </div>
    </div>
  );
}
