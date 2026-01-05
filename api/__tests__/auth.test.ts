import { assertEquals, assertRejects } from "@std/assert";
import { Context } from "hono";
import { authResolvers, createAuthContext } from "@/resolvers/auth.ts";
import { AuthenticationError, ValidationError } from "@/lib/errors.ts";

function createMockContext(cookieHeader?: string): Context & { _responseHeaders: Headers } {
  const headers = new Headers();
  if (cookieHeader) {
    headers.set("Cookie", cookieHeader);
  }

  const responseHeaders = new Headers();

  const req = {
    header: (name: string) => headers.get(name) || undefined,
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

Deno.test("createAuthContext - returns null user when no cookie", async () => {
  const mockContext = createMockContext();
  const context = await createAuthContext(mockContext);

  assertEquals(context.user, null);
});

Deno.test("authResolvers.Query.me - throws AuthenticationError when not authenticated", async () => {
  const mockContext = createMockContext();
  const context = await createAuthContext(mockContext);

  await assertRejects(
    async () => {
      await authResolvers.Query.me(undefined, undefined, context);
    },
    AuthenticationError,
    "Authentication required"
  );
});

Deno.test("authResolvers.Mutation.signup - throws ValidationError for missing email", async () => {
  const mockContext = createMockContext();
  const context = await createAuthContext(mockContext);

  await assertRejects(
    async () => {
      await authResolvers.Mutation.signup(undefined, { email: "", password: "password123" }, context);
    },
    ValidationError
  );
});

Deno.test("authResolvers.Mutation.signup - throws ValidationError for short password", async () => {
  const mockContext = createMockContext();
  const context = await createAuthContext(mockContext);

  await assertRejects(
    async () => {
      await authResolvers.Mutation.signup(undefined, { email: "test@example.com", password: "123" }, context);
    },
    ValidationError,
    "Password must be at least 6 characters"
  );
});

Deno.test("authResolvers.Mutation.login - throws ValidationError for missing email", async () => {
  const mockContext = createMockContext();
  const context = await createAuthContext(mockContext);

  await assertRejects(
    async () => {
      await authResolvers.Mutation.login(undefined, { email: "", password: "password123" }, context);
    },
    ValidationError
  );
});

Deno.test("authResolvers.Mutation.logout - returns true and clears cookie", async () => {
  const mockContext = createMockContext("auth-token=test-token");
  const context = await createAuthContext(mockContext);

  const result = await authResolvers.Mutation.logout(undefined, undefined, context);

  assertEquals(result, true);
  const setCookieHeader = mockContext._responseHeaders.get("Set-Cookie");
  assertEquals(setCookieHeader?.includes("auth-token="), true);
  assertEquals(setCookieHeader?.includes("Max-Age=0"), true);
});
