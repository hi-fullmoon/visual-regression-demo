import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://kms-dev.datagrand.com',
    supportFile: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    defaultBrowser: 'chrome',
  },
  env: {
    username: 'admin',
    password: 'R7czTnCHYmpoe36x',
    url: 'https://kms-dev.datagrand.com',
  },
  viewportWidth: 1920,
  viewportHeight: 1080,
});
