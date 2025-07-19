import { Request, Response, NextFunction } from 'express'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.header('X-API-Key') || req.query.apiKey as string
  const expectedApiKey = process.env.API_SECRET

  if (!expectedApiKey) {
    return res.status(500).json({ error: 'API authentication not configured' })
  }

  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' })
  }

  if (apiKey !== expectedApiKey) {
    return res.status(403).json({ error: 'Invalid API key' })
  }

  next()
}
