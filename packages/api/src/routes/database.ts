import { Hono } from "hono";
import { HulyConnection } from "../lib/hulyConnection.ts";

declare const hulyConnection: HulyConnection;

const db = new Hono();

db.post("/migrate", async (c) => {
  try {
    const result = await hulyConnection.runMigrations();
    return c.json(result);
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

db.get("/migration-status", async (c) => {
  try {
    const status = await hulyConnection.getMigrationStatus();
    return c.json(status);
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

db.post("/index", async (c) => {
  try {
    const result = await hulyConnection.rebuildIndexes();
    return c.json(result);
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

db.post("/index/create", async (c) => {
  try {
    const result = await hulyConnection.createEssentialIndexes();
    return c.json(result);
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

db.post("/index/recreate", async (c) => {
  try {
    const result = await hulyConnection.recreateIndexes();
    return c.json(result);
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

db.post("/clean", async (c) => {
  try {
    const result = await hulyConnection.cleanDatabase();
    return c.json(result);
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

db.post("/clean/workspace/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const result = await hulyConnection.cleanWorkspace(id);
    return c.json(result);
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

db.get("/health", async (c) => {
  try {
    const health = await hulyConnection.checkHealth();
    return c.json(health);
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

db.get("/collections/:dbName", async (c) => {
  try {
    const dbName = c.req.param("dbName");
    const collections = await hulyConnection.getCollectionInfo(dbName);
    return c.json(collections);
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

export default db;
