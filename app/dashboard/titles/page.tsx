"use client";

import { useState } from "react";
import { BookOpen, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function TitlesPage() {
    const [idea, setIdea] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [titles, setTitles] = useState<string[]>([]);
    
    
    const generateTitles = async () => {
        if (!idea.trim()) return;
        setIsGenerating(true);

        try {
            const response = await fetch("http://127.0.0.1:8000/generate-title", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idea }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            const newTitles = data.titles || [];
            if (newTitles.length > 0) {
                setTitles(newTitles);
                toast.success("Titles Generated", { description: "Brainstorming complete!" });
                
                // Save to Archives
                const pastHistoryStr = localStorage.getItem("scriptcraft-history");
                const pastHistory = pastHistoryStr ? JSON.parse(pastHistoryStr) : [];
                pastHistory.unshift({
                    type: "Title Generation",
                    prompt: idea,
                    result: newTitles.join(" | "),
                    date: new Date().toLocaleString()
                });
                localStorage.setItem("scriptcraft-history", JSON.stringify(pastHistory));
            }

        } catch (error) {
            console.error("Error generating titles:", error);
            toast.error("Generation Failed", {
                description: "Could not connect to the Python backend. Ensure it is running on port 8000.",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 xl:p-12 mb-32">
            <h1 className="text-3xl font-serif font-bold uppercase tracking-widest text-white mb-2">Title Generator</h1>
            <p className="text-neutral-500 mb-12">Hook your audience with the perfect title.</p>

            <div className="border border-neutral-900 bg-[#050505] shadow-2xl relative mb-12">
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-red-900/50 -translate-x-px -translate-y-px pointer-events-none" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-red-900/50 translate-x-px -translate-y-px pointer-events-none" />
                
                <div className="p-8 md:p-10 border-t border-neutral-900 bg-black relative">
                    <Textarea
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        placeholder="What is your story about?"
                        className="w-full min-h-40 bg-black border border-neutral-800 rounded-sm p-6 text-lg font-serif focus-visible:ring-1 focus-visible:ring-red-900/50 transition-all resize-none placeholder:text-neutral-800 placeholder:italic text-neutral-300"
                    />
                    <div className="absolute bottom-12 right-12 md:right-16 flex items-center justify-end">
                        <button
                            onClick={generateTitles}
                            disabled={isGenerating || !idea.trim()}
                            className="group flex flex-col items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <div className="h-16 w-32 bg-neutral-800 border border-neutral-700 rounded-sm flex items-center justify-center border-b-4 border-b-neutral-900 transition-transform active:translate-y-1 active:border-b-0 hover:bg-neutral-700">
                                {isGenerating ? (
                                    <Loader2 className="animate-spin text-white" size={24} />
                                ) : (
                                    <BookOpen className="text-white drop-shadow-md" size={32} />
                                )}
                            </div>
                            <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-500 uppercase">
                                {isGenerating ? "Brainstorming..." : "Generate"}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {titles.length > 0 && (
                <div className="grid gap-4 mt-8">
                    {titles.map((t, i) => (
                        <div key={i} className="p-6 border border-neutral-800 bg-black text-2xl font-serif text-white rounded-sm text-center">
                            {t}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
