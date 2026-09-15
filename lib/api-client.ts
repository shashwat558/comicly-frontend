import type {
  AuthUser,
  BookDetail,
  BookListItem,
  CharacterOut,
  FrameOut,
  GenerateResponse,
  JobEvent,
  PageOut,
  TokenResponse,
} from "./comicly-types";

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const TOKEN_KEY = "comicly_token";

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // private mode etc, nothing to clear
  }
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const token = typeof window === "undefined" ? null : getToken();
  const headers = new Headers(init?.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, { ...init, headers });
  } catch {
    throw new ApiError(0, "Backend unreachable. Is the API running?");
  }
  if (res.status === 401 && token && typeof window !== "undefined") {
    // session expired mid-use -> drop it and send them to login
    clearToken();
    if (!window.location.pathname.startsWith("/login")) window.location.href = "/login";
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

export async function getSourceUrl(bookId: string): Promise<string> {
  const token = typeof window === "undefined" ? null : getToken();
  const headers = new Headers();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  let res: Response;
  try {
    res = await fetch(`${BASE}/api/v1/books/${bookId}/source`, { headers });
  } catch {
    throw new ApiError(0, "Backend unreachable. Is the API running?");
  }
  if (res.status === 404) throw new ApiError(404, "No source file stored for this book.");
  if (!res.ok) throw new ApiError(res.status, res.statusText);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
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
  opts?: { force?: boolean; quality?: "draft" | "pro" | "auto"; panels?: number },
): Promise<GenerateResponse> {
  return req<GenerateResponse>(`/api/v1/books/${bookId}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      page_no: pageNo,
      force: opts?.force ?? false,
      quality: opts?.quality ?? "auto",
      panels: opts?.panels ?? 1,
    }),
  });
}

export function enhanceFrame(bookId: string, pageNo: number): Promise<GenerateResponse> {
  return req<GenerateResponse>(`/api/v1/books/${bookId}/frames/${pageNo}/enhance`, {
    method: "POST",
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
  // EventSource can't set headers, backend accepts ?token= on this route
  const token = typeof window === "undefined" ? "" : getToken() ?? "";
  const es = new EventSource(`${BASE}/api/v1/jobs/${jobId}/stream?token=${encodeURIComponent(token)}`);
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

export function signup(email: string, password: string): Promise<AuthUser> {
  return req<AuthUser>("/api/v1/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export function login(email: string, password: string): Promise<TokenResponse> {
  return req<TokenResponse>("/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export function me(): Promise<AuthUser> {
  return req<AuthUser>("/api/v1/auth/me");
}
