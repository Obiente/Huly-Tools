/**
 * Common types for Huly Admin API
 * Based on the official Huly platform patterns
 */
import { type AccountUuid, type WorkspaceUuid, AccountRole } from '@hcengineering/core'

export interface HulyConfig {
  mongoUrl: string
  transactorUrl: string
  accountUrl: string
  frontUrl: string
  accountDbUrl?: string
}

export interface Account {
  _id: string
  uuid: AccountUuid
  email: string
  first: string
  last: string
  hash: string
  salt: string
  workspaces: WorkspaceUuid[]
  createdOn: number
  lastVisit?: number
  confirmed?: boolean
  role?: AccountRole
}

export interface AccountInfo {
  uuid: AccountUuid
  email: string
  first: string
  last: string
  workspaces: WorkspaceUuid[]
  createdOn: number
  lastVisit?: number
  confirmed?: boolean
  role?: AccountRole
}

export interface CreateAccountRequest {
  email: string
  first: string
  last: string
  password: string
  role?: AccountRole
}

export interface UpdateAccountRequest {
  first?: string
  last?: string
  password?: string
  role?: AccountRole
}

export interface AccountListOptions {
  limit?: number
  skip?: number
  search?: string
  role?: AccountRole
  confirmed?: boolean
}

export type WorkspaceMode = 'active' | 'creating' | 'pending-creation' | 'upgrading' | 'disabled' | 'archived'

export interface Workspace {
  _id: string
  uuid: WorkspaceUuid
  name: string
  url: string
  dataId?: string
  description?: string
  owner: AccountUuid
  createdOn: number
  createdBy: AccountUuid
  lastVisit?: number
  mode: WorkspaceMode
  disabled?: boolean
  version?: {
    major: number
    minor: number
    patch: number
  }
  region?: string
  branding?: unknown
  accounts: AccountUuid[]
}

export interface WorkspaceInfo {
  uuid: WorkspaceUuid
  name: string
  url: string
  dataId?: string
  description?: string
  owner: AccountUuid
  createdOn: number
  createdBy: AccountUuid
  lastVisit?: number
  mode: WorkspaceMode
  disabled?: boolean
  version?: {
    major: number
    minor: number
    patch: number
  }
  region?: string
  branding?: any
  memberCount: number
}

export interface WorkspaceMember {
  accountUuid: AccountUuid
  workspaceUuid: WorkspaceUuid
  role: AccountRole
  addedOn?: number
}

export interface CreateWorkspaceRequest {
  name: string
  url: string
  description?: string
  owner: AccountUuid
  region?: string
}

export interface WorkspaceListOptions {
  limit?: number
  skip?: number
  search?: string
  owner?: AccountUuid
  mode?: WorkspaceMode
  disabled?: boolean
}

export interface BackupInfo {
  _id: string
  uuid: string
  workspaceUuid: WorkspaceUuid
  name: string
  description?: string
  createdOn: number
  createdBy: AccountUuid
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
  size?: number
  error?: string
}

export interface CreateBackupRequest {
  workspaceUuid: WorkspaceUuid
  name: string
  description?: string
}

export interface BackupListOptions {
  limit?: number
  skip?: number
  workspaceUuid?: WorkspaceUuid
  status?: BackupInfo['status']
}

export interface RestoreRequest {
  backupUuid: string
  targetWorkspaceUuid: WorkspaceUuid
}

export interface DatabaseStats {
  accounts: number
  workspaces: number
  backups: number
  collections: number
  totalSize: number
  indexes: number
}

export interface SystemStats {
  database: DatabaseStats
  uptime: number
  memory: NodeJS.MemoryUsage
  timestamp: number
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
