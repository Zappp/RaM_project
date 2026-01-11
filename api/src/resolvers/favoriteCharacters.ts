import type { GraphQLContext } from "@/lib/types/graphql.ts";
import {
  AuthenticationError,
  NotFoundError,
  ValidationError,
  SupabaseErrorHandler,
} from "@/lib/errors.ts";
import { RICK_AND_MORTY_API_URL } from "@/lib/constants.ts";
import type {
  FavoriteCharacter,
  FavoriteCharacterIdProps,
  AddFavoriteCharacterProps,
} from "@/lib/types/character.ts";
import type {
  PaginationProps,
  PaginatedResult,
} from "@/lib/types/pagination.ts";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants.ts";

async function getFavoriteCharacters(
  context: GraphQLContext,
  props: Required<PaginationProps>
): Promise<PaginatedResult<FavoriteCharacter>> {
  const { user, supabase } = context;
  if (!user) {
    throw new AuthenticationError();
  }

  const { page = 1, pageSize = DEFAULT_PAGE_SIZE } = props;
  const offset = (page - 1) * pageSize;

  try {
    const { data, error, count } = await supabase
      .from("favorite_characters")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) {
      throw error;
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    const results = (data || []).map((row) => ({
      id: row.id,
      userId: row.user_id,
      characterId: row.character_id,
      characterName: row.character_name,
      characterImage: row.character_image || null,
      characterStatus: row.character_status || null,
      characterSpecies: row.character_species || null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    const pageInfo = {
      count: totalCount,
      pages: totalPages,
      next: page < totalPages ? page + 1 : null,
      prev: page > 1 ? page - 1 : null,
    };

    return {
      results,
      info: pageInfo,
    };
  } catch (error) {
    throw new SupabaseErrorHandler(
      error,
      "Failed to fetch favorite characters"
    );
  }
}

async function getFavoriteCharacter(
  context: GraphQLContext,
  props: FavoriteCharacterIdProps
): Promise<FavoriteCharacter | null> {
  const { user, supabase } = context;
  if (!user) {
    throw new AuthenticationError();
  }

  const { characterId } = props;

  try {
    const { data, error } = await supabase
      .from("favorite_characters")
      .select("*")
      .eq("user_id", user.id)
      .eq("character_id", characterId)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      characterId: data.character_id,
      characterName: data.character_name,
      characterImage: data.character_image || null,
      characterStatus: data.character_status || null,
      characterSpecies: data.character_species || null,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    throw new SupabaseErrorHandler(error, "Failed to fetch favorite character");
  }
}

async function getFavoriteCharactersByIds(
  context: GraphQLContext,
  props: { characterIds: number[] }
): Promise<FavoriteCharacter[]> {
  const { user, supabase } = context;
  if (!user) {
    throw new AuthenticationError();
  }

  const { characterIds } = props;

  if (characterIds.length === 0) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("favorite_characters")
      .select("*")
      .eq("user_id", user.id)
      .in("character_id", characterIds);

    if (error) {
      throw error;
    }

    return (data || []).map((row) => ({
      id: row.id,
      userId: row.user_id,
      characterId: row.character_id,
      characterName: row.character_name,
      characterImage: row.character_image || null,
      characterStatus: row.character_status || null,
      characterSpecies: row.character_species || null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch (error) {
    throw new SupabaseErrorHandler(
      error,
      "Failed to fetch favorite characters"
    );
  }
}

async function addFavoriteCharacter(
  context: GraphQLContext,
  props: Required<AddFavoriteCharacterProps>
): Promise<FavoriteCharacter> {
  const { user, supabase } = context;

  if (!user) {
    throw new AuthenticationError();
  }

  const { characterId, characterName, characterImage = null } = props;

  let characterStatus: string | null = null;
  let characterSpecies: string | null = null;

  try {
    const response = await fetch(
      `${RICK_AND_MORTY_API_URL}/character/${characterId}`
    );
    if (response.ok) {
      const characterData = await response.json();
      characterStatus = characterData.status || null;
      characterSpecies = characterData.species || null;
    }
  } catch (error) {
    console.error("Error fetching character data:", error);
  }

  try {
    const { data, error } = await supabase
      .from("favorite_characters")
      .insert({
        user_id: user.id,
        character_id: characterId,
        character_name: characterName,
        character_image: characterImage ?? null,
        character_status: characterStatus,
        character_species: characterSpecies,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("Failed to add favorite character");
    }

    return {
      id: data.id,
      userId: data.user_id,
      characterId: data.character_id,
      characterName: data.character_name,
      characterImage: data.character_image || null,
      characterStatus: data.character_status || null,
      characterSpecies: data.character_species || null,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    throw new SupabaseErrorHandler(error, "Failed to add favorite character");
  }
}

async function removeFavoriteCharacter(
  context: GraphQLContext,
  props: FavoriteCharacterIdProps
): Promise<boolean> {
  const { user, supabase } = context;
  if (!user) {
    throw new AuthenticationError();
  }

  const { characterId } = props;

  try {
    const { error } = await supabase
      .from("favorite_characters")
      .delete()
      .eq("user_id", user.id)
      .eq("character_id", characterId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    throw new SupabaseErrorHandler(
      error,
      "Failed to remove favorite character"
    );
  }
}

export const favoriteCharactersResolvers = {
  Query: {
    favoriteCharacters: async (
      _: unknown,
      props: PaginationProps,
      context: GraphQLContext
    ): Promise<PaginatedResult<FavoriteCharacter>> => {
      const { page = 1, pageSize = DEFAULT_PAGE_SIZE } = props;

      if (page < 1) {
        throw new ValidationError("Page must be greater than 0");
      }

      if (pageSize < 1 || pageSize > 100) {
        throw new ValidationError("Page size must be between 1 and 100");
      }

      return await getFavoriteCharacters(context, { page, pageSize });
    },

    favoriteCharacter: async (
      _: unknown,
      props: FavoriteCharacterIdProps,
      context: GraphQLContext
    ): Promise<FavoriteCharacter | null> => {
      return await getFavoriteCharacter(context, props);
    },

    favoriteCharactersByIds: async (
      _: unknown,
      props: { characterIds: number[] },
      context: GraphQLContext
    ): Promise<FavoriteCharacter[]> => {
      return await getFavoriteCharactersByIds(context, props);
    },
  },

  Mutation: {
    addFavoriteCharacter: async (
      _: unknown,
      props: AddFavoriteCharacterProps,
      context: GraphQLContext
    ): Promise<FavoriteCharacter> => {
      const { characterId, characterName, characterImage = null } = props;

      if (!characterId || !characterName) {
        throw new ValidationError("Character ID and name are required");
      }

      return await addFavoriteCharacter(context, {
        characterId,
        characterName,
        characterImage,
      });
    },

    removeFavoriteCharacter: async (
      _: unknown,
      props: FavoriteCharacterIdProps,
      context: GraphQLContext
    ): Promise<boolean> => {
      const { characterId } = props;

      if (!characterId) {
        throw new ValidationError("Character ID is required");
      }

      const favoriteCharacter = await getFavoriteCharacter(context, props);
      if (!favoriteCharacter) {
        throw new NotFoundError("Favorite character not found");
      }

      return await removeFavoriteCharacter(context, props);
    },
  },
};
