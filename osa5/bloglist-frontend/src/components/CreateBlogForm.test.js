import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateBlogForm from './CreateBlogForm';

describe('<CreateBlogForm />', () => {
  test('Calls callback function with correct data when submit button is pressed', async () => {
    const user = userEvent.setup();
    const mockCreateBlog = jest.fn();

    render(<CreateBlogForm createBlog={mockCreateBlog} />);

    const titleInput = screen.getByLabelText('title');
    const authorInput = screen.getByLabelText('author');
    const urlInput = screen.getByLabelText('url');
    const submitButton = screen.getByText('create');

    await user.type(titleInput, 'Testi-otsikko');
    await user.type(authorInput, 'Testi-kirjoittaja');
    await user.type(urlInput, 'Testi-url');
    await user.click(submitButton);

    expect(mockCreateBlog.mock.calls[0][0].title).toBe('Testi-otsikko');
    expect(mockCreateBlog.mock.calls[0][0].author).toBe('Testi-kirjoittaja');
    expect(mockCreateBlog.mock.calls[0][0].url).toBe('Testi-url');
  });
});
