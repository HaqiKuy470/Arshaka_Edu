import Link from "next/link";
import { ArrowRight, Play, Beaker, Calculator, Globe, BookOpen, Zap, Dna, Telescope, Brain } from "lucide-react";

export default function Home() {
  const categories = [
    { name: "Fisika", icon: <Zap className="w-6 h-6" />, color: "from-blue-500 to-cyan-400", slug: "fisika" },
    { name: "Kimia", icon: <Beaker className="w-6 h-6" />, color: "from-purple-500 to-pink-500", slug: "kimia" },
    { name: "Matematika", icon: <Calculator className="w-6 h-6" />, color: "from-emerald-500 to-teal-400", slug: "matematika" },
    { name: "Biologi", icon: <Dna className="w-6 h-6" />, color: "from-green-500 to-lime-400", slug: "biologi" },
    { name: "Ilmu Bumi", icon: <Globe className="w-6 h-6" />, color: "from-amber-500 to-orange-400", slug: "bumi" },
    { name: "Astronomi", icon: <Telescope className="w-6 h-6" />, color: "from-indigo-500 to-blue-500", slug: "astronomi" },
    { name: "Sains Sosial", icon: <BookOpen className="w-6 h-6" />, color: "from-rose-500 to-red-400", slug: "sosial" },
    { name: "Kesehatan", icon: <Brain className="w-6 h-6" />, color: "from-fuchsia-500 to-purple-400", slug: "kesehatan" },
  ];

  return (
    <div className="flex flex-col flex-1 w-full relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-600/20 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative w-full py-24 md:py-32 flex flex-col items-center justify-center text-center px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border-white/10 text-sm font-medium text-indigo-300 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Platform Edukasi Terbuka & Gratis
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mb-6">
          Belajar Sains Melalui <br />
          <span className="text-gradient">Simulasi Interaktif</span>
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed">
          Platform simulasi pembelajaran berbasis web untuk semua kalangan. Pahami konsep abstrak melalui visualisasi dan simulasi dinamis secara gratis.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/simulasi" className="h-14 px-8 rounded-full bg-white text-black font-semibold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors w-full sm:w-auto text-lg">
            <Play className="w-5 h-5 fill-current" />
            Mulai Eksplorasi
          </Link>
          <Link href="/tentang" className="h-14 px-8 rounded-full glass-card border border-white/10 font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors w-full sm:w-auto text-lg">
            Pelajari Lebih Lanjut
          </Link>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="w-full py-24 bg-black/40 border-t border-white/5 relative z-10 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Eksplorasi Mata Pelajaran</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Pilih dari berbagai kategori simulasi interaktif yang dirancang untuk memperdalam pemahaman konsep Anda.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
            {categories.map((category) => (
              <Link 
                key={category.slug} 
                href="/simulasi"
                className="group relative flex flex-col items-center justify-center p-8 rounded-3xl glass-card hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${category.color} transition-opacity duration-300`} />
                <div className={`w-16 h-16 rounded-2xl mb-4 flex items-center justify-center bg-gradient-to-br ${category.color} text-white shadow-lg shadow-black/50 group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <h3 className="font-semibold text-lg">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Simulations (Teaser) */}
      <section className="w-full py-24 container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Simulasi Populer</h2>
            <p className="text-zinc-400">Coba simulasi yang paling sering dimainkan minggu ini.</p>
          </div>
          <Link href="/simulasi" className="hidden md:flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium group">
            Lihat semua <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Gelombang pada Tali", cat: "Fisika", desc: "Eksplorasi konsep gelombang transversal, amplitudo, dan frekuensi.", color: "bg-blue-500" },
            { title: "Penyeimbangan Persamaan", cat: "Kimia", desc: "Latihan menyeimbangkan reaksi kimia dengan visualisasi timbangan.", color: "bg-purple-500" },
            { title: "Tata Surya 3D", cat: "Astronomi", desc: "Jelajahi orbit planet dan pahami skala alam semesta.", color: "bg-indigo-500" }
          ].map((sim, i) => (
            <div key={i} className="glass-card rounded-3xl overflow-hidden group cursor-pointer border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
              <div className="h-48 bg-zinc-900 relative overflow-hidden">
                <div className={`absolute inset-0 opacity-20 ${sim.color} group-hover:opacity-30 transition-opacity`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full glass flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-white ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">{sim.cat}</div>
                <h3 className="text-xl font-semibold mb-2">{sim.title}</h3>
                <p className="text-zinc-400 text-sm">{sim.desc}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link href="/simulasi" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium">
            Lihat semua simulasi <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
