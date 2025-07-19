import { Hono } from "hono";
import { cors } from "hono/cors";

import { HulyConnection } from "./lib/hulyConnection.ts";
import workspaces from "./routes/workspaces.ts";

const port = Number(Deno.env.get("PORT")) || 3001;
export const hulyConnection = new HulyConnection({
  dbUrl: Deno.env.get("HULY_DB_URL") ?? "mongodb://mongodb:27017",
  transactorUrl: Deno.env.get("HULY_TRANSACTOR_URL") ?? "ws://transactor:3333",
  accountUrl: Deno.env.get("HULY_ACCOUNT_URL") ?? "http://account:3000",
  frontUrl: Deno.env.get("HULY_FRONT_URL") ?? "http://front:8080",
});

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

interface MemoryStats {
  heapUsed: number;
  heapTotal: number;
}
function formatMemoryUsage(memory: MemoryStats): string {
  const usedMB = Math.round(memory.heapUsed / 1024 / 1024);
  const totalMB = Math.round(memory.heapTotal / 1024 / 1024);
  return `${usedMB}MB / ${totalMB}MB`;
}

function formatStorageUsage(storageSize: number): string {
  const sizeMB = Math.round(storageSize / 1024 / 1024);
  return `${sizeMB}MB`;
}

interface Backup {
  createdOn: number;
  // ...other backup fields as needed
}

const app = new Hono();

app.use("/*", cors());

// Health check
app.get("/health", (c) => {
  return c.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: Deno.env.get("npm_package_version") ?? "1.0.0",
  });
});

// Dashboard
app.get("/api/dashboard", async (c) => {
  try {
    const [stats, backups, migrationStatus] = await Promise.all([
      hulyConnection.getStats(),
      hulyConnection.listBackups(),
      hulyConnection.getMigrationStatus(),
    ]);
    const recentBackups = (backups as Backup[])
      .sort((a, b) => b.createdOn - a.createdOn)
      .slice(0, 5);
    const memoryUsagePercent =
      (stats.memory.heapUsed / stats.memory.heapTotal) * 100;
    let systemStatus: "healthy" | "warning" | "critical" = "healthy";
    if (memoryUsagePercent > 90) {
      systemStatus = "critical";
    } else if (memoryUsagePercent > 70) {
      systemStatus = "warning";
    }
    const systemHealth = {
      status: systemStatus,
      uptime: formatUptime(stats.uptime),
      memoryUsage: formatMemoryUsage(stats.memory),
      storageUsage: formatStorageUsage(stats.storageSize || 0),
      memoryUsagePercent,
    };
    console.log("System Health:", systemHealth);
    return c.json({
      stats,
      recentBackups,
      systemHealth,
      migrationStatus,
    });
  } catch (error) {
    return c.json({ error: "Dashboard error", details: String(error) }, 500);
  }
});

// Mount workspaces routes
app.route("/api/workspaces", workspaces);

// 404 handler
app.notFound((c) => {
  return c.json({ error: "Not found" }, 404);
});

await hulyConnection.connect();
console.log(`🚀 Huly Admin API server running on port ${port}`);
console.log(`📊 Health check: http://localhost:${port}/health`);
console.log(`🔗 API base URL: http://localhost:${port}/api`);
Deno.serve({ port }, app.fetch);
