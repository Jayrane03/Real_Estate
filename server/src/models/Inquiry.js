import mongoose from 'mongoose'

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
  phone: { type: String, trim: true, default: '', maxlength: 40 },
  message: { type: String, required: true, trim: true, maxlength: 2000 },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  propertyTitle: { type: String, default: '' },
  status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new', index: true },
}, { timestamps: true })

inquirySchema.index({ createdAt: -1 })

export default mongoose.model('Inquiry', inquirySchema)