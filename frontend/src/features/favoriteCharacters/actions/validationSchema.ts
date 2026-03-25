import z from "zod";

export const getFavoriteCharactersByRemoteIdSchema = z.object({
  remoteIds: z.array(z.string().trim().min(1)).min(1),
});

export const addFavoriteCharacterSchema = z.object({
  remoteId: z.string().trim().min(1),
  name: z.string().trim().min(1),
  image: z.url().optional().nullable().default(null),
  status: z.string().nullable().optional().nullable().default(null),
  species: z.string().nullable().optional().default(null),
});

export const deleteFavoriteCharacterByIdSchema = z.object({
  id: z.string().trim().min(1),
});
