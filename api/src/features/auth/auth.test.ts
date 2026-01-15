import { assertRejects } from "@std/assert";
import type { GraphQLResolveInfo } from "graphql";
import { authResolvers } from "./auth.resolvers.ts";
import { createMockYogaContext } from "../../lib/tests.ts";
import { AuthenticationError } from "@/lib/errors.ts";
import { ValidationError } from "@/lib/errors.ts";

Deno.test("authResolvers.Mutation.login - validates email format", async () => {
  const yogaContext = createMockYogaContext();

  await assertRejects(
    async () => {
      await authResolvers.Mutation.login(
        undefined,
        { email: "invalid-email", password: "password123" },
        yogaContext,
        {} as GraphQLResolveInfo,
      );
    },
    ValidationError,
  );
});

Deno.test("authResolvers.Mutation.login - validates password is not empty", async () => {
  const yogaContext = createMockYogaContext();

  await assertRejects(
    async () => {
      await authResolvers.Mutation.login(
        undefined,
        { email: "test@example.com", password: "" },
        yogaContext,
        {} as GraphQLResolveInfo,
      );
    },
    ValidationError,
  );
});

Deno.test("authResolvers.Mutation.signup - validates email format", async () => {
  const yogaContext = createMockYogaContext();

  await assertRejects(
    async () => {
      await authResolvers.Mutation.signup(
        undefined,
        { email: "invalid-email", password: "password123" },
        yogaContext,
        {} as GraphQLResolveInfo,
      );
    },
    ValidationError,
  );
});

Deno.test("authResolvers.Mutation.signup - validates password is not empty", async () => {
  const yogaContext = createMockYogaContext();

  await assertRejects(
    async () => {
      await authResolvers.Mutation.signup(
        undefined,
        { email: "test@example.com", password: "" },
        yogaContext,
        {} as GraphQLResolveInfo,
      );
    },
    ValidationError,
  );
});

Deno.test("authResolvers.Mutation.logout - requires authentication", async () => {
  const yogaContext = createMockYogaContext();

  await assertRejects(
    async () => {
      await authResolvers.Mutation.logout(
        undefined,
        {},
        yogaContext,
        {} as GraphQLResolveInfo,
      );
    },
    AuthenticationError,
  );
});
