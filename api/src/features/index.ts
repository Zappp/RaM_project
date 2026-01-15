export { authGraphQLSchema, authResolvers } from "./auth/index.ts";
export {
  charactersGraphQLSchema,
  charactersResolvers,
} from "./characters/index.ts";
export {
  favoriteCharactersGraphQLSchema,
  favoriteCharactersResolvers,
} from "./favoriteCharacters/index.ts";

import { authGraphQLSchema, authResolvers } from "./auth/index.ts";
import {
  charactersGraphQLSchema,
  charactersResolvers,
} from "./characters/index.ts";
import {
  favoriteCharactersGraphQLSchema,
  favoriteCharactersResolvers,
} from "./favoriteCharacters/index.ts";

export const resolvers = [
  authResolvers,
  charactersResolvers,
  favoriteCharactersResolvers,
];

export const typeDefs = [
  authGraphQLSchema,
  charactersGraphQLSchema,
  favoriteCharactersGraphQLSchema,
];
