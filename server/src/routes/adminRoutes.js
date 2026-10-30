import { Router } from 'express'
import { dashboard, getSiteContent, listActivity, updateSiteContent } from '../controllers/adminController.js'
import propertyRoutes from './propertyRoutes.js'
import inquiryRoutes from './adminInquiryRoutes.js'
import { validate } from '../middleware/validate.js'
import { siteContentSchema } from '../validators/schemas.js'

const router = Router()

router.get('/dashboard', dashboard)
router.use('/properties', propertyRoutes)
router.use('/inquiries', inquiryRoutes)
router.get('/content', getSiteContent)
router.put('/content', validate({ body: siteContentSchema }), updateSiteContent)
router.get('/activity', listActivity)

export default router