import { assertEquals } from "@std/assert";
import { createGraphQLServer } from "@/lib/graphql.ts";
import { Context } from "hono";

function createMockContext(cookieHeader?: string): Context {
  const headers = new Headers();
  if (cookieHeader) {
    headers.set("Cookie", cookieHeader);
  }

  const responseHeaders = new Headers();

  const req = {
    header: (name: string) => headers.get(name) || undefined,
    url: "http://localhost:8000/graphql",
    method: "POST",
    raw: {
      clone: () => ({
        arrayBuffer: async () => await Promise.resolve(new ArrayBuffer(0)),
      }),
    },
  };

  const context = {
    req,
    header: (name: string, value?: string) => {
      if (value !== undefined) {
        if (name === "Set-Cookie") {
          responseHeaders.append(name, value);
        } else {
          responseHeaders.set(name, value);
        }
        return;
      }
      return responseHeaders.get(name) || undefined;
    },
    _responseHeaders: responseHeaders,
  } as unknown as Context & { _responseHeaders: Headers };

  return context;
}

Deno.test("GraphQL server - handles query", async () => {
  const yoga = createGraphQLServer();
  const mockContext = createMockContext();

  const request = new Request("http://localhost:8000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query {
        __typename
      }`,
    }),
  });

  (request as Request & { honoContext: Context }).honoContext = mockContext;

  const response = await yoga.fetch(request);
  const result = await response.json();

  assertEquals(response.status, 200);
  assertEquals(result.data.__typename, "Query");
});

Deno.test("GraphQL server - me query requires authentication", async () => {
  const yoga = createGraphQLServer();
  const mockContext = createMockContext();

  const request = new Request("http://localhost:8000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query {
        me {
          id
          email
        }
      }`,
    }),
  });

  (request as Request & { honoContext: Context }).honoContext = mockContext;

  const response = await yoga.fetch(request);
  const result = await response.json();

  assertEquals(response.status, 200);
  assertEquals(result.errors?.length > 0, true);
});

Deno.test("GraphQL server - GraphiQL playground available", async () => {
  const yoga = createGraphQLServer();

  const request = new Request("http://localhost:8000/graphql", {
    method: "GET",
    headers: {
      Accept: "text/html",
    },
  });

  const response = await yoga.fetch(request);
  const text = await response.text();

  assertEquals(response.status, 200);
  assertEquals(
    response.headers.get("Content-Type")?.includes("text/html"),
    true
  );
  assertEquals(text.includes("GraphiQL"), true);
});
