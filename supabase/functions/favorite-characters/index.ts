import app from "shared/hono.ts";
import { WithAuth } from "shared/auth.ts";
import { WithValidation } from "shared/validation.ts";
import { camelizeKeys, handleRouteError, snakeifyKeys } from "shared/utils.ts";
import {
  addFavoriteCharacterSchema,
  deleteFavoriteCharacterByIdSchema,
  getFavoriteCharactersByRemoteIdSchema,
} from "./validationSchema.ts";
import { paginationSchema } from "shared/pagination.ts";
import { PAGINATED_PAGE_SIZE } from "shared/constants.ts";

// TODO add tasks (migration add, run, regenerate types)

const BASE_PATH = "/favorite-characters";

app.get(
  `${BASE_PATH}/by-remote-id`,
  WithAuth(),
  WithValidation("query", getFavoriteCharactersByRemoteIdSchema),
  async (context) => {
    const user = context.get("user");
    const supabase = context.get("supabase");

    try {
      const { remoteId: remoteIds } = context.req.valid("query");

      const { data, error } = await supabase
        .from("favorite_characters")
        .select("*")
        .eq("user_id", user.id)
        .in("remote_id", remoteIds);

      if (error) throw error;

      return context.json(camelizeKeys(data));
    } catch (error) {
      return handleRouteError(error, context);
    }
  },
);

app.get(
  BASE_PATH,
  WithAuth(),
  WithValidation("query", paginationSchema),
  async (context) => {
    const user = context.get("user");
    const supabase = context.get("supabase");

    try {
      const { page } = context.req.valid("query");
      const offset = (page - 1) * PAGINATED_PAGE_SIZE;

      const { data, error, count } = await supabase
        .from("favorite_characters")
        .select("*", { count: "exact" })
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(offset, offset + PAGINATED_PAGE_SIZE - 1);

      if (error) throw error;

      const totalCount = count || 0;
      const totalPages = Math.ceil(totalCount / PAGINATED_PAGE_SIZE);

      return context.json({
        results: camelizeKeys(data),
        info: {
          count: totalCount,
          pages: totalPages,
          next: page < totalPages ? page + 1 : null,
          prev: page > 1 ? page - 1 : null,
        },
      });
    } catch (error) {
      return handleRouteError(error, context);
    }
  },
);

app.post(
  BASE_PATH,
  WithAuth(),
  WithValidation("json", addFavoriteCharacterSchema),
  async (context) => {
    const supabase = context.get("supabase");
    const user = context.get("user");

    try {
      const requestData = context.req.valid(
        "json",
      );

      const { data, error } = await supabase
        .from("favorite_characters")
        .insert({
          user_id: user.id,
          ...snakeifyKeys(requestData),
        })
        .select()
        .single();

      if (error) throw error;

      return context.json(camelizeKeys(data));
    } catch (error) {
      return handleRouteError(error, context);
    }
  },
);

app.delete(
  `${BASE_PATH}/:id`,
  WithAuth(),
  WithValidation("param", deleteFavoriteCharacterByIdSchema),
  async (context) => {
    const user = context.get("user");
    const supabase = context.get("supabase");

    try {
      const { id } = context.req.valid("param");

      const { data, error } = await supabase
        .from("favorite_characters")
        .delete()
        .eq("user_id", user.id)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return context.json(camelizeKeys(data));
    } catch (error) {
      return handleRouteError(error, context);
    }
  },
);

Deno.serve(app.fetch);
