"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface ReaderVisualPaneProps {
    currentImage: string | null;
    isProcessing: boolean;
    progress: number;
    stageLabel: string;
    currentPageText: string;
    quality?: string | null;
    driftScore?: number | null;
    flagged?: boolean;
    panelCount?: number | null;
    qualitySel?: "draft" | "pro" | "auto";
    onQualityChange?: (q: "draft" | "pro" | "auto") => void;
    panelsSel?: number;
    onPanelsChange?: (n: number) => void;
    canEnhance?: boolean;
    onEnhance?: () => void;
}

export function ReaderVisualPane({
    currentImage, isProcessing, progress, stageLabel, currentPageText,
    quality, driftScore, flagged, panelCount,
    qualitySel, onQualityChange, panelsSel, onPanelsChange,
    canEnhance, onEnhance,
}: ReaderVisualPaneProps) {
    return (
        <div className="hidden lg:flex flex-1 flex-col bg-stone-50/50 dark:bg-stone-900/20 relative z-0">

         {/* Top Bar */}
         <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-start pointer-events-none">
            <Badge variant="outline" className="bg-background/80 backdrop-blur border-border rounded-none px-3 py-1 text-[10px] font-mono uppercase tracking-widest hover:bg-background pointer-events-auto">
                View Mode: Neural Cinema
            </Badge>
            <div className="flex gap-2 pointer-events-auto">
                 {quality && (
                     <Badge variant="outline" className="bg-background/80 backdrop-blur border-border rounded-none px-3 py-1 text-[10px] font-mono uppercase tracking-widest">
                        {quality}{flagged ? " · flagged" : ""}{typeof driftScore === "number" ? ` · drift ${driftScore.toFixed(2)}` : ""}
                    </Badge>
                 )}
                 {typeof panelCount === "number" && panelCount > 1 && (
                     <Badge variant="outline" className="bg-background/80 backdrop-blur border-border rounded-none px-3 py-1 text-[10px] font-mono uppercase tracking-widest">
                        {panelCount} panels
                    </Badge>
                 )}
                 <Badge variant="outline" className="bg-background/80 backdrop-blur border-border rounded-none px-3 py-1 text-[10px] font-mono uppercase tracking-widest">
                    Latency: 12ms
                </Badge>
            </div>
         </div>

         {/* Main Canvas */}
         <div className="flex-1 relative flex items-center justify-center overflow-hidden">

            {/* Loading State / Empty State */}
            {!currentImage && !isProcessing && (
                <div className="text-center opacity-30">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                        className="w-64 h-64 border border-dashed border-foreground/50 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                         <div className="w-48 h-48 border border-dashed border-foreground/30 rounded-full" />
                    </motion.div>
                    <p className="font-mono text-xs uppercase tracking-widest">Awaiting Visualization Command</p>
                </div>
            )}

            {/* Processing State */}
            {isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/10 backdrop-blur-[2px] z-10 w-full h-full">
                     <div className="w-64 space-y-4">
                          <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-foreground/70">
                              <span>{stageLabel}</span>
                              <span>{progress}%</span>
                          </div>
                         <div className="h-1 w-full bg-secondary overflow-hidden">
                             <motion.div
                                className="h-full bg-primary"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                             />
                         </div>
                         <p className="text-center text-[10px] font-mono text-muted-foreground animate-pulse">
                             Running Diffusion Pipeline
                         </p>
                     </div>
                </div>
            )}

            {/* Image Result */}
            <AnimatePresence>
                {currentImage && !isProcessing && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative w-full h-full"
                    >
                       <div className="absolute inset-0 w-full h-full">
                            {/* In a real app, use Next/Image with fill */}
                            <img
                                src={currentImage}
                                alt="Generated Scene"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                       </div>

                       {/* Overlay Caption */}
                       <div className="absolute bottom-12 left-12 right-12 z-20">
                           <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="inline-block bg-background/90 backdrop-blur-md border border-border p-4 max-w-xl shadow-2xl"
                           >
                                <span className="text-[10px] text-primary font-mono uppercase tracking-widest mb-1 block">
                                    // Visual Interpretation
                                </span>
                                <p className="text-sm text-foreground/90 leading-relaxed font-light italic">
                                    "{currentPageText.substring(0, 100)}..."
                                </p>
                           </motion.div>
                       </div>
                    </motion.div>
                )}
            </AnimatePresence>
         </div>

         {/* Bottom control strip: quality/panels selectors + Enhance */}
         <div className="relative z-20 border-t border-border bg-background/80 backdrop-blur px-6 py-3 flex items-center gap-4">
            <label className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Quality
                <select
                    value={qualitySel ?? "auto"}
                    onChange={(e) => onQualityChange?.(e.target.value as "draft" | "pro" | "auto")}
                    className="bg-background border border-border rounded-none px-2 py-1 text-[10px] font-mono uppercase tracking-widest"
                >
                    <option value="auto">Auto</option>
                    <option value="draft">Draft</option>
                    <option value="pro">Pro</option>
                </select>
            </label>
            <label className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Panels
                <select
                    value={String(panelsSel ?? 1)}
                    onChange={(e) => onPanelsChange?.(Math.max(1, Math.min(4, parseInt(e.target.value, 10) || 1)))}
                    className="bg-background border border-border rounded-none px-2 py-1 text-[10px] font-mono uppercase tracking-widest"
                >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
            </label>
            <div className="flex-1" />
            {canEnhance && onEnhance && (
                <button
                    onClick={onEnhance}
                    className="text-[10px] font-mono uppercase tracking-widest border border-primary/50 px-3 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                    Enhance to Pro
                </button>
            )}
         </div>
      </div>
    )
}
