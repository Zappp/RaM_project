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

  const response = await fetch(`${API_URL}/graphql`, {
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

  const result = await response.json();

  if (result.errors && result.errors.length > 0) {
    const error = result.errors[0];
    const errorMessage = error.message ?? "An error occurred";
    
    if (errorMessage === "Authentication required") {
      redirect("/api/auth/logout");
    }
    
    throw new Error(errorMessage);
  }

  return result.data as TResult;
}
