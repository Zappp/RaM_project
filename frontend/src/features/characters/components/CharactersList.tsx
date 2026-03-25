import { Suspense } from "react";
import { getCharactersAction } from "@/features/characters/actions";
import { getFavoriteCharactersByRemoteIdAction } from "@/features/favoriteCharacters/actions";
import {
  CharacterRow,
  CharactersTable,
  type CharactersTableProps,
} from "@/shared/components/charactersTable/CharactersTable";
import { ActionButtonSkeleton } from "@/shared/components/charactersTable/CharactersTableSkeleton";
import { CharactersOptimisticList } from "./CharactersOptimisticList";

export async function CharactersList({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = params.page;

  const { data: charactersData, success: charactersSuccess } = await getCharactersAction(page);
  if (!charactersSuccess) {
    return <CharactersTable items={[]} emptyState="Failed to fetch characters" />;
  }
  const { results: characters, info } = charactersData;

  return (
    <Suspense
      fallback={
        <CharactersTable items={characters}>
          {characters.map((character) => (
            <CharacterRow key={character.remoteId} item={character}>
              <ActionButtonSkeleton />
            </CharacterRow>
          ))}
        </CharactersTable>
      }
    >
      <CharactersWithFavoriteList
        items={characters}
        currentPage={page}
        pageInfo={info}
        basePath="/dashboard"
      />
    </Suspense>
  );
}

async function CharactersWithFavoriteList({
  items: characters,
  currentPage,
  pageInfo,
  basePath,
}: CharactersTableProps) {
  const characterRemoteIds = characters.map(({ remoteId }) => remoteId);

  const { data: favoritesData, success: favoritesSuccess } =
    await getFavoriteCharactersByRemoteIdAction(characterRemoteIds);
  if (!favoritesSuccess) {
    return <CharactersTable items={[]} emptyState="Failed to fetch characters" />;
  }

  const favoriteCharacterRemoteIds = new Set(favoritesData.map(({ remoteId }) => remoteId));
  const charactersWithFavorites =
    characters.map((character) => ({
      ...character,
      isFavorite: favoriteCharacterRemoteIds.has(character.remoteId),
    })) ?? [];

  return (
    <CharactersOptimisticList
      items={charactersWithFavorites}
      currentPage={currentPage}
      pageInfo={pageInfo}
      basePath={basePath}
    />
  );
}
