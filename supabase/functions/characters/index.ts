import app from "shared/hono.ts";
import { paginationSchema } from "shared/pagination.ts";
import { handleRouteError } from "shared/utils.ts";
import { WithValidation } from "shared/validation.ts";
import { CharactersService } from "./services/characters.ts";
import { RemoteApiClientService } from "./services/remoteApiClient.ts";
import { RepositoryService } from "./services/repository.ts";

const BASE_PATH = "/characters";

app.get(
  BASE_PATH,
  WithValidation("query", paginationSchema),
  async (context) => {
    try {
      const supabase = context.get("supabase");
      const supabaseAdmin = context.get("supabaseAdmin");
      const { page, pageSize } = context.req.valid("query");

      const repo = new RepositoryService(supabase, supabaseAdmin);
      const remote = new RemoteApiClientService(
        "https://rickandmortyapi.com/api",
      );
      const service = new CharactersService(repo, remote);

      const { results, pageInfo } = await service.getPage(page, pageSize);

      return context.json({
        results: results.map(({ id, name, image, status, species }) => ({
          remoteId: id,
          name,
          image: image || null,
          status: status || null,
          species: species || null,
        })),
        info: pageInfo,
      });
    } catch (error) {
      return handleRouteError(error, context);
    }
  },
);

Deno.serve(app.fetch);
