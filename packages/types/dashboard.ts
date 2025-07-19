import { Backup } from "./backup.ts";
import { Stats } from "./stats.ts";


export interface RecentActivity {
  id: string;
  type: "user" | "workspace" | "backup" | "system";
  message: string;
  timestamp: Date;
  status: "success" | "warning" | "error";
}



export type MigrationStatus = {
  currentVersion: string;
  latestVersion: string;
  needsMigration: boolean;
};

export type SystemHealth = {
  status: "healthy" | "warning" | "critical";
  uptime: string;
  memoryUsage: string;
  storageUsage: string;
  memoryUsagePercent: number;
};

export type DashboardResponse = {
  stats: Stats;
  recentBackups: Backup[];
  systemHealth: SystemHealth;
  migrationStatus: MigrationStatus;
};
