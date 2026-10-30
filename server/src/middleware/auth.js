import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const requireAuth = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.aven_token
  if (!token) return res.status(401).json({ message: 'Please sign in to continue.' })

  let payload
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return res.status(401).json({ message: 'Your session has expired. Please sign in again.' })
  }

  const user = await User.findById(payload.sub).select('_id name email role active')
  if (!user || !user.active) return res.status(401).json({ message: 'Your account is unavailable.' })

  req.user = user
  next()
})

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to perform this action.' })
    }
    next()
  }
}