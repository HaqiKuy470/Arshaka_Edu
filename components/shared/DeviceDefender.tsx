"use client";

import { useState, useEffect } from "react";
import { Monitor, Smartphone, RotateCw, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DeviceDefender() {
  const [isMobile, setIsMobile] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      // Basic detection for mobile devices or small viewports
      const userAgent = navigator.userAgent || navigator.vendor;
      const isMobileUA = /android|iphone|kindle|ipad|playbook|silk/i.test(userAgent.toLowerCase());
      const isSmallScreen = window.innerWidth < 1024;
      
      setIsMobile(isMobileUA && isSmallScreen);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  if (!isMobile || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center p-6 text-white text-center overflow-hidden"
      >
        {/* Background Decor */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent" />
        </div>

        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="max-w-md w-full glass-card p-10 rounded-[40px] border border-white/10 relative z-10 space-y-8 shadow-2xl"
        >
          <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-amber-500/10 blur-2xl rounded-full"
            />
            <Smartphone className="w-16 h-16 text-amber-500 relative z-10" />
            <motion.div 
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute -top-2 -right-2"
            >
               <AlertTriangle className="w-8 h-8 text-amber-400" />
            </motion.div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">
              MODE DESKTOP <span className="text-indigo-400">DIBUTUHKAN</span>
            </h2>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed">
              Arshaka Edu dirancang untuk pengalaman laboratorium virtual yang mendalam. Layar ponsel Anda terlalu kecil untuk mengontrol instrumen simulasi secara akurat.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
             <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 text-left">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                   <Monitor className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Aktifkan "Situs Desktop" di menu browser Anda (Chrome/Safari) untuk melanjutkan.
                </div>
             </div>
             
             <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 text-left">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                   <RotateCw className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Gunakan mode Landscape (Miringkan HP) jika Anda sudah mengaktifkan mode desktop.
                </div>
             </div>
          </div>

          <button 
            onClick={() => setDismissed(true)}
            className="w-full py-5 bg-white text-black font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95 shadow-xl"
          >
            Lanjutkan Saja (Tidak Direkomendasikan)
          </button>

          <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-[0.2em]">
            Arshaka Edu Security System • V2.0
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
