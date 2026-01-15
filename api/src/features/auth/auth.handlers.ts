import type { YogaContext } from "@/lib/graphql.ts";
import { AuthenticationError } from "@/lib/errors.ts";
import { SupabaseErrorHandler } from "@/lib/errors.ts";
import { env } from "@/lib/env.ts";
import type { ValidatedLogin, ValidatedSignup } from "./auth.types.ts";
import type { LoginResponse, SignupResponse } from "./auth.types.ts";

export async function loginHandler(
  transformedArgs: ValidatedLogin,
  context: YogaContext,
): Promise<LoginResponse> {
  const { email, password } = transformedArgs;
  const { supabase } = context;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new SupabaseErrorHandler(error);
  }

  if (!data.session || !data.user || !data.user.email) {
    throw new AuthenticationError("Failed to authenticate");
  }

  return {
    user: {
      id: data.user.id,
      email: data.user.email,
    },
  };
}

export async function signupHandler(
  transformedArgs: ValidatedSignup,
  context: YogaContext,
): Promise<SignupResponse> {
  const { email, password } = transformedArgs;
  const { supabase } = context;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${env.FRONTEND_URL}/auth/verify-email?next=/dashboard`,
    },
  });

  if (error) {
    throw new SupabaseErrorHandler(error);
  }

  if (!data.user || !data.user.email) {
    throw new AuthenticationError("Failed to create user");
  }

  if (data.user.email_confirmed_at && data.session) {
    return {
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      message: null,
    };
  }

  return {
    user: data.user.email_confirmed_at
      ? {
        id: data.user.id,
        email: data.user.email,
      }
      : null,
    message: "Please check your email to verify your account",
  };
}

export async function logoutHandler(
  _transformedArgs: unknown,
  context: YogaContext,
): Promise<boolean> {
  const { supabase } = context;

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new SupabaseErrorHandler(error);
  }

  return true;
}
