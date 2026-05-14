"use client";

import { useState, useEffect } from "react";

export default function ZonaWaktu() {
  const [baseHour, setBaseHour] = useState(12); // UTC 12:00 PM

  // Real world offsets
  const zones = [
    { id: "LA", name: "Los Angeles", offset: -8, icon: "🌴" },
    { id: "NY", name: "New York", offset: -5, icon: "🗽" },
    { id: "LON", name: "London (UTC)", offset: 0, icon: "🎡" },
    { id: "JKT", name: "Jakarta", offset: +7, icon: "🏙️" },
    { id: "TOK", name: "Tokyo", offset: +9, icon: "🗼" },
    { id: "SYD", name: "Sydney", offset: +10, icon: "🦘" }
  ];

  const formatTime = (utc: number, offset: number) => {
    let h = (utc + offset) % 24;
    if (h < 0) h += 24; // Handle negative crossing midnight

    // Day indicator relative to UTC
    let dayStr = "Hari Sama";
    if (utc + offset >= 24) dayStr = "Besok (+1)";
    if (utc + offset < 0) dayStr = "Kemarin (-1)";

    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;

    const isNight = h < 6 || h > 18;

    return { 
       time: `${h12.toString().padStart(2, '0')}:00 ${ampm}`, 
       day: dayStr,
       isNight,
       hour24: h
    };
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        <div className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative p-8">
           
           <h2 className="text-xl font-bold text-white mb-6 text-center">Rotasi Bumi & Zona Waktu Global</h2>

           {/* Visual Map Timeline */}
           <div className="relative w-full h-12 bg-black/50 rounded-full border border-white/10 mb-12 flex items-center px-4">
              {/* Sun indicator based on UTC */}
              <div 
                className="absolute text-2xl transition-all duration-300 transform -translate-x-1/2 -top-8 filter drop-shadow-[0_0_15px_yellow]"
                style={{ 
                   // If UTC is 12, sun is at London (offset 0, center).
                   // 1 hour = 15 degrees = ~4.16% of width map
                   left: `${50 - ((baseHour - 12) / 24) * 100}%`
                }}
              >
                 ☀️
              </div>

              {/* Map out the zones by their offset (-12 to +12) */}
              {zones.map(z => (
                 <div 
                   key={z.id}
                   className="absolute w-2 h-2 bg-white rounded-full"
                   style={{ left: `${((z.offset + 12) / 24) * 100}%` }}
                 >
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs font-bold text-zinc-400">{z.id}</div>
                 </div>
              ))}
           </div>

           {/* Clocks Grid */}
           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
             {zones.map(z => {
                const clock = formatTime(baseHour, z.offset);
                return (
                  <div key={z.id} className={`p-4 rounded-2xl border transition-all ${clock.isNight ? 'bg-indigo-950 border-indigo-900' : 'bg-sky-900/50 border-sky-700/50'}`}>
                     <div className="text-2xl mb-2">{z.icon}</div>
                     <div className="font-bold text-white truncate">{z.name}</div>
                     <div className="text-xs text-zinc-400 mb-2">UTC {z.offset >= 0 ? `+${z.offset}` : z.offset}</div>
                     <div className={`text-xl font-mono font-bold ${clock.isNight ? 'text-indigo-300' : 'text-amber-300'}`}>
                        {clock.time}
                     </div>
                     <div className={`text-[10px] px-2 py-1 rounded inline-block mt-1 ${clock.day !== 'Hari Sama' ? 'bg-rose-500/20 text-rose-300' : 'bg-black/20 text-zinc-400'}`}>
                        {clock.day}
                     </div>
                  </div>
                );
             })}
           </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Waktu Universal (UTC)</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-4">
             <div>
               <div className="flex justify-between text-xs font-bold text-zinc-300 mb-2 uppercase">
                 <span>Atur Waktu London (UTC)</span>
                 <span className="text-white">{baseHour.toString().padStart(2, '0')}:00</span>
               </div>
               <input type="range" min="0" max="23" step="1" value={baseHour} onChange={e=>setBaseHour(parseInt(e.target.value))} className="w-full accent-white" />
             </div>
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <p>Bumi itu bulat (360 derajat) dan berputar satu putaran penuh dalam 24 jam.</p>
            <p>Artinya, setiap <strong>15 derajat bujur</strong> yang kita tempuh, waktu akan berbeda <strong>1 jam</strong>.</p>
            <hr className="border-white/10 my-2" />
            <p><strong>Garis Bujur 0°</strong> terletak di Greenwich, London. Waktu di sini disebut <strong>UTC</strong> (Coordinated Universal Time).</p>
            <p>Karena matahari terbit dari Timur, negara di timur London (seperti Indonesia & Jepang) waktunya lebih cepat (+). Sedangkan di barat (Amerika) waktunya lebih lambat (-).</p>
          </div>

        </div>
      </div>
    </div>
  );
}
