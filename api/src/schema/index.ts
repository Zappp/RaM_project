import { makeExecutableSchema } from "@graphql-tools/schema";
import { authTypeDefs } from "./auth.ts";
import { charactersTypeDefs } from "./characters.ts";
import { favoriteCharactersTypeDefs } from "./favoriteCharacters.ts";
import { authResolvers } from "@/resolvers/auth.ts";
import { charactersResolvers } from "@/resolvers/characters.ts";
import { favoriteCharactersResolvers } from "@/resolvers/favoriteCharacters.ts";

const typeDefs = [authTypeDefs, charactersTypeDefs, favoriteCharactersTypeDefs];

const resolvers = [authResolvers, charactersResolvers, favoriteCharactersResolvers];

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
