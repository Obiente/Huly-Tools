import { Hono } from "hono";
import { HulyConnection } from "../lib/hulyConnection.ts";

declare const hulyConnection: HulyConnection;

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

function formatMemoryUsage(memory: { heapUsed: number; heapTotal: number }): string {
  const usedMB = Math.round(memory.heapUsed / 1024 / 1024);
  const totalMB = Math.round(memory.heapTotal / 1024 / 1024);
  return `${usedMB}MB / ${totalMB}MB`;
}

function formatStorageUsage(storageSize: number): string {
  const sizeMB = Math.round(storageSize / 1024 / 1024);
  return `${sizeMB}MB`;
}

const stats = new Hono();

// GET /api/stats - Get platform statistics
stats.get("/", async (c) => {
  try {
    const result = await hulyConnection.getStats();
    return c.json(result);
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// GET /api/stats/system - Get system health information
stats.get("/system", async (c) => {
  try {
    const statsData = await hulyConnection.getStats();
    const uptime = formatUptime(statsData.uptime);
    const memoryUsage = formatMemoryUsage(statsData.memory);
    const storageUsage = formatStorageUsage(statsData.storageSize || 0);
    const memoryUsagePercent = (statsData.memory.heapUsed / statsData.memory.heapTotal) * 100;
    let status: "healthy" | "warning" | "critical" = "healthy";
    if (memoryUsagePercent > 90) {
      status = "critical";
    } else if (memoryUsagePercent > 70) {
      status = "warning";
    }
    return c.json({
      status,
      uptime,
      memoryUsage,
      storageUsage,
      memoryUsagePercent,
      rawStats: statsData,
    });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

export default stats;
