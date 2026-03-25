import { getFavoriteCharactersAction } from "@/features/favoriteCharacters/actions";
import { CharactersTable } from "@/shared/components/charactersTable/CharactersTable";
import { FavoriteCharactersOptimisticList } from "./FavoriteCharactersOptimisticList";

export async function FavoriteCharactersList({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = params.page;

  const { data, success } = await getFavoriteCharactersAction(page);
  if (!success) {
    return <CharactersTable items={[]} emptyState="Failed to fetch favorite characters" />;
  }
  const { results: favoriteCharacters, info } = data;
  
  const charactersWithFavorites = favoriteCharacters.map((item) => ({ ...item, isFavorite: true }));

  return (
    <FavoriteCharactersOptimisticList
      items={charactersWithFavorites}
      pageInfo={info}
      currentPage={page}
      basePath="/favorites"
    />
  );
}
