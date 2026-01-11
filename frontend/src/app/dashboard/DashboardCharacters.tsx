import { getCharacters } from "@/features/characters/actions/characters";
import { getFavoriteCharactersByIds } from "@/features/favorites/actions/favoriteCharacters";
import { CharactersList } from "@/features/characters/components/CharactersList";
import type { CharactersQuery } from "@/lib/types/generated";

export async function DashboardCharacters({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const charactersData = await getCharacters(page);

  if (!charactersData) {
    return (
      <div role="alert">
        <h2 className="text-xl font-semibold text-text mb-2">Error loading characters</h2>
        <p className="text-text-muted">Failed to load characters. Please try again later.</p>
      </div>
    );
  }

  const characterIds = charactersData.results.map((character: { id: string }) =>
    parseInt(character.id, 10),
  );
  const favoritesResult = await getFavoriteCharactersByIds(characterIds);

  const favorites = favoritesResult && !("error" in favoritesResult) ? favoritesResult : [];
  const favoriteCharacterIds = new Set(
    favorites.map((favorite: { characterId: number }) => favorite.characterId),
  );

  type Character = CharactersQuery["characters"]["results"][0];
  const charactersWithFavorites = charactersData.results.map((character: Character) => ({
    ...character,
    isFavorite: favoriteCharacterIds.has(parseInt(character.id, 10)),
  }));

  return (
    <CharactersList
      characters={charactersWithFavorites}
      pageInfo={charactersData.info}
      currentPage={page}
      canAdd={true}
      canRemove={false}
    />
  );
}
