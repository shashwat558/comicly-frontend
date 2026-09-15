export interface StyleLock {
  art_style: string;
  lighting: string;
  palette: string[];
  realism: string;
  seed_anchor: number;
  rendering_mode: string;
}

export interface BookListItem {
  id: string;
  title: string;
  author: string;
  total_pages: number;
  status: string;
  created_at: string;
}

export interface BookDetail extends BookListItem {
  style_lock: StyleLock | null;
  kind: string;
  has_source: boolean;
}

export interface PageOut {
  page_no: number;
  text: string;
  tokens: number;
  pdf_page: number | null;
}

export interface FrameOut {
  page_no: number;
  image_url: string | null;
  status: string;
  seed: number | null;
  reader_out: Record<string, unknown> | null;
  director_out: Record<string, unknown> | null;
  quality?: string;
  drift_score?: number | null;
  critic_out?: Record<string, unknown> | null;
  panel_layout?: Record<string, unknown> | null;
  retry_count?: number;
  flagged?: boolean;
}

export interface CharacterOut {
  name: string;
  appearance: string;
  traits: string[];
  visual_anchors: string[];
  reference_image_url: string | null;
  sheet_image_url?: string | null;
  sheet_version?: number;
  first_page: number;
  last_seen_page: number;
}

export interface GenerateResponse {
  job_id: string;
  book_id: string;
  page_no: number;
  status: string;
}

export interface AuthUser {
  id: string;
  email: string;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export type JobStage =
  | "queued"
  | "reading"
  | "directing"
  | "casting"
  | "drafting"
  | "critiquing"
  | "rendering"
  | "hero"
  | "saving"
  | "done"
  | "error";

export interface JobEvent {
  job_id: string;
  status: JobStage | string;
  progress: number;
  page_no?: number | null;
  image_url?: string | null;
  error?: string | null;
}
