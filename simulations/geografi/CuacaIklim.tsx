"use client";

import { useState } from "react";

export default function CuacaIklim() {
  const [mode, setMode] = useState<"cuaca"|"iklim">("cuaca");
  
  // Interactivity for Cuaca
  const [humidity, setHumidity] = useState(50);
  const [pressure, setPressure] = useState(1013); // mb
  const [temp, setTemp] = useState(25);

  // Interactivity for Iklim
  const [latitude, setLatitude] = useState(0); // 0 = equator, 90 = pole

  const getWeatherPrediction = () => {
    if (pressure < 1000 && humidity > 70) return { icon: "⛈️", text: "Badai / Hujan Lebat", color: "text-blue-500" };
    if (pressure < 1010 && humidity > 60) return { icon: "🌧️", text: "Hujan", color: "text-blue-400" };
    if (humidity > 80) return { icon: "☁️", text: "Mendung Berawan", color: "text-zinc-400" };
    if (temp > 30 && humidity < 40) return { icon: "☀️", text: "Cerah & Kering (Panas)", color: "text-amber-400" };
    return { icon: "🌤️", text: "Cerah Berawan", color: "text-yellow-400" };
  };

  const getClimatePrediction = () => {
    const absLat = Math.abs(latitude);
    if (absLat < 23.5) return { name: "Tropis", desc: "Hangat sepanjang tahun, curah hujan tinggi, hanya ada musim kemarau dan hujan.", color: "bg-emerald-600" };
    if (absLat < 40) return { name: "Subtropis", desc: "Transisi. Memiliki 4 musim dengan musim panas yang cukup kering.", color: "bg-yellow-600" };
    if (absLat < 66.5) return { name: "Sedang (Temperate)", desc: "Perbedaan 4 musim (Semi, Panas, Gugur, Dingin) sangat jelas.", color: "bg-orange-600" };
    return { name: "Kutub (Polar)", desc: "Sangat dingin sepanjang tahun. Didominasi es dan salju.", color: "bg-sky-600" };
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-8">
        
        {/* Visual Display */}
        <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative min-h-[400px]">
           
           <div className="flex w-full bg-black/50 absolute top-0 z-10">
              <button onClick={()=>setMode("cuaca")} className={`flex-1 py-4 font-bold text-sm uppercase tracking-widest transition-all ${mode==='cuaca' ? 'bg-sky-600 text-white' : 'text-zinc-500 hover:bg-white/5'}`}>☁️ Cuaca</button>
              <button onClick={()=>setMode("iklim")} className={`flex-1 py-4 font-bold text-sm uppercase tracking-widest transition-all ${mode==='iklim' ? 'bg-emerald-600 text-white' : 'text-zinc-500 hover:bg-white/5'}`}>🌍 Iklim</button>
           </div>

           <div className="pt-20 p-8 h-full flex flex-col justify-center">
              {mode === "cuaca" ? (
                 <div className="text-center animate-fade-in">
                    <div className="text-8xl mb-4 filter drop-shadow-lg">{getWeatherPrediction().icon}</div>
                    <h2 className={`text-3xl font-bold mb-2 ${getWeatherPrediction().color}`}>{getWeatherPrediction().text}</h2>
                    <p className="text-zinc-400 text-sm mb-8">Kondisi atmosfer pada waktu singkat dan tempat tertentu.</p>

                    <div className="grid grid-cols-3 gap-4">
                       <div className="bg-black/50 p-3 rounded-xl border border-white/5">
                          <div className="text-xs text-zinc-500 mb-1">Suhu</div>
                          <div className="font-mono font-bold text-lg text-amber-400">{temp}°C</div>
                       </div>
                       <div className="bg-black/50 p-3 rounded-xl border border-white/5">
                          <div className="text-xs text-zinc-500 mb-1">Kelembaban</div>
                          <div className="font-mono font-bold text-lg text-blue-400">{humidity}%</div>
                       </div>
                       <div className="bg-black/50 p-3 rounded-xl border border-white/5">
                          <div className="text-xs text-zinc-500 mb-1">Tekanan</div>
                          <div className="font-mono font-bold text-lg text-rose-400">{pressure} mb</div>
                       </div>
                    </div>
                 </div>
              ) : (
                 <div className="text-center animate-fade-in flex flex-col items-center">
                    {/* Earth SVG */}
                    <div className="relative w-48 h-48 rounded-full bg-blue-900 border-4 border-white/10 overflow-hidden mb-6 shadow-[0_0_30px_rgba(30,58,138,0.5)]">
                       {/* Equator line */}
                       <div className="absolute top-1/2 left-0 w-full h-[1px] bg-red-500/50" />
                       {/* Latitude indicator line */}
                       <div 
                         className="absolute left-0 w-full h-[2px] bg-white shadow-[0_0_10px_white] transition-all duration-300 z-10" 
                         style={{ top: `${50 - (latitude/90)*50}%` }}
                       />
                       {/* Dummy continents */}
                       <div className="absolute top-4 left-4 w-20 h-16 bg-emerald-700/50 rounded-full blur-md" />
                       <div className="absolute bottom-10 right-4 w-24 h-12 bg-emerald-700/50 rounded-full blur-md" />
                    </div>

                    <h2 className="text-3xl font-bold mb-2 text-white">Iklim {getClimatePrediction().name}</h2>
                    <p className="text-zinc-400 text-sm mb-4">Pola cuaca rata-rata dalam jangka waktu sangat lama (30+ tahun).</p>
                    
                    <div className={`${getClimatePrediction().color} text-white text-xs p-4 rounded-xl font-bold shadow-lg w-full text-left`}>
                       {getClimatePrediction().desc}
                    </div>
                 </div>
              )}
           </div>
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Perbedaan Cuaca & Iklim</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          {mode === "cuaca" ? (
             <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="text-xs font-bold text-zinc-300 uppercase block mb-2">Suhu Udara ({temp}°C)</label>
                  <input type="range" min="0" max="45" value={temp} onChange={e=>setTemp(parseInt(e.target.value))} className="w-full accent-amber-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-300 uppercase block mb-2">Kelembaban Air ({humidity}%)</label>
                  <input type="range" min="10" max="100" value={humidity} onChange={e=>setHumidity(parseInt(e.target.value))} className="w-full accent-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-300 uppercase block mb-2">Tekanan Udara ({pressure} milibar)</label>
                  <input type="range" min="980" max="1030" value={pressure} onChange={e=>setPressure(parseInt(e.target.value))} className="w-full accent-rose-500" />
                  <p className="text-[10px] text-zinc-500 mt-1">Tekanan rendah ({"<"} 1000) menarik awan dan badai. Tekanan tinggi memicu cuaca cerah.</p>
                </div>
             </div>
          ) : (
             <div className="space-y-4 animate-fade-in">
                <div>
                  <div className="flex justify-between text-xs font-bold text-zinc-300 mb-2 uppercase">
                    <span>Garis Lintang (Latitude)</span>
                    <span className="text-emerald-400">{Math.abs(latitude)}° {latitude >= 0 ? "LU" : "LS"}</span>
                  </div>
                  <input type="range" min="-90" max="90" step="1" value={latitude} onChange={e=>setLatitude(parseInt(e.target.value))} className="w-full accent-emerald-500" />
                  <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                     <span>Kutub Selatan</span>
                     <span>Khatulistiwa</span>
                     <span>Kutub Utara</span>
                  </div>
                </div>
             </div>
          )}

          <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 text-xs text-zinc-300 leading-relaxed mt-4">
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <strong className="text-sky-400 border-b border-sky-400/30 pb-1 mb-2 block">CUACA</strong>
                  <ul className="list-disc pl-4 space-y-1 opacity-80">
                     <li>Waktu: Singkat (jam/hari)</li>
                     <li>Area: Sempit (kota)</li>
                     <li>Sifat: Cepat berubah</li>
                     <li>Ilmu: Meteorologi</li>
                  </ul>
               </div>
               <div>
                  <strong className="text-emerald-400 border-b border-emerald-400/30 pb-1 mb-2 block">IKLIM</strong>
                  <ul className="list-disc pl-4 space-y-1 opacity-80">
                     <li>Waktu: Lama (puluhan tahun)</li>
                     <li>Area: Luas (negara/benua)</li>
                     <li>Sifat: Stabil</li>
                     <li>Ilmu: Klimatologi</li>
                  </ul>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
