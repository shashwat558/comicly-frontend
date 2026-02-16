"use client";

import { motion } from "framer-motion";

export function FeatureCard({ icon: Icon, title, desc, stat, statLabel, delay }: { icon: any, title: string, desc: string, stat: string, statLabel: string, delay?: number }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -5 }}
            className="group p-8 transition-all hover:bg-card/80 bg-background/60 backdrop-blur-sm relative flex flex-col items-center md:items-start text-center md:text-left hover:z-10 border border-transparent hover:border-primary/10 rounded-sm"
        >
            <div className="w-full flex justify-between items-start mb-6">
                <div className="w-12 h-12 border border-border flex items-center justify-center bg-background group-hover:bg-primary group-hover:text-primary-foreground transform group-hover:scale-110 transition-all duration-300 rounded-sm shadow-sm">
                    <Icon className="w-6 h-6 transition-colors" />
                </div>
                <div className="text-right opacity-0 group-hover:opacity-100 transition-opacity -translate-y-2 group-hover:translate-y-0 duration-300">
                    <span className="block text-xl font-bold font-mono text-primary">{stat}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{statLabel}</span>
                </div>
            </div>
            
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-foreground group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed font-light">{desc}</p>
        </motion.div>
    )
}
