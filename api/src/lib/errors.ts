import {
  AuthError,
  AuthInvalidCredentialsError,
  AuthInvalidJwtError,
  isAuthApiError,
  isAuthError,
  isAuthSessionMissingError,
} from "@supabase/auth-js";
import { PostgrestError } from "@supabase/postgrest-js";
import { GraphQLError } from "graphql";

export class AuthenticationError extends GraphQLError {
  constructor(message: string = "Authentication required") {
    super(message, {
      extensions: {
        code: "UNAUTHENTICATED",
        statusCode: 401,
      },
    });
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends GraphQLError {
  constructor(message: string = "Not authorized") {
    super(message, {
      extensions: {
        code: "FORBIDDEN",
        statusCode: 403,
      },
    });
    this.name = "AuthorizationError";
  }
}

export class ValidationError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: "BAD_USER_INPUT",
        statusCode: 400,
      },
    });
    this.name = "ValidationError";
  }
}

export class NotFoundError extends GraphQLError {
  constructor(message: string = "Resource not found") {
    super(message, {
      extensions: {
        code: "NOT_FOUND",
        statusCode: 404,
      },
    });
    this.name = "NotFoundError";
  }
}

export class InternalServerError extends GraphQLError {
  constructor(message: string = "Internal server error") {
    super(message, {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        statusCode: 500,
      },
    });
    this.name = "InternalServerError";
  }
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message) || fallback;
  }
  return fallback;
}

export class PostgrestErrorHandler extends GraphQLError {
  constructor(error: PostgrestError) {
    const message = getErrorMessage(error, "Database query failed");

    const errorMessage = String(error.message).toLowerCase();
    if (
      errorMessage.includes("jwt") ||
      errorMessage.includes("unauthorized") ||
      errorMessage.includes("unauthenticated") ||
      error.code === "PGRST301" ||
      error.code === "PGRST302"
    ) {
      super(message, {
        extensions: {
          code: "UNAUTHENTICATED",
          statusCode: 401,
        },
      });
      this.name = "PostgrestErrorHandler";
      return;
    }

    super(message, {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        statusCode: 500,
      },
    });
    this.name = "PostgrestErrorHandler";
  }
}

export class SupabaseErrorHandler extends GraphQLError {
  constructor(error: AuthError) {
    const message = error.message || "Something went wrong";

    if (isAuthSessionMissingError(error)) {
      super("Session is missing", {
        extensions: {
          code: "UNAUTHENTICATED",
          statusCode: 401,
        },
      });
      this.name = "SupabaseErrorHandler";
      return;
    }

    if (error instanceof AuthInvalidJwtError) {
      super("Invalid or expired token", {
        extensions: {
          code: "UNAUTHENTICATED",
          statusCode: 401,
        },
      });
      this.name = "SupabaseErrorHandler";
      return;
    }

    if (error instanceof AuthInvalidCredentialsError) {
      super("Invalid credentials", {
        extensions: {
          code: "UNAUTHENTICATED",
          statusCode: 401,
        },
      });
      this.name = "SupabaseErrorHandler";
      return;
    }

    if (isAuthApiError(error) || isAuthError(error)) {
      if (error.status === 401) {
        super(message, {
          extensions: {
            code: "UNAUTHENTICATED",
            statusCode: 401,
          },
        });
        this.name = "SupabaseErrorHandler";
        return;
      }
      if (error.status === 403) {
        super(message, {
          extensions: {
            code: "FORBIDDEN",
            statusCode: 403,
          },
        });
        this.name = "SupabaseErrorHandler";
        return;
      }
    }

    super(message, {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        statusCode: 500,
      },
    });
    this.name = "SupabaseErrorHandler";
  }
}

// TODO update error message returned to client (rn shows backend related data (line location etc))
