import { z } from "zod";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants.ts";

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().min(1).max(100).default(DEFAULT_PAGE_SIZE),
});

export const favoriteCharacterIdSchema = z.object({
  characterId: z.number().int().positive(),
});

export const favoriteCharacterIdsSchema = z.object({
  characterIds: z.array(z.number().int().positive()).min(1),
});

export const addFavoriteCharacterSchema = z.object({
  characterId: z.number().int().positive(),
  characterName: z.string().min(1),
  characterImage: z.string().nullable().optional(),
});
