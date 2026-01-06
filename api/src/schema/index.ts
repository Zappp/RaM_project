import { makeExecutableSchema } from "@graphql-tools/schema";
import { authTypeDefs } from "./auth.ts";
import { charactersTypeDefs } from "./characters.ts";
import { favoriteCharactersTypeDefs } from "./favoriteCharacters.ts";
import { authResolvers } from "@/resolvers/auth.ts";

const typeDefs = [authTypeDefs, charactersTypeDefs, favoriteCharactersTypeDefs];

const resolvers = [authResolvers];

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
