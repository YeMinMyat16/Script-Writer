/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { Clapperboard, Loader2, Film, Quote, History, Trash2, Ticket } from "lucide-react";

interface Script {
  title: string;
  scenes: string[];
  dialogue: string;
  ending: string;
  raw: string;
}

// --- CINEMA PREMIERE UI COMPONENTS ---

const SelectionGroup = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-4">
    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] flex items-center gap-3">
      <div className="w-8 h-[1px] bg-red-800" />
      {label}
      <div className="h-[1px] bg-neutral-900 flex-1" />
    </label>
    {children}
  </div>
);

const OptionCard = ({ icon, label, active, onClick }: { icon: string; label: string; active: boolean; onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-4 p-6 rounded-sm border transition-all duration-500 ${
      active 
        ? "bg-gradient-to-b from-red-950 to-black border-amber-500/40 shadow-[0_0_30px_rgba(220,38,38,0.15)]" 
        : "bg-black border-neutral-900 hover:border-neutral-700 hover:bg-neutral-900/50"
    }`}
  >
    <span className={`text-3xl transition-all duration-500 ${active ? "drop-shadow-[0_0_10px_rgba(245,158,11,0.5)] scale-110" : "grayscale opacity-50"}`}>
      {icon}
    </span>
    <span className={`font-serif tracking-widest text-[11px] uppercase ${active ? "text-amber-500" : "text-neutral-500"}`}>
      {label}
    </span>
  </motion.button>
);

const Chip = ({ label, active, onClick }: { label: string | number; active: boolean; onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-6 py-2.5 rounded-sm border text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
      active 
        ? "bg-red-950 text-amber-500 border-red-800 shadow-md shadow-red-900/20" 
        : "bg-transparent border-neutral-900 text-neutral-600 hover:border-neutral-700 hover:text-neutral-400"
    }`}
  >
    {label}
  </motion.button>
);

// --- MAIN APPLICATION ---

