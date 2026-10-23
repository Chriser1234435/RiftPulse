import { createApp } from './app.js'

const port = Number.parseInt(process.env.PORT ?? '4000', 10)
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be a valid TCP port.')
}

const app = createApp()
const server = app.listen(port, () => {
  console.log(`RiftPulse API listening on port ${port}`)
})

function shutdown(signal: string) {
  console.log(`Received ${signal}; closing HTTP server.`)
  server.close((error) => {
    if (error) {
      console.error('HTTP server shutdown failed.')
      process.exitCode = 1
    }
  })
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
