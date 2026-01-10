"use server";

import { revalidatePath } from "next/cache";
import { serverGraphqlRequest } from "@/lib/graphql/graphqlRequest";
import { handleAuthError } from "@/features/auth/actions/authErrorHandler";
import {
  FavoriteCharactersDocument,
  FavoriteCharactersByIdsDocument,
  AddFavoriteCharacterDocument,
  RemoveFavoriteCharacterDocument,
} from "@/lib/types/generated";
import type {
  FavoriteCharactersQuery,
  FavoriteCharactersByIdsQuery,
  AddFavoriteCharacterMutation,
  RemoveFavoriteCharacterMutation,
} from "@/lib/types/generated";
import type { ActionResult } from "@/lib/types/actions";

export async function getFavoriteCharacters(page?: number, pageSize?: number) {
  try {
    const data = await serverGraphqlRequest<FavoriteCharactersQuery>(
      FavoriteCharactersDocument,
      { page, pageSize }
    );
    return data.favoriteCharacters;
  } catch (error) {
    const isAuthError = await handleAuthError(error, false);
    if (isAuthError) {
      return { error: "Authentication required" };
    }
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch favorite characters";
    console.error("Error fetching favorite characters:", error);
    return { error: errorMessage };
  }
}

export async function getFavoriteCharactersByIds(characterIds: number[]) {
  // TODO pagination (?)
  try {
    const data = await serverGraphqlRequest<FavoriteCharactersByIdsQuery>(
      FavoriteCharactersByIdsDocument,
      { characterIds }
    );
    return data.favoriteCharactersByIds;
  } catch (error) {
    const isAuthError = await handleAuthError(error, false);
    if (isAuthError) {
      return { error: "Authentication required" };
    }
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch favorite characters";
    console.error("Error fetching favorite characters by IDs:", error);
    return { error: errorMessage };
  }
}

export async function addFavoriteCharacterAction(
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult> {
  const characterId = parseInt(formData.get("characterId") as string, 10);
  const characterName = formData.get("characterName") as string;
  const characterImage = formData.get("characterImage") as string | null;

  if (!characterId || !characterName) {
    return { error: "Character ID and name are required" };
  }

  try {
    await serverGraphqlRequest<AddFavoriteCharacterMutation>(
      AddFavoriteCharacterDocument,
      {
        characterId,
        characterName,
        characterImage: characterImage || null,
      }
    );
    revalidatePath("/dashboard");
    revalidatePath("/favorites");
    return { success: true as const };
  } catch (error) {
    const isAuthError = await handleAuthError(error, true);
    if (isAuthError) {
      return { error: "Authentication required" };
    }

    const errorMessage = error instanceof Error ? error.message : "";
    return {
      error: errorMessage || "Failed to add favorite",
    };
  }
}

export async function removeFavoriteCharacterAction(
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult> {
  const characterId = parseInt(formData.get("characterId") as string, 10);

  if (!characterId) {
    return { error: "Character ID is required" };
  }

  try {
    await serverGraphqlRequest<RemoveFavoriteCharacterMutation>(
      RemoveFavoriteCharacterDocument,
      { characterId }
    );
    revalidatePath("/dashboard");
    revalidatePath("/favorites");
    return { success: true as const };
  } catch (error) {
    const isAuthError = await handleAuthError(error, true);
    if (isAuthError) {
      return { error: "Authentication required" };
    }

    const errorMessage = error instanceof Error ? error.message : "";
    return {
      error: errorMessage || "Failed to remove favorite",
    };
  }
}
