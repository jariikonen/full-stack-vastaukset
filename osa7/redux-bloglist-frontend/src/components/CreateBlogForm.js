import { React, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FormControl from '@mui/material/FormControl/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
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
    <>
      <h3>Create new blog</h3>
      <form id="create-blog-form" onSubmit={handleCreate}>
        <FormControl size="small" fullWidth sx={{ mb: 0.5 }}>
          <InputLabel
            htmlFor="title-input"
            id="title-label"
            sx={{ backgroundColor: 'white', px: 1, pt: 0.5 }}
          >
            Title
          </InputLabel>
          <OutlinedInput
            id="title-input"
            aria-labelledby="title-label"
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
            sx={{ mt: 0.5, py: 0 }}
          />
        </FormControl>
        <FormControl size="small" fullWidth sx={{ mb: 0.5 }}>
          <InputLabel
            htmlFor="author-input"
            id="author-label"
            sx={{ backgroundColor: 'white', px: 1, pt: 0.5 }}
          >
            Author
          </InputLabel>
          <OutlinedInput
            id="author-input"
            aria-labelledby="author-label"
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
            sx={{ mt: 0.5, py: 0 }}
          />
        </FormControl>
        <FormControl size="small" fullWidth sx={{ mb: 0.5 }}>
          <InputLabel
            htmlFor="url-input"
            id="url-label"
            sx={{ backgroundColor: 'white', px: 1, pt: 0.5 }}
          >
            Url
          </InputLabel>
          <OutlinedInput
            id="url-input"
            aria-labelledby="url-label"
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
            sx={{ mt: 0.5, py: 0 }}
          />
        </FormControl>
      </form>
      <Button
        type="submit"
        form="create-blog-form"
        data-cy="submit-blog"
        size="small"
        variant="contained"
        sx={{ mt: 0.5, mb: 2, mr: 1 }}
      >
        create
      </Button>
    </>
  );
};

export default CreateBlogForm;
