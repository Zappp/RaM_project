import Link from "next/link";
import { CharactersTable } from "./CharactersTable";
import type { CharactersQuery } from "@/lib/types/generated";

type Character = CharactersQuery["characters"]["results"][0];
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
    <div>
      <CharactersTable
        items={characters}
        showFavoriteAction={true}
        canAdd={canAdd}
        canRemove={canRemove}
      />
      <div>
        {pageInfo.prev && (
          <Link href={`/dashboard?page=${pageInfo.prev}`}>Previous</Link>
        )}
        <span>
          Page {currentPage} of {pageInfo.pages}
        </span>
        {pageInfo.next && (
          <Link href={`/dashboard?page=${pageInfo.next}`}>Next</Link>
        )}
      </div>
    </div>
  );
}

