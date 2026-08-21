/// <reference types="cypress" />

/**
 * CENÁRIO 02 – Controle de Sessão e Acesso
 * Autora: Camila Vargas
 *
 * Valida a regra de que nenhuma área interna do sistema pode ser acessada sem
 * uma sessão autenticada ativa, e que o logout encerra efetivamente a sessão.
 *
 * Casos de teste automatizados:
 *   CT001 – Acesso à URL do módulo PIM sem autenticação
 *   CT002 – Acesso à URL do módulo Admin sem autenticação
 *   CT003 – Encerramento de sessão pelo logout
 */
describe("Cenário 02 – Controle de Sessão e Acesso", () => {
  it("CT001 – deve redirecionar para o login ao acessar o PIM sem autenticação", () => {
    cy.passo("Limpando cookies para garantir que não há sessão ativa");
    cy.clearCookies();

    cy.passo("Tentando acessar diretamente a URL do módulo PIM sem estar logado");
    cy.visit("/web/index.php/pim/viewEmployeeList", { failOnStatusCode: false });

    cy.passo("Verificando que o sistema redirecionou para a tela de login");
    cy.url().should("include", "/auth/login");
    cy.get('input[name="username"]').should("be.visible");
  });

  it("CT002 – deve redirecionar para o login ao acessar o Admin sem autenticação", () => {
    cy.passo("Limpando cookies para garantir que não há sessão ativa");
    cy.clearCookies();

    cy.passo("Tentando acessar diretamente a URL do módulo Admin sem estar logado");
    cy.visit("/web/index.php/admin/viewSystemUsers", {
      failOnStatusCode: false,
    });

    cy.passo("Verificando que o sistema redirecionou para a tela de login");
    cy.url().should("include", "/auth/login");
    cy.get('input[name="username"]').should("be.visible");
  });

  it("CT003 – deve encerrar a sessão ao realizar o logout", () => {
    cy.passo("Realizando login com um usuário válido");
    cy.login();
    cy.url().should("include", "/dashboard");

    cy.passo("Abrindo o menu do usuário e clicando em Logout");
    cy.get(".oxd-userdropdown-tab").click();
    cy.contains(".oxd-userdropdown-link", "Logout").click();

    cy.passo("Verificando que a sessão foi encerrada e voltou para o login");
    cy.url().should("include", "/auth/login");

    cy.passo("Tentando acessar o PIM novamente após o logout");
    cy.visit("/web/index.php/pim/viewEmployeeList", { failOnStatusCode: false });
    cy.url().should("include", "/auth/login");
  });
});
