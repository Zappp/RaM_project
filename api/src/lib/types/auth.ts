import type { GraphQLContext } from "./graphql.ts";

export interface CachedUser {
  user: GraphQLContext["user"];
  expiresAt: number;
}

