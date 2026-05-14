"use client";

import { useState } from "react";

export default function SelOrganel() {
  const [activeOrganelle, setActiveOrganelle] = useState<string | null>(null);

  const organelles = [
    { id: "nucleus", name: "Inti Sel (Nukleus)", desc: "Pusat kontrol sel, menyimpan DNA (materi genetik) dan mengatur aktivitas seluler.", x: "50%", y: "45%", size: "w-24 h-24", color: "bg-indigo-500" },
    { id: "mitochondria", name: "Mitokondria", desc: "Pembangkit energi sel. Tempat terjadinya respirasi seluler untuk menghasilkan ATP.", x: "25%", y: "60%", size: "w-16 h-8", color: "bg-orange-500 rounded-[50%]" },
    { id: "ribosome", name: "Ribosom", desc: "Pabrik protein. Tempat sintesis asam amino menjadi protein.", x: "60%", y: "30%", size: "w-4 h-4", color: "bg-red-400 rounded-full" },
    { id: "golgi", name: "Badan Golgi", desc: "Pusat pengemasan. Memodifikasi, menyortir, dan mengemas protein untuk dikirim.", x: "70%", y: "65%", size: "w-16 h-12", color: "bg-yellow-400 rounded-lg" },
    { id: "membrane", name: "Membran Sel", desc: "Pelindung sel. Mengatur keluar masuknya zat ke dalam sel (selektif permeabel).", x: "50%", y: "50%", size: "w-[90%] h-[90%]", color: "border-4 border-emerald-400 bg-emerald-900/20 rounded-full" },
    { id: "cytoplasm", name: "Sitoplasma", desc: "Cairan agar-agar di dalam sel tempat organel mengapung dan reaksi kimia terjadi.", x: "50%", y: "80%", size: "w-4 h-4", color: "bg-transparent" }
  ];

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 p-8 min-h-[50vh] lg:min-h-0">
        
        {/* Cell Container */}
        <div className="relative w-full max-w-md aspect-square">
          {/* Base Cell Body (Membrane & Cytoplasm) */}
          <div 
            className={`absolute inset-0 rounded-[40%] transition-all duration-300 cursor-pointer ${activeOrganelle === 'membrane' || activeOrganelle === 'cytoplasm' ? 'border-8 border-emerald-400 bg-emerald-900/40' : 'border-4 border-emerald-500/50 bg-emerald-900/20 hover:border-emerald-400'}`}
            onClick={() => setActiveOrganelle('membrane')}
          />
          
          {/* Organelles */}
          {organelles.filter(o => o.id !== 'membrane' && o.id !== 'cytoplasm').map((org) => (
            <div
              key={org.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${org.size} ${org.color} ${activeOrganelle === org.id ? 'scale-125 shadow-[0_0_20px_rgba(255,255,255,0.5)] z-10' : 'hover:scale-110 opacity-80 z-0'}`}
              style={{ left: org.x, top: org.y, borderRadius: org.id === 'nucleus' ? '50%' : undefined }}
              onClick={(e) => { e.stopPropagation(); setActiveOrganelle(org.id); }}
            />
          ))}

          {/* Label Hints */}
          <div className="absolute -bottom-8 left-0 right-0 text-center text-zinc-500 text-sm">
            Klik bagian manapun dari sel untuk melihat detail
          </div>
        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Anatomi Sel Hewan</h3></div>
        <div className="p-6 flex-1 overflow-y-auto">
          {activeOrganelle ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              {organelles.map(org => org.id === activeOrganelle && (
                <div key={org.id}>
                  <div className={`w-12 h-12 mb-4 flex items-center justify-center rounded-xl shadow-lg ${org.color} border border-white/20`} />
                  <h4 className="text-2xl font-bold text-white mb-2">{org.name}</h4>
                  <p className="text-zinc-300 leading-relaxed">{org.desc}</p>
                </div>
              ))}
              <button 
                className="mt-8 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-white transition-colors w-full"
                onClick={() => setActiveOrganelle(null)}
              >
                Tutup Detail
              </button>
            </div>
          ) : (
            <div className="text-center text-zinc-400 mt-10">
              <div className="w-16 h-16 mx-auto bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🔬</span>
              </div>
              Pilih organel pada mikroskop untuk melihat fungsinya.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
