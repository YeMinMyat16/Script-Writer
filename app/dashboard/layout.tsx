"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clapperboard, Sparkles, BookOpen, History, Settings } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-900 bg-black hidden md:flex flex-col">
        <Link href="/" className="p-6 border-b border-neutral-900 flex items-center gap-3 font-serif uppercase tracking-widest text-lg font-bold hover:text-red-500 transition-colors">
          <Clapperboard className="text-red-600" />
          <span>ScriptCraft</span>
        </Link>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold border transition-colors ${pathname === "/dashboard" ? "bg-red-950/20 text-red-500 border-red-900/30" : "text-neutral-400 border-transparent hover:bg-neutral-900 hover:text-white"}`}>
            <Sparkles size={18} />
            Story Generator
          </Link>
          <Link href="/dashboard/titles" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold border transition-colors ${pathname === "/dashboard/titles" ? "bg-red-950/20 text-red-500 border-red-900/30" : "text-neutral-400 border-transparent hover:bg-neutral-900 hover:text-white"}`}>
            <BookOpen size={18} />
            Title Generator
          </Link>
          <Link href="/dashboard/history" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold border transition-colors ${pathname === "/dashboard/history" ? "bg-red-950/20 text-red-500 border-red-900/30" : "text-neutral-400 border-transparent hover:bg-neutral-900 hover:text-white"}`}>
            <History size={18} />
            Archives
          </Link>
        </nav>
        <div className="p-4 border-t border-neutral-900">
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-neutral-500 hover:bg-neutral-900 hover:text-white transition-colors">
            <Settings size={18} />
            Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header (Mobile) */}
        <header className="md:hidden border-b border-neutral-900 bg-black p-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-serif uppercase tracking-widest font-bold">
            <Clapperboard className="text-red-500" size={20} />
            ScriptCraft
          </Link>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto w-full relative">
          {children}
        </div>
      </main>
    </div>
  );
}
