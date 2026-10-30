import { Router } from 'express'
import authRoutes from './authRoutes.js'
import propertyRoutes from './propertyRoutes.js'
import inquiryRoutes from './inquiryRoutes.js'
import adminRoutes from './adminRoutes.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { getPublicProperty, listPublicProperties } from '../controllers/propertyController.js'
import { getPublicSiteContent } from '../controllers/adminController.js'
import { publicPropertyQuerySchema, slugParamsSchema } from '../validators/schemas.js'

const router = Router()

router.use('/auth', authRoutes)
router.get('/content', getPublicSiteContent)
router.get('/properties', validate({ query: publicPropertyQuerySchema }), listPublicProperties)
router.get('/properties/:slug', validate({ params: slugParamsSchema }), getPublicProperty)
router.use('/inquiries', inquiryRoutes)
router.use('/admin', requireAuth, requireRole('admin', 'editor'), adminRoutes)

export default router