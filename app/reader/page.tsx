"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    PlusIcon,
    ClockIcon,
    BookOpenIcon,
    SignalIcon,
    TrashIcon
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { ApiError, deleteBook, listBooks, uploadBook } from "@/lib/api-client";
import type { BookListItem } from "@/lib/comicly-types";

const MAX_MB = 50;

export default function DashboardPage() {
    const router = useRouter();
    const [books, setBooks] = useState<BookListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const refresh = useCallback(async () => {
        setLoading(true);
        setLoadError(null);
        try {
            setBooks(await listBooks());
        } catch (e) {
            setLoadError(e instanceof Error ? e.message : "Failed to load books.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const handleUploaded = (id: string) => {
        setDialogOpen(false);
        router.push(`/reader/${id}`);
    };

    const handleDelete = async (id: string, title: string) => {
        if (!window.confirm(`Delete "${title}" and all its frames?`)) return;
        try {
            await deleteBook(id);
            setBooks((prev) => prev.filter((b) => b.id !== id));
        } catch (e) {
            alert(e instanceof Error ? e.message : "Delete failed.");
        }
    };

    const totalPages = books.reduce((n, b) => n + b.total_pages, 0);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans relative">
            <div className="absolute inset-0 bg-dots-pattern opacity-10 pointer-events-none" />

            <header className="sticky top-0 z-50 w-full px-6 py-4 flex justify-between items-center border-b border-border/40 backdrop-blur-md bg-background/80">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-foreground text-background flex items-center justify-center font-bold tracking-tighter group-hover:bg-primary transition-colors">
                        D
                    </div>
                    <span className="font-mono text-sm tracking-widest font-bold">DASHBOARD // V2.0</span>
                </Link>
                <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                    <span className="flex items-center gap-2">
                        <SignalIcon className={`w-4 h-4 ${loadError ? "text-red-500" : "text-emerald-500"}`} />
                        {loadError ? "SYSTEM: OFFLINE" : "SYSTEM: ONLINE"}
                    </span>
                    <div className="h-4 w-px bg-border" />
                    <span>USER: SHASHWAT</span>
                </div>
            </header>

            <main className="container mx-auto px-6 py-12 max-w-6xl">

                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl font-bold uppercase tracking-tight mb-2">Library</h1>
                        <p className="text-muted-foreground font-mono text-sm">Upload a book, open it, illustrate as you read.</p>
                    </div>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-12 px-6 font-mono uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
                                <PlusIcon className="w-4 h-4" />
                                Upload Book
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-none">
                            <UploadForm onDone={handleUploaded} />
                        </DialogContent>
                    </Dialog>
                </div>

                {loading && (
                    <p className="font-mono text-sm text-muted-foreground animate-pulse">Loading library…</p>
                )}

                {!loading && loadError && (
                    <div className="border border-red-500/30 bg-red-500/5 p-6 flex flex-col gap-4">
                        <p className="font-mono text-sm text-red-500">{loadError}</p>
                        <Button variant="outline" className="w-fit rounded-none font-mono text-xs uppercase" onClick={refresh}>
                            Retry
                        </Button>
                    </div>
                )}

                {!loading && !loadError && books.length === 0 && (
                    <button
                        onClick={() => setDialogOpen(true)}
                        className="group w-full h-48 border border-dashed border-border hover:border-primary/50 bg-secondary/5 flex flex-col items-center justify-center gap-4 transition-all hover:bg-secondary/10"
                    >
                        <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center bg-background group-hover:scale-110 transition-transform">
                            <PlusIcon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground group-hover:text-primary">Upload your first book</span>
                    </button>
                )}

                {!loading && !loadError && books.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {books.map((book) => (
                            <BookCard key={book.id} book={book} onDelete={handleDelete} />
                        ))}
                    </div>
                )}

                <div className="mt-24 pt-8 border-t border-border grid grid-cols-2 md:grid-cols-3 gap-8">
                     <Stat label="Books" value={String(books.length)} />
                     <Stat label="Segments" value={String(totalPages)} />
                     <Stat label="Backend" value={loadError ? "Offline" : "Online"} />
                </div>
            </main>
        </div>
    );
}

function UploadForm({ onDone }: { onDone: (id: string) => void }) {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = async () => {
        if (!file || busy) return;
        if (file.size > MAX_MB * 1024 * 1024) {
            setError(`File exceeds the ${MAX_MB}MB limit.`);
            return;
        }
        setBusy(true);
        setError(null);
        try {
            const book = await uploadBook(file, title || file.name.replace(/\.[^.]+$/, ""), author);
            onDone(book.id);
        } catch (e) {
            setError(e instanceof ApiError ? e.message : "Upload failed.");
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <DialogHeader>
                <DialogTitle className="uppercase tracking-tight">Upload Book</DialogTitle>
                <DialogDescription className="font-mono text-xs">PDF, EPUB or TXT. Text is chunked into segments on the server.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="book-file">File</Label>
                    <Input
                        id="book-file"
                        type="file"
                        accept=".pdf,.epub,.txt"
                        className="rounded-none"
                        onChange={(e) => {
                            const f = e.target.files?.[0] ?? null;
                            setFile(f);
                            if (f && !title) setTitle(f.name.replace(/\.[^.]+$/, ""));
                        }}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="book-title">Title</Label>
                    <Input id="book-title" className="rounded-none" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Neuromancer" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="book-author">Author</Label>
                    <Input id="book-author" className="rounded-none" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="William Gibson" />
                </div>
                {error && <p className="font-mono text-xs text-red-500">{error}</p>}
            </div>
            <DialogFooter>
                <Button disabled={!file || busy} onClick={submit} className="rounded-none font-mono text-xs uppercase tracking-widest">
                    {busy ? "Uploading…" : "Upload & Open"}
                </Button>
            </DialogFooter>
        </>
    );
}

function BookCard({ book, onDelete }: { book: BookListItem; onDelete: (id: string, title: string) => void }) {
    return (
        <div className="group relative h-48 bg-background border border-border hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.02)] transition-all">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />

            <Link href={`/reader/${book.id}`} className="p-6 flex flex-col justify-between h-full">
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">ID: {book.id.slice(0, 8)}</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    </div>
                    <h3 className="font-bold text-lg uppercase tracking-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {book.title}
                    </h3>
                    <p className="text-xs font-mono text-muted-foreground mt-1">by {book.author}</p>
                </div>

                <div>
                    <div className="flex justify-between text-xs font-mono text-muted-foreground mb-2">
                        <span className="flex items-center gap-1"><ClockIcon className="w-3 h-3" /> {new Date(book.created_at).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><BookOpenIcon className="w-3 h-3" /> {book.total_pages} segments</span>
                    </div>
                </div>
            </Link>

            <button
                onClick={() => onDelete(book.id, book.title)}
                title="Delete book"
                className="absolute bottom-4 right-4 p-2 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <TrashIcon className="w-4 h-4" />
            </button>
        </div>
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
