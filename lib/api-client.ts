import type {
  BookDetail,
  BookListItem,
  CharacterOut,
  FrameOut,
  GenerateResponse,
  JobEvent,
  PageOut,
} from "./comicly-types";

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, init);
  } catch {
    throw new ApiError(0, "Backend unreachable. Is the API running?");
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    let message = res.statusText;
    try {
      const parsed = JSON.parse(body);
      message = parsed.detail ?? message;
    } catch {
      if (body) message = body.slice(0, 300);
    }
    throw new ApiError(res.status, message);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export function uploadBook(file: File, title: string, author: string): Promise<BookDetail> {
  const form = new FormData();
  form.append("file", file);
  form.append("title", title.trim() || file.name);
  form.append("author", author.trim() || "Unknown");
  return req<BookDetail>("/api/v1/books/upload", { method: "POST", body: form });
}

export function listBooks(): Promise<BookListItem[]> {
  return req<BookListItem[]>("/api/v1/books");
}

export function getBook(bookId: string): Promise<BookDetail> {
  return req<BookDetail>(`/api/v1/books/${bookId}`);
}

export function deleteBook(bookId: string): Promise<void> {
  return req<void>(`/api/v1/books/${bookId}`, { method: "DELETE" });
}

export function listPages(bookId: string, page = 1, size = 20): Promise<PageOut[]> {
  return req<PageOut[]>(`/api/v1/books/${bookId}/pages?page=${page}&size=${size}`);
}

export function getPageText(bookId: string, pageNo: number): Promise<PageOut> {
  return req<PageOut>(`/api/v1/books/${bookId}/pages/${pageNo}`);
}

export function getFrame(bookId: string, pageNo: number): Promise<FrameOut> {
  return req<FrameOut>(`/api/v1/books/${bookId}/frames/${pageNo}`);
}

export function listFrames(bookId: string): Promise<FrameOut[]> {
  return req<FrameOut[]>(`/api/v1/books/${bookId}/frames`);
}

export function listCharacters(bookId: string): Promise<CharacterOut[]> {
  return req<CharacterOut[]>(`/api/v1/books/${bookId}/characters`);
}

export function generatePage(
  bookId: string,
  pageNo: number,
  opts?: { force?: boolean },
): Promise<GenerateResponse> {
  return req<GenerateResponse>(`/api/v1/books/${bookId}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ page_no: pageNo, force: opts?.force ?? false }),
  });
}

export function getJob(jobId: string): Promise<JobEvent> {
  return req<JobEvent>(`/api/v1/jobs/${jobId}`);
}

export function subscribeJob(
  jobId: string,
  onEvent: (ev: JobEvent) => void,
  onStreamError: () => void,
): () => void {
  const es = new EventSource(`${BASE}/api/v1/jobs/${jobId}/stream`);
  const handler = (e: MessageEvent) => {
    try {
      onEvent(JSON.parse(e.data) as JobEvent);
    } catch {
      // ignore malformed heartbeats
    }
  };
  es.addEventListener("progress", handler as EventListener);
  es.onerror = () => {
    es.close();
    onStreamError();
  };
  return () => es.close();
}
