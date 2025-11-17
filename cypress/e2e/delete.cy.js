
describe('Delete pattern flow', () => {
  it('creates a pattern, deletes it, and verifies it is gone', () => {
    const name = `Cypress Delete Pattern E2E`;
    const author = 'Cypress Deleter';
    const description = 'Created to be deleted by Cypress';

    // navigates to the home page
    cy.visit('/');
    cy.contains(/create/i).click();

    // draws pattern
    cy.get('div[style*="25px"][style*="background-color"]').first().click();
    cy.get('div[style*="25px"][style*="background-color"]').eq(5).click();

    // names pattern
    cy.contains(/name/i)
      .parent()
      .find('input, textarea')
      .clear()
      .type(name);

    // Fills "Author"
    cy.contains(/author/i)
      .parent()
      .find('input, textarea')
      .clear()
      .type(author);

    // Fills "Description"
    cy.contains(/description/i)
      .parent()
      .find('textarea:visible')
      .clear()
      .type(description);

    // Submits form
    cy.contains('button', /generate pattern/i).click();

    // 2) Deletes the pattern from the detail page

    // Auto-confirms the confirm() dialog
    cy.on('window:confirm', (text) => {
    expect(text).to.contain('Are you sure you want to delete this pattern?');
    return true;
    });

    // Checks success alert
    cy.on('window:alert', (text) => {
    expect(text).to.contain('Pattern deleted!');
    });

    // Clicks the DELETE PATTERN button
    cy.contains('button', /delete pattern/i).click();

    // App should redirect to home "/"
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);

    //Verifys the deleted pattern is no longer in the patterns list
    cy.request('/patterns');
    cy.contains(name).should('not.exist');
    });
  });
