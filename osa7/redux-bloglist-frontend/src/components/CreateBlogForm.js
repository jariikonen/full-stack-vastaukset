import { React, useState } from 'react';
import PropTypes from 'prop-types';

const CreateBlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleCreate = (event) => {
    event.preventDefault();
    createBlog({ title, author, url });

    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={handleCreate}>
        <div>
          <label id="title-label">title</label>{' '}
          <input
            aria-labelledby="title-label"
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <label id="author-label">author</label>{' '}
          <input
            aria-labelledby="author-label"
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <label id="url-label">url</label>
          url{' '}
          <input
            aria-labelledby="url-label"
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit" data-cy="submit-blog">
          create
        </button>{' '}
        {/* https://docs.cypress.io/guides/references/best-practices#Selecting-Elements */}
      </form>
    </div>
  );
};

CreateBlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default CreateBlogForm;
