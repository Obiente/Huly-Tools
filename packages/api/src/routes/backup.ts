import { Hono } from "hono";
import { HulyConnection } from "../lib/hulyConnection.ts";

declare const hulyConnection: HulyConnection;

const backup = new Hono();

// GET /api/backup - List all backups
backup.get("/", async (c) => {
  try {
    const result = await hulyConnection.listBackups();
    return c.json(result);
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// POST /api/backup - Create new backup
backup.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const { workspaceId } = body;
    if (!workspaceId) {
      return c.json({ error: "Missing workspaceId" }, 400);
    }
    await hulyConnection.createBackup(workspaceId);
    return c.json({ success: true }, { status: 201 });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// POST /api/backup/restore - Restore from backup
backup.post("/restore", async (c) => {
  try {
    const body = await c.req.json();
    const { backupId } = body;
    if (!backupId) {
      return c.json({ error: "Missing backupId" }, 400);
    }
    const result = await hulyConnection.restoreBackup(backupId);
    return c.json(result);
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

export default backup;
