import cors from 'cors'
import express, { type NextFunction, type Request, type Response } from 'express'
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet'
import { clerkMiddleware, getAuth } from '@clerk/express'
import { databaseConfigured, withUserTransaction } from './database.js'

const DEFAULT_WEB_ORIGIN = 'http://localhost:5173'
const allowedOrigins = (process.env.WEB_ORIGINS ?? DEFAULT_WEB_ORIGIN)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

export function createApp() {
  const app = express()
  const authConfigured = Boolean(
    process.env.CLERK_SECRET_KEY?.trim() &&
    process.env.CLERK_PUBLISHABLE_KEY?.trim(),
  )

  app.disable('x-powered-by')
  app.set('trust proxy', 1)
  app.use(helmet())
  app.use(cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }
      callback(new Error('Origin is not allowed by RiftPulse API CORS policy'))
    },
    methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
    maxAge: 600,
  }))
  app.use(express.json({ limit: '10kb', strict: true }))

  app.get('/api/_healthcheck', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      service: 'riftpulse-api',
      authConfigured,
      databaseConfigured,
    })
  })

  if (authConfigured) app.use(clerkMiddleware())

  app.use('/api', rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 120,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Too many requests. Please try again shortly.' },
  }))

  app.get('/api/me', async (req: Request, res: Response, next: NextFunction) => {
    if (!authConfigured) {
      res.status(503).json({ error: 'Authentication is not configured on this API.' })
      return
    }

    try {
      const { isAuthenticated, userId, sessionId } = getAuth(req)
      if (!isAuthenticated || !userId) {
        res.status(401).json({ error: 'Authentication required.' })
        return
      }
      if (!databaseConfigured) {
        res.status(503).json({ error: 'Database persistence is not configured.' })
        return
      }

      const profile = await withUserTransaction(userId, async (client) => {
        const profileResult = await client.query(
          `INSERT INTO public.user_profiles (clerk_user_id)
           VALUES ($1)
           ON CONFLICT (clerk_user_id) DO UPDATE SET updated_at = now()
           RETURNING clerk_user_id, display_name, locale, created_at, updated_at`,
          [userId],
        )
        await client.query(
          `INSERT INTO public.user_settings (clerk_user_id)
           VALUES ($1) ON CONFLICT (clerk_user_id) DO NOTHING`,
          [userId],
        )
        await client.query(
          `INSERT INTO public.subscriptions (clerk_user_id)
           VALUES ($1) ON CONFLICT (clerk_user_id) DO NOTHING`,
          [userId],
        )
        return profileResult.rows[0]
      })

      res.setHeader('Cache-Control', 'no-store')
      res.status(200).json({
        authenticated: true,
        user: { userId },
        session: { sessionId: sessionId ?? null },
        profile,
      })
    } catch (error) {
      next(error)
    }
  })

  app.get('/api/settings', async (req: Request, res: Response, next: NextFunction) => {
    if (!authConfigured) {
      res.status(503).json({ error: 'Authentication is not configured on this API.' })
      return
    }
    try {
      const { isAuthenticated, userId } = getAuth(req)
      if (!isAuthenticated || !userId) {
        res.status(401).json({ error: 'Authentication required.' })
        return
      }
      if (!databaseConfigured) {
        res.status(503).json({ error: 'Database persistence is not configured.' })
        return
      }
      const settings = await withUserTransaction(userId, async (client) => {
        await client.query(
          'INSERT INTO public.user_profiles (clerk_user_id) VALUES ($1) ON CONFLICT (clerk_user_id) DO NOTHING',
          [userId],
        )
        await client.query(
          'INSERT INTO public.user_settings (clerk_user_id) VALUES ($1) ON CONFLICT (clerk_user_id) DO NOTHING',
          [userId],
        )
        const result = await client.query(
          'SELECT settings_version, settings, updated_at FROM public.user_settings WHERE clerk_user_id = $1',
          [userId],
        )
        return result.rows[0]
      })
      res.setHeader('Cache-Control', 'no-store')
      res.status(200).json({ settings })
    } catch (error) {
      next(error)
    }
  })

  app.put('/api/settings', async (req: Request, res: Response, next: NextFunction) => {
    if (!authConfigured) {
      res.status(503).json({ error: 'Authentication is not configured on this API.' })
      return
    }
    try {
      const { isAuthenticated, userId } = getAuth(req)
      if (!isAuthenticated || !userId) {
        res.status(401).json({ error: 'Authentication required.' })
        return
      }
      if (!databaseConfigured) {
        res.status(503).json({ error: 'Database persistence is not configured.' })
        return
      }
      const settings = req.body?.settings
      if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
        res.status(400).json({ error: 'Settings must be a JSON object.' })
        return
      }
      const serialized = JSON.stringify(settings)
      if (serialized.length > 8000) {
        res.status(413).json({ error: 'Settings payload is too large.' })
        return
      }

      const saved = await withUserTransaction(userId, async (client) => {
        await client.query(
          'INSERT INTO public.user_profiles (clerk_user_id) VALUES ($1) ON CONFLICT (clerk_user_id) DO NOTHING',
          [userId],
        )
        const result = await client.query(
          `INSERT INTO public.user_settings (clerk_user_id, settings, settings_version, updated_at)
           VALUES ($1, $2::jsonb, 1, now())
           ON CONFLICT (clerk_user_id) DO UPDATE
             SET settings = EXCLUDED.settings,
                 settings_version = public.user_settings.settings_version + 1,
                 updated_at = now()
           RETURNING settings_version, settings, updated_at`,
          [userId, serialized],
        )
        return result.rows[0]
      })
      res.setHeader('Cache-Control', 'no-store')
      res.status(200).json({ settings: saved })
    } catch (error) {
      next(error)
    }
  })

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found.' })
  })

  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const status = error instanceof Error && error.message.includes('Origin is not allowed')
      ? 403
      : 500
    res.status(status).json({ error: status === 403 ? 'Origin is not allowed.' : 'Internal server error.' })
  })

  return app
}
