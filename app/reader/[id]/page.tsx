"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { PdfPane } from "@/components/reader/PdfPane";
import { ReaderTextPane } from "@/components/reader/ReaderTextPane";
import { ReaderVisualPane } from "@/components/reader/ReaderVisualPane";
import { getBook, getFrame, getSourceUrl, listPages } from "@/lib/api-client";
import { ApiError } from "@/lib/api-client";
import type { BookDetail, PageOut } from "@/lib/comicly-types";
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
  const [pages, setPages] = useState<PageOut[]>([]);
  const [frames, setFrames] = useState<Record<number, string>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
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
        const all: PageOut[] = [];
        const total = detail.total_pages;
        for (let p = 1; p <= Math.ceil(total / PAGE_SIZE); p++) {
          const chunk = await listPages(bookId, p, PAGE_SIZE);
          if (cancelled) return;
          all.push(...chunk);
        }
        if (cancelled) return;
        setPages(all);
        if (detail.kind === "pdf" && detail.has_source) {
          try {
            const url = await getSourceUrl(bookId);
            if (!cancelled) setSourceUrl(url);
          } catch {
            // no source, falls back to text pane below
          }
        }
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

  useEffect(() => {
    return () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    };
  }, [sourceUrl]);

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
  const showPdf = book?.kind === "pdf" && !!sourceUrl;
  const pdfPage = pages[currentPage]?.pdf_page ?? pageNo;

  return (
    <div className="h-screen w-full bg-background text-foreground flex overflow-hidden font-sans selection:bg-primary/20">

      <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none z-0" />

      {showPdf ? (
        <PdfPane
          fileUrl={sourceUrl as string}
          pdfPage={pdfPage}
          currentSegment={pageNo}
          totalSegments={pages.length}
          isProcessing={busy}
          currentImage={currentImage}
          genError={gen.status === "error" ? gen.error : null}
          bookTitle={book?.title}
          onPrev={handlePrev}
          onNext={handleNext}
          onVisualize={handleVisualize}
        />
      ) : (
        <ReaderTextPane
          pages={pages.map((p) => p.text)}
          currentPage={currentPage}
          isProcessing={busy}
          currentImage={currentImage}
          genError={gen.status === "error" ? gen.error : null}
          bookTitle={book?.title}
          onPrev={handlePrev}
          onNext={handleNext}
          onVisualize={handleVisualize}
        />
      )}

      <ReaderVisualPane
        currentImage={currentImage}
        isProcessing={busy}
        progress={gen.progress}
        stageLabel={STAGE_LABELS[gen.status] ?? gen.status}
        currentPageText={pages[currentPage]?.text ?? ""}
      />

    </div>
  );
}
