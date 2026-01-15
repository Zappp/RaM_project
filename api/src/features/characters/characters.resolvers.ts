import { charactersPaginationSchema } from "./characters.validationSchema.ts";
import { fetchCharactersHandler } from "./characters.handlers.ts";
import { withValidation } from "../../lib/decorators.ts";

export const charactersResolvers = {
  Query: {
    characters: withValidation(charactersPaginationSchema)(
      fetchCharactersHandler,
    ),
  },
};
