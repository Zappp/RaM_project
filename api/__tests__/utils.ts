import type { GraphQLContext } from "@/lib/types/graphql.ts";
import type { Context } from "hono";

export function createMockContext(): GraphQLContext {
  const mockHonoContext = {
    req: {
      header: () => undefined,
    },
    header: () => undefined,
  } as unknown as Context;

  return {
    context: mockHonoContext,
    user: null,
  };
}

export function mockFetch(
  response: unknown,
  ok: boolean = true
): typeof fetch {
  return () => {
    return Promise.resolve({
      ok,
      json: () => Promise.resolve(response),
      statusText: ok ? "OK" : "Not Found",
      status: ok ? 200 : 404,
    } as Response);
  };
}

