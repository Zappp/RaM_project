export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

export function isAuthErrorResponse(
  status: number,
  errorCode?: string,
  statusCode?: number,
  errorMessage?: string
): boolean {
  return (
    status === 401 ||
    statusCode === 401 ||
    errorCode === "UNAUTHENTICATED" ||
    errorMessage === "Authentication required" // TODO merge status and statuscode
  );
}
