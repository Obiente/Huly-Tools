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

export interface DatabaseStats {
  accounts: number;
  workspaces: number;
  backups: number;
  uptime: number;
  memory: any;
  timestamp: number;
  storageSize?: number;
  indexSize?: number;
}

export type MemoryStats = {
  rss: number;
  heapTotal: number;
  heapUsed: number;
  external: number;
  arrayBuffers: number;
};

export interface DashboardStats {
  accounts: number;
  workspaces: number;
  backups: number;
  storage: string;
}
