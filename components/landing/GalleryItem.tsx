"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RectangleStackIcon } from "@heroicons/react/24/outline";

export function GalleryItem({ label, sub, color, className, index }: { label: string, sub?: string, color: string, className?: string, index?: number }) {
    return (
        <motion.div 
            variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
            }}
            className={`h-80 md:h-96 w-full flex items-center justify-center relative group overflow-hidden ${className} ${color} transition-colors duration-500`}
        >
            {/* Pattern Overlay */}
            <div className="absolute inset-0 bg-dots-pattern opacity-[0.03] group-hover:opacity-[0.07] transition-opacity" />
            
            {/* Center Action (Hidden initially) */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 transform scale-90 group-hover:scale-100 transition-transform">
                <Button variant="outline" className="bg-background/90 backdrop-blur border-border h-10 px-6 text-xs font-mono uppercase tracking-widest hover:bg-foreground hover:text-background rounded-none shadow-xl">
                    Explore Story
                </Button>
            </div>
            
            {/* Bottom Info Panel */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border/10 bg-gradient-to-t from-background via-background/95 to-transparent backdrop-blur-[2px] transform translate-y-[60%] group-hover:translate-y-0 transition-transform duration-300 ease-out">
                <div className="flex justify-between items-end">
                    <div>
                        <span className="text-[10px] font-mono text-primary uppercase tracking-widest mb-1 block">Series 0{index}</span>
                        <span className="text-sm font-bold font-mono uppercase tracking-widest text-foreground block">{label}</span>
                        {sub && <span className="text-xs text-muted-foreground mt-1 block font-light">{sub}</span>}
                    </div>
                </div>
            </div>

            {/* Placeholder Icon */}
            <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.5 }}
                className="opacity-10 group-hover:opacity-20 transition-all duration-700 text-foreground"
            >
                <RectangleStackIcon className="w-24 h-24 stroke-1" />
            </motion.div>
        </motion.div>
    )
}
