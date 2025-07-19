export interface DashboardStats {
  accounts: number;
  workspaces: number;
  backups: number;
  storage: string;
}

export interface SystemHealth {
  uptime: string;
  memoryUsage: string;
  storageUsage: string;
  status: 'healthy' | 'warning' | 'error';
}

export interface RecentActivity {
  id: string;
  type: 'user' | 'workspace' | 'backup' | 'system';
  message: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'error';
}
