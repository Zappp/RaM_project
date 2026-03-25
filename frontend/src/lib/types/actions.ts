import type { ZodType } from "zod";
import type { handleActionError } from "../error";

export type AsyncActionResult<D, TZodType extends ZodType> = Promise<
  { data: D; error: null; success: true } | ReturnType<typeof handleActionError<TZodType>>
>;
