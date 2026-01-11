import { z } from "zod";
import { config as loadEnv } from "dotenv";
import { resolve } from "path";

loadEnv({ path: resolve(process.cwd(), "../.env") });

const envSchema = z.object({
  SUPABASE_URL: z.url(),
  SUPABASE_ANON_KEY: z.string().trim().min(1),
  API_URL: z.url(),
  FRONTEND_URL: z.url(),
});

function getEnv() {
  const rawEnv = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    API_URL: process.env.API_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
  };

  const result = envSchema.safeParse(rawEnv);

  if (!result.success) {
    const prettified = z.prettifyError(result.error);
    throw new Error(`Invalid environment variables:\n${prettified}`);
  }

  return {
    SUPABASE_URL: result.data.SUPABASE_URL,
    SUPABASE_ANON_KEY: result.data.SUPABASE_ANON_KEY,
    API_URL: result.data.API_URL,
    FRONTEND_URL: result.data.FRONTEND_URL,
  };
}

export const env = getEnv();
