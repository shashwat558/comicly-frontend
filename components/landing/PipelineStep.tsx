"use client";

import { motion } from "framer-motion";

export function PipelineStep({ step, title, icon: Icon, status, desc, delay }: { step: string, title: string, icon: any, status: string, desc: string, delay?: number }) {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="relative z-10 bg-background border border-border p-6 flex flex-col gap-4 group hover:border-primary/50 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.01)] hover:-translate-y-1 duration-500"
        >
            <div className="flex justify-between items-start">
                <span className="font-mono text-xs text-muted-foreground/50 group-hover:text-primary transition-colors">{step}</span>
                <div className="p-2 border border-border bg-secondary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 rounded-sm">
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            
            <div className="pt-4 border-t border-border/50 group-hover:border-primary/20 transition-colors">
                <h3 className="text-lg font-bold uppercase mb-1 tracking-tight">{title}</h3>
                <span className="text-[10px] font-mono uppercase tracking-widest text-primary block mb-3 bg-primary/5 w-fit px-2 py-0.5 rounded-sm">{status}</span>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                    {desc}
                </p>
            </div>
        </motion.div>
    )
}
