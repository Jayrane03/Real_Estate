import { Router } from 'express'
import { listInquiries, updateInquiryStatus } from '../controllers/inquiryController.js'
import { validate } from '../middleware/validate.js'
import { idParamsSchema, inquiryQuerySchema, inquiryStatusSchema } from '../validators/schemas.js'

const router = Router()

router.get('/', validate({ query: inquiryQuerySchema }), listInquiries)
router.patch('/:id', validate({ params: idParamsSchema, body: inquiryStatusSchema }), updateInquiryStatus)

export default router