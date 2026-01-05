import { createYoga } from "graphql-yoga";
import { schema } from "@/schema/index.ts";
import { createAuthContext } from "@/resolvers/auth.ts";
import { formatGraphQLError } from "@/lib/errors.ts";
import type { GraphQLContext } from "@/lib/types.ts";
import type { Context } from "hono";

export function createGraphQLServer() {
  return createYoga({
    schema,
    context: async ({
      request,
    }: {
      request: Request;
    }): Promise<GraphQLContext> => {
      const honoContext = (request as Request & { honoContext: Context })
        .honoContext;
      return await createAuthContext(honoContext);
    },
    graphiql: {
      title: "Rick & Morty API",
      defaultQuery: `{
        me {
          id
          email
          createdAt
        }
      }
    }`,
    },
    maskedErrors: {
      maskError(error: unknown, _message: string, isDev?: boolean): Error {
        if (isDev) {
          return error instanceof Error ? error : new Error(String(error));
        }
        const formatted = formatGraphQLError(error);
        return new Error(formatted.message);
      },
    },
    cors: false,
  });
}
