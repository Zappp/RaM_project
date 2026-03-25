import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import type { PageInfo } from "@/lib/types/pagination";
import type { CharacterWithFavorite } from "@/shared/types/charactersTable";

export interface CharactersTableProps {
  items: CharacterWithFavorite[];
  pageInfo?: PageInfo;
  currentPage?: string;
  basePath?: Route;
  emptyState?: string;
}

export function CharactersTable({
  items,
  pageInfo,
  currentPage = "1",
  basePath,
  emptyState = "No data available",
  children,
}: PropsWithChildren<CharactersTableProps>) {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-border bg-background shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-150 table-fixed" aria-label="Characters table">
            <caption className="sr-only">
              Table displaying character information including image, name, status, species, and
              favorite actions
            </caption>

            <thead className="border-border border-b bg-surface">
              <tr>
                <th
                  scope="col"
                  className="w-30 px-4 py-3 text-left font-semibold text-sm text-text"
                >
                  Image
                </th>
                <th
                  scope="col"
                  className="w-50 px-4 py-3 text-left font-semibold text-sm text-text"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="w-40 px-4 py-3 text-left font-semibold text-sm text-text"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="w-40 px-4 py-3 text-left font-semibold text-sm text-text"
                >
                  Species
                </th>
                <th
                  scope="col"
                  className="w-30 px-4 py-3 text-left font-semibold text-sm text-text"
                >
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {items.length === 0 ? (
                <tr className="h-26">
                  <td colSpan={5} className="px-4 py-3 text-center align-middle text-text-muted">
                    {emptyState}
                  </td>
                </tr>
              ) : (
                children
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pageInfo && basePath && (
        <div className="flex items-center justify-between">
          {pageInfo.prev ? (
            <Link
              href={{ pathname: basePath, query: { page: pageInfo.prev } }}
              className="rounded-md border border-border px-4 py-2 font-medium text-sm text-text transition-colors hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={`Go to page ${pageInfo.prev}`}
            >
              Previous
            </Link>
          ) : (
            <div aria-hidden="true" />
          )}

          <span className="text-sm text-text-muted" aria-live="polite" aria-atomic="true">
            Page {currentPage} of {pageInfo.pages} ({pageInfo.count} total)
          </span>

          {pageInfo.next ? (
            <Link
              href={{ pathname: basePath, query: { page: pageInfo.next } }}
              className="rounded-md border border-border px-4 py-2 font-medium text-sm text-text transition-colors hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={`Go to page ${pageInfo.next}`}
            >
              Next
            </Link>
          ) : (
            <div aria-hidden="true" />
          )}
        </div>
      )}
    </div>
  );
}

interface CharacterRowProps {
  item: CharacterWithFavorite;
}

export function CharacterRow({ item, children }: PropsWithChildren<CharacterRowProps>) {
  const { remoteId, image, name, species, status } = item;

  return (
    <tr key={remoteId} className="h-24 transition-colors hover:bg-surface">
      <td className="w-30 px-4 py-3 align-middle">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-md bg-muted">
          {image ? (
            <Image
              src={image}
              alt={`${name || "Character"} profile picture`}
              width={80}
              height={80}
              className="h-full w-full rounded-md object-cover"
            />
          ) : (
            <span className="sr-only">No image available</span>
          )}
        </div>
      </td>

      <td className="w-50 px-4 py-3 align-middle">
        <span className="block font-medium text-text leading-none">{name || "Unknown"}</span>
      </td>

      <td className="w-40 px-4 py-3 align-middle">
        <span className="block text-text-muted leading-none">{species || "Unknown"}</span>
      </td>

      <td className="w-40 px-4 py-3 align-middle">
        <span className="block text-text-muted leading-none">{status || "Unknown"}</span>
      </td>

      <td className="w-30 px-4 py-3 align-middle">
        <div className="flex items-center">{children}</div>
      </td>
    </tr>
  );
}
