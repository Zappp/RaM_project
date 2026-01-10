"use server";

import { serverGraphqlRequest } from "@/lib/graphql/graphqlRequest";
import { CharactersDocument } from "@/lib/types/generated";
import type { CharactersQuery } from "@/lib/types/generated";

export async function getCharacters(page?: number) {
  try {
    const data = await serverGraphqlRequest<CharactersQuery>(
      CharactersDocument,
      { page }
    );
    return data.characters;
  } catch (error) {
    console.error("Error fetching characters:", error);
    return null;
  }
}
