/// <reference types="cypress" />

/**
 * CENÁRIO 01 – Autenticação (Login)
 * Autora: Camila Vargas
 *
 * Valida o processo de autenticação do sistema: acesso com credenciais
 * válidas, bloqueio com credenciais incorretas e obrigatoriedade dos campos.
 *
 * Casos de teste automatizados:
 *   CT001 – Login com credenciais válidas
 *   CT002 – Login com senha inválida
 *   CT003 – Login com o campo Username em branco
 *   CT004 – Login com Username e Password em branco
 */
describe("Cenário 01 – Autenticação (Login)", () => {
  beforeEach(() => {
    cy.acessarTelaLogin();
  });

  it("CT001 – deve autenticar o usuário e redirecionar para o Dashboard", () => {
    cy.fixture("dados").then(({ usuarioValido }) => {
      // Usa a credencial definida em cypress.env.json quando existir;
      // caso contrário, cai no valor da fixture (comportamento anterior).
      const envUser = Cypress.env("usuarioValido") || {};
      const username = envUser.username || usuarioValido.username;
      const password = envUser.password || usuarioValido.password;

      cy.passo("Preenchendo usuário e senha válidos e enviando o formulário de login");
      cy.preencherLogin(username, password);

      cy.passo("Verificando que o sistema redirecionou para o Dashboard");
      cy.url().should("include", "/dashboard");
      cy.get("h6.oxd-topbar-header-breadcrumb-module").should(
        "have.text",
        "Dashboard"
      );

      cy.passo("Confirmando que o nome do usuário logado aparece no topo da tela");
      cy.get(".oxd-userdropdown-name").should("be.visible");
    });
  });

  it("CT002 – não deve autenticar com senha inválida", () => {
    cy.fixture("dados").then(({ usuarioSenhaInvalida }) => {
      cy.passo("Preenchendo usuário válido com senha incorreta");
      cy.preencherLogin(
        usuarioSenhaInvalida.username,
        usuarioSenhaInvalida.password
      );

      cy.passo("Verificando a mensagem de erro 'Invalid credentials'");
      cy.get(".oxd-alert-content-text")
        .should("be.visible")
        .and("have.text", "Invalid credentials");

      cy.passo("Confirmando que o sistema não avançou para o Dashboard");
      cy.url().should("include", "/auth/login");
      cy.url().should("not.include", "/dashboard");
    });
  });

  it("CT003 – deve exigir o preenchimento do campo Username", () => {
    cy.fixture("dados").then(({ usuarioValido }) => {
      const envUser = Cypress.env("usuarioValido") || {};
      const password = envUser.password || usuarioValido.password;

      cy.passo("Preenchendo apenas a senha e deixando o Username em branco");
      cy.get('input[name="password"]').type(password, {
        delay: 120,
        log: false,
      });
      cy.get('button[type="submit"]').click();

      cy.passo("Verificando a mensagem 'Required' abaixo do campo Username");
      cy.get(".oxd-input-field-error-message")
        .should("be.visible")
        .and("have.text", "Required");

      cy.url().should("not.include", "/dashboard");
    });
  });

  it("CT004 – deve exigir o preenchimento de Username e Password", () => {
    cy.passo("Enviando o formulário sem preencher nenhum campo");
    cy.get('button[type="submit"]').click();

    cy.passo("Verificando que as duas mensagens 'Required' aparecem");
    cy.get(".oxd-input-field-error-message")
      .should("have.length", 2)
      .each(($mensagem) => {
        cy.wrap($mensagem).should("have.text", "Required");
      });

    cy.url().should("not.include", "/dashboard");
  });
});
