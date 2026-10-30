import dotenv from 'dotenv'
import { fileURLToPath } from 'node:url'

dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)) })

const { default: app } = await import('./app.js')
const { connectDatabase } = await import('./config/database.js')

const preferredPort = Number(process.env.PORT) || 5000
const candidatePorts = Array.from({ length: 10 }, (_, index) => preferredPort + index)

const startServer = async () => {
  for (const port of candidatePorts) {
    try {
      await new Promise((resolve, reject) => {
        const server = app.listen(port, () => {
          console.info(`Aurelia API listening on port ${port}`)
          resolve(server)
        })

        server.on('error', (error) => {
          reject(error)
        })
      })

      if (port !== preferredPort) {
        console.info(`Port ${preferredPort} was busy, using ${port} instead.`)
      }
      return
    } catch (error) {
      if (error.code !== 'EADDRINUSE') throw error
    }
  }

  throw new Error(`No available port found from ${preferredPort} to ${preferredPort + candidatePorts.length - 1}`)
}

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