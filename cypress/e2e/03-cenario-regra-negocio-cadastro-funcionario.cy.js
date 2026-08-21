/// <reference types="cypress" />

/**
 * CENÁRIO 03 – Regra de Negócio: Cadastro de Funcionário (PIM)
 * Autor: Antonio Carlos
 *
 * REGRA DE NEGÓCIO VALIDADA
 * -------------------------------------------------------------------------
 * RN01 – Identificação obrigatória e única do funcionário
 *
 * Todo funcionário cadastrado no módulo PIM deve possuir obrigatoriamente
 * nome (First Name) e sobrenome (Last Name) e receber um identificador
 * (Employee Id) único dentro do sistema. O sistema deve impedir a conclusão
 * de qualquer cadastro que viole uma dessas condições, garantindo que não
 * existam funcionários sem identificação ou com identificadores duplicados.
 * -------------------------------------------------------------------------
 *
 * Casos de teste automatizados:
 *   CT001 – Cadastro com dados válidos (fluxo principal da regra)
 *   CT002 – Cadastro sem o campo obrigatório First Name
 *   CT003 – Cadastro sem o campo obrigatório Last Name
 *   CT004 – Cadastro com Employee Id duplicado
 */
describe("Cenário 03 – Regra de Negócio RN01: Cadastro de Funcionário (PIM)", () => {
  // Sufixo único por execução, evitando colisão de dados entre rodadas
  const sufixo = Date.now().toString().slice(-6);

  const campoFirstName = () => cy.get('input[name="firstName"]');
  const campoLastName = () => cy.get('input[name="lastName"]');
  const campoEmployeeId = () =>
    cy
      .contains("label", "Employee Id")
      .parents(".oxd-input-group")
      .find("input.oxd-input");
  const botaoSalvar = () => cy.get('button[type="submit"]');

  beforeEach(() => {
    cy.login();
    cy.visit("/web/index.php/pim/addEmployee");
    campoFirstName().should("be.visible");
  });

  it("CT001 – deve cadastrar o funcionário quando nome e sobrenome são informados", () => {
    cy.passo("Preenchendo First Name e Last Name com dados válidos");
    campoFirstName().clear().type(`Carlos${sufixo}`, { delay: 120 });
    campoLastName().clear().type(`Andrade${sufixo}`, { delay: 120 });

    cy.passo("Clicando em Save para concluir o cadastro");
    botaoSalvar().click();

    // A regra atendida leva o sistema à tela de detalhes pessoais do
    // funcionário recém-criado.
    cy.passo("Verificando que o funcionário foi criado e a tela de detalhes foi aberta");
    cy.url({ timeout: 20000 }).should("include", "/pim/viewPersonalDetails");
    cy.get('input[name="firstName"]').should("have.value", `Carlos${sufixo}`);
  });

  it("CT002 – não deve cadastrar funcionário sem o First Name", () => {
    cy.passo("Preenchendo apenas o Last Name, deixando First Name vazio");
    campoLastName().clear().type(`Souza${sufixo}`, { delay: 120 });
    botaoSalvar().click();

    cy.passo("Verificando a mensagem 'Required' no campo First Name");
    cy.get(".oxd-input-field-error-message")
      .should("be.visible")
      .and("contain.text", "Required");

    // O sistema deve permanecer na tela de cadastro
    cy.url().should("include", "/pim/addEmployee");
  });

  it("CT003 – não deve cadastrar funcionário sem o Last Name", () => {
    cy.passo("Preenchendo apenas o First Name, deixando Last Name vazio");
    campoFirstName().clear().type(`Marcos${sufixo}`, { delay: 120 });
    botaoSalvar().click();

    cy.passo("Verificando a mensagem 'Required' no campo Last Name");
    cy.get(".oxd-input-field-error-message")
      .should("be.visible")
      .and("contain.text", "Required");

    cy.url().should("include", "/pim/addEmployee");
  });

  it("CT004 – não deve permitir Employee Id duplicado", () => {
    const idDuplicado = `9${sufixo}`;

    cy.passo("Cadastrando o primeiro funcionário e reservando um Employee Id");
    campoFirstName().clear().type(`Renata${sufixo}`, { delay: 120 });
    campoLastName().clear().type(`Lopes${sufixo}`, { delay: 120 });
    campoEmployeeId().clear().type(idDuplicado, { delay: 120 });
    botaoSalvar().click();
    cy.url({ timeout: 20000 }).should("include", "/pim/viewPersonalDetails");

    cy.passo("Abrindo um novo cadastro e tentando reutilizar o mesmo Employee Id");
    cy.visit("/web/index.php/pim/addEmployee");
    campoFirstName().clear().type(`Juliana${sufixo}`, { delay: 120 });
    campoLastName().clear().type(`Costa${sufixo}`, { delay: 120 });
    campoEmployeeId().clear().type(idDuplicado, { delay: 120 });
    botaoSalvar().click();

    cy.passo("Verificando que o sistema bloqueou a duplicidade do Employee Id");
    cy.contains("Employee Id already exists", { timeout: 15000 }).should(
      "be.visible"
    );
    cy.url().should("include", "/pim/addEmployee");
  });
});
