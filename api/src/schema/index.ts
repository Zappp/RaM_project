import { makeExecutableSchema } from "@graphql-tools/schema";
import { charactersTypeDefs } from "./characters.ts";
import { favoriteCharactersTypeDefs } from "./favoriteCharacters.ts";
import { charactersResolvers } from "@/resolvers/characters.ts";
import { favoriteCharactersResolvers } from "@/resolvers/favoriteCharacters.ts";

const typeDefs = [charactersTypeDefs, favoriteCharactersTypeDefs];

const resolvers = [charactersResolvers, favoriteCharactersResolvers];

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
