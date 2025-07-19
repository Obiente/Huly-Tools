import type { Db } from 'mongodb'
import type { DatabaseStats, DatabaseHealth, CollectionInfo } from '../../types/database'

/**
 * Database statistics and health monitoring operations
 */
export class DatabaseMonitor {
  private db: Db
  private accountsDb: Db
  private hulyDb: Db

  constructor(getDb: (name?: string) => Db) {
    this.db = getDb()
    this.accountsDb = getDb('account')
    this.hulyDb = getDb('huly')
  }

  /**
   * Get comprehensive database statistics
   */
  async getStats(): Promise<DatabaseStats> {
    const startTime = Date.now()
    
    try {
      // Get counts from different databases
      const [accountsCount, workspacesCount, backupsCount] = await Promise.all([
        this.accountsDb.collection('accounts').countDocuments(),
        this.hulyDb.collection('workspaces').countDocuments(),
        this.hulyDb.collection('backups').countDocuments()
      ])

      // Get storage statistics
      const [accountsStats, hulyStats] = await Promise.all([
        this.accountsDb.admin().command({ dbStats: 1 }),
        this.hulyDb.admin().command({ dbStats: 1 })
      ])

      return {
        accounts: accountsCount,
        workspaces: workspacesCount,
        backups: backupsCount,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: Date.now(),
        storageSize: (accountsStats.storageSize || 0) + (hulyStats.storageSize || 0),
        indexSize: (accountsStats.indexSize || 0) + (hulyStats.indexSize || 0)
      }
    } catch (error) {
      console.error('Error getting database stats:', error)
      throw new Error(`Failed to get database statistics: ${error}`)
    }
  }

  /**
   * Check database health and connectivity
   */
  async checkHealth(): Promise<DatabaseHealth> {
    const startTime = Date.now()
    const errors: string[] = []

    try {
      // Test connectivity with ping
      await this.db.admin().ping()
      const latency = Date.now() - startTime

      // Count collections and indexes
      const [accountsCollections, hulyCollections] = await Promise.all([
        this.accountsDb.listCollections().toArray(),
        this.hulyDb.listCollections().toArray()
      ])

      const totalCollections = accountsCollections.length + hulyCollections.length
      
      // Count total indexes
      let totalIndexes = 0
      for (const collection of [...accountsCollections, ...hulyCollections]) {
        try {
          const db = accountsCollections.includes(collection) ? this.accountsDb : this.hulyDb
          const indexes = await db.collection(collection.name).listIndexes().toArray()
          totalIndexes += indexes.length
        } catch (error) {
          errors.push(`Error counting indexes for ${collection.name}: ${error}`)
        }
      }

      return {
        isConnected: true,
        latency,
        collections: totalCollections,
        indexes: totalIndexes,
        errors
      }
    } catch (error) {
      errors.push(`Database connection error: ${error}`)
      return {
        isConnected: false,
        latency: Date.now() - startTime,
        collections: 0,
        indexes: 0,
        errors
      }
    }
  }

  /**
   * Get detailed collection information
   */
  async getCollectionInfo(dbName: string): Promise<CollectionInfo[]> {
    const db = dbName === 'accounts' ? this.accountsDb : this.hulyDb
    const collections = await db.listCollections().toArray()
    
    const collectionInfo: CollectionInfo[] = []
    
    for (const collection of collections) {
      try {
        const [stats, indexes] = await Promise.all([
          db.admin().command({ collStats: collection.name }),
          db.collection(collection.name).listIndexes().toArray()
        ])

        collectionInfo.push({
          name: collection.name,
          size: stats.size || 0,
          count: stats.count || 0,
          avgObjSize: stats.avgObjSize || 0,
          storageSize: stats.storageSize || 0,
          indexes: indexes.length
        })
      } catch (error) {
        console.error(`Error getting stats for collection ${collection.name}:`, error)
        collectionInfo.push({
          name: collection.name,
          size: 0,
          count: 0,
          avgObjSize: 0,
          storageSize: 0,
          indexes: 0
        })
      }
    }

    return collectionInfo
  }
}
