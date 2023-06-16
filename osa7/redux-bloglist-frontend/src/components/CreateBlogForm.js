import { React, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import blogService from '../services/blogs';
import { appendBlog } from '../reducers/blogsReducer';
import { appendUserBlog } from '../reducers/userListReducer';
import { setNotification } from '../reducers/notificationReducer';

const CreateBlogForm = ({ blogFormRef }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const loggedInUser = useSelector((state) => state.loggedInUser);
  const dispatch = useDispatch();

  const createBlog = async (blogObject) => {
    console.log('creating a new blog:', blogObject);

    blogService.setToken(loggedInUser.token);
    const returnedBlog = await blogService.createBlog(blogObject);

    console.log('posting of a new blog succeeded', returnedBlog);

    dispatch(appendBlog(returnedBlog));
    dispatch(
      appendUserBlog({
        username: loggedInUser.username,
        blog: returnedBlog,
      })
    );
    dispatch(
      setNotification(`a new blog ${returnedBlog.title} added`, 'success')
    );
    blogFormRef.current.toggleVisibility();
  };

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
          <label id="url-label">url</label>{' '}
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
        </button>
        {/* https://docs.cypress.io/guides/references/best-practices#Selecting-Elements */}
      </form>
    </div>
  );
};

export default CreateBlogForm;
