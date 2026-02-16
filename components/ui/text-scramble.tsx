"use client";

import { motion } from "framer-motion";

export function TextScrambleBlur({ text, className }: { text: string, className?: string }) {
    return (
        <span className={`${className} relative`}>
            {text.split('').map((char, i) => (
                <motion.span
                    key={i}
                    initial={{ filter: 'blur(10px)', opacity: 0 }}
                    animate={{ filter: 'blur(0px)', opacity: 1 }}
                    transition={{ 
                        duration: 0.8, 
                        delay: 0.5 + (i * 0.1),
                        ease: "easeOut"
                    }}
                    className="inline-block"
                >
                    {char === ' ' ? '\u00A0' : char}
                </motion.span>
            ))}
        </span>
    );
}
