"use server";

import { revalidatePath } from "next/cache";
import { requireActionAuth } from "@/features/auth/actions/utils";
import { handleActionError } from "@/lib/error";
import { paginationSchema } from "@/lib/pagination";
import { createClient } from "@/lib/supabase/server";
import type { AsyncActionResult } from "@/lib/types/actions";
import type { PaginatedResult } from "@/lib/types/pagination";
import type { FavoriteCharacter } from "../types";
import {
  addFavoriteCharacterSchema,
  deleteFavoriteCharacterByIdSchema,
  getFavoriteCharactersByRemoteIdSchema,
} from "./validationSchema";

export async function getFavoriteCharactersAction(
  page?: string,
): AsyncActionResult<PaginatedResult<FavoriteCharacter>, typeof paginationSchema> {
  const supabase = await createClient();

  try {
    await requireActionAuth();
    const { page: validatedPage } = await paginationSchema.parseAsync({ page });
    const params = new URLSearchParams();
    if (validatedPage) params.set("page", validatedPage.toString());

    const endpoint = params.toString()
      ? `favorite-characters?${params.toString()}`
      : "favorite-characters";
    const { data, error } = await supabase.functions.invoke<PaginatedResult<FavoriteCharacter>>(
      endpoint,
      { method: "GET" },
    );

    if (error) throw error;
    if (!data) throw new Error();

    return { data, error, success: true };
  } catch (error) {
    return await handleActionError(error, "Failed to fetch favorite characters");
  }
}

export async function getFavoriteCharactersByRemoteIdAction(
  remoteIds: string[],
): AsyncActionResult<FavoriteCharacter[], typeof getFavoriteCharactersByRemoteIdSchema> {
  const supabase = await createClient();

  try {
    await requireActionAuth();
    const { remoteIds: validatedIds } = await getFavoriteCharactersByRemoteIdSchema.parseAsync({
      remoteIds,
    });
    const params = new URLSearchParams();
    validatedIds.forEach((remoteId) => {
      params.append("remoteId", remoteId);
    });
    const endpoint = `favorite-characters/by-remote-id?${params}`;

    const { data, error } = await supabase.functions.invoke<FavoriteCharacter[]>(endpoint, {
      method: "GET",
    });

    if (error) throw error;
    if (!data) throw new Error();

    return { data, error, success: true };
  } catch (error) {
    return handleActionError(error, "Failed to fetch favorite characters by IDs");
  }
}

export async function addFavoriteCharacterAction(
  _prevState: unknown,
  formData: FormData,
): AsyncActionResult<null, typeof addFavoriteCharacterSchema> {
  const supabase = await createClient();

  try {
    await requireActionAuth();
    const body = await addFavoriteCharacterSchema.parseAsync(
      Object.fromEntries(formData.entries()),
    );
    const { error } = await supabase.functions.invoke<FavoriteCharacter>("favorite-characters", {
      method: "POST",
      body,
    });

    if (error) throw error;

    revalidatePath("/dashboard");
    revalidatePath("/favorites");
    return { data: null, error: null, success: true };
  } catch (error) {
    return await handleActionError(error, "Failed to add favorite");
  }
}

export async function removeFavoriteCharacterByIdAction(
  _prevState: unknown,
  formData: FormData,
): AsyncActionResult<null, typeof deleteFavoriteCharacterByIdSchema> {
  const supabase = await createClient();

  try {
    await requireActionAuth();
    const { id } = await deleteFavoriteCharacterByIdSchema.parseAsync(
      Object.fromEntries(formData.entries()),
    );
    const endpoint = `favorite-characters/${id}`;

    const { error } = await supabase.functions.invoke<FavoriteCharacter>(endpoint, {
      method: "DELETE",
    });

    if (error) throw error;

    revalidatePath("/dashboard");
    revalidatePath("/favorites");
    return { data: null, error, success: true };
  } catch (error) {
    return await handleActionError(error, "Failed to remove favorite");
  }
}
