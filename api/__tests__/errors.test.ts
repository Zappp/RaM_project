import { assertEquals } from "@std/assert";
import {
  GraphQLError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  NotFoundError,
  formatGraphQLError,
} from "../lib/errors.ts";

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

Deno.test("formatGraphQLError - formats GraphQLError", () => {
  const error = new AuthenticationError("Not authenticated");
  const formatted = formatGraphQLError(error);
  assertEquals(formatted.message, "Not authenticated");
  assertEquals(formatted.code, "UNAUTHENTICATED");
  assertEquals(formatted.statusCode, 401);
});

Deno.test("formatGraphQLError - formats regular Error", () => {
  const error = new Error("Regular error");
  const formatted = formatGraphQLError(error);
  assertEquals(formatted.message, "Regular error");
  assertEquals(formatted.code, undefined);
  assertEquals(formatted.statusCode, undefined);
});

Deno.test("formatGraphQLError - handles unknown errors", () => {
  const formatted = formatGraphQLError("string error");
  assertEquals(formatted.message, "An unexpected error occurred");
  assertEquals(formatted.code, undefined);
  assertEquals(formatted.statusCode, undefined);
});

