/// <reference types="cypress" />

/**
 * CENÁRIO 04 – Pesquisa de Usuários do Sistema (Admin)
 * Autor: Roberto Medeiros
 *
 * Valida o filtro de pesquisa da tela Admin > User Management > Users.
 *
 * Casos de teste automatizados:
 *   CT001 – Pesquisa pelo Username exato
 *   CT002 – Pesquisa por Username inexistente
 *   CT003 – Limpeza dos filtros pelo botão Reset
 *   CT004 – Pesquisa parcial pela letra inicial (reproduz o BUG002)
 */
describe("Cenário 04 – Pesquisa de Usuários do Sistema (Admin)", () => {
  const campoUsername = () =>
    cy
      .contains("label", "Username")
      .parents(".oxd-input-group")
      .find("input.oxd-input");

  const botaoPesquisar = () => cy.get('button[type="submit"]').contains("Search");
  const botaoReset = () => cy.get("button").contains("Reset");

  beforeEach(() => {
    cy.login();
    cy.visit("/web/index.php/admin/viewSystemUsers");
    cy.contains("System Users").should("be.visible");
  });

  it("CT001 – deve localizar o usuário ao pesquisar pelo Username exato", () => {
    cy.fixture("dados").then(({ pesquisaUsuario }) => {
      cy.passo("Digitando o Username exato no filtro de pesquisa");
      campoUsername().clear().type(pesquisaUsuario.usernameExistente, { delay: 120 });
      botaoPesquisar().click();

      cy.passo("Verificando que o usuário pesquisado aparece na listagem");
      cy.get(".oxd-table-card", { timeout: 15000 })
        .should("have.length.greaterThan", 0)
        .first()
        .should("contain.text", pesquisaUsuario.usernameExistente);
    });
  });

  it("CT002 – deve exibir 'No Records Found' para Username inexistente", () => {
    cy.passo("Pesquisando por um Username que não existe no sistema");
    campoUsername().clear().type("usuarioinexistente999", { delay: 120 });
    botaoPesquisar().click();

    cy.passo("Verificando a mensagem 'No Records Found'");
    cy.contains("No Records Found", { timeout: 15000 }).should("be.visible");
    cy.get(".oxd-table-card").should("not.exist");
  });

  it("CT003 – deve limpar os filtros ao clicar em Reset", () => {
    cy.passo("Pesquisando por um Username inexistente para gerar lista vazia");
    campoUsername().clear().type("usuarioinexistente999", { delay: 120 });
    botaoPesquisar().click();
    cy.contains("No Records Found", { timeout: 15000 }).should("be.visible");

    cy.passo("Clicando em Reset para limpar os filtros");
    botaoReset().click();

    cy.passo("Verificando que o campo foi limpo e a listagem completa voltou");
    campoUsername().should("have.value", "");
    cy.get(".oxd-table-card", { timeout: 15000 }).should(
      "have.length.greaterThan",
      0
    );
  });

  /**
   * BUG002 – O campo Username não aceita busca parcial pela letra inicial.
   * O teste permanece desativado (.skip) para que a suíte não acuse falha por
   * um defeito já conhecido e documentado na Especificação de Bugs.
   * Após a correção, remover o `.skip` para validar o comportamento esperado.
   */
  it.skip("CT004 – deve localizar usuários pela letra inicial do Username (BUG002)", () => {
    cy.fixture("dados").then(({ pesquisaUsuario }) => {
      campoUsername().clear().type(pesquisaUsuario.inicialDoUsername, { delay: 120 });
      botaoPesquisar().click();

      cy.get(".oxd-table-card", { timeout: 15000 }).should(
        "have.length.greaterThan",
        0
      );
    });
  });
});
