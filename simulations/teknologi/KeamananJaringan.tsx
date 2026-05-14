"use client";

import { useState } from "react";

export default function KeamananJaringan() {
  const [activeTab, setActiveTab] = useState<"firewall"|"enkripsi">("firewall");

  // Firewall State
  const [firewallOn, setFirewallOn] = useState(true);
  const [packets, setPackets] = useState<{id: number, type: "safe"|"malware", status: "travel"|"blocked"|"passed"}[]>([]);

  // Encryption State
  const [message, setMessage] = useState("RAHASIA");
  
  // Simple Caesar cipher for visual effect
  const shift = 3;
  const encryptedStr = message.split('').map(c => {
     if(c.match(/[a-z]/i)) {
        const code = c.charCodeAt(0);
        const base = (code >= 65 && code <= 90) ? 65 : 97;
        return String.fromCharCode(((code - base + shift) % 26) + base);
     }
     return c;
  }).join('');

  const spawnPacket = (type: "safe"|"malware") => {
     const newPacket = { id: Date.now(), type, status: "travel" as const };
     setPackets(prev => [...prev, newPacket]);
     
     // Evaluate after travel time
     setTimeout(() => {
        setPackets(prev => prev.map(p => {
           if (p.id === newPacket.id) {
              if (type === "malware" && firewallOn) return { ...p, status: "blocked" };
              return { ...p, status: "passed" };
           }
           return p;
        }));
     }, 1500);
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col bg-zinc-950 min-h-[50vh] lg:min-h-0 p-4 lg:p-8 overflow-y-auto">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">Keamanan Jaringan (Cybersecurity)</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-lg mx-auto">Bagaimana komputer melindungi diri dari ancaman siber dan penyadapan?</p>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8">
           <div className="bg-zinc-900 border border-zinc-800 p-1 rounded-xl flex gap-1 shadow-lg">
              <button 
                 onClick={() => setActiveTab("firewall")}
                 className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'firewall' ? 'bg-rose-600 text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                 🛡️ Firewall
              </button>
              <button 
                 onClick={() => setActiveTab("enkripsi")}
                 className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'enkripsi' ? 'bg-emerald-600 text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                 🔐 Enkripsi (SSL)
              </button>
           </div>
        </div>

        {/* --- FIREWALL TAB --- */}
        {activeTab === "firewall" && (
           <div className="w-full max-w-4xl mx-auto bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative">
              <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
                 <h3 className="font-bold text-rose-400">Simulasi Firewall (Tembok Api)</h3>
                 <button 
                    onClick={()=>setFirewallOn(!firewallOn)}
                    className={`px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 transition-all ${firewallOn ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-500/50' : 'bg-red-900/50 text-red-400 border border-red-500/50 animate-pulse'}`}
                 >
                    <div className={`w-2 h-2 rounded-full ${firewallOn ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    {firewallOn ? "FIREWALL AKTIF" : "FIREWALL MATI"}
                 </button>
              </div>

              <div className="relative w-full h-48 flex items-center justify-between px-4 overflow-hidden">
                 {/* Internet / Hacker Side */}
                 <div className="flex flex-col items-center z-10 w-24">
                    <div className="text-5xl mb-2">🌍</div>
                    <span className="text-[10px] font-bold text-zinc-500 text-center">Internet Bebas</span>
                 </div>

                 {/* The Wall */}
                 <div className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 transition-all duration-500 ${firewallOn ? 'bg-rose-600/80 border-x-4 border-rose-400 shadow-[0_0_30px_rgba(225,29,72,0.6)]' : 'bg-zinc-800 border-x-2 border-zinc-700 opacity-30'} z-20 flex items-center justify-center`}>
                    {firewallOn && <span className="rotate-90 text-white font-black text-xs tracking-[0.5em] whitespace-nowrap">WALL</span>}
                 </div>

                 {/* Local Network / My PC */}
                 <div className="flex flex-col items-center z-10 w-24">
                    <div className="text-5xl mb-2">💻</div>
                    <span className="text-[10px] font-bold text-blue-400 text-center">Server Internal</span>
                 </div>

                 {/* Packets Rendering */}
                 {packets.map(p => {
                    let leftPos = "50%";
                    let opacity = 1;
                    
                    if (p.status === "travel") { leftPos = "30%"; } // Mid-way to wall
                    else if (p.status === "passed") { leftPos = "85%"; } // Reached PC
                    else if (p.status === "blocked") { leftPos = "45%"; opacity = 0; } // Crashed into wall

                    return (
                       <div 
                         key={p.id} 
                         className={`absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out flex items-center justify-center w-10 h-10 rounded shadow-lg text-lg ${p.type === 'safe' ? 'bg-blue-600' : 'bg-red-600'}`}
                         style={{ left: leftPos, opacity, transform: p.status === 'blocked' ? 'translate(-50%, -50%) scale(2)' : 'translate(-50%, -50%)' }}
                       >
                          {p.type === 'safe' ? '✉️' : '🦠'}
                       </div>
                    );
                 })}
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4 mt-8">
                 <button onClick={()=>spawnPacket('safe')} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2 rounded-xl text-sm transition-all shadow-lg">
                    Kirim Data Aman ✉️
                 </button>
                 <button onClick={()=>spawnPacket('malware')} className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2 rounded-xl text-sm transition-all shadow-lg">
                    Serangan Malware 🦠
                 </button>
              </div>
           </div>
        )}

        {/* --- ENCRYPTION TAB --- */}
        {activeTab === "enkripsi" && (
           <div className="w-full max-w-4xl mx-auto bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative">
              <h3 className="font-bold text-emerald-400 mb-8 border-b border-zinc-800 pb-4">Simulasi Enkripsi (End-to-End Encryption)</h3>

              <div className="flex flex-col gap-8">
                 
                 {/* Input Side (Sender) */}
                 <div className="flex gap-4 items-start">
                    <div className="text-4xl">📱</div>
                    <div className="flex-1">
                       <div className="text-xs font-bold text-zinc-500 mb-1">Pesan Asli (Bisa dibaca Anda)</div>
                       <input 
                          type="text" 
                          value={message} 
                          onChange={(e)=>setMessage(e.target.value.toUpperCase())}
                          className="w-full bg-black border border-zinc-700 text-emerald-400 font-mono p-3 rounded-lg outline-none uppercase"
                       />
                    </div>
                 </div>

                 {/* The Internet (Hacker zone) */}
                 <div className="relative h-24 border-y border-dashed border-rose-500/50 bg-rose-950/10 flex items-center justify-center p-4">
                    <div className="absolute top-2 left-2 text-[10px] text-rose-400 font-bold">ZONA INTERNET RENTAN (Hacker Sniffing)</div>
                    <div className="absolute right-4 text-3xl">🥷</div>
                    
                    <div className="bg-zinc-950 border border-rose-500 text-rose-400 font-mono tracking-widest px-6 py-3 rounded text-xl shadow-[0_0_15px_rgba(225,29,72,0.2)]">
                       {encryptedStr || "..."}
                    </div>
                 </div>

                 {/* Output Side (Receiver) */}
                 <div className="flex gap-4 items-start flex-row-reverse">
                    <div className="text-4xl">💻</div>
                    <div className="flex-1 text-right">
                       <div className="text-xs font-bold text-zinc-500 mb-1">Pesan Didekripsi (Diterima Teman)</div>
                       <div className="w-full bg-black border border-zinc-700 text-emerald-400 font-mono p-3 rounded-lg text-left inline-block">
                          {message || "..."}
                       </div>
                    </div>
                 </div>

              </div>
           </div>
        )}

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Konsep Keamanan</h3></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          {activeTab === "firewall" ? (
             <div className="space-y-4">
                <div className="p-4 bg-rose-950/30 rounded-xl border border-rose-900/50 text-xs text-rose-200 leading-relaxed">
                   <p className="font-bold mb-2">Apa itu Firewall?</p>
                   <p>Firewall layaknya Satpam di pintu gerbang jaringan Anda. Ia memeriksa setiap paket data yang masuk dan keluar berdasarkan aturan (Rules).</p>
                </div>
                <div className="p-4 bg-black/30 rounded-xl border border-white/5 text-xs text-zinc-400 leading-relaxed">
                   <p>Jika paket tersebut berasal dari IP mencurigakan atau mengandung karakteristik virus/malware, satpam akan memblokir (Drop) paket tersebut agar tidak merusak komputer Anda.</p>
                </div>
             </div>
          ) : (
             <div className="space-y-4">
                <div className="p-4 bg-emerald-950/30 rounded-xl border border-emerald-900/50 text-xs text-emerald-200 leading-relaxed">
                   <p className="font-bold mb-2">Apa itu Enkripsi?</p>
                   <p>Enkripsi adalah proses mengacak data menjadi kode rahasia yang tidak bisa dibaca manusia biasa (Ciphertext).</p>
                </div>
                <div className="p-4 bg-black/30 rounded-xl border border-white/5 text-xs text-zinc-400 leading-relaxed">
                   <p>Saat Anda mengirim chat WA, pesan diacak di HP Anda, melewati internet dalam wujud acak (Hacker hanya melihat teks sampah), lalu disusun kembali (Dekripsi) menjadi kalimat utuh di HP teman Anda.</p>
                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
