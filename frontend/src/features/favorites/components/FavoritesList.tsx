import { CharacterTable } from "@/shared/components/character/CharacterTable";
import type { FavoriteCharactersQuery } from "@/lib/types/generated";

type Favorite = FavoriteCharactersQuery["favoriteCharacters"]["results"][0];
type PageInfo = FavoriteCharactersQuery["favoriteCharacters"]["info"];

interface FavoritesListProps {
  favorites: Favorite[];
  pageInfo: PageInfo;
  currentPage: number;
}

export function FavoritesList({ favorites, pageInfo, currentPage }: FavoritesListProps) {
  if (favorites.length === 0) {
    return (
      <div>
        <p>You haven't added any favorite characters yet.</p>
      </div>
    );
  }

  return (
    <CharacterTable
      items={favorites}
      showFavoriteAction={true}
      canAdd={false}
      canRemove={true}
      pageInfo={pageInfo}
      currentPage={currentPage}
      basePath="/favorites"
      showTotalCount={true}
    />
  );
}
