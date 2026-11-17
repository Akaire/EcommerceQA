const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://127.0.0.1:4173',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: false,
    testIsolation: true,
    retries: {
      runMode: 1,
      openMode: 0,
    },
    defaultCommandTimeout: 6000,
    viewportWidth: 1280,
    viewportHeight: 800,
    video: false,
    screenshotOnRunFailure: true,
  },
})
