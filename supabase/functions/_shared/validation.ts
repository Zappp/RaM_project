import { flattenError, ZodType } from "@zod";
import { zValidator } from "@hono/zod-validator";
import { ValidationTargets } from "@hono/hono";
import { HTTPException } from "@hono/hono/http-exception";

export const WithValidation = <
  Target extends keyof ValidationTargets,
  TZodType extends ZodType,
>(
  target: Target,
  schema: TZodType,
) =>
  zValidator(target, schema, (result, context) => {
    if (!result.success) {
      const res = context.json({ error: flattenError(result.error) }, 400);
      throw new HTTPException(400, { res });
    }
  });
