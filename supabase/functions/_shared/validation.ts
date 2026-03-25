import { flattenError, ZodType } from "@zod";
import { zValidator } from "@hono/zod-validator";
import { ValidationTargets } from "@hono/hono";

export const WithValidation = <
  Target extends keyof ValidationTargets,
  TZodType extends ZodType,
>(
  target: Target,
  schema: TZodType,
) =>
  zValidator(target, schema, (result, context) => {
    if (!result.success) {
      return context.json({ error: flattenError(result.error) }, 400);
    }
  });
