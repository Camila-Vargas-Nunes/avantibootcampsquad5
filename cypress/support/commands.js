// ---------------------------------------------------------------------------
// Comandos customizados - Equipe Ctrl + Test
// ---------------------------------------------------------------------------

/**
 * Marca um "passo" do teste no log do Cypress (aparece no vídeo, no painel
 * lateral de comandos) e faz uma pausa antes de continuar.
 * Usado apenas para deixar o vídeo mais didático durante a apresentação;
 * não interfere no resultado do teste.
 *
 * Dica: para deixar ainda mais devagar/rápido, é só ajustar o valor do
 * cy.wait() abaixo (em milissegundos). Ex.: 3000 = 3 segundos por passo.
 * @param {string} mensagem - descrição do que vai acontecer neste passo
 */
Cypress.Commands.add("passo", (mensagem) => {
  cy.log(`**PASSO:** ${mensagem}`);
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(2500);
});

/**
 * Acessa a tela de login do OrangeHRM e aguarda o formulário ficar visível.
 */
Cypress.Commands.add("acessarTelaLogin", () => {
  cy.visit("/web/index.php/auth/login");
  cy.get('input[name="username"]').should("be.visible");
});

/**
 * Preenche o formulário de login e submete.
 * @param {string} username
 * @param {string} password
 */
Cypress.Commands.add("preencherLogin", (username, password) => {
  if (username) {
    cy.get('input[name="username"]').clear().type(username, { delay: 120 });
  }
  if (password) {
    cy.get('input[name="password"]').clear().type(password, {
      delay: 120,
      log: false,
    });
  }
  cy.get('button[type="submit"]').click();
});

/**
 * Login completo com credenciais válidas, usado como pré-condição
 * dos testes que exigem usuário autenticado.
 *
 * A ordem de prioridade das credenciais é:
 *   1. Parâmetros recebidos na chamada do comando (ex.: cy.login('x','y'))
 *   2. Variáveis de ambiente definidas em cypress.env.json ("usuarioValido")
 *   3. Fixture cypress/fixtures/dados.json, como último recurso
 */
Cypress.Commands.add("login", (username, password) => {
  cy.fixture("dados").then((dados) => {
    const envUser = Cypress.env("usuarioValido") || {};
    const user = username || envUser.username || dados.usuarioValido.username;
    const pass = password || envUser.password || dados.usuarioValido.password;

    cy.acessarTelaLogin();
    cy.preencherLogin(user, pass);
    cy.url().should("include", "/dashboard");
  });
});

/**
 * Navega por um item do menu lateral pelo texto exibido.
 * @param {string} nomeDoMenu - ex.: "Admin", "PIM", "My Info"
 */
Cypress.Commands.add("acessarMenu", (nomeDoMenu) => {
  cy.get(".oxd-main-menu-item").contains(nomeDoMenu).click();
});
