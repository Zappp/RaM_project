import { createHonoServer } from "./lib/honoServer.ts";

const app = createHonoServer();

const port = parseInt(Deno.env.get("API_PORT") || "4000", 10); // TODO read from env

console.log(`Server running on http://localhost:${port}`);

Deno.serve({ port }, (req: Request) => {
  return app.fetch(req);
});
