import { Context } from "hono";
import { supabase } from "@/lib/supabase.ts";
import { setCookie, getCookie, clearCookie } from "@/lib/cookies.ts";
import { validateJWT } from "@/lib/jwt.ts";
import { AuthenticationError, ValidationError } from "@/lib/errors.ts";
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

      return await Promise.resolve({
        id: context.user.id,
        email: context.user.email || "",
        createdAt: new Date().toISOString(),
      });
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
      });

      if (error) {
        console.error("Signup error:", error.message);
        throw new ValidationError(error.message);
      }

      if (!data.user || !data.session) {
        throw new ValidationError("Failed to create user");
      }

      const token = data.session.access_token;
      const cookieValue = setCookie(AUTH_COOKIE_NAME, token);
      context.context.header("Set-Cookie", cookieValue);

      console.info(`User signed up: ${data.user.id}`);

      return {
        user: {
          id: data.user.id,
          email: data.user.email || "",
          createdAt: data.user.created_at || new Date().toISOString(),
        },
        token,
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
        },
        token,
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
  },
};

export async function createAuthContext(context: Context): Promise<GraphQLContext> {
  const user = await getCurrentUser(context);
  return { context, user };
}
