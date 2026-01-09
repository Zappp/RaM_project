"use server";

import { revalidatePath } from "next/cache";
import { serverGraphqlRequest } from "../graphql/graphqlRequest";
import {
  FavoriteCharactersDocument,
  FavoriteCharacterDocument,
  AddFavoriteCharacterDocument,
  RemoveFavoriteCharacterDocument,
} from "../types/generated";
import type {
  FavoriteCharactersQuery,
  FavoriteCharacterQuery,
  AddFavoriteCharacterMutation,
  RemoveFavoriteCharacterMutation,
} from "../types/generated";
import type { ActionResult } from "../types/actions";

export async function getFavoriteCharacters(page?: number, pageSize?: number) {
  try {
    const data = await serverGraphqlRequest<FavoriteCharactersQuery>(
      FavoriteCharactersDocument,
      { page, pageSize }
    );
    return data.favoriteCharacters;
  } catch (error) {
    console.error("Error fetching favorite characters:", error);
    return null;
  }
}

export async function getFavoriteCharacter(characterId: number) {
  try {
    const data = await serverGraphqlRequest<FavoriteCharacterQuery>(
      FavoriteCharacterDocument,
      { characterId }
    );
    return data.favoriteCharacter;
  } catch (error) {
    console.error("Error fetching favorite character:", error);
    return null;
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
    return {
      error: error instanceof Error ? error.message : "Failed to add favorite",
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
    return {
      error:
        error instanceof Error ? error.message : "Failed to remove favorite",
    };
  }
}

export async function addFavoriteCharacter(
  characterId: number,
  characterName: string,
  characterImage?: string | null
) {
  const data = await serverGraphqlRequest<AddFavoriteCharacterMutation>(
    AddFavoriteCharacterDocument,
    {
      characterId,
      characterName,
      characterImage,
    }
  );
  return data.addFavoriteCharacter;
}

export async function removeFavoriteCharacter(characterId: number) {
  await serverGraphqlRequest<RemoveFavoriteCharacterMutation>(
    RemoveFavoriteCharacterDocument,
    { characterId }
  );
  return true;
}
