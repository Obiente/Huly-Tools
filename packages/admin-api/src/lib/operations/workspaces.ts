import { DatabaseConnection } from '../database/connection'
import type { Workspace } from '../types'

export class WorkspaceOperations {
  private db: DatabaseConnection

  constructor(db: DatabaseConnection) {
    this.db = db
  }

  async listWorkspaces(): Promise<Workspace[]> {
    const hulyDb = this.db.getHulyDb()
    const workspaces = await hulyDb.collection('workspaces').find({}).toArray()
    
    return workspaces.map(ws => ({
      _id: ws._id.toString(),
      name: ws.name,
      description: ws.description || '',
      owner: ws.owner,
      members: ws.members || [],
      createdOn: ws.createdOn || Date.now(),
      disabled: ws.disabled || false
    }))
  }

  async createWorkspace(workspaceData: {
    name: string
    description?: string
    owner: string
  }): Promise<Workspace> {
    const hulyDb = this.db.getHulyDb()
    
    // Check if workspace exists
    const existing = await hulyDb.collection('workspaces').findOne({ name: workspaceData.name })
    if (existing) {
      throw new Error('Workspace already exists')
    }

    const workspace: Workspace = {
      _id: `workspace:${Date.now()}`,
      name: workspaceData.name,
      description: workspaceData.description || '',
      owner: workspaceData.owner,
      members: [workspaceData.owner],
      createdOn: Date.now(),
      disabled: false
    }

    await hulyDb.collection('workspaces').insertOne(workspace as any)
    return workspace
  }

  async getWorkspace(workspaceId: string): Promise<Workspace | null> {
    const hulyDb = this.db.getHulyDb()
    const workspace = await hulyDb.collection('workspaces').findOne({ _id: workspaceId } as any)
    
    if (!workspace) return null

    return {
      _id: workspace._id.toString(),
      name: workspace.name,
      description: workspace.description || '',
      owner: workspace.owner,
      members: workspace.members || [],
      createdOn: workspace.createdOn || Date.now(),
      disabled: workspace.disabled || false
    }
  }

  async updateWorkspace(workspaceId: string, updates: Partial<Workspace>): Promise<Workspace> {
    const hulyDb = this.db.getHulyDb()
    const result = await hulyDb.collection('workspaces').findOneAndUpdate(
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
    const hulyDb = this.db.getHulyDb()
    const result = await hulyDb.collection('workspaces').deleteOne({ _id: workspaceId } as any)
    
    if (result.deletedCount === 0) {
      throw new Error('Workspace not found')
    }
  }

  async addMember(workspaceId: string, userId: string): Promise<Workspace> {
    const hulyDb = this.db.getHulyDb()
    
    // Check if workspace exists
    const workspace = await hulyDb.collection('workspaces').findOne({ _id: workspaceId } as any)
    if (!workspace) {
      throw new Error('Workspace not found')
    }

    // Check if user is already a member
    if (workspace.members?.includes(userId)) {
      throw new Error('User is already a member of this workspace')
    }

    // Add user to workspace
    const result = await hulyDb.collection('workspaces').findOneAndUpdate(
      { _id: workspaceId } as any,
      { $push: { members: userId } } as any,
      { returnDocument: 'after' }
    )
    
    if (!result?.value) {
      throw new Error('Failed to add member')
    }
    
    return result.value as Workspace
  }

  async removeMember(workspaceId: string, userId: string): Promise<Workspace> {
    const hulyDb = this.db.getHulyDb()
    
    // Check if workspace exists
    const workspace = await hulyDb.collection('workspaces').findOne({ _id: workspaceId } as any)
    if (!workspace) {
      throw new Error('Workspace not found')
    }

    // Don't allow removing the owner
    if (workspace.owner === userId) {
      throw new Error('Cannot remove the owner from workspace')
    }

    // Remove user from workspace
    const result = await hulyDb.collection('workspaces').findOneAndUpdate(
      { _id: workspaceId } as any,
      { $pull: { members: userId } } as any,
      { returnDocument: 'after' }
    )
    
    if (!result?.value) {
      throw new Error('Failed to remove member')
    }
    
    return result.value as Workspace
  }

  async enableWorkspace(workspaceId: string): Promise<Workspace> {
    const hulyDb = this.db.getHulyDb()
    
    const result = await hulyDb.collection('workspaces').findOneAndUpdate(
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
    const hulyDb = this.db.getHulyDb()
    
    const result = await hulyDb.collection('workspaces').findOneAndUpdate(
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
