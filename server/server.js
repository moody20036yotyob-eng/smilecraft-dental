require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')

const authRouter = require('./routes/auth')
const doctorsRouter = require('./routes/doctors')
const servicesRouter = require('./routes/services')
const contentRouter = require('./routes/content')

const app = express()

// Trust proxy (needed when behind Nginx/CDN)
app.set('trust proxy', 1)

// Security headers via Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
}))

// CORS — allow frontend origin only
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5174').split(',')
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    cb(new Error('Not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// HTTP Parameter Pollution protection
app.use(hpp())

// Body parser with size limit to prevent large payload attacks
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// Global rate limiter: 100 req / 15 min per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
})
app.use('/api/', globalLimiter)

// Strict rate limiter for auth: 10 attempts / 15 min
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts, please try again in 15 minutes.' },
})
app.use('/api/auth', authLimiter)

app.disable('x-powered-by')

// Routes
app.use('/api/auth', authRouter)
app.use('/api/doctors', doctorsRouter)
app.use('/api/services', servicesRouter)
app.use('/api/content', contentRouter)

app.get('/api/health', (_req, res) => res.json({ ok: true }))

// 404 for unknown API routes
app.use('/api/*', (_req, res) => res.status(404).json({ error: 'Not found' }))

// Global error handler — never leak stack traces to client
app.use((err, _req, res, _next) => {
  const status = err.status || 500
  res.status(status).json({ error: err.message || 'Internal server error' })
})

const PORT = process.env.PORT || 4001
app.listen(PORT, () => console.log(`SmileCraft server running on port ${PORT}`))
