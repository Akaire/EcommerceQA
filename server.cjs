const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')

const root = __dirname
const indexFile = path.join(root, 'index.html')
const port = Number(process.env.PORT || 4173)

function createServer() {
  return http.createServer((req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('Referrer-Policy', 'no-referrer')

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.setHeader('Allow', 'GET, HEAD')
      res.writeHead(405).end('Method not allowed')
      return
    }

    let pathname
    try {
      pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname)
    } catch {
      res.writeHead(400).end('Bad request')
      return
    }

    // The demo needs only one public resource; never expose project files via this server.
    if (pathname !== '/' && pathname !== '/index.html') {
      res.writeHead(404).end('Not found')
      return
    }

    fs.readFile(indexFile, (error, content) => {
      if (error) {
        res.writeHead(500).end('Unable to load the demo')
        return
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(req.method === 'HEAD' ? undefined : content)
    })
  })
}

if (require.main === module) {
  createServer().listen(port, '127.0.0.1', () => {
    console.log(`Viva disponível em http://127.0.0.1:${port}`)
  })
}

module.exports = { createServer }
