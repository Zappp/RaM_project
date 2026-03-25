import { AuthError, FunctionsHttpError } from "@supabase/supabase-js";
import { unstable_rethrow } from "next/navigation";
import { flattenError, ZodError, type ZodType, type z } from "zod";

export function isValidationError<T>(error: unknown): error is z.core.$ZodFlattenedError<T> {
  return (
    typeof error === "object" &&
    error !== null &&
    "formErrors" in error &&
    Array.isArray(error.formErrors) &&
    "fieldErrors" in error &&
    typeof error.fieldErrors === "object"
  );
}

export async function handleActionError<TZodType extends ZodType>(
  error: unknown,
  fallbackMessage: string,
) {
  unstable_rethrow(error);

  if (error instanceof ZodError) {
    const flattenedError = flattenError<z.infer<TZodType>>(error as ZodError<z.infer<TZodType>>);
    return { data: null, error: flattenedError, success: false as const };
  }

  if (error instanceof FunctionsHttpError) {
    const status = error.context.status;
    if (status === 401) {
      return {
        data: null,
        error: {
          formErrors: ["Unauthorized"],
          fieldErrors: null,
        } as z.core.$ZodFlattenedError<null, string>,
        success: false as const,
      };
    }

    const body: { error: unknown } = await error.context.json().catch(() => ({ error: null }));
    if (status === 400 && isValidationError<z.infer<TZodType>>(body.error)) {
      return { data: null, error: body.error, success: false as const };
    }
  }

  if (error instanceof AuthError) {
    return {
      data: null,
      error: {
        formErrors: [error.message],
        fieldErrors: null,
      } as z.core.$ZodFlattenedError<null, string>,
      success: false as const,
    };
  }

  return {
    data: null,
    error: {
      formErrors: [fallbackMessage],
      fieldErrors: null,
    } as z.core.$ZodFlattenedError<null, string>,
    success: false as const,
  };
}
