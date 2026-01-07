import { createYoga } from "graphql-yoga";
import { GraphQLError } from "graphql";
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
          emailVerified
        }
      }
    }`,
    },
    maskedErrors: {
      maskError(error: unknown, _message: string, _isDev?: boolean): GraphQLError {
        const formatted = formatGraphQLError(error);
        
        return new GraphQLError(formatted.message, {
          extensions: {
            code: formatted.code,
            statusCode: formatted.statusCode,
          },
        });
      },
    },
    cors: false,
  });
}
