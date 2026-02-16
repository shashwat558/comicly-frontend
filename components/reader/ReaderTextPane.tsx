"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { SparklesIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ReaderTextPaneProps {
    pages: string[];
    currentPage: number;
    isProcessing: boolean;
    currentImage: string | null;
    onPrev: () => void;
    onNext: () => void;
    onSimulate: () => void;
}

export function ReaderTextPane({ pages, currentPage, isProcessing, currentImage, onPrev, onNext, onSimulate }: ReaderTextPaneProps) {
    return (
        <div className="w-full lg:w-[40%] border-r border-border bg-background/50 backdrop-blur-sm flex flex-col relative z-10 flex-shrink-0">
        
        {/* Header */}
        <header className="h-16 border-b border-border px-6 flex items-center justify-between bg-card/5 shrink-0">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
                <div className="p-1.5 border border-border group-hover:border-primary/50 transition-colors">
                    <ArrowLeftIcon className="w-3 h-3" />
                </div>
                <span className="text-xs font-mono uppercase tracking-widest hidden md:inline-block">Return</span>
            </Link>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                    Connected // {pages.length} Segments
                </span>
            </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-12 relative group">
            <div className="max-w-xl mx-auto">
                <div className="mb-8 flex items-center justify-between text-xs font-mono text-muted-foreground uppercase tracking-widest opacity-50">
                     <span>Segment 0{currentPage + 1}</span>
                     <span>Raw Input Stream</span>
                </div>
                
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPage}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="font-serif text-lg md:text-xl leading-loose text-foreground/90 whitespace-pre-wrap"
                    >
                        {pages[currentPage]}
                    </motion.div>
                </AnimatePresence>

                <div className="h-32" /> {/* Spacer */}
            </div>
        </div>

        {/* Controls */}
        <div className="h-20 border-t border-border p-4 bg-card/10 backdrop-blur-md shrink-0 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={onPrev} 
                    disabled={currentPage === 0 || isProcessing}
                    className="h-10 w-10 border-border rounded-none hover:bg-primary hover:text-primary-foreground transition-all"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                </Button>
                <div className="h-10 px-4 border border-border bg-background flex items-center justify-center min-w-[3rem] font-mono text-xs">
                    {currentPage + 1} / {pages.length}
                </div>
                <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={onNext}
                    disabled={currentPage === pages.length - 1 || isProcessing}
                    className="h-10 w-10 border-border rounded-none hover:bg-primary hover:text-primary-foreground transition-all"
                >
                    <ArrowRightIcon className="w-4 h-4" />
                </Button>
            </div>

            <Button 
                onClick={onSimulate}
                disabled={isProcessing || !!currentImage}
                className={`h-10 px-8 font-mono text-xs uppercase tracking-widest rounded-none transition-all flex items-center gap-2 shadow-sm
                    ${!!currentImage 
                        ? 'bg-secondary text-muted-foreground cursor-not-allowed border border-transparent' 
                        : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/20 hover:scale-[1.02]'
                    }
                `}
            >
                {isProcessing ? (
                    <>
                        <span className="w-2 h-2 bg-background rounded-full animate-bounce" />
                         Processing
                    </>
                ) : !!currentImage ? (
                    <>
                        <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                        Rendered
                    </>
                ) : (
                    <>
                        <SparklesIcon className="w-4 h-4" />
                        Visualize Segment
                    </>
                )}
            </Button>
        </div>
      </div>
    )
}
