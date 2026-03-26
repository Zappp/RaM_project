"server-only";

import { z } from "zod";

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

  return result.data;
}

export const env = getEnv();
