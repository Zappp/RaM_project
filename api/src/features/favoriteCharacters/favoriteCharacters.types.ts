import type { z } from "zod";
import type {
  addFavoriteCharacterSchema,
  favoriteCharacterIdSchema,
  favoriteCharacterIdsSchema,
  paginationSchema,
} from "./favoriteCharacters.validationSchema.ts";

export interface FavoriteCharacter {
  id: string;
  userId: string;
  characterId: number;
  characterName: string;
  characterImage: string | null;
  characterStatus: string | null;
  characterSpecies: string | null;
  createdAt: string;
  updatedAt: string;
}

export type FavoriteCharacterIdProps = Pick<FavoriteCharacter, "characterId">;

export type AddFavoriteCharacterProps =
  & Pick<
    FavoriteCharacter,
    "characterId" | "characterName"
  >
  & { characterImage?: string | null };

export type ValidatedPagination = z.infer<typeof paginationSchema>;
export type ValidatedFavoriteCharacterId = z.infer<
  typeof favoriteCharacterIdSchema
>;
export type ValidatedFavoriteCharacterIds = z.infer<
  typeof favoriteCharacterIdsSchema
>;
export type ValidatedAddFavoriteCharacter = z.infer<
  typeof addFavoriteCharacterSchema
>;
