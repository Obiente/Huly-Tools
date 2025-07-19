import { MiddlewareHandler } from "hono";

export const errorHandler: MiddlewareHandler = async (c, next) => {
  try {
    await next();
  } catch (err: unknown) {
    console.error("API Error:", err);
    if (typeof err === "object" && err !== null) {
      const errorObj = err as { name?: string; message?: string; code?: number };
      if (errorObj.name === "ValidationError") {
        return c.json({
          error: "Validation failed",
          details: errorObj.message,
        }, 400);
      }
      if (errorObj.name === "MongoError" || errorObj.name === "MongoServerError") {
        return c.json({
          error: "Database error",
          message: errorObj.code === 11000 ? "Duplicate entry" : "Database operation failed",
        }, 500);
      }
      return c.json({
        error: "Internal server error",
        message: Deno.env.get("NODE_ENV") === "development" ? errorObj.message : "Something went wrong",
      }, 500);
    }
    return c.json({
      error: "Internal server error",
      message: "Something went wrong",
    }, 500);
  }
};
