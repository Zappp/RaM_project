import { authResolvers } from "./auth.ts";
import { charactersResolvers } from "./characters.ts";
import { favoriteCharactersResolvers } from "./favoriteCharacters.ts";

export const resolvers = [
  authResolvers,
  charactersResolvers,
  favoriteCharactersResolvers,
];

