import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    video: true,
    // defaultCommandTimeout: 10000,
    // chromeWebSecurity: false,
    // setupNodeEvents(on, config) {
    //   config.proxyUrl = 'http://127.0.0.1:3000';
    //   return config;
    // },
  },
});
