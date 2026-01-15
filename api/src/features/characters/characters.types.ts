import type { z } from "zod";
import type { charactersPaginationSchema } from "./characters.validationSchema.ts";

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: { name: string; url: string };
  location: { name: string; url: string };
  image: string;
  episode: string[];
  created: string;
}

export type ValidatedCharactersPagination = z.infer<
  typeof charactersPaginationSchema
>;
