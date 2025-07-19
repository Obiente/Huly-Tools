import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import dotenv from "dotenv";
import { accountsRouter } from "./routes/accounts";
import { workspacesRouter } from "./routes/workspaces";
import { backupRouter } from "./routes/backup";
import { dbRouter } from "./routes/database";
import { statsRouter } from "./routes/stats";
import { authMiddleware } from "./middleware/auth";
import { errorHandler } from "./middleware/errorHandler";
import { HulyConnection } from "./lib/hulyConnection";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// Initialize Huly connection
const hulyConnection = new HulyConnection({
    dbUrl: process.env.HULY_DB_URL || "mongodb://localhost:27017/huly",
    transactorUrl: process.env.HULY_TRANSACTOR_URL || "ws://localhost:3333",
    accountUrl: process.env.HULY_ACCOUNT_URL || "http://localhost:3000",
    frontUrl: process.env.HULY_FRONT_URL || "http://localhost:8080",
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan("combined"));
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:4321",
    credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Make Huly connection available to routes
app.use((req, res, next) => {
    req.huly = hulyConnection;
    next();
});

// Health check endpoint (no auth required)
app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || "1.0.0",
    });
});

// API routes (with authentication)
app.use("/api", authMiddleware);

// Dashboard endpoint - Get combined dashboard data
app.get("/api/dashboard", async (req, res, next) => {
  try {
    // Helper functions for dashboard
    function formatUptime(seconds: number): string {
      const days = Math.floor(seconds / 86400)
      const hours = Math.floor((seconds % 86400) / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      
      if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`
      } else if (hours > 0) {
        return `${hours}h ${minutes}m`
      } else {
        return `${minutes}m`
      }
    }

    function formatMemoryUsage(memory: any): string {
      const usedMB = Math.round(memory.heapUsed / 1024 / 1024)
      const totalMB = Math.round(memory.heapTotal / 1024 / 1024)
      return `${usedMB}MB / ${totalMB}MB`
    }

    function formatStorageUsage(storageSize: number): string {
      const sizeMB = Math.round(storageSize / 1024 / 1024)
      return `${sizeMB}MB`
    }

    const [stats, backups, migrationStatus] = await Promise.all([
      req.huly.getStats(),
      req.huly.listBackups(),
      req.huly.getMigrationStatus()
    ])

    // Get recent backups (last 5)
    const recentBackups = backups
      .sort((a, b) => b.createdOn - a.createdOn)
      .slice(0, 5)

    // Calculate system health
    const memoryUsagePercent = (stats.memory.heapUsed / stats.memory.heapTotal) * 100
    let systemStatus: 'healthy' | 'warning' | 'critical' = 'healthy'
    
    if (memoryUsagePercent > 90) {
      systemStatus = 'critical'
    } else if (memoryUsagePercent > 70) {
      systemStatus = 'warning'
    }

    const systemHealth = {
      status: systemStatus,
      uptime: formatUptime(stats.uptime),
      memoryUsage: formatMemoryUsage(stats.memory),
      storageUsage: formatStorageUsage(stats.storageSize || 0),
      memoryUsagePercent
    }
    console.log("System Health:", systemHealth)
    res.json({
      stats,
      recentBackups,
      systemHealth,
      migrationStatus
    })
  } catch (error) {
    next(error)
  }
})

app.use("/api/accounts", accountsRouter);
app.use("/api/workspaces", workspacesRouter);
app.use("/api/backup", backupRouter);
app.use("/api/db", dbRouter);
app.use("/api/stats", statsRouter);

// Error handling
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
});

// Start server
async function start() {
    try {
        await hulyConnection.connect();
        app.listen(port, () => {
            console.log(`🚀 Huly Admin API server running on port ${port}`);
            console.log(`📊 Health check: http://localhost:${port}/health`);
            console.log(`🔗 API base URL: http://localhost:${port}/api`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on("SIGTERM", async () => {
    console.log("Received SIGTERM, shutting down gracefully...");
    await hulyConnection.disconnect();
    process.exit(0);
});

process.on("SIGINT", async () => {
    console.log("Received SIGINT, shutting down gracefully...");
    await hulyConnection.disconnect();
    process.exit(0);
});

start();

// Export for testing
export { app };
