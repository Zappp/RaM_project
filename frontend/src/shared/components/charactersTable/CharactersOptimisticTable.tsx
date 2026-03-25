"use client";

import { type ReactNode, useOptimistic } from "react";
import {
  CharacterRow,
  CharactersTable,
  type CharactersTableProps,
} from "@/shared/components/charactersTable/CharactersTable";
import {
  CHARACTER_ACTION_TYPE,
  type CharactersTableAction,
  type CharacterWithFavorite,
} from "@/shared/types/charactersTable";

function charactersReducer(state: CharacterWithFavorite[], action: CharactersTableAction) {
  const { type, payload } = action;
  switch (type) {
    case CHARACTER_ACTION_TYPE.REMOVE: {
      return state.filter((item) => item.id !== payload.id);
    }

    case CHARACTER_ACTION_TYPE.ADD: {
      return state.map((item) =>
        item.remoteId === payload.remoteId ? { ...item, isFavorite: true } : item,
      );
    }

    default: {
      return state;
    }
  }
}

interface CharactersOptimisticTableProps extends CharactersTableProps {
  renderActionComponent: (
    item: CharacterWithFavorite,
    optimisticAction: (action: CharactersTableAction) => void,
  ) => ReactNode;
}

export function CharactersOptimisticTable({
  items,
  pageInfo,
  currentPage,
  basePath,
  emptyState,
  renderActionComponent,
}: CharactersOptimisticTableProps) {
  const [optimisticItems, setOptimisticItems] = useOptimistic(items, charactersReducer);

  return (
    <CharactersTable
      items={optimisticItems}
      pageInfo={pageInfo}
      currentPage={currentPage}
      basePath={basePath}
      emptyState={emptyState}
    >
      {optimisticItems.map((item) => (
        <CharacterRow key={item.remoteId} item={item}>
          {renderActionComponent(item, setOptimisticItems)}
        </CharacterRow>
      ))}
    </CharactersTable>
  );
}
