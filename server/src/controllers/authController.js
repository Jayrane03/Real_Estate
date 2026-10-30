import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import ActivityLog from '../models/ActivityLog.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 8 * 60 * 60 * 1000,
})

const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role })

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body
  const user = await User.findOne({ email }).select('+password')
  const matches = user && await bcrypt.compare(password, user.password)
  if (!matches || !user.active) return res.status(401).json({ message: 'Email or password is incorrect.' })

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '8h' })
  res.cookie('aven_token', token, cookieOptions())
  await ActivityLog.create({ actor: user._id, actorName: user.name, action: 'signed in to', entity: 'the admin portal' })
  res.json({ user: publicUser(user) })
})

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('aven_token', cookieOptions())
  res.json({ message: 'Signed out.' })
})

export function currentUser(req, res) {
  res.json({ user: publicUser(req.user) })
}