"use client";

import { useActionState, useOptimistic, useEffect, useRef, startTransition } from "react";
import {
  addFavoriteCharacterAction,
  removeFavoriteCharacterAction,
} from "@/features/favorites/actions/favoriteCharacters";
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
  const isRequestInFlight = useRef(false);

  const [addState, addAction, isAddPending] = useActionState<ActionResult, FormData>(
    addFavoriteCharacterAction,
    null,
  );
  const [removeState, removeAction, isRemovePending] = useActionState<ActionResult, FormData>(
    removeFavoriteCharacterAction,
    null,
  );

  const [optimisticFavorite, setOptimisticFavorite] = useOptimistic(
    initialIsFavorite,
    (_currentState, optimisticValue: boolean) => optimisticValue,
  );

  const isPending = isAddPending || isRemovePending || isRequestInFlight.current;
  const isFavorite = optimisticFavorite;

  useEffect(() => {
    if (initialIsFavorite !== optimisticFavorite && !isPending) {
      startTransition(() => {
        setOptimisticFavorite(initialIsFavorite);
      });
    }
  }, [initialIsFavorite, optimisticFavorite, isPending, setOptimisticFavorite]);

  useEffect(() => {
    if (addState && "success" in addState) {
      isRequestInFlight.current = false;
    } else if (addState && "error" in addState) {
      isRequestInFlight.current = false;
      startTransition(() => {
        setOptimisticFavorite(initialIsFavorite);
      });
    }
  }, [addState, initialIsFavorite, setOptimisticFavorite]);

  useEffect(() => {
    if (removeState && "success" in removeState) {
      isRequestInFlight.current = false;
    } else if (removeState && "error" in removeState) {
      isRequestInFlight.current = false;
      startTransition(() => {
        setOptimisticFavorite(initialIsFavorite);
      });
    }
  }, [removeState, initialIsFavorite, setOptimisticFavorite]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (isRequestInFlight.current || isPending) {
      e.preventDefault();
      return;
    }
    isRequestInFlight.current = true;
    startTransition(() => {
      setOptimisticFavorite(!isFavorite);
    });
  };

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
        <form action={removeAction} onSubmit={handleSubmit}>
          <input type="hidden" name="characterId" value={characterId} />
          <button type="submit" disabled={isPending}>
            {isPending ? "..." : "★ Remove Favorite"}
          </button>
        </form>
      ) : (
        <form action={addAction} onSubmit={handleSubmit}>
          <input type="hidden" name="characterId" value={characterId} />
          <input type="hidden" name="characterName" value={characterName} />
          <input type="hidden" name="characterImage" value={characterImage || ""} />
          <button type="submit" disabled={isPending}>
            {isPending ? "..." : "☆ Add Favorite"}
          </button>
        </form>
      )}
      {error && <div>{error}</div>}
    </div>
  );
}
