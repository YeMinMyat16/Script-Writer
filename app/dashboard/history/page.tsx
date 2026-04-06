"use client";

import { useEffect, useState } from "react";
import { History as HistoryIcon, Trash2, Clock, Type, Clapperboard, FileText, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

interface HistoryItem {
    type: string;
    prompt: string;
    result: string;
    date: string;
}

export default function ArchivesPage() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [confirmClear, setConfirmClear] = useState(false);
    const [confirmDeleteIdx, setConfirmDeleteIdx] = useState<number | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("scriptcraft-history");
        if (stored) {
            setHistory(JSON.parse(stored));
        }
    }, []);

    const clearHistory = () => {
        localStorage.removeItem("scriptcraft-history");
        setHistory([]);
        setConfirmClear(false);
    };

    const deleteItem = (index: number) => {
        const updated = [...history];
        updated.splice(index, 1);
        setHistory(updated);
        
        if (updated.length === 0) {
            localStorage.removeItem("scriptcraft-history");
        } else {
            localStorage.setItem("scriptcraft-history", JSON.stringify(updated));
        }
        setConfirmDeleteIdx(null);
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 xl:p-12 mb-32">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-3xl font-serif font-bold uppercase tracking-widest text-white mb-2 flex items-center gap-4">
                        <HistoryIcon className="text-red-500" />
                        Archives
                    </h1>
                    <p className="text-neutral-500">Your local history of generated concepts and scripts.</p>
                </div>
                {history.length > 0 && (
                    <Button variant="outline" className="border-red-900/50 text-red-500 bg-transparent hover:bg-red-950/20" onClick={() => setConfirmClear(true)}>
                        <Trash2 size={16} className="mr-2" />
                        Clear History
                    </Button>
                )}
            </div>

            {history.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center border border-dashed border-neutral-900 rounded-lg">
                    <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mb-6">
                        <Clock className="text-neutral-600" size={24} />
                    </div>
                    <h3 className="font-serif font-bold tracking-widest text-neutral-400 uppercase">Nothing Here Yet</h3>
                    <p className="text-neutral-600">Start generating stories and titles to build your archives.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {history.map((record, i) => (
                        <div key={i} className="p-6 border border-neutral-900 bg-black hover:border-neutral-700 transition-colors rounded-sm relative overflow-hidden group">
                            <div className="flex flex-col md:flex-row md:items-start gap-6">
                                <div className="mt-1 flex-shrink-0">
                                    {record.type === "Title Generation" ? (
                                        <div className="w-10 h-10 rounded-sm bg-blue-950/30 border border-blue-900/50 flex flex-col items-center justify-center">
                                            <Type size={16} className="text-blue-500" />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded-sm bg-red-950/30 border border-red-900/50 flex flex-col items-center justify-center">
                                            <Clapperboard size={16} className="text-red-500" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                        <h3 className="font-bold text-neutral-300 tracking-wide uppercase text-xs">
                                            {record.type}
                                        </h3>
                                        <span className="text-xs text-neutral-600 font-mono mt-1 md:mt-0">{record.date}</span>
                                    </div>
                                    <div className="mb-4">
                                        <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mr-3">Prompt</span>
                                        <span className="text-neutral-400 italic text-sm">"{record.prompt}"</span>
                                    </div>
                                    <div className="pt-4 border-t border-neutral-900 mt-4">
                                        <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest block mb-2">Generated Output</span>
                                        {record.type === "Title Generation" ? (
                                            <span className="text-neutral-200 font-medium break-words leading-relaxed whitespace-pre-wrap">{record.result}</span>
                                        ) : (
                                            <Dialog>
                                                <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border hover:text-accent-foreground h-9 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white border-neutral-700">
                                                        <FileText size={16} className="mr-2 text-amber-500" />
                                                        Read Full Script
                                                </DialogTrigger>
                                                <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-black border-neutral-800 text-white">
                                                    <DialogHeader>
                                                        <DialogTitle className="font-serif text-2xl uppercase tracking-widest text-amber-500 mb-2">Cinematic Script</DialogTitle>
                                                        <DialogDescription className="text-neutral-400">
                                                            Based on: "{record.prompt}"
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="mt-8 relative p-8 bg-[#111] rounded-xl border border-neutral-800 shadow-inner">
                                                        <p className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-neutral-300">
                                                            {record.result}
                                                        </p>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => setConfirmDeleteIdx(i)} 
                                    className="p-2 text-neutral-600 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors flex items-center justify-center cursor-pointer"
                                    title="Delete this record"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Custom Premium Confirm Modals */}
            <AnimatePresence>
                {(confirmClear || confirmDeleteIdx !== null) && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => { setConfirmClear(false); setConfirmDeleteIdx(null); }}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative z-50 w-full max-w-md bg-[#111] border border-red-900/50 p-8 rounded-xl shadow-2xl flex flex-col items-center text-center"
                        >
                            <div className="w-16 h-16 bg-red-950/30 rounded-full flex items-center justify-center mb-6">
                                <AlertTriangle className="text-red-500" size={32} />
                            </div>
                            <h2 className="text-2xl font-serif font-bold text-white mb-2 uppercase tracking-widest">
                                Delete Record
                            </h2>
                            <p className="text-neutral-400 mb-8 leading-relaxed">
                                {confirmClear ? "Are you sure you want to completely wipe your entire history? This action cannot be undone." : "Are you sure you want to delete this specific generation? It will be permanently removed."}
                            </p>
                            <div className="flex w-full gap-4">
                                <Button 
                                    variant="outline" 
                                    className="flex-1 bg-neutral-900 border-neutral-700 hover:bg-neutral-800 text-white" 
                                    onClick={() => { setConfirmClear(false); setConfirmDeleteIdx(null); }}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    variant="destructive" 
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold tracking-wide uppercase" 
                                    onClick={confirmClear ? clearHistory : () => deleteItem(confirmDeleteIdx!)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
