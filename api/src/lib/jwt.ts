import { supabase } from "./supabase.ts";
import type { GraphQLContext } from "./types.ts";

interface CachedUser {
  user: GraphQLContext["user"];
  expiresAt: number;
}

const cache = new Map<string, CachedUser>();
const CACHE_TTL_MS = 5 * 60 * 1000;

function cleanupCache() {
  const now = Date.now();
  for (const [token, cached] of cache.entries()) {
    if (cached.expiresAt < now) {
      cache.delete(token);
    }
  }
}

setInterval(cleanupCache, 60 * 1000);

export async function validateJWT(
  token: string
): Promise<GraphQLContext["user"]> {
  const cached = cache.get(token);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.user;
  }

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return null;
    }

    const userData = {
      id: user.id,
      email: user.email,
    };

    cache.set(token, {
      user: userData,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return userData;
  } catch {
    return null;
  }
}

