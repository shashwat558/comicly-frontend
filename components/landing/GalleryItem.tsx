"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RectangleStackIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export function GalleryItem({ label, sub, color, className, index, image }: { label: string, sub?: string, color: string, className?: string, index?: number, image?: string }) {
    return (
        <motion.div 
            variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
            }}
            className={`h-80 md:h-96 w-full flex items-center justify-center relative group overflow-hidden ${className} ${color} transition-colors duration-500`}
        >
            {image && (
                <div className="absolute inset-0 z-0">
                    <Image 
                        src={image} 
                        alt={label} 
                        fill
                        className="object-cover opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
            )}

            
            
            {/* Center Action (Hidden initially) */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 transform scale-90 group-hover:scale-100 transition-transform">
                <Button variant="outline" className="bg-background/90 backdrop-blur border-border h-10 px-6 text-xs font-mono uppercase tracking-widest hover:bg-foreground hover:text-background rounded-none shadow-xl">
                    Explore Story
                </Button>
            </div>
            
            {/* Bottom Info Panel */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border/10 bg-gradient-to-t from-background via-background/95 to-transparent backdrop-blur-[2px] transform translate-y-[60%] group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
                <div className="flex justify-between items-end">
                    <div>
                        <span className="text-[10px] font-mono text-primary uppercase tracking-widest mb-1 block">Series 0{index}</span>
                        <span className="text-sm font-bold font-mono uppercase tracking-widest text-foreground block">{label}</span>
                        {sub && <span className="text-xs text-muted-foreground mt-1 block font-light">{sub}</span>}
                    </div>
                </div>
            </div>

           
        </motion.div>
    )
}
