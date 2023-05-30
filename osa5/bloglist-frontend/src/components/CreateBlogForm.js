/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import React from 'react';

const AddBlogForm = ({
  title,
  author,
  url,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
  handleCreate,
}) => (
  <div>
    <h3>create new</h3>
    <form onSubmit={handleCreate}>
      <div>
        title
        {' '}
        <input
          type="text"
          value={title}
          name="Title"
          onChange={handleTitleChange}
        />
      </div>
      <div>
        author
        {' '}
        <input
          type="text"
          value={author}
          name="Author"
          onChange={handleAuthorChange}
        />
      </div>
      <div>
        url
        {' '}
        <input
          type="text"
          value={url}
          name="Url"
          onChange={handleUrlChange}
        />
      </div>
      <button type="submit">create</button>
    </form>
  </div>
);

export default AddBlogForm;
