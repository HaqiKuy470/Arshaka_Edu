// shared component used by both TermsPage and PrivacyPage
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";

interface Section {
  title: string;
  content: ReactNode;
}

interface LegalPageProps {
  badge: ReactNode;
  badgeLabel: string;
  title: string;
  updated: string;
  intro: ReactNode;
  sections: Section[];
  footerLink: { href: string; label: string };
}

export function LegalPage({
  badge,
  badgeLabel,
  title,
  updated,
  intro,
  sections,
  footerLink,
}: LegalPageProps) {
  return (
    <div className="min-h-screen bg-[#060608] text-white flex flex-col">
      <div className="relative flex-1 flex flex-col items-center px-5 sm:px-6 pt-28 sm:pt-32 pb-20">

        {/* Ambient auras */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-indigo-700/7 blur-[160px] rounded-full" />
          <div className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] bg-purple-700/7 blur-[160px] rounded-full" />
        </div>

        <div className="relative z-10 w-full max-w-2xl">

          {/* Back */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-10 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Kembali ke Beranda</span>
          </Link>

          {/* Card */}
          <div className="bg-zinc-900/50 border border-white/[0.08] rounded-2xl sm:rounded-[28px] p-6 sm:p-8 md:p-10 shadow-2xl space-y-8">

            {/* Header */}
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.18em]">
                {badge}
                {badgeLabel}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                {title}
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                Terakhir diperbarui: {updated}
              </p>
            </div>

            {/* Body */}
            <div className="space-y-7 text-zinc-400 text-sm leading-relaxed font-medium">
              <p>{intro}</p>

              {sections.map((s, i) => (
                <div key={i} className="space-y-3">
                  <h2 className="flex items-center gap-2.5 text-sm font-black text-white uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                    {s.title}
                  </h2>
                  <div className="pl-4 space-y-2">{s.content}</div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-semibold text-zinc-600">
              <span>© {new Date().getFullYear()} Arshaka Edu • Hak Cipta Dilindungi</span>
              <Link
                href={footerLink.href}
                className="text-indigo-400 hover:text-white transition-colors underline underline-offset-4"
              >
                {footerLink.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}