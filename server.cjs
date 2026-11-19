const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')

const root = __dirname
const publicFiles = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/styles.css', ['styles.css', 'text/css; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']],
  ['/catalog.json', ['catalog.json', 'application/json; charset=utf-8']],
])
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

    // Serve only the explicit browser assets; never expose arbitrary project files.
    const asset = publicFiles.get(pathname)
    if (!asset) {
      res.writeHead(404).end('Not found')
      return
    }

    const [fileName, contentType] = asset
    fs.readFile(path.join(root, fileName), (error, content) => {
      if (error) {
        res.writeHead(500).end('Unable to load the demo')
        return
      }
      res.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': 'no-cache' })
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
