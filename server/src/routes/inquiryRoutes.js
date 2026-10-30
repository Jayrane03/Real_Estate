import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import { createInquiry } from '../controllers/inquiryController.js'
import { validate } from '../middleware/validate.js'
import { inquirySchema } from '../validators/schemas.js'

const router = Router()
const inquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many enquiries were submitted. Please try again later.' },
})

router.post('/', inquiryLimiter, validate({ body: inquirySchema }), createInquiry)

export default router