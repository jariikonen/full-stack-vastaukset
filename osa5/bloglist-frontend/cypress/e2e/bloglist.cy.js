describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    cy.request('POST', 'http://localhost:3003/api/users', {
      username: 'jikon',
      name: 'Jari Ikonen',
      password: 'salainen',
    }).then(() => {
      cy.visit('http://localhost:3000');
    });
  });

  it('Login form is shown', function() {
    cy.get('#username');
    cy.get('#password');
    cy.get('#login-button');
  });

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('jikon');
      cy.get('#password').type('salainen');
      cy.get('#login-button').click();

      cy.contains('logged in as Jari Ikonen');
    });

    it('fails with wrong credentials', function() {
      cy.get('#username').type('tuntematon');
      cy.get('#password').type('ei toimi');
      cy.get('#login-button').click();

      cy.contains('wrong username or password');
    });
  });
});
