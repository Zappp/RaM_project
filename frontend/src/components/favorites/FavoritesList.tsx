import Link from "next/link";
import { CharactersTable } from "@/components/characters/CharactersTable";
import type { FavoriteCharactersQuery } from "@/lib/types/generated";

type Favorite = FavoriteCharactersQuery["favoriteCharacters"]["results"][0];
type PageInfo = FavoriteCharactersQuery["favoriteCharacters"]["info"];

interface FavoritesListProps {
  favorites: Favorite[];
  pageInfo: PageInfo;
  currentPage: number;
}

export function FavoritesList({
  favorites,
  pageInfo,
  currentPage,
}: FavoritesListProps) {
  if (favorites.length === 0) {
    return (
      <div>
        <p>You haven't added any favorite characters yet.</p>
      </div>
    );
  }

  return (
    <div>
      <CharactersTable
        items={favorites}
        showFavoriteAction={true}
        canAdd={false}
        canRemove={true}
      />
      <div>
        {pageInfo.prev && (
          <Link href={`/favorites?page=${pageInfo.prev}`}>Previous</Link>
        )}
        <span>
          Page {currentPage} of {pageInfo.pages} ({pageInfo.count} total)
        </span>
        {pageInfo.next && (
          <Link href={`/favorites?page=${pageInfo.next}`}>Next</Link>
        )}
      </div>
    </div>
  );
}

