import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type { DocumentNode } from 'graphql';
import { print } from 'graphql';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function graphqlRequest<
  TResult = unknown,
  TVariables = Record<string, unknown>
>(
  document: TypedDocumentNode<TResult, TVariables> | DocumentNode,
  variables?: TVariables
): Promise<TResult> {
  const response = await fetch(`${API_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      query: print(document),
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0]?.message || "GraphQL error");
  }

  return result.data as TResult;
}

