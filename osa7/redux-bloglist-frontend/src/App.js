/* eslint-disable no-console */
import { React, useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import BlogList from './components/BlogList';
import CreateBlogForm from './components/CreateBlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import { setNotification } from './reducers/notificationReducer';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

  const blogFormRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    const loadBlogs = async () => {
      const receivedBlogs = await blogService.getAll();
      receivedBlogs.sort((a, b) => b.likes - a.likes);
      setBlogs(receivedBlogs);
    };
    loadBlogs();
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser');
    if (loggedUserJSON) {
      const usr = JSON.parse(loggedUserJSON);
      setUser(usr);
    }
  }, []);

  const login = async (username, password) => {
    console.log('logging in with', username, password, '...');

    try {
      const usr = await loginService.login({ username, password });
      console.log('login succeeded', usr);

      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(usr));

      setUser(usr);
    } catch (exception) {
      dispatch(
        setNotification('wrong username or password (or both)', 'error')
      );
      console.log('login failed:', exception);
    }
  };

  const handleLogout = async () => {
    console.log(`logging out user '${user.name}' ...`);
    window.localStorage.removeItem('loggedBloglistUser');
    window.location.reload();
  };

  const createBlog = async (blogObject) => {
    console.log('creating a new blog:', blogObject);

    blogService.setToken(user.token);
    const returnedBlog = await blogService.createBlog(blogObject);

    console.log('posting of a new blog succeeded', returnedBlog);

    setBlogs(blogs.concat(returnedBlog));
    dispatch(
      setNotification(`a new blog ${returnedBlog.title} added`, 'success')
    );
    blogFormRef.current.toggleVisibility();
  };

  const likeBlog = async (blogObject) => {
    console.log('liking blog', blogObject);

    blogService.setToken(user.token);
    const returnedBlog = await blogService.updateBlog(blogObject);

    console.log('liking blog succeeded', returnedBlog);

    const blogArray = blogs.map((blog) =>
      blog.id !== returnedBlog.id ? blog : returnedBlog
    );
    blogArray.sort((a, b) => b.likes - a.likes);
    setBlogs(blogArray);
  };

  const removeBlog = async (blogObject) => {
    console.log('removing blog', blogObject.id);

    // eslint-disable-next-line no-alert
    const confirmation = window.confirm(`Remove blog ${blogObject.title}?`);

    if (confirmation) {
      blogService.setToken(user.token);
      await blogService.deleteBlog(blogObject.id);

      console.log(`removing of blog ${blogObject.id} succeeded`);

      setBlogs(blogs.filter((blog) => blog.id !== blogObject.id));
    } else {
      console.log(`removing of blog ${blogObject.id} was cancelled`);
    }
  };

  return (
    <div>
      {!user ? (
        <div>
          <h2>log in to application</h2>
          <Notification />
          <LoginForm login={login} />
        </div>
      ) : (
        <div>
          <h2>blogs</h2>
          <Notification />
          <p>
            logged in as {user.name}{' '}
            <button type="button" onClick={handleLogout}>
              logout
            </button>
          </p>

          <Togglable buttonLabel="create blog" ref={blogFormRef}>
            <CreateBlogForm createBlog={createBlog} />
          </Togglable>
          <BlogList
            blogs={blogs}
            likeBlog={likeBlog}
            removeBlog={removeBlog}
            user={user}
          />
        </div>
      )}
    </div>
  );
};

export default App;
