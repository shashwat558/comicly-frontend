"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { generatePage, getJob, subscribeJob } from "./api-client";
import type { JobStage } from "./comicly-types";

export type GenStatus = JobStage | "idle";
export const POLL_MS = 2000;
const POLL_TIMEOUT_MS = 5 * 60 * 1000;

interface GenState {
  status: GenStatus;
  progress: number;
  imageUrl: string | null;
  error: string | null;
  run: (bookId: string, pageNo: number) => Promise<void>;
  reset: () => void;
}

const initial = { status: "idle" as GenStatus, progress: 0, imageUrl: null, error: null };

export function useGeneration(): GenState {
  const [status, setStatus] = useState<GenStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const alive = useRef(true);
  const stoppers = useRef<(() => void)[]>([]);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      stoppers.current.forEach((stop) => stop());
      stoppers.current = [];
    };
  }, []);

  const apply = useCallback((ev: { status: string; progress: number; image_url?: string | null; error?: string | null }) => {
    if (!alive.current) return;
    setStatus(ev.status as GenStatus);
    setProgress(ev.progress ?? 0);
    if (ev.image_url) setImageUrl(ev.image_url);
    if (ev.error) setError(ev.error);
  }, []);

  const poll = useCallback(
    (jobId: string, cleanup: () => void) => {
      const started = Date.now();
      const timer = setInterval(async () => {
        if (!alive.current || Date.now() - started > POLL_TIMEOUT_MS) {
          clearInterval(timer);
          cleanup();
          if (alive.current && Date.now() - started > POLL_TIMEOUT_MS) {
            setError("Timed out waiting for the render.");
            setStatus("error");
          }
          return;
        }
        try {
          const ev = await getJob(jobId);
          apply(ev);
          if (ev.status === "done" || ev.status === "error") {
            clearInterval(timer);
            cleanup();
          }
        } catch {
          // transient, keep polling
        }
      }, POLL_MS);
      return () => clearInterval(timer);
    },
    [apply],
  );

  const run = useCallback(
    async (bookId: string, pageNo: number) => {
      setStatus("queued");
      setProgress(0);
      setImageUrl(null);
      setError(null);
      let jobId: string;
      try {
        const res = await generatePage(bookId, pageNo);
        jobId = res.job_id;
      } catch (e) {
        if (!alive.current) return;
        setError(e instanceof Error ? e.message : "Failed to start generation.");
        setStatus("error");
        return;
      }

      let stopPoll: (() => void) | null = null;
      const cleanup = () => stopPoll?.();
      const stopStream = subscribeJob(
        jobId,
        (ev) => {
          apply(ev);
          if (ev.status === "done" || ev.status === "error") {
            stopStream();
            cleanup();
          }
        },
        () => {
          // stream dropped -> fall back to polling
          stopPoll = poll(jobId, cleanup);
        },
      );
      stoppers.current.push(() => {
        stopStream();
        cleanup();
      });
    },
    [apply, poll],
  );

  const reset = useCallback(() => {
    setStatus(initial.status);
    setProgress(initial.progress);
    setImageUrl(initial.imageUrl);
    setError(initial.error);
  }, []);

  return { status, progress, imageUrl, error, run, reset };
}
