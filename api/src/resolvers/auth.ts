import { Context } from "hono";
import { supabase } from "@/lib/supabase.ts";
import { setCookie, getCookie, clearCookie } from "@/lib/cookies.ts";
import { validateJWT } from "@/lib/jwt.ts";
import { AuthenticationError, ValidationError } from "@/lib/errors.ts";
import { env } from "@/lib/env.ts";
import type { GraphQLContext } from "@/lib/types/graphql.ts";
import { AUTH_COOKIE_NAME } from "@/lib/constants.ts";
import type { AuthProps, User } from "@/lib/types/auth.ts";

export async function getCurrentUser(context: Context): Promise<User | null> {
  const cookieHeader = context.req.header("Cookie") || null;
  const token = getCookie(cookieHeader, AUTH_COOKIE_NAME);

  if (!token) {
    return null;
  }

  const user = await validateJWT(token);

  if (!user) {
    const cookieValue = clearCookie(AUTH_COOKIE_NAME);
    context.header("Set-Cookie", cookieValue);
    return null;
  }

  return user;
}

export const authResolvers = {
  Query: {
    me: (_: unknown, _args: unknown, context: GraphQLContext) => {
      if (!context.user) {
        return null;
      }

      const user = context.user;
      return {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
      };
    },
  },
  Mutation: {
    signup: async (_: unknown, props: AuthProps, _context: GraphQLContext) => {
      const { email, password } = props;

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

      return {
        id: data.user.id,
        email: data.user.email,
        emailVerified:
          data.user.user_metadata?.email_verified === undefined
            ? true
            : data.user.user_metadata?.email_verified,
      };
    },

    login: async (_: unknown, props: AuthProps, context: GraphQLContext) => {
      const { email, password } = props;

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
          email: data.user.email,
          emailVerified: Boolean(data.user.user_metadata.email_verified),
        },
        token,
      };
    },

    logout: async (_: unknown, __: unknown, context: GraphQLContext) => {
      const cookieHeader = context.context.req.header("Cookie") || null;
      const token = getCookie(cookieHeader, AUTH_COOKIE_NAME);
      const cookieValue = clearCookie(AUTH_COOKIE_NAME);

      context.context.header("Set-Cookie", cookieValue);

      if (token) {
        try {
          const user = await validateJWT(token);
          if (user) {
            try {
              const { error } = await supabase.auth.admin.signOut(token);
              if (error) {
                console.error("Supabase signout error:", error.message);
              } else {
                console.info(`User logged out: ${user.id}`);
              }
            } catch (error) {
              console.error("Supabase signout error:", error);
            }
          }
        } catch (error) {
          console.error("Token validation error during logout:", error);
        }
      }

      return true;
    },
  },
};
