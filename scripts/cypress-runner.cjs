const { spawn } = require('node:child_process')
const { createServer } = require('../server.cjs')

const mode = process.argv[2] === 'open' ? 'open' : 'run'
const port = Number(process.env.PORT || 4173)
const baseUrl = `http://127.0.0.1:${port}`
const server = createServer()
let cypress
let shuttingDown = false

function closeServer(exitCode) {
  if (shuttingDown) return
  shuttingDown = true
  server.close(() => {
    process.exitCode = exitCode
  })
}

server.once('error', (error) => {
  console.error(`Não foi possível iniciar a loja na porta ${port}: ${error.message}`)
  process.exitCode = 1
})

server.listen(port, '127.0.0.1', () => {
  console.log(`Loja pronta em ${baseUrl}`)
  const cypressCli = require('node:path').join(__dirname, '..', 'node_modules', 'cypress', 'bin', 'cypress')
  if (!require('node:fs').existsSync(cypressCli)) {
    console.error('Cypress não encontrado. Rode npm ci antes de iniciar a suíte.')
    closeServer(1)
    return
  }

  cypress = spawn(process.execPath, [cypressCli, mode], {
    stdio: 'inherit',
    env: { ...process.env, CYPRESS_BASE_URL: baseUrl },
  })
  cypress.once('error', (error) => {
    console.error(`Falha ao iniciar Cypress: ${error.message}`)
    closeServer(1)
  })
  cypress.once('exit', (code, signal) => {
    closeServer(code ?? (signal ? 1 : 0))
  })
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    if (cypress && !cypress.killed) cypress.kill(signal)
    closeServer(signal === 'SIGINT' ? 130 : 143)
  })
}

