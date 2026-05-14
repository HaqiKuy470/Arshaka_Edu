"use client";

import { useState } from "react";
import { PlusCircle, MinusCircle } from "lucide-react";

export default function StrukturAtom() {
  const [protons, setProtons] = useState(1);
  const [neutrons, setNeutrons] = useState(0);
  const [electrons, setElectrons] = useState(1);

  // Simplified logic for first few elements
  const elements = ["Kosong", "Hidrogen", "Helium", "Litium", "Berilium", "Boron", "Karbon", "Nitrogen", "Oksigen", "Fluor", "Neon"];
  const elementName = protons <= 10 ? elements[protons] : "Unknown";
  
  const massNumber = protons + neutrons;
  const netCharge = protons - electrons;

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative bg-zinc-950">
      <div className="flex-1 relative flex items-center justify-center p-8">
        
        {/* Atom Visualization */}
        <div className="relative w-96 h-96 flex items-center justify-center">
          
          {/* Electron Shells */}
          <div className="absolute w-full h-full border border-white/10 rounded-full animate-[spin_20s_linear_infinite]" />
          {electrons > 2 && <div className="absolute w-3/4 h-3/4 border border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />}

          {/* Electrons (Simplified positioning) */}
          <div className="absolute inset-0 animate-[spin_20s_linear_infinite]">
            {Array.from({ length: Math.min(electrons, 2) }).map((_, i) => (
              <div key={i} className="absolute w-4 h-4 bg-sky-400 rounded-full shadow-[0_0_10px_#38bdf8]"
                style={{ top: '50%', left: i === 0 ? '-8px' : 'calc(100% - 8px)', transform: 'translateY(-50%)' }} />
            ))}
          </div>
          {electrons > 2 && (
            <div className="absolute inset-12 animate-[spin_15s_linear_infinite_reverse]">
              {Array.from({ length: electrons - 2 }).map((_, i) => {
                const angle = (i / (electrons - 2)) * Math.PI * 2;
                return (
                  <div key={i} className="absolute w-4 h-4 bg-sky-400 rounded-full shadow-[0_0_10px_#38bdf8]"
                    style={{ 
                      top: `calc(50% + ${Math.sin(angle) * 50}%)`, 
                      left: `calc(50% + ${Math.cos(angle) * 50}%)`,
                      transform: 'translate(-50%, -50%)'
                    }} />
                );
              })}
            </div>
          )}

          {/* Nucleus */}
          <div className="relative z-10 flex flex-wrap items-center justify-center w-16 h-16 rounded-full">
            {Array.from({ length: protons }).map((_, i) => (
              <div key={`p-${i}`} className="w-4 h-4 bg-red-500 rounded-full border border-red-700 -m-0.5" title="Proton" />
            ))}
            {Array.from({ length: neutrons }).map((_, i) => (
              <div key={`n-${i}`} className="w-4 h-4 bg-zinc-400 rounded-full border border-zinc-600 -m-0.5" title="Neutron" />
            ))}
          </div>

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h3 className="font-semibold text-white">Bangun Atom</h3>
          <div className="text-xs bg-white/10 px-2 py-1 rounded">{elementName}</div>
        </div>
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          <div className="glass-card p-4 rounded-xl border border-white/10 text-center space-y-2 mb-8">
            <div className="flex justify-between text-sm"><span className="text-zinc-400">Massa Atom:</span><span className="font-mono">{massNumber}</span></div>
            <div className="flex justify-between text-sm"><span className="text-zinc-400">Muatan Net:</span><span className="font-mono">{netCharge > 0 ? `+${netCharge}` : netCharge}</span></div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-400"><div className="w-3 h-3 bg-red-500 rounded-full" /> Protons</div>
              <div className="flex items-center gap-3">
                <button onClick={() => setProtons(p => Math.max(1, p - 1))} className="text-zinc-400 hover:text-white"><MinusCircle className="w-5 h-5" /></button>
                <span className="w-4 text-center font-mono">{protons}</span>
                <button onClick={() => setProtons(p => Math.min(10, p + 1))} className="text-zinc-400 hover:text-white"><PlusCircle className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-300"><div className="w-3 h-3 bg-zinc-400 rounded-full" /> Neutrons</div>
              <div className="flex items-center gap-3">
                <button onClick={() => setNeutrons(n => Math.max(0, n - 1))} className="text-zinc-400 hover:text-white"><MinusCircle className="w-5 h-5" /></button>
                <span className="w-4 text-center font-mono">{neutrons}</span>
                <button onClick={() => setNeutrons(n => Math.min(10, n + 1))} className="text-zinc-400 hover:text-white"><PlusCircle className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sky-400"><div className="w-3 h-3 bg-sky-400 rounded-full" /> Electrons</div>
              <div className="flex items-center gap-3">
                <button onClick={() => setElectrons(e => Math.max(0, e - 1))} className="text-zinc-400 hover:text-white"><MinusCircle className="w-5 h-5" /></button>
                <span className="w-4 text-center font-mono">{electrons}</span>
                <button onClick={() => setElectrons(e => Math.min(10, e + 1))} className="text-zinc-400 hover:text-white"><PlusCircle className="w-5 h-5" /></button>
              </div>
            </div>
          </div>

        </div>
        <div className="p-4 border-t border-white/10 bg-black/20">
          <button onClick={() => {setProtons(1); setNeutrons(0); setElectrons(1);}} className="w-full py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200">Reset Atom</button>
        </div>
      </div>
    </div>
  );
}
