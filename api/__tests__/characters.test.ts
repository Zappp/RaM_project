import { assertEquals, assertRejects } from "@std/assert";
import { charactersResolvers } from "@/resolvers/characters.ts";
import { createMockYogaContext, mockFetch } from "./utils.ts";

Deno.test("charactersResolvers.Query.characters - returns paginated characters", async () => {
  const mockResponse = {
    info: {
      count: 826,
      pages: 42,
      next: "https://rickandmortyapi.com/api/character?page=2",
      prev: null,
    },
    results: [
      {
        id: 1,
        name: "Rick Sanchez",
        status: "Alive",
        species: "Human",
        type: "",
        gender: "Male",
        origin: {
          name: "Earth (C-137)",
          url: "https://rickandmortyapi.com/api/location/1",
        },
        location: {
          name: "Citadel of Ricks",
          url: "https://rickandmortyapi.com/api/location/3",
        },
        image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
        episode: ["https://rickandmortyapi.com/api/episode/1"],
        created: "2017-11-04T18:48:46.250Z",
      },
    ],
  };

  globalThis.fetch = mockFetch(mockResponse);

  const yogaContext = createMockYogaContext();
  const result = await charactersResolvers.Query.characters(
    undefined,
    {},
    yogaContext,
  );

  assertEquals(result.results.length, 1);
  assertEquals(result.results[0].id, 1);
  assertEquals(result.results[0].name, "Rick Sanchez");
  assertEquals(result.info.count, 826);
  assertEquals(result.info.pages, 42);
  assertEquals(result.info.next, 2);
  assertEquals(result.info.prev, null);
});

Deno.test("charactersResolvers.Query.characters - handles pagination with page parameter", async () => {
  const mockResponse = {
    info: {
      count: 826,
      pages: 42,
      next: "https://rickandmortyapi.com/api/character?page=3",
      prev: "https://rickandmortyapi.com/api/character?page=1",
    },
    results: [
      {
        id: 21,
        name: "Aqua Morty",
        status: "unknown",
        species: "Human",
        type: "Fish-Person",
        gender: "Male",
        origin: { name: "unknown", url: "" },
        location: {
          name: "Citadel of Ricks",
          url: "https://rickandmortyapi.com/api/location/3",
        },
        image: "https://rickandmortyapi.com/api/character/avatar/21.jpeg",
        episode: ["https://rickandmortyapi.com/api/episode/10"],
        created: "2017-11-04T22:39:48.055Z",
      },
    ],
  };

  globalThis.fetch = mockFetch(mockResponse);

  const yogaContext = createMockYogaContext();
  const result = await charactersResolvers.Query.characters(undefined, {
    page: 2,
  }, yogaContext);

  assertEquals(result.info.next, 3);
  assertEquals(result.info.prev, 1);
});

Deno.test("charactersResolvers.Query.characters - handles API errors", async () => {
  const emptyResponse = {
    info: { count: 0, pages: 0, next: null, prev: null },
    results: [],
  };
  globalThis.fetch = mockFetch(emptyResponse, false);

  const yogaContext = createMockYogaContext();

  await assertRejects(
    async () => {
      await charactersResolvers.Query.characters(undefined, {}, yogaContext);
    },
    Error,
    "Rick & Morty API error: Not Found",
  );
});
