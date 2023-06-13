describe('Blog app', function () {
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

  const testBlogs = [
    {
      title: 'Testiblogi1',
      author: 'Testikirjoittaja1',
      url: 'Testiurl1',
    },
    {
      title: 'Testiblogi2',
      author: 'Testikirjoittaja2',
      url: 'Testiurl2',
    },
    {
      title: 'Testiblogi3',
      author: 'Testikirjoittaja3',
      url: 'Testiurl3',
    },
  ];

  beforeEach(function () {
    cy.resetDatabase();
    cy.addUser(testUsers[0]);
    cy.addUser(testUsers[1]);
  });

  it('Login form is shown', function () {
    cy.get('#username');
    cy.get('#password');
    cy.get('#login-button');
  });

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type(testUsers[0].username);
      cy.get('#password').type(testUsers[0].password);
      cy.get('#login-button').click();

      cy.contains(`logged in as ${testUsers[0].name}`);
    });

    it('fails with wrong credentials', function () {
      cy.get('#username').type('tuntematon');
      cy.get('#password').type('ei toimi');
      cy.get('#login-button').click();

      cy.get('.error').contains('wrong username or password');
      cy.get('html').should('not.contain', `logged in as ${testUsers[0].name}`);
    });
  });

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login(testUsers[0].username, testUsers[0].password);
    });

    it('A blog can be created', function () {
      cy.get('button').contains('create blog').click();
      cy.get('input[name="Title"]').type(testBlogs[0].title);
      cy.get('input[name="Author"]').type(testBlogs[0].author);
      cy.get('input[name="Url"]').type(testBlogs[0].url);
      cy.get('[data-cy="submit-blog"]').click();

      cy.contains(`${testBlogs[0].title} ${testBlogs[0].author}`);
    });

    describe('When blogs have been created', function () {
      beforeEach(function () {
        cy.postBlog(testBlogs[0]);
        cy.contains(`${testBlogs[0].title} ${testBlogs[0].author}`)
          .find('button')
          .contains('view')
          .click();
      });

      it('A blog can be liked', function () {
        cy.contains(`${testBlogs[0].title} ${testBlogs[0].author}`)
          .parent()
          .as('theBlog')
          .find('button')
          .contains('like')
          .click();

        cy.get('@theBlog').contains('likes 1');
      });

      it('A blog can be removed by the user who created it', function () {
        cy.contains(`${testBlogs[0].title} ${testBlogs[0].author}`)
          .parent()
          .find('button')
          .contains('remove')
          .click();

        cy.get('html').should(
          'not.contain',
          `${testBlogs[0].title} ${testBlogs[0].author}`
        );
      });

      it('Remove button is rendered only if logged in user has created the blog', function () {
        cy.contains(`${testBlogs[0].title} ${testBlogs[0].author}`)
          .parent()
          .as('theBlog');
        cy.get('@theBlog').contains(`${testUsers[0].name}`);
        cy.get('@theBlog').find('button').contains('remove');

        cy.get('button').contains('logout').click();
        cy.login(testUsers[1].username, testUsers[1].password);
        cy.get('@theBlog').find('button').contains('view').click();

        cy.get('@theBlog').find('button').should('not.contain', 'remove');
      });

      it('Blogs are rendered in descending order by the number of likes they have', function () {
        cy.postBlog(testBlogs[1]);
        cy.postBlog(testBlogs[2]);

        cy.viewBlog(testBlogs[0]);
        cy.likeBlog(testBlogs[0], 1);

        cy.viewBlog(testBlogs[1]);
        cy.likeBlog(testBlogs[1], 1);
        cy.likeBlog(testBlogs[1], 2);

        cy.viewBlog(testBlogs[2]);
        cy.likeBlog(testBlogs[2], 1);
        cy.likeBlog(testBlogs[2], 2);
        cy.likeBlog(testBlogs[2], 3);

        cy.get('.blog')
          .eq(0)
          .contains(`${testBlogs[2].title} ${testBlogs[2].author}`);
        cy.get('.blog')
          .eq(1)
          .contains(`${testBlogs[1].title} ${testBlogs[1].author}`);
        cy.get('.blog')
          .eq(2)
          .contains(`${testBlogs[0].title} ${testBlogs[0].author}`);
      });
    });
  });
});
