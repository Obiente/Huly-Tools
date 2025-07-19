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
