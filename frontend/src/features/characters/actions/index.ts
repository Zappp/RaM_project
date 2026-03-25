"use server";

import { requireActionAuth } from "@/features/auth/actions/utils";
import { handleActionError } from "@/lib/error";
import { paginationSchema } from "@/lib/pagination";
import { createClient } from "@/lib/supabase/server";
import type { AsyncActionResult } from "@/lib/types/actions";
import type { PaginatedResult } from "@/lib/types/pagination";
import type { Character } from "../types/characters";

export async function getCharactersAction(
  page?: string,
): AsyncActionResult<PaginatedResult<Character>, typeof paginationSchema> {
  const supabase = await createClient();

  try {
    await requireActionAuth();
    const { page: validatedPage } = await paginationSchema.parseAsync({ page });

    const params = new URLSearchParams();
    if (validatedPage) params.set("page", validatedPage.toString());

    const endpoint = params.toString() ? `characters?${params.toString()}` : "characters";


    const { data, error } = await supabase.functions.invoke<PaginatedResult<Character>>(endpoint, {
      method: "GET",
    });

    if (error) throw error;
    if (!data) throw new Error();

    return { data, error, success: true };
  } catch (error) {
    return await handleActionError(error, "Failed to fetch characters");
  }
}
