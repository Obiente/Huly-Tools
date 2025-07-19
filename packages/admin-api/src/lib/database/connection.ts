import { MongoClient, type Db } from 'mongodb'

export class DatabaseConnection {
  private client: MongoClient | null = null
  private mongoUrl: string

  constructor(mongoUrl: string) {
    this.mongoUrl = mongoUrl
  }

  async connect(): Promise<void> {
    if (!this.client) {
      this.client = new MongoClient(this.mongoUrl)
      await this.client.connect()
      console.log('✅ Connected to MongoDB')
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close()
      this.client = null
      console.log('📴 Disconnected from MongoDB')
    }
  }

  getDb(dbName?: string): Db {
    if (!this.client) {
      throw new Error('Database not connected')
    }
    return this.client.db(dbName)
  }

  // Get the accounts database
  getAccountsDb(): Db {
    return this.getDb('accounts')
  }

  // Get workspace database by ID
  getWorkspaceDb(workspaceId: string): Db {
    return this.getDb(`workspace-${workspaceId}`)
  }

  // Get main Huly database
  getHulyDb(): Db {
    return this.getDb('huly')
  }
}
