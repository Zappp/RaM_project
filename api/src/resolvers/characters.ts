import type { YogaContext } from "@/lib/graphql.ts";
import { InternalServerError } from "@/lib/errors.ts";
import { createPageInfo } from "@/lib/pagination.ts";
import { env } from "@/lib/env.ts";
import type { Character } from "@/lib/types/character.ts";
import type {
  PaginatedResult,
  PaginationProps,
} from "@/lib/types/pagination.ts";

async function fetchCharacters(
  props: Partial<Pick<PaginationProps, "page">>,
): Promise<PaginatedResult<Character>> {
  const { page } = props;
  const url = new URL(`${env.SUPABASE_URL}/functions/v1/getcharacters`);
  if (page) {
    url.searchParams.set("page", page.toString());
  }

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new InternalServerError(
        error.error || `Rick & Morty API error: ${response.statusText}`
      );
    }

    const data = await response.json();

    const pageInfo = createPageInfo(
      data.info.count,
      data.info.pages,
      data.info.next,
      data.info.prev,
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

export const charactersResolvers = {
  Query: {
    characters: async (
      _: unknown,
      props: Partial<Pick<PaginationProps, "page">>,
      _yogaContext: YogaContext,
    ): Promise<PaginatedResult<Character>> => {
      return await fetchCharacters(props);
    },
  },
};
