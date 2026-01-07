export interface PageInfo {
  count: number;
  pages: number;
  next: number | null;
  prev: number | null;
}

export interface PaginatedResult<T> {
  results: T[];
  info: PageInfo;
}

export interface PaginationProps {
  page?: number;
  pageSize?: number;
}

