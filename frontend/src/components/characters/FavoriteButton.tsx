"use client";

import { useState, useTransition } from "react";
import { addFavoriteCharacter, removeFavoriteCharacter } from "@/lib/actions/favoriteCharacters";
import { useRouter } from "next/navigation";

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
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAdd = () => {
    if (!canAdd || isFavorite) return;
    startTransition(async () => {
      try {
        await addFavoriteCharacter(characterId, characterName, characterImage);
        setIsFavorite(true);
        router.refresh();
      } catch (error) {
        console.error("Error adding favorite:", error);
        alert(error instanceof Error ? error.message : "Failed to add favorite");
      }
    });
  };

  const handleRemove = () => {
    if (!canRemove || !isFavorite) return;
    startTransition(async () => {
      try {
        await removeFavoriteCharacter(characterId);
        setIsFavorite(false);
        router.refresh();
      } catch (error) {
        console.error("Error removing favorite:", error);
        alert(error instanceof Error ? error.message : "Failed to remove favorite");
      }
    });
  };

  if (isFavorite && !canRemove) {
    return <span>★ Favorite</span>;
  }

  if (!isFavorite && !canAdd) {
    return <span>-</span>;
  }

  return (
    <button
      onClick={isFavorite ? handleRemove : handleAdd}
      disabled={isPending}
    >
      {isPending
        ? "..."
        : isFavorite
        ? "★ Remove Favorite"
        : "☆ Add Favorite"}
    </button>
  );
}

