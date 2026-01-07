"use server";

import { serverGraphqlRequest } from "../graphql/graphqlRequest";
import { CharactersDocument, CharacterDocument } from "../types/generated";
import type { CharactersQuery, CharacterQuery } from "../types/generated";

export async function getCharacters(page?: number) {
  try {
    const data = await serverGraphqlRequest<CharactersQuery>(
      CharactersDocument,
      { page }
    );
    return data.characters;
  } catch (error) {
    throw error;
  }
}

export async function getCharacter(id: string) {
  try {
    const data = await serverGraphqlRequest<CharacterQuery>(
      CharacterDocument,
      { id }
    );
    return data.character;
  } catch (error) {
    console.error("Error fetching character:", error);
    return null;
  }
}

