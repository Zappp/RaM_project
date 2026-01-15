import { assertEquals } from "@std/assert";
import { createGraphQLServer, type YogaContext } from "@/lib/graphql.ts";
import { env } from "@/lib/env.ts";
import { createMockYogaContext } from "./utils.ts";

Deno.test("GraphQL server - handles query", async () => {
  const yoga = createGraphQLServer();
  const yogaContext = createMockYogaContext();

  const request = new Request(`${env.API_URL}/graphql`, {
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

  (request as Request & { yogaContext: YogaContext }).yogaContext =
    yogaContext;

  const response = await yoga.fetch(request);
  const result = await response.json();

  assertEquals(response.status, 200);
  assertEquals(result.data.__typename, "Query");
});

Deno.test("GraphQL server - favoriteCharacters query requires authentication", async () => {
  const yoga = createGraphQLServer();
  const yogaContext = createMockYogaContext();

  const request = new Request(`${env.API_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query {
        favoriteCharacters {
          results {
            id
            characterId
          }
        }
      }`,
    }),
  });

  (request as Request & { yogaContext: YogaContext }).yogaContext =
    yogaContext;

  const response = await yoga.fetch(request);
  const result = await response.json();

  assertEquals(response.status, 200);
  assertEquals(result.errors?.length > 0, true);
});

Deno.test("GraphQL server - GraphiQL playground available", async () => {
  const yoga = createGraphQLServer();

  const request = new Request(`${env.API_URL}/graphql`, {
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
    true,
  );
  assertEquals(text.includes("GraphiQL"), true);
});
