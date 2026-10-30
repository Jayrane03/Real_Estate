import Inquiry from '../models/Inquiry.js'
import Property from '../models/Property.js'
import SiteContent from '../models/SiteContent.js'
import ActivityLog from '../models/ActivityLog.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { recordActivity } from '../utils/activity.js'

const contentSections = [
  'notice', 'navigation', 'hero', 'story', 'residences', 'propertyDetail',
  'gallery', 'amenities', 'contact', 'footer', 'seo',
]

async function loadSiteContent() {
  const stored = await SiteContent.findOneAndUpdate(
    { key: 'global' },
    { $setOnInsert: { key: 'global' } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  ).lean()
  const defaults = new SiteContent().toObject()
  const content = { ...defaults, ...stored }

  for (const section of contentSections) {
    content[section] = { ...defaults[section], ...stored[section] }
  }

  if (!stored.hero) {
    const headlineWords = stored.headline?.trim().split(/\s+/) || []
    if (headlineWords.length > 1) {
      content.hero.title = headlineWords.slice(0, -1).join(' ')
      content.hero.highlight = headlineWords[headlineWords.length - 1]
    } else {
      content.hero.title = stored.headline || content.hero.title
    }
    content.hero.description = stored.subheadline || content.hero.description
  }
  if (!stored.gallery?.image) content.gallery.image = stored.heroImage || content.gallery.image

  return content
}

export const dashboard = asyncHandler(async (req, res) => {
  const now = Date.now()
  const currentStart = new Date(now - 7 * 24 * 60 * 60 * 1000)
  const previousStart = new Date(now - 14 * 24 * 60 * 60 * 1000)
  const [totalInquiries, newInquiries, publishedProperties, draftProperties, currentWeek, previousWeek, inquiries, activity] = await Promise.all([
    Inquiry.countDocuments(),
    Inquiry.countDocuments({ status: 'new' }),
    Property.countDocuments({ status: 'published' }),
    Property.countDocuments({ status: 'draft' }),
    Inquiry.countDocuments({ createdAt: { $gte: currentStart } }),
    Inquiry.countDocuments({ createdAt: { $gte: previousStart, $lt: currentStart } }),
    Inquiry.find().sort({ createdAt: -1 }).limit(5).lean(),
    ActivityLog.find().sort({ createdAt: -1 }).limit(6).lean(),
  ])
  const change = previousWeek ? Math.round(((currentWeek - previousWeek) / previousWeek) * 100) : (currentWeek ? 100 : 0)
  res.json({
    stats: { totalInquiries, newInquiries, publishedProperties, draftProperties, inquiryChange: `${change}%` },
    inquiries,
    activity,
  })
})

export const getSiteContent = asyncHandler(async (req, res) => {
  res.json(await loadSiteContent())
})

export const getPublicSiteContent = asyncHandler(async (req, res) => {
  res.json(await loadSiteContent())
})

export const updateSiteContent = asyncHandler(async (req, res) => {
  const values = req.validated.body
  const content = await SiteContent.findOneAndUpdate(
    { key: 'global' },
    { $set: values, $setOnInsert: { key: 'global' } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
  )
  await recordActivity({ actor: req.user, action: 'updated', entity: 'site content', details: content.brandName })
  res.json(content)
})

export const listActivity = asyncHandler(async (req, res) => {
  const items = await ActivityLog.find().sort({ createdAt: -1 }).limit(100).lean()
  res.json({ items })
})