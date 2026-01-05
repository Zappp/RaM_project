import { z } from "zod";

const envSchema = z.object({
  SUPABASE_URL: z.url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  PORT: z.coerce.number().optional(),
  API_URL: z.url().optional(),
  FRONTEND_URL: z.url().optional(),
});

function getEnv() {
  const rawEnv = {
    SUPABASE_URL: Deno.env.get("SUPABASE_URL"),
    SUPABASE_ANON_KEY: Deno.env.get("SUPABASE_ANON_KEY"),
    SUPABASE_SERVICE_ROLE_KEY: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
    PORT: Deno.env.get("PORT"),
    API_URL: Deno.env.get("API_URL"),
    FRONTEND_URL: Deno.env.get("FRONTEND_URL"),
  };

  const result = envSchema.safeParse(rawEnv);

  if (!result.success) {
    const prettified = z.prettifyError(result.error);
    throw new Error(`Invalid environment variables:\n${prettified}`);
  }

  return {
    ...result.data,
    PORT: result.data.PORT ?? 8000,
    API_URL: result.data.API_URL ?? "http://localhost:8000",
    FRONTEND_URL: result.data.FRONTEND_URL ?? "http://localhost:3000",
  };
}

export const env = getEnv();
