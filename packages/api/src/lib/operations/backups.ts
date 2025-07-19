import { DatabaseConnection } from '../database/connection.ts'
import type { Backup } from '@huly-tools/types'

export class BackupOperations {
  private db: DatabaseConnection
  private backups: ReturnType<DatabaseConnection['getDb']>
  constructor(databaseConnection: DatabaseConnection) {
    this.db = databaseConnection
    this.backups = this.db.getDb("backups")
  }

  async listBackups(): Promise<Backup[]> {

    const backups = await this.backups.collection('backups').find({}).toArray()
    
    return backups.map(backup => ({
      _id: backup._id.toString(),
      workspaceId: backup.workspaceId,
      name: backup.name,
      createdOn: backup.createdOn || Date.now(),
      size: backup.size || 0,
      status: backup.status || 'pending'
    }))
  }

  async createBackup(workspaceId: string): Promise<Backup> {
    
    
    // Check if workspace exists
    const workspace = await this.backups.collection('workspaces').findOne({ _id: workspaceId } as any)
    if (!workspace) {
      throw new Error('Workspace not found')
    }

    const backup: Backup = {
      _id: `backup:${Date.now()}`,
      workspaceId,
      name: `backup-${workspace.name}-${new Date().toISOString().split('T')[0]}`,
      createdOn: Date.now(),
      size: 0, // Would be calculated in real implementation
      status: 'pending'
    }

    await this.backups.collection('backups').insertOne(backup as any)
    
    // Simulate backup completion
    setTimeout(async () => {
      await this.updateBackupStatus(backup._id, 'completed', 1024 * 1024 * 50) // 50MB
    }, 1000)

    return backup
  }

  async getBackup(backupId: string): Promise<Backup | null> {
    
    const backup = await this.backups.collection('backups').findOne({ _id: backupId } as any)
    
    if (!backup) return null

    return {
      _id: backup._id.toString(),
      workspaceId: backup.workspaceId,
      name: backup.name,
      createdOn: backup.createdOn || Date.now(),
      size: backup.size || 0,
      status: backup.status || 'pending'
    }
  }

  async restoreBackup(backupId: string): Promise<{ success: boolean; message: string }> {
    const backup = await this.getBackup(backupId)
    if (!backup) {
      throw new Error('Backup not found')
    }

    // In real implementation, would restore data from backup
    // For now, just simulate the process
    return { success: true, message: 'Backup restored successfully' }
  }

  async deleteBackup(backupId: string): Promise<void> {
    
    const result = await this.backups.collection('backups').deleteOne({ _id: backupId } as any)
    
    if (result.deletedCount === 0) {
      throw new Error('Backup not found')
    }
  }

  async listWorkspaceBackups(workspaceId: string): Promise<Backup[]> {
    
    const backups = await this.backups.collection('backups').find({ workspaceId }).toArray()
    
    return backups.map(backup => ({
      _id: backup._id.toString(),
      workspaceId: backup.workspaceId,
      name: backup.name,
      createdOn: backup.createdOn || Date.now(),
      size: backup.size || 0,
      status: backup.status || 'pending'
    }))
  }

  private async updateBackupStatus(backupId: string, status: Backup['status'], size?: number): Promise<void> {
    
    const updates: any = { status }
    if (size) updates.size = size
    
    await this.backups.collection('backups').updateOne(
      { _id: backupId } as any,
      { $set: updates }
    )
  }
}
