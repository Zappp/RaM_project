import z from "@zod";

export const remoteCharacterSchema = z.object({
  id: z.coerce.string<string>().trim().min(1),
  name: z.string().trim().min(1),
  status: z.string().optional().nullable(),
  image: z.url().optional().nullable(),
  species: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
});

export const remoteCharactersSchema = z.object({
  info: z.object({
    count: z.int().min(0),
    pages: z.int().min(1),
    next: z.url().nullable(),
    prev: z.url().nullable(),
  }),
  results: z.array(remoteCharacterSchema),
});
