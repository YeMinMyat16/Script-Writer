import Link from "next/link";
import { InteractiveShaderBackground } from "@/components/ui/interactive-shader-background";
import { Button } from "@/components/ui/button";
import { Clapperboard, Sparkles, Feather, Zap, Code, MessageCircle } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen text-white selection:bg-red-900/50">
      <InteractiveShaderBackground colorMode="purple" speed={1.2} intensity={1.5} />

      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-2 font-serif text-lg font-bold tracking-widest uppercase">
            <Clapperboard size={20} className="text-red-500" />
            ScriptCraft
          </div>
          <Link href="/dashboard">
            <Button className="bg-white text-black hover:bg-neutral-200 hover:text-black rounded-full font-bold px-6 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              Try It Free
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="relative z-10 text-center max-w-4xl px-4 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-widest mb-8">
            <Sparkles size={14} />
            Scriptcraft is Live
          </div>
          <h1 className="text-5xl md:text-8xl font-serif font-black tracking-tighter mb-6 bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent drop-shadow-2xl uppercase">
            AI Story Generator
          </h1>
          <p className="text-lg md:text-2xl text-neutral-400 mb-10 max-w-2xl font-serif">
            Generate cinematic, perfectly-formatted Hollywood scripts in seconds. Choose your genre, set the tension, and let AI direct your imagination.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8 py-6 text-lg tracking-wide uppercase font-bold shadow-[0_0_30px_rgba(220,38,38,0.3)]">
                Generate Your Story
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative border-t border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight mb-4 uppercase">
              The Writer's Room
            </h2>
            <p className="text-neutral-400 max-w-xl mx-auto">
              Everything you need to brainstorm, draft, and format a blockbuster script instantly.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap size={32} className="text-amber-500" />}
              title="Lightning Fast"
              description="Type a single concept and instantly receive an entire structured story with acts and dialogue."
            />
            <FeatureCard
              icon={<Clapperboard size={32} className="text-red-500" />}
              title="Cinematic Direction"
              description="Control the exact number of scenes, dial in the dialogue focus, and choose your perfect ending."
            />
            <FeatureCard
              icon={<Feather size={32} className="text-blue-500" />}
              title="Studio Format"
              description="Our outputs are rigorously styled to mirror industry-standard screenplay formatting automatically."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/60 backdrop-blur-md py-12 text-center text-neutral-500 relative z-10">
        <div className="flex justify-center gap-6 mb-6">
          <Code className="hover:text-white transition-colors cursor-pointer" size={24} />
          <MessageCircle className="hover:text-white transition-colors cursor-pointer" size={24} />
        </div>
        <p className="text-sm font-serif tracking-widest uppercase">© 2026 ScriptCraft.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-neutral-900/30 border border-neutral-800 hover:border-neutral-600 transition-colors group">
      <div className="mb-6 p-4 rounded-xl bg-neutral-900 inline-block group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 font-serif tracking-wide">{title}</h3>
      <p className="text-neutral-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}


