// cypress/e2e/patterns.cy.js

describe('Patterns integration: backend + DB + frontend', () => {
  const samplePattern = {
    pattern_name: 'Cypress Test Pattern',
    pattern_info: { width: 2, height: 2, colorConfig: ['#111111', '#222222', '#111111', '#222222'] },
    description: 'Created from Cypress E2E test',
    author: 'CypressUser',
  };

  before(() => {
    // Seed the DB by talking directly to the backend container.
    // Docker compose maps backend: 3000:3000, so from host we use localhost:3000.
    cy.request('POST', 'http://localhost:3000/patterns', samplePattern)
      .its('status')
      .should('eq', 201);
  });

  it('shows the seeded pattern on the homepage', () => {
    cy.visit('/');

    // Look for the pattern name and description in whatever component lists posts.
    cy.contains('Cypress Test Pattern').should('be.visible');
    cy.contains('Created from Cypress E2E test').should('be.visible');

    

    
  });
});
