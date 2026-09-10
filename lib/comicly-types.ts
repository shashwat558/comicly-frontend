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
}

export interface PageOut {
  page_no: number;
  text: string;
  tokens: number;
}

export interface FrameOut {
  page_no: number;
  image_url: string | null;
  status: string;
  seed: number | null;
  reader_out: Record<string, unknown> | null;
  director_out: Record<string, unknown> | null;
}

export interface CharacterOut {
  name: string;
  appearance: string;
  traits: string[];
  visual_anchors: string[];
  reference_image_url: string | null;
  first_page: number;
  last_seen_page: number;
}

export interface GenerateResponse {
  job_id: string;
  book_id: string;
  page_no: number;
  status: string;
}

export type JobStage =
  | "queued"
  | "reading"
  | "directing"
  | "rendering"
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
