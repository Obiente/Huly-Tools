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
  name: string
  description?: string
  owner: string
  members: string[]
  createdOn: number
  disabled: boolean
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
