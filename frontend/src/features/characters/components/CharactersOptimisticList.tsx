"use client";

import { AddFavoriteButton } from "@/features/characters/components/AddFavoriteButton";
import { CharactersOptimisticTable } from "@/shared/components/charactersTable/CharactersOptimisticTable";
import type { CharactersTableProps } from "@/shared/components/charactersTable/CharactersTable";

export function CharactersOptimisticList({
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
      renderActionComponent={(item, optimisticAction) => (
        <AddFavoriteButton item={item} optimisticAction={optimisticAction} />
      )}
    />
  );
}