export default function App() {
  const [idea, setIdea] = useState("");
  const [genre, setGenre] = useState("Sci-Fi Thriller");
  const [sceneCount, setSceneCount] = useState(3);
  const [endingType, setEndingType] = useState("Twist");
  const [length, setLength] = useState("Short");
  const [dialogueLevel, setDialogueLevel] = useState("Medium");
  const [englishLevel, setEnglishLevel] = useState("Intermediate");

  const [isGenerating, setIsGenerating] = useState(false);
  const [script, setScript] = useState<Script | null>(null);
  const [history, setHistory] = useState<Script[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const generateScript = async () => {
    if (!idea.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/generate-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idea,
          genre,
          sceneCount,
          endingType,
          length,
          dialogueLevel,
          englishLevel
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const text = data.story || "";
      const parsedScript = parseScript(text);
      setScript(parsedScript);
      setHistory(prev => [parsedScript, ...prev.slice(0, 4)]);
      
      // Scroll to result
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (error) {
      console.error("Error generating script:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const parseScript = (text: string): Script => {
    const sections = text.split(/\n(?=(?:Title|Scene \d|Dialogue|Ending):)/i);
    
    let title = "Untitled Script";
    const scenes: string[] = [];
    let dialogue = "";
    let ending = "";

    sections.forEach(section => {
      const trimmed = section.trim();
      if (trimmed.toLowerCase().startsWith("title:")) {
        title = trimmed.replace(/title:/i, "").trim();
      } else if (trimmed.toLowerCase().startsWith("scene")) {
        scenes.push(trimmed.replace(/scene \d:/i, "").trim());
      } else if (trimmed.toLowerCase().startsWith("dialogue:")) {
        dialogue = trimmed.replace(/dialogue:/i, "").trim();
      } else if (trimmed.toLowerCase().startsWith("ending:")) {
        ending = trimmed.replace(/ending:/i, "").trim();
      }
    });

    return { title, scenes, dialogue, ending, raw: text };
  };

  const genres = [
    { label: "Sci-Fi Thriller", icon: "🛸" },
    { label: "Action Comedy", icon: "🎬" },
    { label: "Horror", icon: "👁️" },
    { label: "Romantic Drama", icon: "🍷" },
    { label: "Mystery", icon: "🕵️‍♂️" }
  ];

  return (
    <div className="min-h-screen bg-black text-neutral-200 font-sans selection:bg-red-900/50">
      {/* Cinematic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(153,27,27,0.08),rgba(0,0,0,1)_70%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-900/30 to-transparent" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-20">
        
        {/* Header */}
        <header className="text-center mb-20 relative">
          <div className="absolute left-1/2 -translate-x-1/2 -top-12 w-px h-16 bg-gradient-to-b from-transparent to-red-600/50" />
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 border border-red-900/30 bg-red-950/20 text-red-500 text-[9px] font-bold uppercase tracking-[0.4em] mb-8 mt-4 rounded-sm"
          >
            <Ticket size={12} />
            Admit One
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif tracking-widest mb-6 text-white uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            ScriptCraft
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4 text-neutral-600 text-[10px] font-serif uppercase tracking-[0.3em]"
          >
            <span>Story</span>
            <span className="w-1 h-1 rounded-full bg-red-800" />
            <span>Cinema</span>
            <span className="w-1 h-1 rounded-full bg-red-800" />
            <span>Magic</span>
          </motion.div>
        </header>

        {/* Input Section */}
        <section className="mb-24">
          <div className="border border-neutral-900 bg-[#050505] shadow-2xl relative">
            
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-red-900/50 -translate-x-px -translate-y-px" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-red-900/50 translate-x-px -translate-y-px" />
            
            {/* Configuration Panel */}
            <div className="p-8 md:p-12 space-y-12">
              
              <SelectionGroup label="The Genre">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {genres.map(g => (
                    <OptionCard 
                      key={g.label} 
                      icon={g.icon} 
                      label={g.label} 
                      active={genre === g.label} 
                      onClick={() => setGenre(g.label)} 
                    />
                  ))}
                </div>
              </SelectionGroup>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
                <SelectionGroup label="Scenes">
                  <div className="flex flex-wrap gap-2">
                    {[3, 4, 5].map(opt => (
                      <Chip key={opt} label={`${opt} Acts`} active={sceneCount === opt} onClick={() => setSceneCount(opt)} />
                    ))}
                  </div>
                </SelectionGroup>

                <SelectionGroup label="Ending">
                  <div className="flex flex-wrap gap-2">
                    {["Twist", "Happy", "Tragic", "Ambiguous"].map(opt => (
                      <Chip key={opt} label={opt} active={endingType === opt} onClick={() => setEndingType(opt)} />
                    ))}
                  </div>
                </SelectionGroup>

                <SelectionGroup label="Pacing">
                  <div className="flex flex-wrap gap-2">
                    {["Short", "Long"].map(opt => (
                      <Chip key={opt} label={opt} active={length === opt} onClick={() => setLength(opt)} />
                    ))}
                  </div>
                </SelectionGroup>

                <SelectionGroup label="Dialogue">
                  <div className="flex flex-wrap gap-2">
                    {["Low", "Medium", "High"].map(opt => (
                      <Chip key={opt} label={opt} active={dialogueLevel === opt} onClick={() => setDialogueLevel(opt)} />
                    ))}
                  </div>
                </SelectionGroup>

                <SelectionGroup label="English">
                  <div className="flex flex-wrap gap-2">
                    {["Simple", "Intermediate", "Advanced"].map(opt => (
                      <Chip key={opt} label={opt} active={englishLevel === opt} onClick={() => setEnglishLevel(opt)} />
                    ))}
                  </div>
                </SelectionGroup>
              </div>
            </div>

            {/* Prompt Area */}
            <div className="p-8 md:p-12 border-t border-neutral-900 bg-black relative">
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="The screen is dark. Describe your opening hook..."
                className="w-full h-40 bg-black border border-neutral-800 rounded-sm p-6 text-lg font-serif focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900/50 transition-all resize-none placeholder:text-neutral-800 placeholder:italic text-neutral-300"
              />
              <div className="absolute bottom-14 right-18 md:right-16 flex items-center justify-end">
                <button
                  onClick={generateScript}
                  disabled={isGenerating || !idea.trim()}
                  className="group flex flex-col items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <div className="h-16 w-32 bg-red-700 border border-red-500 rounded-sm flex items-center justify-center border-b-4 border-b-red-950 transition-transform active:translate-y-1 active:border-b-0 hover:bg-red-600 shadow-[0_0_20px_rgba(185,28,28,0.2)] group-hover:shadow-[0_0_30px_rgba(220,38,38,0.4)]">
                    {isGenerating ? (
                      <Loader2 className="animate-spin text-white" size={24} />
                    ) : (
                      <Clapperboard className="text-white drop-shadow-md" size={32} />
                    )}
                  </div>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-red-500 uppercase">
                    {isGenerating ? "Rolling..." : "Action"}
                  </span>
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* Result Section (Modern) */}
        <AnimatePresence mode="wait">
          {script && (
            <motion.div
              key={script.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-24"
              ref={scrollRef}
            >
              <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl shadow-2xl relative overflow-hidden p-8 md:p-12">
                
                {/* Modern subtle glow */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-900/10 blur-[100px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-amber-900/10 blur-[80px] rounded-full pointer-events-none -translate-x-1/2 translate-y-1/2" />
                
                <h2 className="text-3xl md:text-5xl font-sans font-bold tracking-tight mb-14 text-center text-white">
                  {script.title}
                </h2>

                <div className="grid gap-6 font-sans max-w-3xl mx-auto relative z-10">
                  {script.scenes.map((scene, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-[#111111] border border-neutral-800/80 p-6 md:p-8 rounded-xl hover:border-neutral-700 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-5 border-b border-neutral-800 pb-4">
                        <span className="flex items-center justify-center w-8 h-8 rounded-[8px] bg-red-950/50 border border-red-900/50 text-red-500 font-bold text-sm shadow-inner">
                          {idx + 1}
                        </span>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                          SCENE {idx + 1}
                        </h3>
                      </div>
                      <p className="leading-relaxed text-[16px] whitespace-pre-wrap text-neutral-300">
                        {scene}
                      </p>
                    </motion.div>
                  ))}

                  {script.dialogue && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-6 bg-gradient-to-br from-neutral-900/40 to-black border border-neutral-800 p-6 md:p-8 rounded-xl relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-600 to-transparent" />
                      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest mb-6 text-blue-400/80 pl-2">
                        <Quote size={14} />
                        Dialogue Focus
                      </div>
                      <div className="space-y-4 whitespace-pre-wrap text-[16px] leading-[2.2] font-medium tracking-wide text-neutral-200 pl-2 max-w-4xl mx-auto">
                        {script.dialogue}
                      </div>
                    </motion.div>
                  )}

                  {script.ending && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-8 pt-10 text-center relative"
                    >
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-red-800/50 to-transparent" />
                      <div className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 text-red-500/80 flex items-center justify-center gap-2">
                        <Film size={14} />
                        The Ending
                      </div>
                      <p className="font-semibold text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed whitespace-pre-wrap text-white">
                        {script.ending}
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History */}
        {history.length > 0 && (
          <section className="pt-16 border-t border-neutral-900">
            <div className="flex items-center justify-between mb-8">
              <div className="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.2em]">
                Archives
              </div>
              <button 
                onClick={() => setHistory([])}
                className="text-neutral-700 hover:text-red-500 transition-colors uppercase text-[10px] tracking-widest font-bold"
              >
                Burn Archive
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.map((h, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setScript(h);
                    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-left p-6 bg-[#050505] border border-neutral-900 hover:border-red-900/50 transition-all group flex flex-col gap-2 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-800 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <h3 className="font-serif tracking-widest text-neutral-300 group-hover:text-amber-500 transition-colors truncate text-sm uppercase">
                    {h.title}
                  </h3>
                  <p className="text-xs text-neutral-600 line-clamp-1 italic font-serif">
                    {h.scenes[0]}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center pb-12 text-neutral-800 text-[10px] uppercase tracking-widest font-serif">
        <p>A ScriptCraft Production</p>
      </footer>
    </div>
  );
}
