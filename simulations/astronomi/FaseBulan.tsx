"use client";

import { useState } from "react";

export default function FaseBulan() {
  const [day, setDay] = useState(14); // 0-29 days

  // Lunar cycle mapping
  // 0: New Moon, 7: First Quarter, 14: Full Moon, 21: Third Quarter
  const phaseName = 
     day <= 1 ? "Bulan Baru (New Moon)" :
     day <= 6 ? "Bulan Sabit Awal (Waxing Crescent)" :
     day <= 8 ? "Kuartal Pertama (First Quarter)" :
     day <= 13 ? "Bulan Cembung Awal (Waxing Gibbous)" :
     day <= 15 ? "Bulan Purnama (Full Moon)" :
     day <= 20 ? "Bulan Cembung Akhir (Waning Gibbous)" :
     day <= 22 ? "Kuartal Ketiga (Third Quarter)" :
     day <= 28 ? "Bulan Sabit Akhir (Waning Crescent)" : "Bulan Baru (New Moon)";

  // Visual logic for moon phase CSS shadow/clip
  // We simulate this by having a white moon, and overlaying a black shadow circle that moves
  const shadowPos = ((day / 29.5) * 200) - 100; // -100 to 100

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center bg-zinc-950 p-4 lg:p-8 overflow-y-auto">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Fase Bulan (Siklus Lunar)</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-lg mx-auto">
           Bulan tidak memancarkan cahaya sendiri, ia memantulkan cahaya Matahari.
        </p>

        <div className="w-full max-w-3xl bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative min-h-[400px] flex flex-col items-center justify-center overflow-hidden">
           
           {/* Sun Light Source Indicator */}
           <div className="absolute right-[-50px] top-1/2 -translate-y-1/2 w-48 h-48 bg-yellow-500 rounded-full blur-[100px] opacity-30 pointer-events-none" />
           <div className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-500 font-bold tracking-widest uppercase text-xs rotate-90">Cahaya Matahari ☀️</div>

           {/* The Moon display (Telescope View) */}
           <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full bg-zinc-800 overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.1)] border border-white/5 mb-8">
              
              {/* Moon Surface Texture */}
              <div className="absolute inset-0 bg-zinc-300 opacity-90" style={{
                 backgroundImage: 'radial-gradient(circle at 30% 30%, #a1a1aa 10%, transparent 10%), radial-gradient(circle at 70% 60%, #a1a1aa 15%, transparent 15%), radial-gradient(circle at 40% 80%, #a1a1aa 8%, transparent 8%)'
              }} />

              {/* The Shadow Overlay that creates the phase */}
              {/* This is a CSS trick: Using box-shadow on a pseudo element or clip-path. 
                  For a true phase, we use two half-circles or SVG. Let's use a simplified CSS trick using border-radius and width for waning/waxing. */}
              
              <div className="absolute inset-0 bg-black/90 transition-all duration-300" style={{
                 clipPath: 
                   day <= 14 
                   ? `ellipse(${Math.max(0, 100 - (day/14)*100)}% 100% at ${day < 7 ? '100%' : '0%'} 50%)` // Waxing
                   : `ellipse(${Math.max(0, ((day-14)/15)*100)}% 100% at ${day < 22 ? '100%' : '0%'} 50%)` // Waning
                   // Note: True CSS 3D moon phase is complex, this is an approximation.
                   // A better way is using an SVG mask. Let's build an SVG mask!
              }} />

              {/* SVG approach for accurate Moon phase */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                 <defs>
                    <mask id="moon-shadow">
                       {/* Base white (visible) */}
                       <rect x="0" y="0" width="100" height="100" fill="white" />
                       
                       {/* The dark part. Sun is on the RIGHT. 
                           Day 0 (New): Fully black
                           Day 7 (1st Q): Left half black
                           Day 14 (Full): Fully white
                           Day 21 (3rd Q): Right half black
                       */}
                       {day <= 14 ? (
                          // Waxing (0 -> 14). Shadow starts fully covering, recedes to left.
                          <>
                             <rect x="0" y="0" width="50" height="100" fill="black" />
                             <ellipse cx="50" cy="50" rx={Math.abs(7 - day) * (50/7)} ry="50" fill={day <= 7 ? "black" : "white"} />
                          </>
                       ) : (
                          // Waning (14 -> 29.5). Shadow grows from right to left.
                          <>
                             <rect x="50" y="0" width="50" height="100" fill="black" />
                             <ellipse cx="50" cy="50" rx={Math.abs(22 - day) * (50/7.5)} ry="50" fill={day <= 22 ? "white" : "black"} />
                          </>
                       )}
                    </mask>
                 </defs>
                 <rect x="0" y="0" width="100" height="100" fill="rgba(0,0,0,0.85)" mask="url(#moon-shadow)" />
              </svg>

           </div>

           <div className="text-center">
              <h3 className="text-2xl font-bold text-amber-100">{phaseName}</h3>
              <p className="text-zinc-400">Hari ke-{day} dari siklus ~29.5 hari</p>
           </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Siklus Sinodis</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-4">
             <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Geser Hari</div>
             <input 
               type="range" min="0" max="29" step="1" 
               value={day} 
               onChange={e=>setDay(parseInt(e.target.value))} 
               className="w-full accent-emerald-500" 
             />
             <div className="flex justify-between text-xs text-zinc-500 font-bold">
                <span>Bulan Baru</span>
                <span>Purnama</span>
                <span>Bulan Baru</span>
             </div>
          </div>

          <div className="p-4 bg-emerald-900/20 rounded-xl border border-emerald-500/30 text-sm text-emerald-100 leading-relaxed mt-8">
             <p className="font-bold mb-2">Mengapa bentuknya berubah?</p>
             <p>Saat Bulan mengelilingi Bumi, sudut antara Matahari, Bumi, dan Bulan terus berubah. Kita di Bumi hanya melihat bagian Bulan yang tersinari Matahari.</p>
          </div>

          <div className="p-4 bg-zinc-900 rounded-xl border border-white/5 text-xs text-zinc-400 leading-relaxed space-y-2">
             <p><strong>Kalender Hijriah / Qomariyah:</strong></p>
             <p>Penanggalan Islam didasarkan pada fase bulan ini. Tanggal 1 selalu dimulai saat Bulan Sabit Awal (Hilal) terlihat, dan tanggal 14-15 selalu Bulan Purnama.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
