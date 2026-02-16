"use client";

import { motion } from "framer-motion";

export function Badge({ label, delay }: { label: string, delay?: number }) {
    return (
        <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay }}
            className="px-2 py-1 border border-border/60 text-[10px] font-mono uppercase tracking-wider text-muted-foreground bg-background hover:border-primary/50 hover:text-primary transition-colors cursor-default"
        >
            {label}
        </motion.span>
    )
}
