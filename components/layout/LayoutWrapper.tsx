"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion, AnimatePresence } from "framer-motion";
import DeviceDefender from "../shared/DeviceDefender";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Detection for full-screen simulation modules
  const isSimulationPage = pathname.startsWith("/simulasi/") && pathname.split("/").length > 2;

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] selection:bg-indigo-500/30 selection:text-indigo-200">
      <DeviceDefender />
      
      {/* Global Background Elements */}
      {!isSimulationPage && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
        </div>
      )}

      {/* Conditional Navbar */}
      {!isSimulationPage && <Navbar />}
      
      {/* Page Content with Transition */}
      <main className={`flex-1 flex flex-col relative z-10 ${isSimulationPage ? 'h-screen' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex-1 flex flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Conditional Footer */}
      {!isSimulationPage && <Footer />}
    </div>
  );
}
