import { serverGraphqlRequest } from '../graphql/graphqlRequest';
import { MeDocument } from '../types/generated';
import type { MeQuery } from '../types/generated';
import type { User } from '../types/user';

export async function getUser(): Promise<User | null> {
  try {
    const data = await serverGraphqlRequest<MeQuery>(MeDocument);
    return data.me ?? null;
  } catch {
    return null;
  }
}

