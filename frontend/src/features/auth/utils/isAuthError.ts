export function isAuthError(error: unknown): boolean {
  const errorCode = (error as any)?.code;
  const errorMessage = error instanceof Error ? error.message : "";
  const statusCode = (error as any)?.statusCode;

  return (
    statusCode === 401 ||
    errorCode === "UNAUTHENTICATED" ||
    errorMessage.includes("Authentication required") ||
    errorMessage.includes("Invalid JWT") ||
    errorMessage.includes("Unauthorized")
  );
}
