import { validate } from "./validation.ts";
import { z } from "zod";

const envSchema = z.object({
  SUPABASE_URL: z.url(),
  SUPABASE_ANON_KEY: z.string().trim().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().trim().min(1),
  API_URL: z.url(),
  FRONTEND_URL: z.url(),
});

function getEnv(): ValidatedEnv {
  const rawEnv = {
    SUPABASE_URL: Deno.env.get("SUPABASE_URL"),
    SUPABASE_ANON_KEY: Deno.env.get("SUPABASE_ANON_KEY"),
    SUPABASE_SERVICE_ROLE_KEY: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
    API_URL: Deno.env.get("API_URL"),
    FRONTEND_URL: Deno.env.get("FRONTEND_URL"),
  };

  return validate(envSchema, rawEnv);
}

// TODO instantiate in hono context (?)

export const env = getEnv();
export type ValidatedEnv = z.infer<typeof envSchema>;
