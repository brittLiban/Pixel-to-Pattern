// cypress/e2e/patterns.cy.js

describe('Patterns page shows patterns from the backend', () => {
  it('loads /patterns and displays at least one pattern', () => {
    // Go to the frontend patterns page
    cy.visit('/patterns'); // baseUrl is http://localhost:3001

    // Assert that some pattern content is on the page
    // Adjust these selectors/text to match what you actually see on /patterns
    cy.contains(/pattern/i).should('exist');  // e.g., a heading or card title

    // If you have cards or list items:
    cy.get('.pattern-card, .post-card, li')
      .should('have.length.at.least', 1);
  });
});
