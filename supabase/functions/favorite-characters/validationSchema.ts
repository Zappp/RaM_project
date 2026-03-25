import z from "@zod";

export const getFavoriteCharactersByRemoteIdSchema = z.object({
  remoteId: z.preprocess(
    (value) => {
      if (Array.isArray(value)) return value;
      return [value];
    },
    z.array(z.string().trim().min(1)).min(1),
  ),
});

export const deleteFavoriteCharacterByIdSchema = z.object({
  id: z.string().trim().min(1),
});

export const addFavoriteCharacterSchema = z.object({
  remoteId: z.string().trim().min(1),
  name: z.string().trim().min(1),
  image: z.url().optional().nullable().default(null),
  status: z.string().trim().min(1).optional().nullable().default(null),
  species: z.string().trim().min(1).optional().nullable().default(
    null,
  ),
});
