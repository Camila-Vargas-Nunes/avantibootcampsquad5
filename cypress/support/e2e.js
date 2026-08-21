import "./commands";

// O OrangeHRM (demo) dispara eventualmente exceções internas do Vue que não
// interferem no comportamento validado pelos testes. Sem este tratamento, o
// Cypress interromperia a execução ao capturá-las.
Cypress.on("uncaught:exception", () => false);
