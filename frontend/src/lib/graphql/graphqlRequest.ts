"server-only";

import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { DocumentNode } from "graphql";
import { print } from "graphql";
import { API_URL } from "../constants";
import { createSupabaseServerClient } from "../supabase";

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

  const response = await fetch(API_URL, {
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
    throw new Error(
      `GraphQL request failed: ${response.status} ${response.statusText}`
    );
  }

  const result = await response.json();

  if (!result) {
    console.error("Empty response from GraphQL endpoint");
    throw new Error("Empty response from GraphQL endpoint");
  }

  if (result.errors && result.errors.length > 0) {
    const error = result.errors[0];
    const errorMessage = error.message ?? "An error occurred";
    const errorCode = error.extensions?.code;

    const customError = new Error(errorMessage);
    (customError as any).code = errorCode;

    throw customError;
  }

  if (!result.data) {
    console.error("No data in GraphQL response", result);
    throw new Error("No data in GraphQL response");
  }

  return result.data as TResult;
}
