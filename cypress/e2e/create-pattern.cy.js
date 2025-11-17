
describe('Create pattern flow', () => {
  it('creates a new pattern and displays it', () => {
    const name = `Cypress Pattern E2E`;
    const description = 'Created via Cypress E2E';
    const author = 'khalid';

    // home page
    cy.visit('/');

    // Navigating to the Create page
    cy.contains('button', /create/i).click();
    
    // creates patterns
    cy.get('div[style*="25px"][style*="background-color"]').first().click();
    cy.get('div[style*="25px"][style*="background-color"]').eq(5).click();

    // creates a description
    cy.contains(/description/i)
      .parent()
      .find('textarea, input')
      .first()
      .type(description);

    // creates author name
    cy.contains(/author/i)
      .parent()
      .find('input, textarea')
      .first()
      .type(author);
    
    cy.contains(/name/i)
        .parent()
        .find('input, textarea')
        .first()
        .type(name); 

    // Intercepts the create call
    cy.intercept('POST', '/patterns').as('createPattern');

    // Submits the form
    cy.contains('button', /generate pattern/i).click();

    // After redirect, the new pattern should be visible
    cy.contains(name).should('be.visible');
    cy.contains(description).should('be.visible');
  });
  
});