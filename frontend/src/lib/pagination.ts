import z from "zod";
import { stringToInt } from "./utils";

export const paginationSchema = z.object({
  page: stringToInt
    .optional()
    .default(1)
    .refine((page) => page >= 1, "Numeric string must be greater than or equal to 1"),
});
