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

