import {
  AuthInvalidCredentialsError,
  AuthInvalidJwtError,
  isAuthApiError,
  isAuthError,
  isAuthSessionMissingError,
} from "@supabase/auth-js";
import { PostgrestError } from "@supabase/postgrest-js";

export type NormalizedErrorResponse = {
  message: string;
  code: string;
  statusCode: number;
};

export class GraphQLError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400,
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

export class InternalServerError extends GraphQLError {
  constructor(message: string = "Internal server error") {
    super(message, "INTERNAL_SERVER_ERROR", 500);
    this.name = "InternalServerError";
  }
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message) || fallback;
  }
  return fallback;
}

export class SupabaseErrorHandler extends GraphQLError {
  constructor(
    error: unknown,
    fallbackMessage: string = "Something went wrong",
  ) {
    if (error instanceof PostgrestError) {
      const message = getErrorMessage(error, fallbackMessage);

      const errorMessage = String(error.message).toLowerCase();
      if (
        errorMessage.includes("jwt") ||
        errorMessage.includes("unauthorized") ||
        errorMessage.includes("unauthenticated") ||
        error.code === "PGRST301" ||
        error.code === "PGRST302"
      ) {
        super(message, "UNAUTHENTICATED", 401);
        return;
      }

      super(message, "INTERNAL_SERVER_ERROR", 500);
      return;
    }

    const message = getErrorMessage(error, fallbackMessage);

    if (isAuthSessionMissingError(error)) {
      super("Session is missing", "UNAUTHENTICATED", 401);
      return;
    }

    if (error instanceof AuthInvalidJwtError) {
      super("Invalid or expired token", "UNAUTHENTICATED", 401);
      return;
    }

    if (error instanceof AuthInvalidCredentialsError) {
      super("Invalid credentials", "UNAUTHENTICATED", 401);
      return;
    }

    if (isAuthApiError(error) || isAuthError(error)) {
      if (error.status === 401) {
        super(message, "UNAUTHENTICATED", 401);
        return;
      }
      if (error.status === 403) {
        super(message, "FORBIDDEN", 403);
        return;
      }
    }

    super(message, "INTERNAL_SERVER_ERROR", 500);
  }
}

export function formatGraphQLError(error: unknown): NormalizedErrorResponse {
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
      code: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
    };
  }

  return {
    message: "An unexpected error occurred",
    code: "INTERNAL_SERVER_ERROR",
    statusCode: 500,
  };
}
