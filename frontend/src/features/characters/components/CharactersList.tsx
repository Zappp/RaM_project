import { CharacterTable } from "@/shared/components/character/CharacterTable";
import type { CharactersQuery } from "@/lib/types/generated";

type Character = CharactersQuery["characters"]["results"][0] & { isFavorite?: boolean };
type PageInfo = CharactersQuery["characters"]["info"];

interface CharactersListProps {
  characters: Character[];
  pageInfo: PageInfo;
  currentPage: number;
  canAdd?: boolean;
  canRemove?: boolean;
}

export function CharactersList({
  characters,
  pageInfo,
  currentPage,
  canAdd = true,
  canRemove = true,
}: CharactersListProps) {
  return (
    <CharacterTable
      items={characters}
      showFavoriteAction={true}
      canAdd={canAdd}
      canRemove={canRemove}
      pageInfo={pageInfo}
      currentPage={currentPage}
      basePath="/dashboard"
    />
  );
}

