import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

const MEMORIES_FILE = path.resolve(process.cwd(), 'data', 'memories.json')

function memoriesApiPlugin() {
  return {
    name: 'memories-api',
    configureServer(server) {
      server.middlewares.use('/api/memories', (req, res, next) => {
        if (req.method === 'GET') {
          try {
            const raw = fs.existsSync(MEMORIES_FILE)
              ? fs.readFileSync(MEMORIES_FILE, 'utf-8')
              : '{}'
            const data = JSON.parse(raw)
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
          } catch {
            res.setHeader('Content-Type', 'application/json')
            res.end('{}')
          }
          return
        }
        if (req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => { body += chunk })
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}')
              const dir = path.dirname(MEMORIES_FILE)
              if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
              fs.writeFileSync(MEMORIES_FILE, JSON.stringify(data, null, 2), 'utf-8')
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ ok: true }))
            } catch (err) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: String(err?.message || 'Failed to save') }))
            }
          })
          return
        }
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), memoriesApiPlugin()],
  server: {
    proxy: {
      '/api/expand-story': { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
})
