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

export { router as statsRouter }
