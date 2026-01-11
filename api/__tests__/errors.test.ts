import { assertEquals } from "@std/assert";
import {
  AuthenticationError,
  AuthorizationError,
  GraphQLError,
  InternalServerError,
  NotFoundError,
  SupabaseErrorHandler,
  ValidationError,
} from "@/lib/errors.ts";

Deno.test("GraphQLError - creates error with code and status", () => {
  const error = new GraphQLError("Test error", "TEST_CODE", 400);
  assertEquals(error.message, "Test error");
  assertEquals(error.code, "TEST_CODE");
  assertEquals(error.statusCode, 400);
  assertEquals(error.name, "GraphQLError");
});

Deno.test("AuthenticationError - creates 401 error", () => {
  const error = new AuthenticationError("Not authenticated");
  assertEquals(error.message, "Not authenticated");
  assertEquals(error.code, "UNAUTHENTICATED");
  assertEquals(error.statusCode, 401);
  assertEquals(error.name, "AuthenticationError");
});

Deno.test("AuthorizationError - creates 403 error", () => {
  const error = new AuthorizationError("Not authorized");
  assertEquals(error.message, "Not authorized");
  assertEquals(error.code, "FORBIDDEN");
  assertEquals(error.statusCode, 403);
  assertEquals(error.name, "AuthorizationError");
});

Deno.test("ValidationError - creates 400 error", () => {
  const error = new ValidationError("Invalid input");
  assertEquals(error.message, "Invalid input");
  assertEquals(error.code, "BAD_USER_INPUT");
  assertEquals(error.statusCode, 400);
  assertEquals(error.name, "ValidationError");
});

Deno.test("NotFoundError - creates 404 error", () => {
  const error = new NotFoundError("Resource not found");
  assertEquals(error.message, "Resource not found");
  assertEquals(error.code, "NOT_FOUND");
  assertEquals(error.statusCode, 404);
  assertEquals(error.name, "NotFoundError");
});

Deno.test("InternalServerError - creates 500 error", () => {
  const error = new InternalServerError("Server error");
  assertEquals(error.message, "Server error");
  assertEquals(error.code, "INTERNAL_SERVER_ERROR");
  assertEquals(error.statusCode, 500);
  assertEquals(error.name, "InternalServerError");
});

Deno.test("SupabaseErrorHandler - handles error with jwt in message", () => {
  const error = new SupabaseErrorHandler(new Error("JWT expired"));
  assertEquals(error.code, "INTERNAL_SERVER_ERROR");
  assertEquals(error.statusCode, 500);
  assertEquals(error.message, "JWT expired");
});

Deno.test("SupabaseErrorHandler - handles PostgrestError with generic error", () => {
  const postgrestError = {
    code: "23505",
    message: "Duplicate key",
    details: "",
    hint: "",
  };
  const error = new SupabaseErrorHandler(postgrestError);
  assertEquals(error.code, "INTERNAL_SERVER_ERROR");
  assertEquals(error.statusCode, 500);
  assertEquals(error.message, "Duplicate key");
});

Deno.test("SupabaseErrorHandler - handles regular Error", () => {
  const regularError = new Error("Something went wrong");
  const error = new SupabaseErrorHandler(regularError);
  assertEquals(error.code, "INTERNAL_SERVER_ERROR");
  assertEquals(error.statusCode, 500);
  assertEquals(error.message, "Something went wrong");
});

Deno.test("SupabaseErrorHandler - handles unknown errors", () => {
  const error = new SupabaseErrorHandler("string error", "Fallback message");
  assertEquals(error.code, "INTERNAL_SERVER_ERROR");
  assertEquals(error.statusCode, 500);
  assertEquals(error.message, "Fallback message");
});
