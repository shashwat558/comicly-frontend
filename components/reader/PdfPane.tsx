"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { ArrowLeftIcon, ArrowRightIcon, SparklesIcon } from "@heroicons/react/24/outline";
import {
  ArrowDownTrayIcon,
  ArrowUturnLeftIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

interface PdfPaneProps {
  fileUrl: string;
  pdfPage: number;
  currentSegment: number;
  totalSegments: number;
  isProcessing: boolean;
  currentImage: string | null;
  genError: string | null;
  bookTitle?: string;
  onPrev: () => void;
  onNext: () => void;
  onVisualize: () => void;
}

export function PdfPane({
  fileUrl,
  pdfPage,
  currentSegment,
  totalSegments,
  isProcessing,
  currentImage,
  genError,
  bookTitle,
  onPrev,
  onNext,
  onVisualize,
}: PdfPaneProps) {
  const showRetry = !!genError && !currentImage;
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(520);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState<0 | 90 | 180 | 270>(0);

  const zoomBy = (delta: number) =>
    setZoom((z) => Math.min(3, Math.max(0.5, Math.round((z + delta) * 100) / 100)));

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 520;
      setWidth(Math.max(280, Math.floor(w - 64)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="w-full lg:w-[40%] border-r border-border bg-background/50 backdrop-blur-sm flex flex-col relative z-10 flex-shrink-0">

      <header className="h-16 border-b border-border px-6 flex items-center justify-between bg-card/5 shrink-0">
        <Link href="/reader" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
          <div className="p-1.5 border border-border group-hover:border-primary/50 transition-colors">
            <ArrowLeftIcon className="w-3 h-3" />
          </div>
          <span className="text-xs font-mono uppercase tracking-widest hidden md:inline-block">Library</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            {bookTitle ?? "PDF"} // p.{pdfPage}{numPages ? `/${numPages}` : ""}
          </span>
        </div>
      </header>

      <div ref={wrapRef} className="flex-1 overflow-auto px-8 py-8 relative">
        <div className="max-w-xl mx-auto">
          <div className="mb-4 flex items-center justify-between text-xs font-mono text-muted-foreground uppercase tracking-widest opacity-50">
            <span>Segment 0{currentSegment} of {totalSegments}</span>
            <span>Page View</span>
          </div>

          <div className="mb-6 flex items-center gap-1.5 flex-wrap">
            <ToolButton title="Zoom out" onClick={() => zoomBy(-0.25)} disabled={zoom <= 0.5}>
              <MagnifyingGlassMinusIcon className="w-4 h-4" />
            </ToolButton>
            <button
              title="Reset to 100%"
              onClick={() => setZoom(1)}
              className="h-8 min-w-[3.5rem] px-2 border border-border bg-background font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              {Math.round(zoom * 100)}%
            </button>
            <ToolButton title="Zoom in" onClick={() => zoomBy(0.25)} disabled={zoom >= 3}>
              <MagnifyingGlassPlusIcon className="w-4 h-4" />
            </ToolButton>
            <button
              title="Fit to width"
              onClick={() => setZoom(1)}
              className="h-8 px-3 border border-border bg-background font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              Fit
            </button>
            <div className="w-px h-6 bg-border mx-1" />
            <ToolButton
              title="Rotate page"
              onClick={() => setRotation((r) => ((r + 90) % 360) as 0 | 90 | 180 | 270)}
            >
              <ArrowUturnLeftIcon className="w-4 h-4" />
            </ToolButton>
            <a
              title="Download original PDF"
              href={fileUrl}
              download={`${bookTitle ?? "book"}.pdf`}
              className="h-8 w-8 border border-border bg-background text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
            </a>
          </div>

          {failed ? (
            <div className="border border-red-500/30 bg-red-500/5 p-6">
              <p className="font-mono text-xs text-red-500 leading-relaxed">
                Couldn&apos;t render this PDF. Re-upload the book to restore page view, or keep reading in text mode.
              </p>
            </div>
          ) : (
            <div className="border border-border bg-white shadow-sm [&_canvas]:mx-auto [&_canvas]:h-auto">
              <Document
                file={fileUrl}
                onLoadSuccess={({ numPages: n }) => setNumPages(n)}
                onLoadError={() => setFailed(true)}
                loading={
                  <div className="h-96 flex items-center justify-center font-mono text-xs text-muted-foreground animate-pulse">
                    Loading page…
                  </div>
                }
              >
                <Page
                  pageNumber={pdfPage}
                  width={Math.floor(width * zoom)}
                  rotate={rotation}
                  renderAnnotationLayer={false}
                  loading={
                    <div className="h-96 flex items-center justify-center font-mono text-xs text-muted-foreground animate-pulse">
                      Loading page…
                    </div>
                  }
                />
              </Document>
            </div>
          )}

          <div className="h-24" />
        </div>
      </div>

      <div className="h-20 border-t border-border p-4 bg-card/10 backdrop-blur-md shrink-0 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onPrev}
            disabled={currentSegment <= 1 || isProcessing}
            className="h-10 w-10 border-border rounded-none hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </Button>
          <div className="h-10 px-4 border border-border bg-background flex items-center justify-center min-w-[3rem] font-mono text-xs">
            {currentSegment} / {totalSegments}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={onNext}
            disabled={currentSegment >= totalSegments || isProcessing}
            className="h-10 w-10 border-border rounded-none hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <ArrowRightIcon className="w-4 h-4" />
          </Button>
        </div>

        <Button
          onClick={onVisualize}
          disabled={isProcessing || (!!currentImage && !showRetry)}
          className={`h-10 px-8 font-mono text-xs uppercase tracking-widest rounded-none transition-all flex items-center gap-2 shadow-sm
              ${!!currentImage && !showRetry
                ? 'bg-secondary text-muted-foreground cursor-not-allowed border border-transparent'
                : showRetry
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/20 hover:scale-[1.02]'
              }
          `}
        >
          {isProcessing ? (
            <>
              <span className="w-2 h-2 bg-background rounded-full animate-bounce" />
              Processing
            </>
          ) : !!currentImage && !showRetry ? (
            <>
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              Rendered
            </>
          ) : showRetry ? (
            <>
              <SparklesIcon className="w-4 h-4" />
              Retry
            </>
          ) : (
            <>
              <SparklesIcon className="w-4 h-4" />
              Visualize Segment
            </>
          )}
        </Button>
      </div>
      {showRetry && (
        <p className="px-4 pb-2 font-mono text-[10px] text-red-500 leading-relaxed">{genError}</p>
      )}
    </div>
  );
}

function ToolButton({
  title,
  onClick,
  disabled,
  children,
}: {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className="h-8 w-8 border border-border bg-background text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors"
    >
      {children}
    </button>
  );
}
