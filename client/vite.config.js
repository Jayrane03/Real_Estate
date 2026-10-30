import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const vitePort = Number(process.env.VITE_PORT || 5173)

function normalizeApiOrigin(value) {
  return value.trim().replace(/\/+$/, '').replace(/\/api$/i, '')
}

async function resolveApiProxyTarget() {
  const configuredTarget = process.env.VITE_API_PROXY_TARGET || process.env.API_URL
  if (configuredTarget) {
    return normalizeApiOrigin(configuredTarget)
  }

  const preferredPort = Number(process.env.PORT || 5000)
  const ports = Array.from(new Set([preferredPort, 5000, 5001, 5002, 5003, 5004, 5005, 5006, 5007, 5008, 5009]))

  for (const port of ports) {
    try {
      const response = await fetch(`http://localhost:${port}/api/health`, { signal: AbortSignal.timeout(500) })
      if (response.ok) {
        return `http://localhost:${port}`
      }
    } catch {
      // Ignore unreachable ports and fall back to the configured/default target.
    }
  }

  return `http://localhost:${preferredPort}`
}

export default defineConfig(async () => {
  const apiProxyTarget = await resolveApiProxyTarget()

  return {
    plugins: [react()],
    server: {
      port: vitePort,
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})