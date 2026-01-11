import type { SupabaseClient } from "@supabase/supabase-js";
import type { CachedUser, User } from "./types/auth.ts";

const cache = new Map<string, CachedUser>(); // TODO (redis, KV)
const CACHE_TTL_MS = 60 * 1000;

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
  token: string,
  supabase: SupabaseClient
): Promise<User | null> {
  const cached = cache.get(token);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.user;
  }

  try {
    const { data, error } = await supabase.auth.getClaims(token);

    if (error || !data?.claims) {
      return null;
    }

    const userData: User = {
      id: data.claims.sub,
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
