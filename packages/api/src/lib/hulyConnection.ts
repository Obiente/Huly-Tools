// Hono middleware to attach hulyConnection to context

import { Client } from "@hcengineering/core";
import { DatabaseConnection } from "./database/connection.ts";
import { AccountOperations } from "./operations/accounts.ts";
import { WorkspaceOperations } from "./operations/workspaces.ts";
import { BackupOperations } from "./operations/backups.ts";
import { DatabaseOperations } from "./operations/database.ts";

export interface HulyConfig {
  dbUrl: string;
  transactorUrl: string;
  accountUrl: string;
  frontUrl: string;
}

export class HulyConnection {
  private client: Client | null = null;
  private db: DatabaseConnection;
  private config: HulyConfig;

  // Operation modules (lazy-loaded)
  private _accounts: AccountOperations | null = null;
  private _workspaces: WorkspaceOperations | null = null;
  private _backups: BackupOperations | null = null;
  private _database: DatabaseOperations | null = null;

  constructor(config: HulyConfig) {
    this.config = config;
    // Initialize database connection
    this.db = new DatabaseConnection(config.dbUrl);
  }

  // Lazy getters for operation modules
  private get accounts(): AccountOperations {
    if (!this._accounts) {
      this._accounts = new AccountOperations(this.db);
    }
    return this._accounts;
  }

  private get workspaces(): WorkspaceOperations {
    if (!this._workspaces) {
      this._workspaces = new WorkspaceOperations(this.db);
    }
    return this._workspaces;
  }

  private get backups(): BackupOperations {
    if (!this._backups) {
      this._backups = new BackupOperations(this.db);
    }
    return this._backups;
  }

  private get database(): DatabaseOperations {
    if (!this._database) {
      this._database = new DatabaseOperations(this.db);
    }
    return this._database;
  }

  async connect(): Promise<void> {
    console.log("Connecting to Huly...");
    try {
      await this.db.connect();
      console.log("✅ Huly connection established");
    } catch (error) {
      console.error("❌ Failed to connect to Huly:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
    }
    await this.db.disconnect();
  }

  // Account operations - delegate to AccountOperations
  listAccounts() {
    return this.accounts.listAccounts();
  }

  createAccount(accountData: {
    email: string;
    first: string;
    last: string;
    password: string;
  }) {
    return this.accounts.createAccount(accountData);
  }

  updateAccount(accountId: string, updates: Record<string, unknown>) {
    return this.accounts.updateAccount(accountId, updates);
  }

  deleteAccount(accountId: string) {
    return this.accounts.deleteAccount(accountId);
  }

  getAccount(accountId: string) {
    return this.accounts.getAccount(accountId);
  }

  assignWorkspace(accountId: string, workspaceId: string) {
    return this.accounts.assignWorkspace(accountId, workspaceId);
  }

  // Workspace operations - delegate to WorkspaceOperations
  listWorkspaces() {
    return this.workspaces.listWorkspaces();
  }

  createWorkspace(_workspaceData: {
    name: string;
    description?: string;
    owner: string;
  }) {
    //TODO:
    console.warn("createWorkspace is not implemented yet");
    // return this.workspaces.createWorkspace(workspaceData)
  }

  updateWorkspace(workspaceId: string, updates: Record<string, unknown>) {
    return this.workspaces.updateWorkspace(workspaceId, updates);
  }

  deleteWorkspace(workspaceId: string) {
    return this.workspaces.deleteWorkspace(workspaceId);
  }

  getWorkspace(workspaceId: string) {
    return this.workspaces.getWorkspace(workspaceId);
  }

  addMember(workspaceId: string, userId: string) {
    return this.workspaces.addMember(workspaceId, userId);
  }

  removeMember(workspaceId: string, userId: string) {
    return this.workspaces.removeMember(workspaceId, userId);
  }

  enableWorkspace(workspaceId: string) {
    return this.workspaces.enableWorkspace(workspaceId);
  }

  disableWorkspace(workspaceId: string) {
    return this.workspaces.disableWorkspace(workspaceId);
  }

  // Backup operations - delegate to BackupOperations
  createBackup(workspaceId: string) {
    return this.backups.createBackup(workspaceId);
  }

  listBackups() {
    return this.backups.listBackups();
  }

  restoreBackup(backupId: string) {
    return this.backups.restoreBackup(backupId);
  }

  deleteBackup(backupId: string) {
    return this.backups.deleteBackup(backupId);
  }

  getBackup(backupId: string) {
    return this.backups.getBackup(backupId);
  }

  listWorkspaceBackups(workspaceId: string) {
    return this.backups.listWorkspaceBackups(workspaceId);
  }

  // Database operations - delegate to DatabaseOperations
  runMigrations() {
    return this.database.runMigrations();
  }

  rebuildIndexes() {
    return this.database.rebuildIndexes();
  }

  cleanDatabase() {
    return this.database.cleanDatabase();
  }

  getStats() {
    return this.database.getStats();
  }

  checkHealth() {
    return this.database.checkHealth();
  }

  needsMigration() {
    return this.database.needsMigration();
  }

  getMigrationStatus() {
    return this.database.getMigrationStatus();
  }

  createEssentialIndexes() {
    return this.database.createEssentialIndexes();
  }

  recreateIndexes() {
    return this.database.recreateIndexes();
  }

  cleanWorkspace(workspaceId: string) {
    return this.database.cleanWorkspace(workspaceId);
  }

  getCollectionInfo(dbName: string) {
    return this.database.getCollectionInfo(dbName);
  }
}


