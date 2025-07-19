export interface DashboardStats {
  accounts: number;
  workspaces: number;
  backups: number;
  storage: string;
}

export interface RecentActivity {
  id: string;
  type: "user" | "workspace" | "backup" | "system";
  message: string;
  timestamp: Date;
  status: "success" | "warning" | "error";
}

export type MemoryStats = {
  rss: number;
  heapTotal: number;
  heapUsed: number;
  external: number;
  arrayBuffers: number;
};

export type Stats = {
  accounts: number;
  workspaces: number;
  backups: number;
  uptime: number;
  memory: MemoryStats;
  timestamp: number;
  storageSize: number;
  indexSize: number;
};

export type Backup = {
  // Define backup properties as needed
};

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
