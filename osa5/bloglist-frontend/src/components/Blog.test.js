import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('<Blog />', () => {
  const blog = {
    author: 'Blogin kirjoittaja',
    id: 'blog-id',
    likes: 0,
    title: 'Blogin otsikko',
    url: 'http://verkko-osoite.pom',
    user: {
      username: 'kayttaja',
      name: 'Kalle Kayttaja',
      id: 'blog-user-id',
    },
  };

  const blogUser = {
    name: 'Kalle Kayttaja',
    token: 'user-token',
    username: 'kayttaja',
  };

  const mockLikeHandler = jest.fn();
  const mockRemoveHandler = jest.fn();

  beforeEach(() => {
    render(
      <Blog
        blog={blog}
        likeBlog={mockLikeHandler}
        removeBlog={mockRemoveHandler}
        user={blogUser}
      />,
    );
  });

  test('renders title and author but not likes or url', () => {
    screen.getByText(`${blog.title} ${blog.author}`);

    const likesElement = screen.queryByText(`likes ${blog.likes}`);
    expect(likesElement).toBeNull();

    const urlElement = screen.queryByText(blog.url);
    expect(urlElement).toBeNull();
  });

  test('renders also likes, url and username after the view button has been clicked', async () => {
    const user = userEvent.setup();
    const button = screen.getByText('view');
    await user.click(button);

    screen.getByText(`likes ${blog.likes}`);
    screen.getByText(blog.url);
    screen.getByText(blogUser.name);
  });
});
