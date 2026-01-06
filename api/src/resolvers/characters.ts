import type { GraphQLContext } from "@/lib/types/graphql.ts";
import { NotFoundError } from "@/lib/errors.ts";
import type { PaginatedResult } from "@/lib/pagination.ts";
import { createPageInfo } from "@/lib/pagination.ts";
import { RICK_AND_MORTY_API_URL } from "@/lib/constants.ts";
import type {
  Character,
  RickAndMortyCharacter,
  RickAndMortyResponse,
} from "@/lib/types/character.ts";

async function fetchCharacters(page?: number): Promise<RickAndMortyResponse> {
  const url = page
    ? `${RICK_AND_MORTY_API_URL}/character?page=${page}`
    : `${RICK_AND_MORTY_API_URL}/character`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Rick & Morty API error: ${response.statusText}`);
  }

  return await response.json();
}

async function fetchCharacter(id: string): Promise<RickAndMortyCharacter> {
  const response = await fetch(`${RICK_AND_MORTY_API_URL}/character/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new NotFoundError("Character not found");
    }
    throw new Error(`Rick & Morty API error: ${response.statusText}`);
  }

  return await response.json();
}



export const charactersResolvers = {
  Query: {
    characters: async (
      _: unknown,
      args: { page?: number },
      _context: GraphQLContext
    ): Promise<PaginatedResult<Character>> => {
      try {
        const data = await fetchCharacters(args.page);

        const pageInfo = createPageInfo(
          data.info.count,
          data.info.pages,
          data.info.next,
          data.info.prev
        );

        const results = data.results.map((char) => ({
          id: String(char.id),
          name: char.name,
          status: char.status,
          species: char.species,
          type: char.type,
          gender: char.gender,
          origin: char.origin
            ? {
                name: char.origin.name,
                url: char.origin.url,
              }
            : null,
          location: char.location
            ? {
                name: char.location.name,
                url: char.location.url,
              }
            : null,
          image: char.image,
          episode: char.episode,
          created: char.created,
        }));

        console.info(`Fetched ${results.length} characters (page: ${args.page || 1})`);

        return {
          results,
          info: pageInfo,
        };
      } catch (error) {
        console.error("Error fetching characters:", error);
        const message = error instanceof Error ? error.message : "Failed to fetch characters";
        throw new Error(message);
      }
    },

    character: async (
      _: unknown,
      args: { id: string },
      _context: GraphQLContext
    ) => {
      try {
        const char = await fetchCharacter(args.id);

        return {
          id: String(char.id),
          name: char.name,
          status: char.status,
          species: char.species,
          type: char.type,
          gender: char.gender,
          origin: char.origin
            ? {
                name: char.origin.name,
                url: char.origin.url,
              }
            : null,
          location: char.location
            ? {
                name: char.location.name,
                url: char.location.url,
              }
            : null,
          image: char.image,
          episode: char.episode,
          created: char.created,
        };
      } catch (error) {
        console.error(`Error fetching character ${args.id}:`, error);
        if (error instanceof NotFoundError) {
          throw error;
        }
        const message = error instanceof Error ? error.message : "Failed to fetch character";
        throw new Error(message);
      }
    },
  },
};

