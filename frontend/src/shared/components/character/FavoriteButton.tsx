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
    return (
      <span className="text-yellow-500 text-sm" aria-label={`${characterName} is a favorite`}>
        ★ Favorite
      </span>
    );
  }

  if (!isFavorite && !canAdd) {
    return <span className="text-text-muted text-sm" aria-hidden="true">-</span>;
  }

  return (
    <div>
      {isFavorite ? (
        <form action={removeAction} onSubmit={handleSubmit}>
          <input type="hidden" name="characterId" value={characterId} />
          <button
            type="submit"
            disabled={isPending}
            aria-label={`Remove ${characterName} from favorites`}
            aria-busy={isPending}
            className="px-3 py-1 text-sm text-yellow-600 border border-yellow-300 rounded-md hover:bg-yellow-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {isPending ? (
              <span aria-hidden="true">...</span>
            ) : (
              <>
                <span aria-hidden="true">★</span> Remove
              </>
            )}
          </button>
        </form>
      ) : (
        <form action={addAction} onSubmit={handleSubmit}>
          <input type="hidden" name="characterId" value={characterId} />
          <input type="hidden" name="characterName" value={characterName} />
          <input type="hidden" name="characterImage" value={characterImage || ""} />
          <button
            type="submit"
            disabled={isPending}
            aria-label={`Add ${characterName} to favorites`}
            aria-busy={isPending}
            className="px-3 py-1 text-sm text-text border border-border rounded-md hover:bg-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {isPending ? (
              <span aria-hidden="true">...</span>
            ) : (
              <>
                <span aria-hidden="true">☆</span> Add
              </>
            )}
          </button>
        </form>
      )}
      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="text-red-600 text-xs mt-1"
        >
          {error}
        </div>
      )}
    </div>
  );
}
