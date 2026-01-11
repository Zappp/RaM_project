"use server";

import { serverGraphqlRequest } from "@/lib/graphql/graphqlRequest";
import { AuthError } from "@/lib/errors/AuthError";
import { handleAuthError } from "@/features/auth/actions/authErrorHandler";
import { CharactersDocument } from "@/lib/types/generated";
import type { CharactersQuery } from "@/lib/types/generated";

export async function getCharacters(page?: number) {
  try {
    const data = await serverGraphqlRequest<CharactersQuery>(CharactersDocument, { page });
    return data.characters;
  } catch (error) {
    if (error instanceof AuthError) {
      await handleAuthError(error);
      return null;
    }
    console.error("Error fetching characters:", error);
    return null;
  }
}
