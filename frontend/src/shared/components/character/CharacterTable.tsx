import Link from "next/link";
import type { CharactersQuery } from "@/lib/types/generated";
import type { FavoriteCharactersQuery } from "@/lib/types/generated";
import { CharacterRow } from "./CharacterRow";

type Character = CharactersQuery["characters"]["results"][0] & { isFavorite?: boolean };
type Favorite = FavoriteCharactersQuery["favoriteCharacters"]["results"][0];

type TableItem = Character | Favorite;

type PageInfo =
  | CharactersQuery["characters"]["info"]
  | FavoriteCharactersQuery["favoriteCharacters"]["info"];

interface CharacterTableProps {
  items: TableItem[];
  showFavoriteAction?: boolean;
  canAdd?: boolean;
  canRemove?: boolean;
  pageInfo?: PageInfo;
  currentPage?: number;
  basePath?: string;
  showTotalCount?: boolean;
}

export function CharacterTable({
  items,
  showFavoriteAction = true,
  canAdd = true,
  canRemove = true,
  pageInfo,
  currentPage,
  basePath,
  showTotalCount = false,
}: CharacterTableProps) {
  return (
    <div className="space-y-4">
      <div className="bg-background border border-border rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]" role="table" aria-label="Characters table">
            <caption className="sr-only">
              Table displaying character information including image, name, status, species, and
              favorite actions
            </caption>
            <thead className="bg-surface border-b border-border">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-text">
                  Image
                </th>
                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-text">
                  Name
                </th>
                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-text">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-text">
                  Species
                </th>
                {showFavoriteAction && (
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-text">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item) => (
                <CharacterRow
                  key={item.id}
                  item={item}
                  showFavoriteAction={showFavoriteAction}
                  canAdd={canAdd}
                  canRemove={canRemove}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {pageInfo && currentPage !== undefined && basePath && (
        <div className="flex items-center justify-between">
          {pageInfo.prev ? (
            <Link
              href={`${basePath}?page=${pageInfo.prev}`}
              className="px-4 py-2 text-sm font-medium text-text border border-border rounded-md hover:bg-surface transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              aria-label={`Go to page ${pageInfo.prev}`}
            >
              Previous
            </Link>
          ) : (
            <div aria-hidden="true" />
          )}
          <span className="text-sm text-text-muted" aria-live="polite" aria-atomic="true">
            Page {currentPage} of {pageInfo.pages}
            {showTotalCount && ` (${pageInfo.count} total)`}
          </span>
          {pageInfo.next ? (
            <Link
              href={`${basePath}?page=${pageInfo.next}`}
              className="px-4 py-2 text-sm font-medium text-text border border-border rounded-md hover:bg-surface transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
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
