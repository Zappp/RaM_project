import { makeExecutableSchema } from "@graphql-tools/schema";
import { authTypeDefs, authResolvers } from "./auth.ts";

const typeDefs = [authTypeDefs];

const resolvers = [authResolvers];

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

