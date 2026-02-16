"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import LoginSVGComponent from "@/components/ui/LoginSVGComponent";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative flex items-center justify-center overflow-hidden selection:bg-primary/20">
        
      
      {/* Background Patterns */}
      <div className="fixed inset-0 bg-grid-pattern z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-br from-background via-transparent to-background z-0 pointer-events-none" />

      {/* Decorative Gradient Blob */}
      <motion.div 
        animate={{ 
            opacity: [0.3, 0.5, 0.3], 
            scale: [1, 1.1, 1],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none z-0" 
      />

      {/* Back Link */}
      <Link href="/" className="absolute top-8 left-8 z-50 group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <div className="p-2 border border-border bg-background group-hover:border-primary/50 transition-colors">
                <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono uppercase tracking-widest hidden md:inline-block">Return to Base</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10 px-6"
      >
        <motion.div
            initial={{ opacity: 0, filter: "blur(20px)" }}
            animate={{ opacity: 0.6, filter: "blur(0px)" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[-10] w-[800px] h-[800px] pointer-events-none"
        >
            <LoginSVGComponent className="w-full h-full animate-spin-slow text-foreground" />
        </motion.div>
        <div className="border border-border bg-card/50 backdrop-blur-2xl p-8 md:p-12 relative overflow-hidden group">
            
            
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary opacity-50" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary opacity-50" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary opacity-50" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary opacity-50" />

            <div className="mb-8 text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center font-bold tracking-tighter shadow-sm shadow-primary/20 mx-auto mb-4">
                    C
                </div>
                <h1 className="text-2xl font-bold tracking-tight uppercase mb-2">Identify Yourself</h1>
                <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest">
                    Enter access credentials to proceed
                </p>
            </div>

            <form className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                        User Handle / Email
                    </Label>
                    <Input 
                        id="email" 
                        type="email" 
                        placeholder="OPERATOR@COMICLY.SYS" 
                        className="bg-background/50 border-border font-mono text-sm placeholder:text-muted-foreground/30 focus-visible:ring-primary/20 h-12 rounded-none"
                    />
                </div>
                
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="password" className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                            Passcode
                        </Label>
                        <Link href="#" className="text-[10px] font-mono uppercase tracking-widest text-primary hover:underline">
                            Reset Protocol?
                        </Link>
                    </div>
                    <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••••••" 
                        className="bg-background/50 border-border font-mono text-sm placeholder:text-muted-foreground/30 focus-visible:ring-primary/20 h-12 rounded-none"
                    />
                </div>

                <Button className="w-full h-12 text-sm font-mono uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2 rounded-none transition-all shadow-lg hover:shadow-primary/20 mt-2">
                    Authenticate
                </Button>
            </form>

            <div className="mt-8 pt-8 border-t border-border text-center">
                <p className="text-xs text-muted-foreground mb-4 font-mono">
                    // OR AUTHENTICATE VIA EXTERNAL LINK
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-10 text-xs font-mono uppercase tracking-wider border-border hover:bg-secondary rounded-none">
                        Github
                    </Button>
                    <Button variant="outline" className="h-10 text-xs font-mono uppercase tracking-wider border-border hover:bg-secondary rounded-none">
                        Google
                    </Button>
                </div>
            </div>

            <div className="mt-8 text-center">
                <p className="text-xs text-muted-foreground">
                    New Operator?{" "}
                    <Link href="/register" className="text-primary hover:underline font-mono uppercase tracking-wider">
                        Request Clearance
                    </Link>
                </p>
            </div>
        </div>
        
        {/* Decorative Status Line */}
        <div className="mt-4 flex justify-between text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest px-1">
            <span>Secure Connection</span>
            <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                System Online
            </span>
        </div>
      </motion.div>
    </div>
  );
}
