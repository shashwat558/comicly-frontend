"use client";

import type { ReactNode } from "react";
import { RequireAuth } from "@/lib/auth";

export default function ReaderLayout({ children }: { children: ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}
