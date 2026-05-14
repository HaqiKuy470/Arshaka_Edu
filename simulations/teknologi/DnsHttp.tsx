"use client";

import { useState, useEffect } from "react";

export default function DnsHttp() {
  const [step, setStep] = useState<number>(0);
  const [url, setUrl] = useState("google.com");
  const [isPlaying, setIsPlaying] = useState(false);

  // Steps: 
  // 0: Initial
  // 1: User types URL
  // 2: Browser asks DNS
  // 3: DNS replies with IP
  // 4: Browser sends HTTP Request to IP
  // 5: Server sends HTTP Response (HTML)
  // 6: Browser renders website

  useEffect(() => {
     let timer: NodeJS.Timeout;
     if (isPlaying && step > 0 && step < 6) {
        timer = setTimeout(() => {
           setStep(s => s + 1);
        }, 1500);
     } else if (step === 6) {
        setIsPlaying(false);
     }
     return () => clearTimeout(timer);
  }, [isPlaying, step]);

  const startSimulation = () => {
     setStep(1);
     setIsPlaying(true);
  };

  const reset = () => {
     setIsPlaying(false);
     setStep(0);
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
      <div className="flex-1 relative flex flex-col items-center justify-center bg-zinc-950 min-h-[50vh] lg:min-h-0 p-4 lg:p-8">
        
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-center">DNS & HTTP Process</h2>
        <p className="text-zinc-400 mb-12 text-center max-w-lg">
           Apa yang sebenarnya terjadi dalam hitungan milidetik saat Anda mengetik alamat web di browser?
        </p>

        {/* The Simulation Stage */}
        <div className="relative w-full max-w-4xl h-80 flex justify-between items-center px-4 md:px-12 bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
           
           {/* Actor 1: Browser/User */}
           <div className={`flex flex-col items-center z-20 transition-all duration-300 ${step >= 1 ? 'scale-110 opacity-100' : 'opacity-50'}`}>
              <div className="w-24 h-24 bg-zinc-800 border-4 border-blue-500 rounded-xl flex items-center justify-center text-5xl shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                 💻
              </div>
              <span className="mt-2 font-bold text-blue-400">Browser</span>
              {step === 6 && (
                 <div className="absolute -bottom-8 bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded animate-fade-in">
                    Page Rendered!
                 </div>
              )}
           </div>

           {/* Actor 2: DNS Server */}
           <div className={`absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 transition-all duration-300 ${step >= 2 && step <= 3 ? 'scale-110 opacity-100' : 'opacity-50'}`}>
              <div className="w-16 h-16 bg-zinc-800 border-4 border-amber-500 rounded-full flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                 📖
              </div>
              <span className="mt-1 font-bold text-amber-400 text-sm">DNS Server</span>
              <span className="text-[9px] text-zinc-500">(Buku Telepon Internet)</span>
           </div>

           {/* Actor 3: Web Server */}
           <div className={`flex flex-col items-center z-20 transition-all duration-300 ${step >= 4 ? 'scale-110 opacity-100' : 'opacity-50'}`}>
              <div className="w-24 h-24 bg-zinc-800 border-4 border-emerald-500 rounded-xl flex items-center justify-center text-5xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                 🗄️
              </div>
              <span className="mt-2 font-bold text-emerald-400">Web Server</span>
           </div>

           {/* Animated Packets / Messages */}
           
           {/* Step 2: Query DNS */}
           {step === 2 && (
              <div className="absolute top-24 left-[30%] -translate-x-1/2 -rotate-[30deg] animate-fade-in">
                 <div className="bg-amber-900/80 border border-amber-500 text-amber-100 text-xs py-1 px-3 rounded-full flex items-center gap-2">
                    <span className="animate-pulse">↑</span> Siapa IP untuk {url}?
                 </div>
              </div>
           )}

           {/* Step 3: DNS Reply */}
           {step === 3 && (
              <div className="absolute top-24 left-[30%] -translate-x-1/2 -rotate-[30deg] animate-fade-in">
                 <div className="bg-amber-600 border border-amber-400 text-white text-xs py-1 px-3 rounded-full font-mono flex items-center gap-2">
                    <span className="animate-pulse">↓</span> 142.250.190.46
                 </div>
              </div>
           )}

           {/* Step 4: HTTP Request */}
           {step === 4 && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-slide-right w-48">
                 <div className="bg-blue-600 border border-blue-400 text-white text-xs py-2 px-3 rounded text-center whitespace-nowrap shadow-lg">
                    <strong>HTTP GET</strong> /index.html
                 </div>
              </div>
           )}

           {/* Step 5: HTTP Response */}
           {step === 5 && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-slide-left w-48" style={{ animationDirection: 'reverse' }}>
                 <div className="bg-emerald-600 border border-emerald-400 text-white text-xs py-2 px-3 rounded text-center whitespace-nowrap shadow-lg">
                    <strong>HTTP 200 OK</strong> + HTML File
                 </div>
              </div>
           )}

        </div>

      </div>

      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 glass-card flex flex-col h-full z-10">
        <div className="p-4 border-b border-white/10"><h3 className="font-semibold text-white">Console Log</h3></div>
        <div className="p-6 flex-1 overflow-y-auto flex flex-col relative">
          
          {!isPlaying && step === 0 && (
             <div className="space-y-4 mb-6">
                <div className="text-xs font-bold text-zinc-500 uppercase">Masukkan URL:</div>
                <div className="flex bg-black rounded-lg border border-zinc-700 p-1">
                   <span className="text-zinc-500 px-2 py-2 text-sm font-mono">https://</span>
                   <input 
                     value={url} onChange={e=>setUrl(e.target.value)}
                     className="bg-transparent w-full text-white font-mono outline-none text-sm"
                   />
                </div>
                <button onClick={startSimulation} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all">
                   Tekan Enter ↵
                </button>
             </div>
          )}

          {step > 0 && (
             <button onClick={reset} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2 rounded-lg transition-all mb-6 text-sm">
                ⏹️ Ulangi Simulasi
             </button>
          )}

          {/* Terminal / Log Output */}
          <div className="flex-1 bg-black rounded-xl border border-zinc-800 p-4 font-mono text-[10px] sm:text-xs overflow-y-auto space-y-2">
             <div className="text-zinc-500">_ Network Inspector _</div>
             
             {step >= 1 && <div className="text-blue-400">[{Date.now() % 10000}] USER: Mengetik {url}</div>}
             {step >= 2 && <div className="text-amber-400">[{Date.now() % 10000}] BROWSER: Menghubungi DNS Server untuk mencari IP {url}...</div>}
             {step >= 3 && <div className="text-amber-300 font-bold">[{Date.now() % 10000}] DNS: Ditemukan! IP-nya adalah 142.250.190.46</div>}
             {step >= 4 && <div className="text-blue-400">[{Date.now() % 10000}] BROWSER: Mengirim HTTP Request (Minta halaman web) ke 142.250.190.46...</div>}
             {step >= 5 && <div className="text-emerald-400 font-bold">[{Date.now() % 10000}] SERVER: HTTP 200 OK. Mengirim data kode HTML, CSS, dan Gambar kembali ke Browser.</div>}
             {step >= 6 && <div className="text-white mt-4 border-t border-zinc-800 pt-2">✨ Browser menyusun kode menjadi tampilan visual web. Selesai dalam 0.4 detik.</div>}
             
             {step > 0 && step < 6 && <div className="text-zinc-600 animate-pulse">Menunggu proses...</div>}
          </div>

        </div>
      </div>
    </div>
  );
}
