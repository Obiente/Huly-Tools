import { DatabaseConnection } from '../database/connection.ts'
import type { Workspace } from '@huly-tools/types'

export class WorkspaceOperations {
  private db: DatabaseConnection

  constructor(db: DatabaseConnection) {
    this.db = db
  }

  async listWorkspaces(): Promise<Workspace[]> {
    const db = this.db.getAccountDb()
    const workspaces = await db.collection('workspace').find({}).toArray()

    return workspaces.map(ws => ({
      _id: ws._id?.toString?.() ?? ws._id,
      workspace: ws.workspace,
      workspaceUrl: ws.workspaceUrl,
      version: ws.version,
      branding: ws.branding,
      workspaceName: ws.workspaceName,
      accounts: (ws.accounts || []).map((acc: any) => typeof acc === 'string' ? acc : acc?.$oid ?? acc),
      disabled: ws.disabled ?? false,
      region: ws.region || '',
      mode: ws.mode,
      progress: ws.progress,
      createdOn: ws.createdOn,
      lastVisit: ws.lastVisit,
      createdBy: ws.createdBy,
      lastProcessingTime: ws.lastProcessingTime,
      attempts: ws.attempts,
      uuid: ws.uuid,
      message: ws.message
    }))
  }

  async getWorkspace(workspaceId: string): Promise<Workspace | null> {
    const db = this.db.getAccountDb()
    const workspace = await db.collection('workspace').findOne({ _id: workspaceId } as any)

    if (!workspace) return null

    return {
      _id: workspace._id?.toString?.() ?? workspace._id,
      workspace: workspace.workspace,
      workspaceUrl: workspace.workspaceUrl,
      version: workspace.version,
      branding: workspace.branding,
      workspaceName: workspace.workspaceName,
      accounts: (workspace.accounts || []).map((acc: any) => typeof acc === 'string' ? acc : acc?.$oid ?? acc),
      disabled: workspace.disabled ?? false,
      region: workspace.region || '',
      mode: workspace.mode,
      progress: workspace.progress,
      createdOn: workspace.createdOn,
      lastVisit: workspace.lastVisit,
      createdBy: workspace.createdBy,
      lastProcessingTime: workspace.lastProcessingTime,
      attempts: workspace.attempts,
      uuid: workspace.uuid,
      message: workspace.message
    }
  }

  async updateWorkspace(workspaceId: string, updates: Partial<Workspace>): Promise<Workspace> {
    const db = this.db.getAccountDb()
    const result = await db.collection('workspace').findOneAndUpdate(
      { _id: workspaceId } as any,
      { $set: updates },
      { returnDocument: 'after' }
    )
    if (!result?.value) {
      throw new Error('Workspace not found')
    }
    return result.value as Workspace
  }

  async deleteWorkspace(workspaceId: string): Promise<void> {
    const db = this.db.getAccountDb()
    const result = await db.collection('workspace').deleteOne({ _id: workspaceId } as any)
    if (result.deletedCount === 0) {
      throw new Error('Workspace not found')
    }
    //TODO: Handle cleanup of related data if necessary
  }

  async addMember(workspaceId: string, userId: string): Promise<Workspace> {
    const db = this.db.getAccountDb()
    // Check if workspace exists
    const workspace = await db.collection('workspace').findOne({ _id: workspaceId } as any)
    if (!workspace) {
      throw new Error('Workspace not found')
    }
    // Check if user is already a member
    if ((workspace.accounts || []).some((acc: any) => (typeof acc === 'string' ? acc : acc?.$oid) === userId)) {
      throw new Error('User is already a member of this workspace')
    }
    // Add user to workspace
    const result = await db.collection('workspace').findOneAndUpdate(
      { _id: workspaceId } as any,
      { $push: { accounts: userId } } as any,
      { returnDocument: 'after' }
    )
    if (!result?.value) {
      throw new Error('Failed to add member')
    }
    return result.value as Workspace
  }

  async removeMember(workspaceId: string, userId: string): Promise<Workspace> {
    const db = this.db.getAccountDb()
    // Check if workspace exists
    const workspace = await db.collection('workspace').findOne({ _id: workspaceId } as any)
    if (!workspace) {
      throw new Error('Workspace not found')
    }
    // Remove user from workspace
    const result = await db.collection('workspace').findOneAndUpdate(
      { _id: workspaceId } as any,
      { $pull: { accounts: userId } } as any,
      { returnDocument: 'after' }
    )
    if (!result?.value) {
      throw new Error('Failed to remove member')
    }
    return result.value as Workspace
  }

  async enableWorkspace(workspaceId: string): Promise<Workspace> {
    const db = this.db.getAccountDb()
    const result = await db.collection('workspace').findOneAndUpdate(
      { _id: workspaceId } as any,
      { $set: { disabled: false } },
      { returnDocument: 'after' }
    )
    if (!result?.value) {
      throw new Error('Workspace not found')
    }
    return result.value as Workspace
  }

  async disableWorkspace(workspaceId: string): Promise<Workspace> {
    const db = this.db.getAccountDb()
    const result = await db.collection('workspace').findOneAndUpdate(
      { _id: workspaceId } as any,
      { $set: { disabled: true } },
      { returnDocument: 'after' }
    )
    if (!result?.value) {
      throw new Error('Workspace not found')
    }
    return result.value as Workspace
  }
}
