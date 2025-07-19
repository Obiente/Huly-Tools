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

export interface MigrationResult {
  success: boolean;
  message: string;
  migrationsRun?: string[];
  version?: string;
}

export interface CleanupResult {
  success: boolean;
  message: string;
  deletedRecords?: number;
  freedSpace?: number;
}

export interface IndexResult {
  success: boolean;
  message: string;
  rebuiltIndexes?: string[];
  timeTaken?: number;
}

export interface DatabaseHealth {
  isConnected: boolean;
  latency: number;
  collections: number;
  indexes: number;
  errors: string[];
}

export interface CollectionInfo {
  name: string;
  size: number;
  count: number;
  avgObjSize: number;
  storageSize: number;
  indexes: number;
}

export interface DatabaseSchema {
  version: string;
  collections: CollectionInfo[];
  totalSize: number;
  totalIndexSize: number;
}
