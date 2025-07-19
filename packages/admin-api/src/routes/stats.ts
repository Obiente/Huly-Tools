import { Router } from 'express'

const router: Router = Router()

// GET /api/stats - Get platform statistics
router.get('/', async (req, res, next) => {
  try {
    const stats = await req.huly.getStats()
    res.json(stats)
  } catch (error) {
    next(error)
  }
})

// GET /api/stats/system - Get system health information
router.get('/system', async (req, res, next) => {
  try {
    const stats = await req.huly.getStats()
    
    // Calculate uptime in human-readable format
    const uptime = formatUptime(stats.uptime)
    
    // Calculate memory usage percentage
    const memoryUsage = formatMemoryUsage(stats.memory)
    
    // Calculate storage usage
    const storageUsage = formatStorageUsage(stats.storageSize || 0)
    
    // Determine system health status
    const memoryUsagePercent = (stats.memory.heapUsed / stats.memory.heapTotal) * 100
    let status: 'healthy' | 'warning' | 'critical' = 'healthy'
    
    if (memoryUsagePercent > 90) {
      status = 'critical'
    } else if (memoryUsagePercent > 70) {
      status = 'warning'
    }

    res.json({
      status,
      uptime,
      memoryUsage,
      storageUsage,
      memoryUsagePercent,
      rawStats: stats
    })
  } catch (error) {
    next(error)
  }
})

// Helper functions
function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
}

function formatMemoryUsage(memory: any): string {
  const usedMB = Math.round(memory.heapUsed / 1024 / 1024)
  const totalMB = Math.round(memory.heapTotal / 1024 / 1024)
  return `${usedMB}MB / ${totalMB}MB`
}

function formatStorageUsage(storageSize: number): string {
  const sizeMB = Math.round(storageSize / 1024 / 1024)
  return `${sizeMB}MB`
}

export { router as statsRouter }
