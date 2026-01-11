"server-only";

import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { DocumentNode } from "graphql";
import { print } from "graphql";
import { env } from "../env";
import {
  AuthError,
  AuthorizationError,
  isAuthErrorResponse,
  isAuthorizationErrorResponse,
  isAuthErrorHttpStatus,
  isAuthorizationErrorHttpStatus,
} from "../errors/AuthError";
import { createSupabaseServerClient } from "../supabase/supabase";

export async function serverGraphqlRequest<TResult = unknown, TVariables = Record<string, unknown>>(
  document: TypedDocumentNode<TResult, TVariables> | DocumentNode,
  variables?: TVariables,
): Promise<TResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const authToken = session?.access_token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const response = await fetch(env.API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: print(document),
      variables,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`GraphQL request failed: ${response.status} ${response.statusText}`, text);
    if (isAuthErrorHttpStatus(response.status)) {
      throw new AuthError("Authentication required");
    }
    if (isAuthorizationErrorHttpStatus(response.status)) {
      throw new AuthorizationError("Not authorized");
    }
    throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error("Failed to parse response");
  }

  if (result.errors && result.errors.length > 0) {
    const error = result.errors[0];
    const errorMessage = error.message ?? "An error occurred";
    const errorCode = error.extensions?.code;
    const statusCode = error.extensions?.statusCode;

    if (isAuthErrorResponse(errorCode, statusCode)) {
      throw new AuthError(errorMessage);
    }

    if (isAuthorizationErrorResponse(errorCode, statusCode)) {
      throw new AuthorizationError(errorMessage);
    }

    const customError = new Error(errorMessage);
    (customError as any).code = errorCode;
    (customError as any).statusCode = statusCode;

    throw customError;
  }

  return result.data as TResult;
}
