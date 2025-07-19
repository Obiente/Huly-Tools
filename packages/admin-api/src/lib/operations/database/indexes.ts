import type { Db } from 'mongodb'
import type { IndexResult } from '../../types/database'

/**
 * Database index management operations
 */
export class DatabaseIndexManager {
  private hulyDb: Db
  private accountsDb: Db

  constructor(getDb: (name?: string) => Db) {
    this.hulyDb = getDb('huly')
    this.accountsDb = getDb('accounts')
  }

  /**
   * Rebuild all database indexes
   */
  async rebuildIndexes(): Promise<IndexResult> {
    const startTime = Date.now()
    
    try {
      const rebuiltIndexes: string[] = []

      // Rebuild indexes for Huly database
      const hulyCollections = await this.hulyDb.listCollections().toArray()
      for (const collection of hulyCollections) {
        try {
          await this.hulyDb.collection(collection.name).createIndex({})
          rebuiltIndexes.push(`huly.${collection.name}`)
        } catch (error) {
          console.error(`Error rebuilding indexes for huly.${collection.name}:`, error)
        }
      }

      // Rebuild indexes for accounts database
      const accountCollections = await this.accountsDb.listCollections().toArray()
      for (const collection of accountCollections) {
        try {
          await this.accountsDb.collection(collection.name).createIndex({})
          rebuiltIndexes.push(`accounts.${collection.name}`)
        } catch (error) {
          console.error(`Error rebuilding indexes for accounts.${collection.name}:`, error)
        }
      }

      const timeTaken = Date.now() - startTime

      return {
        success: true,
        message: `Successfully rebuilt indexes for ${rebuiltIndexes.length} collections`,
        rebuiltIndexes,
        timeTaken
      }
    } catch (error) {
      console.error('Index rebuild error:', error)
      return {
        success: false,
        message: `Failed to rebuild indexes: ${error}`
      }
    }
  }

  /**
   * Create essential indexes for optimal performance
   */
  async createEssentialIndexes(): Promise<IndexResult> {
    const startTime = Date.now()
    
    try {
      const createdIndexes: string[] = []

      // Create indexes for accounts collection
      await this.accountsDb.collection('accounts').createIndexes([
        { key: { email: 1 }, unique: true },
        { key: { confirmed: 1 } },
        { key: { createdOn: 1 } },
        { key: { workspaces: 1 } }
      ])
      createdIndexes.push('accounts.email', 'accounts.confirmed', 'accounts.createdOn', 'accounts.workspaces')

      // Create indexes for workspaces collection
      await this.hulyDb.collection('workspaces').createIndexes([
        { key: { name: 1 }, unique: true },
        { key: { owner: 1 } },
        { key: { members: 1 } },
        { key: { createdOn: 1 } },
        { key: { disabled: 1 } }
      ])
      createdIndexes.push('workspaces.name', 'workspaces.owner', 'workspaces.members', 'workspaces.createdOn', 'workspaces.disabled')

      // Create indexes for backups collection
      await this.hulyDb.collection('backups').createIndexes([
        { key: { workspaceId: 1 } },
        { key: { status: 1 } },
        { key: { createdOn: 1 } },
        { key: { workspaceId: 1, createdOn: -1 } }
      ])
      createdIndexes.push('backups.workspaceId', 'backups.status', 'backups.createdOn', 'backups.workspaceId_createdOn')

      // Create indexes for sessions collection
      await this.hulyDb.collection('sessions').createIndexes([
        { key: { userId: 1 } },
        { key: { workspaceId: 1 } },
        { key: { lastAccess: 1 } },
        { key: { expiresAt: 1 }, expireAfterSeconds: 0 }
      ])
      createdIndexes.push('sessions.userId', 'sessions.workspaceId', 'sessions.lastAccess', 'sessions.expiresAt')

      // Create indexes for logs collection
      await this.hulyDb.collection('logs').createIndexes([
        { key: { timestamp: 1 } },
        { key: { level: 1 } },
        { key: { workspaceId: 1 } },
        { key: { userId: 1 } }
      ])
      createdIndexes.push('logs.timestamp', 'logs.level', 'logs.workspaceId', 'logs.userId')

      const timeTaken = Date.now() - startTime

      return {
        success: true,
        message: `Successfully created ${createdIndexes.length} essential indexes`,
        rebuiltIndexes: createdIndexes,
        timeTaken
      }
    } catch (error) {
      console.error('Index creation error:', error)
      return {
        success: false,
        message: `Failed to create indexes: ${error}`
      }
    }
  }

  /**
   * Drop and recreate all indexes
   */
  async recreateIndexes(): Promise<IndexResult> {
    const startTime = Date.now()
    
    try {
      const recreatedIndexes: string[] = []

      // Drop and recreate indexes for key collections
      const collections = [
        { db: this.accountsDb, name: 'accounts' },
        { db: this.hulyDb, name: 'workspaces' },
        { db: this.hulyDb, name: 'backups' },
        { db: this.hulyDb, name: 'sessions' },
        { db: this.hulyDb, name: 'logs' }
      ]

      for (const { db, name } of collections) {
        try {
          // Drop all indexes except _id
          await db.collection(name).dropIndexes()
          recreatedIndexes.push(`${name}.dropped`)
        } catch (error) {
          console.error(`Error dropping indexes for ${name}:`, error)
        }
      }

      // Recreate essential indexes
      const createResult = await this.createEssentialIndexes()
      if (createResult.success && createResult.rebuiltIndexes) {
        recreatedIndexes.push(...createResult.rebuiltIndexes)
      }

      const timeTaken = Date.now() - startTime

      return {
        success: true,
        message: `Successfully recreated indexes for ${recreatedIndexes.length} collections`,
        rebuiltIndexes: recreatedIndexes,
        timeTaken
      }
    } catch (error) {
      console.error('Index recreation error:', error)
      return {
        success: false,
        message: `Failed to recreate indexes: ${error}`
      }
    }
  }
}
