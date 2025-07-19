import { Router } from 'express'

const router: Router = Router()

// GET /api/accounts - List all accounts
router.get('/', async (req, res, next) => {
  try {
    const accounts = await req.huly.listAccounts()
    res.json(accounts)
  } catch (error) {
    next(error)
  }
})

// POST /api/accounts - Create new account
router.post('/', async (req, res, next) => {
  try {
    const { email, first, last, password } = req.body
    
    if (!email || !first || !last || !password) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const account = await req.huly.createAccount({ email, first, last, password })
    res.status(201).json(account)
  } catch (error) {
    next(error)
  }
})

// PUT /api/accounts/:id - Update account
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const updates = req.body
    
    const account = await req.huly.updateAccount(id, updates)
    res.json(account)
  } catch (error) {
    next(error)
  }
})

// DELETE /api/accounts/:id - Delete account
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    await req.huly.deleteAccount(id)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export { router as accountsRouter }
