import { createYoga } from "graphql-yoga";
import type { Context } from "hono";
import { GraphQLError } from "graphql";
import { schema } from "../schema/index.ts";
import { formatGraphQLError } from "./errors.ts";
import { validateJWT } from "./jwt.ts";
import { createSupabaseClient } from "./supabase.ts";
import { GraphQLContext } from "./types/graphql.ts";

export async function createGraphQLContext(
  context: Context
): Promise<GraphQLContext> {
  const authHeader = context.req.header("Authorization") || null;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : authHeader;

  const supabase = createSupabaseClient(token);

  let user = null;
  if (token) {
    user = await validateJWT(token, supabase);
  }

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
