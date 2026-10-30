import Inquiry from '../models/Inquiry.js'
import Property from '../models/Property.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { recordActivity } from '../utils/activity.js'
import { escapeRegex } from '../utils/slug.js'

export const createInquiry = asyncHandler(async (req, res) => {
  const { propertyId, ...values } = req.validated.body
  let property
  if (propertyId) {
    property = await Property.findOne({ _id: propertyId, status: 'published' }).select('_id title')
    if (!property) return res.status(400).json({ message: 'The selected residence is unavailable.' })
  }
  const inquiry = await Inquiry.create({
    ...values,
    property: property?._id,
    propertyTitle: property?.title || '',
  })
  res.status(201).json({ message: 'Your enquiry has been received.', id: inquiry.id })
})

export const listInquiries = asyncHandler(async (req, res) => {
  const { search, status } = req.validated.query
  const filter = {}
  if (status !== 'all') filter.status = status
  if (search) {
    const expression = new RegExp(escapeRegex(search), 'i')
    filter.$or = [{ name: expression }, { email: expression }, { propertyTitle: expression }, { message: expression }]
  }
  const items = await Inquiry.find(filter).sort({ createdAt: -1 }).limit(200).lean()
  res.json({ items })
})

export const updateInquiryStatus = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findByIdAndUpdate(
    req.validated.params.id,
    { status: req.validated.body.status },
    { new: true, runValidators: true },
  )
  if (!inquiry) return res.status(404).json({ message: 'Inquiry not found.' })
  await recordActivity({ actor: req.user, action: 'updated', entity: 'buyer inquiry', entityId: inquiry.id, details: inquiry.status })
  res.json(inquiry)
})