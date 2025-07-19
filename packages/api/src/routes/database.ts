import { Router } from 'express'

const router: Router = Router()

// POST /api/db/migrate - Run database migrations
router.post('/migrate', async (req, res, next) => {
  try {
    const result = await req.huly.runMigrations()
    res.json(result)
  } catch (error) {
    next(error)
  }
})

// GET /api/db/migration-status - Get migration status
router.get('/migration-status', async (req, res, next) => {
  try {
    const status = await req.huly.getMigrationStatus()
    res.json(status)
  } catch (error) {
    next(error)
  }
})

// POST /api/db/index - Rebuild indexes
router.post('/index', async (req, res, next) => {
  try {
    const result = await req.huly.rebuildIndexes()
    res.json(result)
  } catch (error) {
    next(error)
  }
})

// POST /api/db/index/create - Create essential indexes
router.post('/index/create', async (req, res, next) => {
  try {
    const result = await req.huly.createEssentialIndexes()
    res.json(result)
  } catch (error) {
    next(error)
  }
})

// POST /api/db/index/recreate - Recreate all indexes
router.post('/index/recreate', async (req, res, next) => {
  try {
    const result = await req.huly.recreateIndexes()
    res.json(result)
  } catch (error) {
    next(error)
  }
})

// POST /api/db/clean - Clean database
router.post('/clean', async (req, res, next) => {
  try {
    const result = await req.huly.cleanDatabase()
    res.json(result)
  } catch (error) {
    next(error)
  }
})

// POST /api/db/clean/workspace/:id - Clean specific workspace
router.post('/clean/workspace/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await req.huly.cleanWorkspace(id)
    res.json(result)
  } catch (error) {
    next(error)
  }
})

// GET /api/db/health - Check database health
router.get('/health', async (req, res, next) => {
  try {
    const health = await req.huly.checkHealth()
    res.json(health)
  } catch (error) {
    next(error)
  }
})

// GET /api/db/collections/:dbName - Get collection info
router.get('/collections/:dbName', async (req, res, next) => {
  try {
    const { dbName } = req.params
    const collections = await req.huly.getCollectionInfo(dbName)
    res.json(collections)
  } catch (error) {
    next(error)
  }
})

export { router as dbRouter }
