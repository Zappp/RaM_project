import type { GraphQLContext } from "@/lib/types/graphql.ts";
import { NotFoundError, InternalServerError } from "@/lib/errors.ts";
import { createPageInfo } from "@/lib/pagination.ts";
import { RICK_AND_MORTY_API_URL } from "@/lib/constants.ts";
import type { Character, CharacterIdProps } from "@/lib/types/character.ts";
import type { PaginatedResult, PaginationProps } from "@/lib/types/pagination.ts";

async function fetchCharacters(props: Partial<Pick<PaginationProps, "page">>): Promise<PaginatedResult<Character>> {
  const { page } = props;
  const url = page
    ? `${RICK_AND_MORTY_API_URL}/character?page=${page}`
    : `${RICK_AND_MORTY_API_URL}/character`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new InternalServerError(`Rick & Morty API error: ${response.statusText}`);
    }

    const data = await response.json();

    const pageInfo = createPageInfo(
      data.info.count,
      data.info.pages,
      data.info.next,
      data.info.prev
    );

    return {
      results: data.results,
      info: pageInfo,
    };
  } catch (error) {
    if (error instanceof InternalServerError) {
      throw error;
    }
    throw new InternalServerError("Failed to fetch characters");
  }
}

async function fetchCharacter(props: CharacterIdProps): Promise<Character> {
  const { id } = props;

  try {
    const response = await fetch(`${RICK_AND_MORTY_API_URL}/character/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new NotFoundError("Character not found");
      }
      throw new InternalServerError(`Rick & Morty API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    if (error instanceof InternalServerError) {
      throw error;
    }
    throw new InternalServerError("Failed to fetch character");
  }
}

export const charactersResolvers = {
  Query: {
    characters: async (
      _: unknown,
      props: Partial<Pick<PaginationProps, "page">>,
      _context: GraphQLContext
    ): Promise<PaginatedResult<Character>> => {
      return await fetchCharacters(props);
    },

    character: async (
      _: unknown,
      props: CharacterIdProps,
      _context: GraphQLContext
    ): Promise<Character> => {
      return await fetchCharacter(props);
    },
  },
};
