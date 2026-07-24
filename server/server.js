require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const compression = require('compression')
const path = require('path')

const authRouter    = require('./routes/auth')
const doctorsRouter = require('./routes/doctors')
const servicesRouter = require('./routes/services')
const contentRouter = require('./routes/content')

const app = express()
const isProd = process.env.NODE_ENV === 'production'

app.set('trust proxy', 1)

// Gzip compress all responses
app.use(compression())

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'", "'unsafe-inline'"],
      styleSrc:   ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc:    ["'self'", 'https://fonts.gstatic.com'],
      imgSrc:     ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      frameSrc:   ["'none'"],
      objectSrc:  ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
}))

// CORS — in production the frontend is served by the same Express origin
const allowedOrigins = isProd
  ? [process.env.SITE_URL].filter(Boolean)
  : (process.env.ALLOWED_ORIGINS || 'http://localhost:5174').split(',')

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    cb(new Error('Not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(hpp())
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// Rate limiting
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
}))
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts, please try again in 15 minutes.' },
}))

app.disable('x-powered-by')

// API routes
app.use('/api/auth',     authRouter)
app.use('/api/doctors',  doctorsRouter)
app.use('/api/services', servicesRouter)
app.use('/api/content',  contentRouter)
app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api/*', (_req, res) => res.status(404).json({ error: 'Not found' }))

// Serve React build in production
if (isProd) {
  const clientDist = path.join(__dirname, '../client/dist')
  app.use(express.static(clientDist, { maxAge: '1y', etag: false }))
  // SPA fallback — all non-API routes return index.html
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'))
  })
}

// Global error handler
app.use((err, _req, res, _next) => {
  const status = err.status || 500
  res.status(status).json({ error: err.message || 'Internal server error' })
})

const PORT = process.env.PORT || 4001
app.listen(PORT, () => console.log(`SmileCraft server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`))
