"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ReaderTextPane } from "@/components/reader/ReaderTextPane";
import { ReaderVisualPane } from "@/components/reader/ReaderVisualPane";
import { getBook, getFrame, listPages } from "@/lib/api-client";
import { ApiError } from "@/lib/api-client";
import type { BookDetail } from "@/lib/comicly-types";
import { useGeneration } from "@/lib/use-generation";

const PAGE_SIZE = 100;

export const STAGE_LABELS: Record<string, string> = {
  queued: "Queued…",
  reading: "Reading page…",
  directing: "Directing scene…",
  rendering: "Rendering frame…",
  saving: "Saving…",
  done: "Done",
  error: "Failed",
  idle: "Idle",
};

export default function ReaderPage() {
  const params = useParams();
  const bookId = params.id as string;

  const [book, setBook] = useState<BookDetail | null>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [frames, setFrames] = useState<Record<number, string>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const gen = useGeneration();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const detail = await getBook(bookId);
        if (cancelled) return;
        setBook(detail);
        const all: string[] = [];
        const total = detail.total_pages;
        for (let p = 1; p <= Math.ceil(total / PAGE_SIZE); p++) {
          const chunk = await listPages(bookId, p, PAGE_SIZE);
          if (cancelled) return;
          all.push(...chunk.map((c) => c.text));
        }
        if (!cancelled) setPages(all);
      } catch (e) {
        if (!cancelled) {
          setLoadError(
            e instanceof ApiError && e.status === 404
              ? "Book not found. It may have been deleted."
              : e instanceof Error ? e.message : "Failed to load book.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [bookId]);

  const loadCachedFrame = useCallback(
    async (pageNo: number) => {
      if (frames[pageNo]) return;
      try {
        const f = await getFrame(bookId, pageNo);
        if (f.image_url) setFrames((prev) => ({ ...prev, [pageNo]: f.image_url as string }));
      } catch {
        // 404 = not generated yet, anything else we also ignore here
      }
    },
    [bookId, frames],
  );

  useEffect(() => {
    if (pages.length > 0) loadCachedFrame(currentPage + 1);
  }, [currentPage, pages.length, loadCachedFrame]);

  useEffect(() => {
    if (gen.imageUrl) {
      const pageNo = currentPage + 1;
      setFrames((prev) => (prev[pageNo] ? prev : { ...prev, [pageNo]: gen.imageUrl as string }));
    }
  }, [gen.imageUrl, currentPage]);

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage((c) => c + 1);
      gen.reset();
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((c) => c - 1);
      gen.reset();
    }
  };

  const handleVisualize = () => {
    gen.run(bookId, currentPage + 1);
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-background text-foreground flex items-center justify-center font-mono text-sm text-muted-foreground animate-pulse">
        Loading book…
      </div>
    );
  }

  if (loadError || pages.length === 0) {
    return (
      <div className="h-screen w-full bg-background text-foreground flex flex-col items-center justify-center gap-4">
        <p className="font-mono text-sm text-muted-foreground">{loadError ?? "This book has no readable text."}</p>
        <Link href="/reader" className="font-mono text-xs uppercase tracking-widest underline underline-offset-4">
          Back to library
        </Link>
      </div>
    );
  }

  const pageNo = currentPage + 1;
  const currentImage = gen.imageUrl ?? frames[pageNo] ?? null;
  const busy = gen.status !== "idle" && gen.status !== "done" && gen.status !== "error";

  return (
    <div className="h-screen w-full bg-background text-foreground flex overflow-hidden font-sans selection:bg-primary/20">

      <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none z-0" />

      <ReaderTextPane
        pages={pages}
        currentPage={currentPage}
        isProcessing={busy}
        currentImage={currentImage}
        genError={gen.status === "error" ? gen.error : null}
        bookTitle={book?.title}
        onPrev={handlePrev}
        onNext={handleNext}
        onVisualize={handleVisualize}
      />

      <ReaderVisualPane
        currentImage={currentImage}
        isProcessing={busy}
        progress={gen.progress}
        stageLabel={STAGE_LABELS[gen.status] ?? gen.status}
        currentPageText={pages[currentPage]}
      />

    </div>
  );
}
