export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

export function isAuthErrorResponse(errorCode?: string, statusCode?: number): boolean {
  return errorCode === "UNAUTHENTICATED" || statusCode === 401;
}

export function isAuthorizationErrorResponse(errorCode?: string, statusCode?: number): boolean {
  return errorCode === "FORBIDDEN" || statusCode === 403;
}

export function isAuthErrorHttpStatus(status: number): boolean {
  return status === 401;
}

export function isAuthorizationErrorHttpStatus(status: number): boolean {
  return status === 403;
}
