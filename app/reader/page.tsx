"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
    PlusIcon, 
    ClockIcon, 
    BookOpenIcon, 
    ChevronRightIcon,
    CpuChipIcon,
    SignalIcon,
    TrashIcon
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

// Mock Data for "Reading Sessions"
const SESSIONS = [
    { id: "x92-alpha", title: "Neuromancer: Ch 1-3", date: "2026-02-14", status: "Rendered", percentage: 100 },
    { id: "b71-beta", title: "Dune: Arrakis Arrival", date: "2026-02-15", status: "Processing", percentage: 45 },
    { id: "c44-delta", title: "Snow Crash: The Metaverse", date: "2026-02-16", status: "Queued", percentage: 0 },
];

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans relative">
            <div className="absolute inset-0 bg-dots-pattern opacity-10 pointer-events-none" />
            
            {/* Minimal Header */}
            <header className="sticky top-0 z-50 w-full px-6 py-4 flex justify-between items-center border-b border-border/40 backdrop-blur-md bg-background/80">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-foreground text-background flex items-center justify-center font-bold tracking-tighter group-hover:bg-primary transition-colors">
                        D
                    </div>
                    <span className="font-mono text-sm tracking-widest font-bold">DASHBOARD // V2.0</span>
                </Link>
                <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                    <span className="flex items-center gap-2">
                        <SignalIcon className="w-4 h-4 text-emerald-500" />
                        SYSTEM: ONLINE
                    </span>
                    <div className="h-4 w-px bg-border" />
                    <span>USER: SHASHWAT</span>
                </div>
            </header>

            <main className="container mx-auto px-6 py-12 max-w-6xl">
                
                {/* Dashboard Controls */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl font-bold uppercase tracking-tight mb-2">Active Sessions</h1>
                        <p className="text-muted-foreground font-mono text-sm">Manage ongoing neural rendering tasks and archives.</p>
                    </div>
                    <Link href={`/reader/${crypto.randomUUID()}`}>
                        <Button className="h-12 px-6 font-mono uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
                            <PlusIcon className="w-4 h-4" />
                            Initialize New Reader
                        </Button>
                    </Link>
                </div>

                {/* Session Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* New Session Card (Alternative Entry) */}
                    <Link href={`/reader/${crypto.randomUUID()}`} className="group relative h-48 border border-dashed border-border hover:border-primary/50 bg-secondary/5 flex flex-col items-center justify-center gap-4 transition-all hover:bg-secondary/10">
                        <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center bg-background group-hover:scale-110 transition-transform">
                            <PlusIcon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground group-hover:text-primary">Create New Session</span>
                    </Link>

                    {SESSIONS.map((session) => (
                        <SessionCard key={session.id} session={session} />
                    ))}
                </div>

                {/* System Stats Footer */}
                <div className="mt-24 pt-8 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-8">
                     <Stat label="Total Renders" value="1,024" />
                     <Stat label="GPU Hours" value="48.2h" />
                     <Stat label="Storage Used" value="2.4GB" />
                     <Stat label="Avg Latency" value="142ms" />
                </div>
            </main>
        </div>
    );
}

function SessionCard({ session }: { session: any }) {
    return (
        <Link href={`/reader/${session.id}`}>
            <motion.div 
                whileHover={{ y: -4 }}
                className="group relative h-48 bg-background border border-border p-6 flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.02)] transition-all"
            >
                <div className="absolute top-0 left-0 w-1 h-full bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />
                
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">ID: {session.id}</span>
                        {session.status === "Rendered" ? (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        ) : (
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        )}
                    </div>
                    <h3 className="font-bold text-lg uppercase tracking-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {session.title}
                    </h3>
                </div>

                <div>
                    <div className="flex justify-between text-xs font-mono text-muted-foreground mb-2">
                        <span className="flex items-center gap-1"><ClockIcon className="w-3 h-3" /> {session.date}</span>
                        <span>{session.percentage}%</span>
                    </div>
                    <div className="w-full h-1 bg-secondary overflow-hidden">
                        <div 
                            className={`h-full bg-primary transition-all duration-1000 ${session.status === 'Processing' ? 'animate-progress-infinite' : ''}`}
                            style={{ width: `${session.percentage}%` }}
                        />
                    </div>
                </div>
            </motion.div>
        </Link>
    )
}

function Stat({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">{label}</span>
            <span className="text-2xl font-bold font-sans">{value}</span>
        </div>
    )
}
