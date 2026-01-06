export type { PageInfo, PaginatedResult } from "./types/pagination.ts";
import type { PageInfo } from "./types/pagination.ts";

export function createPageInfo(
  count: number,
  pages: number,
  next: string | null,
  prev: string | null
): PageInfo {
  return {
    count,
    pages,
    next: extractPageNumber(next),
    prev: extractPageNumber(prev),
  };
}

function extractPageNumber(url: string | null): number | null {
  if (!url) return null;
  const match = url.match(/page=(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

