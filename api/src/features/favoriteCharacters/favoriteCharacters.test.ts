import { assertRejects } from "@std/assert";
import type { GraphQLResolveInfo } from "graphql";
import { favoriteCharactersResolvers } from "./favoriteCharacters.resolvers.ts";
import { createMockYogaContext } from "../../lib/tests.ts";
import { AuthenticationError } from "@/lib/errors.ts";
import { ValidationError } from "@/lib/errors.ts";
import type { ContextUser } from "../../lib/types/hono.ts";

Deno.test("favoriteCharactersResolvers.Query.favoriteCharacters - requires authentication", async () => {
  const yogaContext = createMockYogaContext();

  await assertRejects(
    async () => {
      await favoriteCharactersResolvers.Query.favoriteCharacters(
        undefined,
        { page: 1, pageSize: 10 },
        yogaContext,
        {} as GraphQLResolveInfo,
      );
    },
    AuthenticationError,
  );
});

Deno.test("favoriteCharactersResolvers.Query.favoriteCharacters - validates pagination", async () => {
  const yogaContext = createMockYogaContext();
  const user: ContextUser = { accessToken: "test-token" };
  const authenticatedContext = { ...yogaContext, user };

  await assertRejects(
    async () => {
      await favoriteCharactersResolvers.Query.favoriteCharacters(
        undefined,
        { page: -1, pageSize: 10 },
        authenticatedContext,
        {} as GraphQLResolveInfo,
      );
    },
    ValidationError,
  );
});

Deno.test("favoriteCharactersResolvers.Query.favoriteCharactersByIds - requires authentication", async () => {
  const yogaContext = createMockYogaContext();

  await assertRejects(
    async () => {
      await favoriteCharactersResolvers.Query.favoriteCharactersByIds(
        undefined,
        { characterIds: [1, 2, 3] },
        yogaContext,
        {} as GraphQLResolveInfo,
      );
    },
    AuthenticationError,
  );
});

Deno.test("favoriteCharactersResolvers.Query.favoriteCharactersByIds - validates characterIds is not empty", async () => {
  const yogaContext = createMockYogaContext();
  const user: ContextUser = { accessToken: "test-token" };
  const authenticatedContext = { ...yogaContext, user };

  await assertRejects(
    async () => {
      await favoriteCharactersResolvers.Query.favoriteCharactersByIds(
        undefined,
        { characterIds: [] },
        authenticatedContext,
        {} as GraphQLResolveInfo,
      );
    },
    ValidationError,
  );
});

Deno.test("favoriteCharactersResolvers.Mutation.addFavoriteCharacter - requires authentication", async () => {
  const yogaContext = createMockYogaContext();

  await assertRejects(
    async () => {
      await favoriteCharactersResolvers.Mutation.addFavoriteCharacter(
        undefined,
        { characterId: 1, characterName: "Rick" },
        yogaContext,
        {} as GraphQLResolveInfo,
      );
    },
    AuthenticationError,
  );
});

Deno.test("favoriteCharactersResolvers.Mutation.addFavoriteCharacter - validates characterId is positive", async () => {
  const yogaContext = createMockYogaContext();
  const user: ContextUser = { accessToken: "test-token" };
  const authenticatedContext = { ...yogaContext, user };

  await assertRejects(
    async () => {
      await favoriteCharactersResolvers.Mutation.addFavoriteCharacter(
        undefined,
        { characterId: -1, characterName: "Rick" },
        authenticatedContext,
        {} as GraphQLResolveInfo,
      );
    },
    ValidationError,
  );
});

Deno.test("favoriteCharactersResolvers.Mutation.removeFavoriteCharacter - requires authentication", async () => {
  const yogaContext = createMockYogaContext();

  await assertRejects(
    async () => {
      await favoriteCharactersResolvers.Mutation.removeFavoriteCharacter(
        undefined,
        { characterId: 1 },
        yogaContext,
        {} as GraphQLResolveInfo,
      );
    },
    AuthenticationError,
  );
});

Deno.test("favoriteCharactersResolvers.Mutation.removeFavoriteCharacter - validates characterId is positive", async () => {
  const yogaContext = createMockYogaContext();
  const user: ContextUser = { accessToken: "test-token" };
  const authenticatedContext = { ...yogaContext, user };

  await assertRejects(
    async () => {
      await favoriteCharactersResolvers.Mutation.removeFavoriteCharacter(
        undefined,
        { characterId: -1 },
        authenticatedContext,
        {} as GraphQLResolveInfo,
      );
    },
    ValidationError,
  );
});
