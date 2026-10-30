import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import { login, logout, currentUser } from '../controllers/authController.js'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { loginSchema } from '../validators/schemas.js'

const router = Router()
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many sign-in attempts. Please try again later.' },
})

router.post('/login', loginLimiter, validate({ body: loginSchema }), login)
router.post('/logout', logout)
router.get('/me', requireAuth, currentUser)

export default router