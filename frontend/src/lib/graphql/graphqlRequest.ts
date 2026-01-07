"server-only";

import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { DocumentNode } from "graphql";
import { print } from "graphql";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_URL } from "../constants";

export async function serverGraphqlRequest<
  TResult = unknown,
  TVariables = Record<string, unknown>
>(
  document: TypedDocumentNode<TResult, TVariables> | DocumentNode,
  variables?: TVariables
): Promise<TResult> {
  const cookieStore = cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    body: JSON.stringify({
      query: print(document),
      variables,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`GraphQL request failed: ${response.status} ${response.statusText}`, text);
    throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();

  if (!result) {
    console.error("Empty response from GraphQL endpoint");
    throw new Error("Empty response from GraphQL endpoint");
  }

  if (result.errors && result.errors.length > 0) {
    const error = result.errors[0];
    const errorMessage = error.message ?? "An error occurred";
    
    if (errorMessage === "Authentication required") {
      redirect("/api/auth/logout");
    }
    
    throw new Error(errorMessage);
  }

  if (!result.data) {
    console.error("No data in GraphQL response", result);
    throw new Error("No data in GraphQL response");
  }

  return result.data as TResult;
}
