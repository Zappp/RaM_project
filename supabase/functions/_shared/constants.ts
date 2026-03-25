import { PgError } from "./types/utils.ts";

export const PAGINATED_PAGE_SIZE = 10;
export const PG_ERROR_MAP: Record<string, PgError> = {
  "23505": {
    status: 409,
    message: "Resource already exists",
  },

  "23503": {
    status: 400,
    message: "Invalid reference provided",
  },

  "23514": {
    status: 400,
    message: "Invalid value",
  },

  "23502": {
    status: 400,
    message: "Missing required fields",
  },

  "22P02": {
    status: 400,
    message: "Invalid input format",
  },

  "42501": {
    status: 401,
    message: "Unauthorized"
  }
};
