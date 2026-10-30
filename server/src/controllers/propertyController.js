import Property from '../models/Property.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { recordActivity } from '../utils/activity.js'
import { escapeRegex, slugify } from '../utils/slug.js'

async function uniqueSlug(title, currentId) {
  const base = slugify(title) || 'residence'
  let slug = base
  let suffix = 2
  while (await Property.exists({ slug, ...(currentId ? { _id: { $ne: currentId } } : {}) })) {
    slug = `${base}-${suffix++}`
  }
  return slug
}

export const listPublicProperties = asyncHandler(async (req, res) => {
  const { search, limit } = req.validated.query
  const filter = { status: 'published' }
  if (search) {
    const expression = new RegExp(escapeRegex(search), 'i')
    filter.$or = [{ title: expression }, { neighborhood: expression }, { city: expression }]
  }
  const items = await Property.find(filter)
    .sort({ featured: -1, updatedAt: -1 })
    .limit(limit)
    .lean()
  res.json({ items })
})

export const getPublicProperty = asyncHandler(async (req, res) => {
  const property = await Property.findOne({ slug: req.validated.params.slug, status: 'published' }).lean()
  if (!property) return res.status(404).json({ message: 'Residence not found.' })
  res.json(property)
})

export const listAdminProperties = asyncHandler(async (req, res) => {
  const { search, status, limit } = req.validated.query
  const filter = {}
  if (status !== 'all') filter.status = status
  if (search) {
    const expression = new RegExp(escapeRegex(search), 'i')
    filter.$or = [{ title: expression }, { address: expression }, { neighborhood: expression }, { city: expression }]
  }
  const items = await Property.find(filter).sort({ updatedAt: -1 }).limit(limit).lean()
  res.json({ items })
})

export const createProperty = asyncHandler(async (req, res) => {
  const values = req.validated.body
  const property = await Property.create({
    ...values,
    slug: await uniqueSlug(values.title),
    createdBy: req.user._id,
  })
  await recordActivity({ actor: req.user, action: 'created', entity: 'residence', entityId: property.id, details: property.title })
  res.status(201).json(property)
})

export const updateProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.validated.params.id)
  if (!property) return res.status(404).json({ message: 'Residence not found.' })

  const values = req.validated.body
  const titleChanged = values.title !== property.title
  Object.assign(property, values)
  if (titleChanged || !property.slug) {
    property.slug = await uniqueSlug(values.title, property._id)
  }
  await property.save()
  await recordActivity({ actor: req.user, action: 'updated', entity: 'residence', entityId: property.id, details: property.title })
  res.json(property)
})

export const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findByIdAndDelete(req.validated.params.id)
  if (!property) return res.status(404).json({ message: 'Residence not found.' })
  await recordActivity({ actor: req.user, action: 'deleted', entity: 'residence', entityId: property.id, details: property.title })
  res.json({ message: 'Residence deleted.' })
})

export const publishProperty = asyncHandler(async (req, res) => {
  const property = await Property.findByIdAndUpdate(
    req.validated.params.id,
    { status: 'published' },
    { new: true, runValidators: true },
  )
  if (!property) return res.status(404).json({ message: 'Residence not found.' })
  await recordActivity({ actor: req.user, action: 'published', entity: 'residence', entityId: property.id, details: property.title })
  res.json(property)
})