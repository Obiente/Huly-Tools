/**
 * MongoDB connection management for Huly Admin API
 * Based on the official Huly platform patterns
 */
import { MongoClient, type Db } from 'mongodb'
import { type HulyConfig } from './config.ts'

export class MongoDBConnection {
  private client: MongoClient | null = null
  private db: Db | null = null
  private readonly config: HulyConfig

  constructor(config: HulyConfig) {
    this.config = config
  }

  /**
   * Connect to MongoDB
   */
  async connect(): Promise<void> {
    try {
      this.client = new MongoClient(this.config.mongoUrl, {
        retryReads: true,
        appName: 'huly-admin-api',
        enableUtf8Validation: false
      })

      await this.client.connect()
      this.db = this.client.db()
      console.log('✅ Connected to MongoDB')
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error)
      throw error
    }
  }

  /**
   * Disconnect from MongoDB
   */
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close()
      this.client = null
      this.db = null
      console.log('✅ Disconnected from MongoDB')
    }
  }

  /**
   * Get MongoDB client
   */
  getClient(): MongoClient {
    if (!this.client) {
      throw new Error('MongoDB client not connected')
    }
    return this.client
  }

  /**
   * Get MongoDB database
   */
  getDB(): Db {
    if (!this.db) {
      throw new Error('MongoDB database not connected')
    }
    return this.db
  }

  /**
   * Get workspace database by workspace ID
   */
  getWorkspaceDB(workspaceId: string): Db {
    if (!this.client) {
      throw new Error('MongoDB client not connected')
    }
    return this.client.db(workspaceId)
  }

  /**
   * Get account database
   */
  getAccountDB(): Db {
    if (!this.client) {
      throw new Error('MongoDB client not connected')
    }
    return this.client.db('account')
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.client !== null && this.db !== null
  }

  /**
   * Test connection
   */
  async ping(): Promise<boolean> {
    try {
      if (!this.client) {
        return false
      }
      await this.client.db('admin').command({ ping: 1 })
      return true
    } catch (error) {
      console.error('MongoDB ping failed:', error)
      return false
    }
  }
}
