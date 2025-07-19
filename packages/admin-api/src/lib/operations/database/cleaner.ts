import type { Db } from 'mongodb'
import type { CleanupResult } from '../../types/database'

/**
 * Database cleanup operations
 */
export class DatabaseCleaner {
  private hulyDb: Db
  private accountsDb: Db

  constructor(getDb: (name?: string) => Db) {
    this.hulyDb = getDb('huly')
    this.accountsDb = getDb('accounts')
  }

  /**
   * Clean up old sessions, logs, and orphaned records
   */
  async cleanDatabase(): Promise<CleanupResult> {
    try {
      let totalDeleted = 0
      const operations: string[] = []

      // Clean up old sessions (older than 7 days)
      const sessionsCutoff = Date.now() - (7 * 24 * 60 * 60 * 1000)
      const sessionsResult = await this.hulyDb.collection('sessions').deleteMany({
        lastAccess: { $lt: sessionsCutoff }
      })
      totalDeleted += sessionsResult.deletedCount
      operations.push(`Deleted ${sessionsResult.deletedCount} old sessions`)

      // Clean up old logs (older than 30 days)
      const logsCutoff = Date.now() - (30 * 24 * 60 * 60 * 1000)
      const logsResult = await this.hulyDb.collection('logs').deleteMany({
        timestamp: { $lt: logsCutoff }
      })
      totalDeleted += logsResult.deletedCount
      operations.push(`Deleted ${logsResult.deletedCount} old logs`)

      // Clean up expired tokens
      const tokensResult = await this.accountsDb.collection('tokens').deleteMany({
        expiresAt: { $lt: new Date() }
      })
      totalDeleted += tokensResult.deletedCount
      operations.push(`Deleted ${tokensResult.deletedCount} expired tokens`)

      // Clean up orphaned backup records (backups without files)
      const orphanedBackupsResult = await this.hulyDb.collection('backups').deleteMany({
        status: 'failed',
        createdOn: { $lt: Date.now() - (7 * 24 * 60 * 60 * 1000) }
      })
      totalDeleted += orphanedBackupsResult.deletedCount
      operations.push(`Deleted ${orphanedBackupsResult.deletedCount} failed backups`)

      return {
        success: true,
        message: `Database cleanup completed: ${operations.join(', ')}`,
        deletedRecords: totalDeleted
      }
    } catch (error) {
      console.error('Database cleanup error:', error)
      return {
        success: false,
        message: `Database cleanup failed: ${error}`
      }
    }
  }

  /**
   * Clean up specific workspace data
   */
  async cleanWorkspace(workspaceId: string): Promise<CleanupResult> {
    try {
      let totalDeleted = 0
      const operations: string[] = []

      // Clean workspace sessions
      const sessionsResult = await this.hulyDb.collection('sessions').deleteMany({
        workspaceId
      })
      totalDeleted += sessionsResult.deletedCount
      operations.push(`Deleted ${sessionsResult.deletedCount} workspace sessions`)

      // Clean workspace logs
      const logsResult = await this.hulyDb.collection('logs').deleteMany({
        workspaceId
      })
      totalDeleted += logsResult.deletedCount
      operations.push(`Deleted ${logsResult.deletedCount} workspace logs`)

      // Clean workspace backups
      const backupsResult = await this.hulyDb.collection('backups').deleteMany({
        workspaceId
      })
      totalDeleted += backupsResult.deletedCount
      operations.push(`Deleted ${backupsResult.deletedCount} workspace backups`)

      return {
        success: true,
        message: `Workspace cleanup completed: ${operations.join(', ')}`,
        deletedRecords: totalDeleted
      }
    } catch (error) {
      console.error('Workspace cleanup error:', error)
      return {
        success: false,
        message: `Workspace cleanup failed: ${error}`
      }
    }
  }
}
