export interface Account {
  _id: string
  email: string
  first: string
  last: string
  confirmed: boolean
  createdOn: number
  workspaces: string[]
}

export interface Workspace {
  _id: string
  workspace: string
  workspaceUrl: string
  version?: any
  branding?: string
  workspaceName?: string
  accounts?: any[]
  disabled: boolean
  region?: string
  mode?: string
  progress?: number
  createdOn: number
  lastVisit?: number
  createdBy?: string
  lastProcessingTime?: number
  attempts?: number
  uuid?: string
  message?: string
}

export interface Backup {
  _id: string
  workspaceId: string
  name: string
  createdOn: number
  size: number
  status: 'pending' | 'completed' | 'failed'
}

export interface Stats {
  accounts: number
  workspaces: number
  backups: number
  uptime: number
  memory: any
  timestamp: number
}

export interface Config {
  mongoUrl: string
  apiSecret: string
  corsOrigin: string
  port: number
}
