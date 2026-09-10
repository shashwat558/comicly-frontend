"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { ApiError } from "@/lib/api-client";
import { useAuth } from "@/lib/auth";
import LoginSVGComponent from "@/components/ui/LoginSVGComponent";

type Mode = "login" | "signup";

export default function LoginPage() {
  const { login, signup } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      if (mode === "login") await login(email.trim(), password);
      else await signup(email.trim(), password);
      router.push("/reader");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

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
        <div className="border border-border bg-card/50 backdrop-blur-xs p-8 md:p-12 relative overflow-hidden group">


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

            <div className="grid grid-cols-2 gap-0 mb-8 border border-border">
                {(["login", "signup"] as Mode[]).map((m) => (
                    <button
                        key={m}
                        type="button"
                        onClick={() => { setMode(m); setError(null); }}
                        className={`h-10 text-xs font-mono uppercase tracking-widest transition-colors ${
                            mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        {m === "login" ? "Authenticate" : "New Operator"}
                    </button>
                ))}
            </div>

            <form className="space-y-6" onSubmit={submit}>
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                        User Handle / Email
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="OPERATOR@COMICLY.SYS"
                        className="bg-background/50 border-border font-mono text-sm placeholder:text-muted-foreground/30 focus-visible:ring-primary/20 h-12 rounded-none"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password" className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                        Passcode {mode === "signup" && <span className="opacity-60">(min 8 chars)</span>}
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        required
                        minLength={mode === "signup" ? 8 : 1}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="bg-background/50 border-border font-mono text-sm placeholder:text-muted-foreground/30 focus-visible:ring-primary/20 h-12 rounded-none"
                    />
                </div>

                {error && <p className="font-mono text-xs text-red-500">{error}</p>}

                <Button disabled={busy} className="w-full h-12 text-sm font-mono uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2 rounded-none transition-all shadow-lg hover:shadow-primary/20 mt-2">
                    {busy ? "Working…" : mode === "login" ? "Authenticate" : "Request Clearance"}
                </Button>
            </form>
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
