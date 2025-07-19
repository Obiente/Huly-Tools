import { DatabaseConnection } from '../database/connection'
import type { Account } from '@huly-tools/types'

export class AccountOperations {
  private db: DatabaseConnection

  constructor(db: DatabaseConnection) {
    this.db = db
  }

  async listAccounts(): Promise<Account[]> {
    const accountsDb = this.db.getAccountDb()
    const accounts = await accountsDb.collection('account').find({}).toArray()
    
    return accounts.map(acc => ({
      _id: acc._id.toString(),
      email: acc.email,
      first: acc.first,
      last: acc.last,
      confirmed: acc.confirmed || false,
      createdOn: acc.createdOn || Date.now(),
      workspaces: acc.workspaces || []
    }))
  }

  async createAccount(accountData: {
    email: string
    first: string
    last: string
    password: string
  }): Promise<Account> {
    const accountsDb = this.db.getAccountDb()
    
    // Check if account exists
    const existing = await accountsDb.collection('accounts').findOne({ email: accountData.email })
    if (existing) {
      throw new Error('Account already exists')
    }

    const account: Account = {
      _id: `account:${Date.now()}`,
      email: accountData.email,
      first: accountData.first,
      last: accountData.last,
      confirmed: false,
      createdOn: Date.now(),
      workspaces: []
    }

    await accountsDb.collection('accounts').insertOne(account as any)
    return account
  }

  async getAccount(accountId: string): Promise<Account | null> {
    const accountsDb = this.db.getAccountDb()
    const account = await accountsDb.collection('accounts').findOne({ _id: accountId } as any)
    
    if (!account) return null

    return {
      _id: account._id.toString(),
      email: account.email,
      first: account.first,
      last: account.last,
      confirmed: account.confirmed || false,
      createdOn: account.createdOn || Date.now(),
      workspaces: account.workspaces || []
    }
  }

  async updateAccount(accountId: string, updates: Partial<Account>): Promise<Account> {
    const accountsDb = this.db.getAccountDb()
    const result = await accountsDb.collection('accounts').findOneAndUpdate(
      { _id: accountId } as any,
      { $set: updates },
      { returnDocument: 'after' }
    )
    
    if (!result?.value) {
      throw new Error('Account not found')
    }
    
    return result.value as Account
  }

  async deleteAccount(accountId: string): Promise<void> {
    const accountsDb = this.db.getAccountDb()
    const result = await accountsDb.collection('accounts').deleteOne({ _id: accountId } as any)
    
    if (result.deletedCount === 0) {
      throw new Error('Account not found')
    }
  }

  async assignWorkspace(accountId: string, workspaceId: string): Promise<Account> {
    const accountsDb = this.db.getAccountDb()
    
    // Check if account exists
    const account = await accountsDb.collection('accounts').findOne({ _id: accountId } as any)
    if (!account) {
      throw new Error('Account not found')
    }

    // Check if workspace is already assigned
    if (account.workspaces?.includes(workspaceId)) {
      throw new Error('Workspace already assigned to account')
    }

    // Add workspace to account
    const result = await accountsDb.collection('accounts').findOneAndUpdate(
      { _id: accountId } as any,
      { $push: { workspaces: workspaceId } } as any,
      { returnDocument: 'after' }
    )
    
    if (!result?.value) {
      throw new Error('Failed to assign workspace')
    }
    
    return result.value as Account
  }

  async unassignWorkspace(accountId: string, workspaceId: string): Promise<Account> {
    const accountsDb = this.db.getAccountDb()
    
    // Remove workspace from account
    const result = await accountsDb.collection('accounts').findOneAndUpdate(
      { _id: accountId } as any,
      { $pull: { workspaces: workspaceId } } as any,
      { returnDocument: 'after' }
    )
    
    if (!result?.value) {
      throw new Error('Account not found')
    }
    
    return result.value as Account
  }
}
