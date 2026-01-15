import { assertEquals } from "@std/assert";
import {
  AuthenticationError,
  AuthorizationError,
  InternalServerError,
  NotFoundError,
  SupabaseErrorHandler,
  ValidationError,
} from "@/lib/errors.ts";
import {
  AuthInvalidCredentialsError,
  AuthInvalidJwtError,
  AuthSessionMissingError,
} from "@supabase/auth-js";

Deno.test("AuthenticationError - creates 401 error", () => {
  const error = new AuthenticationError("Not authenticated");
  assertEquals(error.message, "Not authenticated");
  assertEquals(error.extensions?.code, "UNAUTHENTICATED");
  assertEquals(error.extensions?.statusCode, 401);
  assertEquals(error.name, "AuthenticationError");
});

Deno.test("AuthorizationError - creates 403 error", () => {
  const error = new AuthorizationError("Not authorized");
  assertEquals(error.message, "Not authorized");
  assertEquals(error.extensions?.code, "FORBIDDEN");
  assertEquals(error.extensions?.statusCode, 403);
  assertEquals(error.name, "AuthorizationError");
});

Deno.test("ValidationError - creates 400 error", () => {
  const error = new ValidationError("Invalid input");
  assertEquals(error.message, "Invalid input");
  assertEquals(error.extensions?.code, "BAD_USER_INPUT");
  assertEquals(error.extensions?.statusCode, 400);
  assertEquals(error.name, "ValidationError");
});

Deno.test("NotFoundError - creates 404 error", () => {
  const error = new NotFoundError("Resource not found");
  assertEquals(error.message, "Resource not found");
  assertEquals(error.extensions?.code, "NOT_FOUND");
  assertEquals(error.extensions?.statusCode, 404);
  assertEquals(error.name, "NotFoundError");
});

Deno.test("InternalServerError - creates 500 error", () => {
  const error = new InternalServerError("Server error");
  assertEquals(error.message, "Server error");
  assertEquals(error.extensions?.code, "INTERNAL_SERVER_ERROR");
  assertEquals(error.extensions?.statusCode, 500);
  assertEquals(error.name, "InternalServerError");
});

Deno.test("SupabaseErrorHandler - handles AuthInvalidJwtError", () => {
  const authError = new AuthInvalidJwtError("Invalid or expired token");
  const error = new SupabaseErrorHandler(authError);
  assertEquals(error.extensions?.code, "UNAUTHENTICATED");
  assertEquals(error.extensions?.statusCode, 401);
  assertEquals(error.message, "Invalid or expired token");
});

Deno.test("SupabaseErrorHandler - handles AuthInvalidCredentialsError", () => {
  const authError = new AuthInvalidCredentialsError("Invalid credentials");
  const error = new SupabaseErrorHandler(authError);
  assertEquals(error.extensions?.code, "UNAUTHENTICATED");
  assertEquals(error.extensions?.statusCode, 401);
  assertEquals(error.message, "Invalid credentials");
});

Deno.test("SupabaseErrorHandler - handles AuthSessionMissingError", () => {
  const authError = new AuthSessionMissingError();
  const error = new SupabaseErrorHandler(authError);
  assertEquals(error.extensions?.code, "UNAUTHENTICATED");
  assertEquals(error.extensions?.statusCode, 401);
  assertEquals(error.message, "Session is missing");
});

Deno.test("SupabaseErrorHandler - handles generic AuthError", () => {
  const authError = {
    name: "AuthError",
    message: "Something went wrong",
    status: 500,
  } as any;
  const error = new SupabaseErrorHandler(authError);
  assertEquals(error.extensions?.code, "INTERNAL_SERVER_ERROR");
  assertEquals(error.extensions?.statusCode, 500);
  assertEquals(error.message, "Something went wrong");
});
