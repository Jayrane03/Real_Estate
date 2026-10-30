import { z } from 'zod'

const imageUrl = z.string().trim().url().or(z.literal(''))

export const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(200),
})

export const inquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional().default(''),
  message: z.string().trim().min(8).max(2000),
  propertyId: z.string().regex(/^[a-f\d]{24}$/i).optional(),
})

export const propertySchema = z.object({
  title: z.string().trim().min(4).max(120),
  excerpt: z.string().trim().max(240).optional().default(''),
  description: z.string().trim().max(10000).optional().default(''),
  type: z.enum(['Apartment', 'House', 'Condo', 'Townhouse', 'Penthouse']).default('Apartment'),
  status: z.enum(['draft', 'published']).default('draft'),
  price: z.coerce.number().finite().min(0),
  address: z.string().trim().min(5).max(300),
  neighborhood: z.string().trim().max(120).optional().default(''),
  city: z.string().trim().max(120).optional().default('Mumbai'),
  beds: z.coerce.number().finite().min(0).default(0),
  baths: z.coerce.number().finite().min(0).default(0),
  area: z.coerce.number().finite().min(0).default(0),
  featured: z.boolean().optional().default(false),
  coverImage: imageUrl.optional().default(''),
  gallery: z.array(imageUrl).max(30).optional().default([]),
  amenities: z.array(z.object({ name: z.string().trim().min(1).max(100), icon: z.string().max(40).optional() })).max(40).optional().default([]),
  floorPlans: z.array(z.object({
    name: z.string().trim().min(1).max(100),
    beds: z.coerce.number().finite().min(0).default(0),
    baths: z.coerce.number().finite().min(0).default(0),
    area: z.coerce.number().finite().min(0).default(0),
    image: imageUrl.optional().default(''),
  })).max(20).optional().default([]),
  seo: z.object({
    title: z.string().trim().max(160).optional().default(''),
    description: z.string().trim().max(320).optional().default(''),
    keywords: z.string().trim().max(500).optional().default(''),
  }).optional().default({}),
})

export const propertyQuerySchema = z.object({
  search: z.string().trim().max(120).optional().default(''),
  status: z.enum(['all', 'draft', 'published']).optional().default('all'),
  limit: z.coerce.number().int().min(1).max(100).optional().default(100),
})

export const publicPropertyQuerySchema = z.object({
  search: z.string().trim().max(120).optional().default(''),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
})

export const slugParamsSchema = z.object({ slug: z.string().trim().min(1).max(180) })
export const idParamsSchema = z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) })

export const inquiryQuerySchema = z.object({
  search: z.string().trim().max(120).optional().default(''),
  status: z.enum(['all', 'new', 'contacted', 'closed']).optional().default('all'),
})

export const inquiryStatusSchema = z.object({
  status: z.enum(['new', 'contacted', 'closed']),
})

export const siteContentSchema = z.object({
  brandName: z.string().trim().min(2).max(100),
  brandDescriptor: z.string().trim().min(2).max(100),
  headline: z.string().trim().min(5).max(180),
  subheadline: z.string().trim().min(5).max(300),
  heroImage: imageUrl,
  contactEmail: z.string().trim().email().max(254),
  phone: z.string().trim().min(5).max(40),
  notice: z.object({
    location: z.string().trim().min(2).max(160),
    registration: z.string().trim().min(2).max(120),
    conciergeLabel: z.string().trim().min(2).max(60),
  }),
  navigation: z.object({
    residences: z.string().trim().min(2).max(60),
    address: z.string().trim().min(2).max(60),
    amenities: z.string().trim().min(2).max(60),
    gallery: z.string().trim().min(2).max(60),
    enquire: z.string().trim().min(2).max(60),
  }),
  hero: z.object({
    eyebrow: z.string().trim().min(2).max(100),
    title: z.string().trim().min(2).max(100),
    highlight: z.string().trim().min(2).max(100),
    description: z.string().trim().min(2).max(240),
    secondaryLine: z.string().trim().min(2).max(240),
    cta: z.string().trim().min(2).max(100),
    coordinates: z.string().trim().min(2).max(80),
    location: z.string().trim().min(2).max(100),
    counter: z.string().trim().min(2).max(40),
    collection: z.string().trim().min(2).max(100),
    scrollLabel: z.string().trim().min(2).max(100),
  }),
  story: z.object({
    index: z.string().trim().min(2).max(100),
    eyebrow: z.string().trim().min(2).max(100),
    heading: z.string().trim().min(2).max(120),
    highlight: z.string().trim().min(2).max(120),
    body: z.string().trim().min(10).max(1200),
    addressLabel: z.string().trim().min(2).max(100),
    address: z.string().trim().min(2).max(300),
    cta: z.string().trim().min(2).max(120),
  }),
  residences: z.object({
    eyebrow: z.string().trim().min(2).max(100),
    heading: z.string().trim().min(2).max(100),
    highlight: z.string().trim().min(2).max(100),
    searchPlaceholder: z.string().trim().min(2).max(100),
    cta: z.string().trim().min(2).max(120),
  }),
  propertyDetail: z.object({
    backLabel: z.string().trim().min(2).max(80),
    eyebrow: z.string().trim().min(2).max(100),
    heading: z.string().trim().min(2).max(120),
    highlight: z.string().trim().min(2).max(120),
    amenitiesLabel: z.string().trim().min(2).max(100),
    floorPlansLabel: z.string().trim().min(2).max(100),
    asideEyebrow: z.string().trim().min(2).max(100),
    asideHeading: z.string().trim().min(2).max(120),
    asideHighlight: z.string().trim().min(2).max(120),
    asideDescription: z.string().trim().min(10).max(300),
    asideCta: z.string().trim().min(2).max(120),
    startingAtLabel: z.string().trim().min(2).max(60),
  }),
  gallery: z.object({
    eyebrow: z.string().trim().min(2).max(100),
    heading: z.string().trim().min(2).max(120),
    highlight: z.string().trim().min(2).max(120),
    image: imageUrl,
    linkLabel: z.string().trim().min(2).max(100),
  }),
  amenities: z.object({
    index: z.string().trim().min(2).max(100),
    eyebrow: z.string().trim().min(2).max(100),
    heading: z.string().trim().min(2).max(120),
    highlight: z.string().trim().min(2).max(120),
    items: z.array(z.object({
      number: z.string().trim().min(1).max(10),
      name: z.string().trim().min(2).max(100),
    })).min(1).max(12),
  }),
  contact: z.object({
    eyebrow: z.string().trim().min(2).max(100),
    heading: z.string().trim().min(2).max(120),
    highlight: z.string().trim().min(2).max(120),
    description: z.string().trim().min(10).max(500),
    formEyebrow: z.string().trim().min(2).max(100),
    formHeading: z.string().trim().min(2).max(120),
    submitLabel: z.string().trim().min(2).max(120),
    successHeading: z.string().trim().min(2).max(120),
    successMessage: z.string().trim().min(10).max(300),
    privacyNote: z.string().trim().min(2).max(160),
  }),
  footer: z.object({
    address: z.string().trim().min(2).max(200),
    registration: z.string().trim().min(2).max(120),
  }),
  seo: z.object({
    title: z.string().trim().min(5).max(160),
    description: z.string().trim().min(10).max(320),
    keywords: z.string().trim().max(500).optional().default(''),
  }),
})