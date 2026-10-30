import cors from 'cors'
import cookieParser from 'cookie-parser'
import express from 'express'
import helmet from 'helmet'
import apiRoutes from './routes/index.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

const app = express()
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.disable('x-powered-by')
app.use(helmet())
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error('Origin is not allowed by CORS'))
  },
  credentials: true,
}))
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api', apiRoutes)
app.use(notFound)
app.use(errorHandler)

export default app