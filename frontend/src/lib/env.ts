"server-only";

import { resolve } from "node:path";
import { config as loadEnv } from "dotenv";
import { z } from "zod";

loadEnv({ path: resolve(process.cwd(), "../.env") });

const envSchema = z.object({
  SUPABASE_URL: z.url(),
  SUPABASE_ANON_KEY: z.string().trim().min(1),
});

function getEnv() {
  const rawEnv = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  };

  const result = envSchema.safeParse(rawEnv);

  if (!result.success) {
    const prettified = z.prettifyError(result.error);
    throw new Error(`Invalid environment variables:\n${prettified}`);
  }

  return {
    SUPABASE_URL: result.data.SUPABASE_URL,
    SUPABASE_ANON_KEY: result.data.SUPABASE_ANON_KEY,
  };
}

export const env = getEnv();
