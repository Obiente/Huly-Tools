import type { Db } from 'mongodb'
import type { MigrationResult } from '../../types/database.ts'

/**
 * Database migration operations
 */
export class DatabaseMigrator {
  private hulyDb: Db
  private accountsDb: Db

  constructor(getDb: (name?: string) => Db) {
    this.hulyDb = getDb('huly')
    this.accountsDb = getDb('accounts')
  }

  /**
   * Run database migrations
   */
  async runMigrations(): Promise<MigrationResult> {
    try {
      const migrationsRun: string[] = []
      const currentVersion = await this.getCurrentVersion()

      // Run migrations based on current version
      if (this.shouldRunMigration(currentVersion, '1.0.0')) {
        await this.migration_1_0_0()
        migrationsRun.push('1.0.0')
      }

      if (this.shouldRunMigration(currentVersion, '1.1.0')) {
        await this.migration_1_1_0()
        migrationsRun.push('1.1.0')
      }

      if (this.shouldRunMigration(currentVersion, '1.2.0')) {
        await this.migration_1_2_0()
        migrationsRun.push('1.2.0')
      }

      // Update version to latest
      const latestVersion = '1.2.0'
      await this.updateVersion(latestVersion)

      return {
        success: true,
        message: `Migrations completed successfully. Ran ${migrationsRun.length} migrations.`,
        migrationsRun,
        version: latestVersion
      }
    } catch (error) {
      console.error('Migration error:', error)
      return {
        success: false,
        message: `Migration failed: ${error}`
      }
    }
  }

  /**
   * Get current database version
   */
  private async getCurrentVersion(): Promise<string> {
    try {
      const versionDoc = await this.hulyDb.collection('schema_version').findOne({})
      return versionDoc?.version || '0.0.0'
    } catch (error) {
      // If collection doesn't exist, assume version 0.0.0
      return '0.0.0'
    }
  }

  /**
   * Update database version
   */
  private async updateVersion(version: string): Promise<void> {
    await this.hulyDb.collection('schema_version').replaceOne(
      {},
      {
        version,
        updatedAt: new Date(),
        updatedBy: 'admin-api'
      },
      { upsert: true }
    )
  }

  /**
   * Check if migration should run
   */
  private shouldRunMigration(currentVersion: string, targetVersion: string): boolean {
    return this.compareVersions(currentVersion, targetVersion) < 0
  }

  /**
   * Compare version strings
   */
  private compareVersions(a: string, b: string): number {
    const aParts = a.split('.').map(Number)
    const bParts = b.split('.').map(Number)
    
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aPart = aParts[i] || 0
      const bPart = bParts[i] || 0
      
      if (aPart < bPart) return -1
      if (aPart > bPart) return 1
    }
    
    return 0
  }

  /**
   * Migration 1.0.0 - Initial setup
   */
  private async migration_1_0_0(): Promise<void> {
    console.log('Running migration 1.0.0: Initial setup')
    
    // Create initial collections if they don't exist
    const collections = ['accounts', 'workspaces', 'backups', 'sessions', 'logs']
    
    for (const collectionName of collections) {
      const db = collectionName === 'accounts' ? this.accountsDb : this.hulyDb
      const exists = await db.listCollections({ name: collectionName }).hasNext()
      
      if (!exists) {
        await db.createCollection(collectionName)
        console.log(`Created collection: ${collectionName}`)
      }
    }
  }

  /**
   * Migration 1.1.0 - Add user preferences
   */
  private async migration_1_1_0(): Promise<void> {
    console.log('Running migration 1.1.0: Add user preferences')
    
    // Add preferences field to accounts
    await this.accountsDb.collection('accounts').updateMany(
      { preferences: { $exists: false } },
      { $set: { preferences: {} } }
    )
    
    // Add settings field to workspaces
    await this.hulyDb.collection('workspaces').updateMany(
      { settings: { $exists: false } },
      { $set: { settings: {} } }
    )
  }

  /**
   * Migration 1.2.0 - Add backup metadata
   */
  private async migration_1_2_0(): Promise<void> {
    console.log('Running migration 1.2.0: Add backup metadata')
    
    // Add metadata field to backups
    await this.hulyDb.collection('backups').updateMany(
      { metadata: { $exists: false } },
      { $set: { metadata: { format: 'json', compression: 'gzip' } } }
    )
    
    // Add retention policy to backups
    await this.hulyDb.collection('backups').updateMany(
      { retentionDays: { $exists: false } },
      { $set: { retentionDays: 30 } }
    )
  }

  /**
   * Check if database needs migration
   */
  async needsMigration(): Promise<boolean> {
    const currentVersion = await this.getCurrentVersion()
    const latestVersion = '1.2.0'
    return this.compareVersions(currentVersion, latestVersion) < 0
  }

  /**
   * Get migration status
   */
  async getMigrationStatus(): Promise<{
    currentVersion: string
    latestVersion: string
    needsMigration: boolean
  }> {
    const currentVersion = await this.getCurrentVersion()
    const latestVersion = '1.2.0'
    const needsMigration = this.compareVersions(currentVersion, latestVersion) < 0
    
    return {
      currentVersion,
      latestVersion,
      needsMigration
    }
  }
}
