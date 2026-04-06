"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clapperboard, Loader2, Quote, Film } from "lucide-react";
import { SelectionGroup, OptionCard, Chip } from "@/components/StitchCards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";

interface Script {
  title: string;
  scenes: string[];
  dialogue: string;
  ending: string;
  raw: string;
}

export default function DashboardPage() {
  const [idea, setIdea] = useState("");
  const [genre, setGenre] = useState("Sci-Fi Thriller");
  const [sceneCount, setSceneCount] = useState(3);
  const [endingType, setEndingType] = useState("Twist");
  const [length, setLength] = useState("Short");
  const [dialogueLevel, setDialogueLevel] = useState("Medium");
  const [englishLevel, setEnglishLevel] = useState("Intermediate");

  const [isGenerating, setIsGenerating] = useState(false);
  const [script, setScript] = useState<Script | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const generateScript = async () => {
    if (!idea.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const text = data.story || "";
      const parsedScript = parseScript(text);
      setScript(parsedScript);
      
      toast.success("Script Generated!", {
        description: "Your cinematic script has been formatted successfully.",
      });

      // Save to Archives
      const pastHistoryStr = localStorage.getItem("scriptcraft-history");
      const pastHistory = pastHistoryStr ? JSON.parse(pastHistoryStr) : [];
      pastHistory.unshift({
          type: "Story Generation",
          prompt: idea,
          result: parsedScript.raw,
          date: new Date().toLocaleString()
      });
      localStorage.setItem("scriptcraft-history", JSON.stringify(pastHistory));

      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (error) {
      console.error("Error generating script:", error);
      toast.error("Generation Failed", {
        description: "Could not connect to the Python backend. Ensure it is running on port 8000.",
      });
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
    <div className="max-w-5xl mx-auto p-4 md:p-8 xl:p-12 mb-32">
        <Tabs defaultValue="generator" className="w-full">
            <TabsList className="mb-10 bg-neutral-900 border border-neutral-800 rounded-sm">
                <TabsTrigger value="generator" className="data-[state=active]:bg-red-950 data-[state=active]:text-amber-500 font-serif uppercase tracking-widest text-xs">Generator</TabsTrigger>
                <TabsTrigger value="format" className="data-[state=active]:bg-red-950 data-[state=active]:text-amber-500 font-serif uppercase tracking-widest text-xs">Formatting Engine</TabsTrigger>
            </TabsList>

            <TabsContent value="generator">
                {/* Configuration Panel */}
                <div className="border border-neutral-900 bg-[#050505] shadow-2xl relative mb-12">
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-red-900/50 -translate-x-px -translate-y-px" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-red-900/50 translate-x-px -translate-y-px" />
                    
                    <div className="p-8 md:p-10 space-y-12">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
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

                            <SelectionGroup label="English Level">
                                <div className="flex flex-wrap gap-2">
                                    {["Simple", "Intermediate", "Advanced"].map(opt => (
                                        <Chip key={opt} label={opt} active={englishLevel === opt} onClick={() => setEnglishLevel(opt)} />
                                    ))}
                                </div>
                            </SelectionGroup>
                        </div>
                    </div>

                    {/* Prompt Area */}
                    <div className="p-8 md:p-10 border-t border-neutral-900 bg-black relative">
                        <Textarea
                            value={idea}
                            onChange={(e) => setIdea(e.target.value)}
                            placeholder="The screen is dark. Describe your opening hook..."
                            className="w-full min-h-40 bg-black border border-neutral-800 rounded-sm p-6 text-lg font-serif focus-visible:ring-1 focus-visible:ring-red-900/50 transition-all resize-none placeholder:text-neutral-800 placeholder:italic text-neutral-300"
                        />
                        <div className="absolute bottom-12 right-12 md:right-16 flex items-center justify-end">
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

                {/* Result Section */}
                <AnimatePresence mode="wait">
                {script && (
                    <motion.div
                        key={script.title}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        ref={scrollRef}
                        className="mt-12"
                    >
                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl shadow-2xl relative overflow-hidden p-8 md:p-12 mb-12">
                            {/* Modern subtle glow */}
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-900/10 blur-[100px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />
                            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-amber-900/10 blur-[80px] rounded-full pointer-events-none -translate-x-1/2 translate-y-1/2" />
                            
                            <h2 className="text-3xl md:text-5xl font-sans font-bold tracking-tight mb-14 text-center text-white relative z-10">
                                {script.title}
                            </h2>

                            <div className="grid gap-6 font-sans max-w-4xl mx-auto relative z-10">
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
                                        <div className="space-y-4 whitespace-pre-wrap text-[16px] leading-[2.2] font-medium tracking-wide text-neutral-200 pl-2 mx-auto">
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
            </TabsContent>
            
            <TabsContent value="format" className="p-12 text-center text-neutral-500 border border-neutral-900 rounded-sm mt-4 italic font-serif">
                Advanced Formatting Engine features coming soon.
            </TabsContent>
        </Tabs>
    </div>
  );
}
