
describe('Patterns page shows patterns from the backend', () => {
  it('loads /patterns and displays at least one pattern', () => {
    // frontend page
    cy.intercept('GET', '/patterns/9').as('getPattern');

    // real route
    cy.visit('/view/9');

    // Waiting for backend data
    cy.wait('@getPattern');

    // Name 
    cy.contains('snake').should('be.visible');

    // Author line: "Author: khalid"
    cy.contains("khalid").should('be.visible');

    // Description text: "A snake!"
    cy.contains('A snake!').should('be.visible');

  
  });
});
