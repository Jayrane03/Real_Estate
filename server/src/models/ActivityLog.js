import mongoose from 'mongoose'

const activityLogSchema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  actorName: { type: String, default: 'System' },
  action: { type: String, required: true },
  entity: { type: String, required: true },
  entityId: { type: String, default: '' },
  details: { type: String, default: '' },
}, { timestamps: true })

activityLogSchema.index({ createdAt: -1 })

export default mongoose.model('ActivityLog', activityLogSchema)