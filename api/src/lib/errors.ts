import { isAuthApiError } from "@supabase/supabase-js";

export class GraphQLError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = "GraphQLError";
  }
}

export class AuthenticationError extends GraphQLError {
  constructor(message: string = "Authentication required") {
    super(message, "UNAUTHENTICATED", 401);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends GraphQLError {
  constructor(message: string = "Not authorized") {
    super(message, "FORBIDDEN", 403);
    this.name = "AuthorizationError";
  }
}

export class ValidationError extends GraphQLError {
  constructor(message: string) {
    super(message, "BAD_USER_INPUT", 400);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends GraphQLError {
  constructor(message: string = "Resource not found") {
    super(message, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

export function formatGraphQLError(error: unknown): {
  message: string;
  code?: string;
  statusCode?: number;
} {
  if (error instanceof GraphQLError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: "An unexpected error occurred",
  };
}

export function isAuthenticationError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  if ("status" in error && error.status === 401) {
    return true;
  }

  if ("code" in error) {
    const code = error.code as string;
    if (code === "PGRST301" || code === "PGRST302") {
      return true;
    }
  }

  if (isAuthApiError(error)) {
    const authError = error as { status?: number; code?: string };
    if (authError.status === 401) {
      return true;
    }
  }
  if ("message" in error) {
    const message = String(error.message).toLowerCase();
    if (
      message.includes("jwt") ||
      message.includes("unauthorized") ||
      message.includes("unauthenticated")
    ) {
      return true;
    }
  }

  return false;
}

