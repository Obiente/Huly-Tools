import { 
  type Data, 
  type Doc, 
  type Ref, 
  type Space, 
  type Tx,
  MeasureMetricsContext,
  type Client
} from '@hcengineering/core'
import { generateToken } from '@hcengineering/server-token'
import { DatabaseConnection } from './database/connection'
import { AccountOperations } from './operations/accounts'
import { WorkspaceOperations } from './operations/workspaces'
import { BackupOperations } from './operations/backups'
import { DatabaseOperations } from './operations/database'

export interface HulyConfig {
  dbUrl: string
  transactorUrl: string
  accountUrl: string
  frontUrl: string
}

export class HulyConnection {
  private client: Client | null = null
  private db: DatabaseConnection
  private config: HulyConfig
  private ctx: MeasureMetricsContext
  
  // Operation modules (lazy-loaded)
  private _accounts: AccountOperations | null = null
  private _workspaces: WorkspaceOperations | null = null
  private _backups: BackupOperations | null = null
  private _database: DatabaseOperations | null = null

  constructor(config: HulyConfig) {
    this.config = config
    this.ctx = new MeasureMetricsContext('admin-api', {})
    
    // Initialize database connection
    this.db = new DatabaseConnection(config.dbUrl)
  }

  // Lazy getters for operation modules
  private get accounts(): AccountOperations {
    if (!this._accounts) {
      this._accounts = new AccountOperations(this.db)
    }
    return this._accounts
  }

  private get workspaces(): WorkspaceOperations {
    if (!this._workspaces) {
      this._workspaces = new WorkspaceOperations(this.db)
    }
    return this._workspaces
  }

  private get backups(): BackupOperations {
    if (!this._backups) {
      this._backups = new BackupOperations(this.db)
    }
    return this._backups
  }

  private get database(): DatabaseOperations {
    if (!this._database) {
      this._database = new DatabaseOperations(this.db)
    }
    return this._database
  }

  async connect(): Promise<void> {
    try {
      await this.db.connect()
      console.log('✅ Huly connection established')
    } catch (error) {
      console.error('❌ Failed to connect to Huly:', error)
      throw error
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close()
      this.client = null
    }
    await this.db.disconnect()
  }

  // Account operations - delegate to AccountOperations
  async listAccounts() {
    return this.accounts.listAccounts()
  }

  async createAccount(accountData: {
    email: string
    first: string
    last: string
    password: string
  }) {
    return this.accounts.createAccount(accountData)
  }

  async updateAccount(accountId: string, updates: any) {
    return this.accounts.updateAccount(accountId, updates)
  }

  async deleteAccount(accountId: string) {
    return this.accounts.deleteAccount(accountId)
  }

  async getAccount(accountId: string) {
    return this.accounts.getAccount(accountId)
  }

  async assignWorkspace(accountId: string, workspaceId: string) {
    return this.accounts.assignWorkspace(accountId, workspaceId)
  }

  // Workspace operations - delegate to WorkspaceOperations
  async listWorkspaces() {
    return this.workspaces.listWorkspaces()
  }

  async createWorkspace(workspaceData: {
    name: string
    description?: string
    owner: string
  }) {
    return this.workspaces.createWorkspace(workspaceData)
  }

  async updateWorkspace(workspaceId: string, updates: any) {
    return this.workspaces.updateWorkspace(workspaceId, updates)
  }

  async deleteWorkspace(workspaceId: string) {
    return this.workspaces.deleteWorkspace(workspaceId)
  }

  async getWorkspace(workspaceId: string) {
    return this.workspaces.getWorkspace(workspaceId)
  }

  async addMember(workspaceId: string, userId: string) {
    return this.workspaces.addMember(workspaceId, userId)
  }

  async removeMember(workspaceId: string, userId: string) {
    return this.workspaces.removeMember(workspaceId, userId)
  }

  async enableWorkspace(workspaceId: string) {
    return this.workspaces.enableWorkspace(workspaceId)
  }

  async disableWorkspace(workspaceId: string) {
    return this.workspaces.disableWorkspace(workspaceId)
  }

  // Backup operations - delegate to BackupOperations
  async createBackup(workspaceId: string) {
    return this.backups.createBackup(workspaceId)
  }

  async listBackups() {
    return this.backups.listBackups()
  }

  async restoreBackup(backupId: string) {
    return this.backups.restoreBackup(backupId)
  }

  async deleteBackup(backupId: string) {
    return this.backups.deleteBackup(backupId)
  }

  async getBackup(backupId: string) {
    return this.backups.getBackup(backupId)
  }

  async listWorkspaceBackups(workspaceId: string) {
    return this.backups.listWorkspaceBackups(workspaceId)
  }

  // Database operations - delegate to DatabaseOperations
  async runMigrations() {
    return this.database.runMigrations()
  }

  async rebuildIndexes() {
    return this.database.rebuildIndexes()
  }

  async cleanDatabase() {
    return this.database.cleanDatabase()
  }

  async getStats() {
    return this.database.getStats()
  }

  async checkHealth() {
    return this.database.checkHealth()
  }

  async needsMigration() {
    return this.database.needsMigration()
  }

  async getMigrationStatus() {
    return this.database.getMigrationStatus()
  }

  async createEssentialIndexes() {
    return this.database.createEssentialIndexes()
  }

  async recreateIndexes() {
    return this.database.recreateIndexes()
  }

  async cleanWorkspace(workspaceId: string) {
    return this.database.cleanWorkspace(workspaceId)
  }

  async getCollectionInfo(dbName: string) {
    return this.database.getCollectionInfo(dbName)
  }
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      huly: HulyConnection
    }
  }
}
