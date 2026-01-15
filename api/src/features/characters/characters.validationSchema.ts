import { z } from "zod";

export const charactersPaginationSchema = z.object({
  page: z.number().int().positive().optional(),
});
