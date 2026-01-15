import { NotFoundError } from "@/lib/errors.ts";
import type { FavoriteCharacter } from "./favoriteCharacters.types.ts";
import type { PaginatedResult } from "@/lib/types/pagination.ts";
import { env } from "@/lib/env.ts";
import type { YogaContext } from "@/lib/graphql.ts";
import type {
  ValidatedAddFavoriteCharacter,
  ValidatedFavoriteCharacterId,
  ValidatedFavoriteCharacterIds,
  ValidatedPagination,
} from "./favoriteCharacters.types.ts";

export async function getFavoriteCharactersHandler(
  transformedArgs: ValidatedPagination,
  context: YogaContext,
): Promise<PaginatedResult<FavoriteCharacter>> {
  const { page, pageSize } = transformedArgs;
  const accessToken = context.user!.accessToken;

  const url = new URL(`${env.SUPABASE_URL}/functions/v1/getfavoritecharacters`);
  url.searchParams.set("page", page.toString());
  url.searchParams.set("pageSize", pageSize.toString());

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || "Failed to fetch favorite characters");
  }

  const data = await response.json();
  return data;
}

export async function getFavoriteCharactersByIdsHandler(
  transformedArgs: ValidatedFavoriteCharacterIds,
  context: YogaContext,
): Promise<FavoriteCharacter[]> {
  const { characterIds } = transformedArgs;
  const accessToken = context.user!.accessToken;

  if (characterIds.length === 0) {
    return [];
  }

  const response = await fetch(
    `${env.SUPABASE_URL}/functions/v1/getfavoritecharactersbyids`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ characterIds }),
    },
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || "Failed to fetch favorite characters");
  }

  const data = await response.json();
  return data.results || [];
}

export async function addFavoriteCharacterHandler(
  transformedArgs: ValidatedAddFavoriteCharacter,
  context: YogaContext,
): Promise<FavoriteCharacter> {
  const { characterId, characterName, characterImage = null } = transformedArgs;
  const accessToken = context.user!.accessToken;

  const response = await fetch(
    `${env.SUPABASE_URL}/functions/v1/addfavoritecharacter`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        characterId,
        characterName,
        characterImage,
      }),
    },
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || "Failed to add favorite character");
  }

  const data = await response.json();
  return data;
}

export async function removeFavoriteCharacterHandler(
  transformedArgs: ValidatedFavoriteCharacterId,
  context: YogaContext,
): Promise<boolean> {
  const { characterId } = transformedArgs;
  const accessToken = context.user!.accessToken;

  const response = await fetch(
    `${env.SUPABASE_URL}/functions/v1/removefavoritecharacter`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ characterId }),
    },
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    if (response.status === 404) {
      throw new NotFoundError(error.error || "Favorite character not found");
    }
    throw new Error(error.error || "Failed to remove favorite character");
  }

  return true;
}
