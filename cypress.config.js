const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // Valor padrão, usado apenas se o cypress.env.json não existir ou não
    // definir a chave "baseUrl" (veja setupNodeEvents mais abaixo).
    baseUrl: "https://opensource-demo.orangehrmlive.com",
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: "cypress/support/e2e.js",

    // O ambiente de demonstração é público e pode responder de forma lenta
    // em alguns horários; os tempos abaixo evitam falhas por instabilidade.
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,

    // Full HD: o vídeo gerado sai nessa mesma resolução (1920x1080)
    viewportWidth: 1920,
    viewportHeight: 1080,

    // Gravação automática da execução no modo headless (npm run cypress:run).
    // Os vídeos são salvos em cypress/videos/, um arquivo por spec.
    video: true,
    // false = sem compressão, qualidade máxima (arquivo maior e demora um
    // pouco mais para processar no final, mas o vídeo sai bem mais nítido)
    videoCompression: false,
    screenshotOnRunFailure: true,
    retries: {
      runMode: 2,
      openMode: 0,
    },

    setupNodeEvents(on, config) {
      // Se o cypress.env.json (ou a variável CYPRESS_baseUrl) definir uma
      // baseUrl, ela sobrescreve o valor padrão acima. Isso permite trocar
      // de ambiente (demo, homologação, etc.) sem alterar código.
      if (config.env && config.env.baseUrl) {
        config.baseUrl = config.env.baseUrl;
      }
      return config;
    },
  },
});
