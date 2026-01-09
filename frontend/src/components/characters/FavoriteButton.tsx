"use client";

import { useActionState, useState, useEffect } from "react";
import {
  addFavoriteCharacterAction,
  removeFavoriteCharacterAction,
} from "@/lib/actions/favoriteCharacters";
import type { ActionResult } from "@/lib/types/actions";

interface FavoriteButtonProps {
  characterId: number;
  characterName: string;
  characterImage: string | null;
  isFavorite?: boolean;
  canAdd?: boolean;
  canRemove?: boolean;
}

export function FavoriteButton({
  characterId,
  characterName,
  characterImage,
  isFavorite: initialIsFavorite = false,
  canAdd = true,
  canRemove = true,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [addState, addAction, isAddPending] = useActionState<
    ActionResult,
    FormData
  >(addFavoriteCharacterAction, null);
  const [removeState, removeAction, isRemovePending] = useActionState<
    ActionResult,
    FormData
  >(removeFavoriteCharacterAction, null);

  const isPending = isAddPending || isRemovePending;

  useEffect(() => {
    if (addState && "success" in addState) {
      setIsFavorite(true);
    } else if (addState && "error" in addState) {
      setIsFavorite(false);
    }
  }, [addState]);

  useEffect(() => {
    if (removeState && "success" in removeState) {
      setIsFavorite(false);
    } else if (removeState && "error" in removeState) {
      setIsFavorite(true);
    }
  }, [removeState]);

  const error =
    (addState && "error" in addState ? addState.error : undefined) ||
    (removeState && "error" in removeState ? removeState.error : undefined);

  if (isFavorite && !canRemove) {
    return <span>★ Favorite</span>;
  }

  if (!isFavorite && !canAdd) {
    return <span>-</span>;
  }

  return (
    <div>
      {isFavorite ? (
        <form action={removeAction}>
          <input type="hidden" name="characterId" value={characterId} />
          <button type="submit" disabled={isPending}>
            {isPending ? "..." : "★ Remove Favorite"}
          </button>
        </form>
      ) : (
        <form action={addAction}>
          <input type="hidden" name="characterId" value={characterId} />
          <input type="hidden" name="characterName" value={characterName} />
          <input
            type="hidden"
            name="characterImage"
            value={characterImage || ""}
          />
          <button type="submit" disabled={isPending}>
            {isPending ? "..." : "☆ Add Favorite"}
          </button>
        </form>
      )}
      {error && <div>{error}</div>}
    </div>
  );
}
