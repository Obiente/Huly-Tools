import { DatabaseConnection } from '../database/connection'
import { DatabaseMonitor } from './database/monitor'
import { DatabaseCleaner } from './database/cleaner'
import { DatabaseIndexManager } from './database/indexes'
import { DatabaseMigrator } from './database/migrator'
import type { DatabaseStats, DatabaseHealth, MigrationResult, CleanupResult, IndexResult } from '../types/database'

/**
 * Main database operations class that orchestrates all database management tasks
 */
export class DatabaseOperations {
  private db: DatabaseConnection
  private monitor: DatabaseMonitor
  private cleaner: DatabaseCleaner
  private indexManager: DatabaseIndexManager
  private migrator: DatabaseMigrator

  constructor(db: DatabaseConnection) {
    this.db = db
    
    // Initialize modular components
    const getDb = (name?: string) => this.db.getDb(name)
    this.monitor = new DatabaseMonitor(getDb)
    this.cleaner = new DatabaseCleaner(getDb)
    this.indexManager = new DatabaseIndexManager(getDb)
    this.migrator = new DatabaseMigrator(getDb)
  }

  // Migration operations
  async runMigrations(): Promise<MigrationResult> {
    return this.migrator.runMigrations()
  }

  async needsMigration(): Promise<boolean> {
    return this.migrator.needsMigration()
  }

  async getMigrationStatus(): Promise<{
    currentVersion: string
    latestVersion: string
    needsMigration: boolean
  }> {
    return this.migrator.getMigrationStatus()
  }

  // Index operations
  async rebuildIndexes(): Promise<IndexResult> {
    return this.indexManager.rebuildIndexes()
  }

  async createEssentialIndexes(): Promise<IndexResult> {
    return this.indexManager.createEssentialIndexes()
  }

  async recreateIndexes(): Promise<IndexResult> {
    return this.indexManager.recreateIndexes()
  }

  // Cleanup operations
  async cleanDatabase(): Promise<CleanupResult> {
    return this.cleaner.cleanDatabase()
  }

  async cleanWorkspace(workspaceId: string): Promise<CleanupResult> {
    return this.cleaner.cleanWorkspace(workspaceId)
  }

  // Monitoring operations
  async getStats(): Promise<DatabaseStats> {
    return this.monitor.getStats()
  }

  async checkHealth(): Promise<DatabaseHealth> {
    return this.monitor.checkHealth()
  }

  async getCollectionInfo(dbName: string = 'huly') {
    return this.monitor.getCollectionInfo(dbName)
  }
}
