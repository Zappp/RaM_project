"use client";

import { RemoveFavoriteButton } from "@/features/favoriteCharacters/components/RemoveFavoriteButton";
import { CharactersOptimisticTable } from "@/shared/components/charactersTable/CharactersOptimisticTable";
import type { CharactersTableProps } from "@/shared/components/charactersTable/CharactersTable";

export function FavoriteCharactersOptimisticList({
  items,
  pageInfo,
  basePath,
  currentPage,
}: CharactersTableProps) {
  return (
    <CharactersOptimisticTable
      items={items}
      pageInfo={pageInfo}
      currentPage={currentPage}
      basePath={basePath}
      renderActionComponent={({ id }, optimisticAction) => (
        <RemoveFavoriteButton id={id} optimisticAction={optimisticAction} />
      )}
    />
  );
}
