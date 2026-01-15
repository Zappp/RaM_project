import type { YogaContext } from "@/lib/graphql.ts";
import { AuthenticationError, ValidationError } from "@/lib/errors.ts";
import { SupabaseErrorHandler } from "@/lib/errors.ts";
import { env } from "@/lib/env.ts";

export const authResolvers = {
  Query: {
    health: () => "ok",
  },
  Mutation: {
    async login(
      _parent: unknown,
      args: { email: string; password: string },
      yogaContext: YogaContext
    ) {
      const { email, password } = args;

      if (!email || !password) {
        throw new ValidationError("Email and password are required");
      }

      const { data, error } =
        await yogaContext.supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        throw new SupabaseErrorHandler(error);
      }

      if (!data.session || !data.user) {
        throw new AuthenticationError("Failed to authenticate");
      }

      return {
        user: {
          id: data.user.id,
          email: data.user.email,
        },
      };
    },

    async signup(
      _parent: unknown,
      args: { email: string; password: string },
      yogaContext: YogaContext
    ) {
      const { email, password } = args;

      if (!email || !password) {
        throw new ValidationError("Email and password are required");
      }

      const { data, error } = await yogaContext.supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${env.FRONTEND_URL}/auth/verify-email?next=/dashboard`,
        },
      });

      if (error) {
        throw new SupabaseErrorHandler(error);
      }

      if (!data.user) {
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
    },

    async logout(_parent: unknown, _args: unknown, yogaContext: YogaContext) {
      const { user, supabase } = yogaContext;
      if (!user) {
        throw new AuthenticationError("User not found");
      }

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new SupabaseErrorHandler(error);
      }

      return true;
    },
  },
};
