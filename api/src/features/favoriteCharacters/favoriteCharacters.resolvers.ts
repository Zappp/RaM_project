import {
  addFavoriteCharacterSchema,
  favoriteCharacterIdSchema,
  favoriteCharacterIdsSchema,
  paginationSchema,
} from "./favoriteCharacters.validationSchema.ts";
import {
  addFavoriteCharacterHandler,
  getFavoriteCharactersByIdsHandler,
  getFavoriteCharactersHandler,
  removeFavoriteCharacterHandler,
} from "./favoriteCharacters.handlers.ts";
import { compose, withAuth, withValidation } from "../../lib/decorators.ts";

export const favoriteCharactersResolvers = {
  Query: {
    favoriteCharacters: compose(
      withAuth(),
      withValidation(paginationSchema),
    )(getFavoriteCharactersHandler),
    favoriteCharactersByIds: compose(
      withAuth(),
      withValidation(favoriteCharacterIdsSchema),
    )(getFavoriteCharactersByIdsHandler),
  },
  Mutation: {
    addFavoriteCharacter: compose(
      withAuth(),
      withValidation(addFavoriteCharacterSchema),
    )(addFavoriteCharacterHandler),
    removeFavoriteCharacter: compose(
      withAuth(),
      withValidation(favoriteCharacterIdSchema),
    )(removeFavoriteCharacterHandler),
  },
};
