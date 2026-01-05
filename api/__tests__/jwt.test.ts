import { assertEquals } from "@std/assert";

Deno.test({
  name: "validateJWT - returns null for invalid token",
  async fn() {
    Deno.env.set("SUPABASE_URL", "https://test.supabase.co");
    Deno.env.set("SUPABASE_ANON_KEY", "test-key");

    const { validateJWT } = await import("../lib/jwt.ts");
    const result = await validateJWT("invalid-token");
    assertEquals(result, null);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

