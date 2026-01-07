"use server";

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

export async function getFavoriteCharacters(page?: number, pageSize?: number) {
  try {
    const data = await serverGraphqlRequest<FavoriteCharactersQuery>(
      FavoriteCharactersDocument,
      { page, pageSize }
    );
    return data.favoriteCharacters;
  } catch (error) {
    throw error;
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
    return null;
  }
}

export async function addFavoriteCharacter(
  characterId: number,
  characterName: string,
  characterImage?: string | null
) {
  try {
    const data = await serverGraphqlRequest<AddFavoriteCharacterMutation>(
      AddFavoriteCharacterDocument,
      {
        characterId,
        characterName,
        characterImage,
      }
    );
    return data.addFavoriteCharacter;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to add favorite";
    throw new Error(errorMessage);
  }
}

export async function removeFavoriteCharacter(characterId: number) {
  try {
    await serverGraphqlRequest<RemoveFavoriteCharacterMutation>(
      RemoveFavoriteCharacterDocument,
      { characterId }
    );
    return true;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to remove favorite";
    throw new Error(errorMessage);
  }
}
