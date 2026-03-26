import { prettifyError, z } from "@zod";
import { CamelizeKeys, Milliseconds, SnakeifyKeys } from "./types/utils.ts";
import { PostgrestError } from "@supabase";
import { PG_ERROR_MAP } from "./constants.ts";
import { HTTPException } from "@hono/hono/http-exception";

export const stringToInt = z.codec(
  z.string().regex(z.regexes.integer),
  z.int(),
  {
    decode: (str) => Number.parseInt(str, 10),
    encode: (num) => num.toString(),
  },
);

export function camelizeKeys<T>(obj: T): CamelizeKeys<T> {
  if (Array.isArray(obj)) {
    return obj.map(camelizeKeys) as CamelizeKeys<T>;
  }

  if (obj !== null && typeof obj === "object") {
    const result = {} as Record<string, unknown>;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const camelKey = key.replace(
          /_([a-z])/g,
          (_, letter) => letter.toUpperCase(),
        );
        result[camelKey] = camelizeKeys((obj as Record<string, unknown>)[key]);
      }
    }
    return result as CamelizeKeys<T>;
  }

  return obj as CamelizeKeys<T>;
}

export function snakeifyKeys<T>(obj: T): SnakeifyKeys<T> {
  if (Array.isArray(obj)) {
    return obj.map(snakeifyKeys) as SnakeifyKeys<T>;
  }

  if (obj !== null && typeof obj === "object") {
    const result = {} as Record<string, unknown>;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const snakeKey = key.replace(
          /[A-Z]/g,
          (letter) => `_${letter.toLowerCase()}`,
        );
        result[snakeKey] = snakeifyKeys(
          (obj as Record<string, unknown>)[key],
        );
      }
    }
    return result as SnakeifyKeys<T>;
  }

  return obj as SnakeifyKeys<T>;
}

function mapPostgresError(code: string) {
  return (
    PG_ERROR_MAP[code] ?? {
      status: 500,
      message: "Database error",
    }
  );
}

export function handleRouteError(error: unknown) {
  console.error(error);
  if (error instanceof PostgrestError) {
    const { status, message } = mapPostgresError(error.code);
    throw new HTTPException(status, { message: message });
  }

  throw new HTTPException(500, {
    message: error instanceof Error ? error.message : "Internal server error",
  });
}

export function getEnv() {
  const envSchema = z.object({
    SUPABASE_URL: z.url(),
    SUPABASE_ANON_KEY: z.string().trim().min(1),
    SUPABASE_SERVICE_ROLE_KEY: z.string().trim().min(1),
    FRONTEND_URL: z.url(),
  });

  const rawEnv = {
    SUPABASE_URL: Deno.env.get("SUPABASE_URL"),
    SUPABASE_ANON_KEY: Deno.env.get("SUPABASE_ANON_KEY"),
    SUPABASE_SERVICE_ROLE_KEY: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
    FRONTEND_URL: Deno.env.get("FRONTEND_URL"),
  };

  const { success, error, data } = envSchema.safeParse(rawEnv);
  if (!success) throw Error(prettifyError(error));
  return data;
}

export function ms(
  value: number,
  unit: "ms" | "s" | "m" | "h" | "d" = "ms",
): Milliseconds {
  switch (unit) {
    case "ms":
      return value as Milliseconds;
    case "s":
      return (value * 1000) as Milliseconds;
    case "m":
      return (value * 60_000) as Milliseconds;
    case "h":
      return (value * 3_600_000) as Milliseconds;
    case "d":
      return (value * 86_400_000) as Milliseconds;
  }
}
