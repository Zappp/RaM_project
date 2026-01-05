import { Context } from "hono";
import { supabase } from "@/lib/supabase.ts";
import { setCookie, getCookie, clearCookie } from "@/lib/cookies.ts";
import { validateJWT } from "@/lib/jwt.ts";
import { AuthenticationError, ValidationError } from "@/lib/errors.ts";
import { env } from "@/lib/env.ts";
import type { GraphQLContext } from "@/lib/types.ts";

const AUTH_COOKIE_NAME = "auth-token";

async function getCurrentUser(context: Context): Promise<GraphQLContext["user"]> {
  const cookieHeader = context.req.header("Cookie") || null;
  const token = getCookie(cookieHeader, AUTH_COOKIE_NAME);

  if (!token) {
    return null;
  }

  return await validateJWT(token);
}

export const authResolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: GraphQLContext) => {
      if (!context.user) {
        throw new AuthenticationError();
      }

      const { data: userData } = await supabase.auth.getUser();
      
      return {
        id: context.user.id,
        email: context.user.email || "",
        createdAt: new Date().toISOString(),
        emailVerified: userData.user?.email_confirmed_at !== null || false,
      };
    },
  },
  Mutation: {
    signup: async (
      _: unknown,
      args: { email: string; password: string },
      context: GraphQLContext
    ) => {
      const { email, password } = args;

      if (!email || !password) {
        throw new ValidationError("Email and password are required");
      }

      if (password.length < 6) {
        throw new ValidationError("Password must be at least 6 characters");
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${env.API_URL}/auth/callback`,
        },
      });

      if (error) {
        console.error("Signup error:", error.message);
        throw new ValidationError(error.message);
      }

      if (!data.user) {
        throw new ValidationError("Failed to create user");
      }

      const requiresEmailVerification = !data.session;
      let token: string | null = null;

      if (data.session) {
        token = data.session.access_token;
        const cookieValue = setCookie(AUTH_COOKIE_NAME, token);
        context.context.header("Set-Cookie", cookieValue);
      }

      console.info(`User signed up: ${data.user.id}${requiresEmailVerification ? " (email verification required)" : ""}`);

      return {
        user: {
          id: data.user.id,
          email: data.user.email || "",
          createdAt: data.user.created_at || new Date().toISOString(),
          emailVerified: data.user.email_confirmed_at !== null,
        },
        token,
        requiresEmailVerification,
      };
    },

    login: async (
      _: unknown,
      args: { email: string; password: string },
      context: GraphQLContext
    ) => {
      const { email, password } = args;

      if (!email || !password) {
        throw new ValidationError("Email and password are required");
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error.message);
        throw new AuthenticationError("Invalid email or password");
      }

      if (!data.user || !data.session) {
        throw new AuthenticationError("Failed to authenticate");
      }

      const token = data.session.access_token;
      const cookieValue = setCookie(AUTH_COOKIE_NAME, token);
      context.context.header("Set-Cookie", cookieValue);

      console.info(`User logged in: ${data.user.id}`);

      return {
        user: {
          id: data.user.id,
          email: data.user.email || "",
          createdAt: data.user.created_at || new Date().toISOString(),
          emailVerified: data.user.email_confirmed_at !== null,
        },
        token,
        requiresEmailVerification: false,
      };
    },

    logout: async (_: unknown, __: unknown, context: GraphQLContext) => {
      const cookieHeader = context.context.req.header("Cookie") || null;
      const token = getCookie(cookieHeader, AUTH_COOKIE_NAME);

      if (token) {
        const user = await validateJWT(token);
        if (user) {
          console.info(`User logged out: ${user.id}`);
        }
      }

      const cookieValue = clearCookie(AUTH_COOKIE_NAME);
      context.context.header("Set-Cookie", cookieValue);

      return true;
    },

    resendVerificationEmail: async (
      _: unknown,
      args: { email: string },
      context: GraphQLContext
    ) => {
      const { email } = args;

      if (!email) {
        throw new ValidationError("Email is required");
      }

      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${env.API_URL}/auth/callback`,
        },
      });

      if (error) {
        console.error("Resend verification email error:", error.message);
        throw new ValidationError(error.message);
      }

      console.info(`Verification email resent to: ${email}`);

      return true;
    },

    verifyEmail: async (
      _: unknown,
      args: { token: string },
      context: GraphQLContext
    ) => {
      const { token } = args;

      if (!token) {
        throw new ValidationError("Token is required");
      }

      const user = await validateJWT(token);

      if (!user) {
        throw new AuthenticationError("Invalid or expired token");
      }

      const cookieValue = setCookie(AUTH_COOKIE_NAME, token);
      context.context.header("Set-Cookie", cookieValue);

      console.info(`User email verified and logged in: ${user.id}`);

      return {
        user: {
          id: user.id,
          email: user.email || "",
          createdAt: new Date().toISOString(),
          emailVerified: true,
        },
        token,
        requiresEmailVerification: false,
      };
    },
  },
};

export async function createAuthContext(context: Context): Promise<GraphQLContext> {
  const user = await getCurrentUser(context);
  return { context, user };
}
