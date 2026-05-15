"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide navbar and footer if the path starts with /simulasi/ AND has a slug (not just /simulasi)
  // Or more simply, if it matches /simulasi/[any-slug]
  const isSimulationPage = pathname.startsWith("/simulasi/") && pathname.split("/").length > 2;

  if (isSimulationPage) {
    return <main className="flex-1 flex flex-col">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
    </>
  );
}
