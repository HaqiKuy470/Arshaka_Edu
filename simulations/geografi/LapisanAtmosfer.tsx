"use client";

import { useState } from "react";

export default function LapisanAtmosfer() {
  const [altitude, setAltitude] = useState(10); // in km

  // Determine active layer based on altitude (km)
  let activeLayer = "";
  if (altitude <= 12) activeLayer = "troposfer";
  else if (altitude <= 50) activeLayer = "stratosfer";
  else if (altitude <= 85) activeLayer = "mesosfer";
  else if (altitude <= 600) activeLayer = "termosfer";
  else activeLayer = "eksosfer";

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        {/* Visualizer Scale */}
        <div className="relative w-full max-w-sm h-full flex items-end pb-8">
           
           {/* Layers Background Stack */}
           <div className="absolute inset-0 flex flex-col-reverse w-full h-full opacity-80 border-x border-t border-white/20 rounded-t-[100px] overflow-hidden">
              {/* Troposphere (0-12) -> ~10% visual height */}
              <div className="h-[15%] w-full bg-gradient-to-t from-sky-400 to-sky-600 relative">
                 <span className="absolute bottom-1 right-2 text-[10px] text-white/50 font-bold">Troposfer (12 km)</span>
                 <span className="absolute bottom-2 left-2 text-2xl">☁️🌧️🦅</span>
              </div>
              {/* Stratosphere (12-50) -> ~20% */}
              <div className="h-[20%] w-full bg-gradient-to-t from-sky-700 to-blue-800 relative border-b border-white/20">
                 <span className="absolute bottom-1 right-2 text-[10px] text-white/50 font-bold">Stratosfer (50 km)</span>
                 <span className="absolute bottom-4 left-4 text-xl">✈️</span>
                 <div className="absolute top-1/2 w-full h-2 bg-purple-500/30 blur-sm" /> {/* Ozone layer hint */}
              </div>
              {/* Mesosphere (50-85) -> ~20% */}
              <div className="h-[20%] w-full bg-gradient-to-t from-blue-900 to-indigo-950 relative border-b border-white/20">
                 <span className="absolute bottom-1 right-2 text-[10px] text-white/50 font-bold">Mesosfer (85 km)</span>
                 <span className="absolute top-1/2 left-8 text-xl">☄️</span>
              </div>
              {/* Thermosphere (85-600) -> ~30% */}
              <div className="h-[30%] w-full bg-gradient-to-t from-indigo-950 to-zinc-900 relative border-b border-white/20">
                 <span className="absolute bottom-1 right-2 text-[10px] text-white/50 font-bold">Termosfer / Ionosfer (600 km)</span>
                 <span className="absolute top-1/4 left-10 text-xl animate-pulse text-green-400 blur-[2px]">〰️ Aurora</span>
              </div>
              {/* Exosphere (>600) -> ~15% */}
              <div className="flex-1 w-full bg-black relative">
                 <span className="absolute bottom-1 right-2 text-[10px] text-white/50 font-bold">Eksosfer (&gt;600 km)</span>
                 <span className="absolute top-1/4 left-1/2 text-xl">🛰️</span>
              </div>
           </div>

           {/* Altitude Indicator Line */}
           <div 
             className="absolute left-0 w-full border-t-2 border-dashed border-red-500 z-10 transition-all duration-300 pointer-events-none shadow-[0_0_10px_red]"
             style={{ 
               // Map altitude to percentage of height (Custom non-linear scale for UX)
               bottom: altitude <= 12 ? `${(altitude/12)*15}%` :
                       altitude <= 50 ? `${15 + ((altitude-12)/38)*20}%` :
                       altitude <= 85 ? `${35 + ((altitude-50)/35)*20}%` :
                       altitude <= 600 ? `${55 + ((altitude-85)/515)*30}%` :
                       `${85 + ((Math.min(altitude, 1000)-600)/400)*15}%`
             }}
           >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white font-mono text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                 {altitude} km
              </div>
           </div>
           
           {/* Ground */}
           <div className="absolute -bottom-8 left-0 w-full h-8 bg-emerald-800 rounded-b-xl border border-white/10" />
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Lapisan Atmosfer Bumi</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="space-y-2">
            <div className="flex justify-between items-end">
               <label className="text-sm font-bold text-zinc-300">Atur Ketinggian</label>
               <span className="font-mono text-xl text-white font-bold">{altitude} <span className="text-sm text-zinc-500">km</span></span>
            </div>
            {/* Non-linear slider trick using fixed steps to represent the vast differences */}
            <input 
              type="range" className="w-full accent-white" 
              min="0" max="100" step="1" 
              value={
                 altitude <= 12 ? altitude :
                 altitude <= 50 ? 12 + ((altitude-12)/38)*20 :
                 altitude <= 85 ? 32 + ((altitude-50)/35)*20 :
                 altitude <= 600 ? 52 + ((altitude-85)/515)*30 :
                 82 + ((altitude-600)/400)*18
              }
              onChange={(e) => {
                 const v = parseInt(e.target.value);
                 let alt = 0;
                 if (v <= 12) alt = v;
                 else if (v <= 32) alt = 12 + ((v-12)/20)*38;
                 else if (v <= 52) alt = 50 + ((v-32)/20)*35;
                 else if (v <= 82) alt = 85 + ((v-52)/30)*515;
                 else alt = 600 + ((v-82)/18)*400;
                 setAltitude(Math.round(alt));
              }} 
            />
          </div>

          {/* Info Panel based on activeLayer */}
          <div className="mt-8 border-t border-white/10 pt-6">
            {activeLayer === "troposfer" && (
              <div className="animate-fade-in">
                 <h4 className="text-xl font-bold text-sky-400 mb-2">Troposfer</h4>
                 <div className="text-xs font-mono bg-sky-950 text-sky-300 p-1 rounded inline-block mb-3">0 - 12 km | Suhu makin dingin</div>
                 <p className="text-sm text-zinc-300">Lapisan terbawah tempat kita hidup dan bernapas. <strong>Semua peristiwa cuaca</strong> (awan, hujan, angin, petir) terjadi di lapisan ini. Pesawat komersial biasa terbang di bagian teratas lapisan ini untuk menghindari turbulensi awan.</p>
              </div>
            )}
            
            {activeLayer === "stratosfer" && (
              <div className="animate-fade-in">
                 <h4 className="text-xl font-bold text-blue-400 mb-2">Stratosfer</h4>
                 <div className="text-xs font-mono bg-blue-950 text-blue-300 p-1 rounded inline-block mb-3">12 - 50 km | Suhu memanas</div>
                 <p className="text-sm text-zinc-300">Lapisan yang sangat tenang tanpa awan cuaca. Terdapat <strong>Lapisan Ozon (O₃)</strong> yang sangat penting karena menyerap radiasi Ultraviolet (UV) berbahaya dari matahari. Karena penyerapan UV inilah suhu di sini justru memanas ke atas.</p>
              </div>
            )}

            {activeLayer === "mesosfer" && (
              <div className="animate-fade-in">
                 <h4 className="text-xl font-bold text-indigo-400 mb-2">Mesosfer</h4>
                 <div className="text-xs font-mono bg-indigo-950 text-indigo-300 p-1 rounded inline-block mb-3">50 - 85 km | Suhu sangat dingin</div>
                 <p className="text-sm text-zinc-300">Lapisan paling dingin di atmosfer (bisa mencapai -90°C). <strong>Meteor yang jatuh ke bumi terbakar hancur di lapisan ini</strong> akibat gesekan udara, terlihat oleh kita sebagai bintang jatuh.</p>
              </div>
            )}

            {activeLayer === "termosfer" && (
              <div className="animate-fade-in">
                 <h4 className="text-xl font-bold text-zinc-300 mb-2">Termosfer (Ionosfer)</h4>
                 <div className="text-xs font-mono bg-zinc-800 text-zinc-300 p-1 rounded inline-block mb-3">85 - 600 km | Suhu sangat panas</div>
                 <p className="text-sm text-zinc-400">Radiasi matahari membuat partikel bermuatan listrik (Ion), sehingga <strong>gelombang radio bisa dipantulkan</strong> di sini. Tempat terjadinya <strong>Aurora</strong> dan tempat mengorbitnya Stasiun Luar Angkasa Internasional (ISS).</p>
              </div>
            )}

            {activeLayer === "eksosfer" && (
              <div className="animate-fade-in">
                 <h4 className="text-xl font-bold text-zinc-500 mb-2">Eksosfer</h4>
                 <div className="text-xs font-mono bg-black border border-zinc-800 text-zinc-500 p-1 rounded inline-block mb-3">{'>'} 600 km | Vakum</div>
                 <p className="text-sm text-zinc-500">Batas paling luar yang perlahan menyatu dengan ruang hampa angkasa luar. Gravitasi sangat lemah, molekul udara bisa lepas ke luar angkasa. Satelit komunikasi mengorbit di wilayah ini.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
