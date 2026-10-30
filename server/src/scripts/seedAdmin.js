import 'dotenv/config'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { connectDatabase } from '../config/database.js'
import User from '../models/User.js'

try {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME = 'Site Administrator' } = process.env
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12) {
    throw new Error('Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters in server/.env')
  }

  await connectDatabase()
  const email = ADMIN_EMAIL.trim().toLowerCase()
  const existing = await User.findOne({ email })
  if (existing) {
    console.info(`Admin user already exists: ${email}`)
  } else {
    const password = await bcrypt.hash(ADMIN_PASSWORD, 12)
    await User.create({ name: ADMIN_NAME, email, password, role: 'admin' })
    console.info(`Admin user created: ${email}`)
  }
} catch (error) {
  console.error(`Admin seed failed: ${error.message}`)
  process.exitCode = 1
} finally {
  await mongoose.disconnect()
}