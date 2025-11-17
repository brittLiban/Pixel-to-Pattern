
describe('Home Page & NavBar', () => {
  it('shows the site title and navigation buttons', () => {
    cy.visit('/');

    // Checks the title 
    cy.contains(/pixel2pattern/i).should('be.visible');

    // Nav buttons check
    cy.contains('button', /home/i).should('be.visible');
    cy.contains('button', /create/i).should('be.visible');
    cy.contains('button', /faq/i).should('be.visible');


  });
});
