/**
 * Configuration management for Huly Admin API
 */
import { type Data, type Version } from '@hcengineering/core'

export interface HulyConfig {
  /** MongoDB connection URL */
  mongoUrl: string
  /** Account database URL (if different from mongo) */
  accountDbUrl?: string
  /** Transactor service URL */
  transactorUrl: string
  /** Account service URL */
  accountUrl: string
  /** Frontend URL */
  frontUrl: string
  /** API Key for authentication */
  apiKey: string
  /** Server secret for token generation */
  serverSecret: string
  /** Storage configuration */
  storageConfig?: string
  /** Elastic search URL */
  elasticUrl?: string
  /** Backup storage path */
  backupPath?: string
  /** Region identifier */
  region?: string
}

export interface AdminApiConfig extends HulyConfig {
  /** API server port */
  port: number
  /** CORS origin */
  corsOrigin: string
  /** Log level */
  logLevel: 'debug' | 'info' | 'warn' | 'error'
  /** Maximum request body size */
  maxRequestSize: string
  /** Request timeout in ms */
  requestTimeout: number
}

/**
 * Load configuration from environment variables
 */
export function loadConfig(): AdminApiConfig {
  const config: AdminApiConfig = {
    // Server configuration
    port: parseInt(process.env.PORT || '3001', 10),
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4321',
    logLevel: (process.env.LOG_LEVEL as any) || 'info',
    maxRequestSize: process.env.MAX_REQUEST_SIZE || '10mb',
    requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || '30000', 10),

    // Huly platform configuration
    mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017',
    accountDbUrl: process.env.ACCOUNT_DB_URL,
    transactorUrl: process.env.TRANSACTOR_URL || 'ws://localhost:3333',
    accountUrl: process.env.ACCOUNTS_URL || 'http://localhost:3000',
    frontUrl: process.env.FRONT_URL || 'http://localhost:8080',
    apiKey: process.env.API_KEY || '',
    serverSecret: process.env.SERVER_SECRET || '',
    storageConfig: process.env.STORAGE_CONFIG,
    elasticUrl: process.env.ELASTIC_URL,
    backupPath: process.env.BACKUP_PATH,
    region: process.env.REGION || ''
  }

  // Validate required configuration
  if (!config.apiKey) {
    throw new Error('API_KEY environment variable is required')
  }

  if (!config.serverSecret) {
    throw new Error('SERVER_SECRET environment variable is required')
  }

  return config
}

/**
 * Get current model version
 */
export function getModelVersion(): Data<Version> {
  const version = process.env.MODEL_VERSION || '0.6.0'
  const [major, minor, patch] = version.split('.').map(Number)
  
  return {
    major: major || 0,
    minor: minor || 6,
    patch: patch || 0
  }
}
