import { createYoga } from "graphql-yoga";
import { GraphQLError } from "graphql";
import { schema } from "@/schema/index.ts";
import { formatGraphQLError } from "@/lib/errors.ts";
import type { GraphQLContext } from "@/lib/types/graphql.ts";
import type { Context } from "hono";
import { createSupabaseClient } from "@/lib/supabase.ts";
import { validateJWT } from "@/lib/jwt.ts";

export async function createGraphQLContext(
  context: Context
): Promise<GraphQLContext> {
  const authHeader = context.req.header("Authorization") || null;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : authHeader;

  const supabase = createSupabaseClient(token);

  const user = token ? await validateJWT(token, supabase) : null;

  return { context, user, supabase };
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
      return await createGraphQLContext(honoContext);
    },
    graphiql: {
      title: "Rick & Morty API",
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
    maskedErrors: {
      maskError(
        error: unknown,
        _message: string,
        _isDev?: boolean
      ): GraphQLError {
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
