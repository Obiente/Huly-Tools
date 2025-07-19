import { Hono } from "hono";
import { hulyConnection } from "../main.ts";

const accounts = new Hono();

// GET /api/accounts - List all accounts
accounts.get("/", async (c) => {
  try {
    const result = await hulyConnection.listAccounts();
    console.log("Accounts fetched successfully:", result);
    return c.json(result);
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// POST /api/accounts - Create new account
accounts.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const { email, first, last, password } = body;
    if (!email || !first || !last || !password) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    await hulyConnection.createAccount({ email, first, last, password });
    return c.json({ success: true }, { status: 201 });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// PUT /api/accounts/:id - Update account
accounts.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    const account = await hulyConnection.updateAccount(id, updates);
    return c.json(account);
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// DELETE /api/accounts/:id - Delete account
accounts.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await hulyConnection.deleteAccount(id);
    return c.body(null, 204);
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

export default accounts;
