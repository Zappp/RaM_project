import { z } from "zod";

const envSchema = z.object({
  SUPABASE_URL: z.url(),
  SUPABASE_ANON_KEY: z.string().trim().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().trim(), // TODO may remove (along with admin supabase client)
  API_URL: z.url(),
  FRONTEND_URL: z.url(),
});

function getEnv() {
  const rawEnv = {
    SUPABASE_URL: Deno.env.get("SUPABASE_URL"), // TODO merge definitions
    SUPABASE_ANON_KEY: Deno.env.get("SUPABASE_ANON_KEY"),
    SUPABASE_SERVICE_ROLE_KEY: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
    API_URL: Deno.env.get("API_URL"),
    FRONTEND_URL: Deno.env.get("FRONTEND_URL"),
  };

  const result = envSchema.safeParse(rawEnv);

  if (!result.success) {
    const prettified = z.prettifyError(result.error);
    throw new Error(`Invalid environment variables:\n${prettified}`);
  }

  return result.data;
}

export const env = getEnv();
