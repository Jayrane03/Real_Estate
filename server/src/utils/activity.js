import ActivityLog from '../models/ActivityLog.js'

export function recordActivity({ actor, action, entity, entityId = '', details = '' }) {
  return ActivityLog.create({
    actor: actor?._id,
    actorName: actor?.name || 'System',
    action,
    entity,
    entityId: String(entityId),
    details,
  })
}