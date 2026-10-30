import dotenv from 'dotenv'
import { fileURLToPath } from 'node:url'

dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)) })

const { default: app } = await import('./app.js')
const { connectDatabase } = await import('./config/database.js')

const port = Number(process.env.PORT) || 5000

const startServer = () => new Promise((resolve, reject) => {
  const server = app.listen(port, () => {
    console.info(`Aurelia API listening on port ${port}`)
    resolve(server)
  })

  server.once('error', reject)
})

try {
  if (!process.env.JWT_SECRET) {
    throw new Error('Set JWT_SECRET to a random value of at least 32 characters')
  }
  await connectDatabase()
  await startServer()
} catch (error) {
  console.error(`API startup failed: ${error.message}`)
  process.exit(1)
}