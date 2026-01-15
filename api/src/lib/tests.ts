import type { YogaContext } from "@/lib/graphql.ts";

export function createMockYogaContext(): YogaContext {
  const mockSupabase = {
    auth: {
      signInWithPassword: () => Promise.resolve({ data: null, error: null }),
      signUp: () => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      getClaims: () => Promise.resolve({ data: null, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    },
  } as unknown as YogaContext["supabase"];

  return {
    user: null,
    supabase: mockSupabase,
  };
}

export function mockFetch(
  response: unknown,
  ok: boolean = true,
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
