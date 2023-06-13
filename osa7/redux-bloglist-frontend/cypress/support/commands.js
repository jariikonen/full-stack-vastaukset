// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('resetDatabase', () => {
  cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`);
});

Cypress.Commands.add('addUser', ({ username, name, password }) => {
  cy.request('POST', `${Cypress.env('BACKEND')}/users`, {
    username,
    name,
    password,
  }).then(() => {
    cy.visit('');
  });
});

Cypress.Commands.add('login', (username, password) => {
  cy.request('POST', `${Cypress.env('BACKEND')}/login`, {
    username,
    password,
  }).then((response) => {
    localStorage.setItem('loggedBloglistUser', JSON.stringify(response.body));
    cy.visit('');
  });
});

Cypress.Commands.add('postBlog', (blogObject) => {
  const { token } = JSON.parse(localStorage.getItem('loggedBloglistUser'));
  cy.request({
    method: 'POST',
    url: `${Cypress.env('BACKEND')}/blogs`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`,
    },
    body: blogObject,
  }).then(() => {
    cy.visit('');
  });
});

Cypress.Commands.add('viewBlog', (blogObject) => {
  cy.contains(`${blogObject.title} ${blogObject.author}`)
    .find('button')
    .contains('view')
    .click();
});

Cypress.Commands.add('likeBlog', (blogObject, nth) => {
  cy.contains(`${blogObject.title} ${blogObject.author}`)
    .parent()
    .find('button')
    .contains('like')
    .click();
  cy.contains(`${blogObject.title} ${blogObject.author}`)
    .parent()
    .should('contain', `likes ${nth}`);
});
