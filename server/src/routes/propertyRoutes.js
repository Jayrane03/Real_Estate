import { Router } from 'express'
import {
  createProperty,
  deleteProperty,
  listAdminProperties,
  publishProperty,
  updateProperty,
} from '../controllers/propertyController.js'
import { validate } from '../middleware/validate.js'
import { idParamsSchema, propertyQuerySchema, propertySchema } from '../validators/schemas.js'

const router = Router()

router.get('/', validate({ query: propertyQuerySchema }), listAdminProperties)
router.post('/', validate({ body: propertySchema }), createProperty)
router.put('/:id', validate({ params: idParamsSchema, body: propertySchema }), updateProperty)
router.delete('/:id', validate({ params: idParamsSchema }), deleteProperty)
router.patch('/:id/publish', validate({ params: idParamsSchema }), publishProperty)

export default router