import z from "@zod";
import { stringToInt } from "./utils.ts";
import { PAGINATED_PAGE_SIZE } from "./constants.ts";

export const paginationSchema = z.object({
  page: stringToInt.optional().default(1).refine(
    (page) => page >= 1,
    "Numeric string must be greater than or equal to 1",
  ),
  pageSize: stringToInt.optional().default(
    PAGINATED_PAGE_SIZE,
  ).refine(
    (n) => n >= 1 && n <= 20,
    "Numeric string must be between 1 and 20",
  ),
});
