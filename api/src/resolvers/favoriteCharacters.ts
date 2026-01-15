import type { YogaContext } from "@/lib/graphql.ts";
import {
  AuthenticationError,
  NotFoundError,
  ValidationError,
} from "@/lib/errors.ts";
import type {
  AddFavoriteCharacterProps,
  FavoriteCharacter,
  FavoriteCharacterIdProps,
} from "@/lib/types/character.ts";
import type {
  PaginatedResult,
  PaginationProps,
} from "@/lib/types/pagination.ts";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants.ts";
import { env } from "@/lib/env.ts";

// TODO add clear separation between input data validation (utilize zod) and handler
// TODO add decorators for authentication/validation (?)
// TODO keep in mind that some edge functions do not need authentication for some resources
// TODO add a fetch wrapper (?)

async function getFavoriteCharacters(
  yogaContext: YogaContext,
  props: Required<PaginationProps>
): Promise<PaginatedResult<FavoriteCharacter>> {
  const { user } = yogaContext;
  if (!user) {
    throw new AuthenticationError();
  }

  const { page = 1, pageSize = DEFAULT_PAGE_SIZE } = props;

  const url = new URL(`${env.SUPABASE_URL}/functions/v1/getfavoritecharacters`);
  url.searchParams.set("page", page.toString());
  url.searchParams.set("pageSize", pageSize.toString());

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${user.accessToken}`,
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

async function getFavoriteCharactersByIds(
  yogaContext: YogaContext,
  props: { characterIds: number[] }
): Promise<FavoriteCharacter[]> {
  const { user } = yogaContext;
  if (!user) {
    throw new AuthenticationError();
  }

  const { characterIds } = props;

  if (characterIds.length === 0) {
    return [];
  }

  // TODO can be invoked using supabase client (?)
  // TODO check function naming format (is lowercase a must?)
  const response = await fetch(
    `${env.SUPABASE_URL}/functions/v1/getfavoritecharactersbyids`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ characterIds }),
    }
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

async function addFavoriteCharacter(
  yogaContext: YogaContext,
  props: Required<AddFavoriteCharacterProps>
): Promise<FavoriteCharacter> {
  const { user } = yogaContext;

  if (!user) {
    throw new AuthenticationError();
  }

  const { characterId, characterName, characterImage = null } = props;

  const response = await fetch(
    `${env.SUPABASE_URL}/functions/v1/addfavoritecharacter`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        characterId,
        characterName,
        characterImage,
      }),
    }
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

async function removeFavoriteCharacter(
  yogaContext: YogaContext,
  props: FavoriteCharacterIdProps
): Promise<boolean> {
  const { user } = yogaContext;
  if (!user) {
    throw new AuthenticationError();
  }

  const { characterId } = props;

  const response = await fetch(
    `${env.SUPABASE_URL}/functions/v1/removefavoritecharacter`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ characterId }),
    }
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

export const favoriteCharactersResolvers = {
  Query: {
    favoriteCharacters: async (
      _: unknown,
      props: PaginationProps,
      yogaContext: YogaContext
    ): Promise<PaginatedResult<FavoriteCharacter>> => {
      const { page = 1, pageSize = DEFAULT_PAGE_SIZE } = props;

      if (page < 1) {
        throw new ValidationError("Page must be greater than 0");
      }

      if (pageSize < 1 || pageSize > 100) {
        throw new ValidationError("Page size must be between 1 and 100");
      }

      return await getFavoriteCharacters(yogaContext, { page, pageSize });
    },

    favoriteCharactersByIds: async (
      _: unknown,
      props: { characterIds: number[] },
      yogaContext: YogaContext
    ): Promise<FavoriteCharacter[]> => {
      return await getFavoriteCharactersByIds(yogaContext, props);
    },
  },

  Mutation: {
    addFavoriteCharacter: async (
      _: unknown,
      props: AddFavoriteCharacterProps,
      yogaContext: YogaContext
    ): Promise<FavoriteCharacter> => {
      const { characterId, characterName, characterImage = null } = props;

      if (!characterId || !characterName) {
        throw new ValidationError("Character ID and name are required");
      }

      return await addFavoriteCharacter(yogaContext, {
        characterId,
        characterName,
        characterImage,
      });
    },

    removeFavoriteCharacter: async (
      _: unknown,
      props: FavoriteCharacterIdProps,
      yogaContext: YogaContext
    ): Promise<boolean> => {
      const { characterId } = props;

      if (!characterId) {
        throw new ValidationError("Character ID is required");
      }

      return await removeFavoriteCharacter(yogaContext, props);
    },
  },
};
