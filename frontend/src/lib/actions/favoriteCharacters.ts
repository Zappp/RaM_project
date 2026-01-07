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
    console.error("Error adding favorite character:", error);
    return null;
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
    console.error("Error removing favorite character:", error);
    return null;
  }
}
