import { z } from "zod";
import { ValidationError } from "./errors.ts";
import type { YogaContext } from "@/lib/graphql.ts";
import { AuthenticationError } from "@/lib/errors.ts";

export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => {
      const path = issue.path.join(".");
      return path ? `${path}: ${issue.message}` : issue.message;
    });
    throw new ValidationError(errors.join(", "));
  }

  return result.data;
}

export function validateOptional<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): T | undefined {
  if (data === undefined || data === null) {
    return undefined;
  }
  return validate(schema, data);
}

export function requireAuth(yogaContext: YogaContext): string {
  const { user } = yogaContext;
  if (!user) {
    throw new AuthenticationError();
  }
  return user.accessToken;
}
