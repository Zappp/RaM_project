"server-only";

import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { DocumentNode } from "graphql";
import { print } from "graphql";
import { env } from "../env";
import { createSupabaseServerClient } from "../supabase";
import { AuthError, isAuthErrorResponse } from "../errors/AuthError";

export async function serverGraphqlRequest<
  TResult = unknown,
  TVariables = Record<string, unknown>
>(
  document: TypedDocumentNode<TResult, TVariables> | DocumentNode,
  variables?: TVariables
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
    console.error(
      `GraphQL request failed: ${response.status} ${response.statusText}`,
      text
    );
    if (isAuthErrorResponse(response.status)) {
      throw new AuthError("Authentication required");
    }
    throw new Error(
      `GraphQL request failed: ${response.status} ${response.statusText}`
    );
  }

  const result = await response.json();

  if (result.errors && result.errors.length > 0) {
    const error = result.errors[0];
    const errorMessage = error.message ?? "An error occurred";
    const errorCode = error.extensions?.code;
    const statusCode = error.extensions?.statusCode;

    if (isAuthErrorResponse(response.status, errorCode, statusCode, errorMessage)) {
      throw new AuthError(errorMessage);
    }

    const customError = new Error(errorMessage);
    (customError as any).code = errorCode;
    (customError as any).statusCode = statusCode;

    throw customError;
  }

  return result.data as TResult;
}
