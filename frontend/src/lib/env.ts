"server-only";

import { z } from "zod";

const envSchema = z.object({
  SUPABASE_URL: z.url().optional(),
  SUPABASE_ANON_KEY: z.string().trim().optional(),
});

function getEnv() {
  const rawEnv = {
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
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
