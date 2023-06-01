import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import Blog from './Blog';

test('renders title and author but not likes or url', () => {
  const blog = {
    author: 'Blogin kirjoittaja',
    id: 'merkkijono',
    likes: 0,
    title: 'Blogin otsikko',
    url: 'http://verkko-osoite.pom',
    user: {
      username: 'kayttaja',
      name: 'Kalle Kayttaja',
      id: 'merkkijono',
    },
  };

  const user = {
    name: 'Kalle Kayttaja',
    token: 'merkkijono',
    username: 'kayttaja',
  };

  const mockLikeHandler = jest.fn();
  const mockRemoveHandler = jest.fn();

  render(
    <Blog
      blog={blog}
      likeBlog={mockLikeHandler}
      removeBlog={mockRemoveHandler}
      user={user}
    />,
  );

  screen.getByText('Blogin otsikko Blogin kirjoittaja');

  const likesElement = screen.queryByText('likes 0');
  expect(likesElement).toBeNull();

  const urlElement = screen.queryByText(blog.url);
  expect(urlElement).toBeNull();
});
