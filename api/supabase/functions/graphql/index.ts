import { Hono } from "hono";
import { cors } from "hono/cors";
import { supabase } from "../lib/supabase.ts";

const app = new Hono();

// CORS middleware
app.use("*", cors({
  origin: "*", // TODO: Configure proper origins in production
  credentials: true,
  allowMethods: ["GET", "POST", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Supabase connection test endpoint
app.get("/health/supabase", async (c) => {
  try {
    // Test connection by checking auth endpoint (doesn't require specific tables)
    const { data, error } = await supabase.auth.getSession();
    
    // If we get here without throwing, connection is working
    // (error is expected if no session, but that's fine for connection test)
    return c.json({
      status: "ok",
      message: "Successfully connected to Supabase",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Supabase connection test failed:", error);
    return c.json(
      {
        status: "error",
        message: "Supabase connection test failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});

// GraphQL endpoint (to be implemented)
app.post("/graphql", async (c) => {
  return c.json({ message: "GraphQL endpoint - coming soon" });
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: "Not found" }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error("Error:", err);
  return c.json({ error: "Internal server error" }, 500);
});

Deno.serve({
  port: parseInt(Deno.env.get("PORT") || "8000"),
  onListen: ({ port }) => {
    console.log(`Server running on port ${port}`);
  },
}, app.fetch);

