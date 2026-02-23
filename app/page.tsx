"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { 
    ArrowUpRightIcon,  
    BoltIcon, 
    CommandLineIcon, 
    SparklesIcon, 
    CpuChipIcon,
    SwatchIcon,
    ServerStackIcon,
    EyeIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import HeroSvgComponent from "@/components/ui/HeroSvgComponent";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { PipelineStep } from "@/components/landing/PipelineStep";
import { Badge } from "@/components/landing/Badge";
import { GalleryItem } from "@/components/landing/GalleryItem";
import { TextScrambleBlur } from "@/components/ui/text-scramble";
import ScrollExpandingCircle from "@/components/ui/ScrollExpandingCircle";

// --- Animation Variants ---

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3
        }
    }
};

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
        opacity: 1, 
        y: 0,
        transition: {
            type: "spring",
            damping: 20,
            stiffness: 100
        }
    }
};

const pulseGlow: Variants = {
    initial: { opacity: 0.5, scale: 1 },
    animate: { 
        opacity: [0.5, 0.8, 0.5], 
        scale: [1, 1.05, 1],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  
  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-x-hidden selection:bg-primary/20">
      
      {/* Parallax Background */}
      <motion.div 
        style={{ y: backgroundY }}
        className="fixed inset-0 bg-dots-pattern z-0 opacity-20 pointer-events-none" 
      />
      
      <div className="fixed inset-0 bg-gradient-to-br from-background via-transparent to-background z-0 pointer-events-none" />

      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 w-full px-6 py-4 flex justify-between items-center border-b border-border/40 backdrop-blur-md bg-background/80 supports-[backdrop-filter]:bg-background/50 transition-all duration-300">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <motion.div 
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center font-bold tracking-tighter shadow-sm shadow-primary/20"
            >
                C
            </motion.div>
            <span className="font-mono text-sm tracking-[0.2em] font-bold group-hover:text-primary transition-colors">COMICLY</span>
        </Link>
        <div className="hidden md:flex gap-8 text-xs font-mono tracking-widest text-muted-foreground uppercase">
             {["Library", "Experience", "Community"].map((item) => (
                <Link key={item} href={`#${item.toLowerCase()}`} className="hover:text-foreground transition-colors relative group">
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all group-hover:w-full"/>
                </Link>
             ))}
        </div>
        <div className="flex gap-4 items-center">
            <ModeToggle />
            <Link href="/login">
                <Button variant="ghost" className="hidden md:flex text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground">
                    Login
                </Button>
            </Link>
            <Link href="/reader/1">
                 <Button variant="outline" className="h-9 px-4 text-xs font-mono uppercase tracking-wider border-border bg-background/50 hover:bg-secondary/50 hover:text-primary hover:border-primary/30 transition-all duration-300">
                    Enter Dashboard
                 </Button>
            </Link>
        </div>
      </nav>

      

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center text-center">
        
        <motion.div
            initial={{ opacity: 0, filter: "blur(20px)" }}
            animate={{ opacity: 0.6, filter: "blur(0px)" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-1/8 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[-10] w-[800px] h-[800px] pointer-events-none"
        >
            <HeroSvgComponent props="w-full h-full text-foreground animate-spin-slow" />
        </motion.div>

        <section className="container mx-auto px-6 py-24 md:py-32 flex flex-col items-center relative perspective-[1000px]">
            
            {/* Ambient Glow */}
            <motion.div 
                variants={pulseGlow}
                initial="initial"
                animate="animate"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" 
            />

            <motion.div 
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="flex flex-col items-center"
            >
                {/* Status Badge */}
                <motion.div variants={fadeInUp} className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-[10px] font-mono uppercase tracking-widest">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Neural Rendering Engine v2.0 Live
                </motion.div>

                <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter mb-8 max-w-5xl mx-auto leading-[0.85] uppercase selection:bg-foreground selection:text-background relative z-10">
                    Visualize <br />
                    <TextScrambleBlur text="Narratives" className="text-muted-foreground font-light italic font-serif tracking-normal lowercase block mt-2" />
                </motion.h1>

                <motion.p variants={fadeInUp} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-light font-mono border-l-2 border-primary/20 pl-4 text-left md:text-center md:border-l-0 md:pl-0">
                    <span className="text-primary hidden md:inline">{"// "}</span>
                    Transform textual stories into cinematic 
                    visual experiences with zero latency.
                </motion.p>

                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto mb-24 relative z-10">
                    <Link href="/reader/1" className="w-full group">
                        <Button className="w-full h-12 text-sm font-mono uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2 rounded-none transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none hover:ring-2 hover:ring-primary/20">
                            Initialise Context
                            <ArrowUpRightIcon className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Button>
                    </Link>
                    <Button variant="outline" className="w-full h-12 text-sm font-mono uppercase tracking-widest border-border bg-background hover:bg-secondary/50 flex items-center justify-center gap-2 rounded-none transition-colors group">
                        View Specs
                        <CommandLineIcon className="w-4 h-4 group-hover:text-primary transition-colors" />
                    </Button>
                </motion.div>
            </motion.div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl relative z-10">
                <FeatureCard 
                    icon={BoltIcon}
                    title="Instant Visualization"
                    desc="Watch your stories come to life instantly as you read. No waiting—just pure immersion."
                    stat="Live"
                    statLabel="Generation"
                    delay={0.2}
                />
                <FeatureCard 
                    icon={SparklesIcon}
                    title="Seamless Narrative"
                    desc="Our system intelligently tracks plot points and character details to ensure every illustration fits the story perfectly."
                    stat="100%"
                    statLabel="Consistency"
                    delay={0.4}
                />
                <FeatureCard 
                    icon={CpuChipIcon}
                    title="Any Genre, Any Style"
                    desc="Experience your favorite books in any art style you choose, from Japanese Noir to Classic Oil Painting."
                    stat="Inf."
                    statLabel="Possibilities"
                    delay={0.6}
                />
            </div>
        </section>
        

        {/* Pipeline Architecture Section */}
        <section id="pipeline" className="w-full border-t border-border bg-zinc-50/50 dark:bg-zinc-900/20 py-24 relative overflow-hidden">
             
             {/* Background Decoration */}
             <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-start justify-between mb-16 gap-8">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-2 mb-4">
                            <motion.div 
                                initial={{ width: 0 }} 
                                whileInView={{ width: 32 }} 
                                transition={{ duration: 1 }}
                                className="h-px bg-primary" 
                            />
                            <span className="text-xs font-mono uppercase tracking-widest text-primary">How It Works</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 uppercase leading-none">
                            Bringing Words <span className="text-muted-foreground italic font-serif font-light lowercase">to Life</span>
                        </h2>
                        <p className="text-muted-foreground text-sm font-mono max-w-md leading-relaxed border-l border-border pl-4">
                            A seamless journey from plain text to a fully illustrated visual experience, tailored exactly to your imagination.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end max-w-xs">
                        {["Sci-Fi", "Fantasy", "Mystery", "Romance", "Classics"].map((tag, i) => (
                            <Badge key={tag} label={tag} delay={i * 0.1} />
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[2.5rem] left-[16%] right-[16%] h-px border-t border-dashed border-muted-foreground/30 z-0 overflow-hidden">
                        <motion.div 
                            initial={{ x: "-100%" }}
                            whileInView={{ x: "100%" }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-full h-full bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                        />
                    </div>

                    <PipelineStep 
                        step="01" 
                        title="Upload Book" 
                        icon={ServerStackIcon}
                        status="Import"
                        desc="Simply upload your favorite EPUB or PDF. We interpret the text to understand the mood and setting."
                        delay={0}
                    />
                    <PipelineStep 
                        step="02" 
                        title="Choose Style" 
                        icon={EyeIcon}
                        status="Customize"
                        desc="Select how you want to see the story. Minimalist, vibrant, dark, or whimsical—you decide."
                        delay={0.2}
                    />
                    <PipelineStep 
                        step="03" 
                        title="Start Reading" 
                        icon={SwatchIcon}
                        status="Enjoy"
                        desc="Illustrations appear as you scroll, deepening your immersion and bringing characters to life."
                        delay={0.4}
                    />
                </div>
            </div>
        </section>

        {/* Gallery / Capabilities Section */}
        <section id="output" className="w-full py-24 border-t border-border">
            <div className="container mx-auto px-6 mb-12">
                 <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full" />
                        [Visual Styles]
                    </h2>
                    <div className="hidden md:flex items-center gap-2 text-xs font-mono text-muted-foreground">
                        <span>FILTER:</span>
                        <span className="text-foreground border-b border-primary">ALL</span>
                        <span className="hover:text-foreground cursor-pointer transition-colors">SCI-FI</span>
                        <span className="hover:text-foreground cursor-pointer transition-colors">NOIR</span>
                    </div>
                 </div>
                 
                 <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tight max-w-xl">
                        Reimagined <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground">Classics</span>
                    </h3>
                    <Button variant="ghost" className="group font-mono text-xs uppercase tracking-wider hover:bg-transparent hover:text-primary transition-colors pl-0 md:pl-4">
                        View Gallery 
                        <span className="inline-block transition-transform group-hover:translate-x-1 ml-2">-&gt;</span>
                    </Button>
                 </div>
            </div>
            
            <motion.div 
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="w-full flex flex-col md:flex-row overflow-hidden border-y border-border divide-y md:divide-y-0 md:divide-x divide-border bg-card/5"
            >
                 <GalleryItem 
                    label="CYBERPUNK CHRONICLES" 
                    sub="Immersive neon-lit cityscape"
                    color="bg-purple-500/5 hover:bg-purple-500/10" 
                    index={1}
                 />
                 <GalleryItem 
                    label="DRAGON'S KEEP" 
                    sub="Epic scale, magical atmosphere"
                    color="bg-amber-500/5 hover:bg-amber-500/10" 
                    index={2}
                 />
                 <GalleryItem 
                    label="MIDNIGHT MYSTERY" 
                    sub="Shadowy figures, rain-slicked streets"
                    color="bg-slate-500/5 hover:bg-slate-500/10" 
                    index={3}
                 />
                 <GalleryItem 
                    label="GARDEN OF TOMORROW" 
                    sub="Utopian vision, lush greenery"
                    color="bg-emerald-500/5 hover:bg-emerald-500/10" 
                    className="hidden lg:flex" 
                    index={4}
                 />
            </motion.div>
        </section>

        {/* Access / Pricing */}
        <section id="access" className="container mx-auto px-6 py-24 mb-24">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 max-w-6xl mx-auto items-center">
                 <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                 >
                     <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center mb-6 rounded-sm border border-primary/20">
                        <CheckCircleIcon className="w-6 h-6" />
                     </div>
                     <h2 className="text-4xl md:text-5xl font-bold uppercase mb-6 tracking-tight">Join the Community</h2>
                     <p className="text-muted-foreground text-lg leading-relaxed mb-8 font-light">
                         Be among the first to experience the future of reading. Sign up for our beta program and help shape the platform.
                     </p>
                     
                     <ul className="space-y-4 font-mono text-sm text-foreground/80 mb-10 border-l border-border pl-6">
                         <li className="flex items-center gap-3 group">
                             <div className="w-1.5 h-1.5 bg-border group-hover:bg-primary transition-colors rounded-full" />
                             <span>Early Access to New Features</span>
                         </li>
                         <li className="flex items-center gap-3 group">
                            <div className="w-1.5 h-1.5 bg-border group-hover:bg-primary transition-colors rounded-full" />
                             <span>Shape the Platform Roadmap</span>
                         </li>
                         <li className="flex items-center gap-3 group">
                             <div className="w-1.5 h-1.5 bg-border group-hover:bg-primary transition-colors rounded-full" />
                             <span>Exclusive Community Events</span>
                         </li>
                     </ul>

                     <div className="flex gap-4">
                        <Button className="h-12 px-8 text-sm font-mono uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90 rounded-none w-full md:w-auto shadow-lg hover:shadow-xl transition-all">
                            Sign Up Free
                        </Button>
                        <Button variant="outline" className="h-12 px-8 text-sm font-mono uppercase tracking-widest border-border hover:bg-secondary rounded-none w-full md:w-auto">
                            Learn More
                        </Button>
                     </div>
                 </motion.div>

                 <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="border border-border p-8 bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm relative overflow-hidden group hover:border-primary/30 transition-colors duration-500"
                 >
                     <div className="absolute top-0 right-0 p-2 bg-primary text-primary-foreground text-[10px] font-mono uppercase z-10">
                         Limited Time
                     </div>
                     <motion.div 
                        animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="absolute -right-20 -top-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:opacity-100 opacity-50" 
                    />
                     
                     <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest block mb-4">Beta Access</span>
                     <div className="text-6xl font-bold mb-2 tracking-tighter text-foreground">$0<span className="text-xl text-muted-foreground font-normal tracking-normal ml-2">/mo</span></div>
                     <p className="text-xs text-muted-foreground mb-8 font-mono bg-secondary/50 inline-block px-2 py-1 rounded">No Credit Card Required</p>
                     
                     <div className="space-y-4 border-t border-border pt-6">
                         {["Books: Unlimited", "Library: Cloud Sync", "Support: Priority", "Styles: All Access"].map((spec, i) => (
                             <div key={i} className="flex justify-between text-sm font-mono text-muted-foreground group-hover:text-foreground transition-colors">
                                 <span>{spec.split(":")[0]}</span>
                                 <span className="text-foreground font-bold">{spec.split(":")[1]}</span>
                             </div>
                         ))}
                     </div>
                 </motion.div>
             </div>
        </section>
        
      </main>
      

      {/* Decorative Bottom Bar */}
      <footer className="border-t border-border/40 py-12 relative z-10 bg-background text-[10px] font-mono uppercase tracking-widest">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col gap-2 items-center md:items-start">
                <span className="text-foreground font-bold text-lg tracking-tight flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary rounded-sm" />
                    COMICLY INC.
                </span>
                <span className="text-muted-foreground">© 2026 // Neural Narrative Systems</span>
            </div>
            
            <div className="flex gap-8 text-muted-foreground">
                <Link href="#" className="hover:text-primary transition-colors">Documentation</Link>
                <Link href="#" className="hover:text-primary transition-colors">GitHub</Link>
                <Link href="#" className="hover:text-primary transition-colors">Twitter</Link>
            </div>

            <div className="flex gap-6 text-muted-foreground bg-secondary/10 px-4 py-2 rounded-full border border-border">
                <span className="flex items-center gap-2">Status: <span className="text-emerald-500 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span> Operational</span>
                <span className="border-l border-border pl-4">Latency: <span className="text-foreground">12ms</span></span>
            </div>
        </div>
      </footer>
    </div>
  );
}
