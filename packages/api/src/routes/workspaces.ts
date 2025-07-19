import { Router } from 'express'

const router: Router = Router()

// GET /api/workspaces - List all workspaces
router.get('/', async (req, res, next) => {
  try {
    const workspaces = await req.huly.listWorkspaces()
    res.json(workspaces)
  } catch (error) {
    next(error)
  }
})

// POST /api/workspaces - Create new workspace
router.post('/', async (req, res, next) => {
  try {
    const { name, description, owner } = req.body
    
    if (!name || !owner) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    //TODO:
    const workspace = await req.huly.createWorkspace({ name, description, owner })
    res.status(201).json(workspace)
  } catch (error) {
    next(error)
  }
})

// PUT /api/workspaces/:id - Update workspace
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const updates = req.body
    
    const workspace = await req.huly.updateWorkspace(id, updates)
    res.json(workspace)
  } catch (error) {
    next(error)
  }
})

// DELETE /api/workspaces/:id - Delete workspace
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    await req.huly.deleteWorkspace(id)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export { router as workspacesRouter }
