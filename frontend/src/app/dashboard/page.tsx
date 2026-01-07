import { getCharacters } from "@/lib/actions/characters";
import { getFavoriteCharacter } from "@/lib/actions/favoriteCharacters";
import { CharactersList } from "@/components/characters/CharactersList";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const charactersData = await getCharacters(page);

  if (!charactersData) {
    return (
      <div>
        <h1>Error loading characters</h1>
        <p>Failed to load characters. Please try again later.</p>
      </div>
    );
  }

  const favoriteChecks = await Promise.all(
    charactersData.results.map(async (character) => {
      const characterId = parseInt(character.id, 10);
      try {
        const favorite = await getFavoriteCharacter(characterId);
        return { characterId, isFavorite: !!favorite };
      } catch {
        return { characterId, isFavorite: false };
      }
    })
  );

  const favoriteMap = new Map(
    favoriteChecks.map((check) => [check.characterId, check.isFavorite])
  );

  const charactersWithFavorites = charactersData.results.map((character) => ({
    ...character,
    isFavorite: favoriteMap.get(parseInt(character.id, 10)) || false,
  }));

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <h2>Characters</h2>
        <CharactersList
          characters={charactersWithFavorites}
          pageInfo={charactersData.info}
          currentPage={page}
          canAdd={true}
          canRemove={false}
        />
      </div>
    </div>
  );
}


