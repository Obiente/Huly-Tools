import { Router } from 'express'

const router: Router = Router()

// GET /api/backup - List all backups
router.get('/', async (req, res, next) => {
  try {
    const backups = await req.huly.listBackups()
    res.json(backups)
  } catch (error) {
    next(error)
  }
})

// POST /api/backup - Create new backup
router.post('/', async (req, res, next) => {
  try {
    const { workspaceId } = req.body
    
    if (!workspaceId) {
      return res.status(400).json({ error: 'Missing workspaceId' })
    }

    const backup = await req.huly.createBackup(workspaceId)
    res.status(201).json(backup)
  } catch (error) {
    next(error)
  }
})

// POST /api/backup/restore - Restore from backup
router.post('/restore', async (req, res, next) => {
  try {
    const { backupId } = req.body
    
    if (!backupId) {
      return res.status(400).json({ error: 'Missing backupId' })
    }

    const result = await req.huly.restoreBackup(backupId)
    res.json(result)
  } catch (error) {
    next(error)
  }
})

export { router as backupRouter }
