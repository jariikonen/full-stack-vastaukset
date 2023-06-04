describe('Blog app', function() {
  const testUser = {
    username: 'terttu',
    name: 'Terttu Testaaja',
    password: 'salainen',
  };

  const testBlog = {
    title: 'Testiblogi',
    author: 'Testikirjoittaja',
    url: 'Testiurl',
  };

  beforeEach(function() {
    cy.resetDatabase();
    cy.addUser(testUser);
  });

  it('Login form is shown', function() {
    cy.get('#username');
    cy.get('#password');
    cy.get('#login-button');
  });

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type(testUser.username);
      cy.get('#password').type(testUser.password);
      cy.get('#login-button').click();

      cy.contains(`logged in as ${testUser.name}`);
    });

    it('fails with wrong credentials', function() {
      cy.get('#username').type('tuntematon');
      cy.get('#password').type('ei toimi');
      cy.get('#login-button').click();

      cy.contains('wrong username or password');
    });
  });

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login(testUser.username, testUser.password);
    });

    it('A blog can be created', function() {
      cy.get('button').contains('create blog').click();
      cy.get('input').get('[name="Title"]').type(testBlog.title);
      cy.get('input').get('[name="Author"]').type(testBlog.author);
      cy.get('input').get('[name="Url"]').type(testBlog.url);
      cy.get('[data-cy="submit-blog"]').click();

      cy.contains(`${testBlog.title} ${testBlog.author}`);
    });

    describe('When blogs have been created', function() {
      beforeEach(function() {
        cy.postBlog(testBlog);
        cy.contains(`${testBlog.title} ${testBlog.author}`).get('button').contains('view').click();
      });

      it('A blog can be liked', function() {
        cy.contains(`${testBlog.title} ${testBlog.author}`)
          .parent()
          .get('button')
          .contains('like')
          .click();
        cy.contains(`${testBlog.title} ${testBlog.author}`)
          .parent()
          .contains('likes 1');
      });
    });
  });
});
