describe('Login KMS', () => {
  it('should login successfully', () => {
    cy.visit('');
    cy.get('input[id="username"]').type(Cypress.env('username'));
    cy.get('input[id="password"]').type(Cypress.env('password'));
    cy.get('button[type="submit"]').trigger('click');
    cy.url().should('include', '/knowledge/lib/overview');
  });
});
