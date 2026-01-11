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
    <div>
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Status</th>
            <th>Species</th>
            {showFavoriteAction && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
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
      {pageInfo && currentPage !== undefined && basePath && (
        <div>
          {pageInfo.prev && <Link href={`${basePath}?page=${pageInfo.prev}`}>Previous</Link>}
          <span>
            Page {currentPage} of {pageInfo.pages}
            {showTotalCount && ` (${pageInfo.count} total)`}
          </span>
          {pageInfo.next && <Link href={`${basePath}?page=${pageInfo.next}`}>Next</Link>}
        </div>
      )}
    </div>
  );
}
