describe('Blog app', function() {
  const testUsers = [
    {
      username: 'terttu',
      name: 'Terttu Testaaja',
      password: 'salainen',
    },
    {
      username: 'tonttu',
      name: 'Tonttu Toljanteri',
      password: 'toljanteri',
    },
  ];

  const testBlog = {
    title: 'Testiblogi',
    author: 'Testikirjoittaja',
    url: 'Testiurl',
  };

  beforeEach(function() {
    cy.resetDatabase();
    cy.addUser(testUsers[0]);
    cy.addUser(testUsers[1]);
  });

  it('Login form is shown', function() {
    cy.get('#username');
    cy.get('#password');
    cy.get('#login-button');
  });

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type(testUsers[0].username);
      cy.get('#password').type(testUsers[0].password);
      cy.get('#login-button').click();

      cy.contains(`logged in as ${testUsers[0].name}`);
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
      cy.login(testUsers[0].username, testUsers[0].password);
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

      it('A blog can be removed by the user who created it', function() {
        cy.contains(`${testBlog.title} ${testBlog.author}`)
          .parent()
          .get('button')
          .contains('remove')
          .click();
        cy.get('html').should('not.contain', `${testBlog.title} ${testBlog.author}`);
      });
    });
  });
});
