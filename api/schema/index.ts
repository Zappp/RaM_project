import { makeExecutableSchema } from "@graphql-tools/schema";
import { authTypeDefs } from "./auth.ts";
import { authResolvers } from "../resolvers/auth.ts";

const typeDefs = [authTypeDefs];

const resolvers = [authResolvers];

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export type { GraphQLContext } from "../lib/types.ts";

