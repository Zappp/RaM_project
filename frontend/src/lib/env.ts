import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().trim().min(1),
  NEXT_PUBLIC_API_URL: z.url(),
  NEXT_PUBLIC_FRONTEND_URL: z.url(),
});

function getEnv() {
  const rawEnv = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
  };

  const result = envSchema.safeParse(rawEnv);

  if (!result.success) {
    const prettified = z.prettifyError(result.error);
    throw new Error(`Invalid environment variables:\n${prettified}`);
  }

  return {
    SUPABASE_URL: result.data.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_ANON_KEY: result.data.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    API_URL: result.data.NEXT_PUBLIC_API_URL,
    FRONTEND_URL: result.data.NEXT_PUBLIC_FRONTEND_URL,
  };
}

export const env = getEnv();
