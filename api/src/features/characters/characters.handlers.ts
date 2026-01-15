import { InternalServerError } from "@/lib/errors.ts";
import { createPageInfo } from "@/lib/pagination.ts";
import { env } from "@/lib/env.ts";
import type { Character } from "./characters.types.ts";
import type { PaginatedResult } from "@/lib/types/pagination.ts";
import type { YogaContext } from "@/lib/graphql.ts";
import type { ValidatedCharactersPagination } from "./characters.types.ts";

export async function fetchCharactersHandler(
  transformedArgs: ValidatedCharactersPagination,
  _context: YogaContext,
): Promise<PaginatedResult<Character>> {
  const { page } = transformedArgs;
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
        error.error || `Rick & Morty API error: ${response.statusText}`,
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
