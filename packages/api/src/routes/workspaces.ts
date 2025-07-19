import { Hono } from "hono";
import { HulyConnection } from "../lib/hulyConnection.ts";

declare const hulyConnection: HulyConnection;

const workspaces = new Hono();

// GET /api/workspaces - List all workspaces
workspaces.get("/", async (c) => {
  try {
    const workspaces = await hulyConnection.listWorkspaces();
    return c.json(workspaces);
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// POST /api/workspaces - Create new workspace
workspaces.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const { name, description, owner } = body;
    if (!name || !owner) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    await hulyConnection.createWorkspace({ name, description, owner });
    return c.json({ success: true }, { status: 201 });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// PUT /api/workspaces/:id - Update workspace
workspaces.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    const workspace = await hulyConnection.updateWorkspace(id, updates);
    return c.json(workspace);
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// DELETE /api/workspaces/:id - Delete workspace
workspaces.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await hulyConnection.deleteWorkspace(id);
    return c.body(null, 204);
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

export default workspaces;
