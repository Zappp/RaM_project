import { createYoga } from "graphql-yoga";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs } from "../schema/index.ts";
import { resolvers } from "../resolvers/index.ts";
import { AppEnv } from "./types/hono.ts";

export type YogaContext = AppEnv["Variables"];

export function createGraphQLServer() {
  return createYoga({
    schema: makeExecutableSchema({
      typeDefs,
      resolvers,
    }),
    context: ({
      request,
    }: {
      request: Request & { yogaContext: YogaContext };
    }): YogaContext => request.yogaContext,
    maskedErrors: true,
    graphiql: {
      title: "Rick & Morty GraphQL API",
      defaultQuery: `{
        characters(page: 1) {
          results {
            id
            name
          }
          info {
            count
            pages
          }
        }
      }`,
    },
    cors: false,
  });
}
