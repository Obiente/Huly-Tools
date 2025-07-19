import { MiddlewareHandler } from "hono";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const apiKey = c.req.header("X-API-Key") || c.req.query("apiKey");
  const expectedApiKey = Deno.env.get("API_SECRET");

  if (!expectedApiKey) {
    return c.json({ error: "API authentication not configured" }, 500);
  }
  if (!apiKey) {
    return c.json({ error: "API key required" }, 401);
  }
  if (apiKey !== expectedApiKey) {
    return c.json({ error: "Invalid API key" }, 403);
  }
  await next();
};
