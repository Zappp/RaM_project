import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";

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

