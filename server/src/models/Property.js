import mongoose from 'mongoose'

const amenitySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  icon: { type: String, default: 'Check' },
}, { _id: false })

const floorPlanSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  beds: { type: Number, min: 0, default: 0 },
  baths: { type: Number, min: 0, default: 0 },
  area: { type: Number, min: 0, default: 0 },
  image: { type: String, default: '' },
})

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  excerpt: { type: String, default: '', maxlength: 240 },
  description: { type: String, default: '' },
  type: { type: String, enum: ['Apartment', 'House', 'Condo', 'Townhouse', 'Penthouse'], default: 'Apartment' },
  status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
  price: { type: Number, required: true, min: 0 },
  address: { type: String, required: true, trim: true },
  neighborhood: { type: String, default: '', trim: true },
  city: { type: String, default: 'Mumbai', trim: true },
  beds: { type: Number, min: 0, default: 0 },
  baths: { type: Number, min: 0, default: 0 },
  area: { type: Number, min: 0, default: 0 },
  featured: { type: Boolean, default: false },
  coverImage: { type: String, default: '' },
  gallery: [{ type: String, trim: true }],
  amenities: [amenitySchema],
  floorPlans: [floorPlanSchema],
  seo: {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    keywords: { type: String, default: '' },
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

propertySchema.index({ title: 'text', address: 'text', neighborhood: 'text', city: 'text' })

export default mongoose.model('Property', propertySchema)