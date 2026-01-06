import { createYoga } from "graphql-yoga";
import { schema } from "@/schema/index.ts";
import { formatGraphQLError } from "@/lib/errors.ts";
import type { GraphQLContext } from "@/lib/types/graphql.ts";
import type { Context } from "hono";
import { getCurrentUser } from "../resolvers/auth.ts";

export async function createAuthContext(
  context: Context
): Promise<GraphQLContext> {
  const user = await getCurrentUser(context);
  return { context, user };
}

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
