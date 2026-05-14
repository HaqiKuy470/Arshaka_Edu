import Link from "next/link";
import { Beaker, BookOpen, Atom, Calculator, Menu } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl group-hover:scale-105 transition-transform">
            <Atom className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">
            Arshaka<span className="text-indigo-400">Edu</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6 font-medium text-sm text-zinc-300">
          <Link href="/simulasi" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Beaker className="w-4 h-4" />
            Semua Simulasi
          </Link>
          <Link href="/simulasi/fisika" className="hover:text-white transition-colors">Fisika</Link>
          <Link href="/simulasi/kimia" className="hover:text-white transition-colors">Kimia</Link>
          <Link href="/simulasi/matematika" className="hover:text-white transition-colors">Matematika</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="hidden md:flex items-center gap-2 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-600/30 transition-colors">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Dashboard
          </Link>
          <button className="md:hidden p-2 text-zinc-300 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
